/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/


"use strict";

// var fs = require("fs");
import updateNet from "../../core/update-net.mjs";

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
    updateNet(global)
    function Init(Engine)
    {
        global.SERVER.LastEvalCodeNum = 0;

        global.SERVER.CheckLoadCodeTime = function ()
        {
            if(global.START_LOAD_CODE.StartLoadNode && global.START_LOAD_CODE.StartLoadVersionNum)
            {
                var Delta = new Date() - global.START_LOAD_CODE.StartLoadVersionNumTime;
                if(Delta > 20 * 1000)
                {
                    ToError("Cannot load code version:" + global.START_LOAD_CODE.StartLoadVersionNum + " from node: " + global.START_LOAD_CODE.StartLoadNode.ip + ":" + global.START_LOAD_CODE.StartLoadNode.port);
                    global.SERVER.ClearLoadCode();
                }
            }
        };
        global.SERVER.ClearLoadCode = function ()
        {
            global.START_LOAD_CODE.StartLoad = undefined;
            global.START_LOAD_CODE.StartLoadVersionNum = 0;
            global.START_LOAD_CODE.StartLoadVersionNumTime = 0;
        };

        global.SERVER.StartLoadCode = function (Node,CodeVersion)
        {

            var VersionNum = CodeVersion.VersionNum;

            global.START_LOAD_CODE.StartLoad = CodeVersion;
            global.START_LOAD_CODE.StartLoadNode = Node;
            global.START_LOAD_CODE.StartLoadVersionNum = VersionNum;
            global.START_LOAD_CODE.StartLoadVersionNumTime = new Date();

            var fname = global.GetDataPath("Update/wallet-" + VersionNum + ".zip");
            if(fs.existsSync(fname)) {
                global.SERVER.UseCode(VersionNum, false);
            }
            else
            {
                global.SERVER.StartGetNewCode(Node, VersionNum);
            }
        };

        global.SERVER.DownloadingNewCodeToPath = function (Node,Data,VersionNum)
        {
            var fname = global.GetDataPath("Update/wallet-" + VersionNum + ".zip");
            if(!fs.existsSync(fname)) {
                var Hash = shaarr(Data);
                if(CompareArr(Hash, global.START_LOAD_CODE.StartLoad.Hash) === 0)
                {
                    var file_handle = fs.openSync(fname, "w");
                    fs.writeSync(file_handle, Data, 0, Data.length);
                    fs.closeSync(file_handle);
                    fname = global.GetDataPath("Update/wallet.zip");
                    file_handle = fs.openSync(fname, "w");
                    fs.writeSync(file_handle, Data, 0, Data.length);
                    fs.closeSync(file_handle);

                    global.SERVER.UseCode(VersionNum, global.USE_AUTO_UPDATE);

                    return 1;
                }
                else
                {
                    ToError("Error check hash of version code :" + global.START_LOAD_CODE.StartLoadVersionNum + " from node: " + Node.ip + ":" + Node.port);
                    global.SERVER.ClearLoadCode();
                    return 0;
                }
            }
            return 1;
        };

        global.SERVER.UseCode = function (VersionNum,bUpdate)
        {
            if(bUpdate)
            {
                UpdateCodeFiles(VersionNum);
            }

            if(global.START_LOAD_CODE.StartLoad)
            {
                global.CODE_VERSION = global.START_LOAD_CODE.StartLoad;
                global.SERVER.ClearLoadCode();
            }
        };

        global.SERVER.SetNewCodeVersion = function (Data,PrivateKey)
        {

            var fname = global.GetDataPath("ToUpdate/wallet.zip");
            if(fs.existsSync(fname))
            {
                var fname2 = global.GetDataPath("Update/wallet-" + Data.VersionNum + ".zip");
                if(fs.existsSync(fname2))
                {
                    fs.unlinkSync(fname2);
                }

                var data = fs.readFileSync(fname);
                var Hash = shaarr(data);

                var file_handle = fs.openSync(fname2, "w");
                fs.writeSync(file_handle, data, 0, data.length);
                fs.closeSync(file_handle);

                var SignArr = arr2(Hash, GetArrFromValue(Data.VersionNum));
                var Sign = secp256k1.sign(SHA3BUF(SignArr), PrivateKey).signature;
                global.CODE_VERSION = Data;
                global.CODE_VERSION.Hash = Hash;
                global.CODE_VERSION.Sign = Sign;
                return "OK Set new code version=" + Data.VersionNum;
            }
            else
            {
                return "File not exist: " + fname;
            }
        };
        setInterval(global.SERVER.CheckLoadCodeTime, 10 * 1000);
        global.CheckCreateDir(global.GetDataPath("Update"));
    }
    return {
        init:Init
    };
}
