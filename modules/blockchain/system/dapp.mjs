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

    class DApp {
        constructor() { }
        Name() {
            throw "Need method Name()";
        }

        GetFormatTransaction(Type) {
            return "";
        }

        GetObjectTransaction(Body) {
            let Type = Body[0];
            let format = GetFormatTransactionCommon(Type);
            if(!format)
                return {"Type":Type, Data:GetHexFromArr(Body)};

            let TR;
            try {
                TR = global.SerializeLib.GetObjectFromBuffer(Body, format, {})
            } catch(e) {

            }
            return TR;
        }

        GetScriptTransaction(Body, BlockNum, TxNum, bInner)
        {
            let Type = Body[0];
            let format = GetFormatTransactionCommon(Type,bInner);
            if(!format)
                return GetHexFromArr(Body);

            let TR = global.SerializeLib.GetObjectFromBuffer(Body, format, {});

            if((Type === TYPE_TRANSACTION_TRANSFER3 || Type === TYPE_TRANSACTION_TRANSFER5) && TR.Body && TR.Body.length)
            {
                let App = global.DAppByType[TR.Body[0]];
                if(App)
                {
                    TR.Body = JSON.parse(App.GetScriptTransaction(TR.Body, BlockNum, TxNum,1))
                }
            }

            ConvertBufferToStr(TR)
            return JSON.stringify(TR, "", 2);
        }

        ClearDataBase()
        {
        }
        Close()
        {
        }
        GetSenderNum(BlockNum, Body)
        {
            return 0;
        }
        GetSenderOperationID(BlockNum, Body)
        {
            return 0;
        }
        CheckSignTransferTx(BlockNum, Body)
        {
            return 0;
        }

        CheckSignAccountTx(BlockNum, Body, OperationID)
        {
            let FromNum = this.GetSenderNum(BlockNum, Body);
            if(!FromNum)
                return {result:0, text:"Error sender num"};
            let Item = ACCOUNTS.ReadState(FromNum);
            if(!Item)
                return {result:0, text:"Error read sender"};

            if(OperationID !== undefined)
            {
                if(OperationID < Item.Value.OperationID)
                    return {result:0, text:"Error OperationID (expected: " + Item.Value.OperationID + " for ID: " + FromNum + ")"};
                let MaxCountOperationID = 100;
                if(BlockNum >= global.BLOCKNUM_TICKET_ALGO)
                    MaxCountOperationID = 1000000;
                if(OperationID > Item.Value.OperationID + MaxCountOperationID)
                    return {result:0, text:"Error too much OperationID (expected max: " + (Item.Value.OperationID + MaxCountOperationID) + " for ID: " + FromNum + ")"};
            }

            let hash = Buffer.from(sha3(Body.slice(0, Body.length - 64)));
            let Sign = Buffer.from(Body.slice(Body.length - 64));
            let Result = CheckSign(hash, Sign, Item.PubKey);
            if(Result)
                return {result:1, text:"ok", ItemAccount:Item};
            else
                return {result:0, text:"Sign error"};
        }
        OnProcessBlockStart(Block)
        {
        }
        OnProcessBlockFinish(Block)
        {
        }
        OnDeleteBlock(BlockNum)
        {
        }
        OnProcessTransaction(Block, Body, BlockNum, TrNum)
        {
        }

        GetScrollList(DB, start, count)
        {
            let arr = [];
            for(let num = start; true; num++)
            {
                let Data = DB.Read(num);
                if(!Data)
                    break;

                arr.push(Data)

                count--
                if(count < 1)
                    break;
            }

            return arr;
        }
    }

    function GetFormatTransactionCommon(Type,bInner)
    {
        let App = global.DAppByType[Type];
        if(App)
            return App.GetFormatTransaction(Type,bInner);
        else
            return "";
    }

    function ReqDir(Path)
    {
        if(fs.existsSync(Path))
        {
            let arr = fs.readdirSync(Path);
            for(let i = 0; i < arr.length; i++)
            {
                let name = arr[i];
                ToLog("Reg: " + name);
                let name2 = Path + "/" + arr[i];
                require(name2);
            }
        }
    }
    global.DApp = DApp
    return DApp;
}