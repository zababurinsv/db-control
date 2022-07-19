/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

/**
 *
 * The entry in the database (the base class, DB emulation)
 *
**/
'use strict';

import logs from '../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    let path = import.meta.url
    let from = path.search('/jinn');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-6,url, id, props, data, ...args)
}
export default (global) => {
debug(-6,'☯[(self)a]', global.PROCESS_NAME)

    global.JINN_MODULES.push({ InitClass:InitClass, InitAfter:InitAfter, DoNode:DoNode, Name:"BlockDB" });

    let BWRITE_MODE = (global.PROCESS_NAME === "MAIN");

//Engine context

    function InitClass(Engine) {
        Engine.InitDB = function () {
            debug(-6,'☯[(InitDB*)Engine]', Engine)
            if(BWRITE_MODE) {
                Engine.DB = new global.CDBBlockCache(Engine.ID, Engine.CalcBlockData);
            } else {
                Engine.DB = new global.CDBBodyCache(Engine.ID, Engine.CalcBlockData);
            }

            Engine.DB.OnSaveMainDB = Engine.OnSaveMainDB;
            Engine.DB.InvalidateBufferMainDB = Engine.InvalidateBufferMainDB;
        };

        Engine.Close = function () {
            Engine.DB.Close();
        };

        Engine.WriteGenesisDB = function () {
            debug(-6,'WriteGenesisDB☯[(Engine)global.JINN_CONST.BLOCK_GENESIS_COUNT]', global.JINN_CONST.BLOCK_GENESIS_COUNT)
            for(let Num = 0; Num < global.JINN_CONST.BLOCK_GENESIS_COUNT; Num++)
            {
                let Block = Engine.GetGenesisBlock(Num);
                Engine.SaveToDB(Block, 0, 1);
            }
        };

        Engine.OnSaveMainDB = function (Block) {

        };

        Engine.InvalidateBufferMainDB = function (Block) {

        };

        Engine.GetBlockDB = function (BlockNum) {
            let Block = Engine.GetBlockHeaderDB(BlockNum);
            Engine.CheckLoadBody(Block);
            debug(-6,'GetBlockDB☯[(Engine)GetBlockHeaderDB]', BlockNum)
            return Block;
        };

        Engine.GetBlockHeaderDB = function (BlockNum,bMustHave) {
            let Block = Engine.GetBlockHeaderDBNext(BlockNum);
            if(!Block && bMustHave)
            {
                global.ToLogTrace("Error find block in DB on Num = " + BlockNum);
                let Block2 = Engine.GetBlockHeaderDBNext(BlockNum);
            }
            return Block;
        };

        Engine.GetBlockHeaderDBNext = function (BlockNum) {
            let MaxNum = Engine.GetMaxNumBlockDB();
            if(BlockNum > MaxNum)
                return undefined;

            let Block = Engine.DB.ReadBlockMain(BlockNum);
            return Block;
        };

        Engine.SaveToDB = function (Block) {
            Block.BlockNum = Math.floor(Block.BlockNum);
            let MaxNumDB = Engine.GetMaxNumBlockDB();
            if(global.TEST_DB_BLOCK) {
                let BlockNum = Block.BlockNum;

                if(BlockNum > MaxNumDB + 1) {
                    global.ToLogTrace("Error SaveToDB Block.BlockNum>MaxNumDB+1   BlockNum=" + BlockNum + "  MaxNumDB=" + MaxNumDB);
                    return false;
                }

                if(!global.IsZeroArr(Block.TreeHash) && !Block.TxData && !Block.TxPosition) {
                    global.ToLogTrace("B=" + BlockNum + " SaveError Block TxPosition=" + Block.TxPosition);
                    return 0;
                }

                if(BlockNum > 0) {
                    let PrevBlock = Engine.GetBlockHeaderDB(BlockNum - 1, 1);
                    if(!PrevBlock)
                    {
                        global.ToLogTrace("SaveToDB: Error PrevBlock on Block=" + BlockNum);
                        let PrevBlock2 = Engine.GetBlockHeaderDB(BlockNum - 1, 1);
                        return 0;
                    }
                    if(PrevBlock.BlockNum !== BlockNum - 1)
                    {
                        global.ToLogTrace("SaveToDB: Error PrevBlock.BlockNum on Block=" + BlockNum);
                        return 0;
                    }
                    let SumPow = Block.PrevSumPow + Block.Power;
                    if(Block.SumPow !== SumPow)
                    {
                        let Str = "SaveToDB: Error Sum POW: " + Block.SumPow + "/" + SumPow + " on block=" + BlockNum;
                        Engine.ToLog(Str);
                        return 0;
                    }
                    if(!global.IsEqArr(Block.PrevSumHash, PrevBlock.SumHash))
                    {
                        let Str = "SaveToDB: Error PrevSumHash: " + Block.PrevSumHash + "/" + PrevBlock.SumHash + " on block=" + BlockNum;
                        global.ToLogTrace(Str);
                        return 0;
                    }
                }
            }

            let Result = Engine.WriteBlockDBInner(Block);
            return Result;
        };

        Engine.WriteBlockDBInner = function (Block) {
            global.JINN_STAT.MainDelta = Math.max(global.JINN_STAT.MainDelta, Engine.CurrentBlockNum - Block.BlockNum);
            Engine.ResendBlockNum = Math.min(Engine.ResendBlockNum, Block.BlockNum);

            return Engine.DB.WriteBlockMain(Block);
        };

        Engine.TruncateChain = function (LastBlockNum) {
            Engine.DB.TruncateChain(LastBlockNum);
            Engine.MaxLiderList = {};
        };

        Engine.TruncateMain = function (LastBlockNum) {
            Engine.DB.TruncateMain(LastBlockNum);
        };

        Engine.GetMaxNumBlockDB = function () {
            return Engine.DB.GetMaxNumBlockDB();
        };

        Engine.GetMaxNumChain = function () {
            return Engine.DB.GetMaxIndex();
        };

        Engine.CheckLoadBody = function (Block) {
            if(!Block)
                return;

            if(global.NeedLoadBodyFromDB(Block))
            {
                Engine.DB.LoadBlockTx(Block);
            }
            let Count = 0;
            for(let i = 0; Block.TxData && i < Block.TxData.length; i++)
            {
                let Item = Block.TxData[i];
                if(Item.HASH)
                    break;
                let Tx = Engine.GetTx(Item.body, Block.BlockNum, undefined, 5);
                Block.TxData[i] = Tx;
                CheckTx("GetBlock", Tx, Block.BlockNum);
                Count++;
            }
        };

        Engine.ClearDataBase = function ()
        {
            Engine.ToLog("START CLEARDATABASE");

            Engine.MaxLiderList = {};
            Engine.Header1 = 0;
            Engine.Header2 = 0;
            Engine.Block1 = 0;
            Engine.Block2 = 0;

            Engine.BAN_IP = {};
            Engine.TestLoadMap = {};

            if(Engine.DB)
                Engine.DB.Clear();

            Engine.InitDB();
            Engine.InitBlockList();

            Engine.GenesisArr = [];

            Engine.WriteGenesisDB();
            for(let i = 0; i < Engine.LevelArr.length; i++)
            {
                let Child = Engine.LevelArr[i];
                if(Child)
                {

                    Child.LastTransferTime = Date.now();
                    Child.FirstTransferTime = Date.now();
                }
            }
        };
    }

    function DoNode(Engine)
    {

        if(Engine.TickNum % 10 === 0)
        {
            Engine.DB.DoNode();
        }

        Engine.ResizeDBChain = function ()
        {
            if(!BWRITE_MODE)
            {
                ToLog("Error: DB not in write mode");
                return 0;
            }

            let DB2 = new CDBChain(Engine.ID, Engine.CalcBlockData, "_");
            DB2.Clear();

            let EndNum = Engine.GetMaxNumBlockDB();
            for(let BlockNum = 0; BlockNum < EndNum; BlockNum++)
            {
                let Block = Engine.GetBlockDB(BlockNum);
                Block.Position = undefined;
                Block.TxPosition = undefined;

                let Res1 = DB2.WriteBlock(Block);
                let Res2 = DB2.WriteBlockMain(Block);
                if(!Res1 || !Res2)
                {
                    console.log("Error write on block: " + BlockNum);
                    return 0;
                }

                if(BlockNum % 100000 === 0)
                    console.log("DONE: " + BlockNum);
            }

            StopAndExit("ResizeDBChain " + DB2.GetMaxNumBlockDB());

            return DB2.GetMaxNumBlockDB();
        };

        Engine.ReOrganizationDBChain = function ()
        {
            if(global.NETWORK === "MAIN-JINN")
            {
                ToLog("Error: NETWORK");
                return 0;
            }

            if(!BWRITE_MODE)
            {
                ToLog("Error: DB not in write mode");
                return 0;
            }

            let DB2 = new global.CDBChain(Engine.ID, Engine.CalcBlockData, "_");
            DB2.Clear();

            let EndNum = Engine.GetMaxNumBlockDB();
            let PrevBlock, BlockNumNew;
            for(let BlockNum = 0; BlockNum < EndNum; BlockNum++)
            {
                let Block = Engine.GetBlockDB(BlockNum);

                if(BlockNum < 16 || (Block.TxCount > 1 || Block.TxCount === 1 && Block.TxData[0].body[0] !== 210))
                {
                    let BlockNew;
                    if(BlockNum < 16)
                    {
                        BlockNew = Block;
                        BlockNumNew = BlockNum;
                    }
                    else
                    {
                        BlockNumNew++;
                        BlockNew = {};
                        BlockNew.BlockNum = BlockNumNew;
                        BlockNew.TxData = Block.TxData;
                        BlockNew.LinkSumHash = global.ZERO_ARR_32;
                        BlockNew.TreeHash = global.ZERO_ARR_32;
                        BlockNew.MinerHash = global.ZERO_ARR_32;
                        BlockNew.PrevSumHash = PrevBlock.SumHash;
                        BlockNew.PrevSumPow = PrevBlock.SumPow;

                        BlockNew.TxCount = BlockNew.TxData.length;
                        BlockNew.TreeHash = Engine.CalcTreeHash(BlockNew.BlockNum, BlockNew.TxData);

                        Engine.CalcBlockData(BlockNew);
                    }
                    BlockNew.Position = undefined;
                    BlockNew.TxPosition = undefined;

                    let Res1 = DB2.WriteBlock(BlockNew);
                    let Res2 = DB2.WriteBlockMain(BlockNew);
                    if(!Res1 || !Res2)
                    {
                        console.log("Error write on block: " + BlockNum);
                        return 0;
                    }
                    PrevBlock = BlockNew;
                }

                if(BlockNum % 10000 === 0)
                    console.log("DONE: " + BlockNum);
            }

            StopAndExit("***************** STOP ReOrganizationDBChain " + DB2.GetMaxNumBlockDB());

            return DB2.GetMaxNumBlockDB();
        };
    }

    function InitAfter(Engine)
    {
        Engine.InitDB();
    }
    function GetCopyObj(Obj)
    {
        let Obj2 = {};
        for(let key in Obj)
            Obj2[key] = Obj[key];
        return Obj2;
    }
}
