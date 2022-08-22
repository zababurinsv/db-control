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
    class CDBItemFixed extends global.CDBBase
    {
        constructor(FileName, Format, bReadOnly)
        {
            super(FileName, bReadOnly, 0)

            if(typeof Format === "object")
                Format = global.SerializeLib.GetFormatFromObject(Format)

            this.DataSize = global.SerializeLib.GetBufferFromObject({}, Format, {}).length

            this.Format = Format
            this.WorkStruct = {}
        }

        Write(Data)
        {
            JINN_STAT.WriteRowsDB++

            var BufWrite = global.SerializeLib.GetBufferFromObject(Data, this.Format, this.WorkStruct, 1);
            if(this.DataSize !== BufWrite.length)
            {
                ToLogTrace("Error SerializeLib")
            }

            if(global.DEV_MODE)
            {
                if(Data.Position && Data._FileName && Data._FileName !== this.FileName)
                    StopAndExit("Error write, item file: " + Data._FileName + " need file: " + this.FileName + " Pos=" + Data.Position)

                Data._FileName = this.FileName
            }

            Data.Position = this.WriteInner(BufWrite, Data.Position, 0, BufWrite.length)

            if(Data.Position)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }

        Alloc()
        {
            if(!this.DataSize)
                throw "Not set this.DataSize";

            return super.Alloc(this.DataSize);
        }

        Read(Position)
        {
            JINN_STAT.ReadRowsDB++
            Position = Math.trunc(Position)

            var BufRead = this.ReadInner(Position, this.DataSize);
            if(!BufRead)
                return undefined;

            var Data;
            try
            {
                Data = global.SerializeLib.GetObjectFromBuffer(BufRead, this.Format, this.WorkStruct)
            }
            catch(e)
            {
                ToLog("JINN DB-ITEM-FIXED Read: " + e)
                return undefined;
            }

            Data.Position = Position
            Data.DataSize = this.DataSize
            if(global.DEV_MODE)
                Data._FileName = this.FileName

            return Data;
        }
    };

    global.CDBItemFixed = CDBItemFixed;
}