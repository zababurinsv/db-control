/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/


'use strict';
import logs from '../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    let path = import.meta.url
    let from = path.search('/jinn');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-12, url, id, props, data, ...args)
}
export default (global) => {
debug(-2, '[(self)a]', global.PROCESS_NAME)

    function Init(Engine)
    {

        Engine.GetTxSenderNum = function (Tx,BlockNum)
        {

            let type = Tx.body[0];
            let App = global.DAppByType[type];
            let Ret;
            if(App)
                Ret = App.GetSenderNum(BlockNum, Tx.body);
            else
                Ret = 0;
            return Ret;
        };

        Engine.GetTxSenderOperationID = function (Tx,BlockNum)
        {
            let OperationID;
            let type = Tx.body[0];
            let App = global.DAppByType[type];
            if(App)
                OperationID = App.GetSenderOperationID(BlockNum, Tx.body);
            else
                OperationID = 0;
            return OperationID;
        };

        Engine.GetAccountBaseValue = function (AccNum,BlockNum)
        {
            if(!AccNum)
                return 0;

            let Value = ACCOUNTS.GetPrevAccountValue(AccNum, BlockNum);
            if(Value)
            {
                return Value.SumCOIN * 1e9 + Value.SumCENT;
            }
            else
            {
                return 0;
            }
        };

        Engine.GetAccountOperationID = function (SenderNum,BlockNum)
        {
            if(!SenderNum)
                return 0;

            let AccData = ACCOUNTS.ReadState(SenderNum);
            if(AccData)
                return AccData.Value.OperationID;
            else
                return 0;
        };

        Engine.CheckSignTx = function (Tx,BlockNum)
        {
            let type = Tx.body[0];
            let App = global.DAppByType[type];
            if(App)
                return App.CheckSignTransferTx(BlockNum, Tx.body);
            else
                return 0;
        };

        global.ON_USE_CONST = function ()
        {
            global.JINN_WARNING =  + global.LOG_LEVEL;

            if(global.WEB_PROCESS)
                global.WEB_PROCESS.UpdateConst = 1;

            if(global.COMMON_KEY && Engine.OnSeNodeName)
                Engine.OnSeNodeName();
            else
            {
                Engine.ArrCommonSecret = [];
                Engine.ArrNodeName = [];
            }
        };
        global.SERVER.DO_CONSTANT = function ()
        {
            global.ON_USE_CONST();
        };
        Engine.ChildIDCounter = 10000;
        Engine.SetChildID = function (Child)
        {
            Engine.ChildIDCounter++;
            Child.ID = Engine.ChildIDCounter;
        };
        Engine.SetChildRndHash = function (Child,RndHash)
        {
            Child.RndHash = RndHash;
            Child.ArrCommonSecret = global.sha3(global.COMMON_KEY + ":" + global.GetHexFromArr(RndHash));
        };
        Engine.SetChildName = function (Child,NameArr)
        {
            let Str = Engine.ValueFromEncrypt(Child, NameArr);
            if(Str.substr(0, 8) === "CLUSTER:")
            {
                Child.IsCluster = 1;
                Child.Name = Str.substr(8);
                if(Child.AddrItem && Child.AddrItem.Score < 5 * 1e6)
                    Child.AddrItem.Score = 10 * 1e6;
            }
            else
            {
                Child.IsCluster = 0;
                Child.Name = "";
            }
        };

        Engine.OnSeNodeName = function ()
        {
            let Name = global.NODES_NAME;
            if(!Name)
            {
                if(Engine.ip === "0.0.0.0")
                    Name = "-";
                else
                    Name = Engine.ip;
            }
            Engine.ArrCommonSecret = global.sha3(global.COMMON_KEY + ":" + Engine.RndHashStr);
            Engine.ArrNodeName = Engine.ValueToEncrypt("CLUSTER:" + Name, 40);
        };

        global.SERVER.GetNodesArrWithAlive = function () {
            let Arr = [];
            let it = Engine.NodesTree.iterator(), Item;
            while((Item = it.next()) !== null)
            {
                let Power = Engine.GetAddrPower(Item.AddrHashPOW, Item.BlockNum);
                if(Item.System)
                    Power += global.MIN_POW_ADDRES;
                if(Power > 0)
                {
                    Arr.push({ip:Item.ip, port:Item.ip, portweb:Item.portweb});
                }
            }
            return Arr;
        };
        global.SERVER.ConnectToAll = function () {
            debug(-4, '{(SERVER.ConnectToAll*)SendConnectReq}')
            let Count = 0;

            let Map = {};
            for(let i = 0; i < Engine.ConnectArray.length; i++) {
                let Child = Engine.ConnectArray[i];
                if(Child) {
                    Map[Child.ID] = 1;
                }
            }

            let it = Engine.NodesTree.iterator(), AddrItem;
            while((AddrItem = it.next()) !== null) {
                if(Map[AddrItem.ID]) {
                    continue;
                }

                Engine.InitAddrItem(AddrItem);

                let Power = Engine.GetAddrPower(AddrItem.AddrHashPOW, AddrItem.BlockNum);
                if(AddrItem.System || global.MODELING) {
                    Power += global.MIN_POW_ADDRES;
                }

                if(Power < global.MIN_POW_ADDRES / 2) {
                    continue;
                }


                let Child = Engine.RetNewConnectByAddr(AddrItem);

                if(Engine.SendConnectReq(Child)) (
                  Count++
                )
            }
            let Str = "Connect to " + Count + " nodes";
            global.ToLog(Str);
            return Str;
        };

        Object.defineProperty(global.SERVER, "ip", {get:function ()
            {
                return Engine.ip;
            }});
        Object.defineProperty(global.SERVER, "port", {get:function ()
            {
                return Engine.port;
            }});
        Engine.OnSetTimeDelta = function (DeltaTime)
        {
            global.SAVE_CONST(0);
        };
        Engine.OnSetOwnIP = function (ip)
        {
            global.JINN_IP = ip;
            global.SAVE_CONST(1);
        };
    }
    return {
        init:Init
    };
}