/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/


/**
 *
 * Checking the node speed
 *
**/


'use strict';

import logs from '../../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)
    global.JINN_MODULES.push({InitClass: InitClass, Name: "Speed"});

    global.BEST_TEST_TIME = 50;

//Engine context

    const TEST_TRANSFER_LENGTH = 100;

    function InitClass(Engine) {
        Engine.RandomTransferArr = global.GetRandomBytes(TEST_TRANSFER_LENGTH);
        Engine.StartSpeedTransfer = function (Child) {

            Child.ToLogNet("StartSpeed");

            var Data = {Arr: Engine.RandomTransferArr,};

            Engine.Send("SPEED", Child, Data, function (Child, Data) {
                if (!Data)
                    return;
                if (Data.result !== TEST_TRANSFER_LENGTH) {
                    Child.ToLogNet("Result Speed error Data.result=" + Data.result);
                    return;
                }
                var Item = Child.AddrItem;
                if (Item) {

                    Item.TestExchangeTime = global.BEST_TEST_TIME - Math.floor(Child.RetDeltaTime / 100);
                    if (Item.TestExchangeTime < 0)
                        Item.TestExchangeTime = 0;

                    Child.ToLogNet("Speed OK, Result = " + Item.TestExchangeTime);
                }
            });
        };

        Engine.SPEED_SEND = {Arr: ["byte"]};
        Engine.SPEED_RET = {result: "uint"};

        Engine.SPEED = function (Child, Data) {
            if (!Data)
                return;

            Child.ToLogNet("SPEED OK");

            var Ret = {result: Data.Arr.length};
            return Ret;
        };
    }
}