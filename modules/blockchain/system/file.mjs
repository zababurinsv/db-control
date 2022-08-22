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
// Support module for storing files on the blockchain
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
    const DAPP = global.DApp
    global.TYPE_TRANSACTION_FILE = 5;

    global.FORMAT_FILE_CREATE = "{Type:byte,Name:str,ContentType:str,Reserve:arr10,Data:tr}";

    class FileApp extends DAPP
    {
        constructor()
        {
            super()
        }

        OnProcessTransaction(Block, Body, BlockNum, TrNum, ContextFrom)
        {
            return true;
        }

        GetFormatTransaction(Type)
        {
            return FORMAT_FILE_CREATE;
        }
    }
    var App = new FileApp;
    global.DApps["File"] = App;
    global.DAppByType[global.TYPE_TRANSACTION_FILE] = App;

}
