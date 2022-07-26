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

import constant from "../../core/constant.mjs"
import library from "../../core/library.mjs"
import geo from "../../core/geo.mjs"
import system from '../../system/index.mjs'
import childProcess from "../child-process.mjs"
import htmlServer from "../../core/html-server.mjs"
import apiV1 from "../../rpc/api-v1.mjs"
import apiV2Exchange from "../../rpc/api-v2-exchange.mjs"
import webCert from "../web-cert.mjs"
import jinnTera from "../../jinn/tera/index.mjs"
import isEmpty from "../../../isEmpty/isEmpty.mjs";
import BufferBrowser from '../../../buffer/index.mjs'
(async () => {
    global.PROCESS_NAME = "WEB";
    global.buffer = BufferBrowser
    global.GlobalRunMap = {}
    global.IS_NODE_JS = (typeof process !== "undefined")?1:0
    if(!global.IS_NODE_JS) {
        global.http = {

        }
        global.net = {

        }
        global.crypto = {


        }
        global.cluster = {

        }
        global.vm = {

        }
        global.https = {

        }
        global.http = {

        }
        global.zlib = {

        }
        global['child_process'] = {

        }
        global.querystring = {

        }
        global.os = {
            platform: () => {
                return ua.default['user-agent']().os.name
            },
            arch: () => {
                return ua.default['user-agent']().os.version
            },
            release: () => {
                console.warn('проверить релиз')
                console.log(ua.default['user-agent']().browser.version)
                console.log(ua.default['user-agent']().browser.name)
                return ua.default['user-agent']().os.version
            },
            cpus: () => {
                var num = navigator.hardwareConcurrency || 1
                var cpus = []
                for (var i = 0; i < num; i++) {
                    cpus.push({
                        model: '',
                        speed: 0,
                        times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
                    })
                }
                return cpus
            }
        }
        global.fs = {
            stat: (...args) => {
                console.log('~~~~~~ stat ~~~~~~', args)
            },
            existsSync: (...args) => {
                console.log('~~~~~~ existsSync ~~~~~~', args)
            },
            mkdirSync: (...args) => {
                console.log('~~~~~~ mkdirSync ~~~~~~', args)
            },
            watch: (...args) => {
                console.log('~~~~~~ watch ~~~~~~', args)
            },
            openSync: (...args)=> {
                console.log('~~~~~~ openSync ~~~~~~', args)
            },
            writeSync: (...args) => {
                console.log('~~~~~~ writeSync ~~~~~~', args)
            },
            closeSync: (...args) => {
                console.log('~~~~~~ closeSync ~~~~~~', args)
            }
        }
        global.process = {
            on:(...args) => {
                console.log('process on: ', args)
            },
            hrtime: (...args) => {
                console.log('hrtime: ', args)
            },
            versions: {
                node: `${ua.default['user-agent']().browser.name}.${ua.default['user-agent']().browser.version}`
            },
            argv: [],
            cwd: (...args) => {
                console.log('~~~!~~~ cwd ~~~!~~~', args)
                return import.meta.url
            }
        }
        global.url = {

        }
        if(!global.DATA_PATH || global.DATA_PATH==="")
            global.DATA_PATH="/DATA-BROWSER";
        global.CODE_PATH=import.meta.url;
        global.HTTP_PORT_NUMBER = isEmpty(location.port)? location.origin: location.port;
    } else {
        global.os = await import("os")
        global.fs = await import("fs")
        global.crypto = await import("crypto")
        global.zlib = await import('zlib');
        global.http = await import('http')
        global.net = await import('net')
        global.url = await import('url')
        global.querystring = await import('querystring')
        global.cluster = await import('cluster')
        global.vm = await import('vm')
        global['child_process'] = await import('child_process')
        global['https'] = await import('https')
        global.process = process
        process.blockchain = global.process
        if(!global.DATA_PATH || global.DATA_PATH==="")
            global.DATA_PATH="../DATA-BROWSER";
    }
    constant(global)
    await library(global)
    function GetDefaultPage()
    {
        if(global.HTTP_START_PAGE)
        {
            if(global.HTTP_START_PAGE === "WWW") {
                return "/index.html";
            }
            return global.HTTP_START_PAGE;
        }
        else
            return "web-wallet.html";
    }

    const http = await import('http')
    const net = await import('net')
    const url = await import('url')
    const fs = await import("fs")
    const querystring = await import('querystring')


    global.MAX_STAT_PERIOD = 600;

    global.MAX_STAT_PERIOD = 600;
    global.DATA_PATH = global.GetNormalPathString(global.DATA_PATH);
    global.CODE_PATH = global.GetNormalPathString(global.CODE_PATH);


    geo(global)
    childProcess(global)
    global.READ_ONLY_DB = 1;
    global.MAX_STAT_PERIOD = 600;

    global.HostNodeList = [];
    global.AllNodeList = [];
    global.NodeBlockChain = [];

    global.GlMiningBlock = undefined;

    process.on('message', function (msg)
        {
            switch(msg.cmd)
            {
                case "Stat":
                    for(let i=0;i<msg.Arr.length;i++)
                        global.ADD_TO_STAT(msg.Arr[i].Name, msg.Arr[i].Value);
                    break;
                case "NodeList":
                    global.AllNodeList = msg.ValueAll;
                    global.HostNodeList = GetArrWithWebOnly(AllNodeList);
                    break;
                case "NodeBlockChain":
                    global.NodeBlockChain = msg.Value;
                    break;

                case "DappEvent":
                {
                    AddDappEventToGlobalMap(msg.Data);
                    break;
                }

                case "ToLogClient":
                {
                    global.ToLogClient0(msg.Str, msg.StrKey, msg.bFinal);
                    break;
                }

                case "WalletEvent":
                {
                    AddToArrClient(msg.ResultStr, msg.TX, msg.bFinal, Date.now(),msg.BlockNum,msg.TrNum);
                    break;
                }

                case "MiningBlock":
                    global.GlMiningBlock = msg.Value;
                    break;
            }
        }
    );

    function GetArrWithWebOnly(arrAlive)
    {
        let arrWeb = [];
        for(let i = 0; i < arrAlive.length; i++)
        {
            let Item = arrAlive[i];
            if(Item.portweb)
            {
                arrWeb.push(Item);
                if(arrWeb.length > 100)
                    break;
            }
        }
        return arrWeb;
    }

    let RedirectServer;
    let HostingServer;

    global.OnExit = function ()
    {
        if(RedirectServer)
            RedirectServer.close();
        if(HostingServer)
            HostingServer.close();
    };

    if(!global.HTTP_HOSTING_PORT)
    {
        ToLogTrace("global.HTTP_HOSTING_PORT=" + global.HTTP_HOSTING_PORT);
        OnExit();
        process.exit();
    }
    global.HTTP_HOSTING_PORT =  + global.HTTP_HOSTING_PORT;

    let JinnLib = await jinnTera(global)
    let Map = {"Block":1, "BlockDB":1, "Log":1, };
    JinnLib.Create(Map);

    global.HTTP_PORT_NUMBER = 0;
    htmlServer(global)
    system(global)

    global.STAT_MODE = 1;
    setInterval(global.PrepareStatEverySecond, 1000);

    let bWasRun = 0;

    if(global.HTTPS_HOSTING_DOMAIN && HTTP_HOSTING_PORT === 443)
    {

        CheckCreateDir(GetDataPath("tmp"));
        console.warn('модули ещё не подключенны greenlock and redirect')
        // let greenlock = require('greenlock').create({version:'draft-12', server:'https://acme-v02.api.letsencrypt.org/directory', configDir:global.GetDataPath('tmp'),
        // });
        //
        // let redir = require('redirect-https')();
        // RedirectServer = global.http.createServer(greenlock.middleware(redir));
        // RedirectServer.on('error', function (err)
        // {
        //     ToError('RedirectServer: ' + err.code);
        // });
        // RedirectServer.listen(80);
        //
        // const CSertificate = webCert(global)
        // global.glSertEngine = new CSertificate(greenlock);
        // glSertEngine.StartCheck();

        // if(glSertEngine.HasValidSertificate(0))
        // {
        //     ToLog("*************** USE EXIST SERT. ExpiresAt: " + new Date(glSertEngine.certs.expiresAt));
        //     HostingServer = require('https').createServer(glSertEngine.tlsOptions, MainHTTPFunction);
        //     RunListenServer();
        // }
    }
    else
    {
        HostingServer = http.createServer(MainHTTPFunction);
        RunListenServer();
    }

    function MainHTTPFunction(request,response)
    {
        if(!request.headers)
            return;

        if(!request.socket || !request.socket.remoteAddress)
            return;

        if(request.socket._events && request.socket._events.error.length < 2)
            request.socket.on("error", function (err)
            {
                if(err.code === "EPIPE")
                    return;
                console.log("WEB socket.error code=" + err.code);
                global.ToLog(err.stack, 3);
            });

        global.SetSafeResponce(response);

        let DataURL = url.parse(request.url);
        let Params = querystring.parse(DataURL.query);
        let Path = querystring.unescape(DataURL.pathname);

        if(!Path || Path==="/")
        {
            Path = GetDefaultPage();
        }

        let ip = request.socket.remoteAddress;
        global.WEB_LOG && global.ToLogWeb("" + ip + " Get Path:" + Path);

        Path = GetSafePath(Path);
        if(global.STAT_MODE === 2)
        {
            global.ADD_TO_STAT("HTTP_ALL");
            response.DetailStatName = ":" + Path;
        }

        let Type = request.method;
        if(Type === "POST")
        {
            let Response = response;
            let postData = "";
            request.addListener("data", function (postDataChunk)
            {
                if(postData.length <= 65000 && postDataChunk.length <= 65000)
                    postData += postDataChunk;
                else
                {
                    let Str = "Error postDataChunk.length=" + postDataChunk.length;
                    global.ToLog(Str, 0);
                    Response.writeHead(405, {'Content-Type':'text/html'});
                    Response.end(Str);
                    return;
                }
            });

            request.addListener("end", function ()
            {
                let Data;
                if(postData && postData.length)
                {
                    try
                    {
                        Data = JSON.parse(postData);
                    }
                    catch(e)
                    {
                        Response.writeHead(405, {'Content-Type':'text/html'});
                        Response.end("Error data parsing");
                        return;
                    }
                }
                DoCommandNew(request, response, Type, Path, Data);
            });
        }
        else
        {
            DoCommandNew(request, response, Type, Path, Params);
        }
    }

    let TimeToRerun = 3000;
    function RunListenServer()
    {
        HostingServer.on('error', function (err)
        {
            if(err.code === 'EADDRINUSE')
            {
                TimeToRerun = Math.floor(TimeToRerun * 1.5);
                if(TimeToRerun > 1000000 * 1000)
                    return;
                global.ToLog('Port ' + global.HTTP_HOSTING_PORT + ' in use, retrying...');
                if(HostingServer.Server)
                    HostingServer.Server.close();
                setTimeout(function ()
                {
                    RunListenServer();
                }, TimeToRerun);
                return;
            }

            global.ToError("H##6");
            global.ToError(err);
        });

        global.ToLog("Prepare to run WEB-server on port: " + global.HTTP_HOSTING_PORT);
        HostingServer.listen(global.HTTP_HOSTING_PORT, global.LISTEN_IP, function ()
        {
            if(!bWasRun)
                global.ToLog("Run WEB-server on " + global.LISTEN_IP + ":" + global.HTTP_HOSTING_PORT);
            bWasRun = 1;
        });
    }


    let WalletFileMap = {};
    WalletFileMap["mobile-wallet.html"] = "web-wallet.html";

    if(!global.WebApi2)
        global.WebApi2 = {};
    if(!global.WebApi1)
    {
        global.WebApi1 = {};
    }

    function DoCommandNew(request,response,Type,Path,Params)
    {
        if(global.HTTP_START_PAGE === "WWW")
            return DoCommandWWW(request, response, Type, Path, Params);

        if(Path.substring(0, 1) === "/")
            Path = Path.substring(1);

//
        let ArrPath = Path.split('/', 7);


        if(global.AddonCommand)
        {
            if(!global.AddonCommand(request, response, Type, Path, Params, ArrPath))
                return;
        }

        let Caller = global.HostingCaller;
        let Method = ArrPath[0];
        let APIv2 = 0;
        if(ArrPath[0] === "api")
        {
            if(ArrPath[1] === "v2")
            {
                APIv2 = 1;
                if(!global.USE_HARD_API_V2)
                {
                    response.writeHead(200, {'Content-Type':'text/plain', 'Access-Control-Allow-Origin':"*"});
                    response.end(JSON.stringify({result:0, text:"You must set const USE_HARD_API_V2:1"}));
                    return;
                }
                Caller = WebApi2;
            }
            else
            if(ArrPath[1] === "v1")
            {
                Caller = WebApi1;
            }
            Method = ArrPath[2];
        }
        else
        {
            if(!global.USE_API_WALLET)
            {
                response.end();
                return;
            }
        }
        if(global.STAT_MODE === 2)
        {
            global.ADD_TO_STAT("HTTP:" + Method);
            response.DetailStatName = ":" + Method;
        }

        let F = Caller[Method];
        if(F)
        {
            //console.log(Method,ArrPath);

            response.writeHead(200, {'Content-Type':'text/plain', 'Access-Control-Allow-Origin':"*"});

            if(!global.USE_API_V1 && !APIv2)
            {
                response.end(JSON.stringify({result:0, text:"This node not use USE_API_V1"}));
                return;
            }

            let Ret;
            try
            {
                Ret = F(Params, response, ArrPath, request);
            }
            catch(e)
            {
                Ret = {result:0, text:e.message, text2:e.stack};
            }
            if(Ret === null)
                return;

            try
            {
                let Str;
                if(typeof Ret === "object")
                    Str = JSON.stringify(Ret);
                else
                {
                    if(typeof Ret === "string")
                        Str = Ret;
                    else
                        Str = "" + Ret;
                }

                response.end(Str);
            }
            catch(e)
            {
                ToLog("ERR PATH:" + Path);
                ToLog(e);
                response.end();
            }
            return;
        }
        if(!Method)
            return;

        Method = Method.toLowerCase();
        if(Method === "dapp" && ArrPath.length === 2)
            Method = "DappTemplateFile";

        switch(Method)
        {
            case "file":
                SendBlockFile(request, response, ArrPath[1], ArrPath[2]);
                break;

            case "nft":
                SendNFTFile(request, response, ArrPath[1]);
                break;

            case "DappTemplateFile":
                DappTemplateFile(request, response, ArrPath[1]);
                break;
            case "smart":
                DappSmartCodeFile(response, ArrPath[1]);
                break;
            case "account":
                DappAccount(response, ArrPath[1]);
                break;
            case "client":
                DappClientCodeFile(response, ArrPath[1]);
                break;

            default:
            {
                let Name = ArrPath[ArrPath.length - 1];
                if(typeof Name !== "string")
                    Name = "ErrorPath";
                else
                if(Path.indexOf("..") >= 0 || Name.indexOf("\\") >= 0 || Name.indexOf("/") >= 0)
                    Name = "ErrorFilePath";

                if(Name === "")
                    Name = GetDefaultPage();

                if(Name.indexOf(".") < 0)
                    Name += ".html";

                let PrefixPath;
                if(Method === "files")
                {
                    PrefixPath = "../FILES";
                    Name = "";
                    for(let i = 1; i < ArrPath.length; i++)
                        if(ArrPath[i] && ArrPath[i].indexOf("..") ===  - 1 && ArrPath[i].indexOf("\\") ===  - 1)
                            Name += "/" + ArrPath[i];
                    Name = PrefixPath + Name;
                    global.SendWebFile(request, response, Name, "", 0, 1000);
                    return;
                }
                else
                if(Method === "shard.js")
                {
                    let ShardParamPath = GetDataPath("shard.js");
                    SendWebFile(request, response, ShardParamPath, "", 0, 1000);
                    return;
                }
                else
                if(Method === "update")
                {
                    PrefixPath = global.DATA_PATH + "Update";
                    Name = "";
                    for(let i = 1; i < ArrPath.length; i++)
                        if(ArrPath[i] && ArrPath[i].indexOf("..") ===  - 1 && ArrPath[i].indexOf("\\") ===  - 1)
                            Name += "/" + ArrPath[i];
                    Name = PrefixPath + Name;
                    global.SendWebFile(request, response, Name, "", 0, 1000);
                    return;
                }
                else
                {
                    let Name2 = WalletFileMap[Name];
                    PrefixPath = "./HTML";
                    if(typeof Name2 === "string")
                        Name = Name2;
                }

                let type = Path.substr(Path.length - 3, 3);
                let LongTime = global.HTTP_CACHE_LONG;
                switch(type)
                {
                    case ".js":
                        if(ArrPath[0] === "Ace")
                        {
                            LongTime = 1000000;
                            Name = "./HTML/" + Path;
                        }
                        else
                        {
                            Name = PrefixPath + "/JS/" + Name;
                        }
                        break;
                    case "css":
                        Name = PrefixPath + "/CSS/" + Name;
                        break;
                    case "wav":
                    case "mp3":
                        Name = PrefixPath + "/SOUND/" + Name;
                        break;
                    case "svg":
                    case "png":
                    case "gif":
                    case "jpg":
                    case "ico":
                        Name = PrefixPath + "/PIC/" + Name;
                        break;

                    case "pdf":
                    case "zip":
                    case "exe":
                    case "msi":
                        Name = PrefixPath + "/FILES/" + Name;
                        break;

                    default:
                        Name = PrefixPath + "/" + Name;
                        break;
                }

                global.SendWebFile(request, response, Name, "", 1, LongTime);
                break;
            }
        }
    }

    function DoCommandWWW(request,response,Type,Path,Params,ArrPath)
    {
        //console.log(Path);
        if(!Path || Path.substring(Path.length - 1) === "/")
            Path += "index.html";

        console.warn('здесь стояла переменная')
        ArrPath = Path.split('/', 7);
        if(global.AddonCommand)
        {
            if(!global.AddonCommand(request, response, Type, Path, Params, ArrPath))
                return;
        }

        let Name = "../WWW";
        for(let i = 1; i < ArrPath.length; i++)
            if(ArrPath[i] && ArrPath[i].indexOf("..") ===  - 1 && ArrPath[i].indexOf("\\") ===  - 1)
                Name += "/" + ArrPath[i];

        global.SendWebFile(request, response, Name, "", 0, 1000);
    }

    function GetSafePath(filename)
    {
        if(filename.indexOf('\0') !==  - 1)
        {
            return "";
        }

        filename = filename.replace(/\~/g, "");
        filename = filename.replace(/\.\./g, "");
        filename = filename.replace(/\/\//g, "");

        return filename;
    }
    apiV1(global)

    setInterval(function ()
        {

            let MaxNumBlockDB = global.SERVER.GetMaxNumBlockDB();

            let HASHARATE_BLOCK_LENGTH = 10;
            let arr = global.SERVER.GetStatBlockchain("POWER_BLOCKCHAIN", HASHARATE_BLOCK_LENGTH);
            if(arr.length)
            {
                let SumPow = 0;
                let Count = 0;
                let Value = 0;
                for(let i = arr.length - HASHARATE_BLOCK_LENGTH; i < arr.length; i++)
                    if(arr[i])
                    {
                        Value = arr[i];
                        SumPow += Value;
                        Count++;
                    }
                if(!Count)
                    Count = 1;

                let AvgPow = SumPow / Count;
                global.ADD_TO_STAT("MAX:HASH_RATE_B", AvgPow);
            }

            let Count = global.COUNT_BLOCK_PROOF;
            if(MaxNumBlockDB > Count)
            {
                let StartNum = MaxNumBlockDB - Count + 1;
                global.NodeBlockChain = global.SERVER.BlockChainToBuf(StartNum, StartNum, MaxNumBlockDB);
            }
        }
        , 700);



    apiV2Exchange(global)

    try
    {
        await import("../../SITE/JS/web-addon.mjs")
    }
    catch(e)
    {
    }

    global.LoadBlockFromNetwork = function (Params,F)
    {
        ToLog("RUN: LoadBlockFromNetwork:" + Params.BlockNum, 2);

        process.RunRPC("LoadBlockFromNetwork", {BlockNum:Params.BlockNum, F:1}, function (Err,Block)
        {
            ToLog("RETURN: LoadBlockFromNetwork: " + Params.BlockNum, 2);
            F(Err, Block);
        });
    }

    global.WebApi1.DappStaticCall = global.HostingCaller.DappStaticCall;
    global.WebApi1.GetCurrentInfo = global.HostingCaller.GetCurrentInfo;
    global.WebApi1.GetNodeList = global.HostingCaller.GetNodeList;
    global.WebApi1.GetAccountList = global.HostingCaller.GetAccountList;
    global.WebApi1.GetBlockList = global.HostingCaller.GetBlockList;
    global.WebApi1.GetTransactionList = global.HostingCaller.GetTransactionList;
    global.WebApi1.GetDappList = global.HostingCaller.GetDappList;
    global.WebApi1.GetAccountListByKey = global.HostingCaller.GetAccountListByKey;

    global.WebApi1.GetTransaction = global.WebApi2.GetTransaction;
    global.WebApi1.GetHistoryTransactions = global.WebApi2.GetHistoryTransactions;
    global.WebApi1.GetBalance = global.WebApi2.GetBalance;


    global.WebApi1.SendTransactionHex = global.HostingCaller.SendTransactionHex;

    global.WebApi1.GetWork = global.HostingCaller.GetWork;
    global.WebApi1.SubmitWork = global.HostingCaller.SubmitWork;
    global.WebApi1.SubmitHashrate = global.HostingCaller.SubmitHashrate;

    global.WebApi1.SendHexTx = global.HostingCaller.SendHexTx;
    global.WebApi1.GetFormatTx = global.HostingCaller.GetFormatTx;
})()
