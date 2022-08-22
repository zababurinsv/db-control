/*
 * @project: TERA
 * @version: 2
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2021 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/

'use strict';
import constant from '../core/constant.mjs'
import cryptoLibrary from '../core/crypto-library.mjs'
import library from '../core/library.mjs'
import JinnLib from "../jinn/tera/index.mjs"
import tests from '../core/tests.mjs'
import mining from "../core/mining.mjs"
import apiCommon from "../rpc/api-common.mjs"
import htmlServer from "../core/html-server.mjs"
import system from "../system/index.mjs"
import childsRun from "./childs-run.mjs"
import wallet from "../core/wallet.mjs"
import updateDb from "../core/update-db.mjs"
// import webProcess from './web-process.mjs'
import logs from '../../debug/index.mjs'

let debug = (maxCount, id, props, data, ...args) => {
    const main = -7
    const path = import.meta.url
    const from = path.search('/blockchain');
    const to = path.length;
    const url = path.substring(from,to);
    const count = (typeof maxCount === "string") ? parseInt(maxCount,10): (maxCount < 0)? main: maxCount
    logs.assert(count, url, id, props, data, ...args)
}

let treadProcess = (Path) => {
    const url = new URL(Path, import.meta.url)
    let tread = {};

    tread.worker = new Worker(url, { type: "module" });

    tread.worker.onmessageerror = async event => {
        debug(-4,'⛹[(worker)onmessageerror]', event.data)
    }

    tread.worker.oncontrollerchange = async event => {
        debug(-4,'⛹[(worker)oncontrollerchange]', event.data)
    }

    tread.worker.onmessage = async event => {
        debug(-4,'⛹[(worker)onmessage]', event.data.state)
    }

    tread.worker.on = (msg, call, ...args) => {
        debug(-4,'--------------------------------⛹[(worker)on]', msg, call, args)
    }

    tread.worker.send = (msg, call, ...args) => {
        debug(-4,'--------------------------------⛹[(worker)send]', msg, call, args)
    }
    return tread.worker
}

export default async (global) => {
    global.PROCESS_NAME = "MAIN";
    debug(-4,'[(MAIN PROCESS)a]', global.PROCESS_NAME)
    const process = global.process
    const fs = global.fs
    const os = global.os
    const crypto = global.crypto
    const cluster = global.cluster

    if(global.IS_NODE_JS) {
        if (cluster.isWorker)
        {
            // await webProcess(global)
            return;
        }
    } else {
        console.warn('надо добавить в браузер main-process.mjs')
    }
    constant(global)

    global.START_SERVER = 1;
    global.DATA_PATH = global.GetNormalPathString(global.DATA_PATH);
    global.CODE_PATH = global.GetNormalPathString(global.CODE_PATH);

    console.log("RUN MODE: " + global.MODE_RUN);
    console.log("DATA DIR: " + global.DATA_PATH);
    console.log("PROGRAM DIR: " + global.CODE_PATH);

    await library(global)
    cryptoLibrary(global)
    if(global.IS_NODE_JS) {
        const upnp = (await import('../core/upnp.mjs'))['default']
        await upnp(global)
    } else {
        const upnp = (await import('../core/upnp.mjs'))['default']
        await upnp(global)
        console.warn('надо добавить в браузер main-process.mjs')
    }
    let platform = os.platform()
    console.log('platform', platform)
    debug(-2,`⛹[((process*)platform]`, platform)
    global.ToLog("==================================================================");
    global.ToLog(platform + " (" + os.arch() + ") " + os.release());
    global.ToLog("==================================================================");

    global.CURRENT_OS_IS_LINUX = (platform === "linux" || platform === "Linux");
    console.log('global.CURRENT_OS_IS_LINUX',os.platform() ,  global.CURRENT_OS_IS_LINUX)
    platform = null
    let VerArr = process.versions.node.split('.');
    global.ToLog("node: " + process.versions.node)
    if(VerArr[0] < 8) {
        global.ToError("Error version of NodeJS=" + VerArr[0] + "  Pls, download new version from www.nodejs.org and update it. The minimum version must be 8");
        process.exit();
    }
    await tests(global)
    global.DEF_PERIOD_SIGN_LIB = 100;
    setTimeout(function () {
            global.TestSignLib(global.DEF_PERIOD_SIGN_LIB);
    }, 4000);

    global.glCurNumFindArr = 0;
    global.ArrReconnect = [];
    global.ArrConnect = [];

    global.SERVER = null;
    global.NeedRestart = 0;

    process.on('uncaughtException', function (err) {
        console.log("--------------------uncaughtException--------------------");
        console.log(err.code);
        console.log('uncaughtException occurred: ' + err.stack);
        console.log("---------------------------------------------------------");
        switch(err.code)
        {
            case "ENOTFOUND":
            case "ECONNRESET":
            case "EPIPE":
            case "ETIMEDOUT":
                break;
            case "ERR_IPC_CHANNEL_CLOSED":
                //global.ToLogTrace("");
                break;
            default:
            {

                if(global.PROCESS_NAME !== "MAIN")
                {
                    process.send({cmd:"log", message:err});
                }

                if(err)
                {
                    let Str = err.stack;
                    if(!Str)
                        Str = err;
                    global.ToLog(Str);
                    global.ToError(Str);
                }

                global.TO_ERROR_LOG("APP", 666, err);
                global.ToLog("-----------------EXIT------------------");
                process.exit();
            }
        }
    });
    process.on('error', function (err) {
            console.log("--------------------error--------------------");

            let stack = err.stack;
            if(!stack)
                stack = "" + err;

            global.ToError(stack);
            global.ToLog(stack);
        }
    );
    process.on('unhandledRejection', function (reason, promise) {
            console.log("--------------------unhandledRejection--------------------");
            console.dir(reason.stack);
            global.ToLog('Unhandled Rejection at:' + promise + 'reason:' + reason);
            global.ToError('Unhandled Rejection at:' + promise + 'reason:' + reason);
        }
    );
    mining(global)
    apiCommon(global)
    htmlServer(global)
    const jinLib = await JinnLib(global)
    await system(global)
    await childsRun(global)
    wallet(global)
    let idRunOnce;
    debug(-2,`⛹~~~~~~~~~~~~ RunServer ~~~~~~~~~~~~~~`)
    RunServer();
    debug(-2,`⛹~~~~~~~~~~~~ Server is Run ~~~~~~~~~~~~~~`)
    function RunServer() {
        if(global.NOT_RUN) {
            global.StopNetwork = true;
        }
        idRunOnce = setInterval(RunOnce, 1000);
        global.ToLog("NETWORK: " + global.NETWORK);
        global.ToLog("VERSION: " + global.UPDATE_CODE_VERSION_NUM);
        debug(-2,`⛹[((RunServer*)NETWORK]`,global.NETWORK)
        debug(-2,`⛹[((RunServer*)VERSION]`,global.UPDATE_CODE_VERSION_NUM)
        CheckConstFile();

        StartJinn();
    }

    function StartJinn() {
        debug(-5,`⛹[((StartJinn*)a]`,global.PROCESS_NAME, {
            "global.AUTODETECT_IP": global.AUTODETECT_IP,
            "global.JINN_PORT": global.JINN_PORT
        })
    if(global.AUTODETECT_IP) {
            global.JINN_IP = "";
        }


        if(!global.JINN_IP)
            global.JINN_IP = "0.0.0.0";
            global.StartPortMapping(global.JINN_IP, global.JINN_PORT, function (ip) {
            debug("-15",'!!! START !!!⛹[(jinLib*)Create]', ip)
            jinLib.Create();
            debug("-15",'!!!!! END !!!!!!⛹[(jinLib*)Create]', ip)
            global.SERVER.CanSend = 2;
            global.WALLET.Start();
            setTimeout(global.SERVER.CheckStartedBlocks, 800);
        });
    }

    function RunOnce() {
        debug(-2,`⛹[((RunOnce*)SERVER CheckOnStartComplete]`,global.SERVER)
        if(global.SERVER && global.SERVER.CheckOnStartComplete) {
            clearInterval(idRunOnce);

            updateDb(global)
            global.RunOnUpdate();

            setTimeout(function () {
                debug(-2,`~~~~~~~~~~~~~~~~~~~~⛹[((RunOnce*) StartAllProcess]`)
                global.StartAllProcess(1);
            }, 1000);

            if(global.RESTART_PERIOD_SEC)
            {
                let Period = (global.random(600) + global.RESTART_PERIOD_SEC);
                global.ToLog("SET RESTART NODE AFTER: " + Period + " sec");
                setInterval(function () {
                    debug(-2,`~~~~~~~~~~~~~~~~~~~~⛹[((RunOnce*) RestartNode]`)
                    RestartNode();
                }, Period * 1000);
            }

            setTimeout(function () {
                debug(-2,`~~~~~~~~~~~~~~~~~~~~⛹[((RunOnce*) RunStopPOWProcess]`)
                global.RunStopPOWProcess();
            }, 10000);
        }
    }

    function CheckConstFile()
    {
        if(!fs.existsSync(global.GetDataPath("const.lst")))
        {
            debug(-2,`⛹[((CheckConstFile*)const.lst not found]`, global.SAVE_CONST)
            global.SAVE_CONST(1);
        }
    }
    let glPortDebug = 49800;
    function RunFork(Path,ArrArgs,bWeb) {
        debug(-2,`⛹[((RunFork*)params]`,Path, {
            Path:Path,
            ArrArgs:ArrArgs,
            bWeb:bWeb
        })

        let Worker;
        //   if(os.platform()=="win32")        bWeb=0;
        if(bWeb && global.HTTP_HOSTING_PROCESS) {
            debug(-2,`⛹[((RunFork*)global.HTTP_HOSTING_PROCESS]`,Path, {
                Path:Path,
                ArrArgs:ArrArgs,
                bWeb:bWeb
            })
            return cluster.fork().process;
        }

        ArrArgs = ArrArgs || [];

        ArrArgs.push("MODE:" + global.MODE_RUN);

        if(global.LOCAL_RUN) {
            ArrArgs.push("LOCALRUN");
            ArrArgs.push("SHARD_NAME=" + global.SHARD_NAME);
        }

        if(global.TEST_NETWORK) {
            ArrArgs.push("TESTRUN");
        }

        if(global.TEST_JINN) {
            ArrArgs.push("TESTJINN");
        }

        ArrArgs.push("STARTNETWORK:" + global.START_NETWORK_DATE);
        ArrArgs.push("PATH:" + global.DATA_PATH);
        ArrArgs.push("HOSTING:" + global.HTTP_HOSTING_PORT);

        if(!global.USE_PARAM_JS) {
            ArrArgs.push("NOPARAMJS");
        }
        if(global.NWMODE)
            ArrArgs.push("NWMODE");
        if(global.NOALIVE)
            ArrArgs.push("NOALIVE");
        if(global.DEV_MODE)
            ArrArgs.push("DEV_MODE");
        if(global.NOHTMLPASSWORD)
            ArrArgs.push("NOPSWD");
        glPortDebug++;
        let execArgv = [];

        if(global.IS_NODE_JS) {
            let Worker;
            try {
                Worker = global.child_process.fork(Path, ArrArgs, {execArgv:execArgv});
            } catch(e) {
                global.ToError("" + e);
                return undefined;
            }
            return Worker;
        } else {
            try {
                debug(-4,'⛹[(RunFork*)treadProcess]', Path)
                Worker = treadProcess(Path);
                return Worker
            } catch(e) {
                global.ToError("" + e);
                return undefined;
            }
        }
    }

    global.RunFork = RunFork;
    return global
}