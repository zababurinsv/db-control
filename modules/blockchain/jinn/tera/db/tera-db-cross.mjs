import cdbList from "../../src/db/jinn-db-list.mjs"
/*
 * @project: JINN
 * @version: 1.0
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2020 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

"use strict";
import logs from '../../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    const main = -7
    const path = import.meta.url
    const from = path.search('/blockchain');
    const to = path.length;
    const url = path.substring(from,to);
    const count = (typeof maxCount === "string") ? parseInt(maxCount,10): (maxCount < 0)? main: maxCount
    logs.assert(count, url, id, props, data, ...args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)
    let CDBList = cdbList(global)
    global.FORMAT_CROSS_MSG = {BlockNumFrom:"uint32", TxNumFrom:"uint16", ShardFrom:global.SHARD_STR_TYPE, AccountFrom:"uint32", Iteration:"byte",
        Mode:"byte", ShardTo:global.SHARD_STR_TYPE, AccountTo:"uint32", MethodName:"str", Params:"str", ParamsArr:"tr", Confirms:"uint32",
        Reserve:"arr6", };

    const HEAD_FORMAT = {LastPos:"uint", ShardName:global.SHARD_STR_TYPE, Confirms:"uint32", ChannelName:"str20", BlockNumCreate:"uint32",
        Work:"byte", CheckTime:"uint", Reserve:"arr51"};

    const DATA_FORMAT = {PrevPos:"uint", BlockNum:"uint32", Reserve:"uint32", RowNum:"uint", RowHash:"hash", Msg:global.FORMAT_CROSS_MSG,
    };
    const WorkStructBody = {};
    global.CalcCrossRowItem = function (Item,PrevRowNum,PrevHash) {
        Item.BlockNum = 0;

        Item.PrevPos = 0;
        Item.RowNum = PrevRowNum + 1;
        Item.RowHash = PrevHash;

        var Arr = global.SerializeLib.GetBufferFromObject(Item, DATA_FORMAT, WorkStructBody);
        Item.RowHash = sha3(Arr);
    }
    global.CDBCrossTx = class CDBCrossTx {
        constructor(name, AddDataFormat, bReadOnly) {
            var DATA_FORMAT1 = global.CopyObjKeys({}, DATA_FORMAT);
            var DATA_FORMAT2 = global.CopyObjKeys(DATA_FORMAT1, AddDataFormat);

            this.DB = new CDBList(name, HEAD_FORMAT, DATA_FORMAT2, bReadOnly)
        }

        Clear()
        {
            this.DB.Clear()
        }

        Close()
        {
            this.DB.Close()
        }

        WriteInit(Item, BlockNumCreate)
        {
            var Head = {Num:Item.Num, ShardName:Item.ShardName, Confirms:Item.Confirms, ChannelName:Item.ChannelName, Work:Item.Work, LastPos:0,
                BlockNumCreate:BlockNumCreate};
            return this.DB.DBHeader.Write(Head);
        }

        WriteHead(Head)
        {
            return this.DB.DBHeader.Write(Head);
        }

        Write(ShardName, Item, BlockNum, bRecalcHash)
        {
            var Head = this.FindChannel(ShardName);
            if(!Head)
                return 0;
            var PrevItem = this.Read(Head.Num);
            if(!PrevItem)
            {
                PrevItem = {RowNum:0, RowHash: global.ZERO_ARR_32}
            }

            if(bRecalcHash)
                CalcCrossRowItem(Item, PrevItem.RowNum, PrevItem.RowHash)

            Item.BlockNum = BlockNum

            return this.DB.Write(Head.Num, Item);
        }

        ReadHead(Num)
        {
            return this.DB.ReadHead(Num);
        }

        Read(Num)
        {
            return this.DB.Read(Num);
        }
        ReadPrevItem(Item)
        {
            return this.DB.ReadPrevItem(Item);
        }
        ReadBodyToItem(Item, Position)
        {
            return this.DB.ReadBodyToItem(Item, Position);
        }

        SetLastPos(Num, LastPos)
        {
            return this.DB.SetLastPos(Num, LastPos);
        }

        DeleteFromBlock(BlockNum)
        {
            return this.DB.DeleteFromBlock(BlockNum, "BlockNumCreate");
        }

        GetMaxNum()
        {
            return this.DB.GetMaxNum();
        }

        GetMaxRowIteration(ShardNum)
        {
            var Item = this.Read(ShardNum);
            if(!Item)
                return {RowNum:0, RowHash: global.ZERO_ARR_32, CheckTime:0};
            else
                return Item;
        }
        RegisterTrDB(JournalNum)
        {
            global.REGISTER_TR_DB(this.DB.DBHeader, JournalNum)
            global.REGISTER_TR_DB(this.DB.DBBody, JournalNum + 1)
        }
        FindChannel(ChannelName)
        {
            for(var num = 0; true; num++)
            {
                var Data = this.ReadHead(num);
                if(!Data)
                    break;

                if(ChannelName === Data.ChannelName)
                    return Data;
            }
            return undefined;
        }
        FindItemByHash(Num, RowHash, MaxFindCount)
        {
            var Item = this.Read(Num);
            while(Item && MaxFindCount > 0)
            {
                if(global.IsEqArr(Item.RowHash, RowHash))
                    return Item;

                Item = this.ReadPrevItem(Item)

                MaxFindCount--
            }
            return undefined;
        }

        GetScrollList(Num, Count, StartPos, Arr)
        {
            return this.DB.GetScrollList(Num, Count, StartPos, Arr);
        }
    };
    return  global.CDBCrossTx
}
