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


// const fs = require('fs');

import logs from '../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)
    const fs = global.fs
    class CommonActs
    {
        constructor() {
            return;
        }

        ClearDataBase()
        {

            for(var key in global.DApps)
            {
                global.DApps[key].ClearDataBase()
            }

            DB_RESULT.Clear()

            JOURNAL_DB.Clear()
        }

        Close()
        {

            global.JOURNAL_DB.Close()

            for(var key in global.DApps)
            {
                global.DApps[key].Close()
            }
            global.DB_RESULT.Close()
        }

        GetLastBlockNumActWithReopen()
        {
            var TXBlockNum = global.JOURNAL_DB.GetLastBlockNumAct();
            if(!TXBlockNum || TXBlockNum <= 0)
            {
                this.Close()
                TXBlockNum = global.JOURNAL_DB.GetLastBlockNumAct()
            }
            return TXBlockNum;
        }

        GetBufferFromActHashes(Struct)
        {
            var Buf = BufLib.GetBufferFromObject(Struct, this.FORMAT_MODE_200, 80, this.WorkStructMode200);
            return Buf;
        }
        GetActHashesFromBuffer(Buf)
        {
            var Item = BufLib.GetObjectFromBuffer(Buf, this.FORMAT_MODE_200, this.WorkStructMode200);
            return Item;
        }

    };

    global.COMMON_ACTS = new CommonActs;

}