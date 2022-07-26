/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

"use strict";
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

    global.VIRTUAL_TYPE_TX_START = 200;


    global.TYPE_TRANSACTION_SYS_TX_BUNDLE = 200;
    global.FORMAT_SYS_TX_BUNDLE = {Type:"byte", TxData:[{body:"tr"}], };
    global.WorkStructSysTxBundle = {};

    function Init(Engine)
    {
        Engine.SysTreeBundleTx = new global.CBlockCache(function (a,b)
        {
            return global.CompareArr(a.Hash, b.Hash);
        });
        Engine.SysTreeTx = new global.CBlockCache(function (a,b)
        {
            return global.CompareArr(a.HashTicket, b.HashTicket);
        });

        Engine.IsVirtualTypeTx = function (Type)
        {
            if(Type >= global.VIRTUAL_TYPE_TX_START)
                return 1;

            return 0;
        };

        Engine.RunVTX = function (Tx,BlockNum,bInner)
        {
            if(Tx.IsTx)
            {
                let Type = Tx.body[0];
                switch(Type) {
                    case global.TYPE_TRANSACTION_SYS_TX_BUNDLE:
                        Engine.RunSysTxBundle(Tx, BlockNum, bInner);
                        break;
                }
            }
        };

        Engine.PrepareAndSendSysTx = function ()
        {
            let BlockNum = Engine.CurrentBlockNum - 1;
            if(Engine.WasPrepareAndSendSysTx === BlockNum)
                return;

            let Arr = Engine.DoSendingCrossArr(BlockNum);
            if(typeof Arr !== "object")
            {
                return;
            }

            let TxAcc = global.ACCOUNTS.GetAccountHashTx(BlockNum);
            if(TxAcc)
            {
                Arr.push(TxAcc);
            }
            Engine.WasPrepareAndSendSysTx = BlockNum;

            if(Arr.length)
            {
                let Bundle = Engine.CreateSysBundle(BlockNum, Arr);
                let ItemTx = Engine.GetTx(Bundle._Body, BlockNum);

                let TxArr = [];

                let Find = Engine.SysTreeBundleTx.FindItemInCache(Bundle);
                if(Find)
                {
                    let FreashBlockNum = Engine.CurrentBlockNum - JINN_CONST.STEP_CLEAR_MEM + 5;
                    if(Find.BlockNum > FreashBlockNum)
                    {
                        ItemTx = undefined;
                    }
                }

                if(ItemTx)
                {
                    TxArr.push(ItemTx);
                }

                Engine.AddCurrentProcessingTx(BlockNum, TxArr, 1);
            }
        };

        Engine.CalcSysBundleHash = function (Bundle)
        {
            for(let i = 0; i < Bundle.TxData.length; i++)
                Bundle.TxData[i] = Engine.GetTx(Bundle.TxData[i].body, Bundle.BlockNum);

            Bundle.Hash = Engine.CalcBaseSysTreeHash(Bundle.BlockNum, Bundle.TxData, 1);
        };

        Engine.CreateSysBundle = function (BlockNum,Arr)
        {
            let Bundle = {Type:TYPE_TRANSACTION_SYS_TX_BUNDLE, TxData:Arr, };
            Bundle._Body = global.SerializeLib.GetBufferFromObject(Bundle, global.FORMAT_SYS_TX_BUNDLE, global.WorkStructSysTxBundle);

            Bundle.BlockNum = BlockNum;
            Bundle.bInner = 1;
            Engine.CalcSysBundleHash(Bundle);
            return Bundle;
        };

        Engine.RunSysTxBundle = function (Tx,BlockNum,bInner)
        {

            let Bundle = global.SerializeLib.GetObjectFromBuffer(Tx.body, global.FORMAT_SYS_TX_BUNDLE, global.WorkStructSysTxBundle);
            Bundle.BlockNum = BlockNum;
            Bundle.bInner = bInner;
            Engine.CalcSysBundleHash(Bundle);

            Engine.SysTreeBundleTx.AddItemToCache(Bundle);
            for(let i = 0; i < Bundle.TxData.length; i++)
            {
                let Tx = Bundle.TxData[i];
                Tx.BlockNum = BlockNum;

                Engine.SysTreeTx.AddItemToCache(Tx);
            }
        };

        Engine.GetMaxBlockFromDBChain = function (BlockNew)
        {
            let BlockNum = BlockNew.BlockNum;
            let MaxBlock = undefined;
            let ArrBlock = Engine.DB.GetChainArrByNum(BlockNum);
            ArrBlock.sort(function (a,b)
            {
                if(b.SumPow !== a.SumPow)
                    return b.SumPow - a.SumPow;
                return global.CompareArr(b.PowHash, a.PowHash);
            });
            for(let n = 0; n < ArrBlock.length; n++)
            {
                let CurBlock = ArrBlock[n];

                if(!MaxBlock || (MaxBlock.SumPow < CurBlock.SumPow || (MaxBlock.SumPow === CurBlock.SumPow && global.CompareArr(CurBlock.PowHash,
                    MaxBlock.PowHash) < 0)))
                {
                    if(Engine.IsFullLoadedBlock(CurBlock, MAX_BLOCK_RECALC_DEPTH))
                    {
                        MaxBlock = CurBlock;
                        continue;
                    }
                    if(global.IsEqArr(CurBlock.PrevSumHash, BlockNew.PrevSumHash))
                    {
                        if(global.IsEqArr(CurBlock.TreeHash, BlockNew.TreeHash))
                        {
                            MaxBlock = CurBlock;
                            continue;
                        }

                        let Bundle = undefined;
                        if(CurBlock.SysTreeHash && !global.IsZeroArr(CurBlock.SysTreeHash))
                        {
                            Bundle = Engine.SysTreeBundleTx.FindItemInCache({Hash:CurBlock.SysTreeHash});
                            if(!Bundle)
                            {
                                ToLogOne("Not find bundle: " + global.GetHexFromArr8(CurBlock.SysTreeHash) + " Block:" + BlockInfo(CurBlock), "", 3);
                                continue;
                            }
                        }
                        else
                        {
                        }
                        let CurBlock2 = Engine.CreateBlockTxDataFromBundle(BlockNew, Bundle);
                        if(global.IsEqArr(CurBlock.TreeHash, CurBlock2.TreeHash))
                        {
                            Engine.CopyBodyTx(CurBlock, CurBlock2);

                            MaxBlock = CurBlock;
                            continue;
                        }
                        else
                        {
                            if(!global.IsZeroArr(CurBlock.SysTreeHash))
                                ToLog("Got not correct SysTreeHash=" + global.GetHexFromArr8(CurBlock.SysTreeHash) + " TreeHash=" + global.GetHexFromArr8(CurBlock2.TreeHash) + " need=" + global.GetHexFromArr8(CurBlock.TreeHash) + " Block:" + BlockInfo(CurBlock),
                                    3);
                        }
                    }
                }
            }
            return MaxBlock;
        };

        Engine.CreateBlockTxDataFromBundle = function (BaseBlock,Bundle)
        {
            let Block = {BlockNum:BaseBlock.BlockNum};

            Block.TxData = [];
            if(Bundle)
            {

                for(let i = 0; i < Bundle.TxData.length; i++)
                {
                    let Tx = Bundle.TxData[i];
                    Block.TxData.push(Tx);
                }
            }

            for(let i = 0; i < BaseBlock.TxData.length; i++)
            {
                let Tx = BaseBlock.TxData[i];
                if(Engine.IsVirtualTypeTx(Tx.body[0]))
                    continue;

                Block.TxData.push(Tx);
            }
            Block.TxCount = Block.TxData.length;
            Block.TreeHash = Engine.CalcTreeHash(Block.BlockNum, Block.TxData);

            return Block;
        };
    }

    return  {
        init:Init
    };
}
