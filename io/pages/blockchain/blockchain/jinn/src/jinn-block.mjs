
/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/


/**
 * Working with blocks, creating a new block, determining the Genesis of the block
 *
 * The formula for calculating hashes:
 *
 *   LinkSumHash | -----------> DataHash | ---------------->    Hash
 *        +      |                  +    |
 *     TreeHash  |              MinerHash|
 *
 * i.e.:
 * LinkSumHash + TreeHash  = DataHash
 * DataHash + MinerHash    = Hash
 **/


'use strict';

import logs from '../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    const main = -7
    const path = import.meta.url
    const from = path.search('/blockchain');
    const to = path.length;
    const url = path.substring(from,to);
    const count = (typeof maxCount === "string") ? parseInt(maxCount,10): (maxCount < 0)? main: maxCount
    // logs.assert(count, url, id, props, data, ...args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)

    global.JINN_MODULES.push({ InitClass:InitClass, DoNode:DoNode, Name:"Block" });

    function DoNode(Engine) {
        debug(-4,'-------------⏰[(DoNode*)TickNum]',global.PROCESS_NAME, Engine.TickNum)
        Engine.TickNum++;
    }

//Engine context

    function InitClass(Engine)
    {
        Engine.TickNum = 0;

        // Modeling...

        Engine.GenesisArr = [];

        Engine.GetGenesisBlock = function (Num)
        {
            debug(-4,'-------------⏰[(GetGenesisBlock*)Num]', Num)
            if(Engine.GenesisArr[Num])
                return Engine.GenesisArr[Num];

            if(Num >= global.JINN_CONST.BLOCK_GENESIS_COUNT)
            {
                global.ToLogTrace("Error GenesisBlock Num = " + Num);
                return undefined;
            }

            var Block = Engine.GetGenesisBlockInner(Num);
            Engine.GenesisArr[Num] = Block;

            return Block;
        };

        Engine.GetGenesisBlockInner = function (Num)
        {
            debug(-4,'-------------⏰[(GetGenesisBlockInner*)Num]', Num)
            var PrevBlock;
            if(!Num)
                PrevBlock = {Hash:global.ZERO_ARR_32, SumPow:0, SumHash:global.ZERO_ARR_32, };
            else
                PrevBlock = Engine.GetGenesisBlock(Num - 1);

            var Block = {};
            Block.Genesis = 1;
            Block.BlockNum = Num;
            Block.TxData = [];
            Block.LinkSumHash = global.ZERO_ARR_32;
            Block.TreeHash = global.ZERO_ARR_32;
            Block.MinerHash = global.ZERO_ARR_32;
            Block.PrevSumHash = PrevBlock.SumHash;
            Block.PrevSumPow = PrevBlock.SumPow;
            Engine.CalcBlockData(Block);

            return Block;
        };

        Engine.GetCopyBlock = function (Block) {
            debug(-4,'-------------⏰[(GetCopyBlock*)Block]', Block)
            var BlockNew = {};
            BlockNew.BlockNum = Block.BlockNum;
            BlockNew.TreeHash = Block.TreeHash;
            BlockNew.MinerHash = Block.MinerHash;
            BlockNew.TxCount = Block.TxCount;

            BlockNew.PrevSumPow = Block.PrevSumPow;
            BlockNew.PrevSumHash = Block.PrevSumHash;
            BlockNew.PrevBlockPosition = Block.PrevBlockPosition;
            BlockNew.SysTreeHash = Block.SysTreeHash;

            return BlockNew;
        };

        Engine.CopyBodyTx = function (BlockDst,BlockSrc)
        {
            debug(-4,'-------------⏰[(CopyBodyTx*)BlockDst BlockSrc]')
            BlockDst.TreeHash = BlockSrc.TreeHash;
            BlockDst.TxData = BlockSrc.TxData;
            BlockDst.TxCount = BlockSrc.TxCount;
            BlockDst.TxPosition = BlockSrc.TxPosition;
            BlockDst.SysTreeHash = BlockSrc.SysTreeHash;

            return 1;
        };

        Engine.GetNewBlock = function (PrevBlock) {
            debug(-4,'-------------⏰[(GetNewBlock*)PrevBlock]', PrevBlock)
            if(!PrevBlock)
                return undefined;

            if(PrevBlock.BlockNum < global.UPDATE_CODE_JINN)
                return undefined;

            var Block = {};
            Block.BlockNum = PrevBlock.BlockNum + 1;
            Block.PrevSumHash = PrevBlock.SumHash;
            Block.PrevSumPow = PrevBlock.SumPow;
            Engine.FillBodyFromTransfer(Block);
            Block.MinerHash = global.ZERO_ARR_32;

            Engine.CalcBlockData(Block);

            return Block;
        };

        // Serylizing...

        Engine.HeaderFromBlock = function (Block)
        {
            debug(-4,'-------------⏰[(HeaderFromBlock*)Block]', Block)
            if(!Block)
                return undefined;

            if(Block.BlockNum >= global.JINN_CONST.BLOCK_GENESIS_COUNT && global.IsZeroArr(Block.PrevSumHash))
                ToLog("ZeroArr PrevSumHash on BlockNum=" + Block.BlockNum);
            var Data = {BlockNum:Block.BlockNum, LinkSumHash:Block.PrevSumHash, TreeHash:Block.TreeHash, MinerHash:Block.MinerHash, PrevSumPow:Block.PrevSumPow,
                PrevSumHash:Block.PrevSumHash, OldPrevHash8:Block.OldPrevHash8, SysTreeHash:Block.SysTreeHash, Size:5 * 33 + 4 + 6, };

            return Data;
        };

        Engine.BodyFromBlock = function (Block)
        {
            debug(-4,'-------------⏰[(BodyFromBlock*)Block]', Block)
            if(!global.IsZeroArr(Block.TreeHash) && (!Block.TxData || Block.TxData.length === 0))
                global.ToLogTrace("BodyFromBlock : Error block tx data TreeHash=" + Block.TreeHash + " on block: " + Block.BlockNum);

            var Data = {BlockNum:Block.BlockNum, TreeHash:Block.TreeHash, PrevSumHash:Block.PrevSumHash, TxData:Block.TxData, };

            var Size = 10;
            for(var i = 0; i < Data.TxData.length; i++)
            {
                Size += Data.TxData[i].body.length;
            }
            Data.Size = Size;

            return Data;
        };

        Engine.CalcTreeHash = function (BlockNum,TxArr)
        {
            debug(-4,'-------------⏰[(CalcTreeHash*) BlockNum,TxArr]')
            if(!TxArr || !TxArr.length)
                return global.ZERO_ARR_32;
            return Engine.CalcTreeHashInner(BlockNum, TxArr);
        };

        Engine.CalcTreeHashInner = function (BlockNum,TxArr)
        {
            debug(-4,'-------------⏰[(CalcTreeHashInner*) BlockNum,TxArr]')
            var Buf = [];
            for(var n = 0; TxArr && n < TxArr.length; n++)
            {
                var Tx = TxArr[n];

                if(!CheckTx("=CalcTreeHash=", Tx, BlockNum, 0))
                {
                    return global.ZERO_ARR_32;
                }

                var Hash = Tx.HASH;
                for(var h = 0; h < Hash.length; h++)
                    Buf.push(Hash[h]);
            }

            if(!Buf.length)
                return global.ZERO_ARR_32;

            var arr = global.sha3(Buf, 4);
            return arr;
        };

        Engine.CheckHashExistArr = function (Arr,BlockNum)
        {
            debug(-4,'-------------⏰[(CheckHashExistArr*) Arr,BlockNum]')
            if(!Arr)
                return;

            var LastBlockNumMain = Engine.GetMaxNumBlockDB();

            var ArrErr = Engine.GetArrErrTx(BlockNum);
            var TreeTTAll = Engine.GetTreeTicketAll(BlockNum);
            for(var i = 0; i < Arr.length; i++)
            {
                var Tx = Arr[i];
                if(Tx.OperationID === undefined)
                {
                    Engine.CheckHashExist(Tx, BlockNum);
                    Tx.OperationID = Engine.GetTxSenderOperationID(Tx, BlockNum);
                    if(global.JINN_CONST.TX_PRIORITY_MODE || global.JINN_CONST.TX_CHECK_SIGN_ON_TRANSFER)
                        Tx.SenderNum = Engine.GetTxSenderNum(Tx, BlockNum);
                    if(global.JINN_CONST.TX_BASE_VALUE)
                    {
                        Tx.BaseValue = Engine.GetAccountBaseValue(Tx.SenderNum, BlockNum);
                    }
                    if(global.JINN_CONST.TX_PRIORITY_MODE)
                        Tx.CountTX = Engine.GetTxSenderCount(Tx.SenderNum);
                }
                if(BlockNum <= LastBlockNumMain)
                    continue;

                Engine.DoCheckErrTx(Tx, BlockNum, TreeTTAll, ArrErr);

                if(Tx.ErrSign || Tx.ErrOperationID)
                {
                    ToLog("Remove error tx at " + i + " on Block:" + BlockNum + " - " + Tx.ErrSign + ":" + Tx.ErrOperationID, 3);

                    Arr.splice(i, 1);
                    i--;
                    continue;
                }
            }
        };

        Engine.SortBlock = function (Block)
        {
            debug(-4,'-------------⏰[(SortBlock*) Block]', Block)

            if(!Block || !Block.TxData || Block.TxData.length <= 1)
                return;

            Engine.CheckHashExistArr(Block.TxData, Block.BlockNum);
            Block.TxData.sort(function (a,b)
            {
                if(typeof a.OperationID !== "number")
                    global.ToLogTrace("Error type a.OperationID");
                if(typeof b.OperationID !== "number")
                    global.ToLogTrace("Error type b.OperationID");
                if(!a.HASH)
                    global.ToLogTrace("Error a.HASH");
                if(!b.HASH)
                    global.ToLogTrace("Error b.HASH");

                if(a.OperationID !== b.OperationID)
                    return a.OperationID - b.OperationID;
                return CompareArr(a.HASH, b.HASH);
            });
        };

        Engine.CalcBlockData = function (Block)
        {
            debug(-4,'-------------⏰[(CalcBlockData*) Block]', Block)
            Engine.CalcBlockHash(Block);
            Engine.CalcSumHash(Block);

            Block.Miner = global.ReadUintFromArr(Block.MinerHash, 0);

            if(Engine.CheckMaxHashReceive)
                Engine.CheckMaxHashReceive(Block);
        };

        Engine.CalcBlockHash = function (Block)
        {
            debug(-4,'-------------⏰[(CalcBlockHash*) Block]', Block)

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

            if(Block.PrevSumPow === undefined)
                global.ToLogTrace("Error No Block.PrevSumPow on Block=" + Block.BlockNum);

            Block.DataHash = Engine.CalcDataHashInner(Block);

            if(Block.BlockNum < global.JINN_CONST.BLOCK_GENESIS_COUNT)
            {
                Block.Hash = global.ZERO_ARR_32.slice();
                Block.Hash[0] = 1 + Block.BlockNum;
                Block.Hash[31] = Block.Hash[0];
            }
            else
            {
                Block.Hash = Engine.CalcBlockHashInner(Block);
            }
            Block.PowHash = Block.Hash;

            Block.Power = global.GetPowPower(Block.PowHash);
            Block.SumPow = Block.PrevSumPow + Block.Power;
        };

        Engine.CalcDataHashInner = function (Block)
        {
            debug(-4,'-------------⏰[(CalcDataHashInner*) Block]', Block)
            if(Block.PrevSumPow === undefined)
                global.ToLogTrace("Error No Block.PrevSumPow on Block=" + Block.BlockNum);

            return global.sha3(Block.LinkSumHash.concat(Block.TreeHash).concat(global.GetArrFromValue(Block.PrevSumPow)), 5);
        };

        Engine.CalcBlockHashInner = function (Block)
        {
            debug(-4,'-------------⏰[(CalcBlockHashInner*) Block]', Block)
            return global.sha3(Block.DataHash.concat(Block.MinerHash).concat(global.GetArrFromValue(Block.BlockNum)), 6);
        };

        Engine.CalcSumHash = function (Block)
        {
            debug(-4,'-------------⏰[(CalcSumHash*) Block]', Block)
            Block.SumHash = Block.Hash;
        };

        Engine.CheckHashExist = function (Tx,BlockNum)
        {
            debug(-4,'-------------⏰[(CheckHashExist*) Tx,BlockNum]')
            if(!Tx.HASH)
            {
                var Tx2 = Engine.GetTx(Tx.body, BlockNum, undefined, 10);
                global.CopyObjKeys(Tx, Tx2);
            }
        };

        Engine.DoTxFromTicket = function (Tt,Item)
        {
            debug(-4,'-------------⏰[(DoTxFromTicket*) Tt,Item]')
            Tt.IsTx = Item.IsTx;
            Tt.HASH = Item.HASH;
            Tt.body = Item.body;
        };

        Engine.GetTicket = function (HashTicket)
        {
            debug(-4,'-------------⏰[(GetTicket*) HashTicket]', HashTicket)
            var Key = global.GetHexFromArr(HashTicket);
            var Tx = {HashTicket:HashTicket, KEY:Key};
            return Tx;
        };

        Engine.GetTx = function (body,BlockNum,HASH)
        {
            debug(-4,'-------------⏰[(GetTx*) body,BlockNum,HASH]')
            var Tx = {};
            Tx.IsTx = 1;
            if(HASH)
                Tx.HASH = HASH;
            else
                Tx.HASH = global.sha3(body, 9);

            Tx.HashTicket = Tx.HASH.slice(0, global.JINN_CONST.TT_TICKET_HASH_LENGTH);
            Tx.KEY = global.GetHexFromArr(Tx.HashTicket);
            Tx.body = body;

            return Tx;
        };
    }

    function NeedLoadBodyFromNet(Block)
    {

        debug(-4,'-------------⏰[(NeedLoadBodyFromNet*) Block]', Block)
        if(global.IsZeroArr(Block.TreeHash))
            return 0;

        if(Block.TxPosition)
            return 0;

        if(Block.TxData)
            return 0;

        return 1;
    }

    function NeedLoadBodyFromDB(Block)
    {
        debug(-4,'-------------⏰[(NeedLoadBodyFromDB*) Block]', Block)
        if(global.IsZeroArr(Block.TreeHash))
            return 0;

        if(Block && !Block.TxData && Block.TxPosition)
            return 1;
        return 0;
    }

    function CalcAvgSumPow(Block)
    {
        debug(-4,'-------------⏰[(CalcAvgSumPow*) Block]', Block)
        Block.AvgSumPow = Block.SumPow / Block.BlockNum;
    }
    function GetPowPowerBlock(BlockNum,arrhash)
    {
        debug(-4,'-------------⏰[(GetPowPowerBlock*) BlockNum,arrhash]')
        var Power = global.GetPowPower(arrhash);
        return Power;
    }

    global.GetPowPowerBlock = GetPowPowerBlock;
    global.CalcAvgSumPow = CalcAvgSumPow;
    global.NeedLoadBodyFromNet = NeedLoadBodyFromNet;
    global.NeedLoadBodyFromDB = NeedLoadBodyFromDB;

    global.BlockInfo = function (Block)
    {
        debug(-4,'-------------⏰[(BlockInfo*) Block]', Block)
        if(!Block)
            return "{}";

        if(!Block.MinerHash)
            Block.MinerHash = global.ZERO_ARR_32;
        if(!Block.Power)
            Block.Power = 0;
        Block.Miner = ReadUintFromArr(Block.MinerHash, 0);
        return "{" + Block.BlockNum + " M:" + Block.Miner + " Tx:" + (Block.TxData ? Block.TxData.length : 0) + " Pow:" + Block.Power + "}";
    }
}
