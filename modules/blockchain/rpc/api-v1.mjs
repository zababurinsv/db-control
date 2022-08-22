/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/

// const crypto = require('crypto');
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
    const crypto = global.crypto

    global.HostingCaller = {};

    let sessionid = global.GetHexFromArr(crypto.randomBytes(20));

    global.HostingCaller.GetCurrentInfo = function (Params)
    {
        if(typeof Params === "object" && Params.BlockChain == 1)
        {
            if(!global.USE_API_WALLET)
                return {result:0};
        }
        let MaxNumBlockDB = global.SERVER.GetMaxNumBlockDB();
        let TXBlockNum = global.COMMON_ACTS.GetLastBlockNumActWithReopen();

        let Ret = {
            result:1,
            BLOCKCHAIN_VERSION:GETVERSION(MaxNumBlockDB),
            CodeVer:global.START_CODE_VERSION_NUM,
            VersionNum:global.START_CODE_VERSION_NUM,
            VersionUpd:global.UPDATE_CODE_VERSION_NUM,
            NETWORK:global.NETWORK,
            SHARD_NAME:global.SHARD_NAME,
            MaxNumBlockDB:MaxNumBlockDB,
            CurBlockNum:global.GetCurrentBlockNumByTime(),
            MaxAccID:global.ACCOUNTS.GetMaxAccount(),
            MaxDappsID:global.SMARTS.GetMaxNum(),
            TXBlockNum:TXBlockNum,
            CurTime:Date.now(),
            DELTA_CURRENT_TIME:global.DELTA_CURRENT_TIME,
            MIN_POWER_POW_TR:0,
            FIRST_TIME_BLOCK:global.FIRST_TIME_BLOCK,
            UPDATE_CODE_JINN:global.UPDATE_CODE_JINN,
            CONSENSUS_PERIOD_TIME:global.CONSENSUS_PERIOD_TIME,
            NEW_SIGN_TIME:global.NEW_SIGN_TIME,
            PRICE_DAO:global.PRICE_DAO(MaxNumBlockDB),
            GrayConnect:global.CLIENT_MODE,
            JINN_MODE:1,
            sessionid:sessionid,
            COIN_STORE_NUM:global.COIN_STORE_NUM,
        };

        if(typeof Params === "object" && Params.Diagram === 1)
        {
            let arrNames = ["MAX:ALL_NODES", "MAX:Addrs", "MAX:HASH_RATE_B"];
            Ret.arr = GET_STATDIAGRAMS(arrNames);
        }
        if(typeof Params === "object" && Params.BlockChain === 1)
        {
            Ret.BlockChain = NodeBlockChain;
        }

        if(typeof Params === "object" && Params.ArrLog === 1)
        {
            let CurTime = Date.now();

            let ArrLog = [];
            for(let i = ArrLogClient.length - 1; i >= 0; i--)
            {
                let Item = ArrLogClient[i];
                if(!Item.final || CurTime - Item.time > 600 * 1000)
                    continue;
                ArrLog.push(Item);
                if(ArrLog.length >= 10)
                    break;
            }
            Ret.ArrLog = ArrLog;
        }

        return Ret;
    }

    let MaxCountViewRows = global.HTTP_MAX_COUNT_ROWS;
    global.HostingCaller.GetAccountList = function (Params)
    {
        if(typeof Params !== "object")
            return {result:0};
        Params.CountNum = ParseNum(Params.CountNum);
        if(Params.CountNum > MaxCountViewRows)
            Params.CountNum = MaxCountViewRows;
        if(!Params.CountNum)
            Params.CountNum = 1;
        let arr = global.ACCOUNTS.GetRowsAccounts(ParseNum(Params.StartNum), Params.CountNum,0,Params.GetState, Params.GetCoin);
        return {result:1, arr:arr};
    }

    global.HostingCaller.GetAccount = function (id)
    {

        id = ParseNum(id);
        let arr = global.ACCOUNTS.GetRowsAccounts(id, 1,0,0,1);
        return {Item:arr[0], result:1};
    }
    global.HostingCaller.DappGetBalance = function (Params)
    {
        let Account=parseInt(Params.AccountID);
        let Currency=parseInt(Params.Currency);
        let ID=Params.ID;

        let Value = global.ACCOUNTS.GetBalance(Account,Currency,ID);
        return {Value:Value, result:1};
    }
