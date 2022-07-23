/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

/**
 *
 * Dual connection protection algorithm
 *
**/

'use strict';

import logs from '../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    const main = -7
    const path = import.meta.url
    const from = path.search('/blockchain');
    const to = path.length;
    const url = path.substring(from,to);
    const count = (typeof maxCount === "string") ? parseInt(maxCount,10): (maxCount < 0)? main: maxCount
    // logs.assert(count, url, id, props, data, ...args)
}
export default (global) => {
debug(-3, '[(self)a]', global.PROCESS_NAME)

    global.JINN_MODULES.push({ InitClass:InitClass, DoNode:DoNode, Name:"Connect" });


    let glWorkConnect = 0;

//Engine context

    function DoNode(Engine) {
        debug(-3, '~~~~~~⚪[(DoNode*)a]', Engine.ip, {
           "Engine.TickNum": Engine.TickNum,
            "Engine.ROOT_NODE": Engine.ROOT_NODE
        })

        if(Engine.TickNum % 5 !== 0) {
            return;
        }

        if(Engine.ROOT_NODE) {
            return 0;
        }

        let Delta = Date.now() - Engine.StartTime;

        if(Delta < 2000 * global.JINN_CONST.MAX_CONNECT_TIMEOUT / 3) {
            Engine.IsStartingTime = 1;
        } else {
            Engine.IsStartingTime = 0;
        }

        if(global.MODELING) {
            Engine.IsStartingTime = 0;
        }

        glWorkConnect++;
        if(!Engine.WasSendToRoot && global.JINN_EXTERN.NodeRoot) {
            let Child = Engine.NewConnect(global.JINN_EXTERN.NodeRoot.IDArr, global.JINN_EXTERN.NodeRoot.ip, global.JINN_EXTERN.NodeRoot.port);
            if(Child) {
                Engine.WasSendToRoot = 1;
                Child.ROOT_NODE = 1;
                Engine.SendConnectReq(Child);
            }
        }
        else if(Engine.NodesTree.size === 0 && Engine.TickNum > 10) {
            Engine.WasSendToRoot = 0;
        }

        for(let i = 0; i < Engine.ConnectArray.length; i++) {
            let Child = Engine.ConnectArray[i];
            if(!Child || Child.ROOT_NODE || Child.Del) {
                continue;
            }

            if(!Child.IsHot()) {
                let DeltaTime = Date.now() - Child.ConnectStart;
                if(DeltaTime > global.JINN_CONST.MAX_CONNECT_TIMEOUT * 1000) {

                    let StrError = "MAX_CONNECT_TIMEOUT StartDisconnect";
                    Child.ToLogNet(StrError);
                    Engine.StartDisconnect(Child, 1, StrError);
                    continue;
                }
            }

            let AddrItem = Child.AddrItem;
            if(!AddrItem) {
                continue;
            }

            if(AddrItem.WorkConnect !== glWorkConnect) {
                AddrItem.ConnectCount = 0;
                AddrItem.WorkConnect = glWorkConnect;
            }

            AddrItem.ConnectCount++;
            Child.ConnectNum = AddrItem.ConnectCount;
        }
        for(let i = 0; i < Engine.ConnectArray.length; i++) {
            let Child = Engine.ConnectArray[i];
            if(!Child || Child.ROOT_NODE || Child.Del || !Child.AddrItem || !Child.IsOpen() || Child.Self || Child.IsHot()) {
                continue;
            }

            if(Child.AddrItem.ConnectCount <= 1)
                continue;

            if(global.CompareArr(Engine.IDArr, Child.IDArr) > 0)
            {
                if(Child.InComeConnect)
                {
                    let StrError = "---DOUBLE StartDisconnect 1 Num:" + Child.ConnectNum;
                    Child.ToLogNet(StrError);
                    Engine.StartDisconnect(Child, 1, StrError);
                    Engine.DenyHotConnection(Child);
                }
            }
            else
            {
                if(!Child.InComeConnect)
                {
                    let StrError = "---DOUBLE StartDisconnect 2 Num: " + Child.ConnectNum;
                    Child.ToLogNet(StrError);
                    Engine.StartDisconnect(Child, 1, StrError);
                    Engine.DenyHotConnection(Child);
                }
            }
        }
        Engine.DoConnectLevels();
    }


    function InitClass(Engine) {
        debug(-5, '~~~~~~~~~~~~~~~~~⚪[(InitClass*)a]', Engine.ip)
        Engine.StartTime = Date.now();

        Engine.WasSendToRoot = 0;
        Engine.IndexChildLoop = 0;

        Engine.ConnectArray = [];
        Engine.ConnectToNode = function (ip,port) {
            let Child = Engine.RetNewConnectByIPPort(ip, port);
            if(!Child)
                return  - 1;

            if(Engine.SendConnectReq(Child))
                return 1;
            else
                return  - 2;
        };

        Engine.SendConnectReq = function (Child) {
            debug(-5, '~~~~~~~~~~~~~~~~~~⚪[(SendConnectReq) CanConnect]', Child.ip)
            if(!Engine.CanConnect(Child)) {
                debug(-5, `~~~~~~~~~~~~~~~~~~~~~⚪[(SendConnectReq*) Can't connect]`, Child.ip)
                return 0;
            }

            Engine.CreateConnectionToChild(Child, function (result) {
                debug(-5, '~~~~~~~~~~~~~~~~~⚪[(CreateConnectionToChild*)result]', result)
                if(result) {
                    Engine.StartHandShake(Child);
                }
            });

            return 1;
        };

        Engine.CanConnect = function (Child) {
            if(Engine.ROOT_NODE) {
                return 1;
            }

            if(Child.Self) {
                debug(-5, '~~~~~~~~~~~~~~~~~⚪[(CanConnect*) Can\'t self connect]')
                Child.ToLogNet("Can't self connect");
                return 0;
            }
            return 1;
        };
        Engine.FindConnectByHash = function (RndHash) {
            debug(-5, '~~~~~~~~[(FindConnectByHash*)RndHash]', RndHash)
            if(!RndHash || global.IsZeroArr(RndHash))
                return undefined;

            for(let i = 0; i < Engine.ConnectArray.length; i++)
            {
                let Item = Engine.ConnectArray[i];
                if(Item.Del)
                    continue;

                if(Item.RndHash && global.IsEqArr(Item.RndHash, RndHash))
                    return Item;
            }
            return undefined;
        };

        Engine.OnAddConnect = function (Child)
        {
        };

        Engine.StartDisconnect = function (Child,bSend,StrError)
        {
            debug(-5, '~~~~~~~~[(StartDisconnect*)StrError]', StrError)
            Engine.DisconnectLevel(Child, bSend);
            if(bSend && Child.IsOpen())
            {
                Engine.CloseConnectionToChild(Child, StrError);
                Engine.OnDeleteConnect(Child);
            }
            else
            {
                Engine.OnDeleteConnect(Child);
            }
        };

        Engine.OnDeleteConnect = function (Child,StrError)
        {
            if(Engine.InHotStart(Child))
                Engine.DenyHotConnection(Child);

            Engine.DisconnectLevel(Child, 0);

            if(Engine.OnDeleteConnectNext)
                Engine.OnDeleteConnectNext(Child, StrError);

            Engine.RemoveConnect(Child);
        };

        Engine.GetTransferArrByLevel = function (ModeConnect,bNotConnect) {
            debug(-5, '~~~~~~~~~~~~~~~~~⚪[(GetTransferArrByLevel*) bNotConnect ModeConnect]', {
                bNotConnect: bNotConnect,
                ModeConnect: ModeConnect
            })
            let LevelData;
            let ArrLevels = [];

            glWorkConnect++;
            for(let L = 0; L < global.JINN_CONST.MAX_LEVEL_ALL(); L++) {
                LevelData = {HotChild:Engine.LevelArr[L], CrossChild:Engine.CrossLevelArr[L], Connect:[], NotConnect:[]};
                ArrLevels.push(LevelData);
            }
            if(ModeConnect) {
                for(let i = 0; i < Engine.ConnectArray.length; i++) {
                    let Child = Engine.ConnectArray[i];
                    if(!Child) {
                        continue;
                    }

                    if(Child.Level === undefined) {
                        global.ToLogTrace("Error Child.Level===undefined");
                    }

                    if(Child.AddrItem) {
                        Child.AddrItem.WorkConnect = glWorkConnect;
                    }

                    if(Child.Level < global.JINN_CONST.MAX_LEVEL_CONNECTION) {
                        LevelData = ArrLevels[Child.Level];
                        if((ModeConnect & 1) && Engine.CanSetHot(Child) > 0 && LevelData.HotChild !== Child) {
                            LevelData.Connect.push(Child);
                        } else if((ModeConnect & 2) && Child.IsCluster && LevelData.CrossChild !== Child && LevelData.HotChild !== Child) {
                            LevelData.Connect.push(Child);
                        }
                    }
                }
            }
            if(bNotConnect) {
                let it = Engine.NodesTree.iterator(), Item;
                while((Item = it.next()) !== null) {
                    if(Item.SendConnectPeriod === undefined) {
                        global.ToLogTrace("Error Item.SendConnectPeriod===undefined");
                    }

                    if(Item.WorkConnect === glWorkConnect) {
                        continue;
                    }

                    if(Item.Level === undefined) {
                        global.ToLogTrace("Error Item.Level===undefined");
                    }

                    let Power = Engine.GetAddrPower(Item.AddrHashPOW, Item.BlockNum);
                    if(Item.System || global.MODELING) {
                        Power += global.MIN_POW_ADDRES;
                    }

                    if(Power >= global.MIN_POW_ADDRES && Item.Level < global.JINN_CONST.MAX_LEVEL_CONNECTION) {
                        LevelData = ArrLevels[Item.Level];
                        LevelData.NotConnect.push(Item);
                    }
                }
            }
            for(let L = 0; L < global.JINN_CONST.MAX_LEVEL_CONNECTION; L++) {
                let LevelData = ArrLevels[L];

                LevelData.Connect.sort(function (a,b) {
                    if(a.SendHotConnectLastTime !== b.SendHotConnectLastTime) {
                        return a.SendHotConnectLastTime - b.SendHotConnectLastTime;
                    }

                    if(a.TestExchangeTime !== b.TestExchangeTime) {
                        return b.TestExchangeTime - a.TestExchangeTime;
                    }

                    if(a.Score !== b.Score) {
                        return b.Score - a.Score;
                    }

                    return a.ID - b.ID;
                });

                LevelData.NotConnect.sort(function (a,b) {
                    if(a.SendConnectLastTime !== b.SendConnectLastTime) {
                        return a.SendConnectLastTime - b.SendConnectLastTime;
                    }

                    if(a.Score !== b.Score) {
                        return b.Score - a.Score;
                    }

                    return a.ID - b.ID;
                });
            }

            debug(-5, '~~~~~~~~~~~~~~~~~⚪[(GetTransferArrByLevel*) ArrLevels]', ArrLevels)
            return ArrLevels;
        };

        Engine.GetActualNodesCount = function () {
            debug(-5, '----------------⚪[(GetActualNodesCount*) ]')
            let Count = 0;

            for(let i = 0; i < Engine.ConnectArray.length; i++) {
                let Child = Engine.ConnectArray[i];
                if(!Child || !Child.IsOpen()) {
                    continue;
                }
                Count++;
            }
            debug(-5, '----------------⚪[(GetActualNodesCount*) Count]', (Count) ? Count : "0")
            return Count;
        };
        Engine.DoConnectLevels = function () {
            debug(-5, '--------------⚪[(DoConnectLevels*)]')
            let ArrLevels = Engine.GetTransferArrByLevel(3, 1);
            debug(-5, '--------------⚪[(DoConnectLevels*) ArrLevels]', ArrLevels)
            let MinNodeCounts = 1;
            if(Engine.IsStartingTime)
                MinNodeCounts = 10;

            for(let L = 0; L < global.JINN_CONST.MAX_LEVEL_CONNECTION; L++) {
                let LevelData = ArrLevels[L];
                if(LevelData.Connect.length < MinNodeCounts)
                {
                    for(let i = 0; i < LevelData.NotConnect.length; i++)
                    {
                        let Item = LevelData.NotConnect[i];

                        if(Engine.WasBanItem(Item)) {
                            continue;
                        }


                        if(!CanTime(Item, "SendConnect", 1000, 1.5)) {
                            continue;
                        }


                        if(!Item.CheckStartConnect && global.CompareArr(Engine.IDArr, Item.IDArr) > 0) {
                            Item.CheckStartConnect = 1;
                            continue;
                        }

                        debug(-5, '--------------⚪[(DoConnectLevels) Item.ip]', Item.ip)
                        let Child = Engine.RetNewConnectByAddr(Item);
                        debug(-5, '--------------⚪[(DoConnectLevels*) Child]', Child.ip)
                        if(Child && Engine.SendConnectReq(Child)) {
                            break;
                        }
                    }
                }

                for(let i = 0; i < LevelData.Connect.length; i++) {
                    let Child = LevelData.Connect[i];
                    let Item = Child.AddrItem;
                    if(Item && Item.SendConnectPeriod !== 1000) {
                        ResetTimePeriod(Item, "SendConnect", 1000, 10000);
                    }
                }
            }
        };
    }

    function CanTime(Obj,Name,Period,kMult,TimeReset)
    {
        let NameLastTime = Name + "LastTime";
        let NamePeriod = Name + "Period";

        let CurTume = Date.now();
        if(!Obj[NameLastTime])
        {
            Obj[NameLastTime] = 0;
            Obj[NamePeriod] = Period;
        }

        if(TimeReset)
            Obj[NamePeriod] = TimeReset;

        let Delta = CurTume - Obj[NameLastTime];
        if(Delta < Obj[NamePeriod])
            return 0;
        Obj[NameLastTime] = CurTume;

        if(kMult)
        {
            Obj[NamePeriod] = Obj[NamePeriod] * kMult;
        }

        if(TimeReset)
        {
            Obj[NamePeriod] = Period;
        }

        return 1;
    }

    function ResetTimePeriod(Obj,Name,Period,TimeReset)
    {
        CanTime(Obj, Name, Period, 0, TimeReset);
    }

    global.CanTime = CanTime;
    global.ResetTimePeriod = ResetTimePeriod;
}
