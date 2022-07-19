import cdbBase from './db/tera-db-base.mjs'
import cdbtr from './db/tera-db-journal.mjs'
import Jinn from '../src/index.mjs'

import TeraEncrypt from './tera-encrypt.mjs'
import TeraHash from "./tera-hash.mjs"
import TeraLinkServer from "./tera-link-server.mjs"
import TeraLink from "./tera-link.mjs"
import TeraLinkCode from "./tera-link-code.mjs" //updateNet
import TeraNetConstant from "./tera-net-constant.mjs"
import TeraCodeUpdater from "./tera-code-updater.mjs" //global.START_LOAD_CODE = {StartLoadVersionNum:0};
import TeraMining from "./tera-mining.mjs" // global.MAX_DELTA_TX = 5;
import TeraStat from "./tera-stat.mjs"
import TeraTests from "./tera-tests.mjs" //global.SendTestCoin = SendTestCoin;
import TeraAddr from "./tera-addr.mjs"
import TeraShardingTransfer from "./tera-sharding-transfer.mjs" //import CDBCrossTx from "./db/tera-db-cross.mjs"
import TeraShardingRun from "./tera-sharding-run.mjs"
import TeraShardingLib from "./tera-sharding-lib.mjs"
import TeraVirtualTx from "./tera-virtual-tx.mjs" //global.VIRTUAL_TYPE_TX_START = 200;
import TeraBlockCreate from "./tera-block-create.mjs"

/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

