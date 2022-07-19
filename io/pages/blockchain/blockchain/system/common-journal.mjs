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

import cdbHeadBody from "../jinn/src/db/jinn-db-headbody.mjs";
import ZLib from "./zerozip.mjs"
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
    const ZZip = new ZLib();

    const CDBHeadBody = cdbHeadBody(global)

    class CommonJournal {
        constructor() {
            let bReadOnly = (global.PROCESS_NAME !== "TX");

            this.FORMAT_ITEM = {Border1:"str2", TableArr:[{Reserve2:"arr4", Type:"byte", DataArr:[{Pos:"uint", BufZip:"tr"}]}], Reserve3:"arr4",
                SumHash:"hash", AccHash:"hash", BlockNumStart:"uint32", BlockNumFinish:"uint32", Border2:"str2", }
            this.DBJournal = new CDBHeadBody("journal", {Position:"uint", BlockNum:"uint32"}, this.FORMAT_ITEM, bReadOnly)

            if(bReadOnly) {
                return;
            }
        }

        Clear() {
            global.ToLog("Run Clear DBJournal")
            this.DBJournal.Clear()
        }

        Close() {
            this.DBJournal.Close()
        }
        ReadItem(Num) {
            if(Num < 0)
                return undefined;

            let Item = this.DBJournal.Read(Num);
            if(Item) {
                if(Item.Border1 !== "[[" || Item.Border2 !== "]]")
                {
                    global.ToLog("--------- ERROR JOURNAL BORDERS at Num=" + Num)
                    Item = undefined
                }
            }
            return Item;
        }
        StartInitBuffer()
        {
            this.TableArr = []
        }

        GetJournalTypeItem(IDNum)
        {
            let TypeItem = this.TableArr[IDNum];
            if(!TypeItem)
            {
                TypeItem = {Type:IDNum, DataArr:[], }
                this.TableArr[IDNum] = TypeItem
            }
            return TypeItem;
        }

        WriteBufferToJournal(BufRead, Position, BufWrite, IDNum, NotUseOffset)
        {
            let PosObj = GetDiffPosFromArrays(BufRead, BufWrite);
            if(PosObj.PosLeft === BufWrite.length)
                return;

            if(NotUseOffset)
            {
                PosObj = {PosLeft:0}
            }
            else if(PosObj.PosLeft !== 0 || PosObj.PosRight !== BufWrite.length)
            {
                BufRead = BufRead.slice(PosObj.PosLeft, PosObj.PosRight)
            }

            if(BufRead.length === 0)
                return;

            let TypeItem = this.GetJournalTypeItem(IDNum);

            let Item = {Pos:Position + PosObj.PosLeft, BufZip:ZZip.GetBufferZZip(BufRead)};
            TypeItem.DataArr.push(Item)
        }

        WriteSizeToJournal(Position, BufWrite, IDNum)
        {
            let TypeItem = this.GetJournalTypeItem(IDNum);
            let Item = {Pos:Position, BufZip:[]};
            TypeItem.DataArr.push(Item)
        }

        WriteJournalToFile(BlockNumStart, BlockFinish)
        {
            let FixData = {BlockNum:BlockFinish.BlockNum, Border1:"[[", TableArr:[], SumHash:BlockFinish.SumHash, AccHash:ACCOUNTS.GetCalcHash(),
                BlockNumStart:BlockNumStart, BlockNumFinish:BlockFinish.BlockNum, Border2:"]]", };

            for(let i = 0; i < this.TableArr.length; i++)
            {
                let Table = this.TableArr[i];
                if(Table)
                    FixData.TableArr.push(Table)
            }

            this.DBJournal.DeleteFromBlock(BlockFinish.BlockNum, "BlockNum")
            if(!this.DBJournal.Write(FixData))
                global.ToLog("Error write FixData on BlockNum=" + FixData.BlockNum)
            this.TableArr = []
        }

        RestoreFromJournalAtNum(BlockNum, bCheckOnly)
        {
            let bWasRestoreDB = 0;
            while(1)
            {
                let Item = this.DBJournal.Read(this.DBJournal.GetMaxNum());
                if(!Item)
                {
                    global.ToLog("RestoreFromJournalAtNum: Error read last item on BlockNum=" + BlockNum, 2)
                    break;
                }
                else
                if(Item.BlockNum >= BlockNum)
                {
                    if(Item.BlockNum === BlockNum)
                        bWasRestoreDB = 1

                    this.ProcessingRestoreItems(Item, BlockNum, bCheckOnly)
                    this.DBJournal.DeleteFromItem(Item)
                }
                else
                {
                    break;
                }
            }

            return bWasRestoreDB;
        }

        ProcessingRestoreItems(Item, BlockNum, bCheckOnly)
        {
            if(!Item.TableArr)
                return;

            let LastSavingItem = undefined;
            for(let n = 0; n < Item.TableArr.length; n++)
            {
                let Table = Item.TableArr[n];

                let DB = GET_TR_DB(Table.Type);
                if(!DB)
                {
                    global.ToLog("ProcessingRestoreItems BlockNum=" + BlockNum + " Error Type=" + Table.Type, 3)
                    continue;
                }
                for(let i = 0; i < Table.DataArr.length; i++)
                {
                    let Data = Table.DataArr[i];
                    if(Data.BufZip.length === 0)
                    {

                        if(!bCheckOnly)
                        {
                            DB.TruncateInner(Data.Pos)
                        }

                        continue;
                    }
                    let BufUnZip = ZZip.GetBufferUnZZip(Data.BufZip, Data.BufZip.length);

                    if(bCheckOnly)
                    {
                        let BufRead = DB.ReadInner(Data.Pos, BufUnZip.length);
                        if(!BufRead || !global.IsEqArr(BufRead, BufUnZip))
                        {
                            global.ToLog("Restore BlockNum=" + BlockNum + " DB: " + DB.FileName + " Pos=" + Data.Pos + "/" + DB.GetSize())
                            global.ToLog("BufRead =" + global.GetHexFromArr(BufRead))
                            global.ToLog("BufUnZip=" + global.GetHexFromArr(BufUnZip))
                            global.ToLog("BufZip  =" + global.GetHexFromArr(Data.BufZip))

                            continue;
                        }
                    }
                    else
                    {
                        if(Data.Pos === DB._JournalLastSavingPos)
                        {
                            LastSavingItem = {BufUnZip:BufUnZip, Pos:Data.Pos}
                            continue;
                        }

                        DB.WriteInner(BufUnZip, Data.Pos, undefined, BufUnZip.length, 1)
                    }
                }
                if(LastSavingItem)
                {
                    DB.WriteInner(LastSavingItem.BufUnZip, LastSavingItem.Pos, undefined, LastSavingItem.BufUnZip.length, 1)
                }

                if(DB.OnRestoreJournal)
                    DB.OnRestoreJournal()
            }
        }

        GetLastBlockNumAct()
        {
            this.Close()

            let BlockNum;
            let MaxNumJournal = this.GetMaxNum();
            let Item = this.ReadItem(MaxNumJournal);
            if(Item)
                BlockNum = Item.BlockNum
            else
            {
                BlockNum =  - 1
            }

            return BlockNum;
        }

        GetLastBlockNumItem()
        {

            let MaxNumJournal = this.GetMaxNum();
            let Item = this.ReadItem(MaxNumJournal);

            return Item;
        }

        GetMinBlockAct()
        {
        }

        ControlSize()
        {
        }
        GetMaxNum()
        {
            return this.DBJournal.GetMaxNum();
        }

        FindByBlockNum(BlockNum)
        {
            return this.DBJournal.FindByBlockNum(BlockNum);
        }
        GetScrollList(start, count)
        {
            let arr = this.DBJournal.GetScrollList(start, count);
            for(let i = 0; i < arr.length; i++)
            {
                let Item = arr[i];

                Item.Tables = ""
                for(let n = 0; n < Item.TableArr.length; n++)
                {
                    let Table = Item.TableArr[n];
                    let DB = GET_TR_DB(Table.Type);
                    if(DB)
                    {
                        Item.Tables += DB.FileName + "\n"
                    }
                }

                let Block = global.SERVER.ReadBlockHeaderDB(Item.BlockNum);

                if(!Block)
                    Item.VerifySumHash = 0
                else
                {
                    if(global.IsEqArr(Block.SumHash, Item.SumHash))
                        Item.VerifySumHash = 1
                    else
                        Item.VerifySumHash =  - 1
                }
            }

            return arr;
        }
    };

    function GetDiffPosFromArrays(BufRead,BufWrite)
    {
        let PosLeft = 0;
        let MaxLength = BufRead.length;
        for(let i = 0; i < MaxLength; i++)
        {
            if(BufRead[i] !== BufWrite[i])
            {
                break;
            }
            PosLeft = i + 1;
        }

        let PosRight = 0;
        for(let i = MaxLength - 1; i >= PosLeft; i--)
        {
            PosRight = i + 1;
            if(BufRead[i] !== BufWrite[i])
            {
                break;
            }
        }

        return {PosLeft:PosLeft, PosRight:PosRight};
    }

    global.JOURNAL_DB = new CommonJournal();
}