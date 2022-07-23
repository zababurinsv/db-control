/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/


'use strict';
/**
 *
 * The module is designed for auto updating when
 *
 **/

// var fs = require("fs");


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
    const fs = global.fs
    global.START_LOAD_CODE = {StartLoadVersionNum:0};

    function Init(Engine)
    {
        global.CODE_VERSION = {BlockNum:0, addrArr:[], LevelUpdate:0, BlockPeriod:0, VersionNum:global.UPDATE_CODE_VERSION_NUM, Hash:[], Sign:[],
            StartLoadVersionNum:0};

        Engine.VERSION_SEND = {VersionNum:"uint"};
        Engine.VERSION_RET = {
            BlockNum:"uint",
            addrArr:"arr32",
            LevelUpdate:"byte",
            BlockPeriod:"uint",
            VersionNum:"uint",
            Hash:"hash",
            Sign:"arr64"
        };

        Engine.ProcessNewVersionNum = function (Child,CodeVersionNum)
        {
            Child.CodeVersionNum = CodeVersionNum;

            if(Engine.StartGetNewVersion && (CodeVersionNum > global.CODE_VERSION.VersionNum || CodeVersionNum === global.CODE_VERSION.VersionNum && global.IsZeroArr(global.CODE_VERSION.Hash)))
            {
                Engine.StartGetNewVersion(Child, CodeVersionNum);
            }
        };
        Engine.StartGetNewVersion = function (Child,VersionNum)
        {
            let Delta = Date.now() - Child.LastGetCodeVersion;
            if(Delta < 15000)
                return;

            Child.LastGetCodeVersion = Date.now();

            Engine.Send("VERSION", Child, {VersionNum:VersionNum}, function (Child,Data)
            {
                if(!Data)
                    return;

                Child.LastGetCodeVersion = Date.now();

                if(Data.VersionNum > global.CODE_VERSION.VersionNum || VersionNum === global.CODE_VERSION.VersionNum && global.IsZeroArr(global.CODE_VERSION.Hash))
                {
                    Engine.CheckCodeVersion(Data, Child);
                }
            });
        };

        Engine.VERSION = function (Child,Data) {
            return global.CODE_VERSION;
        };

        Engine.CheckCodeVersion = function (CodeVersion,Child) {

            let bLoadVer = 0;
            if(CodeVersion.BlockNum && (CodeVersion.BlockNum <= global.GetCurrentBlockNumByTime() || CodeVersion.BlockPeriod === 0) && (CodeVersion.BlockNum > global.CODE_VERSION.BlockNum || CodeVersion.BlockNum === 1) && !global.IsZeroArr(CodeVersion.Hash) && (CodeVersion.VersionNum > global.CODE_VERSION.VersionNum && CodeVersion.VersionNum > global.START_LOAD_CODE.StartLoadVersionNum || CodeVersion.VersionNum === global.CODE_VERSION.VersionNum && global.IsZeroArr(global.CODE_VERSION.Hash)))
            {
                bLoadVer = 1;
            }

            if(bLoadVer) {
                let Level = Child.Level;
                if(CodeVersion.BlockPeriod) {
                    let Delta = global.GetCurrentBlockNumByTime() - CodeVersion.BlockNum;
                    Level += Delta / CodeVersion.BlockPeriod;
                }
                if(Level >= CodeVersion.LevelUpdate) {
                    let SignArr = global.arr2(CodeVersion.Hash, global.GetArrFromValue(CodeVersion.VersionNum));
                    if(global.CheckDevelopSign(SignArr, CodeVersion.Sign)) {
                        global.ToLog("Got new CodeVersion = " + CodeVersion.VersionNum + " HASH:" + global.GetHexFromArr(CodeVersion.Hash).substr(0, 20), 2);

                        if(CodeVersion.VersionNum > global.CODE_VERSION.VersionNum && CodeVersion.VersionNum > START_LOAD_CODE.StartLoadVersionNum) {
                            global.SERVER.StartLoadCode(Child, CodeVersion);
                        } else {
                            global.CODE_VERSION = CodeVersion;
                        }
                    } else {
                        Child.ToLog("Error Sign CodeVersion=" + CodeVersion.VersionNum + " HASH:" + global.GetHexFromArr(CodeVersion.Hash).substr(0, 20));
                        global.ToLog(JSON.stringify(CodeVersion));
                        Engine.AddCheckErrCount(Child, 10, "Error Sign CodeVersion");
                    }
                }
            }
        };

        Engine.CODE_SEND = {VersionNum:"uint"};
        Engine.CODE_RET = {result:"byte", VersionNum:"uint", file:"buffer"};

        Engine.StartGetNewCode = function (Child,VersionNum)
        {
            let Delta = Date.now() - Child.LastGetCode;
            if(Delta < 40000)
                return;

            Child.LastGetCode = Date.now();

            Engine.Send("CODE", Child, {VersionNum:VersionNum}, function (Child,Data)
            {
                if(!Data)
                    return;

                Child.LastGetCode = Date.now();

                if(!Data.result || Data.VersionNum !== VersionNum || !START_LOAD_CODE.StartLoad)
                    return;

                if(!global.SERVER.DownloadingNewCodeToPath(Child, Data.file, VersionNum))
                    Engine.AddCheckErrCount(Child, 1, "Error check hash of version code");
            });
        };

        Engine.CODE = function (Child,Data)
        {
            if(!Data)
                return;

            let VersionNum = Data.VersionNum;
            let fname = global.GetDataPath("Update/wallet-" + VersionNum + ".zip");
            if(fs.existsSync(fname)) {
                ToLog("GET CODE VersionNum:" + VersionNum + " send file: " + fname);
                let data = fs.readFileSync(fname);
                return {result:1, VersionNum:VersionNum, file:data};
            }
            return {result:0, file:[]};
        };

        global.SERVER.StartGetNewCode = Engine.StartGetNewCode;
    }

    return {
        init:Init
    };
}