/**
 *
 * Adaptation of the JINN library with the TERA blockchain
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

export default (global = {}) => {
    debug(-3,'[(self)a]', global.PROCESS_NAME)
    return new Promise(async (resolve, reject) => {
        global.Init_DB_HEADER_FORMAT = function (Obj) {
            // console.log('~~~~~~Init_DB_HEADER_FORMAT~~~~~~~~', global)
            if(!global.UPDATE_CODE_JINN)
                return;
            Obj.OldPrevHash8 = "hash";
        }
        global.CDBParentBase = cdbBase(global)
        global.CDBBase = cdbtr(global)
        // Log(global)
        await Jinn(global)
        let teraEncrypt =  TeraEncrypt(global);
        let teraHash = TeraHash(global);
        let teraLink = TeraLink(global);
        let teraLinkCode = TeraLinkCode(global);
        let teraLinkServer = TeraLinkServer(global);
        let teraNetConstant = TeraNetConstant(global);
        let teraCodeUpdater = TeraCodeUpdater(global)
        let teraMining = TeraMining(global)
        let teraStat = TeraStat(global)
        let teraTests = TeraTests(global)
        let teraAddr = TeraAddr(global)
        let teraShardingTransfer = TeraShardingTransfer(global)
        let teraShardingRun = TeraShardingRun(global)
        let teraShardingLib = TeraShardingLib(global)
        let teraVirtualTx = TeraVirtualTx(global)
        let teraBlockCreate = TeraBlockCreate(global)

        global.JINN_WARNING = 3;

        global.JINN_CONST.LINK_HASH_PREV_HASHSUM = global.JINN_CONST.BLOCK_GENESIS_COUNT;

        global.JINN_CONST.BLOCK_PROCESSING_LENGTH = global.BLOCK_PROCESSING_LENGTH;


        global.JINN_CONST.CONSENSUS_PERIOD_TIME = global.CONSENSUS_PERIOD_TIME;
        global.JINN_CONST.START_CHECK_BLOCKNUM = 50;

        global.JINN_CONST.SHARD_NAME = global.SHARD_NAME;
        global.JINN_CONST.NETWORK_NAME = global.NETWORK;

        global.JINN_CONST.MAX_PACKET_SIZE = 1200000;
        global.JINN_CONST.MAX_PACKET_SIZE_RET_DATA = Math.floor(global.JINN_CONST.MAX_PACKET_SIZE / 2);

        global.JINN_CONST.BLOCK_GENESIS_COUNT = global.BLOCK_GENESIS_COUNT;

        global.JINN_CONST.MAX_ITEMS_FOR_LOAD = 500;

        global.JINN_CONST.MAX_BLOCK_SIZE = 300000;
        global.JINN_CONST.MAX_DEPTH_FOR_SECONDARY_CHAIN = 100;
        global.JINN_CONST.MAX_TX_SIZE = 64000;

        global.JINN_EXTERN.GetCurrentBlockNumByTime = global.GetCurrentBlockNumByTime;

        function GetEngine(MapName) {
            debug(-2,'[(GetEngine*)MapName]',MapName)
            var Engine = {};
            Engine.CanRunStat = !MapName;
            Engine.UseExtraSlot = 0;

            Engine.ip = global.JINN_IP;
            Engine.port = global.JINN_PORT;
            Engine.ID = Engine.port % 1000;
            if(!Engine.ID)
                Engine.ID = 1;

            Engine.DirectIP = 0;

            if(Engine.ip === "0.0.0.0") {
                Engine.IDArr = global.GetRandomBytes(32);
            } else {
                Engine.IDArr = global.CalcIDArr(Engine.ip, Engine.port);
            }

            Engine.IDStr = global.GetHexFromArr(Engine.IDArr);

            Engine.Header1 = 0;
            debug(-2, '[(GetEngine*) CreateNodeEngine, in]', MapName)
            global.CreateNodeEngine(Engine, MapName);
            debug(-2,'[(GetEngine*)Engine.SetOwnIP]', Engine.ip)
            if(Engine.SetOwnIP)
            {
                Engine.SetOwnIP(Engine.ip);
            }

            teraEncrypt.Init(Engine);
            teraHash.Init(Engine);
            teraLinkServer.init(Engine);
            teraLink.init(Engine);
            teraLinkCode.init(Engine);
            teraNetConstant.init(Engine);
            teraCodeUpdater.init(Engine);
            teraMining.init(Engine);
            teraStat.init(Engine);
            teraTests.init(Engine);
            teraAddr.init(Engine);
            teraShardingTransfer.init(Engine);
            teraShardingRun.init(Engine);
            teraShardingLib.init(Engine);
            teraVirtualTx.init(Engine);
            teraBlockCreate.init(Engine);
            debug(-2,'[(GetEngine*)init]')
            return Engine;
        }

        function Create(MapName)
        {
            global.ToLog("JINN Starting...");
            if(global.LOCAL_RUN)
            {
                global.JINN_CONST.UNIQUE_IP_MODE = 0;

                global.DELTA_CURRENT_TIME = 0;
                global.JINN_CONST.MIN_COUNT_FOR_CORRECT_TIME = 10;
                global.JINN_CONST.CORRECT_TIME_VALUE = 50;
                global.JINN_CONST.CORRECT_TIME_TRIGGER = 5;

                global.JINN_CONST.MAX_LEVEL_CONNECTION = 3;
                global.JINN_CONST.EXTRA_SLOTS_COUNT = 1;

                global.JINN_CONST.RECONNECT_MIN_TIME = 30;
            }

            var Engine = GetEngine(MapName);

            global.ON_USE_CONST();

            if(Engine.AddNodeAddr)
            {
                const SYSTEM_SCORE = 5000000;
                if(global.NETWORK_ID === "MAIN-JINN.TERA")
                {
                    Engine.AddNodeAddr({ip:"newkind-credits.herokuapp.comss", port:30000, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"t1.teraexplorer.com", port:30000, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"t2.teraexplorer.com", port:30000, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"t4.teraexplorer.com", port:30000, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"t5.teraexplorer.com", port:30000, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"teraexplorer.org", port:30000, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"149.154.70.158", port:30000, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"45.12.4.15", port:30000, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"212.80.218.162", port:30000, Score:SYSTEM_SCORE, System:1});
                }
                else
                if(global.NETWORK_ID === "TEST-JINN.TEST")
                {
                    Engine.AddNodeAddr({ip:"149.154.70.158", port:33000, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"212.80.217.95", port:33006, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"212.80.217.187", port:33007, Score:SYSTEM_SCORE, System:1});
                    Engine.AddNodeAddr({ip:"36.104.146.7", port:33000, System:1});
                }
                else
                if(global.NETWORK === "LOCAL-JINN")
                {
                    Engine.AddNodeAddr({ip:"127.0.0.1", port:50001, Score:SYSTEM_SCORE, System:1});
                }

                if(global.SHARD_PARAMS.SeedServerArr)
                {
                    for(var i = 0; i < SHARD_PARAMS.SeedServerArr.length; i++)
                    {
                        Engine.AddNodeAddr(SHARD_PARAMS.SeedServerArr[i]);
                    }
                }

                Engine.LoadAddrOnStart();
            }

            global.Engine = Engine;

            StartRun();
        }

        const PERIOD_FOR_RUN = 100;
        let RunNum = 0;
        function StartRun() {
            RunNum++;
            debug("-6", '⛅ [(StartRun*) RunNum]', RunNum)
            if(RunNum % 10 === 0) {
                debug("-6", '⛅ [(StartRun*) RefreshAllDB]', RunNum)
                global.SERVER.RefreshAllDB();
            }

            global.SERVER.NodeSyncStatus = {
                Header1:global.Engine.Header1,
                Header2:global.Engine.Header2,
                Block1:global.Engine.Block1,
                Block2:global.Engine.Block2,
            };

            if(global.Engine.CanRunStat) {
                debug("-6", '!!!⛅ [(StartRun*) OnStatSecond]', global.SERVER.NodeSyncStatus)
                global.Engine.OnStatSecond();
                debug("-6", '-!-!-!-⛅ [(StartRun*) OnStatSecond]', global.SERVER.NodeSyncStatus)
            }

            debug("-6", '~~~~ !!! ⛅ [(StartRun*) NextRunEngine]')
            global.NextRunEngine(global.Engine);
            debug("-6", '~~~~ -!-!-!-⛅ [(StartRun*) NextRunEngine ⛅ [(StartRun*) DoNodeAddr]]')
            global.Engine.DoNodeAddr();

            let CurTimeNum =  + global.GetCurrentTime();
            let StartTimeNum = Math.floor((CurTimeNum + PERIOD_FOR_RUN) / PERIOD_FOR_RUN) * PERIOD_FOR_RUN;
            let DeltaForStart = StartTimeNum - CurTimeNum;
            if(DeltaForStart < PERIOD_FOR_RUN / 10) {
                DeltaForStart += PERIOD_FOR_RUN;
            }
            setTimeout(StartRun, DeltaForStart);
        }
        resolve({
            Create: Create
        })
    })

}
