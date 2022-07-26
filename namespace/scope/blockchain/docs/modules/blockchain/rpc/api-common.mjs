//in main process

// const crypto = require('crypto');

import logs from '../../debug/index.mjs'
let debug = (maxCount, system, property, substrate, ...args) => {
    let path = import.meta.url
    let from = path.search('/rpc');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(maxCount,url, system, property, substrate, args)
}
export default (global) => {
debug(-3, '[(self)a]', global.PROCESS_NAME)
    let crypto = global.crypto
    var sessionid = global.GetHexFromAddres(crypto.randomBytes(20));
    debug(-3, `[(${global.PROCESS_NAME}*)global.GetHexFromAddres(crypto.randomBytes(20))]`, sessionid)
    global.GetSessionId=function() {
        return sessionid;
    };

    global.AddTransactionFromMain = AddTransactionFromHexLong;
    global.AddTransactionFromWeb = AddTransactionFromHexLong;
    function AddTransactionFromHexLong(Params,F)
    {
        var HexValue;
        if(Params.Hex)
            HexValue=Params.Hex;
        if(Params.HexValue)
            HexValue=Params.HexValue;

        if(typeof HexValue !== "string")
            return {result:0,text:"Require hex string"};

        var body = global.GetArrFromHex(HexValue.substr(0, HexValue.length - 12 * 2));
        return AddTransactionCommon(body,Params,F);
    }



    function AddTransactionCommon(body,Params,F)
    {
        let Result = {};
        var Tx = {body:body};

        var Res=global.SERVER.AddTransactionInner(Tx);
        var StrHash=global.GetHexFromArr(global.sha3(body));

        Result.sessionid = global.GetSessionId();

        Result.TxID = Tx._TxID;
        Result._TxID = Tx._TxID;
        Result._BlockNum = Tx._BlockNum;
        Result.text = TR_MAP_RESULT[Res];
        Result.result = Res;


        if(Res === 1)
            Result.text = TR_MAP_RESULT[Res] + " on Block " + Result._BlockNum;

        var final = 0;
        if(Res <= 0 && Res !==  - 3)
            final =  - 1;

        if(Params.Main)
            global.ToLogClient("Send: " + Result.text, StrHash, final,0,0,Result._BlockNum);


        //Ожидаем подтверждения в блокчейне
        //1.Запускаем таймер таймаута global.JINN_CONST.STEP_CLEAR_MEM*3 секунд
        //2.После первого подтверждения запускаем второй таймер ожидания, если Confirm>1

        //1
        //let MsgID=0;
        setTimeout(function ()
        {
            //delete GlobalRunMap[MsgID];

            if(!Result)
                return;
            CheckAndSendResult(F,Result);
            console.log("Timeout:",JSON.stringify(Result,"",4));


            Result=undefined;

        },(global.JINN_CONST.STEP_CLEAR_MEM+4)*global.CONSENSUS_PERIOD_TIME);


        if(Params.Confirm && Result.result>0)
        {
            if(Params.Confirm>global.JINN_CONST.STEP_CLEAR_MEM)
                Params.Confirm=global.JINN_CONST.STEP_CLEAR_MEM;//не имеет смысла больше ждать

            //2
            if(global.TX_PROCESS.Worker)
            {
                global.TX_PROCESS.RunRPC("SetFindTX", {TX:StrHash,F:1,Web:Params.Web,Main:Params.Main}, function (Err,Data)
                {

                    Result.result=Data.Result;
                    Result.text=Data.ResultStr;
                    Result.BlockNum=Data.BlockNum;
                    Result.TrNum=Data.TrNum;
                    //Result.text=Data.ResultStr;
                    //console.log("*Data*",Data)

                    if(Params.Confirm>=2 && Result.result>0)
                    {
                        setTimeout(function ()
                        {
                            CheckAndSendResult(F,Result);
                            Result=undefined;
                        },(Params.Confirm-1) * global.CONSENSUS_PERIOD_TIME);
                    }
                    else
                    {
                        CheckAndSendResult(F, Result);
                        Result=undefined;
                    }

                });
            }
        }
        else
        {
            //это чтобы пробросить возможную ошибку исполнения для асинхр. транзакций
            if(Result.result>0 && global.TX_PROCESS.Worker)
                global.TX_PROCESS.RunRPC("SetFindTX", {TX:StrHash,Web:Params.Web,Main:Params.Main});

            F(0, Result);
            Result=undefined;
        }
    }

    function CheckAndSendResult(F,Result)
    {
        if(!Result)
            return;

        if(Result.result>0)
        {

            var RetFind = GetTransactionByID(Result);

            if(!RetFind.result)
            {
                Result.result=0;
                Result.text = "Error - tx not found in blockchain";
            }
            else
            {
                Result._BlockNum = RetFind.BlockNum;
            }
        }


        F(0, Result);
    }
}