/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/


"use strict";
import cdbCrossTx from "./db/tera-db-cross.mjs"
import logs from '../../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
export default(global) => {
    debug('[(self)a]', global.PROCESS_NAME)
    let CDBCrossTx = cdbCrossTx(global)
    const DEBUG_CROSS = 0;

    global.ITEM_LIST_DEPTH = 10000;
    const ITEM_LIST_COUNT = 1000;
    var LIST_DEPTH_START = 5;
    if(global.LOCAL_RUN)
        LIST_DEPTH_START = 0;

    var START_TIME_DELTA = 30;
    if(global.LOCAL_RUN)
        START_TIME_DELTA = 5;

    const MAX_DELTA_TIME_CROSS_EXCHANGE = 10;

    function Init(Engine)
    {

        var bReadOnly = (global.PROCESS_NAME !== "MAIN");
        global.SERVER.CrossReceive = new CDBCrossTx("cross-receive", {Receive:"str10"}, bReadOnly);
        global.SERVER.CrossReceive.Ready = 100;

        global.SERVER.StartTeraShardingRun = Date.now();

        Engine.CROSSMSG_RET = {Reserve:"uint", result:"byte", ChannelArr:[{ChannelName:"str20", result:"byte", MaxRowNum:"uint", Arr:[{BlockNum:"uint32",
                    RowNum:"uint", RowHash:"hash", Msg:global.FORMAT_CROSS_MSG}], CheckTime:"uint", Reserve:"arr10", }], };

        Engine.IsReadyCrossReceive = function (Num)
        {
            var Head = global.SERVER.CrossReceive.ReadHead(Num);
            if(!Head || !Head.CheckTime)
                return  - 1;
            var Delta = global.GetCurrentTime() - Head.CheckTime;
            if(Delta > MAX_DELTA_TIME_CROSS_EXCHANGE * 1000)
                return 0;
            else
                return 1;
        };

        Engine.GetCrossStatusForSend = function (Child)
        {
            Engine.CheckCrossReceiveSize();

            var Arr = [];
            var MaxNum = global.SERVER.CrossReceive.GetMaxNum();
            for(var Num = 0; Num <= MaxNum; Num++)
            {
                var Item = global.SERVER.CrossReceive.ReadHead(Num);
                if(!Item)
                {
                    ToLog("Error read shard num=" + Num, 3);
                    continue;
                }
                if(Item.ShardName === global.SHARD_NAME)
                    continue;

                if(!Item.LastPos || !global.SERVER.CrossReceive.ReadBodyToItem(Item, Item.LastPos))
                {
                    Item.RowNum = 0;
                    Item.RowHash = global.ZERO_ARR_32;
                }

                Arr.push(Item);
            }

            return {ChannelArr:Arr};
        };

        Engine.DoCrossMsgOnReceive = function (Child,Data)
        {
            DEBUG_CROSS && ToLog(JSON.stringify(Data));

            if(Data.result === 100)
            {
                if(Data.ChannelArr.length > 0 || global.SERVER.CrossReceive.Ready !== 100)
                    global.SERVER.CrossReceive.Ready = 0;
                return;
            }

            for(var i = 0; i < Data.ChannelArr.length; i++) {
                var Channel = Data.ChannelArr[i];
                var ChannelName = GetChannelName(Child, Channel.ChannelName);
                var ShardItem = global.SHARDS.FindChannel(ChannelName);
                if(!ShardItem)
                    continue;

                Engine.DoCrossMsgItem(ShardItem, Channel, Child);
            }
        };

        Engine.DoCrossMsgItem = function (ShardItem,Ret,Child)
        {
            var MaxItem = global.SERVER.CrossReceive.GetMaxRowIteration(ShardItem.Num);
            var Head = global.SERVER.CrossReceive.ReadHead(ShardItem.Num);
            if(Head && Head.CheckTime > Ret.CheckTime)
            {
                return;
            }
            Head.CheckTime = Ret.CheckTime;
            global.SERVER.CrossReceive.WriteHead(Head);
            ShardItem.CheckTime = Ret.CheckTime;

            if(Ret.result)
            {
                if(Ret.result === 2)
                {
                    DEBUG_CROSS && ToLog("WriteInit " + ShardItem.Num + "." + ShardItem.ChannelName);
                    global.SERVER.CrossReceive.WriteInit(ShardItem, 0);

                    MaxItem.RowNum = 0;
                }
                else
                {
                    Engine.DeleteCrossMsg(ShardItem, Ret.MaxRowNum);
                    MaxItem = global.SERVER.CrossReceive.GetMaxRowIteration(ShardItem.Num);
                }

                var LastRowNum = MaxItem.RowNum;
                for(var i = 0; i < Ret.Arr.length; i++)
                {
                    var Item = Ret.Arr[i];
                    if(Item.RowNum > MaxItem.RowNum)
                    {
                        DEBUG_CROSS && ToLog("Write RowNum=" + Item.RowNum);
                        delete Item.Position;

                        var RecalcHash;
                        if(Ret.result === 2 && i === 0)
                            RecalcHash = 0;
                        else
                            RecalcHash = 1;

                        Item.Receive = Child.Name;
                        global.SERVER.CrossReceive.Write(ShardItem.ChannelName, Item, Engine.CurrentBlockNum, RecalcHash);

                        LastRowNum = Item.RowNum;
                    }
                }
                global.SERVER.CrossReceive.Ready = (LastRowNum === Ret.MaxRowNum ? 1 : 0);
            }
            else
            if(Ret.MaxRowNum > 0)
            {
                global.SERVER.CrossReceive.Ready = 0;
                if(Ret.MaxRowNum < MaxItem.RowNum)
                    MaxItem.RowNum = Ret.MaxRowNum;
                else
                    MaxItem.RowNum -= ITEM_LIST_COUNT;
                if(MaxItem.RowNum < 0)
                    MaxItem.RowNum = 0;
                Engine.DeleteCrossMsg(ShardItem, MaxItem.RowNum);
            }
        };

        Engine.DeleteCrossMsg = function (ShardItem,MaxRowNum)
        {
            var ShardNum = ShardItem.Num;
            var LastItem = undefined;
            var Item = global.SERVER.CrossReceive.Read(ShardNum);
            var MaxItem = Item;
            if(!MaxItem || MaxItem.RowNum <= MaxRowNum)
                return;
            while(Item && Item.RowNum >= MaxRowNum)
            {
                LastItem = Item;

                Item = global.SERVER.CrossReceive.ReadPrevItem(Item);
            }

            if(LastItem && LastItem.RowNum !== MaxItem.RowNum)
            {
                if(MaxRowNum < LastItem.RowNum)
                {
                    DEBUG_CROSS && ToLog("Init");
                    global.SERVER.CrossReceive.WriteInit(ShardItem, 0);
                }
                else
                {
                    DEBUG_CROSS && ToLog("Set last pos on " + LastItem.RowNum + "/" + MaxItem.RowNum + " Need=" + MaxRowNum);
                    global.SERVER.CrossReceive.SetLastPos(ShardNum, LastItem.Position);
                }
            }
        };

        Engine.PrepareResultCrossMsg = function (Child,Data)
        {

            global.SERVER.RefreshAllDB();
            if(global.SERVER.GetTXDelta() > 10)
                return {result:100, text:"Busy", ChannelArr:[]};

            var Arr = [];
            var DBTable;
            for(var i = 0; i < Data.ChannelArr.length; i++)
            {
                var Channel = Data.ChannelArr[i];
                var ChannelName = GetChannelName(Child, Channel.ChannelName);
                var ShardItem = global.SHARDS.FindChannel(ChannelName);
                if(!ShardItem)
                    continue;

                var CheckTime = 0;
                if(Child.ShardName === JINN_CONST.SHARD_NAME)
                {
                    DBTable = global.SERVER.CrossReceive;
                    var Head = global.SERVER.CrossReceive.ReadHead(ShardItem.Num);
                    if(Head && Head.CheckTime)
                        CheckTime = Head.CheckTime;
                }
                else
                {
                    DBTable = global.SHARDS.CrossSend;
                    CheckTime = global.GetCurrentTime();
                }

                var Item = DBTable.Read(ShardItem.Num);
                var ResItem;
                if(!Item)
                {
                    ResItem = {result:0, MaxRowNum:0, Arr:[]};
                }
                else
                {
                    ResItem = Engine.PrepareResultCrossItem(DBTable, Item, Channel.RowNum, Channel.RowHash);
                }
                ResItem.CheckTime = CheckTime;

                ResItem.ChannelName = Channel.ChannelName;
                Arr.push(ResItem);
            }

            return {result:1, ChannelArr:Arr};
        };

        Engine.PrepareResultCrossItem = function (DBTable,Item,RowNum,RowHash)
        {

            var MaxRowNum = Item.RowNum;

            if(MaxRowNum < RowNum)
            {
                return {result:1, MaxRowNum:MaxRowNum, Arr:[]};
            }
            var Arr = [];
            var Count = ITEM_LIST_DEPTH;
            while(Item && Item.RowNum >= RowNum && Count > 0)
            {
                Count--;

                if(Item.RowNum === RowNum)
                {
                    if(global.IsEqArr(Item.RowHash, RowHash))
                    {
                        Arr.length = Math.min(ITEM_LIST_COUNT, Arr.length);
                        return {result:1, MaxRowNum:MaxRowNum, Count:Arr.length, Arr:Arr};
                    }
                    else
                    {
                        return {result:0, MaxRowNum:MaxRowNum, Arr:[]};
                    }
                }

                if(Item.BlockNum <= Engine.CurrentBlockNum - LIST_DEPTH_START)
                    Arr.unshift(Item);

                Item = DBTable.ReadPrevItem(Item);
            }

            Arr.length = Math.min(ITEM_LIST_COUNT, Arr.length);
            return {result:2, MaxRowNum:MaxRowNum, Count:Arr.length, Arr:Arr};
        };
        Engine.CheckCrossReceiveSize = function () {
            var MaxNum1 = global.SERVER.CrossReceive.GetMaxNum();
            var MaxNum2 = global.SHARDS.DBChannel.GetMaxNum();
            for(var Num = MaxNum1 + 1; Num <= MaxNum2; Num++)
            {
                var Item = global.SHARDS.DBChannel.Read(Num);
                if(Item)
                {
                    global.SERVER.CrossReceive.WriteInit(Item, Item.BlockNum);
                }
            }
        };
        Engine.InitCrossReceive = function ()
        {
            if(bReadOnly)
                return;

            if(global.SERVER.CrossReceive.GetMaxNum() >= 0)
                global.SERVER.CrossReceive.Clear();
            Engine.CheckCrossReceiveSize();
        };
        Engine.InitCrossReceive();
    }

    function GetChannelName(Child,ChannelName)
    {
        var Index = ChannelName.indexOf(":");
        var ShardName = ChannelName.substr(0, Index);
        var ConfirmsStr = ChannelName.substr(Index);

        if(ShardName === global.SHARD_NAME || ShardName === Child.ShardName)
            ChannelName = Child.ShardName + ConfirmsStr;

        return ChannelName;
    }


    return {
        init:Init
    };
}