import teraDbFile from './tera-db-file.mjs'
/*
 * @project: JINN
 * @version: 1.0
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2020 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

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
    const fs = global.fs
    const buffer = global.buffer
    let DbFiles = teraDbFile(global)

    class CDBBase extends DbFiles
    {
        constructor(FileName, bReadOnly)
        {
            super()

            this.FileName = FileName
            var FileItem = this.OpenDBFile(this.FileName, !bReadOnly);
            this.FileNameFull = FileItem.fname
            this.WasUpdate = 1
        }
        ReadUint32(Position)
        {
            var BufForSize = this.ReadInner(Position, 4);
            if(!BufForSize)
                return undefined;

            BufForSize.len = 0
            return global.ReadUint32FromArr(BufForSize);
        }

        Write(BufWrite, Position, CheckSize)
        {
            return this.WriteInner(BufWrite, Position, CheckSize);
        }
        Read(Position, DataSize)
        {
            return this.ReadInner(Position, DataSize);
        }

        WriteInner(BufWrite, Position, CheckSize, MaxSize, bJournalRestoring)
        {
            this.WasUpdate = 1

            var FI = this.OpenDBFile(this.FileName, 1);

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

            if(!(BufWrite instanceof buffer)) {
                BufWrite = buffer.from(BufWrite)
            }

            // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! WriteInner')
            var written = fs.writeSync(FI.fd, BufWrite, 0, MaxSize, Position);
            if(written !== MaxSize)
            {
                global.ToLog("DB-FILE: Error write to file:" + written + " <> " + MaxSize)
                return false;
            }

            FI.size = Math.max(FI.size, Position + written)

            if(CheckSize && FI.size !== Position + written)
                global.ToLogTrace("Error FI.size = " + FI.size)

            return Position;
        }

        Alloc(Size)
        {
            var FI = this.OpenDBFile(this.FileName, 1);
            var Position = FI.size;
            FI.size += Size
            return Position;
        }

        ReadInner(Position, DataSize, bNoCheckSize)
        {

            Position = Math.trunc(Position)

            var BufRead = buffer.alloc(DataSize);
            var FI = this.OpenDBFile(this.FileName);

            var bytesRead = fs.readSync(FI.fd, BufRead, 0, BufRead.length, Position);
            if(bytesRead !== BufRead.length)
            {
                if(bNoCheckSize)
                {
                    BufRead = BufRead.slice(0, bytesRead)
                }
                else
                {
                    return undefined;
                }
            }

            return BufRead;
        }

        GetSize()
        {
            var FI = this.OpenDBFile(this.FileName);
            return FI.size;
        }

        TruncateInner(Pos)
        {

            var FI = this.OpenDBFile(this.FileName, 1);
            if(FI.size !== Pos)
            {
                FI.size = Pos
                fs.ftruncateSync(FI.fd, FI.size)

                this.WasUpdate = 1
            }
        }

        Truncate(Pos)
        {
            this.TruncateInner(Pos)
        }
        Close()
        {
            this.CloseDBFile(this.FileName)
        }

        Clear()
        {

            var FI = this.OpenDBFile(this.FileName, 1);
            FI.size = 0
            fs.ftruncateSync(FI.fd, FI.size)

            this.WasUpdate = 1
        }
    };

    return  CDBBase

}