//global.HostingCaller.DappGetBalance = global.HostingCaller.GetBalance;



    global.HostingCaller.GetBlockList = function (Params,response)
    {
        if(typeof Params !== "object")
            return {result:0};

        Params.StartNum = ParseNum(Params.StartNum);
        Params.CountNum = ParseNum(Params.CountNum);

        if(Params.CountNum > MaxCountViewRows)
            Params.CountNum = MaxCountViewRows;
        if(!Params.CountNum)
            Params.CountNum = 1;

        return global.HTTPCaller.GetBlockList(Params, response);
    }

    global.HostingCaller.GetTransactionList = function (Params,response)
    {
        Params.Param3 = Params.BlockNum;
        return global.HostingCaller.GetTransactionAll(Params, response);
    }

    global.HostingCaller.GetTransactionAll = function (Params,response)
    {

        if(typeof Params !== "object")
            return {result:0};

        Params.Param3 = ParseNum(Params.Param3);
        Params.StartNum = ParseNum(Params.StartNum);
        Params.CountNum = ParseNum(Params.CountNum);

        if(Params.CountNum > MaxCountViewRows)
            Params.CountNum = MaxCountViewRows;

        return global.HTTPCaller.GetTransactionAll(Params, response);
    }

    global.HostingCaller.GetDappList = function (Params)
    {
        if(typeof Params !== "object")
            return {result:0};

        Params.CountNum = ParseNum(Params.CountNum);
        if(Params.CountNum > MaxCountViewRows)
            Params.CountNum = MaxCountViewRows;
        if(!Params.CountNum)
            Params.CountNum = 1;

        let arr = SMARTS.GetRows(ParseNum(Params.StartNum), Params.CountNum, undefined, Params.Filter, 1);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {result:1, arr:arr};
    }

    global.HostingCaller.GetNodeList = function (Params)
    {
        let arr = [];
        let List;
        if(typeof Params === "object" && Params.All)
            List = AllNodeList;
        else
            List = HostNodeList;

        let MaxNodes = 50;
        let len = List.length;
        let UseRandom = 0;
        if(len > MaxNodes)
        {
            UseRandom = 1;
            len = MaxNodes;
        }

        let bGeo = 0;
        if(typeof Params === "object" && Params.Geo)
            bGeo = 1;

        let mapWasAdd = {};
        for(let i = 0; i < len; i++)
        {
            let Item;
            if(UseRandom)
            {
                let num = global.random(List.length);
                Item = List[num];
                if(mapWasAdd[Item.ip])
                {
                    continue;
                }
                mapWasAdd[Item.ip] = 1;
            }
            else
            {
                Item = List[i];
            }
            let Value = {ip:Item.ip, port:Item.portweb, };

            if(bGeo)
            {
                if(!Item.Geo)
                    SetGeoLocation(Item);

                Value.latitude = Item.latitude;
                Value.longitude = Item.longitude;
                Value.name = Item.name;
                Value.port = Item.port;
            }

            arr.push(Value);
        }

        arr=UseRetFieldsArr(arr,Params.Fields);
        let Result = {result:1, arr:arr, CodeVer:global.START_CODE_VERSION_NUM, VersionNum:global.UPDATE_CODE_VERSION_NUM, NETWORK:global.NETWORK, SHARD_NAME:global.SHARD_NAME};
        return Result;
    }

    let AccountKeyMap = {};
    let LastMaxNum = 0;

    setInterval(function ()
        {
            AccountKeyMap = {};
            LastMaxNum = 0;
        }
        , 3600 * 1000);

    function UpdateAccountKeyMap()
    {
        for(let num = LastMaxNum; true; num++)
        {
            if(global.ACCOUNTS.IsHole(num))
                continue;

            let Data = global.ACCOUNTS.ReadState(num);
            if(!Data)
                break;
            let StrKey = GetHexFromArr(Data.PubKey);
            let Item={Num:Data.Num};
            let FirstItem=AccountKeyMap[StrKey];
            if(!FirstItem)
            {
                FirstItem={Counts:0};
                FirstItem.LastItem=FirstItem;
                AccountKeyMap[StrKey] = FirstItem;
            }
            FirstItem.Counts++;
            FirstItem.LastItem.Next=Item;
            FirstItem.LastItem=Item;
        }
        LastMaxNum = num;
    }


    global.HostingCaller.GetAccountListByKey = function (Params,aaa,bbb,ccc,bRet,SmartFilter)
    {
        if(typeof Params !== "object" || !Params.Key)
            return {result:0, arr:[]};

        if(!global.USE_API_WALLET)
            return {result:0};

        UpdateAccountKeyMap();

        let arr = [];
        let Item = AccountKeyMap[Params.Key];
        let Counts=0;
        if(Item)
        {
            Counts = Item.Counts;
            Item=Item.Next;
        }

        let Count=0;
        if(Params.StartNum || Params.CurrentPage)
        {
            let SkipPages=Params.CurrentPage;
            let Count2=0;
            while(Item)
            {
                //search page
                Count2++;
                if(Params.CurrentPage && Count2>global.HTTP_MAX_COUNT_ROWS)
                {
                    Count2=0;
                    SkipPages--;
                    if(!SkipPages)
                        break;
                }

                //search first num
                if(Item.Num===Params.StartNum)
                    break;

                Item = Item.Next;
                Count++;
                if(Count > 1000)
                    break;
            }
        }

        while(Item)
        {
            let Data = global.ACCOUNTS.ReadState(Item.Num);
            if(!Data)
                break;

            if(!Data.PubKeyStr)
                Data.PubKeyStr = GetHexFromArr(Data.PubKey);

            if(Data.Currency)
                Data.CurrencyObj = SMARTS.ReadSimple(Data.Currency, 1);

            if(SmartFilter && Data.Value.Smart!=SmartFilter)
            {
                Item = Item.Next;
                continue;
            }

            if(Data.Value.Smart)
            {
                Data.SmartObj = SMARTS.ReadSimple(Data.Value.Smart);
                try
                {
                    Data.SmartState = BufLib.GetObjectFromBuffer(Data.Value.Data, Data.SmartObj.StateFormat, {});
                    if(typeof Data.SmartState === "object")
                        Data.SmartState.Num = Item.Num;
                }
                catch(e)
                {
                    Data.SmartState = {};
                }
            }

            //ERC
            if(Params.BalanceArr)
            {
                Data.BalanceArr=ACCOUNTS.ReadBalanceArr(Data);
            }

            arr.push(Data);
            Item = Item.Next;
            if(arr.length >= global.HTTP_MAX_COUNT_ROWS)
                break;

        }

        let Ret = {result:1, Accounts:Counts, HasNext:Item?1:0, ROWS_ON_PAGE:global.HTTP_MAX_COUNT_ROWS, arr:arr};

        Ret.NETWORK=global.NETWORK;
        Ret.SHARD_NAME=global.SHARD_NAME;

        if(bRet || !Params.Session)
        {
            return Ret;
        }


        //for session:

        let Context = GetUserContext(Params);
        let StrInfo = JSON.stringify(Ret);
        if(Params.AllData === "0")
            Params.AllData = 0;

        if(!Params.AllData && Context.PrevAccountList === StrInfo)
        {
            return {result:0, Accounts:Counts, ROWS_ON_PAGE:global.HTTP_MAX_COUNT_ROWS, cache:1};
        }
        Context.PrevAccountList = StrInfo;
        Context.NumAccountList++;

        return StrInfo;
    };

    let CategoryMap = {};
    let CategoryArr = [];
    let CategoryDappMaxNumWas = 0;
    global.HostingCaller.GetDappCategory = function (Params,response)
    {
        CheckDappCategoryMap();

        return {result:1, arr:CategoryArr};
    }

    function CheckDappCategoryMap()
    {
        let MaxNumNow = SMARTS.GetMaxNum();
        if(MaxNumNow !== CategoryDappMaxNumWas)
        {
            for(let Num = CategoryDappMaxNumWas; Num <= MaxNumNow; Num++)
            {
                let Item = SMARTS.ReadSimple(Num);
                for(let n = 1; n <= 3; n++)
                {
                    let Name = "Category" + n;
                    let Value = Item[Name];
                    if(Value)
                    {
                        let DappMap = CategoryMap[Value];
                        if(!DappMap)
                        {
                            DappMap = {};
                            CategoryMap[Value] = DappMap;
                            CategoryArr.push(Value);
                        }
                        DappMap[Num] = 1;
                    }
                }
            }
            CategoryDappMaxNumWas = MaxNumNow;
        }
    }


    let MapIPSend = {};
    global.HostingCaller.SendHexTx = function (Params,response,ArrPath,request)
    {
        if(typeof Params === "object" && typeof Params.Hex === "string")
            Params.Hex += "000000000000000000000000";
        return global.HostingCaller.SendTransactionHex(Params, response, ArrPath, request);
    };

    global.HostingCaller.SendTransactionHex = function (Params,response,ArrPath,request)
    {
        if(typeof Params !== "object" || !Params.Hex)
            return {result:0, text:"SendTransactionHex object required"};
        if(typeof Params.Hex!=="string")
            return {result:0, text:"Params.Hex - string required"};
        if(Params.Hex.length>JINN_CONST.MAX_TX_SIZE*2)
            return {result:0, text:"Params.Hex - error length (max="+(JINN_CONST.MAX_TX_SIZE*2)+")"};

        let ip = request.socket.remoteAddress;
        let Item = MapIPSend[ip];
        if(!Item)
        {
            Item = {StartTime:0, Count:0};
            MapIPSend[ip] = Item;
        }

        let Delta = Date.now() - Item.StartTime;
        if(Delta > 600 * 1000)
        {
            Item.StartTime = Date.now();
            Item.Count = 0;
        }
        Item.Count++;
        if(Item.Count > global.MAX_TX_FROM_WEB_IP)
        {
            let Str = "Too many requests from the user. Count=" + Item.Count;
            ToLogOne("AddTransactionFromWeb: " + Str + " from ip: " + ip);

            let Result = {result:0, text:Str};
            response.end(JSON.stringify(Result));
            return null;
        }

        process.RunRPC("AddTransactionFromWeb", {HexValue:Params.Hex,Confirm:Params.Confirm,F:1,Web:1}, function (Err,Data)
        {
            let Result = {result:Data.result, text:Data.text, _BlockNum:Data._BlockNum, _TxID:Data._TxID, BlockNum:Data.BlockNum,TrNum:Data.TrNum};
            let Str = JSON.stringify(Result);
            response.end(Str);
        });
        return null;
    };



    global.HostingCaller.DappSmartHTMLFile = function (Params)
    {
        if(typeof Params !== "object")
            return {result:0};

        return global.HTTPCaller.DappSmartHTMLFile(Params);
    };
    global.HostingCaller.DappBlockFile = function (Params,responce)
    {
        if(typeof Params !== "object")
            return {result:0};

        return global.HTTPCaller.DappBlockFile(Params, responce);
    };

    global.HostingCaller.DappInfo = function (Params)
    {
        if(typeof Params !== "object")
            return {result:0};

        let SmartNum = ParseNum(Params.Smart);
        process.send({cmd:"SetSmartEvent", Smart:SmartNum});

        let Context = GetUserContext(Params);

        let Ret = global.HTTPCaller.DappInfo(Params, undefined, 1);
        Ret.PubKey = undefined;

        let StrInfo = JSON.stringify(Ret);
        if(!Params.AllData && Context.PrevDappInfo === StrInfo)
        {
            Ret = {result:2, cache:1, Session:Context.Session};
        }
        else
        {
            Context.PrevDappInfo = StrInfo;
            Context.NumDappInfo++;
            Context.LastTime = Date.now();
        }

        Ret.NumDappInfo = Context.NumDappInfo;
        Ret.CurTime = Date.now();
        Ret.CurBlockNum = GetCurrentBlockNumByTime();
        Ret.MaxAccID = ACCOUNTS.GetMaxAccount();
        Ret.MaxDappsID = SMARTS.GetMaxNum();

        return Ret;
    };

    global.HostingCaller.DappWalletList = function (Params)
    {
        if(typeof Params !== "object")
            return {result:0};
        let Smart = ParseNum(Params.Smart);
        let SmartFilter=0;
        if(!Params.AllAccounts && Smart)
            SmartFilter=Smart;

        Params.BalanceArr=1;
        let Ret = global.HostingCaller.GetAccountListByKey(Params, undefined, undefined, undefined, 1, SmartFilter);
        //console.log("Ret.arr=",Ret.arr)

        let arr = [];
        for(let i = 0; i < Ret.arr.length; i++)
        {
            if(Params.AllAccounts || Ret.arr[i].Value.Smart === Smart)
            {
                arr.push(Ret.arr[i]);
            }
        }
        Ret.arr = arr;

        return Ret;
    };
    global.HTTPCaller.DappWalletList = global.HostingCaller.DappWalletList;





    global.HostingCaller.DappAccountList = function (Params)
    {
        if(typeof Params !== "object")
            return {result:0};

        Params.CountNum = ParseNum(Params.CountNum);
        if(Params.CountNum > MaxCountViewRows)
            Params.CountNum = MaxCountViewRows;
        if(!Params.CountNum)
            Params.CountNum = 1;

        let arr = ACCOUNTS.GetRowsAccounts(ParseNum(Params.StartNum), Params.CountNum, undefined, 1, 1);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    };



    global.HostingCaller.DappSmartList = function (Params)
    {
        if(typeof Params !== "object")
            return {result:0};

        Params.CountNum = ParseNum(Params.CountNum);
        if(Params.CountNum > MaxCountViewRows)
            Params.CountNum = MaxCountViewRows;
        if(!Params.CountNum)
            Params.CountNum = 1;

        let arr = SMARTS.GetRows(ParseNum(Params.StartNum), Params.CountNum, undefined, undefined, Params.GetAllData, Params.TokenGenerate,
            Params.AllRow);
        arr=UseRetFieldsArr(arr,Params.Fields);
        return {arr:arr, result:1};
    }

    global.HostingCaller.DappBlockList = function (Params,response)
    {
        if(typeof Params !== "object")
            return {result:0};

        Params.StartNum = ParseNum(Params.StartNum);
        Params.CountNum = ParseNum(Params.CountNum);
        if(Params.CountNum > MaxCountViewRows)
            Params.CountNum = MaxCountViewRows;
        if(!Params.CountNum)
            Params.CountNum = 1;

        return global.HTTPCaller.DappBlockList(Params, response);
    }

    global.HostingCaller.DappTransactionList = function (Params,response)
    {
        if(typeof Params !== "object")
            return {result:0};

        Params.BlockNum = ParseNum(Params.BlockNum);
        Params.StartNum = ParseNum(Params.StartNum);
        Params.CountNum = ParseNum(Params.CountNum);

        if(Params.CountNum > MaxCountViewRows)
            Params.CountNum = MaxCountViewRows;
        if(!Params.CountNum)
            Params.CountNum = 1;

        return global.HTTPCaller.DappTransactionList(Params, response);
    }

    global.HostingCaller.DappStaticCall = function (Params,response)
    {
        if(typeof Params !== "object")
            return {result:0};

        return global.HTTPCaller.DappStaticCall(Params, response);
    }


    global.HostingCaller.GetHistoryTransactions = function (Params)
    {
        if(typeof Params !== "object")
            return {result:0};

        return global.HTTPCaller.GetHistoryTransactions(Params);
    }

    global.HostingCaller.GetSupplyCalc = function (Params)
    {
        let BlockNum = GetCurrentBlockNumByTime();
        let BlockNum0 = 63538017;
        let RestAcc0 = 359939214;
        let Delta = BlockNum - BlockNum0;
        let DeltaReward = Math.floor(Delta * NEW_FORMULA_JINN_KTERA * RestAcc0 / TOTAL_SUPPLY_TERA);
        return TOTAL_SUPPLY_TERA - RestAcc0 + DeltaReward;
    };

    global.HostingCaller.GetSupply = function (Params)
    {
        if(global.NOT_RUN)
        {
            return global.HostingCaller.GetSupplyCalc(Params);
        }

        let Data = ACCOUNTS.ReadState(0);
        if(!Data)
            return "";
        else
        {
            return "" + (global.TOTAL_SUPPLY_TERA - Data.Value.SumCOIN);
        }
    };

    global.HostingCaller.GetTotalSupply = function (Params)
    {
        return "" + global.TOTAL_SUPPLY_TERA;
    };

