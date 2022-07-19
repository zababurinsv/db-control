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
    class CDBResult
    {
        constructor()
        {
            var bReadOnly = (global.PROCESS_NAME !== "TX");

            this.DBResult = new global.CDBHeadBody({Head:"result-index", Body:"result-data"}, {Position:"uint"}, {Arr:["uint"]}, bReadOnly, "BlockNum")
            global.REGISTER_TR_DB(this.DBResult.DBHeader, 20)
            global.REGISTER_TR_DB(this.DBResult.DBBody, 22)
        }

        DoNode()
        {
        }

        Clear()
        {
            this.DBResult.Clear()
        }

        Close()
        {
            this.DBResult.Close()
        }

        DeleteFromBlock(BlockNum)
        {
            this.DBResult.DeleteFromNum(BlockNum)
        }

        WriteBodyResult(BlockNum, arrContentResult)
        {
            var Data = {BlockNum:BlockNum, Arr:arrContentResult};
            this.DBResult.Write(Data)
        }

        Read(BlockNum)
        {
            return this.DBResult.Read(BlockNum);
        }

        CheckLoadResult(Block)
        {
            if(!Block.TxData || Block.VersionBody)
                return;
            var Data = this.Read(Block.BlockNum);
            if(Data && Data.Arr && Data.Arr.length > 0)
            {
                Block.VersionBody = 1
                Block.arrContentResult = Data.Arr
            }
        }
    };

    return CDBResult;
}