/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

'use strict';

import logs from '../../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)

    function Init(Engine)
    {
        Engine.GetTx = function (body,BlockNum,HASH,TestNum)
        {
            global.JINN_STAT["GetTx" + TestNum]++;

            let Tx = {};
            Tx.IsTx = 1;

            if(HASH)
                Tx.HASH = HASH;
            else
            if(BlockNum >= global.BLOCKNUM_TICKET_ALGO)
            {
                Tx.HASH = global.sha3(body, 8);
            }
            else
            {
                Tx.HASH = shaarr(body);
            }

            Tx.HashTicket = Tx.HASH.slice(0, global.JINN_CONST.TT_TICKET_HASH_LENGTH);
            Tx.KEY = global.GetHexFromArr(Tx.HashTicket);
            Tx.body = body;

            return Tx;
        };

        Engine.GetGenesisBlockInner = function (BlockNum)
        {
            let Block = global.SERVER.GenesisBlockHeaderDB(BlockNum);
            Engine.ConvertFromTera(Block, 1, 1);
            Engine.CalcBlockData(Block);
            return Block;
        };

        Engine.CalcBlockHash = function (Block)
        {
            if(!Block.PrevSumHash)
                global.ToLogTrace("Error No PrevSumHash on Block=" + Block.BlockNum);

            if(Block.BlockNum < global.JINN_CONST.BLOCK_GENESIS_COUNT)
            {
                Block.LinkSumHash = global.ZERO_ARR_32;
            }
            else
            {
                Block.LinkSumHash = Block.PrevSumHash;
            }

            if(!Block.TreeHash)
                global.ToLogTrace("No TreeHash on block " + Block.BlockNum);

            Block.DataHash = Engine.CalcDataHashInner(Block);

            if(Block.BlockNum < global.JINN_CONST.BLOCK_GENESIS_COUNT)
            {
                Block.Hash = global.ZERO_ARR_32.slice();
                Block.Hash[0] = 1 + Block.BlockNum;
                Block.Hash[31] = Block.Hash[0];
                Block.PowHash = Block.Hash;

                Block.Power = global.GetPowPowerBlock(Block.BlockNum, Block.Hash);
                Block.OldPrevHash8 = global.ZERO_ARR_32;
            }
            else
            {
                Block.Hash = Engine.CalcBlockHashInner(Block);
            }

            if(!Block.PowHash)
                global.ToLogTrace("Not found Block.PowHash in " + Block.BlockNum);

            Block.SumPow = Block.PrevSumPow + Block.Power;
        };

        Engine.CalcDataHashInner = function (Block)
        {
            let PrevHash;
            if(Block.BlockNum < global.UPDATE_CODE_JINN)
            {
                if(Block.OldPrevHash8 === undefined)
                {
                    global.ToLogTrace("Error No Block.OldPrevHash8 on Block=" + Block.BlockNum);
                    return global.ZERO_ARR_32;
                }

                PrevHash = Block.OldPrevHash8;
            }
            else
                PrevHash = Block.LinkSumHash;

            if(Block.PrevSumPow === undefined)
                global.ToLogTrace("Error No Block.PrevSumPow on Block=" + Block.BlockNum);

            return global.CalcDataHash(Block.BlockNum, PrevHash, Block.TreeHash, Block.PrevSumPow);
        };

        Engine.CalcBlockHashInner = function (Block)
        {
            let PrevHash;
            if(Block.BlockNum < global.UPDATE_CODE_JINN)
                PrevHash = Block.OldPrevHash8;
            else
                PrevHash = Block.LinkSumHash;

            if(PrevHash === undefined)
            {
                global.ToLogTrace("Error No PrevHash on Block=" + Block.BlockNum);
                process.exit();
            }

            global.CalcBlockHashJinn(Block, Block.DataHash, Block.MinerHash, Block.BlockNum, PrevHash);
            return Block.Hash;
        };

        Engine.CalcSumHash = function (Block)
        {

            if(Block.BlockNum >= global.UPDATE_CODE_JINN)
            {
                Block.SumHash = global.CalcSumHash(Block.PrevSumHash, Block.Hash, Block.BlockNum, Block.SumPow);
                return;
            }
            if(Block.BlockNum === 0)
                Block.SumHash = global.ZERO_ARR_32;
            else
            {
                if(!Block.PrevSumHash)
                    global.ToLogTrace("Error No Block.PrevSumHash on Block=" + Block.BlockNum);

                Block.SumHash = global.CalcSumHash(Block.PrevSumHash, Block.Hash, Block.BlockNum, Block.SumPow);
            }
        };
        Engine.CalcTreeHash = function (BlockNum,TxArr)
        {
            if(!TxArr || !TxArr.length)
                return global.ZERO_ARR_32;

            if(BlockNum < global.UPDATE_CODE_JINN)
                return CalcTreeHashFromArrBody(BlockNum, TxArr);
            else
            if(BlockNum < global.UPDATE_CODE_SHARDING)
                return Engine.CalcTreeHashInner(BlockNum, TxArr);
            else
                return Engine.CalcBaseSysTreeHash(BlockNum, TxArr);
        };

        Engine.CalcBaseSysTreeHash = function (BlockNum,TxArr,bSysHashOnly)
        {

            let Buf;
            let SysBuf = [];
            let BaseBuf = [];
            let DoBase = 0;
            for(let n = 0; TxArr && n < TxArr.length; n++)
            {
                let Tx = TxArr[n];

                if(!global.CheckTx("=CalcTreeHash=", Tx, BlockNum, 0))
                {
                    return global.ZERO_ARR_32;
                }

                if(!DoBase && !Engine.IsVirtualTypeTx(Tx.body[0]))
                {
                    DoBase = 1;
                    if(bSysHashOnly)
                        break;
                }

                if(DoBase)
                    Buf = BaseBuf;
                else
                    Buf = SysBuf;

                let Hash = Tx.HASH;
                for(let h = 0; h < Hash.length; h++)
                    Buf.push(Hash[h]);
            }
            if(!SysBuf.length && !BaseBuf.length)
                return global.ZERO_ARR_32;

            let SysHash;
            if(SysBuf.length)
                SysHash = global.sha3(SysBuf);
            else
            {
                SysHash = global.ZERO_ARR_32;
            }
            if(bSysHashOnly)
                return SysHash;

            let BaseHash;
            if(BaseBuf.length)
                BaseHash = global.sha3(BaseBuf);
            else
                BaseHash = global.ZERO_ARR_32;
            if(!SysBuf.length)
                return BaseHash;
            if(!BaseBuf.length)
                return SysHash;
            let Buf2 = SysHash;
            for(let h = 0; h < BaseHash.length; h++)
                Buf2.push(BaseHash[h]);

            let arr = global.sha3(Buf2);
            return arr;
        };
        Engine.CalcHashMaxLiderInner = function (Data,BlockNum)
        {
            if(!Data.DataHash)
                global.ToLogTrace("NO DataHash on block:" + BlockNum);
            global.CalcBlockHashJinn(Data, Data.DataHash, Data.MinerHash, BlockNum, Data.LinkSumHash);
        };
        Engine.SetBlockDataFromDB = function (Block)
        {
            Block.PrevSumPow = Engine.GetPrevSumPowFromDBNum(Block.BlockNum);
            Block.PrevSumHash = Engine.GetPrevSumHashFromDBNum(Block.BlockNum);
            Block.LinkSumHash = Block.PrevSumHash;
        };

        Engine.GetPrevSumPowFromDBNum = function (BlockNum)
        {
            let PrevNum = BlockNum - 1;
            if(PrevNum < 0)
                return 0;
            else
            {
                let PrevBlock = Engine.GetBlockHeaderDB(PrevNum, 1);
                if(PrevBlock)
                    return PrevBlock.SumPow;
                else
                    return 0;
            }
        };

        Engine.GetPrevSumHashFromDBNum = function (BlockNum)
        {
            let PrevNum = BlockNum - 1;
            if(PrevNum <= 0)
                return global.ZERO_ARR_32;
            else
            {
                let PrevBlock = Engine.GetBlockHeaderDB(PrevNum, 1);
                if(PrevBlock)
                    return PrevBlock.SumHash;
                else
                    return global.ZERO_ARR_32;
            }
        };

        Engine.ConvertToTera = function (Block,bBody) {
            if(!Block)
                return;

            if(!Block.LinkSumHash)
                global.ToLogTrace("!Block.LinkSumHash on Block=" + Block.BlockNum);
            if(!Block.MinerHash)
                global.ToLogTrace("!Block.MinerHash on Block=" + Block.BlockNum);
            if(!Block.DataHash)
                ToLogTrace("!Block.DataHash on Block=" + Block.BlockNum);

            if(Block.BlockNum < global.UPDATE_CODE_JINN)
                Block.PrevHash = Block.OldPrevHash8;
            else
                Block.PrevHash = Block.LinkSumHash;

            Block.AddrHash = Block.MinerHash;
            Block.SeqHash = Block.DataHash;

            if(Block.TxData)
                Block.TrDataLen = Block.TxData.length;
            else
            if(Block.TxCount)
                Block.TrDataLen = Block.TxCount;
            else
                Block.TrDataLen = 0;

            if(bBody)
            {
                Engine.ConvertBodyToTera(Block);
            }
        };

        Engine.ConvertFromTera = function (Block,bBody,bCalc) {
            if(!Block)
                return;

            if(!Block.PrevHash)
                ToLogTrace("!Block.PrevHash on Block=" + Block.BlockNum);
            if(!Block.AddrHash)
                ToLogTrace("!Block.AddrHash on Block=" + Block.BlockNum);
            if(!Block.SeqHash)
                ToLogTrace("!Block.SeqHash on Block=" + Block.BlockNum);

            if(Block.BlockNum < global.UPDATE_CODE_JINN)
                Block.OldPrevHash8 = Block.PrevHash;
            else
                Block.OldPrevHash8 = global.ZERO_ARR_32;

            Block.LinkSumHash = Block.PrevHash;
            Block.MinerHash = Block.AddrHash;
            Block.DataHash = Block.SeqHash;

            if(bBody)
            {
                Engine.ConvertBodyFromTera(Block);
            }
            if(bCalc)
            {
                Engine.SetBlockDataFromDB(Block);
            }

            if(Block.BlockNum >= global.UPDATE_CODE_JINN)
            {
                Block.SumHash = Block.Hash;
            }
        };

        Engine.ConvertBodyToTera = function (Block)
        {
            let Arr = [];
            if(Block.TxData)
            {
                for(let i = 0; i < Block.TxData.length; i++)
                {
                    Arr.push(Block.TxData[i].body);
                }
            }
            Block.arrContent = Arr;
        };

        Engine.ConvertBodyFromTera = function (Block)
        {
            let Arr = [];
            if(Block.arrContent)
            {
                for(let i = 0; i < Block.arrContent.length; i++)
                {
                    let Tx = Engine.GetTx(Block.arrContent[i], Block.BlockNum, undefined, 7);
                    Arr.push(Tx);
                }
            }
            Block.TxData = Arr;
        };
    }

    return {
        Init: Init
    };
}
