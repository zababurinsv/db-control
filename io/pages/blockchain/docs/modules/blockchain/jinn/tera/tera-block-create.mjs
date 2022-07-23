/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

'use strict';
import logs from '../../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
export default(global) => {
    debug('[(self)a]', global.PROCESS_NAME)
    function Init(Engine) {
        Engine.BlockCreateCount = 0;
        Engine.OnAddTransactionInner = function (Tx)
        {
            if(global.CREATE_BLOCK_ON_RECEIVE)
            {
                if(Engine.BlockCreateCount < 20)
                    Engine.BlockCreateCount += 20;
            }
        };

        if(global.PROCESS_NAME === "MAIN" && global.CREATE_BLOCK_ON_RECEIVE)
        {
            let StartTime = Date.now();
            let StartBlock = global.FIRST_TIME_BLOCK;

            setInterval(function ()
            {
                var CurTime = Date.now();
                if(Engine.BlockCreateCount > 0 || GetCurrentBlockNumByTime() < 25)
                {
                    if(Engine.BlockCreateCount > 0)
                        Engine.BlockCreateCount--;
                }
                else
                {
                    var Delta = Math.floor((CurTime - StartTime) / 1000) * 1000;
                    global.FIRST_TIME_BLOCK = StartBlock + Delta;
                    global.START_NETWORK_DATE = global.FIRST_TIME_BLOCK;
                }

                StartTime = Date.now();
                StartBlock = global.FIRST_TIME_BLOCK;
            }, 1000);
        }
    }

    return {
        init:Init
    };
}