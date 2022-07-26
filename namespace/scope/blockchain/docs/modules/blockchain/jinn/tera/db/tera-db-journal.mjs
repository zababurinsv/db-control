/*
 * @project: JINN
 * @version: 1.0
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2020 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

"use strict";


import logs from '../../../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)
    global.TR_DATABUF_COUNTER = 0;
    class CDBTR extends global.CDBParentBase {
        constructor(FileName, bReadOnly)
        {
            super(FileName, bReadOnly, 0)

            this.TRLevel = []
            this.ClearAllTR()
        }

        ReadInner(Position, DataSize, bNoCheckSize, Level)
        {
            if(!Level)
                Level = 0

            let TRContext = this.GetCurrentTRTree(Level);
            if(TRContext)
            {
                let Item = {Position:Position};
                let Find = TRContext.Tree.find(Item);
                if(Find)
                {
                    return Find.BufWrite;
                }
                else
                {
                    return this.ReadInner(Position, DataSize, bNoCheckSize, Level + 1);
                }
            }

            return super.ReadInner(Position, DataSize, bNoCheckSize);
        }

        WriteInner(BufWrite, Position, CheckSize, MaxSize, bJournalRestoring)
        {
            this.WasUpdate = 1

            let TRContext = this.GetCurrentTRTree();
            if(!TRContext)
                return super.WriteInner(BufWrite, Position, CheckSize, MaxSize, bJournalRestoring);

            if(Position === undefined)
            {
                Position = this.GetSize()
                if(!Position)
                    Position = 100
            }

            if(MaxSize && BufWrite.length !== MaxSize)
                BufWrite = BufWrite.slice(0, MaxSize)

            let Item = {Position:Position, BufWrite:BufWrite};
            let Find = TRContext.Tree.find(Item);
            if(Find)
            {
                TRContext.Tree.remove(Find)
                if(Find.BufWrite.length !== Item.BufWrite.length)
                    StopAndExit("WriteInner: Error new Item length = " + Item.BufWrite.length + "/" + Find.BufWrite.length)
            }
            TRContext.Tree.insert(Item)

            global.TR_DATABUF_COUNTER += BufWrite.length

            if(CheckSize && this.GetSize() !== Position + MaxSize)
            {
                global.ToLogTrace("Error size = " + this.GetSize())
                return false;
            }

            return Position;
        }

        GetSize()
        {
            let TRContext = this.GetCurrentTRTree();
            if(!TRContext)
                return super.GetSize();
            let Item = TRContext.Tree.max();
            if(Item)
            {
                let Size = Item.Position;
                if(Item.BufWrite)
                    Size += Item.BufWrite.length

                if(Size > TRContext.Size)
                    return Size;
            }

            return TRContext.Size;
        }

        Truncate(Pos)
        {
            let TRContext = this.GetCurrentTRTree();
            if(!TRContext)
                super.Truncate(Pos)
            else
            {
                this.WasUpdate = 1
                this.TruncateTree(TRContext, Pos)
            }
        }

        TruncateTree(TRContext, Pos)
        {
            if(!Pos)
                TRContext.Tree.clear()
            else
            {
                while(1)
                {
                    let Item = TRContext.Tree.max();
                    if(!Item || Item.Position < Pos)
                        break;
                    TRContext.Tree.remove(Item)
                }
            }
            TRContext.Tree.insert({Position:Pos, Truncate:1})
            TRContext.Size = Pos
        }

        ClearAllTR()
        {
            for(let i = 0; i < this.TRLevel.length; i++)
                this.TRLevel[i].Tree.clear()

            this.TRLevel = []
        }

        BeginTR(Name)
        {

            let Tree = new global.RBTree(function (a,b)
            {
                if(a.Position !== b.Position)
                    return a.Position - b.Position;

                return (b.Truncate ? 1 : 0) - (a.Truncate ? 1 : 0);
            });

            let Size = this.GetSize();

            this.TRLevel.unshift({Tree:Tree, Size:Size, Name:Name})
        }

        RollbackTR(Name)
        {
            let TRContext = this.TRLevel.shift();
            if(!TRContext)
                StopAndExit("Error RollbackTR - The transaction was not started")
            if(TRContext.Name !== Name)
                StopAndExit("Error RollbackTR - Bad level, current = " + TRContext.Name + " need " + Name)
            if(this.OnRollbackTR)
                this.OnRollbackTR(Name)

            if(this.OnRollbackItemTR)
            {
                let it = TRContext.Tree.iterator(), Item;
                while((Item = it.next()) !== null)
                {
                    this.OnRollbackItemTR(Item.BufWrite, Item.Position)
                }
            }
        }

        CommitTR(Name, CheckPoint, IDNum)
        {

            let TRContext = this.TRLevel.shift();
            if(!TRContext)
            {
                StopAndExit("Error CommitTR:" + Name + " - The transaction was not started")
            }
            if(TRContext.Name !== Name)
            {
                StopAndExit("Error CommitTR:" + Name + " - Bad level. Need " + TRContext.Name)
            }

            let TRParent = this.GetCurrentTRTree();
            if(TRParent)
            {
                if(CheckPoint)
                    StopAndExit("CommitTR: Error use CheckPoint in not top level")

                let WasTruncate = 0;

                let it = TRContext.Tree.iterator(), Item;
                while((Item = it.next()) !== null)
                {
                    if(Item.Truncate)
                    {
                        if(!WasTruncate)
                            this.TruncateTree(TRParent, Item.Position)
                        WasTruncate = 1
                    }
                    else
                    {
                        let Find = TRParent.Tree.find(Item);
                        if(Find)
                        {
                            if(Find.BufWrite.length !== Item.BufWrite.length)
                                StopAndExit("CommitTR : Error new Item length = " + Item.BufWrite.length + "/" + Find.BufWrite.length)

                            Find.BufWrite = Item.BufWrite
                        }
                        else
                        {
                            TRParent.Tree.insert(Item)
                        }
                    }
                }
            }
            else
            {

                let WasTruncate = 0;
                let WasCheckFileSize = 0;
                let LastSavingItem = undefined;
                let it = TRContext.Tree.iterator(), Item;
                while((Item = it.next()) !== null)
                {
                    if(Item.Truncate)
                    {
                        if(CheckPoint)
                            continue;

                        if(!WasTruncate)
                            super.Truncate(Item.Position)
                        WasTruncate = 1
                    }
                    else
                    {
                        if(CheckPoint)
                        {
                            let BufRead = super.ReadInner(Item.Position, Item.BufWrite.length);
                            if(BufRead)
                            {
                                JOURNAL_DB.WriteBufferToJournal(BufRead, Item.Position, Item.BufWrite, IDNum, (Item.Position === this._JournalLastSavingPos))
                            }
                            else
                            if(this._JournalCheckFileSize && !WasCheckFileSize)
                            {
                                WasCheckFileSize = 1
                                JOURNAL_DB.WriteSizeToJournal(Item.Position, Item.BufWrite, IDNum)
                            }
                        }
                        else
                        {
                            if(Item.Position === this._JournalLastSavingPos)
                            {
                                LastSavingItem = Item
                                continue;
                            }
                            super.WriteInner(Item.BufWrite, Item.Position)
                        }
                    }
                }

                if(LastSavingItem)
                    super.WriteInner(LastSavingItem.BufWrite, LastSavingItem.Position)

                if(CheckPoint)
                {
                    this.TRLevel.unshift(TRContext)
                }
                else
                {
                    TRContext.Tree.clear()
                }
            }
        }

        GetCurrentTRTree(Level)
        {
            if(!Level)
                Level = 0
            return this.TRLevel[Level];
        }
    };

    return CDBTR;
}
