/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/

import commonJournal from "./common-journal.mjs"
import commonTr from "./common-tr.mjs"
import commonActs from "./common-acts.mjs"
import commonTx from "./common-tx.mjs"
import dapp from "./dapp.mjs"
import accounts from "./accounts.mjs"
import smart from "./smart.mjs"
import shardChannel from "./shard-channel.mjs"
import file from "./file.mjs"
import sysCore from './syscore.mjs'
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
    commonJournal(global)
    commonTr(global)
    commonActs(global)
    commonTx(global)
    dapp(global)
    accounts(global)
    smart(global)
    shardChannel(global)
    file(global)
    sysCore(global)

    global.ACCOUNTS = global.DApps.Account;
    global.SMARTS = global.DApps.Smart;
    global.SHARDS = global.DApps.Shard;
    global.SYSCORE = global.DApps.SysCore;
}


