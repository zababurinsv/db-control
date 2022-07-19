/*
 * @project: JINN
 * @version: 1.0
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2020 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/


"use strict";

const MAX_SIZE_ITEM = 10 * 1000000;
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
    class CDBItem extends global.CDBBase
    {
        constructor(FileName, Format, bReadOnly, EngineID, bCheckSize)
        {
            super(FileName, bReadOnly, EngineID)

            if(typeof Format === "object")
                Format = global.SerializeLib.GetFormatFromObject(Format)

            this.CheckSize = bCheckSize
            this.DataSize = global.SerializeLib.GetBufferFromObject({}, Format, {}).length

            this.Format = Format
            this.WorkStruct = {}
        }

        Write(Data)
        {
            global.JINN_STAT.WriteRowsDB++

            var BufWrite = global.SerializeLib.GetBufferFromObject(Data, this.Format, this.WorkStruct, 1, [0, 0, 0, 0]);
            var DataSize = BufWrite.length - 4;
            if(this.CheckSize && this.DataSize !== DataSize)
            {
                global.ToLogTrace("Error SerializeLib")
            }

            global.WriteUint32AtPos(BufWrite, DataSize, 0)
            if(Data.Position)
            {
                if(global.DEV_MODE && Data._FileName && Data._FileName !== this.FileName)
                    StopAndExit("Error write, item file: " + Data._FileName + " need file: " + this.FileName + " Pos=" + Data.Position)
                var DataSizeOld = this.ReadUint32(Data.Position);
                if(DataSizeOld < DataSize)
                {
                    var Data1 = this.Read(Data.Position);
                    ToLog("Data1:" + JSON.stringify(Data1))
                    ToLog("Data2:" + JSON.stringify(Data))
                    global.ToLogTrace("Error #1 Read DataSize: " + DataSize + "/" + DataSizeOld + " file=" + this.FileName + " Pos=" + Data.Position)
                    return 0;
                }
            }
            if(global.DEV_MODE)
                Data._FileName = this.FileName

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
            throw "Cannt run Alloc. Use only fixed item.";

            if(!this.DataSize)
                throw "Not set this.DataSize";

            var BufWrite = [];
            WriteUint32AtPos(BufWrite, this.DataSize, 0)
            for(var i = 0; i < this.DataSize; i++)
                BufWrite.push(0)

            var Position = super.Alloc(BufWrite.length);
            this.WriteInner(BufWrite, Position, 0, BufWrite.length)

            return Position;
        }

        Read(Position)
        {
            global.JINN_STAT.ReadRowsDB++
            Position = Math.trunc(Position)
            var DataSize = this.ReadUint32(Position);
            if(!DataSize || DataSize > MAX_SIZE_ITEM)
                return undefined;

            if(this.CheckSize && this.DataSize > DataSize)
            {
                global.ToLogTrace("Error #2 Read DataSize: " + DataSize + "/" + this.DataSize)
                return 0;
            }

            var BufRead = this.ReadInner(Position, DataSize + 4);
            if(!BufRead)
                return undefined;

            var Data;
            try
            {
                Data = global.SerializeLib.GetObjectFromBuffer(BufRead.slice(4), this.Format, this.WorkStruct)
            }
            catch(e)
            {
                ToLog("JINN DB-ITEM: " + e)
                return undefined;
            }

            Data.Position = Position
            Data.DataSize = DataSize
            if(global.DEV_MODE)
                Data._FileName = this.FileName

            return Data;
        }
    };

    global.CDBItem = CDBItem;
}