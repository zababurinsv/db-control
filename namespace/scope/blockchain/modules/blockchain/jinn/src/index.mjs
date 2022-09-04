import terabuf from "../extlib/terabuf.mjs"
import cacheBlock from "./lib/cache-block.mjs"
import timeSync from "./lib/time-sync.mjs"
import jinnDbBase from "./db/jinn-db-base.mjs"
import jinnDbRow from "./db/jinn-db-row.mjs"
import jinnDbItem from "./db/jinn-db-item.mjs"
import jinnDbItemFixed from "./db/jinn-db-item-fixed.mjs"
import jinnDbChain from "./db/jinn-db-chain.mjs"
import cacheDb from "./db/cache-db.mjs"
import jinnDbCacheBody from "./db/jinn-db-cache-body.mjs"
import jinnDbCacheBlock from "./db/jinn-db-cache-block.mjs"
import sha3 from '../extlib/sha3.mjs'
import jinnLog from "./jinn-log.mjs"
import jinnStat from "./jinn-stat.mjs"
import jinnBlockDb from "./jinn-block-db.mjs"
import jinnConnectScore from "./jinn-connect-score.mjs"
import jinnConnect from "./jinn-connect.mjs"
import jinnConnectItem from "./jinn-connect-item.mjs"
import jinnConnectHandshake from "./jinn-connect-handshake.mjs"
import jinnConnectSpeed from "./jinn-connect-speed.mjs"
import jinnConnectAddr from "./jinn-connect-addr.mjs"
import jinnConnectHot from "./jinn-connect-hot.mjs"
import jinnSession from "./jinn-session.mjs"
import jinnTicket from "./jinn-ticket.mjs"
import jinnTx from "./jinn-tx.mjs"
import jinnTxErr from "./jinn-tx-err.mjs"
import jinnTxPriority from "./jinn-tx-priority.mjs"
import jinnTxControl from "./jinn-tx-control.mjs"
import jinnTxResend from "./jinn-tx-resend.mjs"
import jinnBlock from "./jinn-block.mjs"
import jinnBlockMining from "./jinn-block-mining.mjs"
import jinnConsensusChain from "./jinn-consensus-chain.mjs"
import jinnConsensus from "./jinn-consensus.mjs"
import jinnConsensusBoost from "./jinn-consensus-boost.mjs"
import jinnNetCache from "./jinn-net-cache.mjs"
import jinnStartupLoader from "./jinn-startup-loader.mjs"
import jinnNet from "./jinn-net.mjs"
import jinnSerialize from "./jinn-serialize.mjs"
import jinnZip from "./jinn-zip.mjs"
import jinnFilter from "./jinn-filter.mjs"
import jinnNetSocket from "./jinn-net-socket.mjs"
import jinnTiming from "./jinn-timing.mjs"
import jinnTimeSync from "./jinn-time-sync.mjs"
import jinnSharding from "./jinn-sharding.mjs"
import RBTree from "../extlib/RBTree.mjs"
import logs from '../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    const main = -7
    const path = import.meta.url
    const from = path.search('/jinn');
    const to = path.length;
    const url = path.substring(from,to);
    const count = (typeof maxCount === "string") ? parseInt(maxCount,10): (maxCount < 0)? main: maxCount
    // logs.assert(count, url, id, props, data, ...args)
}
export default async (global) => {
    debug(-2, '⭐[(self)a]')
    const process = global.process
    if(!global.ZERO_ARR_32)
        global.ZERO_ARR_32 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if(!global.MAX_ARR_32)
        global.MAX_ARR_32 = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255];

    global.JINN_MODULES = [];
    debugger
    if(!global.sha3) { sha3(global) }
    RBTree(global)
    if(!global.SerializeLib) { terabuf(global) }
    cacheBlock(global)
    timeSync(global)
    if(global.EMULATE_FILE) { jinnDbBase(global) }  //set global.CDBBase (not use for TERA)
    jinnDbRow(global)
    jinnDbItem(global)
    jinnDbItemFixed(global)
    jinnDbChain(global)
    cacheDb(global)
    jinnDbCacheBody(global)
    jinnDbCacheBlock(global)
    jinnLog(global)
    jinnStat(global)
    jinnBlockDb(global)
    jinnConnectScore(global)
    jinnConnect(global)
    jinnConnectItem(global)
    jinnConnectHandshake(global)
    jinnConnectSpeed(global)
    jinnConnectAddr(global)
    jinnConnectHot(global)
    jinnSession(global)
    jinnTicket(global)
    jinnTx(global)
    jinnTxErr(global)
    jinnTxPriority(global)
    jinnTxControl(global)
    jinnTxResend(global)
    jinnBlock(global)
    jinnBlockMining(global)
    jinnConsensusChain(global)
    jinnConsensus(global)
    jinnConsensusBoost(global)
    jinnNetCache(global)
    jinnStartupLoader(global)
    jinnNet(global)
    jinnSerialize(global)
    await jinnZip(global)
    jinnFilter(global)
    jinnNetSocket(global)
    jinnTiming(global)
    jinnTimeSync(global)
    jinnSharding(global)
    global.JINN_WARNING = 0;
    global.DEBUG_ID = 0;
    if(global.DEBUG_TRAFFIC === undefined)
        global.DEBUG_TRAFFIC = 1;


    global.JINN_EXTERN = {
        GetCurrentBlockNumByTime:function () {
            return 0;
        }
    };

    if(global.DELTA_CURRENT_TIME === undefined)
        global.DELTA_CURRENT_TIME = 0;

    global.JINN_NET_CONSTANT = {NetConstVer:0};
    global.CODE_VERSION = {VersionNum:0};


    global.SHARD_STR_TYPE = "str8";
    if(!global.JINN_CONST) { global.JINN_CONST = {}; }


    global.JINN_CONST.MULT_TIME_PERIOD = 1;

    global.JINN_CONST.UNIQUE_IP_MODE = 0;


    global.JINN_CONST.MIN_COUNT_FOR_CORRECT_TIME = 10;
    global.JINN_CONST.CORRECT_TIME_TRIGGER = 1000;
    global.JINN_CONST.CORRECT_TIME_VALUE = 100;
    global.JINN_CONST.INFLATION_TIME_VALUE = 20;

    global.JINN_CONST.START_CHECK_BLOCKNUM = 20;
    global.JINN_CONST.START_ADD_TX = 20;

    global.JINN_CONST.CONSENSUS_PERIOD_TIME = 1000;



    global.JINN_CONST.MAX_BLOCK_SIZE = 230 * 1024;
    global.JINN_CONST.MAX_TX_SIZE = 64000;
    global.JINN_CONST.BLOCK_GENESIS_COUNT = 16;
    global.JINN_CONST.START_BLOCK_NUM = global.JINN_CONST.BLOCK_GENESIS_COUNT + 4;
    global.JINN_CONST.DELTA_BLOCKS_FOR_CREATE = 5;
    global.JINN_CONST.NETWORK_NAME = "JINN";
    global.JINN_CONST.PROTOCOL_MODE = 0;
    global.JINN_CONST.SHARD_NAME = "SHARD";



    global.JINN_CONST.MAX_CONNECT_COUNT = 20;
    global.JINN_CONST.MAX_LEVEL_CONNECTION = 6;
    global.JINN_CONST.EXTRA_SLOTS_COUNT = 3;

    global.JINN_CONST.MAX_LEVEL_NODES = 100;

    global.JINN_CONST.MAX_RET_NODE_LIST = 100;

    if(!global.ADD_EXTRA_SLOTS)
        global.ADD_EXTRA_SLOTS = 0;

    global.JINN_CONST.MAX_LEVEL_ALL = function ()
    {
        return global.JINN_CONST.MAX_LEVEL_CONNECTION + global.JINN_CONST.EXTRA_SLOTS_COUNT + global.ADD_EXTRA_SLOTS;
    }

    global.JINN_CONST.MAX_ERR_PROCESS_COUNT = 30;
    global.JINN_CONST.RECONNECT_MIN_TIME = 300;
    global.JINN_CONST.MAX_CONNECT_TIMEOUT = 30;


    global.JINN_CONST.MAX_PACKET_SIZE = 256 * 1024;
    global.JINN_CONST.MAX_PACKET_SIZE_RET_DATA = Math.floor(global.JINN_CONST.MAX_PACKET_SIZE / 2);

    global.JINN_CONST.MAX_WAIT_PERIOD_FOR_STATUS = 10 * 1000;

    global.JINN_CONST.METHOD_ALIVE_TIME = 5 * 1000;


    global.JINN_CONST.MAX_LEADER_COUNT = 4;


    global.JINN_CONST.CACHE_PERIOD_FOR_INVALIDATE = 5;


    global.JINN_CONST.TT_TICKET_HASH_LENGTH = 6;
    global.JINN_CONST.MAX_TRANSACTION_COUNT = 3000;
    global.JINN_CONST.MAX_TRANSFER_TX = 400;

    global.JINN_CONST.MAX_TRANSFER_TT = 10 * global.JINN_CONST.MAX_TRANSFER_TX;


    global.JINN_CONST.MAX_CACHE_BODY_LENGTH = 50;

    if(!global.JINN_MAX_MEMORY_USE)
        global.JINN_MAX_MEMORY_USE = 500;

    global.JINN_CONST.MAX_ITEMS_FOR_LOAD = 100;
    global.JINN_CONST.MAX_DEPTH_FOR_SECONDARY_CHAIN = 100;


    global.JINN_CONST.LINK_HASH_PREV_HASHSUM = 0;
    global.JINN_CONST.LINK_HASH_DELTA = 1;

    global.JINN_CONST.MAX_DELTA_PROCESSING = 1;


    global.JINN_CONST.STEP_ADDTX = 0;
    global.JINN_CONST.STEP_TICKET = 1;
    global.JINN_CONST.STEP_TX = 1;
    global.JINN_CONST.STEP_NEW_BLOCK = 2;
    global.JINN_CONST.STEP_SAVE = 3;
    global.JINN_CONST.STEP_LAST = 4;
    global.JINN_CONST.STEP_CLEAR_MEM = 20;

    global.JINN_CONST.STEP_RESEND = 5;
    global.JINN_CONST.COUNT_RESEND = 5;

    global.JINN_CONST.STEP_CALC_POW_LAST = 1;
    global.JINN_CONST.STEP_CALC_POW_FIRST = 8;



    global.JINN_CONST.TEST_COUNT_BLOCK = 0;
    global.JINN_CONST.TEST_COUNT_TX = 0;



    global.JINN_CONST.TEST_DELTA_TIMING_HASH = 1;
    global.JINN_CONST.TEST_DIV_TIMING_HASH = 3;
    global.JINN_CONST.TEST_NDELTA_TIMING_HASH = 1;

    global.JINN_CONST.RUN_RESET = 0;
    global.JINN_CONST.HOT_BLOCK_DELTA = 8;


    global.JINN_CONST.TX_PRIORITY_MODE = 1;
    global.JINN_CONST.TX_PRIORITY_RND_SENDER = 0;
    global.JINN_CONST.TX_PRIORITY_LENGTH = 100;

    global.JINN_CONST.TX_BASE_VALUE = 1e9;
    global.JINN_CONST.TX_FREE_COUNT = 10;
    global.JINN_CONST.TX_FREE_BYTES_MAX = 16000;

    global.JINN_CONST.TX_CHECK_OPERATION_ID = 1;
    global.JINN_CONST.TX_CHECK_SIGN_ON_ADD = 1;
    global.JINN_CONST.TX_CHECK_SIGN_ON_TRANSFER = 0;

    global.JINN_CONST.MAX_ONE_NODE_TX = 0;

    global.JINN_CONST.TEST_MODE_1 = 0;
    global.JINN_CONST.TEST_MODE_2 = 0;
    global.JINN_CONST.TEST_MODE_3 = 0;

    global.JINN_CONST.MIN_TIME_SEND_TT_PERIOD = 500;
    global.JINN_CONST.MAX_TIME_SEND_TT_PERIOD = 1500;
    global.JINN_CONST.DELTA_TIME_NEW_BLOCK = 500;

    global.JINN_CONST.MAX_CHILD_PROCESS_TIME = 10;

    global.JINN_CONST.BLOCK_CREATE_INTERVAL = global.BLOCK_CREATE_INTERVAL;


    global.JINN_CONST.MAX_CROSS_MSG_COUNT = 300;
    global.JINN_CONST.MAX_CROSS_RUN_COUNT = 300;



    global.MAX_BUSY_VALUE = 200;
    global.MAX_SHA3_VALUE = 300;


    function CreateNodeEngine(Engine,MapName) {
        for(let i = 0; i < global.JINN_MODULES.length; i++) {
            let module = global.JINN_MODULES[i];
            if(MapName && (!module.Name || !MapName[module.Name])) {
                continue;
            }
            module.USE_MODULE = 1;
            if(module.InitClass) {
                debug("-1", '⭐[(CreateNodeEngine*) InitClass]',module.Name)
                module.InitClass(Engine);
            }

        }
        for(let i = 0; i < global.JINN_MODULES.length; i++) {
            let module = global.JINN_MODULES[i];
            if(MapName && (!module.Name || !MapName[module.Name])) {
                continue;
            }
            if(module.InitAfter) {
                module.InitAfter(Engine);
            }
        }
    }


    function NextRunEngine(NetNodeArr) {
        for(let i = 0; i < global.JINN_MODULES.length; i++) {
            let module = global.JINN_MODULES[i];
            debug("-2", '~~~~⭐[(NextRunEngine*)DoRun]', global.JINN_MODULES[i].Name,'USE_MODULE: ',!!module.USE_MODULE,"DoRun: ",(!!module.DoRun),"DoNodeFirst", (!!module.DoNodeFirst))
            if(!module.USE_MODULE) {
                continue;
            }

            if(module.DoRun) {
                module.DoRun();
            }

            if(module.DoNodeFirst) {
                if(NetNodeArr.ID !== undefined) {
                    debug("-2", '~~~~~~~⭐[(DoNodeFirst)DoRun]',NetNodeArr)
                    module.DoNodeFirst(NetNodeArr);
                } else {
                    for(let n = 0; n < NetNodeArr.length; n++) {
                        let Node = NetNodeArr[n];
                        debug(-4, '~~⭐[(DoNodeFirst*)a]', Node, {
                            Del: (!Node.Del)
                        })
                        debug("-2", '~~~~~~~⭐[(DoNodeFirst)DoRun]',Node)
                        if(!Node.Del) {
                            module.DoNodeFirst(Node);
                        }
                    }
                }
            }
        }

        for(let i = 0; i < global.JINN_MODULES.length; i++) {
            let module = global.JINN_MODULES[i];
            debug("-3", '~~~~~~~~~~~~~~~~⭐[(NextRunEngine*)DoNode]', global.JINN_MODULES[i].Name,'USE_MODULE: ',!!module.USE_MODULE,"DoNode: ",(!!module.DoNode),"NetNodeArr.ID", (!!NetNodeArr.ID))
            if(!module.USE_MODULE) {
                continue;
            }

            if(module.DoNode) {
                let startTime;
                if(typeof process === "object") {
                    startTime = process.hrtime();
                }

                if(NetNodeArr.ID !== undefined) {
                    debug("-3", '~~~~~~~~~~~~~~~~~~~~~⭐[(DoNodeFirst*)NetNodeArr]', NetNodeArr.ip)
                    module.DoNode(NetNodeArr);
                } else {
                    for(let n = 0; n < NetNodeArr.length; n++) {
                        let Node = NetNodeArr[n];
                        if(!Node.Del) {
                            debug("-3", '~~~~~⭐[(DoNodeFirst*)Node del]', Node)
                            module.DoNode(Node);
                        }
                    }
                }


                if(typeof process === "object")
                {
                    let Time = process.hrtime(startTime);
                    let deltaTime = Time[0] * 1000 + Time[1] / 1e6;

                    let Name = "DONODE:" + module.Name;
                    if(!global.JINN_STAT.Methods[Name])
                        global.JINN_STAT.Methods[Name] = 0;
                    global.JINN_STAT.Methods[Name] += deltaTime;
                    global.JINN_STAT.DoNode += deltaTime;
                }
            }
        }
    }

    global.CreateNodeEngine = CreateNodeEngine;
    global.NextRunEngine = NextRunEngine;

    return global
}
