/*
 * @project: JINN
 * @version: 1.0
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2020 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/


// Files emulate in memjry module

let FileMap = {};
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

    class CDBBase {
        constructor(FileName, bReadOnly, EngineID) {
            console.log('@@@@@@@@@@', FileName, bReadOnly, EngineID)
            this.FileName = FileName
            this.FileNameFull = FileName + "-" + EngineID
            if(EngineID === undefined) {
                global.ToLogTrace("EngineID")
            }

        }

        OpenDBFile(filename)
        {
            let Item = FileMap[this.FileNameFull];
            if(!Item)
            {
                Item = {size:0, buf:[]}
                FileMap[this.FileNameFull] = Item
            }
            return Item;
        }

        CloseDBFile(filename, bDel)
        {
            if(bDel)
                delete FileMap[this.FileNameFull]
        }
        ReadUint32(Position)
        {
            let BufForSize = this.ReadInner(Position, 4);
            if(!BufForSize)
                return undefined;

            BufForSize.len = 0
            return global.ReadUint32FromArr(BufForSize);
        }

        WriteInner(BufWrite, Position, CheckSize, MaxSize)
        {
            this.WasUpdate = 1

            let FI = this.OpenDBFile();
            if(Position === undefined)
            {
                if(!FI.size)
                    FI.size = 100
                Position = FI.size
            }

            if(!MaxSize)
                MaxSize = BufWrite.length
            else
                MaxSize = Math.min(BufWrite.length, MaxSize)

            for(let i = 0; i < MaxSize; i++)
                FI.buf[Position + i] = BufWrite[i]

            FI.size = FI.buf.length

            if(CheckSize && FI.size !== Position + MaxSize)
            {
                global.ToLogTrace("Error FI.size = " + FI.size)
                return false;
            }

            return Position;
        }

        Alloc(Size)
        {
            let FI = this.OpenDBFile();
            let Position = FI.size;

            for(let i = 0; i < Size; i++)
                FI.buf[Position + i] = 0

            FI.size = FI.buf.length
            return Position;
        }

        ReadInner(Position, DataSize)
        {
            Position = Math.trunc(Position)

            let BufRead = [];
            let FI = this.OpenDBFile();

            if(FI.buf.length < Position + DataSize)
            {
                global.ToLogTrace("ReadInner: Error Position: " + Position + " on file: " + this.FileNameFull)
                return undefined;
            }

            for(let i = 0; i < DataSize; i++)
            {
                let Val = FI.buf[Position + i];
                if(!Val)
                    Val = 0
                BufRead[i] = Val
            }

            return BufRead;
        }

        GetSize()
        {
            let FI = this.OpenDBFile();
            return FI.size;
        }
        TruncateInner(Pos)
        {
            let FI = this.OpenDBFile();
            if(FI.size !== Pos)
            {
                FI.size = Pos
                FI.buf.length = FI.size
            }
        }

        Truncate(Pos)
        {
            this.TruncateInner(Pos)
        }
        Close(bDel)
        {
            if(bDel)
                this.CloseDBFile(this.FileName, bDel)
        }

        Clear()
        {
            let FI = this.OpenDBFile();
            FI.size = 0
            FI.buf.length = FI.size
        }
        GetBuf()
        {
            let FI = this.OpenDBFile();
            return FI.buf;
        }
    };
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@', {
        global: global,
        CDBBase: CDBBase
    })
    global.CDBBase = CDBBase;

    return global
}
