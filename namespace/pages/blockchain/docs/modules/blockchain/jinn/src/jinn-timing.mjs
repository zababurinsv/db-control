/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

/**
 *
 * Asynchronous startup of the processing unit according to the timings
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
debug('[(self)a]', global.PROCESS_NAME)
    global.JINN_MODULES.push({InitClass: InitClass, DoNode: DoNode, DoNodeFirst: DoNodeFirst, Name: "Timing"});

//Engine context
    function InitClass(Engine) {
        Engine.StepTaskTt = {};
        Engine.StepTaskTx = {};
        Engine.StepTaskMax = {};

        Engine.GetCurrentBlockNumByTime = function () {
            return Engine.CurrentBlockNum;
        };

        Engine.ClearListToNum = function (Map, ToOldBlockNum) {
            for (var Key in Map) {
                var BlockNum = +Key;
                if (BlockNum <= ToOldBlockNum)
                    delete Map[Key];
            }
        };

        Engine.PrepareSystemTx = function () {
        };
    }

    global.BlockStatCount = 10;
    global.BlockStatCountTime = 10;

    function DoNodeFirst(Engine) {
        debug(-2, '[(DoNodeFirst*)GetCurrentBlockNumByTime]')
        Engine.CurrentBlockNum = global.JINN_EXTERN.GetCurrentBlockNumByTime();
    }

    function DoNode(Engine) {
        debug(-2, '[(DoNode*)]', {
            Del: Engine.Del,
            ROOT_NODE: Engine.ROOT_NODE,
            LastCurBlockNum: Engine.LastCurBlockNum !== CurBlockNum
        })
        if (Engine.Del) {
            return;
        }

        if (Engine.ROOT_NODE) {
            return;
        }

        var CurBlockNum = Engine.CurrentBlockNum;

        debug(-2, '[(DoNode)PrepareSystemTx]')
        Engine.PrepareSystemTx();
        debug(-2, '[(DoNode)DoSaveMain]')
        Engine.DoSaveMain();

        if (Engine.LastCurBlockNum !== CurBlockNum) {

            if (Engine.DoOnStartBlock) {
                debug(-2, '[(DoNode*)DoOnStartBlock]')
                Engine.DoOnStartBlock();
            }

            debug(-2, '[(DoNode*)InitTransferSession]')
            Engine.InitTransferSession(CurBlockNum);

            Engine.LastCurBlockNum = CurBlockNum;
            Engine.ClearListToNum(Engine.StepTaskTt, CurBlockNum - global.JINN_CONST.STEP_CLEAR_MEM);
            Engine.ClearListToNum(Engine.StepTaskTx, CurBlockNum - global.JINN_CONST.STEP_CLEAR_MEM);
            Engine.ClearListToNum(Engine.StepTaskMax, CurBlockNum - global.JINN_CONST.STEP_CLEAR_MEM);

            Engine.ClearListToNum(Engine.MiningBlockArr, CurBlockNum - global.JINN_CONST.STEP_CLEAR_MEM);
        }

        Engine.DoResend();

        Engine.DoCreateNewBlock();

        if (global.JINN_CONST.TEST_DELTA_TIMING_HASH)
            for (var Delta = 0; Delta < global.JINN_CONST.TEST_DELTA_TIMING_HASH; Delta++) {
                if (global.JINN_CONST.TEST_DIV_TIMING_HASH <= 1 || Engine.TickNum % global.JINN_CONST.TEST_DIV_TIMING_HASH === 0)
                    Engine.StepTaskMax[CurBlockNum - global.JINN_CONST.STEP_NEW_BLOCK - Delta] = 2;
            }

        for (var BlockNum = CurBlockNum - global.JINN_CONST.STEP_LAST - global.JINN_CONST.MAX_DELTA_PROCESSING; BlockNum <= CurBlockNum; BlockNum++) {
            var Delta = CurBlockNum - BlockNum;

            if (Delta >= global.JINN_CONST.STEP_TICKET)
                if (Engine.StepTaskTt[BlockNum]) {
                    debug(-2, '[(DoNode*)SendTicket]')
                    Engine.SendTicket(BlockNum);
                }

            if (Delta >= global.JINN_CONST.STEP_TX)
                if (Engine.StepTaskTx[BlockNum]) {
                    debug(-2, '[(DoNode*)SendTx]')
                    Engine.SendTx(BlockNum);
                }

            if (Delta >= global.JINN_CONST.STEP_NEW_BLOCK - global.JINN_CONST.TEST_NDELTA_TIMING_HASH)
                if (Engine.StepTaskMax[BlockNum]) {
                    debug(-2, '[(DoNode*)StartSendMaxHash]')
                    Engine.StartSendMaxHash(BlockNum);
                    Engine.StepTaskMax[BlockNum] = 0;
                }
        }
    }
}