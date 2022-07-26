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

    global.MAX_DELTA_TX = 5;

    function Init(Engine)
    {
        Engine.FillBodyFromTransferNext = function (Block)
        {
            let Arr = global.GET_DAPP_TRANSACTIONS(Block);
            if(Arr.length)
            {
                for(let i = 0; i < Arr.length; i++)
                    Block.TxData.unshift(undefined);

                for(let i = 0; i < Arr.length; i++)
                {
                    let Tx = Engine.GetTx(Arr[i].body, Block.BlockNum, undefined, 8);
                    let TreeTTAll = Engine.GetTreeTicketAll(Block.BlockNum);
                    let TxAdd = Engine.AddToTreeWithAll(TreeTTAll, Tx);
                    if(!TxAdd)
                        TxAdd = Tx;
                    Block.TxData[i] = TxAdd;
                }

                Block.SysTreeHash = Engine.CalcBaseSysTreeHash(Block.BlockNum, Block.TxData, 1);
            }
            else
            {
                Block.SysTreeHash = global.ZERO_ARR_32;
            }
        };

        Engine.AddToMiningInner = function (Block)
        {
            let CurBlockNum = Engine.CurrentBlockNum;
            if(global.USE_MINING || global.USE_API_MINING)
            {
                let Delta = CurBlockNum - Block.BlockNum;
                ToLog("Run mining BlockNum=" + Block.BlockNum + ", Delta=" + Delta, 5);

                Engine.ConvertToTera(Block);

                global.SetCalcPOW(Block, "FastCalcBlock");
            }
        };

        global.SERVER.MiningProcess = function (msg,bExtern)
        {
            let MiningBlock;
            let PrevHash = msg.PrevHash;
            let DataHash = msg.SeqHash;
            let MinerHash = msg.AddrHash;

            let bWas = 0;
            let bFind = 0;
            let Arr = Engine.MiningBlockArr[msg.BlockNum];
            for(let i = 0; Arr && i < Arr.length; i++)
            {
                let Block = Arr[i];
                if(global.IsEqArr(DataHash, Block.DataHash) && global.IsEqArr(PrevHash, Block.PrevHash))
                {
                    bFind = 1;
                    let MinerHashArr = Block.MinerHash.slice(0);
                    if(DoBestMiningArr(Block, MinerHash, MinerHashArr))
                    {
                        MiningBlock = Engine.GetCopyBlock(Block);
                        MiningBlock.PrevHash = PrevHash;
                        MiningBlock.MinerHash = MinerHashArr;
                        Engine.CalcBlockData(MiningBlock);

                        bWas = 2;
                        Engine.AddFromMining(MiningBlock);
                        break;
                    }
                }
            }

            if(!bFind)
            {
                let PrevBlock = Engine.DB.FindBlockByHash(msg.BlockNum - 1, PrevHash);
                if(PrevBlock)
                {
                    MiningBlock = Engine.GetNewBlock(PrevBlock);
                    MiningBlock.PrevHash = PrevHash;
                    MiningBlock.MinerHash = MinerHash;
                    Engine.CalcBlockData(MiningBlock);

                    if(!global.IsEqArr(DataHash, MiningBlock.DataHash))
                    {
                        ToLog("Bad DataHash after mining and recreate new block", 3);
                        return;
                    }

                    bWas = 1;

                    Engine.AddFromMining(MiningBlock);
                }
            }

            if(bWas && MiningBlock && !bExtern)
            {
                Engine.ToLog("Mining Block = " + BlockInfo(MiningBlock) + " Total=" + (msg.TotalCount / 1000000) + " M Power=" + MiningBlock.Power + "  Mode=" + bWas,
                    5);

                global.ADD_TO_STAT("MAX:POWER", MiningBlock.Power);
                let HashCount = Math.pow(2, MiningBlock.Power);
                ADD_HASH_RATE(HashCount);
            }
        };

        function DoBestMiningArr(Block,MinerHashMsg,MinerHashArr)
        {

            let ValueOld = GetHashFromSeqAddr(Block.DataHash, Block.MinerHash, Block.BlockNum, Block.PrevHash);
            let ValueMsg = GetHashFromSeqAddr(Block.DataHash, MinerHashMsg, Block.BlockNum, Block.PrevHash);

            let bWas = 0;
            if(CompareArr(ValueOld.Hash1, ValueMsg.Hash1) > 0)
            {

                let Nonce1 = ReadUintFromArr(MinerHashMsg, 12);
                let DeltaNum1 = ReadUint16FromArr(MinerHashMsg, 24);
                global.WriteUintToArrOnPos(MinerHashArr, Nonce1, 12);
                WriteUint16ToArrOnPos(MinerHashArr, DeltaNum1, 24);

                bWas += 1;
            }
            if(CompareArr(ValueOld.Hash2, ValueMsg.Hash2) > 0)
            {

                let Nonce0 = ReadUintFromArr(MinerHashMsg, 6);
                let Nonce2 = ReadUintFromArr(MinerHashMsg, 18);
                let DeltaNum2 = ReadUint16FromArr(MinerHashMsg, 26);
                global.WriteUintToArrOnPos(MinerHashArr, Nonce0, 6);
                global.WriteUintToArrOnPos(MinerHashArr, Nonce2, 18);
                WriteUint16ToArrOnPos(MinerHashArr, DeltaNum2, 26);

                bWas += 2;
            }

            return bWas;
        };

        Engine.PrepareSystemTx = function ()
        {
            let BlockNum = Engine.CurrentBlockNum - 1;
            let TXBlockNum = global.COMMON_ACTS.GetLastBlockNumActWithReopen();
            if(TXBlockNum <= BlockNum - global.MAX_DELTA_TX)
                return;

            if(Engine.WasPrepareSystemTxBlockNum === BlockNum)
                return;
            Engine.WasPrepareSystemTxBlockNum = BlockNum;
            let TxAccHash = global.ACCOUNTS.GetAccountHashTx(BlockNum);
            if(TxAccHash)
            {
                let Tx = Engine.GetTx(TxAccHash.body, BlockNum);
                Engine.AddCurrentProcessingTx(BlockNum, [Tx], 1);
            }
        };
    }

    return {
        init:Init
    };
}