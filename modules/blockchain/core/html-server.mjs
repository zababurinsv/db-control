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

import apiV2Exchange from "../rpc/api-v2-exchange.mjs"
import update from "../update.mjs"
import logs from '../../debug/index.mjs'
// import { Node, NetworkHub } from  '../../node/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    let path = import.meta.url
    let from = path.search('/core');
    let to = path.length;
    let url = path.substring(from,to);
    // logs.assert(maxCount,url, id, props, data, ...args)
}
export default (global) => {
debug(-2, '💂[(self)a]', global.PROCESS_NAME)
    // let node = new Node({ hub: new NetworkHub('ws://localhost:5001/alice') })
    const zlib = global.zlib
    const crypto = global.crypto
    const buffer = global.buffer
    const http = global.http
    const url = global.url
    const fs = global.fs
    const querystring = global.querystring
    let glStrToken = ''
    // apiV2Exchange(global)
    // log(global)
    // cryptoLibrary(global)
    let ContenTypeMap = {};
    ContenTypeMap["js"] = "application/javascript";
    ContenTypeMap["css"] = "text/css";
    ContenTypeMap["wav"] = "audio/wav";
    ContenTypeMap["mp3"] = "audio/mpeg";
    ContenTypeMap["mp4"] = "video/mp4";
    ContenTypeMap["ico"] = "image/vnd.microsoft.icon";
    ContenTypeMap["jpg"] = "image/jpeg";
    ContenTypeMap["png"] = "image/png";
    ContenTypeMap["gif"] = "image/gif";
    ContenTypeMap["html"] = "text/html";
    ContenTypeMap["txt"] = "text/plain";
    ContenTypeMap["csv"] = "text/csv";
    ContenTypeMap["svg"] = "image/svg+xml";


    ContenTypeMap["zip"] = "application/zip";
    ContenTypeMap["pdf"] = "application/pdf";
    ContenTypeMap["exe"] = "application/octet-stream";
    ContenTypeMap["msi"] = "application/octet-stream";
    ContenTypeMap["woff"] = "application/font-woff";
    ContenTypeMap["psd"] = "application/octet-stream";

    ContenTypeMap["wasm"] = "application/wasm";

    let DefaultContentType = "application/octet-stream";


    let CacheMap = {};
    CacheMap["sha3.js"] = 1000000;
    CacheMap["sign-lib-min.js"] = 1000000;
    CacheMap["marked.js"] = 1000000;
    CacheMap["highlight.js"] = 1000000;
    CacheMap["highlight-html.js"] = 1000000;
    CacheMap["highlight-js.js"] = 1000000;

    let AllowArr = ["text/javascript", "application/javascript", "application/json", "application/octet-stream", "application/font-woff",
        "text/css", "audio/wav", "audio/mpeg", "image/vnd.microsoft.icon", "image/jpeg", "image/png", "image/gif", "text/plain", "text/csv",
        "image/x-icon"];

    let AllowMap = {};
    for(let i = 0; i < AllowArr.length; i++) {
        AllowMap[AllowArr[i]] = 1;
    }
    if(!global.WebApi2) {
        global.WebApi2 = {};
    }
    global.HTTPCaller = {};

    /**
     *
     * @param request
     * @param response
     * @param Type
     * @param Path
     * @param params
     * @param remoteAddress
     * @constructor
     */
    function DoCommand(request,response,Type,Path,params,remoteAddress) {
        debug(-3, '💂[(self)DoCommand]', {
            Type: Type,
            params: params,
            Path: Path,
            remoteAddress: remoteAddress
        })
        let Caller = global.HTTPCaller;
        let Method = params[0];

        let Path2 = Path;
        if(Path2.substring(0, 1) === "/") {
            Path2 = Path2.substring(1);
        }

        let ArrPath = Path2.split('/', 5);

        //console.log(ArrPath,Path);

        let APIv2 = 0;
        if(ArrPath[0] === "api") {
            if(ArrPath[1] === "v2") {
                APIv2 = 1;
                Caller = WebApi2;
            }
            Method = ArrPath[2];
            console.log(Method,"PATH:", Path);
        }

        let F = Caller[Method];
        if(F) {
            if(Type !== "POST") {
                response.end();
                return;
            }

            let Headers = {'Content-Type':'text/plain'};

            let Ret = F(params[1], response);
            if(Ret === null) {
                response.writeHead(200, Headers);
                return;
            }

            try {
                let Str = JSON.stringify(Ret);
                SendGZipData(request, response, Headers, Str);
            } catch(e) {
                global.ToLog("ERR PATH:" + Path);
                global.ToLog(e);
                response.end();
            }
            return;
        }

        let method = params[0];
        method = method.toLowerCase();
        if(method === "dapp" && params.length === 2) {
            method = "DappTemplateFile";
        }
        let LongTime = undefined;
        switch(method) {
            case "":
                SendWebFile(request, response, "./HTML/wallet.html");
                break;
            case "file":
                SendBlockFile(request, response, params[1], params[2]);
                break;
            case "nft":
                SendNFTFile(request, response, params[1]);
                break;
            case "DappTemplateFile":
                DappTemplateFile(request, response, params[1]);
                break;
            case "smart":
                DappSmartCodeFile(response, params[1]);
                break;
            case "account":
                DappAccount(response, params[1]);
                break;
            case "client":
                DappClientCodeFile(response, params[1]);
                break;
            case "tx":
                DoGetTransactionByID(response, {TxID:params[1]});
                break;
            default:
            {
                if(Path.indexOf(".") ===  - 1)
                    global.ToError("Error path:" + Path + "  remoteAddress=" + remoteAddress);

                let path = params[params.length - 1];
                if(typeof path !== "string")
                    path = "ErrorPath";
                else
                if(Path.indexOf("..") >= 0 || path.indexOf("\\") >= 0 || path.indexOf("/") >= 0)
                    path = "ErrorFilePath";

                if(path.indexOf(".") < 0)
                    path += ".html";

                let type = Path.substr(Path.length - 3, 3);
                switch(type) {
                    case ".mjs":
                    case ".js":
                    case "asm":
                        if(params[0] === "HTML" && params[1] === "Ace")
                        {
                            LongTime = 1000000;
                            path = Path;
                        }
                        else
                        if(params[0] === "Ace")
                        {
                            LongTime = 1000000;
                            path = "./HTML/" + Path;
                        }
                        else
                        {
                            path = "./HTML/JS/" + path;
                        }
                        break;
                    case "css":
                        path = "./HTML/CSS/" + path;
                        break;
                    case "wav":
                    case "mp3":
                        path = "./HTML/SOUND/" + path;
                        break;
                    case "svg":
                    case "png":
                    case "gif":
                    case "jpg":
                    case "ico":
                        path = "./HTML/PIC/" + path;
                        break;

                    case "pdf":
                    case "zip":
                    case "exe":
                    case "msi":
                        path = "./HTML/FILES/" + path;
                        break;
                    default:
                        path = "./HTML/" + path;
                        break;
                }

                SendWebFile(request, response, path, "", 0, LongTime);
                break;
            }
        }
    }



    global.DappTemplateFile = DappTemplateFile;
    debug(-3, '💂[(server*)DappTemplateFile]', DappTemplateFile)
    function DappTemplateFile(request,response,StrNum) {
        let Num = parseInt(StrNum);
        if(Num && Num <= global.SMARTS.GetMaxNum())
        {
            let Data = global.SMARTS.ReadSmart(Num);
            if(Data)
            {
                let Headers = {'Content-Type':'text/html', "X-Frame-Options":"sameorigin"};
                let Str = fs.readFileSync("HTML/dapp-frame.html", {encoding:"utf8"});
                Str = Str.replace(/#template-number#/g, Num);
                let StrIcon;
                if(Data.IconBlockNum)
                    StrIcon="/file/" + Data.IconBlockNum + "/" + Data.IconTrNum;
                else
                    StrIcon="/../Tera.svg";
                Str = Str.replace(/.\/tera.ico/g, StrIcon);

                SendGZipData(request, response, Headers, Str);
                return;
            }
        }

        response.writeHead(404, {'Content-Type':'text/html'});
        response.end();
    }

    global.DappSmartCodeFile = DappSmartCodeFile;
    debug(-3, '💂[(server*)DappSmartCodeFile]', DappSmartCodeFile)
    function DappSmartCodeFile(response,StrNum) {
        let Num = parseInt(StrNum);
        if(Num && Num <= global.SMARTS.GetMaxNum())
        {
            let Data = global.SMARTS.ReadSmart(Num);
            if(Data)
            {
                response.writeHead(200, {'Content-Type':'application/javascript', "Access-Control-Allow-Origin":"*"});
                response.end(Data.Code);
                return;
            }
        }

        response.writeHead(404, {'Content-Type':'text/html'});
        response.end();
    }
    global.DappClientCodeFile = DappClientCodeFile;
    debug(-3, '💂[(server*)DappClientCodeFile]', DappClientCodeFile)
    function DappClientCodeFile(response,StrNum) {
        let Num = parseInt(StrNum);
        if(Num && Num <= global.SMARTS.GetMaxNum())
        {
            let Data = global.SMARTS.ReadSmart(Num);
            if(Data)
            {
                response.writeHead(200, {'Content-Type':"text/plain", "X-Content-Type-Options":"nosniff"});
                response.end(Data.HTML);
                return;
            }
        }

        response.writeHead(404, {'Content-Type':'text/html'});
        response.end();
    }

    global.HTTPCaller.DappSmartHTMLFile = function (Params) {
        debug(-3, 'server💂[(HTTPCaller*)DappSmartHTMLFile]', Params)
        let Data = global.SMARTS.ReadSmart(global.ParseNum(Params.Smart));
        if(Data)
        {
            if(global.DEV_MODE && Params.DebugPath)
            {
                global.ToLog("Load: " + Params.DebugPath);
                Data.HTML = fs.readFileSync(Params.DebugPath, {encoding:"utf8"});
            }
            return {result:1, Body:Data.HTML};
        }
        return {result:0};
    }


    global.SendBlockFile = SendBlockFile;
    global.SendNFTFile = SendNFTFile;
    debug(-3, '💂[(server*)SendNFTFile]', SendNFTFile)
    function SendNFTFile(request,response,StrNum) {
        let Num;
        if(StrNum && StrNum.length>15)
            Num = +StrNum.substr(StrNum.length-15);
        else
            Num = +StrNum;

        let BlockNum=Math.floor(Num/1000);
        let TrNum=Num%1000;
        //console.log(Num,"->",BlockNum,TrNum);
        return SendBlockFile(request, response, BlockNum, TrNum);
    }

    function SendBlockFile(request,response,BlockNum,TrNum) {
        BlockNum = parseInt(BlockNum);
        TrNum = parseInt(TrNum);
        if(BlockNum && BlockNum <= global.SERVER.GetMaxNumBlockDB() && TrNum <= MAX_TRANSACTION_COUNT)
        {
            let Block = global.SERVER.ReadBlockDB(BlockNum);
            if(Block && Block.arrContent)
            {
                SendToResponceFile(request, response, Block, TrNum);
                return;
            }
        }
        SendToResponce404(response);
    }
    function SendToResponceFile(request,response,Block,TrNum) {

        let Body = Block.arrContent[TrNum];
        if(Body && Body.data)
            Body = Body.data;
        if(Body)
        {
            let Type=Body[0];

            if(Type === global.TYPE_TRANSACTION_FILE
                || Type === global.TYPE_TRANSACTION_SMART_RUN1
                || Type === global.TYPE_TRANSACTION_SMART_RUN2)
            {
                let Headers = {"X-Content-Type-Options":"nosniff"};
                Headers["Access-Control-Allow-Origin"]="*";

                let ContentType,Data;
                let TR = global.DApps.File.GetObjectTransaction(Body);
                if(Type === global.TYPE_TRANSACTION_FILE)
                {
                    ContentType = TR.ContentType;
                    Data=TR.Data;
                }
                else
                {
                    ContentType = "text/plain";
                    Data=TR.Params;
                }


                let StrType = ContentType.toLowerCase();

                if(AllowMap[StrType] || (Block.BlockNum < global.UPDATE_CODE_2 && StrType === "image/svg+xml"))
                    Headers['Content-Type'] = ContentType;
                else
                    Headers['Content-Type'] = "text/plain";

                SendGZipData(request, response, Headers, Data);
                return;
            }
        }

        SendToResponce404(response);
    }

    function SendToResponce404(response) {
        let Headers = {"X-Content-Type-Options":"nosniff"};
        Headers["Access-Control-Allow-Origin"]="*";
        Headers["Content-Type"]="text/html";

        response.writeHead(404, Headers);
        response.end();
    }

    global.HTTPCaller.DappBlockFile = function (Params,response) {
        Params.BlockNum = global.ParseNum(Params.BlockNum);
        Params.TrNum = global.ParseNum(Params.TrNum);
        if(!Params.TrNum)
            Params.TrNum = 0;
        if(Params.BlockNum && Params.BlockNum <= global.SERVER.GetMaxNumBlockDB() && Params.TrNum <= MAX_TRANSACTION_COUNT)
        {
            let Block = global.SERVER.ReadBlockDB(Params.BlockNum);
            if(Block && Block.arrContent)
            {
                SendToResponceDappFile(response, Block, Params.TrNum);
                return null;
            }
        }
        return {result:0};
    }
    function SendToResponceDappFile(response,Block,TrNum) {
        let Result = {result:0};
        let Body = Block.arrContent[TrNum];
        if(Body) {

            let Type = Body[0];
            if(Type === global.TYPE_TRANSACTION_FILE) {
                let TR = global.DApps.File.GetObjectTransaction(Body);
                let Str = buffer.from(TR.Data).toString('utf8');

                Result = {result:1, Type:Type, ContentType:TR.ContentType, Name:TR.Name, Body:Str};
            }
            else {
                let App = global.DAppByType[Type];
                if(App)
                {
                    Body = JSON.parse(App.GetScriptTransaction(Body, Block.BlockNum, TrNum));
                }

                Result = {result:1, Type:Type, Body:Body};
            }
        }
        let Str = JSON.stringify(Result);
        response.end(Str);
    }

    function SendToResponceResult0(response) {
        if(response)
            response.end("{\"result\":0}");
    }

    let glBlock0 = {};
    global.HTTPCaller.DappStaticCall = function (Params,response) {
        let Result = global.RunStaticSmartMethod(global.ParseNum(Params.Account), Params.MethodName, Params.Params, Params.ParamsArr);
        let Str = JSON.stringify(Result);
        if(Str.length > 64000)
        {
            return {result:0, RetValue:"Error result length (more 64000)"};
        }

        response.end(Str);
        return null;
    };

    global.HTTPCaller.DappInfo = function (Params,responce,ObjectOnly) {
        let SmartNum = global.ParseNum(Params.Smart);
        if(global.TX_PROCESS && global.TX_PROCESS.Worker)
            global.TX_PROCESS.Worker.send({cmd:"SetSmartEvent", Smart:SmartNum});

        let Account;
        let Smart = SMARTS.ReadSimple(SmartNum);
        if(Smart) {
            delete Smart.HTML;
            delete Smart.Code;

            Account = global.ACCOUNTS.ReadState(Smart.Account);
            try
            {
                Account.SMARTState = BufLib.GetObjectFromBuffer(Account.Value.Data, Smart.StateFormat, {});
                if(typeof Account.SmartState === "object")
                    Account.SmartState.Num = Account.Num;
            }
            catch(e)
            {
                if(!Account)
                    Account = {};
                Account.SmartState = {};
            }
        }

        DeleteOldEvents(SmartNum);
        let Context = GetUserContext(Params);
        let EArr = GetEventArray(SmartNum, Context);
        let WLData = global.HTTPCaller.DappWalletList(Params);
        //console.log("WLData.arr=",WLData.arr)

        let ArrLog = [];
        for(let i = 0; i < global.ArrLogClient.length; i++) {
            let Item = global.ArrLogClient[i];
            if(!Item.final)
                continue;
            if(ArrLog.length > 100)
                break;
            ArrLog.push(Item);
        }

        let Ret = {
            result:1,
            DELTA_CURRENT_TIME:global.DELTA_CURRENT_TIME,
            FIRST_TIME_BLOCK:global.FIRST_TIME_BLOCK,
            UPDATE_CODE_JINN:global.UPDATE_CODE_JINN,
            CONSENSUS_PERIOD_TIME:global.CONSENSUS_PERIOD_TIME,
            PRICE_DAO:PRICE_DAO(global.SERVER.BlockNumDB),
            NEW_SIGN_TIME:global.NEW_SIGN_TIME,
            Smart:Smart,
            Account:Account,
            NETWORK:global.NETWORK,
            SHARD_NAME:global.SHARD_NAME,
            JINN_MODE:1,
            ArrWallet:WLData.arr,
            ArrEvent:EArr,
            ArrLog:ArrLog,
            COIN_STORE_NUM:global.COIN_STORE_NUM,
            BlockNumDB:global.SERVER.BlockNumDB,
        };

        if(global.WALLET) {
            Ret.WalletIsOpen = (global.WALLET.WalletOpen !== false);
            Ret.WalletCanSign = (global.WALLET.WalletOpen !== false && global.WALLET.KeyPair.WasInit);
            Ret.PubKey = global.WALLET.KeyPair.PubKeyStr;
        }

        if(!ObjectOnly)
        {
            Ret.CurTime = Date.now();
            Ret.CurBlockNum = global.GetCurrentBlockNumByTime();
            Ret.MaxAccID = global.ACCOUNTS.GetMaxAccount();
            Ret.MaxDappsID = global.SMARTS.GetMaxNum();
        }

        return Ret;
    }

    global.HTTPCaller.DappWalletList = function (Params) {
        let arr0 = global.ACCOUNTS.GetWalletAccountsByMap(global.WALLET.AccountMap);
        let arr = [];
        for(let i = 0; i < arr0.length; i++)
        {
            if(Params.AllAccounts || arr0[i].Value.Smart === Params.Smart)
            {
                arr.push(arr0[i]);
            }
        }
        arr=UseRetFieldsArr(arr,Params.Fields);
        //console.log("arr",arr)
        let Ret = {result:1, arr:arr, };
        return Ret;
    }

    global.HTTPCaller.DappAccountList = function (Params) {
        let arr = global.ACCOUNTS.GetRowsAccounts(Params.StartNum,  + Params.CountNum, undefined, 1,1);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }

    global.DappAccount=function(response,StrNum) {
        let Num = parseInt(StrNum);
        let arr = global.ACCOUNTS.GetRowsAccounts(Num, 1, undefined, 1,1);
        let Data = {Item:arr[0], result:1};
        response.writeHead(200, {'Content-Type':"text/plain", "X-Content-Type-Options":"nosniff"});
        response.end(JSON.stringify(Data));
    }

    global.HTTPCaller.DappSmartList = function (Params) {
        let arr = global.SMARTS.GetRows(Params.StartNum,  + Params.CountNum, undefined, undefined, Params.GetAllData, Params.TokenGenerate,
            Params.AllRow);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }
    global.HTTPCaller.DappBlockList = function (Params,response) {
        Params.Filter = undefined;
        return global.HTTPCaller.GetBlockList(Params, response, 1);
    }
    global.HTTPCaller.DappTransactionList = function (Params,response) {
        Params.Filter = undefined;
        Params.Param3 = Params.BlockNum;
        return global.HTTPCaller.GetTransactionAll(Params, response);
    }



    global.HTTPCaller.RestartNode = function (Params) {
        debug(-3, 'server💂[(HTTPCaller*)RestartNode]', Params)
        global.RestartNode();
        return {result:1};
    }


    global.HTTPCaller.FindMyAccounts = function (Params) {
        global.WALLET.FindMyAccounts(1);
        return {result:1};
    }

    global.HTTPCaller.GetAccount = function (id) {
        id = parseInt(id);
        let arr = global.ACCOUNTS.GetRowsAccounts(id, 1,0,1,1);
        return {Item:arr[0], result:1};
    }
    global.HTTPCaller.DappGetBalance = function (Params) {
        let Account=parseInt(Params.AccountID);
        let Currency=parseInt(Params.Currency);
        let ID=Params.ID;

        let Value = global.ACCOUNTS.GetBalance(Account,Currency,ID);
        return {Value:Value, result:1};
    }
    global.HTTPCaller.GetAccountList = function (Params) {
        if(!( + Params.CountNum))
            Params.CountNum = 1;

        let arr = global.ACCOUNTS.GetRowsAccounts(Params.StartNum,  + Params.CountNum, Params.Filter, Params.GetState, Params.GetCoin);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }
    global.HTTPCaller.GetDappList = function (Params) {
        if(!( + Params.CountNum))
            Params.CountNum = 1;
        let arr = global.SMARTS.GetRows(Params.StartNum,  + Params.CountNum, Params.Filter, Params.Filter2, 1);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }
    global.HTTPCaller.GetBlockList = function (Params,response,bOnlyNum)
    {
        if(!( + Params.CountNum))
            Params.CountNum = 1;

        let arr = global.SERVER.GetRows(Params.StartNum,  + Params.CountNum, Params.Filter, !bOnlyNum, Params.ChainMode);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }
    global.HTTPCaller.GetTransactionAll = function (Params,response)
    {
        if(!( + Params.CountNum))
            Params.CountNum = 1;

        let BlockNum = Params.Param3;
        if(!BlockNum)
            BlockNum = 0;

        let arr = global.SERVER.GetTrRows(BlockNum, Params.StartNum,  + Params.CountNum, Params.ChainMode, Params.Filter);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }
    global.HTTPCaller.GetActList = function (Params)
    {
        return {arr:[], result:1};
    }
    global.HTTPCaller.GetJournalList = function (Params)
    {
        let arr = global.JOURNAL_DB.GetScrollList(Params.StartNum,  + Params.CountNum);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }

    global.HTTPCaller.FindJournalByBlockNum = function (Params)
    {
        let Num = global.JOURNAL_DB.FindByBlockNum(Params.BlockNum);
        if(typeof Num === "number")
        {
            return {result:1, Num:Num};
        }
        else
        {
            return {result:0};
        }
    }

    global.HTTPCaller.GetCrossOutList = function (Params)
    {
        let arr = global.SHARDS.GetCrossOutList(Params.StartNum,  + Params.CountNum);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }
    global.HTTPCaller.GetCrossInList = function (Params)
    {
        let arr = global.SHARDS.GetCrossInList(Params.StartNum,  + Params.CountNum);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }

    global.HTTPCaller.GetShardList = function (Params)
    {
        let arr = global.SHARDS.GetShardList(Params.StartNum,  + Params.CountNum);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }

    global.HTTPCaller.FindActByBlockNum = function (Params)
    {
        let Num = global.COMMON_ACTS.FindActByBlockNum(Params.BlockNum);
        return {Num:Num, result:1};
    }

    function FindCrossByBlockNum(FName,Params)
    {
        let Item = global.SHARDS[FName](Params.BlockNum);
        if(Item)
        {
            Item.result = 1;
            return Item;
        }
        else
        {
            return {result:0};
        }
    }
    global.HTTPCaller.FindCrossOutByBlockNum = function (Params)
    {
        return FindCrossByBlockNum("FindCrossOutByBlockNum", Params);
    }
    global.HTTPCaller.FindCrossInByBlockNum = function (Params)
    {
        return FindCrossByBlockNum("FindCrossInByBlockNum", Params);
    }

    global.HTTPCaller.FindCrossRunByBlockNum = function (Params)
    {
        return FindCrossByBlockNum("FindCrossRunByBlockNum", Params);
    }

    global.HTTPCaller.GetHashList = function (Params)
    {
        let arr = global.ACCOUNTS.DBAccountsHash.GetRows(Params.StartNum,  + Params.CountNum, Params.Filter);
        for(let i = 0; i < arr.length; i++)
        {
            let item = arr[i];
            item.VerifyHTML = "";
            item.BlockNum = item.Num * PERIOD_ACCOUNT_HASH;
            let Block = global.SERVER.ReadBlockHeaderDB(item.BlockNum);
            if(Block && Block.MinerHash)
            {
                item.Miner = global.ACCOUNTS.GetMinerFromBlock(Block);
            }

            let Arr = global.SERVER.GetTrRows(item.BlockNum, 0, 65535, 0);
            for(let TxNum = 0; TxNum < Arr.length; TxNum++)
            {
                let Tx = Arr[TxNum];
                if(Tx && Tx.Type === global.TYPE_TRANSACTION_ACC_HASH || Tx.Type === TYPE_TRANSACTION_ACC_HASH_OLD)
                {
                    item.VerifyHTML = Tx.VerifyHTML;
                    break;
                }
            }
        }
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }

    global.HTTPCaller.GetHistoryAct = function (Params)
    {
        let arr = global.WALLET.GetHistory(Params.StartNum,  + Params.CountNum, Params.Filter);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }

    if(!global.CHECK_POINT)
        global.CHECK_POINT = {};


    global.HTTPCaller.GetWalletInfo = function (Params)
    {
        debug(-3, 'server💂[(HTTPCaller*)GetWalletInfo]', Params)
        let Constants = {};
        for(let i = 0; i < global.CONST_NAME_ARR.length; i++)
        {
            let key = global.CONST_NAME_ARR[i];
            Constants[key] = global[key];
        }

        let MaxHistory = 0;



        let TXBlockNum = global.COMMON_ACTS.GetLastBlockNumActWithReopen();
        let SysInfo=global.SYSCORE.GetInfo(global.SERVER.BlockNumDB);

        let Ret = {
            result:1,
            WalletOpen:global.WALLET.WalletOpen,
            WalletIsOpen:(global.WALLET.WalletOpen !== false),
            WalletCanSign:(global.WALLET.WalletOpen !== false && global.WALLET.KeyPair.WasInit),
            CODE_VERSION:global.CODE_VERSION,
            CodeVer:global.START_CODE_VERSION_NUM,
            VersionNum:global.UPDATE_CODE_VERSION_NUM,
            RelayMode:global.SERVER.RelayMode,
            NodeSyncStatus:global.SERVER.NodeSyncStatus,
            BlockNumDB:global.SERVER.BlockNumDB,
            BlockNumDBMin:global.SERVER.BlockNumDBMin,
            CurBlockNum:global.GetCurrentBlockNumByTime(),
            CurTime:Date.now(),
            IsDevelopAccount:global.IsDeveloperAccount(global.WALLET.PubKeyArr),
            AccountMap:global.WALLET.AccountMap,
            ArrLog:global.ArrLogClient,
            MaxAccID:global.ACCOUNTS.GetMaxAccount(),
            MaxActNum:0,
            MaxJournalNum:global.JOURNAL_DB.GetMaxNum(),
            MaxDappsID:global.SMARTS.GetMaxNum(),
            MaxCrossOutNum:global.SHARDS.GetMaxCrossOutNum(),
            MaxCrossInNum:global.SHARDS.GetMaxCrossInNum(),
            MaxShardNum:global.SHARDS.GetMaxShardNum(),
            NeedRestart:global.NeedRestart,
            ip:global.SERVER.ip,
            port:global.SERVER.port,
            HistoryMaxNum:MaxHistory,
            DELTA_CURRENT_TIME:global.DELTA_CURRENT_TIME,
            FIRST_TIME_BLOCK:global.FIRST_TIME_BLOCK,
            UPDATE_CODE_JINN:global.UPDATE_CODE_JINN,
            CONSENSUS_PERIOD_TIME:global.CONSENSUS_PERIOD_TIME,
            NEW_SIGN_TIME:global.NEW_SIGN_TIME,
            DATA_PATH:(global.DATA_PATH.substr(1, 1) === ":" ? global.DATA_PATH : global.GetNormalPathString(process.cwd() + "/" + global.DATA_PATH)),
            NodeAddrStr:global.SERVER.addrStr,
            STAT_MODE:global.STAT_MODE,
            HTTPPort:global.HTTP_PORT_NUMBER,
            HTTPPassword:global.HTTP_PORT_PASSWORD,
            CONSTANTS:Constants,
            CheckPointBlockNum:global.CHECK_POINT.BlockNum,
            MiningAccount:global.GetMiningAccount(),
            CountMiningCPU:global.GetCountMiningCPU(),
            CountRunCPU:global.ArrMiningWrk.length,
            MiningPaused:global.MiningPaused,
            HashRate:global.GetLastHashRate(),
            BLOCKCHAIN_VERSION:SysInfo.Active,
            PRICE_DAO:SysInfo,//PRICE_DAO(global.SERVER.BlockNumDB),
            //SYS_CORE:SysInfo,
            //FORMAT_SYS:global.FORMAT_SYS,
            NWMODE:global.NWMODE,
            PERIOD_ACCOUNT_HASH:global.PERIOD_ACCOUNT_HASH,
            MAX_ACCOUNT_HASH:global.ACCOUNTS.DBAccountsHash.GetMaxNum(),
            TXBlockNum:TXBlockNum,
            SpeedSignLib:global.SpeedSignLib,
            NETWORK:global.NETWORK,
            SHARD_NAME:global.SHARD_NAME,
            MaxLogLevel:global.MaxLogLevel,
            JINN_NET_CONSTANT:global.JINN_NET_CONSTANT,
            JINN_MODE:1,
            sessionid:global.GetSessionId(),
            COIN_STORE_NUM:global.COIN_STORE_NUM,
        };

        if(Params.Account) {
            Ret.PrivateKey = global.GetHexFromArr(global.WALLET.GetPrivateKey(global.WALLET.AccountMap[Params.Account]));
        } else {
            Ret.PrivateKey = global.GetHexFromArr(global.WALLET.GetPrivateKey());
        }
        Ret.PublicKey = global.WALLET.KeyPair.PubKeyStr;
        return Ret;
    }
    global.HTTPCaller.GetCurrentInfo = global.HTTPCaller.GetWalletInfo;

    global.HTTPCaller.TestSignLib = function () {
        debug(-3, 'server💂[(HTTPCaller*)TestSignLib]')
        global.TestSignLib();
    }

    global.HTTPCaller.GetWalletAccounts = function () {
        let Ret = {result:1, arr:global.ACCOUNTS.GetWalletAccountsByMap(global.WALLET.AccountMap), };

        Ret.PrivateKey = global.WALLET.KeyPair.PrivKeyStr;
        Ret.PublicKey = global.WALLET.KeyPair.PubKeyStr;

        return Ret;
    }
    global.HTTPCaller.SetWalletKey = function (PrivateKeyStr) {
        global.WALLET.SetPrivateKey(PrivateKeyStr, true);
        return {result:1};
    }

    global.HTTPCaller.SetWalletPasswordNew = function (Password) {
        global.WALLET.SetPasswordNew(Password);
        return {result:1};
    }
    global.HTTPCaller.OpenWallet = function (Password) {
        let res = global.WALLET.OpenWallet(Password);
        return {result:res};
    }
    global.HTTPCaller.CloseWallet = function () {
        let res = global.WALLET.CloseWallet();
        return {result:res};
    }

    global.HTTPCaller.GetSignTransaction = function (TR) {
        let Sign = global.WALLET.GetSignTransaction(TR);
        return {Sign:Sign, result:1};
    }
    global.HTTPCaller.GetSignFromHEX = function (Params) {
        let Arr = global.GetArrFromHex(Params.Hex);
        //console.log(Params.Account)

        let Sign;
        if(Params.Account)
            Sign = global.WALLET.GetSignFromArr(Arr, global.WALLET.AccountMap[Params.Account]);
        else
            Sign = global.WALLET.GetSignFromArr(Arr);

        return {Sign:Sign, result:1};
    }

    global.HTTPCaller.GetSignFromHash = function (Params) {
        let Sign;
        let Hash = global.GetArrFromHex(Params.Hash);
        if(Params.Account)
            Sign = global.WALLET.GetSignFromHash(Hash, global.WALLET.AccountMap[Params.Account]);
        else
            Sign = global.WALLET.GetSignFromHash(Hash);

        return {Sign:Sign, result:1};
    }

    global.HTTPCaller.SendHexTx = function (Params,response) {
        if(typeof Params === "object" && typeof Params.Hex === "string")
            Params.Hex += "000000000000000000000000";
        return global.HTTPCaller.SendTransactionHex(Params,response);
    }

    global.HTTPCaller.SendTransactionHex = function (Params,response) {
        //console.log(JSON.stringify(Params));
        Params.Main=1;
        AddTransactionFromMain(Params,function (Err,Result)
        {
            //console.log(JSON.stringify(Result));
            response.end(JSON.stringify(Result));
        });

        return null;
    }

    global.HTTPCaller.SendDirectCode = function (Params,response) {
        let Result;
        if(Params.TX || Params.WEB || Params.ST)
        {
            let RunProcess;
            if(Params.TX)
                RunProcess = global.TX_PROCESS;
            if(Params.WEB)
                RunProcess = global.WEB_PROCESS;

            if(RunProcess && RunProcess.RunRPC)
            {
                RunProcess.RunRPC("EvalCode", Params.Code, function (Err,Ret)
                {
                    Result = {result:!Err, sessionid:global.GetSessionId(), text:Ret, };
                    let Str = JSON.stringify(Result);
                    response.end(Str);
                });
                return null;
            }
            else
            {
                Result = "No process for send call";
            }
        }
        else {
            try {
                Result = eval(Params.Code);
            }
            catch(e) {
                Result = "" + e;
            }
        }

        let Struct = {result:1, sessionid:GetSessionId(), text:Result};
        return Struct;
    }

    global.HTTPCaller.SetMining = function (MiningAccount)
    {
        let Account = parseInt(MiningAccount);
        global.MINING_ACCOUNT = Account;
        global.SAVE_CONST(1);

        return {result:1};
    }

    function CheckCorrectDevKey()
    {
        if(global.WALLET.WalletOpen === false)
        {
            let StrErr = "Not open wallet";
            global.ToLogClient(StrErr);
            return {result:0, text:StrErr};
        }

        if(!global.IsDeveloperAccount(global.WALLET.PubKeyArr))
        {
            let StrErr = "Not developer key";
            global.ToLogClient(StrErr);
            return {result:0, text:StrErr};
        }
        return true;
    }



    global.HTTPCaller.SetCheckPoint = function (BlockNum)
    {
        let Ret = CheckCorrectDevKey();
        if(Ret !== true)
            return Ret;

        if(!BlockNum)
            BlockNum = global.SERVER.BlockNumDB;
        else
            BlockNum = parseInt(BlockNum);

        if(SetCheckPointOnBlock(BlockNum))
            return {result:1, text:"Set check point on BlockNum=" + BlockNum};
        else
            return {result:0, text:"Error on check point BlockNum=" + BlockNum};
    }
    function SetCheckPointOnBlock(BlockNum)
    {
        if(global.WALLET.WalletOpen === false)
            return 0;

        let Block = global.SERVER.ReadBlockHeaderDB(BlockNum);
        if(!Block)
            return 0;

        let SignArr = arr2(Block.Hash, GetArrFromValue(Block.BlockNum));
        let Sign = secp256k1.sign(SHA3BUF(SignArr, Block.BlockNum), global.WALLET.KeyPair.getPrivateKey('')).signature;
        global.CHECK_POINT = {BlockNum:BlockNum, Hash:Block.Hash, Sign:Sign};
        global.SERVER.ResetNextPingAllNode();
        return 1;
    }
    global.SetCheckPointOnBlock = SetCheckPointOnBlock;

    let idSetTimeSetCheckPoint;
    global.HTTPCaller.SetAutoCheckPoint = function (Param)
    {
        let Ret = CheckCorrectDevKey();
        if(Ret !== true)
            return Ret;

        if(idSetTimeSetCheckPoint)
            clearInterval(idSetTimeSetCheckPoint);
        idSetTimeSetCheckPoint = undefined;
        if(Param.Set)
            idSetTimeSetCheckPoint = setInterval(RunSetCheckPoint, Param.Period * 1000);

        return {result:1, text:"AutoCheck: " + Param.Set + " each " + Param.Period + " sec"};
    }

    let SumCheckPow = 0;
    let CountCheckPow = 0;
    function RunSetCheckPoint()
    {
        if(!global.SERVER.BlockNumDB)
            return;
        if(global.SERVER.BlockNumDB < 2100000)
            return;
        let Delta = global.GetCurrentBlockNumByTime() - global.SERVER.BlockNumDB;
        if(Delta > 16)
            return;

        let BlockNum = global.SERVER.BlockNumDB - 20;
        let Block = global.SERVER.ReadBlockHeaderDB(BlockNum);
        if(Block)
        {
            let Power = GetPowPower(Block.PowHash);
            if(Power < 30)
            {
                global.ToLog("CANNOT SET CHECK POINT Power=" + Power + "  BlockNum=" + BlockNum);
                return;
            }

            CountCheckPow++;
            SumCheckPow += Power;
            let AvgPow = SumCheckPow / CountCheckPow;
            if(CountCheckPow > 10)
            {
                if(Power < AvgPow - 2)
                {
                    global.ToLog("**************** CANNOT SET CHECK POINT Power=" + Power + "/" + AvgPow + "  BlockNum=" + BlockNum);
                    return;
                }
            }

            SetCheckPointOnBlock(BlockNum);
            global.ToLog("SET CHECK POINT Power=" + Power + "/" + AvgPow + "  BlockNum=" + BlockNum);
        }
    }

    global.HTTPCaller.SetNewCodeVersion = function (Data) {
        let Ret = {}
        Ret  = CheckCorrectDevKey();
        if(Ret !== true)
            return Ret;
        console.warn('Два значения ret не понятно какое возвращается')
        Ret = global.SERVER.SetNewCodeVersion(Data, global.WALLET.KeyPair.getPrivateKey(''));

        global.SERVER.ResetNextPingAllNode();

        return {result:1, text:Ret};
    }

    global.HTTPCaller.SetCheckNetConstant = function (Data)
    {
        let Ret = CheckCorrectDevKey();
        if(Ret !== true)
            return Ret;

        if(!Data || !Data.JINN)
        {
            global.ToLogClient("Data JINN not set");
            return {result:0, text:"Data JINN not set"};
        }

        let Num = global.GetCurrentBlockNumByTime();
        let BlockNum = global.GetCurrentBlockNumByTime() + Math.floor(10 * 1000 / global.CONSENSUS_PERIOD_TIME);
        let DataJinn = Data.JINN;
        if(!DataJinn.NetConstVer)
            DataJinn.NetConstVer = Num;
        if(!DataJinn.NetConstStartNum)
            DataJinn.NetConstStartNum = BlockNum;
        let SignArr = global.Engine.GetSignCheckNetConstant(DataJinn);
        DataJinn.NET_SIGN = secp256k1.sign(SHA3BUF(SignArr), global.WALLET.KeyPair.getPrivateKey('')).signature;
        global.Engine.CheckNetConstant(DataJinn);

        return {result:1, text:"Set NET_CONSTANT BlockNum=" + BlockNum};
    }

    global.HTTPCaller.SetCheckDeltaTime = function (Data)
    {
        let Ret = CheckCorrectDevKey();
        if(Ret !== true)
            return Ret;

        if(!Data || !Data.Num)
        {
            global.ToLogClient("Num not set");
            return {result:0};
        }

        let SignArr = global.SERVER.GetSignCheckDeltaTime(Data);
        Data.Sign = secp256k1.sign(SHA3BUF(SignArr), global.WALLET.KeyPair.getPrivateKey('')).signature;
        global.CHECK_DELTA_TIME = Data;

        global.SERVER.ResetNextPingAllNode();

        return {result:1, text:"Set check time Num=" + Data.Num};
    }

    let idAutoCorrTime;
    global.HTTPCaller.SetAutoCorrTime = function (bSet)
    {
        let Ret = CheckCorrectDevKey();
        if(Ret !== true)
            return Ret;

        if(idAutoCorrTime)
            clearInterval(idAutoCorrTime);
        idAutoCorrTime = undefined;
        if(bSet)
            idAutoCorrTime = setInterval(RunAutoCorrTime, 1000);

        return {result:1, text:"Auto correct: " + bSet};
    }

    let StartCheckTimeNum = 0;
    function RunAutoCorrTime()
    {
        if(global.WALLET.WalletOpen === false)
            return;

        if(global.GetCurrentBlockNumByTime() > StartCheckTimeNum && Math.abs(global.DELTA_CURRENT_TIME) >= 120)
        {
            let AutoDelta =  - Math.trunc(global.DELTA_CURRENT_TIME);
            let Data = {Num:global.GetCurrentBlockNumByTime(), bUse:1, bAddTime:1};
            if(AutoDelta < 0)
            {
                AutoDelta =  - AutoDelta;
                Data.bAddTime = 0;
            }
            Data.DeltaTime = 40;
            Data.StartBlockNum = Data.Num + 5;
            Data.EndBlockNum = Data.StartBlockNum + Math.trunc(AutoDelta / Data.DeltaTime);

            let SignArr = global.SERVER.GetSignCheckDeltaTime(Data);
            Data.Sign = secp256k1.sign(SHA3BUF(SignArr), global.WALLET.KeyPair.getPrivateKey('')).signature;
            global.CHECK_DELTA_TIME = Data;

            global.SERVER.ResetNextPingAllNode();

            StartCheckTimeNum = Data.EndBlockNum + 1;
            global.ToLog("Auto corr time Num:" + Data.Num + " AutoDelta=" + AutoDelta);
        }
    }

    global.HTTPCaller.SaveConstant = function (SetObj)
    {
        let WasUpdate = global.USE_AUTO_UPDATE;
        for(let key in SetObj)
        {
            global[key] = SetObj[key];
        }
        global.SAVE_CONST(true);
        global.SERVER.DO_CONSTANT();

        if(!WasUpdate && global.USE_AUTO_UPDATE && CODE_VERSION.VersionNum && global.UPDATE_CODE_VERSION_NUM < CODE_VERSION.VersionNum)
        {
            global.SERVER.UseCode(CODE_VERSION.VersionNum, true);
        }

        if(SetObj.DoRestartNode)
            global.RestartNode();
        else
        {
            if(SetObj.DoMining)
                global.RunStopPOWProcess();
        }

        return {result:1};
    }

    global.HTTPCaller.SetHTTPParams = function (SetObj)
    {
        global.HTTP_PORT_NUMBER = SetObj.HTTPPort;
        global.HTTP_PORT_PASSWORD = SetObj.HTTPPassword;
        global.SAVE_CONST(true);

        if(SetObj.DoRestartNode)
            global.RestartNode();

        return {result:1};
    }

    global.HTTPCaller.SetNetMode = function (SetObj)
    {
        global.JINN_IP = SetObj.ip;
        global.JINN_PORT = SetObj.port;
        global.AUTODETECT_IP = SetObj.AutoDetectIP;

        global.SAVE_CONST(true);

        if(SetObj.DoRestartNode)
            global.RestartNode();

        return {result:1};
    }


    global.HTTPCaller.GetAccountKey = function (Num)
    {
        let Result = {};
        Result.result = 0;

        let KeyPair = global.WALLET.GetAccountKey(Num);
        if(KeyPair)
        {
            Result.result = 1;
            Result.PubKeyStr = global.GetHexFromArr(KeyPair.getPublicKey('', 'compressed'));
        }
        return Result;
    }

    global.HTTPCaller.GetNodeData = function (Param)
    {
        let Item = global.SERVER.FindNodeByID(Param.ID);
        if(!Item)
            return {};

        if(global.GetJinnNode)
        {
            return global.GetJinnNode(Item);
        }

        return GetCopyNode(Item, 0);
    }

    global.HTTPCaller.GetHotArray = function (Param)
    {
        let ArrTree = global.SERVER.GetTransferTree();
        if(!ArrTree)
            return {result:0};

        for(let Level = 0; Level < ArrTree.length; Level++)
        {
            let arr = ArrTree[Level];
            if(!arr)
                continue;

            for(let n = 0; n < arr.length; n++)
            {
                arr[n] = GetCopyNode(arr[n], 1);
            }
        }

        let Ret = {result:1, ArrTree:ArrTree, JINN_MODE:1};
        return Ret;
    }

    function SortNodeHot(a,b)
    {
        let HotA = 0;
        let HotB = 0;
        if(a.Hot)
            HotA = 1;
        if(b.Hot)
            HotB = 1;

        if(HotB !== HotA)
            return HotB - HotA;

        if(b.BlockProcessCount !== a.BlockProcessCount)
            return b.BlockProcessCount - a.BlockProcessCount;

        if(a.DeltaTime !== b.DeltaTime)
            return a.DeltaTime - b.DeltaTime;

        return a.id - b.id;
    }

    function GetCopyNode(Node,bSimple)
    {
        if(!Node)
            return;

        if(bSimple)
        {
            let Item = {ID:Node.id, ip:Node.ip, Active:Node.Active, CanHot:Node.CanHot, Hot:Node.Hot, IsCluster:Node.IsCluster, Cross:Node.Cross,
                Level:Node.Level, BlockProcessCount:Node.BlockProcessCount, TransferCount:Node.TransferCount, DeltaTime:Node.DeltaTime, Name:Node.Name,
                Debug:Node.Debug, CurrentShard:Node.CurrentShard, };
            return Item;
        }

        if(Node.Socket && Node.Socket.Info)
        {
            Node.Info += Node.Socket.Info + "\n";
            Node.Socket.Info = "";
        }
        if(!Node.PrevInfo)
            Node.PrevInfo = "";

        let Item = {ID:Node.id, ip:Node.ip, VersionNum:Node.VersionNum, NetConstVer:Node.NetConstVer, VERSION:Node.VERSIONMAX, LoadHistoryMode:Node.LoadHistoryMode,
            BlockNumDBMin:Node.BlockNumDBMin, BlockNumDB:Node.BlockNumDB, LevelsBit:Node.LevelsBit, NoSendTx:Node.NoSendTx, GetNoSendTx:Node.GetNoSendTx,
            DirectMAccount:Node.DirectMAccount, portweb:Node.portweb, port:Node.port, TransferCount:Node.TransferCount, LevelCount:Node.LevelCount,
            LevelEnum:Node.LevelEnum, TimeTransfer:GetStrOnlyTimeUTC(new Date(Node.LastTimeTransfer)), BlockProcessCount:Node.BlockProcessCount,
            DeltaTime:Node.DeltaTime, DeltaTimeM:Node.DeltaTimeM, DeltaGlobTime:Node.DeltaGlobTime, PingNumber:Node.PingNumber, NextConnectDelta:Node.NextConnectDelta,
            NextGetNodesDelta:Node.NextGetNodesDelta, NextHotDelta:Node.NextHotDelta, Name:Node.Name, addrStr:Node.addrStr, CanHot:Node.CanHot,
            Active:Node.Active, Hot:Node.Hot, LogInfo:Node.PrevInfo + Node.LogInfo, InConnectArr:Node.WasAddToConnect, Level:Node.Level,
            TransferBlockNum:Node.TransferBlockNum, TransferSize:Node.TransferSize, TransferBlockNumFix:Node.TransferBlockNumFix, CurBlockNum:Node.CurBlockNum,
            WasBan:Node.WasBan, ErrCountAll:Node.ErrCountAll, ADDRITEM:Node.ADDRITEM, INFO:Node.INFO, STATS:Node.STATS, };

        return Item;
    }



    global.HTTPCaller.GetBlockchainStat = function (Param)
    {
        let Result = global.Engine.GetBlockchainStatForMonitor(Param);

        Result.result = 1;
        Result.sessionid = GetSessionId();
        return Result;
    }

    global.HTTPCaller.GetAllCounters = function (Params,response)
    {
        let Result = GET_STATS();
        Result.result = 1;
        Result.sessionid = GetSessionId();
        Result.STAT_MODE = global.STAT_MODE;

        if(!global.TX_PROCESS || !global.TX_PROCESS.RunRPC)
            return Result;

        global.TX_PROCESS.RunRPC("GET_STATS", "", function (Err,Params)
        {
            Result.result = !Err;
            if(Result.result)
            {
                AddStatData(Params, Result, "TX");
            }

            if(global.WEB_PROCESS && global.WEB_PROCESS.RunRPC)
            {
                global.WEB_PROCESS.RunRPC("GET_STATS", "", function (Err,Params)
                {
                    Result.result = !Err;
                    if(Result.result)
                    {
                        AddStatData(Params, Result, "WEB");
                    }
                    response.end(JSON.stringify(Result));
                });
            }
            else
            {
                response.end(JSON.stringify(Result));
            }
        });

        return null;
    }

    function AddStatData(Params,Result,Prefix)
    {
        for(let name in Params.stats)
        {
            for(let key in Params.stats[name])
            {
                let Item = Params.stats[name][key];
                Result.stats[name][key + "-" + Prefix] = Item;
            }
        }
    }

    global.HTTPCaller.SetStatMode = function (flag)
    {
        if(flag)
            StartCommonStat();

        global.STAT_MODE = flag;
        global.SAVE_CONST(true);
        global.TX_PROCESS.RunRPC("LOAD_CONST");

        return {result:1, sessionid:GetSessionId(), STAT_MODE:global.STAT_MODE};
    }
    global.HTTPCaller.ClearStat = function ()
    {
        global.ClearCommonStat();

        if(global.TX_PROCESS && global.TX_PROCESS.RunRPC)
        {
            global.TX_PROCESS.RunRPC("ClearCommonStat", "", function (Err,Params) { });
        }
        if(global.WEB_PROCESS && global.WEB_PROCESS.RunRPC)
        {
            global.WEB_PROCESS.RunRPC("ClearCommonStat", "", function (Err,Params) { });
        }

        return {result:1, sessionid:GetSessionId(), STAT_MODE:global.STAT_MODE};
    }

    global.HTTPCaller.RewriteAllTransactions = function (Param)
    {
        global.SERVER.RewriteAllTransactions();

        return {result:1, sessionid:GetSessionId()};
    }

    global.HTTPCaller.RewriteTransactions = function (Param)
    {
        let Ret = REWRITE_DAPP_TRANSACTIONS(Param.BlockCount);
        return {result:Ret, sessionid:GetSessionId()};
    }
    global.HTTPCaller.TruncateBlockChain = function (Param)
    {
        let StartNum = global.SERVER.BlockNumDB - Param.BlockCount;
        if(StartNum < 15)
            StartNum = 15;

        global.SERVER.TruncateBlockDB(StartNum);
        return {result:1, sessionid:GetSessionId()};
    }

    global.HTTPCaller.ClearDataBase = function (Param)
    {
        global.SERVER.ClearDataBase();
        return {result:1, sessionid:GetSessionId()};
    }

    global.HTTPCaller.CleanChain = function (Param)
    {
        if(global.CleanChain)
        {

            let StartNum = global.SERVER.BlockNumDB - Param.BlockCount;
            global.CleanChain(StartNum);
            return {result:1, sessionid:GetSessionId()};
        }
        return {result:0, sessionid:GetSessionId()};
    }

    global.HTTPCaller.StartLoadNewCode = function (Param)
    {
        global.NoStartLoadNewCode = 1;
        update(global)
        // require("../update");

        global.StartLoadNewCode(1);
        return {result:1, sessionid:GetSessionId()};
    }

    global.HTTPCaller.AddSetNode = function (AddrItem)
    {
        if(!global.Engine.NodesTree.find(AddrItem))
            global.Engine.AddNodeAddr(AddrItem);
        let Find = global.Engine.NodesTree.find(AddrItem);
        if(Find)
        {
            Find.System = 1;
            Find.Score = AddrItem.Score;
            global.Engine.SaveAddrNodes();

            return {result:1, sessionid:GetSessionId()};
        }
        else
        {
            return {result:0, sessionid:GetSessionId()};
        }
    }


    global.HTTPCaller.GetArrStats = function (Keys,response)
    {
        let arr = GET_STATDIAGRAMS(Keys);
        let Result = {result:1, sessionid:GetSessionId(), arr:arr, STAT_MODE:global.STAT_MODE};

        if(!global.TX_PROCESS || !global.TX_PROCESS.RunRPC)
            return Result;

        let Keys2 = [];
        for(let i = 0; i < Keys.length; i++)
        {
            let Str = Keys[i];
            if(Str.substr(Str.length - 3) == "-TX")
                Keys2.push(Str.substr(0, Str.length - 3));
        }
        global.TX_PROCESS.RunRPC("GET_STATDIAGRAMS", Keys2, function (Err,Arr)
        {
            Result.result = !Err;
            if(Result.result)
            {
                for(let i = 0; i < Arr.length; i++)
                {
                    let Item = Arr[i];
                    Item.name = Item.name + "-TX";
                    Result.arr.push(Item);
                }
            }

            let Str = JSON.stringify(Result);
            response.end(Str);
        });

        return null;
    }


    global.HTTPCaller.GetBlockChain = function (type)
    {
        if(!global.SERVER || !global.SERVER.LoadedChainList)
        {
            return {result:0};
        }

        let MainChains = {};
        for(let i = 0; i < global.SERVER.LoadedChainList.length; i++)
        {
            let chain = global.SERVER.LoadedChainList[i];
            if(chain && !chain.Deleted)
                MainChains[chain.id] = true;
        }

        let arrBlocks = [];
        let arrLoadedChainList = [];
        let arrLoadedBlocks = [];

        for(let key in global.SERVER.BlockChain)
        {
            let Block = global.SERVER.BlockChain[key];
            if(Block)
            {
                arrBlocks.push(CopyBlockDraw(Block, MainChains));
            }
        }

        AddChainList(arrLoadedChainList, global.SERVER.LoadedChainList, true);
        AddMapList(arrLoadedBlocks, type, global.SERVER.MapMapLoaded, MainChains);

        let ArrLoadedChainList = global.HistoryBlockBuf.LoadValue("LoadedChainList", 1);
        if(ArrLoadedChainList)
            for(let List of ArrLoadedChainList)
            {
                AddChainList(arrLoadedChainList, List);
            }

        let ArrMapMapLoaded = global.HistoryBlockBuf.LoadValue("MapMapLoaded", 1);
        if(ArrMapMapLoaded)
            for(let List of ArrMapMapLoaded)
            {
                AddMapList(arrLoadedBlocks, type, List);
            }

        let obj = {LastCurrentBlockNum:global.SERVER.GetLastCorrectBlockNum(), CurrentBlockNum:global.SERVER.CurrentBlockNum, LoadedChainList:arrLoadedChainList,
            LoadedBlocks:arrLoadedBlocks, BlockChain:arrBlocks, port:global.SERVER.port, DELTA_CURRENT_TIME:global.DELTA_CURRENT_TIME, memoryUsage:process.memoryUsage(),
            IsDevelopAccount:global.IsDeveloperAccount(global.WALLET.PubKeyArr), LoadedChainCount:global.SERVER.LoadedChainList.length, StartLoadBlockTime:global.SERVER.StartLoadBlockTime,
            sessionid:GetSessionId(), result:1};

        arrBlocks = [];
        arrLoadedChainList = [];
        arrLoadedBlocks = [];

        return obj;
    }

    global.HTTPCaller.GetHistoryTransactions = function (Params)
    {

        if(typeof Params === "object" && Params.AccountID)
        {
            let Account = global.ACCOUNTS.ReadState(Params.AccountID);
            if(!Account)
                return {result:0};

            if(!Params.Count)
                Params.Count = 100;

            if(global.PROCESS_NAME !== "MAIN")
                Params.GetPubKey = 0;

            let arr = global.ACCOUNTS.GetHistory(Params.AccountID, Params.Count, Params.NextPos, 0, Params.GetPubKey);
            if(Params.GetTxID || Params.GetDescription)
            {
                for(let i = 0; i < arr.length; i++)
                {
                    let Item = arr[i];
                    let Block = global.SERVER.ReadBlockDB(Item.BlockNum);
                    if(!Block || (!Block.arrContent))
                        continue;
                    let Body = Block.arrContent[Item.TrNum];
                    if(!Body)
                        continue;

                    if(Params.GetTxID)
                    {
                        Item.TxID = global.GetHexFromArr(GetTxID(Item.BlockNum, Body));
                    }
                    if(Params.GetDescription && Item.Description === undefined)
                    {

                        let TR = global.ACCOUNTS.GetObjectTransaction(Body);
                        if(TR)
                            Item.Description = TR.Description;
                    }
                }
            }
            let Result = {
                Value:{SumCOIN:Account.Value.SumCOIN, SumCENT:Account.Value.SumCENT}, Name:Account.Name, Currency:Account.Currency,
                MaxBlockNum:global.GetCurrentBlockNumByTime(),
                FIRST_TIME_BLOCK:global.FIRST_TIME_BLOCK,
                UPDATE_CODE_JINN:global.UPDATE_CODE_JINN,
                CONSENSUS_PERIOD_TIME:global.CONSENSUS_PERIOD_TIME,
                NETWORK:global.NETWORK,
                SHARD_NAME:global.SHARD_NAME,
                result:arr.length > 0 ? 1 : 0, History:arr};
            if(Params.GetBalanceArr)
            {
                if(Account.Currency)
                    Account.CurrencyObj = global.SMARTS.ReadSimple(Account.Currency, 1);
                Result.BalanceArr = global.ACCOUNTS.ReadBalanceArr(Account);
            }

            return Result;
        }
        return {result:0};
    }


    function GetCopyBlock(Block)
    {
        let Result = {BlockNum:Block.BlockNum, TreeHash:GetHexFromAddres(Block.TreeHash), AddrHash:GetHexFromAddres(Block.AddrHash),
            PrevHash:GetHexFromAddres(Block.PrevHash), SumHash:GetHexFromAddres(Block.SumHash), SumPow:Block.SumPow, TrDataLen:Block.TrDataLen,
            SeqHash:GetHexFromAddres(Block.SeqHash), Hash:GetHexFromAddres(Block.Hash), Power:GetPowPower(Block.PowHash), TrCount:Block.TrCount,
            arrContent:Block.arrContent, };
        return Result;
    }



    let AddrLength = 16;
    function GetHexFromAddresShort(Hash)
    {
        return GetHexFromAddres(Hash).substr(0, AddrLength);
    }
    function GetHexFromStrShort(Str)
    {
        if(Str === undefined)
            return Str;
        else
            return Str.substr(0, AddrLength);
    }

    let glid = 0;
    function GetGUID(Block)
    {
        if(!Block) {
            return "------";
        }
        if(!Block.guid)
        {
            glid++;
            Block.guid = glid;
        }
        return Block.guid;
    }
    function CopyBlockDraw(Block,MainChains)
    {
        let MinerID = 0;
        let MinerName = "";
        if(Block.AddrHash)
        {
            let Num = ReadUintFromArr(Block.AddrHash, 0);
            MinerID = Num;
            if(Num)
            {
                let Item = global.ACCOUNTS.ReadState(Num);
                if(Item && typeof Item.Name === "string")
                {
                    MinerName = Item.Name.substr(0, 8);
                }
            }
        }

        let CheckPoint = 0;
        if(Block.BlockNum === CHECK_POINT.BlockNum)
            CheckPoint = 1;

        let Mining;
        if(global.SERVER.MiningBlock === Block)
            Mining = 1;
        else
            Mining = 0;

        GetGUID(Block);
        let Item = {guid:Block.guid, Active:Block.Active, Prepared:Block.Prepared, BlockNum:Block.BlockNum, Hash:GetHexFromAddresShort(Block.Hash),
            SumHash:GetHexFromAddresShort(Block.SumHash), SeqHash:GetHexFromAddresShort(Block.SeqHash), TreeHash:GetHexFromAddresShort(Block.TreeHash),
            AddrHash:GetHexFromAddresShort(Block.AddrHash), MinerID:MinerID, MinerName:MinerName, SumPow:Block.SumPow, Info:Block.Info,
            TreeLoaded:Block.TreeEq, AddToLoad:Block.AddToLoad, LoadDB:Block.LoadDB, FindBlockDB:Block.FindBlockDB, TrCount:Block.TrCount,
            ArrLength:0, TrDataLen:Block.TrDataLen, Power:GetPowPower(Block.PowHash), CheckPoint:CheckPoint, Mining:Mining, TransferSize:Block.TransferSize,
            HasErr:Block.HasErr, };
        if(Block.chain)
            Item.chainid = Block.chain.id;
        if(Block.arrContent)
            Item.TrCount = Block.arrContent.length;

        Item.BlockDown = GetGUID(Block.BlockDown);

        if(MainChains && Item.chainid)
        {
            Item.Main = MainChains[Item.chainid];
        }

        return Item;
    }
    function CopyChainDraw(Chain,bWasRecursive,bMain)
    {
        if(!Chain)
            return Chain;

        GetGUID(Chain);

        let Item = {guid:Chain.guid, id:Chain.id, chainid:Chain.id, FindBlockDB:Chain.FindBlockDB, GetFindDB:Chain.GetFindDB(), BlockNum:Chain.BlockNumStart,
            Hash:GetHexFromAddresShort(Chain.HashStart), StopSend:Chain.StopSend, SumPow:0, Info:Chain.Info, IsSum:Chain.IsSum, Main:bMain,
        };
        if(Chain.IsSumStart)
        {
            Item.SumHash = Item.Hash;
            Item.Hash = "-------";
        }
        if(Chain.RootChain)
        {
            let rootChain = Chain.GetRootChain();
            if(rootChain)
            {
                Item.rootid = rootChain.id;
                if(!bWasRecursive)
                    Item.root = CopyChainDraw(rootChain, true);
            }
        }
        else
            Item.rootid = "";
        if(Chain.BlockHead)
        {
            Item.HashMaxStr = GetGUID(Chain.BlockHead);
            Item.BlockNumMax = Chain.BlockHead.BlockNum;
        }
        else
        {
            Item.HashMaxStr = "------";
        }

        return Item;
    }

    function AddChainList(arrLoadedChainList,LoadedChainList,bMain)
    {
        debug(-3, '💂[(server*)AddChainList]',{
            arrLoadedChainList: arrLoadedChainList,
            LoadedChainList: LoadedChainList,
            bMain: bMain
        })
        for(let chain of LoadedChainList)
        {
            if(chain)
            {
                arrLoadedChainList.push(CopyChainDraw(chain, false, bMain));
            }
        }
    }
    function AddMapList(arrLoadedBlocks,type,MapMapLoaded,MainChains)
    {
        debug(-3, '💂[(server*)AddMapList]',{
            arrLoadedBlocks: arrLoadedBlocks,
            type: type,
            MapMapLoaded: MapMapLoaded,
            MainChains: MainChains
        })
        for(let key in MapMapLoaded)
        {
            let map = MapMapLoaded[key];
            if(map)
            {
                for(let key in map)
                {
                    let Block = map[key];
                    if(key.substr(1, 1) === ":")
                        continue;

                    if(!Block.Send || type === "reload")
                    {
                        arrLoadedBlocks.push(CopyBlockDraw(Block, MainChains));
                        Block.Send = true;
                    }
                }
            }
        }
    }

    function SendWebFile(request,response,name,StrCookie,bParsing,Long)
    {
        let type = name.substr(name.length - 4, 4);
        let index1 = type.indexOf(".");
        type = type.substr(index1 + 1);

        let Path;
        if(name.substr(0, 2) !== "./" && name.substr(1, 1) !== ":")
            Path = "./" + name;
        else
            Path = name;

        let bErr = 0;
        let FStat = undefined;
        if(!fs.existsSync(Path))
            bErr = 1;
        else
        {
            FStat = fs.statSync(Path);
            if(!FStat.isFile())
                bErr = 1;
        }

        if(bErr)
        {
            if(!global.DEV_MODE || type === "ico")
            {
                response.writeHead(404, {'Content-Type':'text/html'});
                response.end();
                return;
            }
            response.end("Not found: " + name);
            return;
        }

        let StrContentType = ContenTypeMap[type];
        if(!StrContentType)
            StrContentType = DefaultContentType;

        let Headers = {};
        if(StrContentType === "text/html")
        {
            Headers['Content-Type'] = 'text/html';

            if(Path !== "./HTML/web3-wallet.html")
                Headers["X-Frame-Options"] = "sameorigin";

            if(StrCookie)
                Headers['Set-Cookie'] = StrCookie;
        }
        else
        {
            if(StrContentType === "application/font-woff")
            {
                Headers['Content-Type'] = StrContentType;
                Headers['Access-Control-Allow-Origin'] = "*";
            }
            else
            {
                Headers['Content-Type'] = StrContentType;
            }
        }

        let ArrPath = Path.split('/', 5);
        let ShortName = ArrPath[ArrPath.length - 1];
        let Long2 = CacheMap[ShortName];
        if(Long2)
            Long = Long2;

        if(global.DEV_MODE)
            Long = 1;

        if(Long)
        {
            Headers['Cache-Control'] = "max-age=" + Long;
        }

        if(bParsing && StrContentType === "text/html")
        {
            let data = GetFileHTMLWithParsing(Path);
            SendGZipData(request, response, Headers, data);
            return;
        }
        else
        if("image/jpeg,image/vnd.microsoft.icon,image/svg+xml,image/png,application/javascript,text/css,text/html".indexOf(StrContentType) >  - 1)
        {
            response.writeHead(200, Headers);

            let data = global.GetFileSimpleBin(Path);
            SendGZipData(request, response, Headers, data);
            return;
        }
        const stream = fs.createReadStream(Path);
        let acceptEncoding = request.headers['accept-encoding'];
        if(!global.HTTP_USE_ZIP || !acceptEncoding)
        {
            acceptEncoding = '';
        }

        if(/\bdeflate\b/.test(acceptEncoding))
        {
            Headers['Content-Encoding'] = 'deflate';
            response.writeHead(200, Headers);
            stream.pipe(zlib.createDeflate({level:zlib.constants.Z_BEST_SPEED})).pipe(response);
        }
        else
        if(/\bgzip\b/.test(acceptEncoding))
        {
            Headers['Content-Encoding'] = 'gzip';
            response.writeHead(200, Headers);
            stream.pipe(zlib.createGzip({level:zlib.constants.Z_BEST_SPEED})).pipe(response);
        }
        else
        if(/\bbr\b/.test(acceptEncoding))
        {
            Headers['Content-Encoding'] = 'br';
            response.writeHead(200, Headers);
            stream.pipe(zlib.createBrotliCompress()).pipe(response);
        }
        else
        {
            response.writeHead(200, Headers);

            let TimePeriod = 30 * 60 * 1000;
            if(type === "zip")
                TimePeriod += Math.floor(FStat.size / 100000) * 1000;

            setTimeout(function ()
            {

                stream.close();
                stream.push(null);
                stream.read(0);
            }, TimePeriod);

            stream.pipe(response);
        }
    }

    function SendGZipData(request,response,Headers,data0)
    {
        if(!data0)
            data0 = [];
        let data = buffer.from(data0);

        let acceptEncoding = request.headers['accept-encoding'];
        if(!global.HTTP_USE_ZIP || !acceptEncoding)
        {
            acceptEncoding = '';
        }

        if(/\bgzip\b/.test(acceptEncoding))
        {
            Headers['Content-Encoding'] = 'gzip';
            response.writeHead(200, Headers);

            let gzip = zlib.createGzip({level:zlib.constants.Z_BEST_SPEED});
            gzip.pipe(response);
            gzip.on('error', function (err)
            {
                global.ToLog(err);
            });
            gzip.write(data);
            gzip.end();
        }
        else
        {
            response.writeHead(200, Headers);
            response.end(data);
        }
    }

    function GetFileHTMLWithParsing(Path,bZip)
    {
        if(bZip)
        {
            let data = GetFileHTMLWithParsing(Path, 0);

            return data;
        }
        else
        {
            let data = global.SendHTMLMap[Path];
            if(!data)
            {
                global.SendHTMLMap[Path] = "-recursion-";

                data = String(fs.readFileSync(Path));

                data = ParseTag(data, "File", 0);
                data = ParseTag(data, "Edit", 1);

                global.SendHTMLMap[Path] = data;
            }
            return data;
        }
    }

    let glEditNum = 0;
    function ParseTag(Str,TagName,bEdit)
    {
        let bWasInject = 0;
        let data = "";
        let index = 0;
        while(index >= 0)
        {
            index = Str.indexOf("{{" + TagName + "=", index);
            if(index >= 0)
            {
                let index2 = Str.indexOf("}}", index + 3 + TagName.length);
                if(index2 < 0)
                {
                    global.ToLog("Error teg " + TagName + " in " + Path);
                    break;
                }
                let Delta = index2 - index;
                if(Delta > 210)
                {
                    global.ToLog("Error length (more 200) teg File in " + Path);
                    break;
                }
                let Path2 = Str.substring(index + 3 + TagName.length, index + Delta);

                data += Str.substring(0, index);
                if(bEdit) {
                    if(!bWasInject) {
                        data = data + GetFileSimple("./SITE/JS/web-edit.html");
                        bWasInject = 1;
                    }
                    glEditNum++;

                    data += "<DIV class='' id='idEdit" + glEditNum + "'>";
                    data += GetFileHTMLFromMarkdown(Path2);
                    data += "</DIV>";
                    data += "<script>AddNewEditTag('idEdit" + glEditNum + "','" + Path2 + "');</script>";
                }
                else
                {
                    data += GetFileHTMLWithParsing(Path2);
                }
                Str = Str.substring(index2 + 2);
                index = 0;
            }
        }
        data += Str;
        return data;
    }

    let MarkLib;
    function GetFileHTMLFromMarkdown(Path) {
        let data = global.SendHTMLMap[Path];
        if(!data) {
            if(MarkLib === undefined)
                MarkLib = require("../HTML/JS/marked.js");
            let Str = "";
            if(fs.existsSync(Path))
                Str = String(fs.readFileSync(Path));
            data = MarkLib(Str);
            global.SendHTMLMap[Path] = data;
        }
        return data;
    }
    function GetFileSimple(Path) {
        let Key = "GetFileSimple-" + Path;
        let data = global.SendHTMLMap[Key];
        if(!data)
        {
            data = String(fs.readFileSync(Path));
            global.SendHTMLMap[Key] = data;
        }
        return data;
    }
    global.GetFileSimpleBin = function (Path) {
        let Key = "GetFileSimpleBin-" + Path;
        let data = global.SendHTMLMap[Key];
        if(!data)
        {
            data = fs.readFileSync(Path);
            global.SendHTMLMap[Key] = data;
        }
        return data;
    };

    function SaveFileSimple(Path,Str) {
        global.SendHTMLMap = {};
        let Key = "GetFileSimple-" + Path;
        global.SendHTMLMap[Key] = Str;
        global.SaveToFile(Path, Str);
    }

    global.SendHTMLMap = {};
    global.SendWebFile = SendWebFile;
    global.GetFileHTMLWithParsing = GetFileHTMLWithParsing;
    global.GetFileHTMLFromMarkdown = GetFileHTMLFromMarkdown;
    global.GetFileSimple = GetFileSimple;
    global.SaveFileSimple = SaveFileSimple;

    function ReloaSenddBufer() {
        global.SendHTMLMap = {};
    }

    setInterval(ReloaSenddBufer, 60 * 1000);
    if(global.DEV_MODE)
        setInterval(ReloaSenddBufer, 1 * 1000);

    function GetStrTime(now)
    {
        if(!now)
            now = global.GetCurrentTime(0);

        let Str = "" + now.getHours().toStringZ(2);
        Str = Str + ":" + now.getMinutes().toStringZ(2);
        Str = Str + ":" + now.getSeconds().toStringZ(2);
        return Str;
    }

    function OnGetData(arg) {
        debug(-2, '💂[(server)OnGetData]', arg)
        let response = {
            end:function () { },
            writeHead:function () { },
        };

        let Path = arg.path;
        let obj = arg.obj;

        if(Path.substr(0, 1) === "/")
            Path = Path.substr(1);
        let params = Path.split('/', 5);

        let Ret;
        let F = global.HTTPCaller[params[0]];
        if(F) {
            if(obj)
                Ret = F(obj);
            else
                Ret = F(params[1], params[2], params[3]);
        }
        else
        {
            Ret = {result:0};
        }
        return Ret;
    }

    function parseCookies(rc) {
        let list = {};

        rc && rc.split(';').forEach(function (cookie)
        {
            let parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });

        return list;
    }

    global.SetSafeResponce = SetSafeResponce;
    function SetSafeResponce(response) {
        if(!response.Safe) {
            response.Safe = 1;
            response.StopSend = 0;
            response._end = response.end;
            response._writeHead = response.writeHead;

            if(response.socket && response.socket._events && response.socket._events.error.length < 2) {
                response.socket.on("error", function (err) { });
            }

            response.on('error', function (err) {
                console.log("Error " + err);
            });

            response.writeHead = function () {
                try {
                    response._writeHead.apply(response, arguments);
                } catch(e) {
                    global.ToError("H##2");
                    global.ToError(e);
                }
            };
            response.end = function () {
                try {
                    if(global.STAT_MODE === 2 && arguments && arguments[0] && arguments[0].length) {
                        global.ADD_TO_STAT("HTTP_SEND", arguments[0].length);
                        if(response.DetailStatName)
                            global.ADD_TO_STAT("HTTP_SEND" + response.DetailStatName, arguments[0].length);
                    }

                    response._end.apply(response, arguments);
                }
                catch(e)
                {

                    global.ToError("H##1");
                    global.ToError(e);
                }
            };
        }
    }

    if(global.HTTP_PORT_NUMBER) {
        glStrToken = global.GetHexFromArr(crypto.randomBytes(16));
        let ClientTokenHashMap = {};
        let ClientIPMap = {};
        let ClientIPMap2 = {};
        setInterval(function () {
            ClientTokenHashMap = {};
        }, 24 * 3600 * 1000);

        let MaxTimeEmptyAccess = 600;
        let CountPswdPls = 0;
        let TimeStartServer = Date.now();

        let port = global.HTTP_PORT_NUMBER;
////////////////////////////////////////////////////
//         let HTTPServer_node = node.rest.createServer()
//
//         HTTPServer_node.get('/', (req, res) => {
//
//             res.send('hello from dialer')
//
//         })
//         console.log(HTTPServer_node)
//         console.assert(false)
//         HTTPServer_node.listen(4321)
/////////////////////////////////////////////////////
        let HTTPServer = http.createServer(function (request,response) {
            if(!request.headers)
                return;
            if(!request.socket || !request.socket.remoteAddress)
                return;

            if(request.socket._events && request.socket._events.error.length < 2)
                request.socket.on("error", function (err) {
                    if(err.code === "EPIPE")
                        return;
                    console.log("HTML socket.error code=" + err.code);
                    global.ToLog(err.stack, 3);
                });

            let remoteAddress = request.socket.remoteAddress.replace(/^.*:/, '');

            if(remoteAddress === "1")
                remoteAddress = "127.0.0.1";

            let fromURL = url.parse(request.url);
            let Path = querystring.unescape(fromURL.path);
            if(!ClientIPMap[remoteAddress]) {
                ClientIPMap[remoteAddress] = 1;
                global.ToLog("TRY CONNECT FOR HTTP ACCESS FROM: " + remoteAddress, 0);
                global.ToLog("☺️Path: " + Path, 0);
            }

            let Password = global.HTTP_PORT_PASSWORD;

            let CheckPassword = 1;
            if(global.NOHTMLPASSWORD) {
                if(global.HTTP_IP_CONNECT || remoteAddress === "127.0.0.1") {
                    CheckPassword = 0;
                }
            }
            if(CheckPassword && !Password) {
                if(remoteAddress !== "127.0.0.1") {
                    return;
                } else {
                    if(!global.NWMODE) {
                        let Delta = Date.now() - TimeStartServer;
                        if(Delta > MaxTimeEmptyAccess * 1000) {
                            Password = global.GetHexFromArr(crypto.randomBytes(16));
                        } else {
                            if(Delta > (MaxTimeEmptyAccess - 10) * 1000) {
                                CountPswdPls++;
                                if(CountPswdPls <= 5) {
                                    global.ToLog("PLEASE, SET PASSWORD FOR ACCCES TO FULL NODE");
                                }
                            }
                        }
                    }
                }
            }
            debug(-3, '💂[(server*)HTTP_IP_CONNECT]',{
               "global.HTTP_IP_CONNECT": global.HTTP_IP_CONNECT,
                "remoteAddress": remoteAddress
            })
            if(global.HTTP_IP_CONNECT && remoteAddress !== "127.0.0.1" && global.HTTP_IP_CONNECT.indexOf(remoteAddress) < 0) {
                return;
            }

            debug(-3, '💂[(server*)SetSafeResponce]')
            SetSafeResponce(response);

            if(!global.SERVER || !global.SERVER.CanSend) {
                response.writeHead(404, {'Content-Type':'text/html'});
                response.end("");
                return;
            }

            if(global.NWMODE) {
                Path = Path.replace("HTML/HTML", "HTML");
                if("/HTML/" + global.NW_TOKEN === Path)
                {
                    if(!Password)
                    {
                        SendWebFile(request, response, "/HTML/wallet.html", "NW_TOKEN=" + global.NW_TOKEN + ";path=/");
                        return;
                    }
                    else
                    {
                        Path = "/HTML/wallet.html";
                    }
                }

                if(!Password)
                {
                    let cookies = parseCookies(request.headers.cookie);
                    if(cookies["NW_TOKEN"] === global.NW_TOKEN)
                    {
                        CheckPassword = 0;
                    }
                    else
                    {
                        return;
                    }
                }
            }

            if(CheckPassword && Password) {
                let StrPort = "";
                if(global.HTTP_PORT_NUMBER !== 80)
                    StrPort = global.HTTP_PORT_NUMBER;

                let cookies = parseCookies(request.headers.cookie);

                let cookies_hash = cookies["hash" + StrPort];

                let bSendPSW = 0;
                if(cookies_hash && !ClientTokenHashMap[cookies_hash]) {
                    let hash = GetCookieHash(cookies_hash, Password);

                    if(hash && hash === cookies_hash) {
                        ClientTokenHashMap[cookies_hash] = 1;
                    }
                    else {
                        bSendPSW = 1;
                    }
                }
                else
                if(!ClientIPMap2[remoteAddress] && !cookies_hash) {
                    bSendPSW = 1;
                }
                if(Path === "/password.html")
                    bSendPSW = 1;

                if(bSendPSW)
                {
                    SendPasswordFile(request, response, Path, StrPort);
                    return;
                }
                else
                if(request.method === "POST")
                {
                    let TokenHash = request.headers.tokenhash;

                    if(!TokenHash || !ClientTokenHashMap[TokenHash])
                    {
                        let hash2;
                        if(TokenHash)
                            hash2 = GetCookieHash(TokenHash, Password + "-api");

                        if(TokenHash && hash2 && hash2 === TokenHash)
                        {
                            ClientTokenHashMap[TokenHash] = 1;
                        }
                        else
                        {
                            if(TokenHash && hash2)
                                global.ToLog("Invalid API token: " + request.method + "   path: " + Path + "  token:" + TokenHash + "/" + hash2);
                            response.writeHead(203, {'Content-Type':'text/html'});
                            response.end("Invalid API token");
                            return;
                        }
                    }
                }
            }
            if(!ClientIPMap2[remoteAddress])
            {
                ClientIPMap2[remoteAddress] = 1;
                global.ToLog("OK CONNECT TO HTTP ACCESS FROM: " + remoteAddress, 0);
                global.ToLog("Path: " + Path, 0);
            }

            let params = Path.split('/', 6);
            params.splice(0, 1);
            let Type = request.method;
            if(Type === "POST")
            {
                let Response = response;
                let Params = params;
                let postData = "";
                request.addListener("data", function (postDataChunk)
                {
                    if(postData.length < 130000 && postDataChunk.length < 130000)
                        postData += postDataChunk;
                });

                request.addListener("end", function ()
                {
                    let Data;
                    try
                    {
                        Data = JSON.parse(postData);
                    }
                    catch(e)
                    {
                        global.ToError("--------Error data parsing : " + Params[0] + " " + postData.substr(0, 200));
                        Response.writeHead(405, {'Content-Type':'text/html'});
                        Response.end("Error data parsing");
                        return;
                    }

                    if(Params[0] === "HTML")
                        DoCommand(request, response, Type, Path, [Params[1], Data], remoteAddress);
                    else
                        DoCommand(request, response, Type, Path, [Params[0], Data], remoteAddress);
                });
            }
            else
            {
                DoCommand(request, response, Type, Path, params, remoteAddress);
            }
        }).listen(port, global.LISTEN_IP, function () {
            global.HTTP_SERVER_START_OK = 1;
            global.ToLog("Run HTTP-server on " + global.LISTEN_IP + ":" + port);
        });

        HTTPServer.on('error', function (err)
        {
            global.ToError("H##3");
            global.ToError(err);
        });
    }

    function SendPasswordFile(request,response,Path,StrPort)
    {
        if(!Path || Path === "/" || Path.substr(Path.length - 4, 4) === "html")
        {

            SendWebFile(request, response, "./HTML/password.html", "token" + StrPort + "=" + glStrToken + ";path=/;SameSite=Strict;");
        }
        else
        {
            response.writeHead(203, {'Content-Type':'text/html'});
            response.end("");
        }
    }

    if(global.ELECTRON)
    {
        const ipcMain = require('electron').ipcMain;

        ipcMain.on('GetData', function (event,arg)
        {
            event.returnValue = OnGetData(arg);
        });
    }


    global.RunConsole=RunConsole;
    function RunConsole(StrRun) {
        let ret = {}
        let Str = fs.readFileSync("./EXPERIMENTAL/_run-console.js", {encoding:"utf8"});
        if(StrRun)
            Str += "\n" + StrRun;

        try {
            ret = eval(Str);
        } catch(e) {
            ret = e.message + "\n" + e.stack;
        }
        return ret;
    }


    let WebWalletUser = {};
    function GetUserContext(Params) {
        if(typeof Params.Key !== "string")
            Params.Key = "" + Params.Key;

        let StrKey = Params.Key + "-" + Params.Session;
        let Context = WebWalletUser[StrKey];
        if(!Context)
        {
            Context = {NumDappInfo:0, PrevDappInfo:"", NumAccountList:0, PrevAccountList:"", LastTime:0, FromEventNum:0};
            Context.Session = Params.Session;
            Context.Key = StrKey;
            WebWalletUser[StrKey] = Context;
        }
        return Context;
    }
    global.GetUserContext = GetUserContext;


    global.EventNum = 0;
    global.EventMap = {};

    function AddDappEventToGlobalMap(Data)
    {
        global.EventNum++;
        Data.EventNum = global.EventNum;
        Data.EventDate = Date.now();

        let Arr = global.EventMap[Data.Smart];
        if(!Arr)
        {
            Arr = [];
            global.EventMap[Data.Smart] = Arr;
        }
        if(Arr.length < 1000)
        {
            Arr.push(Data);
        }
    }
    global.AddDappEventToGlobalMap = AddDappEventToGlobalMap;

    function DeleteOldEvents(SmartNum)
    {
        let CurDate = Date.now();
        let Arr = global.EventMap[SmartNum];

        while(Arr && Arr.length)
        {
            let Event = Arr[0];
            if(!Event || CurDate - Event.EventDate < 5000)
            {
                break;
            }
            Arr.splice(0, 1);
        }
    }

    function GetEventArray(SmartNum,Context)
    {
        let Arr = global.EventMap[SmartNum];
        if(!Arr || Arr.length === 0)
        {
            return [];
        }

        let FromEventNum = Context.FromEventNum;
        let ArrRet = [];
        for(let i = 0; i < Arr.length; i++) {
            let Event = Arr[i];
            if(Event.EventNum >= FromEventNum)
                ArrRet.push(Event);
        }
        if(ArrRet.length) {
            Context.FromEventNum = ArrRet[ArrRet.length - 1].EventNum + 1;
        }

        return ArrRet;
    }



    global.HTTPCaller.GetHashRate = function (ArrParams) {
        let CurBlockNum = global.GetCurrentBlockNumByTime();
        let ResArr = [];
        let DeltaMinute = 0;
        for(let i = 0; i < ArrParams.length; i++) {
            let bMinutes = (i === ArrParams.length - 1);

            let Item = ArrParams[i];
            if(!Item)
            {
                ResArr[i] = undefined;
                continue;
            }

            if(Item.BlockNum1 < 0)
                Item.BlockNum1 = 0;
            if(Item.BlockNum2 > CurBlockNum)
                Item.BlockNum2 = CurBlockNum;
            let Delta = Item.BlockNum2 - Item.BlockNum1;
            let Count = Delta;
            if(Count > 20 && !bMinutes)
                Count = 20;
            else
            if(Count <= 0)
                Count = 1;
            let StepDelta = Math.floor(Delta / Count);
            if(StepDelta < 1)
                StepDelta = 1;
            if(bMinutes)
                DeltaMinute = Delta;
            let CountAvg = 3;

            let StepDeltaAvg = Math.floor(StepDelta / CountAvg);
            if(StepDeltaAvg < 1)
                StepDeltaAvg = 1;

            let ItervalArr = [];
            for(let Num = Item.BlockNum1; Num < Item.BlockNum2; Num += StepDelta) {
                let Power;
                let Sum = 0;
                let CountSum = 0;
                for(let d = 0; d < CountAvg; d++)
                {
                    let BlockNum = Num + d * StepDeltaAvg;
                    let Block = global.Engine.GetBlockHeaderDB(BlockNum);
                    if(Block)
                    {
                        CountSum++;
                        if(Item.UseMaxChainHash)
                        {
                            let MaxPower = 0;
                            let ArrChain = global.Engine.DB.GetChainArrByNum(BlockNum);
                            for(let m = 0; m < ArrChain.length; m++)
                            {
                                if(MaxPower < ArrChain[m].Power)
                                    MaxPower = ArrChain[m].Power;
                            }
                            Sum += MaxPower;
                        }
                        else
                        {
                            Sum += Block.Power;
                        }
                    }
                    if(StepDelta / CountAvg <= 1)
                        break;
                }
                if(CountSum)
                {
                    Power = Math.floor(Sum / CountSum);
                }
                else
                {
                    Power = 0;
                }

                ItervalArr.push(Power);
            }
            ResArr[i] = ItervalArr;
        }

        let Ret = {result:1, ItervalArr:ResArr};
        Ret.MaxHashStatArr = global.Engine.GetTimePowerArr(global.GetCurrentBlockNumByTime() - DeltaMinute);
        return Ret;
    }

    function DoGetTransactionByID(response,Params)
    {
        let result = GetTransactionByID(Params);
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end(JSON.stringify(result));
    }
    global.HTTPCaller.GetTransaction = function (Params,response)
    {
        let result;
        if(typeof Params === "object" && Params.TxID)
        {
            result = GetTransactionByID(Params);
        }
        else
        {
            result = {result:0};
        }
        response.writeHead(200, {'Content-Type':'text/plain'});
        response.end(JSON.stringify(result));
        return null;
    }

    global.GetTransactionByID = GetTransactionByID;
    function GetTransactionByID(Params)
    {
        //SERVER.RefreshAllDB();

        let BlockNum;
        if(typeof Params.TxID === "string")
        {
            let Arr = global.GetArrFromHex(Params.TxID);
            let Arr1 = Arr.slice(0, TX_ID_HASH_LENGTH);
            BlockNum = ReadUintFromArr(Arr, TX_ID_HASH_LENGTH);

            for(let n=0;n<100;n++)//max 100 blocks
            {
                let Block = SERVER.ReadBlockDB(BlockNum+n);
                if(Block && Block.TxData)
                {
                    for(let i = 0; i < Block.TxData.length; i++)
                    {
                        let Tx = Block.TxData[i];
                        if(global.CompareArr(Tx.HASH.slice(0, TX_ID_HASH_LENGTH), Arr1) === 0)
                        {
                            return GetTransactionFromBody(Params, Block, i, Tx.body);
                        }
                    }
                }

            }
        }
        return {result:0, Meta:Params ? Params.Meta : undefined, BlockNum:BlockNum};
    }

    global.GetTransactionFromBody = GetTransactionFromBody;
    function GetTransactionFromBody(Params,Block,TrNum,Body)
    {
        let TR = global.ACCOUNTS.GetObjectTransaction(Body);
        if(TR)
        {
            ConvertBufferToStr(TR);
            TR.Meta = Params.Meta;
            TR.result = GetVerifyTransaction(Block, TrNum);
            if(TR.result===undefined)//не успела обновиться информация
                TR.result = 1;

            TR.BlockNum = Block.BlockNum;
            TR.TrNum = TrNum;
            return TR;
        }
        return {result:0, BlockNum:Block.BlockNum, Meta:Params ? Params.Meta : undefined};
    }

    function GetCookieHash(cookies_hash,Password)
    {
        if(!cookies_hash || cookies_hash.substr(0, 4) !== "0000")
        {
            return undefined;
        }

        let nonce = 0;
        let index = cookies_hash.indexOf("-");
        if(index > 0)
        {
            nonce = parseInt(cookies_hash.substr(index + 1));
            if(!nonce)
                nonce = 0;
        }

        let hash = global.CalcClientHash(glStrToken + "-" + Password, nonce);

        return hash;
    }

    global.GetFormatTx=function (Params) {
        debug(-3, '💂[(server*)GetFormatTx]',Params)
        let BlockNum=global.GetCurrentBlockNumByTime();
        let RetData= {
                CodeVer:global.START_CODE_VERSION_NUM,
                BLOCKCHAIN_VERSION:GETVERSION(BlockNum),
                PRICE:PRICE_DAO(BlockNum),

                FORMAT_SYS: global.FORMAT_SYS,
                FORMAT_SMART_CREATE1: global.FORMAT_SMART_CREATE1,
                FORMAT_SMART_CREATE2: global.FORMAT_SMART_CREATE2,
                FORMAT_SMART_RUN1: global.FORMAT_SMART_RUN1,
                FORMAT_SMART_RUN2: global.FORMAT_SMART_RUN2,
                FORMAT_SMART_CHANGE: global.FORMAT_SMART_CHANGE,
                FORMAT_ACC_CREATE: global.FORMAT_ACC_CREATE,
                FORMAT_ACC_CHANGE: global.FORMAT_ACC_CHANGE,
                FORMAT_MONEY_TRANSFER3: global.FORMAT_MONEY_TRANSFER3,
                FORMAT_MONEY_TRANSFER5: global.FORMAT_MONEY_TRANSFER5,
                FORMAT_FILE_CREATE: global.FORMAT_FILE_CREATE,
                FORMAT_SMART_SET: global.FORMAT_SMART_SET,

                TYPE_SYS: global.TYPE_TRANSACTION_SYS,
                TYPE_SMART_CREATE1: global.TYPE_TRANSACTION_SMART_CREATE1,
                TYPE_SMART_CREATE2: global.TYPE_TRANSACTION_SMART_CREATE2,
                TYPE_SMART_RUN1: global.TYPE_TRANSACTION_SMART_RUN1,
                TYPE_SMART_RUN2: global.TYPE_TRANSACTION_SMART_RUN2,
                TYPE_SMART_CHANGE: global.TYPE_TRANSACTION_SMART_CHANGE,
                TYPE_ACC_CREATE: global.TYPE_TRANSACTION_CREATE,
                TYPE_ACC_CHANGE: global.TYPE_TRANSACTION_ACC_CHANGE,
                TYPE_MONEY_TRANSFER3: global.TYPE_TRANSACTION_TRANSFER3,
                TYPE_MONEY_TRANSFER5: global.TYPE_TRANSACTION_TRANSFER5,
                TYPE_TRANSACTION_FILE: global.TYPE_TRANSACTION_FILE,
                TYPE_SMART_SET: global.TYPE_TRANSACTION_SMART_SET,
            };

        return RetData;
    };
    global.HTTPCaller.GetFormatTx = global.GetFormatTx;

    global.UseRetFieldsArr=UseRetFieldsArr;
    function UseRetFieldsArr(Arr,Fields) {
        if(!Fields)
            return Arr;
        let Arr2=[];
        for(let i=0;i<Arr.length;i++)
        {
            let Item=Arr[i];
            let Item2={};
            for(let n=0;n<Fields.length;n++)
                Item2[Fields[n]]=Item[Fields[n]];
            Arr[i]=Item2;
        }

        return Arr;
    }
    global.SendData = OnGetData
    return OnGetData
}