//Mining RPC


    global.HostingCaller.GetWork = function (Params)
    {
        if(!global.USE_API_MINING)
            return {result:0, text:"Need set const USE_API_MINING:1"};

        if(!GlMiningBlock)
            return {result:0};

        let Period = Date.now() - GlMiningBlock.Time;
        if(Period < 0 || Period > global.CONSENSUS_PERIOD_TIME)
            return {result:0};

        let RetData = global.CopyObjKeys({}, GlMiningBlock);
        RetData.result = 1;
        RetData.Period = Period;
        RetData.Time =  + global.GetCurrentTime();
        RetData.FIRST_TIME_BLOCK = FIRST_TIME_BLOCK;
        RetData.CONSENSUS_PERIOD_TIME = CONSENSUS_PERIOD_TIME;

        return RetData;
    };

    global.HostingCaller.SubmitWork = function (Params)
    {

        if(!global.USE_API_MINING)
            return {result:0, text:"Need set const USE_API_MINING:1"};
        if(!GlMiningBlock || GlMiningBlock.BlockNum !== Params.BlockNum)
            return {result: - 1, text:"Bad BlockNum"};

        if(GlMiningBlock.SeqHash !== Params.SeqHash)
            return {result: - 1, text:"Bad SeqHash"};

        let Period = Date.now() - GlMiningBlock.Time;
        if(Period < 0 || Period > global.CONSENSUS_PERIOD_TIME)
            return {result: - 1, text:"Bad Period"};

        if(!HexToArr(Params, "PrevHash"))
            return {result: - 1, text:"Bad format PrevHash"};
        if(!HexToArr(Params, "SeqHash"))
            return {result: - 1, text:"Bad format SeqHash"};
        if(!HexToArr(Params, "AddrHash"))
            return {result: - 1, text:"Bad format AddrHash"};

        let msg = {cmd:"POW", BlockNum:Params.BlockNum, PrevHash:Params.PrevHash, SeqHash:Params.SeqHash, AddrHash:Params.AddrHash,
        };

        process.send(msg);

        return {result:1};
    };

    global.HostingCaller.SubmitHashrate = function (Params)
    {
        return {result:0};
    };

    global.HostingCaller.GetFormatTx= global.GetFormatTx;

    function HexToArr(Params,Name)
    {
        let Str = Params[Name];
        if(typeof Str === "string" && Str.length === 64)
        {
            let Arr = GetArrFromHex(Str);
            if(Arr.length === 32)
            {
                Params[Name] = Arr;
                return 1;
            }
        }
        return 0;
    }
}