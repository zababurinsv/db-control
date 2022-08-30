/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/

"use strict";
import isEmpty from "../../../isEmpty/isEmpty.mjs";
import constant from "../../core/constant.mjs"
import library from "../../core/library.mjs"
import system from '../../system/index.mjs'
import childProcess from "../child-process.mjs"
import jinnLib from "../../jinn/tera/index.mjs"
import txProcessUtil from '../tx-process-util.mjs'
import BufferBrowser from '../../../../modules/buffer/index.mjs'
import logs from '../../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
(async () => {
    global.PROCESS_NAME = "TX";
    debug('[(self)a]', global.PROCESS_NAME)
    global.buffer = BufferBrowser
    global.IS_NODE_JS = (typeof process !== "undefined")?1:0
    if(!global.IS_NODE_JS) {
        global.http = {

        }
        global.net = {

        }
        global.crypto = {


        }
        global.cluster = {

        }
        global.vm = {

        }
        global.https = {

        }
        global.zlib = {

        }
        global['child_process'] = {

        }
        global.querystring = {

        }
        global.os = {
            platform: () => {
                return ua.default['user-agent']().os.name
            },
            arch: () => {
                return ua.default['user-agent']().os.version
            },
            release: () => {
                console.warn('проверить релиз')
                console.log(ua.default['user-agent']().browser.version)
                console.log(ua.default['user-agent']().browser.name)
                return ua.default['user-agent']().os.version
            },
            cpus: () => {
                let num = navigator.hardwareConcurrency || 1
                let cpus = []
                for (let i = 0; i < num; i++) {
                    cpus.push({
                        model: '',
                        speed: 0,
                        times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
                    })
                }
                return cpus
            }
        }
        global.fs = {
            stat: (...args) => {
                console.log('~~~~~~ stat ~~~~~~', args)
            },
            existsSync: (...args) => {
                console.log('~~~~~~ existsSync ~~~~~~', args)
            },
            mkdirSync: (...args) => {
                console.log('~~~~~~ mkdirSync ~~~~~~', args)
            },
            watch: (...args) => {
                console.log('~~~~~~ watch ~~~~~~', args)
            },
            openSync: (...args)=> {
                console.log('~~~~~~ openSync ~~~~~~', args)
            },
            writeSync: (...args) => {
                console.log('~~~~~~ writeSync ~~~~~~', args)
            },
            closeSync: (...args) => {
                console.log('~~~~~~ closeSync ~~~~~~', args)
            }
        }
        global.process = {
            on:(...args) => {
                console.log('process on: ', args)
            },
            hrtime: (...args) => {
                console.log('hrtime: ', args)
            },
            versions: {
                node: `${ua.default['user-agent']().browser.name}.${ua.default['user-agent']().browser.version}`
            },
            argv: [],
            cwd: (...args) => {
                console.log('~~~!~~~ cwd ~~~!~~~', args)
                return import.meta.url
            }
        }
        global.url = {

        }
        if(!global.DATA_PATH || global.DATA_PATH==="")
            global.DATA_PATH="/DATA-BROWSER";
        global.CODE_PATH=import.meta.url;
        global.HTTP_PORT_NUMBER = isEmpty(location.port)? location.origin: location.port;
    } else {
        global.os = await import("os")
        global.fs = await import("fs")
        global.crypto = await import("crypto")
        global.zlib = await import('zlib');
        global.http = await import('http')
        global.net = await import('net')
        global.url = await import('url')
        global.querystring = await import('querystring')
        global.cluster = await import('cluster')
        global.vm = await import('vm')
        global['child_process'] = await import('child_process')
        global['https'] = await import('https')
        global.process = process
        process.blockchain = global.process
        if(!global.DATA_PATH || global.DATA_PATH==="")
            global.DATA_PATH="../DATA-BROWSER";
    }
    const crypto = global.crypto
    const fs = global.fs
    constant(global)
    await library(global)
    global.DATA_PATH = global.GetNormalPathString(global.DATA_PATH);
    global.CODE_PATH = global.GetNormalPathString(global.CODE_PATH);
    global.READ_ONLY_DB = 0;

    global.TEST_ACC_HASH_MODE = 0;
    let PathTestHash3 = global.GetDataPath("DB/accounts-hash3-test");
    if(fs.existsSync(PathTestHash3))
    {
        global.TEST_ACC_HASH_MODE = 1;
        ToLog("--------------------------");
        ToLog("===TEST_ACC_HASH_MOD ON===");
        ToLog("--------------------------");
    }

    let JinnLib  = await jinnLib(global)
    let Map = {"Block":1, "BlockDB":1, "Log":1, };
    JinnLib.Create(Map);
    await system(global)
    childProcess(global)
    txProcessUtil(global)

    global.TreeFindTX = new global.STreeBuffer(30 * 1000, global.CompareItemHashSimple, "string");

    process.on('message', function (msg)
    {
        switch(msg.cmd)
        {
            // case "FindTX":
            //     console.log("FindTX",JSON.stringify(msg,"",4));
            //     global.TreeFindTX.SaveValue(msg.TX, msg);
            //     break;
            case "SetSmartEvent":
                //console.log("Smart:" + msg.Smart);
                global.TreeFindTX.SaveValue("Smart:" + msg.Smart, 1);
                break;

            default:
                break;
        }
    });

    global.SetFindTX=function(Params,F)
    {
        //console.log("SetFindTX",JSON.stringify(Params,"",4));
        Params.F=F;
        global.TreeFindTX.SaveValue(Params.TX, Params);
    };

    setInterval(global.PrepareStatEverySecond, 1000);

    global.SetStatMode = function (Val)
    {
        global.STAT_MODE = Val;
        return global.STAT_MODE;
    };



    global.bShowDetail = 0;
    global.StopTxProcess = 0;


    global.ClearDataBase = ClearDataBase;
    function ClearDataBase()
    {
        global.ToLogTx("=Dapps ClearDataBase=", 2);

        CLEAR_ALL_TR_BUFFER();
        COMMON_ACTS.ClearDataBase();
    }

    global.RewriteAllTransactions = RewriteAllTransactions;
    function RewriteAllTransactions(bSilent)
    {
        global.ToLogTx("*************RewriteAllTransactions");

        ClearDataBase();
        return 1;
    }

    global.ReWriteDAppTransactions = ReWriteDAppTransactions;
    function ReWriteDAppTransactions(Params,bSilent)
    {
        StopTxProcess = 0;
        let StartNum = Params.StartNum;

        global.ToLogTx("ReWriteDAppTransactions from: " + StartNum);

        global.ACCOUNTS.BadBlockNumChecked = global.SERVER.GetMaxNumBlockDB() - 1;
        global.ACCOUNTS.BadBlockNumHash = 0;

        CLEAR_ALL_TR_BUFFER();

        global.TR_DATABUF_COUNTER = 0;

        while(1)
        {
            let LastBlockNum = global.JOURNAL_DB.GetLastBlockNumAct();
            if(LastBlockNum < StartNum)
                break;
            if(LastBlockNum <= 0)
            {
                ToLogTrace("STOP ReWriteDAppTransactions. Find LastBlockNum=" + LastBlockNum);
                RewriteAllTransactions(1);
            }

            DeleteLastBlockTx();
        }
    }

    function DeleteLastBlockTx()
    {
        let LastBlockNum = global.JOURNAL_DB.GetLastBlockNumAct();
        if(LastBlockNum > 0)
        {
            BLOCK_DELETE_TX(LastBlockNum);
        }
    }



    let ErrorInitCount = 0;
    class CTXProcess
    {
        constructor()
        {
            let LastItem = global.JOURNAL_DB.GetLastBlockNumItem();
            let JMaxNum = global.JOURNAL_DB.GetMaxNum();
            let AccountLastNum = global.ACCOUNTS.DBState.GetMaxNum();
            if(!LastItem && (AccountLastNum > 16 || JMaxNum !==  - 1))
            {
                global.ToLogTx("Error Init CTXProcess  AccountLastNum=" + AccountLastNum + "  JMaxNum=" + JMaxNum)
                ErrorInitCount++

                if(JMaxNum !==  - 1)
                {
                    global.ToLogTx("Delete jrow at: " + JMaxNum)
                    global.JOURNAL_DB.DBJournal.DeleteFromNum(JMaxNum)
                }

                return;
            }
            let LastBlockNum = 0;
            if(LastItem)
                LastBlockNum = LastItem.BlockNum

            ErrorInitCount = 0

            global.ToLogTx("Init CTXProcess: " + LastBlockNum)

            if(LastBlockNum > 0)
                ReWriteDAppTransactions({StartNum:LastBlockNum - 10}, 1)

            this.ErrorAccHash = 0
            this.TimeWait = 0
        }

        Run()
        {
            if(global.StopTxProcess)
                return;

            let StartTime = Date.now();
            if(this.TimeWait)
            {
                if(StartTime - this.TimeWait < 600)
                    return;
            }
            this.TimeWait = 0
            if(this.ErrorAccHash >= 1000)
            {
                global.ToLogTx("FORCE CalcMerkleTree")
                global.ACCOUNTS.CalcMerkleTree(1)
                this.ErrorAccHash = 0
                return;
            }

            global.TR_DATABUF_COUNTER = 0

            for(let i = 0; i < 1000; i++)
            {
                global.BeginTransactionDB("Chain")
                let ResultBlock = this.RunItem();

                if(!ResultBlock || typeof ResultBlock === "number")
                {
                    global.RollbackTransactionDB("Chain")
                    this.TimeWait = Date.now()

                    if(!ResultBlock)
                    {
                    }
                    else
                    if(ResultBlock < 0)
                    {
                        DeleteLastBlockTx()
                    }

                    if(ResultBlock ===  - 2)
                    {
                        continue;
                    }

                    break;
                }

                CommitTransactionDB("Chain", {BlockNumStart:ResultBlock.BlockNum, BlockFinish:ResultBlock})

                if(Date.now() - StartTime > 1000)
                    break;

                if(global.TR_DATABUF_COUNTER >= 20 * 1e6)
                    break;
            }
        }

        RunItem()
        {
            let LastItem = global.JOURNAL_DB.GetLastBlockNumItem();
            if(!LastItem)
            {
                if(global.SERVER.GetMaxNumBlockDB() < global.BLOCK_PROCESSING_LENGTH2)
                    return 0;

                let JMaxNum = global.JOURNAL_DB.GetMaxNum();
                if(JMaxNum >= 0)
                {
                    ToLog("Detect run Error. JMaxNum=" + JMaxNum + " Need restart.")
                    if(!this.StartRestart)
                    {
                        setTimeout(function ()
                        {
                            Exit()
                        }, 10000)
                        this.StartRestart = 1
                    }

                    return 0;
                }

                return this.DoBlock(1);
            }

            let PrevBlockNum = LastItem.BlockNum;
            let NextBlockNum = PrevBlockNum + 1;
            let Block = global.SERVER.ReadBlockHeaderDB(NextBlockNum);
            if(!Block)
                return 0;

            return this.DoBlock(NextBlockNum, Block.PrevSumHash, LastItem);
        }

        DoBlock(BlockNum, CheckSumHash, LastHashData)
        {
            let PrevBlockNum = BlockNum - 1;
            if(global.glStopTxProcessNum && BlockNum >= global.glStopTxProcessNum)
            {
                if(global.WasStopTxProcessNum !== BlockNum)
                    global.ToLogTx("--------------------------------Stop TX AT NUM: " + BlockNum)
                global.WasStopTxProcessNum = BlockNum
                return 0;
            }

            if(BlockNum >= global.BLOCK_PROCESSING_LENGTH2 && PrevBlockNum)
            {
                if(!LastHashData)
                {
                    global.ToLogTx("SumHash:!LastHashData : DeleteTX on Block=" + PrevBlockNum, 3)

                    return  - 1;
                }

                if(!IsEqArr(LastHashData.SumHash, CheckSumHash))
                {
                    global.ToLogTx("SumHash:DeleteTX on Block=" + PrevBlockNum, 4)

                    return  - 2;
                }

                let AccHash = global.ACCOUNTS.GetCalcHash();
                if(!IsEqArr(LastHashData.AccHash, AccHash))
                {
                    if(this.ErrorAccHash < 5)
                        global.ToLogTx("AccHash:DeleteTX on Block=" + PrevBlockNum + " GOT:" + GetHexFromArr(LastHashData.AccHash).substr(0, 8) + " NEED:" + GetHexFromArr(AccHash).substr(0,
                            8), 3)

                    this.ErrorAccHash++

                    return  - 3;
                }
            }

            let Block = global.SERVER.ReadBlockDB(BlockNum);
            if(!Block)
                return 0;

            if(CheckSumHash && !IsEqArr(Block.PrevSumHash, CheckSumHash))
            {
                global.ToLogTx("DB was rewrited on Block=" + BlockNum, 2)
                return 0;
            }

            if(Block.BlockNum !== BlockNum)
            {
                ToLogOne("Error read block on " + BlockNum)
                return 0;
            }

            this.ErrorAccHash = 0

            if(BlockNum % 100000 === 0 || bShowDetail)
                global.ToLogTx("CALC: " + BlockNum)
            BLOCK_PROCESS_TX(Block)

            RunTestAccHash(BlockNum)

            return Block;
        }
    }

    global.OnBadAccountHash = function (BlockNum,BlockNumHash)
    {
        let MinBlockNum = global.SERVER.GetMaxNumBlockDB() - 10000;
        if(MinBlockNum < 0)
            MinBlockNum = 0;
        if(global.ACCOUNTS.BadBlockNumChecked < MinBlockNum)
            global.ACCOUNTS.BadBlockNumChecked = MinBlockNum;

        if(BlockNum > global.ACCOUNTS.BadBlockNumChecked)
        {
            if(global.ACCOUNTS.BadBlockNum < BlockNum)
                global.ACCOUNTS.BadBlockNum = BlockNum;
            if(!global.ACCOUNTS.BadBlockNumHash || BlockNumHash < global.ACCOUNTS.BadBlockNumHash)
            {
                global.ACCOUNTS.BadBlockNumHash = BlockNumHash;

                ToLog("****FIND BAD ACCOUNT HASH IN BLOCK: " + BlockNumHash + " DO BLOCK=" + BlockNum, 3);
            }
        }
    }

    function CheckBadsBlock()
    {
        if(global.ACCOUNTS.BadBlockNumHash)
        {
            let StartRewrite = global.ACCOUNTS.BadBlockNumHash - 2 * global.PERIOD_ACCOUNT_HASH - 1;

            if(StartRewrite < 0)
                StartRewrite = 0;
            global.ToLogTx("---CheckBadsBlock: Rewrite tx from BlockNum=" + StartRewrite, 3);

            global.ACCOUNTS.CalcMerkleTree(1);

            ReWriteDAppTransactions({StartNum:StartRewrite}, 1);
        }
    }

    let TxProcess = undefined;
    let TX_RUN_PERIOD = 50;
    function DoRunTXProcess()
    {
        if(!TxProcess)
        {
            TxProcess = new CTXProcess();
            if(ErrorInitCount)
            {
                TxProcess = undefined;
            }
        }

        if(global.SERVER)
        {
            global.SERVER.RefreshAllDB();
        }

        if(TxProcess)
            TxProcess.Run();

        setTimeout(DoRunTXProcess, TX_RUN_PERIOD * (1 + 10 * ErrorInitCount));
    }
    setTimeout(DoRunTXProcess, 2000);

    setInterval(function ()
        {
            CheckBadsBlock();
        }
        , 60 * 1000);

    function RunTestAccHash(BlockNum)
    {
        if(global.TEST_ACC_HASH_MODE && BlockNum % PERIOD_ACCOUNT_HASH === 0)
        {
            let Item = global.ACCOUNTS.GetAccountHashItem(BlockNum);
            let ItemTest = global.ACCOUNTS.GetAccountHashItemTest(BlockNum);
            if(ItemTest)
            {
                if(!Item || CompareArr(Item.AccHash, ItemTest.AccHash) !== 0)
                {
                    ToLog("======BADS COMPARE TEST ACCHASH TABLE on Block:" + BlockNum);

                    if(!global.glStopTxProcessNum)
                        global.glStopTxProcessNum = BlockNum;
                }
            }
        }
    }


//***************************************************************************
//Debug log
    /*
    global.DebugEvent=function (Obj,BlockNum,TrNum)
    {
        console.log(BlockNum,":",TrNum,"Event:",Obj);
    };
    //global.glStopTxProcessNum=45582;

    //***************************************************************************
    //*/
})()