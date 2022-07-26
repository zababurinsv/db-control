/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

'use strict';

import logs from '../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    const main = -7
    const path = import.meta.url
    const from = path.search('/blockchain');
    const to = path.length;
    const url = path.substring(from,to);
    const count = (typeof maxCount === "string") ? parseInt(maxCount,10): (maxCount < 0)? main: maxCount
    logs.assert(count, url, id, props, data, ...args)
}

export default (global) => {
debug(-4, ' ⏬ [(self)a]', global.PROCESS_NAME)

    function Init(Engine)
    {
        debug(-2, ' ⏬ [(server)Init]')
        global.SERVER = {};
        global.SERVER.CheckOnStartComplete = 1;
        global.SERVER.BlockNumDBMin = 0;
        Object.defineProperty(global.SERVER, "BlockNumDB", {
            set:function (x) { },
            get:function (x) {
                return Engine.GetMaxNumBlockDB();
            },
        });

        function GetBlockNumTx(arr) {
            var BlockNum = GetCurrentBlockNumByTime(0);
            if(arr[0] === global.TYPE_TRANSACTION_CREATE && global.JINN_CONST.BLOCK_CREATE_INTERVAL > 1)
            {
                var BlockNum2 = Math.floor(BlockNum / global.JINN_CONST.BLOCK_CREATE_INTERVAL) * global.JINN_CONST.BLOCK_CREATE_INTERVAL;
                if(BlockNum2 < BlockNum)
                    BlockNum2 = BlockNum2 + global.JINN_CONST.BLOCK_CREATE_INTERVAL;
                BlockNum = BlockNum2;
            }

            return BlockNum;
        }

        global.SERVER.AddTransactionInner = function (Tx0) {
            Engine.OnAddTransactionInner(Tx0);

            if(!global.USE_MINING && !global.SERVER.GetHotNodesCount())
                return TX_RESULT_NOCONNECT;
            var Body = Tx0.body;
            var BlockNum = GetBlockNumTx(Body);

            var Tx = Engine.GetTx(Body, BlockNum, undefined, 6);

            if(global.JINN_CONST.TX_CHECK_OPERATION_ID)
            {
                Engine.DoCheckTxOperationID(Tx, BlockNum);
                if(Tx.ErrOperationID)
                    return TX_RESULT_OPERATION_ID;
            }

            if(global.JINN_CONST.TX_CHECK_SIGN_ON_ADD)
            {
                Engine.DoCheckTxSign(Tx, BlockNum);
                if(Tx.ErrSign)
                    return TX_RESULT_SIGN;
            }

            if(!Engine.IsValidateTx(Tx, "ERROR SERVER.AddTransaction", BlockNum))
                return TX_RESULT_BAD_TYPE;

            Tx0._TxID = GetStrTxIDFromHash(Tx.HASH, BlockNum);
            Tx0._BlockNum = BlockNum;

            var Ret;
            var TxArr = [Tx];
            var CountSend = Engine.AddCurrentProcessingTx(BlockNum, TxArr);
            if(CountSend === 1)
                Ret = 1;
            else
                Ret = TX_RESULT_WAS_SEND;

            return Ret;
        };

        global.SERVER.CheckCreateTransactionObject = function (Tr,SetTxID,BlockNum) {
            var Body = Tr.body;
            Tr.IsTx = 1;
            if(SetTxID)
                Tr.TxID = global.GetHexFromArr(GetTxID(BlockNum, Body));
            Tr.power = 0;
            Tr.TimePow = 0;
        };

        global.SERVER.ClearDataBase = function ()
        {

            if(global.TX_PROCESS && global.TX_PROCESS.RunRPC)
                global.TX_PROCESS.RunRPC("ClearDataBase", {});

            Engine.ClearDataBase();
        };

        global.SERVER.WriteBlockDB = function (Block)
        {
            Engine.ConvertFromTera(Block, 1);
            return Engine.SaveToDB(Block);
        };
        global.SERVER.WriteBlockHeaderDB = function (Block,bPreSave)
        {
            Engine.ConvertFromTera(Block);
            return Engine.SaveToDB(Block);
        };

        global.SERVER.ReadBlockDB = function (BlockNum,ChainMode)
        {
            var Block = global.SERVER.ReadBlockHeaderDB(BlockNum, ChainMode);
            Engine.CheckLoadBody(Block);

            Engine.ConvertToTera(Block, 1);
            return Block;
        };

        global.SERVER.CheckLoadBody = function (Block)
        {
            Engine.CheckLoadBody(Block);
            Engine.ConvertToTera(Block, 1);
        };

        global.SERVER.ReadBlockHeaderDB = function (BlockNum,ChainMode)
        {
            var Block;
            if(ChainMode)
            {
                var ArrChain = Engine.DB.GetChainArrByNum(BlockNum);
                Block = ArrChain[ChainMode - 1];
            }
            else
            {
                Block = Engine.GetBlockHeaderDB(BlockNum);
            }

            Engine.ConvertToTera(Block, 0);
            return Block;
        };

        global.SERVER.TruncateBlockDB = function (LastNum)
        {
            var MaxNum = Engine.GetMaxNumBlockDB();
            var Result = Engine.TruncateChain(LastNum);

            var MaxNum2 = Engine.GetMaxNumBlockDB();
            global.REWRITE_DAPP_TRANSACTIONS(MaxNum - MaxNum2);

            return Result;
        };

        global.SERVER.GetMaxNumBlockDB = function ()
        {
            return Engine.GetMaxNumBlockDB();
        };

        function ErrorAPICall()
        {
            global.ToLogTrace("Error API call");
            return 0;
        };

        function ErrorTODO()
        {
            global.ToLogTrace("TODO");
            return 0;
        };

        global.SERVER.WriteBlockDBFinaly = ErrorAPICall;
        global.SERVER.WriteBodyDB = ErrorAPICall;

        global.SERVER.WriteBodyResultDB = ErrorTODO;

        global.SERVER.CreateGenesisBlocks = function ()
        {
        };
        global.SERVER.CheckStartedBlocks = function () {
            debug("-8", '⚠[(CheckStartedBlocks*) loop]')
            var CurNumTime = global.GetCurrentBlockNumByTime();
            if(global.SERVER.BlockNumDB > CurNumTime) {
                global.SERVER.TruncateBlockDB(CurNumTime);
            }
            var BlockNum = global.SERVER.CheckBlocksOnStartReverse(global.SERVER.BlockNumDB);
            BlockNum = BlockNum - 5000;
            if(BlockNum < 0) {
                BlockNum = 0;
            }
            global.ToLog("CheckStartedBlocks at " + BlockNum);
            BlockNum = global.SERVER.CheckBlocksOnStartFoward(BlockNum, 1, 0);
            BlockNum = global.SERVER.CheckBlocksOnStartFoward(BlockNum - 100, 1, 1);

            if(BlockNum < global.SERVER.BlockNumDB) {
                BlockNum--;
                debug("-8", '⚠[(CheckStartedBlocks*)******************************** SET NEW BlockNumDB]')
                global.ToLog("******************************** SET NEW BlockNumDB = " + BlockNum + "/" + global.SERVER.BlockNumDB);

                if(0 && global.DEV_MODE)
                {
                    StopAndExit("SET NEW BlockNumDB");
                }

                global.SERVER.TruncateBlockDB(BlockNum);
            }
            global.glStartStat = 1;
        };

        global.SERVER.GetLinkHash = ErrorAPICall;
        global.SERVER.GetLinkHashDB = ErrorAPICall;

        global.SERVER.RewriteAllTransactions = function ()
        {
            if(global.TX_PROCESS.Worker)
            {
                if(global.TX_PROCESS && global.TX_PROCESS.RunRPC)
                {
                    global.TX_PROCESS.RunRPC("RewriteAllTransactions", {});
                    return 1;
                }
            }

            global.SERVER.RefreshAllDB();

            return 0;
        };
        global.SERVER.GetRows = function (start,count,Filter,bMinerName,ChainMode)
        {
            if(Filter)
            {
                Filter = Filter.trim();
                Filter = Filter.toUpperCase();
            }

            var MaxAccount = global.ACCOUNTS.GetMaxAccount();
            var WasError = 0;
            var arr = [];

            for(let num = start; true; num++)
            {
                let Block = global.SERVER.ReadBlockHeaderDB(num, ChainMode);
                if(!Block)
                    break;

                Block.Num = Block.BlockNum;
                if(Block.AddrHash)
                {
                    Block.Miner = ReadUintFromArr(Block.AddrHash, 0);
                    if(Block.BlockNum < 16 || (Block.Miner > MaxAccount && Block.BlockNum < global.UPDATE_CODE_5))
                        Block.Miner = 0;
                    if(bMinerName)
                    {
                        Block.MinerName = "";

                        if(Block.BlockNum >= global.UPDATE_CODE_5 && Block.Miner >= 1e9)
                        {
                            let CurMiner = global.ACCOUNTS.GetIDByAMID(Block.Miner);
                            if(CurMiner)
                                Block.Miner = CurMiner;
                        }

                        if(Block.Miner)
                        {
                            let Item = global.ACCOUNTS.ReadState(Block.Miner);
                            if(Item && Item.Name && typeof Item.Name === "string")
                                Block.MinerName = Item.Name.substr(0, 8);
                        }
                    }

                    let Value = GetHashFromSeqAddr(Block.SeqHash, Block.AddrHash, Block.BlockNum, Block.PrevHash);
                    Block.Hash1 = Value.Hash1;
                    Block.Hash2 = Value.Hash2;
                }

                if(Filter)
                {
                    let Num = Block.BlockNum;
                    let Count = Block.TrDataLen;
                    let Pow = Block.Power;
                    let Miner = Block.Miner;
                    let Date = DateFromBlock(Block.BlockNum);
                    try
                    {
                        if(!eval(Filter))
                            continue;
                    }
                    catch(e)
                    {
                        if(!WasError)
                            global.ToLog(e);
                        WasError = 1;
                    }
                }

                arr.push(Block);
                count--;
                if(count < 1)
                    break;
            }
            return arr;
        };

        global.SERVER.GetTrRows = function (BlockNum,start,count,ChainMode,FilterTxId)
        {
            let arr = [];
            let Block = global.SERVER.ReadBlockDB(BlockNum, ChainMode);

            if(typeof FilterTxId === "string" && FilterTxId.length >= TX_ID_HASH_LENGTH * 2)
                FilterTxId = FilterTxId.substr(0, TX_ID_HASH_LENGTH * 2);

            if(Block && Block.arrContent)
            {
                for(let num = start; num < start + count; num++)
                {
                    if(num < 0)
                        continue;
                    if(num >= Block.arrContent.length)
                        break;

                    let Tr = {body:Block.arrContent[num]};
                    global.SERVER.CheckCreateTransactionObject(Tr, 1, BlockNum);
                    if(typeof FilterTxId === "string" && FilterTxId.length === TX_ID_HASH_LENGTH * 2 && Tr.TxID.substr(0, TX_ID_HASH_LENGTH * 2) !== FilterTxId)
                        continue;

                    Tr.Num = num;
                    Tr.Type = Tr.body[0];
                    Tr.Length = Tr.body.length;
                    Tr.Body = [];
                    for(let j = 0; j < Tr.body.length; j++)
                        Tr.Body[j] = Tr.body[j];

                    let App = global.DAppByType[Tr.Type];
                    if(App)
                    {
                        Tr.Script = App.GetScriptTransaction(Tr.body, BlockNum, Tr.Num);
                        Tr.Verify = GetVerifyTransaction(Block, Tr.Num);

                        if(Tr.Verify > 0)
                        {
                            Tr.VerifyHTML = "<B style='color:green'>✔</B>";
                            if(Tr.Verify > 1)
                            {
                                Tr.VerifyHTML += "(" + Tr.Verify + ")";
                            }
                        }
                        else
                        if(Tr.Verify === 0)
                            Tr.VerifyHTML = "<B style='color:red'>✘</B>";
                        else
                            Tr.VerifyHTML = "";
                    }
                    else
                    {
                        Tr.Script = "";
                        Tr.VerifyHTML = "";
                    }

                    arr.push(Tr);
                }
            }
            return arr;
        };
        global.SERVER.ClearStat = function ()
        {
            let MAX_ARR_PERIOD = global.MAX_STAT_PERIOD * 2 + 10;

            global.SERVER.StatMap = {StartPos:0, StartBlockNum:0, Length:0, "ArrPower":new Float64Array(MAX_ARR_PERIOD), "ArrPowerMy":new Float64Array(MAX_ARR_PERIOD),
            };
        };
        global.SERVER.TruncateStat = function (LastBlockNum)
        {
            if(global.SERVER.StatMap)
            {
                let LastNumStat = global.SERVER.StatMap.StartBlockNum + global.SERVER.StatMap.Length;
                let Delta = LastNumStat - LastBlockNum;
                if(Delta > 0)
                {
                    global.SERVER.StatMap.Length -= Delta;
                    if(global.SERVER.StatMap.Length < 0)
                        global.SERVER.StatMap.Length = 0;
                }
                global.SERVER.StatMap.CaclBlockNum = 0;
            }
        };

        global.SERVER.GetStatBlockchainPeriod = function (Param)
        {
            let StartNum = Param.BlockNum;
            if(!Param.Count || Param.Count < 0)
                Param.Count = 1000;
            if(!Param.Miner)
                Param.Miner = 0;

            let Map = {};
            let ArrList = new Array(Param.Count);
            let i = 0;
            for(let num = StartNum; num < StartNum + Param.Count; num++)
            {
                let Power = 0, PowerMy = 0, Nonce = 0;
                if(num <= global.SERVER.BlockNumDB)
                {
                    let Block = global.SERVER.ReadBlockHeaderDB(num);
                    if(Block)
                    {
                        Power = GetPowPower(Block.PowHash);
                        let Miner = ReadUintFromArr(Block.AddrHash, 0);
                        let Nonce = ReadUintFromArr(Block.AddrHash, 6);
                        if(Param.Miner < 0)
                        {
                            PowerMy = Power;
                        }
                        else
                        if(Miner === Param.Miner)
                        {
                            PowerMy = Power;
                        }
                    }
                }

                ArrList[i] = PowerMy;

                i++;
            }
            let AvgValue = 0;
            for(let j = 0; j < ArrList.length; j++)
            {
                if(ArrList[j])
                    AvgValue += ArrList[j];
            }
            if(ArrList.length > 0)
                AvgValue = AvgValue / ArrList.length;

            const MaxSizeArr = 1000;
            let StepTime = 1;
            while(ArrList.length >= MaxSizeArr)
            {
                if(Param.bNonce)
                    ArrList = ResizeArrMax(ArrList);
                else
                    ArrList = ResizeArrAvg(ArrList);
                StepTime = StepTime * 2;
            }

            return {ArrList:ArrList, AvgValue:AvgValue, steptime:StepTime};
        };

        global.SERVER.GetStatBlockchain = function (name,MinLength)
        {

            if(!MinLength)
                return [];

            let MAX_ARR_PERIOD = global.MAX_STAT_PERIOD * 2 + 10;

            if(!global.SERVER.StatMap)
            {
                global.SERVER.ClearStat();
            }

            let MaxNumBlockDB = global.SERVER.GetMaxNumBlockDB();

            if(global.SERVER.StatMap.CaclBlockNum !== MaxNumBlockDB || global.SERVER.StatMap.CalcMinLength !== MinLength)
            {
                global.SERVER.StatMap.CaclBlockNum = MaxNumBlockDB;
                global.SERVER.StatMap.CalcMinLength = MinLength;
                let start = MaxNumBlockDB - MinLength + 1;
                let finish = MaxNumBlockDB + 1;

                let StartPos = global.SERVER.StatMap.StartPos;
                let ArrPower = global.SERVER.StatMap.ArrPower;
                let ArrPowerMy = global.SERVER.StatMap.ArrPowerMy;
                let StartNumStat = global.SERVER.StatMap.StartBlockNum;
                let FinishNumStat = global.SERVER.StatMap.StartBlockNum + global.SERVER.StatMap.Length - 1;

                let CountReadDB = 0;
                let arr = new Array(MinLength);
                let arrmy = new Array(MinLength);
                for(let num = start; num < finish; num++)
                {
                    let i = num - start;
                    let i2 = (StartPos + i) % MAX_ARR_PERIOD;
                    if(num >= StartNumStat && num <= FinishNumStat && (num < finish - 10))
                    {
                        arr[i] = ArrPower[i2];
                        arrmy[i] = ArrPowerMy[i2];
                    }
                    else
                    {
                        CountReadDB++;
                        let Power = 0, PowerMy = 0;
                        if(num <= MaxNumBlockDB)
                        {
                            let Block = global.SERVER.ReadBlockHeaderDB(num);
                            if(Block)
                            {
                                Power = GetPowPower(Block.PowHash);
                                let Miner = ReadUintFromArr(Block.AddrHash, 0);
                                if(Miner === GetMiningAccount())
                                {
                                    PowerMy = Power;
                                }
                            }
                        }
                        arr[i] = Power;
                        arrmy[i] = PowerMy;

                        ArrPower[i2] = arr[i];
                        ArrPowerMy[i2] = arrmy[i];

                        if(num > FinishNumStat)
                        {
                            global.SERVER.StatMap.StartBlockNum = num - global.SERVER.StatMap.Length;
                            global.SERVER.StatMap.Length++;
                            if(global.SERVER.StatMap.Length > MAX_ARR_PERIOD)
                            {
                                global.SERVER.StatMap.Length = MAX_ARR_PERIOD;
                                global.SERVER.StatMap.StartBlockNum++;
                                global.SERVER.StatMap.StartPos++;
                            }
                        }
                    }
                }

                global.SERVER.StatMap["POWER_BLOCKCHAIN"] = arr;
                global.SERVER.StatMap["POWER_MY_WIN"] = arrmy;
            }

            let arr = global.SERVER.StatMap[name];
            if(!arr)
                arr = [];
            let arrT = global.SERVER.StatMap["POWER_BLOCKCHAIN"];
            for(let i = 0; i < arrT.length; i++)
                if(!arrT[i])
                {
                    global.SERVER.StatMap = undefined;
                    break;
                }

            return arr;
        };

        global.SERVER.CheckBlocksOnStartReverse = function (StartNum)
        {
            let delta = 1;
            let Count = 0;
            let PrevBlock;
            for(let num = StartNum; num >= global.SERVER.BlockNumDBMin + global.BLOCK_PROCESSING_LENGTH2; num -= delta)
            {
                let Block = global.SERVER.ReadBlockHeaderDB(num);
                if(!Block || IsZeroArr(Block.SumHash))
                {
                    delta++;
                    Count = 0;
                    continue;
                }
                let PrevBlock = global.SERVER.ReadBlockHeaderDB(num - 1);
                if(!PrevBlock || IsZeroArr(PrevBlock.SumHash))
                {
                    Count = 0;
                    continue;
                }

                let SumHash = CalcSumHash(PrevBlock.SumHash, Block.Hash, Block.BlockNum, Block.SumPow);
                if(CompareArr(SumHash, Block.SumHash) === 0)
                {
                    delta = 1;
                    Count++;
                    if(Count > 100)
                        return num;
                }
                else
                {
                    delta++;
                    Count = 0;
                }
            }
            return 0;
        };

        global.SERVER.CheckBlocksOnStartFoward = function (StartNum,bCheckHash,bCheckBody)
        {
            let PrevBlock;
            if(StartNum < global.SERVER.BlockNumDBMin + global.BLOCK_PROCESSING_LENGTH2 - 1)
                StartNum = global.SERVER.BlockNumDBMin + global.BLOCK_PROCESSING_LENGTH2 - 1;

            let MaxNum = global.SERVER.GetMaxNumBlockDB();
            let BlockNumTime = global.GetCurrentBlockNumByTime();
            if(BlockNumTime < MaxNum)
                MaxNum = BlockNumTime;
            let num = StartNum
            for(num ; num <= MaxNum; num++) {

                let Block;
                if(bCheckBody)
                    Block = global.SERVER.ReadBlockDB(num);
                else
                    Block = global.SERVER.ReadBlockHeaderDB(num);
                if(!Block)
                    return num > 0 ? num - 1 : 0;
                if(num % 100000 === 0)
                    global.ToLog("CheckBlocksOnStartFoward: " + num);

                if(bCheckBody)
                {
                    let TreeHash = Engine.CalcTreeHash(Block.BlockNum, Block.TxData);
                    if(global.CompareArr(Block.TreeHash, TreeHash) !== 0)
                    {
                        global.ToLog("BAD TreeHash block=" + Block.BlockNum);
                        return num > 0 ? num - 1 : 0;
                    }
                }

                if(PrevBlock)
                {
                    if(Block.BlockNum < global.UPDATE_CODE_JINN)
                        return num;

                    if(Block.BlockNum > 16 && CompareArr(Block.PrevHash, PrevBlock.Hash) !== 0)
                    {
                        global.ToLog("=================== FIND ERR PrevHash in " + Block.BlockNum + "  bCheckBody=" + bCheckBody + " WAS=" + global.GetHexFromArr(Block.PrevHash) + " NEED=" + global.GetHexFromArr(PrevBlock.Hash));
                        return num > 0 ? num - 1 : 0;
                    }

                    if(bCheckHash)
                    {
                        let SeqHash = GetSeqHash(Block.BlockNum, Block.PrevHash, Block.TreeHash, PrevBlock.SumPow);
                        let Value = GetHashFromSeqAddr(SeqHash, Block.AddrHash, Block.BlockNum, Block.PrevHash);
                        if(CompareArr(Value.Hash, Block.Hash) !== 0)
                        {
                            global.ToLog("PrevHash=" + global.GetHexFromArr(Block.PrevHash));
                            global.ToLog("TreeHash=" + global.GetHexFromArr(Block.TreeHash));
                            global.ToLog("AddrHash=" + global.GetHexFromArr(Block.AddrHash));
                            global.ToLog("=================== FIND ERR Hash in " + Block.BlockNum + "  bCheckBody=" + bCheckBody + " WAS=" + global.GetHexFromArr(Block.Hash) + " NEED=" + GetHexFromArr(Value.Hash));
                            return num > 0 ? num - 1 : 0;
                        }

                        let SumHash = CalcSumHash(PrevBlock.SumHash, Block.Hash, Block.BlockNum, Block.SumPow);
                        if(CompareArr(SumHash, Block.SumHash) !== 0)
                        {
                            global.ToLog("=================== FIND ERR SumHash in " + Block.BlockNum);
                            return num > 0 ? num - 1 : 0;
                        }
                    }
                }
                PrevBlock = Block;
            }
            return num > 0 ? num - 1 : 0;
        };
        global.SERVER.GenesisBlockHeaderDB = function (Num)
        {
            if(Num < 0)
                return undefined;

            let Block = {BlockNum:Num, TreeHash:global.ZERO_ARR_32, PrevHash:global.ZERO_ARR_32, PrevSumHash:global.ZERO_ARR_32, SumHash:global.ZERO_ARR_32, TrCount:0,
                TrDataLen:0, };

            if(Block.BlockNum < global.UPDATE_CODE_JINN)
                Block.AddrHash = global.DEVELOP_PUB_KEY0;
            // rudiment from old code
            else
                Block.AddrHash = global.ZERO_ARR_32;

            Block.SeqHash = global.GetSeqHash(Block.BlockNum, Block.PrevHash, Block.TreeHash);

            Block.SumPow = 0;

            return Block;
        };
        global.SERVER.BlockChainToBuf = function (WriteNum,StartNum,EndBlockNum)
        {

            let Arr = [];
            for(let num = StartNum; num <= EndBlockNum; num++)
            {
                let Block = global.SERVER.ReadBlockHeaderDB(num);
                if(!Block)
                    break;
                Arr.push(Block);
            }

            let ArrBuf = GetBufferFromBlockArr(Arr);
            return ArrBuf;
        };

        global.SERVER.ResetNextPingAllNode = function ()
        {
        };

        global.SERVER.StopServer = function ()
        {
            if(Engine.Server)
                Engine.Server.close();
        };

        global.SERVER.StopNode = function ()
        {
            global.StopNetwork = true;
        };

        global.SERVER.GetTXDelta = function ()
        {
            let BlockNum = GetCurrentBlockNumByTime();
            let BlockNumTX = global.COMMON_ACTS.GetLastBlockNumActWithReopen();
            return BlockNum - BlockNumTX;
        };

        global.SERVER.RefreshAllDB = function ()
        {
            if(global.PROCESS_NAME !== "TX")
            {
                if(global.COMMON_ACTS)
                {
                    global.COMMON_ACTS.Close();
                }
            }

            if(global.PROCESS_NAME !== "MAIN")
            {
                Engine.Close();
            }
        };
    }
   return {
       init: Init
   };
}