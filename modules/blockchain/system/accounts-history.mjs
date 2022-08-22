/*
 * @project: TERA
 * @version: 2
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2021 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/


"use strict";
//History tx
import accountsRestNo from "./accounts-rest-no.mjs"
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
    let AccountsRestNo = accountsRestNo(global)
    class AccountHistory extends AccountsRestNo
    {
        constructor(bReadOnly) {
            super(bReadOnly);
            this.FILE_NAME_HISTORY = "history-body"
            this.FORMAT_STATE_HISTORY = {NextPos:"uint", Reserv:"arr2"}

            this.DBStateHistory = new global.CDBRow("history-state", this.FORMAT_STATE_HISTORY, bReadOnly);
            this.DBBodyHistory = new global.CDBBase(this.FILE_NAME_HISTORY, bReadOnly);
            this.HistoryFormatArr =
                [
                    {Type:"byte", BlockNum:"uint32", TrNum:"uint16", NextPos:"uint"},
                    {Type:"byte", BlockNum:"uint32",TrNum:"uint16", NextPos:"uint", Direct:"str1", CorrID:"uint", SumCOIN:"uint", SumCENT:"uint32"},
                    {Type:"byte", BlockNum:"uint32",TrNum:"uint16", NextPos:"uint", Direct:"str1", CorrID:"uint", SumCOIN:"uint", SumCENT:"uint32", Description:"str"},
                    {Type:"byte", BlockNum:"uint32",TrNum:"uint16", NextPos:"uint", Direct:"str1", CorrID:"uint", SumCOIN:"uint", SumCENT:"uint32", Description:"str", Token:"str", ID:"str"},
                    {Type:"byte", BlockNum:"uint32",TrNum:"uint16", NextPos:"uint", Direct:"str1", CorrID:"uint", SumCOIN:"uint", SumCENT:"uint32", Description:"str", Token:"str", ID:"str",Currency:"uint32"},
                ];
            this.WorkStructArr = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
            global.REGISTER_TR_DB(this.DBStateHistory, 14);
            global.REGISTER_TR_DB(this.DBBodyHistory, 16);
        }

        ClearHistory()
        {
            this.DBStateHistory.Clear();
            this.DBBodyHistory.Clear();
        }

        CloseHistory()
        {

            this.DBStateHistory.Close();
            this.DBBodyHistory.Close();
        }

        WriteHistory(Num, Body)
        {
            if(Body.SmartMode>=2 && Body.SmartMode<=4)
                Body.Type = Body.SmartMode;
            else
                Body.Type = 1;

            let Head = this.DBStateHistory.Read(Num);
            if(!Head)
                Head = {Num:Num, NextPos:0};

            if(typeof Body.Description==="object")
            {
                Body.Description=this.OjectToDesctription(Body.Description);
            }

            Body.NextPos = Head.NextPos;
            Head.NextPos = this.WriteHistoryBody(Body);
            this.DBStateHistory.Write(Head);
        }

        WriteHistoryBody(Body)
        {
            let BufWrite = SerializeLib.GetBufferFromObject(Body, this.HistoryFormatArr[Body.Type], this.WorkStructArr[Body.Type]);
            return this.DBBodyHistory.Write(BufWrite);
        }

        GetHistory(Num, Count, StartPos, MinConfirm, GetPubKey)
        {
            if(!MinConfirm)
                MinConfirm = 0;
            let MaxNumBlockDB = SERVER.GetMaxNumBlockDB();

            let Position = StartPos;

            if(Position === undefined)
            {
                let Account = this.DBStateHistory.Read(Num);
                if(!Account)
                {
                    return [];
                }
                Position = Account.NextPos;
            }

            let arr = [];
            while(Count > 0 && Position)
            {
                Count--;

                let Item = this.ReadHistory(Position);
                if(!Item)
                    break;
                Position = Item.NextPos;
                if(MinConfirm)
                {
                    if(Item.BlockNum + MinConfirm > MaxNumBlockDB)
                    {
                        continue;
                    }
                }
                if(GetPubKey)
                {
                    let Acc = this.ReadState(Item.CorrID);
                    Item.PubKey = GetHexFromArr(Acc.PubKey)
                }
                arr.push(Item)
            }
            //console.log(arr);
            return arr;
        }

        ReadHistory(Position)
        {
            let BufRead = this.DBBodyHistory.ReadInner(Position, 1000, 1);
            if(!BufRead || BufRead.length < 13)
            {
                ToLog("ReadHistory: Error bytesRead length (less 13 bytes) at Position=" + Position);
                return undefined;
            }

            let Type = BufRead[0];
            let format = this.HistoryFormatArr[Type];
            if(!format)
            {
                ToLog("ReadHistory: Error from history, type = " + Type);
                return undefined;
            }

            let Item = global.SerializeLib.GetObjectFromBuffer(BufRead, format, this.WorkStructArr[Type]);
            Item.Pos = Position;

            return Item;
        }

        OjectToDesctription(Obj)
        {
            if(!Obj)
                return "";
            let Str="";
            if(Obj.cmd)
            {
                Str="Call → "+Obj.cmd;
            }
            else
            {
                try{Str=JSON.stringify(Obj);}catch(e){};
            }

            //console.log(Str);
            return Str;
        }

    }

   return AccountHistory;

}
