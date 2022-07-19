/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2021 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/

"use strict";
import logs from '../../debug/index.mjs'

let debug = (maxCount, id, props, data, ...args) => {
    let path = import.meta.url
    let from = path.search('/process');
    let to = path.length;
    let url = path.substring(from,to);
    // logs.assert(maxCount,url, id, props, data, ...args)
}

export default (global) => {
debug(-5,'💎[(self)a]', global.PROCESS_NAME)

    let ArrChildProcess = [];

    global.globalRunID = 0;
    global.globalRunMap = {};
    let WebProcessArr=[];
    let WebProcessTempl = {Name:"WEB PROCESS", idInterval:0, LastAlive:Date.now(), Worker:undefined, Path:"./process/fork/web-process.mjs",
        OnMessage:OnMessageWeb, PeriodAlive:10 * 1000*(global.DEV_MODE?100:1), UpdateConst:0, bWeb:1};

    WebProcessArr.push(WebProcessTempl);
    for(let i=1;i<global.HTTP_HOSTING_PROCESS;i++)
        WebProcessArr.push(global.CopyObjKeys({},WebProcessTempl));


    global.WEB_PROCESS = {sendAll:SendAllWeb};

    if(global.HTTP_HOSTING_PORT && !global.NWMODE)
    {
        for(let i=0;i<WebProcessArr.length;i++)
            ArrChildProcess.push(WebProcessArr[i]);

        global.WEB_PROCESS.RunRPC=function (Name,Params,F)
        {
            let Item=WebProcessArr[0];
            if(Item && Item.RunRPC)
                return Item.RunRPC(Name, Params, F);//only first
        };


        RunWebsIntervals();
    }

    function OnMessageWeb(msg)
    {

        switch(msg.cmd)
        {
            case "SetSmartEvent":
            {

                if(global.TX_PROCESS && global.TX_PROCESS.Worker)
                {
                    global.TX_PROCESS.Worker.send(msg);
                }
                break;
            }
        }
    }



// function OnMessageStatic(msg)
// {
//     switch(msg.cmd)
//     {
//         case "Send":
//             {
//                 let Node = global.SERVER.NodesMap[msg.addrStr];
//                 if(Node)
//                 {
//                     msg.Data = msg.Data.data;
//                     global.SERVER.Send(Node, msg, 1);
//                 }
//
//                 break;
//             }
//     }
// }


    let TxModuleName = "./process/fork/tx-process.mjs";

    global.TX_PROCESS = {
        Name:"TX PROCESS",
        NodeOnly:1,
        idInterval:0,
        LastAlive:Date.now(),
        Worker:undefined,
        Path:TxModuleName,
        OnMessage:OnMessageTX,
        PeriodAlive:100 * 1000
    };
    ArrChildProcess.push(global.TX_PROCESS);

    function OnMessageTX(msg) {
        switch(msg.cmd) {
            case "DappEvent": {
                SendAllWeb(msg);

                AddDappEventToGlobalMap(msg.Data);
                break;
            }
        }
    }


//////////////////////
//START CHILD PROCESS
//////////////////////


    function StartAllProcess(bClose) {
        for(let i = 0; i < ArrChildProcess.length; i++)
        {
            let Item = ArrChildProcess[i];
            StartChildProcess(Item);
        }
    }

    function StartChildProcess(Item) {
        if(Item.NodeOnly && global.NOT_RUN) {
            return;
        }
        let ITEM = Item;
        ITEM.idInterval = setInterval( function () {
            let Delta0 = Date.now() - ITEM.LastAlive;
            if(Delta0 >= 0) {
                let Delta = Date.now() - ITEM.LastAlive;
                if(ITEM.Worker && Delta > ITEM.PeriodAlive) {
                    if(ITEM.Worker) {
                        global.ToLog("KILL with alive=" + (Delta / 1000) + " " + ITEM.Name + ": " + ITEM.Worker.pid);
                        try {
                            process.kill(ITEM.Worker.pid, 'SIGKILL');
                        }
                        catch(e) {
                            global.ToLog("ERR KILL");
                        }
                        ITEM.Worker = undefined;
                    }
                }
                if(!ITEM.Worker) {
                    ITEM.LastAlive = (Date.now()) + ITEM.PeriodAlive * 3;
                    global.ToLog("STARTING " + ITEM.Name);
                    ITEM.Worker = global.RunFork(ITEM.Path, ["READONLYDB"],ITEM.bWeb);
                    if(!ITEM.Worker) {
                        return;
                    }


                    ITEM.pid = ITEM.Worker.pid;
                    global.ToLog("STARTED " + ITEM.Name + ":" + ITEM.pid);
                    ITEM.Worker.on('message', function (msg) {
                        if(msg.cmd !== 'Alive') {
                            debug(-7,`💎[(msg)a]`, {
                                Name:ITEM.Name,
                                msg:msg
                            })
                        }
                        if(ITEM.LastAlive < Date.now()) {
                            ITEM.LastAlive = Date.now();
                        }
                        switch(msg.cmd) {
                            case "call":
                                let Err = 0;
                                let Ret;
                                try {
                                    if(typeof msg.Params === "object" && msg.Params.F)//возврат через обратный вызов
                                    {
                                        global[msg.Name](msg.Params, function (Err,Ret)
                                        {
                                            if(msg.id && ITEM.Worker)
                                                ITEM.Worker.send({cmd:"retcall", id:msg.id, Err:Err, Params:Ret});
                                        });
                                        break;
                                    }
                                    else {
                                        Ret = global[msg.Name](msg.Params);
                                    }
                                }
                                catch(e)
                                {
                                    Err = 1;
                                    Ret = "" + e;
                                }

                                if(msg.id && ITEM.Worker)
                                    ITEM.Worker.send({cmd:"retcall", id:msg.id, Err:Err, Params:Ret});
                                break;

                            case "retcall":
                                let F = global.GlobalRunMap[msg.id];
                                if(F)
                                {
                                    delete global.GlobalRunMap[msg.id];
                                    F(msg.Err, msg.Params);
                                }
                                break;
                            case "log":
                                global.ToLog(msg.message, msg.level, msg.nofile);
                                break;
                            case "ToLogClient":
                                if(!msg.NoWeb)
                                {
                                    SendAllWeb(msg);
                                }

                                global.ToLogClient(msg.Str, msg.StrKey, msg.bFinal,0,0,msg.BlockNum,msg.TrNum);
                                break;
                            case "WalletEvent":
                                //console.log("WalletEvent="+JSON.stringify(msg,"",4));


                                if(msg.Web)//перенаправляем в web-process
                                {
                                    SendAllWeb(msg);
                                }
                                else
                                if(msg.Main)
                                {
                                    global.ToLogClient(msg.ResultStr, msg.TX, msg.bFinal,0,0,msg.BlockNum,msg.TrNum);
                                }

                                break;
                            case "online":
                                if(ITEM.Worker)
                                {
                                    global.ToLog("RUNNING " + ITEM.Name + " : " + msg.message + " pid: " + ITEM.Worker.pid);
                                }
                                break;

                            case "POW":
                                global.SERVER.MiningProcess(msg, 1);
                                break;

                            default:
                                if(ITEM.OnMessage) {
                                    ITEM.OnMessage(msg);
                                }
                                break;
                        }
                    });

                    ITEM.Worker.on('error', function (err) {
                            console.error('gggggggggggggggggggggggggg',err)
                    });

                    ITEM.Worker.on('close', function (code) {
                        global.ToLog("CLOSE " + ITEM.Name, 2);
                        ITEM.Worker=undefined;
                    });

                }
            }

            if(ITEM.Worker) {
                ITEM.Worker.send(
                    {
                        cmd:"Alive",
                        DELTA_CURRENT_TIME:global.DELTA_CURRENT_TIME,
                        FIRST_TIME_BLOCK:global.FIRST_TIME_BLOCK,
                    });
            }
        }, 500);
        ITEM.RunRPC = function (Name,Params,F) {
            if(!ITEM.Worker) {
                return;
            }
            let Worker;
            if(ITEM.Worker.length) {
                Worker=ITEM.Worker[0];
            } else {
                Worker=ITEM.Worker;
            }

            if(F) {
                global.globalRunID++;
                debug(-5, '💎[(RunRPC*)GlobalRunMap]', global.GlobalRunMap)
                try {
                    global.GlobalRunMap[global.globalRunID] = F;
                    Worker.send({cmd:"call", id:global.globalRunID, Name:Name, Params:Params});
                } catch(e) {
                    delete global.GlobalRunMap[global.globalRunID];
                }
            }
            else {
                Worker.send({cmd:"call", id:0, Name:Name, Params:Params});
            }
        };
    }

    function StopChildProcess() {
        StopWebsIntervals();

        for(let i = 0; i < ArrChildProcess.length; i++) {
            let Item = ArrChildProcess[i];
            if(Item.idInterval) {
                clearInterval(Item.idInterval);
            }
            Item.idInterval = 0;

            if(Item.Worker && Item.Worker.connected) {
                Item.Worker.send({cmd:"Exit"});
                Item.Worker = undefined;
            }
        }

        global.RunStopPOWProcess("STOP");
    }

    function RunWebsIntervals() {
        global.WEB_PROCESS.idInterval1 = setInterval(function () {
            SendAllWeb({cmd:"Stat", Arr:[{Name:"MAX:ALL_NODES", Value:global.CountAllNode},{Name:"MAX:Addrs", Value:global.JINN_STAT.AddrCount}]});
            if(global.WEB_PROCESS.UpdateConst) {
                global.WEB_PROCESS.UpdateConst = 0;
                SendAllWeb({cmd:"UpdateConst"});
            }

        }, 500);

        global.WEB_PROCESS.idInterval2 = setInterval(function () {
            if(!!global.SERVER) {
                let arrAlive = global.SERVER.GetNodesArrWithAlive();
                SendAllWeb({cmd:"NodeList", ValueAll:arrAlive});
            }
        }, 5000);
    }

    function StopWebsIntervals() {
        if(global.WEB_PROCESS.idInterval1)
            clearInterval(global.WEB_PROCESS.idInterval1);
        global.WEB_PROCESS.idInterval1 = 0;
        if(global.WEB_PROCESS.idInterval2)
            clearInterval(global.WEB_PROCESS.idInterval2);
        global.WEB_PROCESS.idInterval2 = 0;
    }

    function SendAllWeb(Params) {
        for(let i=0;i<WebProcessArr.length;i++) {
            let Worker=WebProcessArr[i].Worker;
            if(Worker && Worker.connected)
                Worker.send(Params);
        }
    }

    global.StartAllProcess = StartAllProcess;
    global.StopChildProcess = StopChildProcess;
}