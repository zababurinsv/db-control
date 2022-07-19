/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

'use strict';


// const os = require('os');

import logs from '../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    const main = -13
    const path = import.meta.url
    const from = path.search('/blockchain');
    const to = path.length;
    const url = path.substring(from,to);
    const count = (typeof maxCount === "string") ? parseInt(maxCount,10): (maxCount < 0)? main: maxCount
    // logs.assert(count, url, id, props, data, ...args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)
    const os = global.os
    const process = global.process

    let GlSumUser;
    let GlSumSys;
    let GlSumIdle;

    let PrevSumPow = 0;
    function Init(Engine)
    {

        global.SERVER.GetActualNodes = function () {
            debug(-3, '⛺ [(GetActualNodes*)]')
            let Arr = [];
            if(!Engine.ConnectArray) {
                return Arr;
            }

            for(let i = 0; i < Engine.ConnectArray.length; i++) {
                let Child = Engine.ConnectArray[i];
                if(!Child || !Child.IsOpen()) {
                    continue;
                }
                debug(-3, '⛺ [(GetActualNodes*) Child]', Child.ip)
                Arr.push(Child);
            }

            return Arr;
        };

        global.SERVER.GetHotNodesCount = function () {
            let Count = 0;
            for(let i = 0; i < Engine.ConnectArray.length; i++) {
                let Child = Engine.ConnectArray[i];
                if(!Child || !Child.IsHot()) {
                    continue;
                }

                Count++;
            }

            return Count;
        };

        Engine.GetNodesArr = function () {
            debug(-3, '⛺ [(GetNodesArr*)a]')
            let Arr = [];
            let it = Engine.NodesTree.iterator(), Item;
            while((Item = it.next()) !== null) {
                Arr.push(Item);
            }
            return Arr;
        };

        function GetNodesArr() {
            let Arr = [];
            let it = Engine.NodesTree.iterator(), Item;
            while((Item = it.next()) !== null)
            {
                Arr.push("" + Item.ip + ":" + Item.port + " pow=" + Engine.GetAddrPowerFomItem(Item));
            }
            return Arr;
        };

        function AddNodeToArr(MapSet,Arr,Node) {
            if(MapSet.has(Node)) {
                return;
            }

            MapSet.add(Node);

            if(!Node.IDStr) {
                Node.IDArr = global.CalcIDArr(Node.ip, Node.port);
                Node.IDStr = global.GetHexFromArr(Node.IDArr);
                Node.Level = Engine.AddrLevelArr(Engine.IDArr, Node.IDArr, 1);
            }

            if(global.IsEqArr(Engine.IDArr, Node.IDArr)) {
                return;
            }

            let Item = GetJinnNode(Node, 1);

            let ArrLevel = Arr[Item.Level];
            if(!ArrLevel)
            {
                ArrLevel = [];
                Arr[Item.Level] = ArrLevel;
            }

            ArrLevel.push(Item);
        };

        function GetJinnNode(Node,bSimple) {
            debug(-3, '⛺ [(GetJinnNode*)bSimple]', bSimple, Node)
            let IsOpen, IsHot, CanHot = 0;
            if(Node.IsOpen) {
                IsOpen = Node.IsOpen();
            }

            if(Node.IsHot)
                IsHot = Node.IsHot();
            if(Engine.CanSetHot(Node) > 0)
                CanHot = 1;

            let AddrItem = Node.AddrItem;
            if(!AddrItem)
                AddrItem = {Score:Node.Score};

            let Item = {ID:Node.ID, id:Node.ID, ip:Node.ip, port:Node.port, Active:IsOpen, CanHot:CanHot, Hot:IsHot, IsCluster:Node.IsCluster,
                Cross:Node.Cross, Level:Node.Level, BlockProcessCount:AddrItem.Score, TransferCount:Node.TransferCount, DeltaTime:Node.RetDeltaTime,
                Debug:Node.Debug, Name:Node.Name, CurrentShard:Node.ShardName === global.SHARD_NAME ? 1 : 0};

            if(bSimple)
            {
                return Item;
            }

            let Item2 = {VersionNum:Node.CodeVersionNum, NetConstVer:Node.NetConstVer, addrStr:Node.IDStr, LastTimeTransfer:(Node.LastTransferTime ? Node.LastTransferTime : 0),
                DeltaTime:Node.RetDeltaTime, LogInfo:Engine.GetLogNetInfo(Node), ErrCountAll:Node.ErrCount, WasBan:Engine.WasBanItem(Node),
                SocketStatus:Engine.GetSocketStatus(Node), Name:Node.Name, };

            CopyPrimitiveValues(Item, Item2);
            CopyPrimitiveValues(Item, Node);

            if(Node.AddrItem)
            {
                Item.ADDR_ITEM = {};
                CopyPrimitiveValues(Item.ADDR_ITEM, Node.AddrItem);

                Item.ADDR_ITEM.AddrPower = Engine.GetAddrPower(Node.AddrItem.AddrHashPOW, Node.AddrItem.BlockNum);
            }
            else
            if(Node.AddrHashPOW)
            {
                Item.AddrPower = Engine.GetAddrPower(Node.AddrHashPOW, Node.BlockNum);
            }

            if(Node.HotItem)
            {
                Item.HOT_ITEM = {};
                CopyPrimitiveValues(Item.HOT_ITEM, Node.HotItem);
            }

            Item.INFO = Node.INFO_DATA;
            Item.STATS = Node.STAT_DATA;

            return Item;
        };

        global.GetJinnNode = GetJinnNode;

        function CopyPrimitiveValues(Dst,Src)
        {
            for(let Key in Src)
            {
                let Value = Src[Key];
                let Type = typeof Value;
                if(Type === "string" || Type === "number" || Type === "boolean")
                    Dst[Key] = Value;
            }
        };
        global.SERVER.GetTransferTree = function ()
        {
            let MapSet = new Set();
            let ArrRes = [];
            let ArrLevels = Engine.GetTransferArrByLevel(3, 1);
            for(let L = 0; L < ArrLevels.length; L++)
            {
                let LevelData = ArrLevels[L];

                if(LevelData.HotChild)
                    AddNodeToArr(MapSet, ArrRes, LevelData.HotChild);
                if(LevelData.CrossChild)
                    AddNodeToArr(MapSet, ArrRes, LevelData.CrossChild);

                for(let i = 0; i < LevelData.Connect.length; i++)
                {
                    AddNodeToArr(MapSet, ArrRes, LevelData.Connect[i]);
                }

                for(let i = 0; i < LevelData.NotConnect.length; i++)
                {
                    AddNodeToArr(MapSet, ArrRes, LevelData.NotConnect[i]);
                }
            }

            return ArrRes;
        };

        global.SERVER.NetClearChildLog = function (ID,bSet)
        {
            let Child = global.SERVER.FindNodeByID(ID);
            if(!Child)
                return "CHILD NOT FOUND";
            Engine.ClearLogNetBuf(Child);

            return "OK log clear for " + ID;
        };

        global.SERVER.NetSetDebug = function (ID,bSet)
        {
            let Child = global.SERVER.FindNodeByID(ID);
            if(!Child)
                return "CHILD NOT FOUND";
            Child.Debug = bSet;

            return "SET Debug=" + bSet + " for " + ID;
        };

        global.SERVER.NetAddConnect = function (ID) {
            debug(-2, '[(NetAddConnect*)ID, SendConnectReq]', ID)
            let Child = global.SERVER.FindNodeByID(ID);
            if(!Child) {
                return "CHILD NOT FOUND";
            }

            Child.SendHotConnectPeriod = 1000;

            let Child2 = Engine.RetNewConnectByAddr(Child);
            if(!Child2) {
                return "#1 NO AddConnect";
            }

            Child2.ToLogNet("=MANUAL CONNECT=");

            if(Engine.SendConnectReq(Child2)) {
                return "OK AddConnect: " + ID;
            } else {
                return "#2 NO AddConnect";
            }
        };

        global.SERVER.NetAddBan = function (ID)
        {
            let Child = global.SERVER.FindNodeByID(ID);
            if(!Child)
                return "CHILD NOT FOUND";

            Child.ToLogNet("=MANUAL BAN=");

            Engine.AddToBan(Child, "=BAN=");
            return "OK AddBan: " + ID;
        };

        global.SERVER.NetAddHot = function (ID)
        {
            let Child = global.SERVER.FindNodeByID(ID);
            if(!Child)
                return "CHILD NOT FOUND";

            Child.ToLogNet("=MANUAL ADD HOT=");

            let WasChild = Engine.LevelArr[Child.Level];
            if(WasChild)
            {
                Engine.DenyHotConnection(WasChild, 1);
            }

            if(Engine.TryHotConnection(Child, 1))
                return "OK AddHot: " + ID;
            else
                return "NOT AddHot";
        };

        global.SERVER.NetDeleteNode = function (ID)
        {
            let Child = global.SERVER.FindNodeByID(ID);
            if(!Child)
                return "CHILD NOT FOUND";

            Child.ToLogNet("=MANUAL DELETE=");

            Engine.DenyHotConnection(Child, 1);
            return "OK DeleteNode: " + ID;
        };

        global.SERVER.FindNodeByID = function (ID)
        {
            for(let i = 0; i < Engine.ConnectArray.length; i++)
            {
                let Child = Engine.ConnectArray[i];
                if(Child && Child.ID === ID)
                    return Child;
            }

            let it = Engine.NodesTree.iterator(), Item;
            while((Item = it.next()) !== null)
            {
                if(Item.ID === ID)
                    return Item;
            }

            return undefined;
        };

        Engine.StatSecondNum = Date.now();
        Engine.OnStatSecond = function ()
        {
            if(!Engine.GetCountAddr)
                return;
            if(!global.SERVER.GetMaxNumBlockDB)
                return;

            global.SERVER.CurrentBlockNum = Engine.CurrentBlockNum;

            let StatNum = Math.floor(Engine.TickNum / 10);
            if(Engine.TeraLastStatNum === StatNum)
                return;
            Engine.TeraLastStatNum = StatNum;

            let DeltaStat = Date.now() - Engine.StatSecondNum;
            Engine.StatSecondNum = Date.now();
            if(global.JINN_WARNING >= 3 && DeltaStat > 1500)
                global.ToLog("=============== DeltaStat: " + DeltaStat + " ms  !!!!");

            global.PrepareStatEverySecond();

            let Arr = global.SERVER.GetActualNodes();

            global.CountAllNode = Engine.GetCountAddr();
            global.CountConnectedNode = Arr.length;
            global.ADD_TO_STAT("MAX:HOT_NODES", global.SERVER.GetHotNodesCount());
            global.ADD_TO_STAT("MAX:CONNECTED_NODES", global.CountConnectedNode);
            global.ADD_TO_STAT("MAX:ALL_NODES", global.CountAllNode);

            global.ADD_TO_STAT("SENDDATA(KB)", Engine.SendTraffic / 1024);
            global.ADD_TO_STAT("GETDATA(KB)", Engine.ReceiveTraffic / 1024);
            Engine.SendTraffic = 0;
            Engine.ReceiveTraffic = 0;

            global.ADD_TO_STAT("MAX:TIME_DELTA", global.DELTA_CURRENT_TIME);

            global.ADD_TO_STAT("USEPACKET", Engine.ReceivePacket);
            Engine.ReceivePacket = 0;

            global.ADD_TO_STAT("NETCONFIGURATION", Engine.NetConfiguration);
            Engine.NetConfiguration = 0;

            global.ADD_TO_STAT("ERRORS", global.JINN_STAT.ErrorCount);

            global.ADD_TO_STAT("DELTA_STAT", DeltaStat);

            global.glMemoryUsage = (process.memoryUsage().heapTotal / 1024 / 1024) >>> 0;
            global.glFreeMem = os.freemem() / 1024 / 1024;
            global.ADD_TO_STAT("MAX:MEMORY_USAGE", global.glMemoryUsage);
            global.ADD_TO_STAT("MAX:MEMORY_FREE", global.glFreeMem);

            let SumUser = 0;
            let SumSys = 0;
            let SumIdle = 0;
            let cpus = os.cpus();
            for(let i = 0; i < cpus.length; i++)
            {
                let cpu = cpus[i];
                SumUser += cpu.times.user;
                SumSys += cpu.times.sys + cpu.times.irq;
                SumIdle += cpu.times.idle;
            }
            if(GlSumUser !== undefined)
            {
                let maxsum = cpus.length * 1000;
                global.ADD_TO_STAT("MAX:CPU_USER_MODE", Math.min(maxsum, SumUser - GlSumUser));
                global.ADD_TO_STAT("MAX:CPU_SYS_MODE", Math.min(maxsum, SumSys - GlSumSys));
                global.ADD_TO_STAT("MAX:CPU_IDLE_MODE", Math.min(maxsum, SumIdle - GlSumIdle));
                global.ADD_TO_STAT("MAX:CPU", Math.min(maxsum, SumUser + SumSys - GlSumUser - GlSumSys));
            }
            GlSumUser = SumUser;
            GlSumSys = SumSys;
            GlSumIdle = SumIdle;

            let MaxNumDB = global.SERVER.GetMaxNumBlockDB();
            let MaxBlock = Engine.GetBlockHeaderDB(MaxNumDB);
            if(MaxBlock)
            {
                if(PrevSumPow)
                    global.ADD_TO_STAT("MAX:BLOCK_SUMPOW", MaxBlock.SumPow - PrevSumPow);
                PrevSumPow = MaxBlock.SumPow;
            }
            global.glMaxNumDB = MaxNumDB;

            global.JINN_STAT.TeraReadRowsDB += global.TeraReadRowsDB;
            global.JINN_STAT.TeraWriteRowsDB += global.TeraWriteRowsDB;

            global.TeraReadRowsDB = 0;
            global.TeraWriteRowsDB = 0;

            let Str = global.GetJinnStatInfo();
            Str = Str.replace(/[\n]/g, " ");
            let JinnStat = Engine;
            let StrMode = " H:" + (JinnStat.Header2 - JinnStat.Header1) + " B:" + (JinnStat.Block2 - JinnStat.Block1) + "";
            Str += StrMode;
            if(global.DEV_MODE === 12)
                global.ToLogInfo("" + MaxCurNumTime + ":" + Str);
            global.ADD_TO_STAT("MAX:TRANSACTION_COUNT", global.JINN_STAT.BlockTx);
            global.ADD_TO_STAT("MAX:SUM_POW", Engine.DB.MaxSumPow % 1000);
            for(let key in global.JINN_STAT.Methods)
            {
                let StatNum = Math.floor(global.JINN_STAT.Methods[key]);
                global.ADD_TO_STAT(key, StatNum);
            }
            for(let key in global.JINN_STAT.Keys)
            {
                let Name = global.JINN_STAT.Keys[key];
                if(Name)
                {
                    if(Name.substr(0, 1) === "-")
                        Name = Name.substr(1);

                    let StatNum = global.JINN_STAT[key];
                    global.ADD_TO_STAT("JINN:" + Name, StatNum);
                }
            }

            global.TERA_STAT = {};
            global.CopyObjKeys(global.TERA_STAT, global.JINN_STAT);
            global.JINN_STAT.Clear();
        };

        Engine.CanUploadData = function (CurBlockNum,LoadBlockNum)
        {
            return 1;
            if(global.glKeccakCount < global.MAX_SHA3_VALUE && GetBusyTime() <= global.MAX_BUSY_VALUE)
            {
                return 1;
            }

            let Delta = Math.abs(CurBlockNum - LoadBlockNum);
            if(Delta < 8)
                return 1;

            return 0;
        };

        Engine.GetBlockchainStatForMonitor = function (Param)
        {
            if(Param.Mode === "POW")
                return global.SERVER.GetStatBlockchainPeriod(Param);

            if(Param.Mode === "SenderGistogram")
            {

                let StartNum = Param.BlockNum;
                if(!Param.Count || Param.Count < 0)
                    Param.Count = 1000;
                let EndNum = StartNum + Param.Count;

                if(JINN_CONST.TX_PRIORITY_RND_SENDER)
                {

                    let ArrList = new Array(JINN_CONST.TX_PRIORITY_RND_SENDER);
                    let ArrX = [];
                    for(let i = 0; i < ArrList.length; i++)
                    {
                        ArrX[i] = i;
                        ArrList[i] = 0;
                    }
                    for(let num = StartNum; num < EndNum; num++)
                    {
                        let Block = Engine.GetBlockDB(num);
                        if(!Block)
                            break;

                        for(let i = 0; Block.TxData && i < Block.TxData.length; i++)
                        {
                            let Tx = Block.TxData[i];
                            let SenderNum = Engine.GetTxSenderNum(Tx, Block.BlockNum);
                            if(SenderNum >= 0)
                                ArrList[SenderNum]++;
                        }
                    }
                }
                else
                {

                    let Map = {};
                    let Arr = [];
                    for(let num = StartNum; num < EndNum; num++)
                    {
                        let Block = Engine.GetBlockDB(num);
                        if(!Block)
                            break;

                        for(let i = 0; Block.TxData && i < Block.TxData.length; i++)
                        {
                            let Tx = Block.TxData[i];
                            let SenderNum = Engine.GetTxSenderNum(Tx, Block.BlockNum);
                            if(SenderNum >= 0)
                            {
                                let Item = Map[SenderNum];
                                if(!Item)
                                {
                                    Item = {SenderNum:SenderNum, Count:0};
                                    Arr.push(Item);
                                    Map[SenderNum] = Item;
                                }
                                Item.Count++;
                            }
                        }
                    }
                    Arr.sort(function (a,b)
                    {
                        return a.SenderNum - b.SenderNum;
                    });
                    let ArrList = [];
                    let ArrX = [];
                    for(let i = 0; i < Arr.length; i++)
                    {
                        let Item = Arr[i];
                        ArrList[i] = Item.Count;
                        ArrX[i] = Item.SenderNum;
                    }
                }

                return {ArrList:ArrList, ArrX:ArrX, steptime:1};
            }
        };
    }


    global.GetBusyTime = GetBusyTime;
    global.glBusySha3 = 0;
    global.glBusyTime = 0;

    let LastTimeIdle = 0;
    function OnTimeIdleBusy()
    {
        global.glBusyTime = (Date.now() - LastTimeIdle) * (100 / 50);

        LastTimeIdle = Date.now();
        global.glBusySha3 = global.glKeccakCount;
        global.glKeccakCount = 0;

        if(global.glStartStat)
        {
            if(global.glStartStat === 2)
            {
                global.ADD_TO_STAT("MAX:Busy", global.glBusyTime);
                global.ADD_TO_STAT("SHA3", global.glBusySha3);
            }
            global.glStartStat = 2;
        }

        setTimeout(OnTimeIdleBusy, 50);
    }
    OnTimeIdleBusy();

    function GetBusyTime()
    {
        let LocalBusyTime = (Date.now() - LastTimeIdle) * (100 / 50);
        return Math.max(LocalBusyTime, glBusyTime);
    }

    let PrevTimeIdle = 0;
    OnTimeIdle();
    function OnTimeIdle()
    {

        let CurTime = Date.now();
        let Delta = CurTime - PrevTimeIdle;
        if(Delta <= 51) {
            global.ADD_TO_STAT("TIME_IDLE", 5);
        }

        setTimeout(OnTimeIdle, 49);
        PrevTimeIdle = CurTime;
    }


    return  {
        init: Init
    };
}