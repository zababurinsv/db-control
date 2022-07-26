/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/


"use strict";

//support for the transactional database model
import accountsSign from "./accounts-sign.mjs"
import logs from '../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)
    let AccountsSign = accountsSign(global)
    const MAX_SUM_TER = 1e9;
    const MAX_SUM_CENT = 1e9;

    class AccountTR extends AccountsSign
    {
        constructor(bReadOnly)
        {
            super(bReadOnly)

            this.CreateTrCount = 0
        }
        TRCreateAccount(Block, Body, BlockNum, TrNum, ContextFrom)
        {
            if(Body.length < 90)
                return "Error length transaction";

            let CheckMinPower = 1;
            if(BlockNum >= 7000000 || global.NETWORK_ID !== "MAIN-JINN.TERA")
            {
                if(ContextFrom && ContextFrom.To.length === 1 && ContextFrom.To[0].ID === 0 && ContextFrom.To[0].SumCOIN >= PRICE_DAO(BlockNum).NewAccount)
                {
                    CheckMinPower = 0
                }
                else
                {
                    if(BlockNum < global.UPDATE_CODE_7 && BlockNum % OLD_BLOCK_CREATE_INTERVAL !== 0)
                        return "The create transaction is not possible in this block: " + BlockNum;

                    if(this.CreateTrCount > 0)
                        return "The account creation transaction was already in this block: " + BlockNum;
                }
            }
            this.CreateTrCount++

            if(CheckMinPower && global.NETWORK_ID === "MAIN-JINN.TERA")
            {
                let power;
                if(BlockNum >= global.BLOCKNUM_TICKET_ALGO)
                {
                    power = this.GetPowTx(Body, BlockNum)
                }
                else
                {
                    power = GetPowPower(shaarr(Body))
                }

                if(BlockNum < 19600000)
                {
                    let MinPower;
                    if(BlockNum < 2500000)
                        MinPower = MIN_POWER_POW_ACC_CREATE
                    else
                    if(BlockNum < 2800000)
                        MinPower = MIN_POWER_POW_ACC_CREATE + 2
                    else
                        MinPower = MIN_POWER_POW_ACC_CREATE + 3

                    if(power < MinPower)
                        return "Error min power POW for create account (update client)";
                }
            }

            try
            {
                let TR = BufLib.GetObjectFromBuffer(Body, FORMAT_ACC_CREATE, {});
            }
            catch(e)
            {
                return "Error transaction format";
            }

            if((global.LOCAL_RUN || BlockNum >= 3500000) && !TR.Name)
                return "Account name required";
            if((global.LOCAL_RUN || BlockNum >= 5700000) && !TR.Name.trim())
                return "Account name required";

            let Account = this.NewAccountTR(BlockNum, TrNum, TR.Smart);
            Account.Currency = TR.Currency
            Account.PubKey = TR.PubKey
            Account.Name = TR.Name
            Account.Adviser = TR.Adviser
            Account.Value.Smart = TR.Smart
            this.WriteStateTR(Account, BlockNum, TrNum)

            if(BlockNum >= global.UPDATE_CODE_3)
            {
                try
                {
                    RunSmartMethod(Block, TR, Account.Value.Smart, Account, BlockNum, TrNum, ContextFrom, "OnSetSmart");
                }
                catch(e)
                {
                    return e;
                }
            }

            this.ResultTx = Account.Num
            return true;
        }

        TRTransferMoney5(Block, Body, BlockNum, TrNum, format_money_transfer, workstructtransfer)
        {
            if(GETVERSION(BlockNum)<2)
                return "Error blockchain version";

            if(IS_ROLLBACK_TRANSACTION())
                return "Was rollback tx";

            if(Body.length < 120)
                return "Error length transaction";


            let TR = SerializeLib.GetObjectFromBuffer(Body, format_money_transfer, workstructtransfer);
            if(TR.TxMaxBlock && TR.TxMaxBlock<BlockNum)
                return "Error Max block num: "+BlockNum+"/"+TR.TxMaxBlock;

            let MaxTicks=PRICE_DAO(BlockNum).MaxTicks;
            if(TR.TxTicks>MaxTicks)
                return "Error max ticks: "+TR.TxTicks+"/"+MaxTicks;
            SetTickCounter(TR.TxTicks);


            if(TR.Version !=4)
                return "Error Tx version";
            if(!TR.FromID)
                return "Error sender's account ID: " + TR.FromID;

            TR.FromNum=TR.FromID;
            let ResultCheck = ACCOUNTS.CheckSignFrom(Body, TR, BlockNum, TrNum);
            if(typeof ResultCheck === "string")
                return ResultCheck;



            let CoinSumTo=this.SendMoneyTR(Block, TR.FromID, TR.ToID, TR.Amount, BlockNum, TrNum, TR.Description,
                TR.Description, 0,0,0,TR.Currency,TR.TokenID);
            if(!CoinSumTo || CoinSumTo.SumCOIN===undefined || CoinSumTo.SumCENT===undefined)
                CoinSumTo=TR.Amount;



            //Run next transactions
            if(TR.Body && TR.Body.length)
            {
                let Data = this.ReadStateTR(TR.FromID);

                //correct tx for pay context:
                if(TR.Currency)
                    TR.Currency=TR.Currency;
                else
                if(Data.Currency)
                    TR.Currency=Data.Currency;

                TR.Value=CoinSumTo;
                TR.To=[{ID:TR.ToID,SumCOIN:TR.Value.SumCOIN,SumCENT:TR.Value.SumCENT}];

                let App = global.DAppByType[TR.Body[0]];
                if(App)
                {
                    TR.FromPubKey = Data.PubKey
                    let Result = App.OnProcessTransaction(Block, TR.Body, BlockNum, TrNum, TR)
                    if(Result !== true)
                        return Result;
                }
            }

            return true;

        }


        TRTransferMoney(Block, Body, BlockNum, TrNum, format_money_transfer, workstructtransfer)
        {
            if(GETVERSION(BlockNum)>=3)
                return "Error blockchain version";

            if(IS_ROLLBACK_TRANSACTION())
                return "Was rollback tx";

            if(Body.length < 103)
                return "Error length transaction";

            try
            {
                let TR = BufLib.GetObjectFromBuffer(Body, format_money_transfer, workstructtransfer);
            }
            catch(e)
            {
                return "Error transaction format";
            }
            if(!TR.Version)
                TR.Version = 0
            let Data = this.ReadStateTR(TR.FromID);
            if(!Data)
                return "Error sender's account ID: " + TR.FromID;
            if(TR.Version < 3 && TR.Currency !== Data.Currency)
                return "Error sender's currency";

            if(TR.Version === 3 && BlockNum < global.UPDATE_CODE_6)
                TR.OperationID = TR.DeprecatedOperationID
            if(TR.Version < 3)
            {
                if(TR.OperationID !== Data.Value.OperationID)
                    return "Error OperationID=" + TR.OperationID + " (expected: " + Data.Value.OperationID + " for ID: " + TR.FromID + ")";
            }
            else
            {
                if(TR.OperationID < Data.Value.OperationID)
                    return "Error OperationID=" + TR.OperationID + " (expected: " + Data.Value.OperationID + " for ID: " + TR.FromID + ")";

                let MaxCountOperationID = 100;
                if(BlockNum >= global.BLOCKNUM_TICKET_ALGO)
                    MaxCountOperationID = 1000000
                if(TR.OperationID > Data.Value.OperationID + MaxCountOperationID)
                    return "Error too much OperationID (expected max: " + (Data.Value.OperationID + MaxCountOperationID) + " for ID: " + TR.FromID + ")";
            }

            if(BlockNum >= SMART_BLOCKNUM_START)
            {
                if(TR.To.length > 10)
                    return "The number of recipients has been exceeded (max=10, current count=" + TR.To.length + ")";
            }

            if(TR.Body && TR.Body.length && TR.To.length > 1)
            {
                return "Error - dapps transaction can not be used in a multiple transaction";
            }
            let TotalSum = {SumCOIN:0, SumCENT:0};
            let MapItem = {};
            let bWas = 0;
            for(let i = 0; i < TR.To.length; i++)
            {
                let Item = TR.To[i];
                if(Item.SumCOIN > MAX_SUM_TER)
                    return "Error MAX_SUM_COIN";
                if(Item.SumCENT >= MAX_SUM_CENT)
                    return "Error MAX_SUM_CENT";

                if(TR.Version < 3)
                {
                    if(Item.ID === TR.FromID || MapItem[Item.ID])
                        continue;
                    MapItem[Item.ID] = 1
                }

                bWas = 1
                ADD(TotalSum, Item)
            }

            if(!bWas && TR.Version < 3)
                return "No significant recipients";
            let ZeroSum = 0;
            if(TotalSum.SumCOIN === 0 && TotalSum.SumCENT === 0)
            {
                if(TR.Version < 3)
                    return "No money transaction";
                else
                    ZeroSum = 1
            }

            if(Data.Value.SumCOIN < TotalSum.SumCOIN || (Data.Value.SumCOIN === TotalSum.SumCOIN && Data.Value.SumCENT < TotalSum.SumCENT))
                return "Not enough money on the account";

            if(BlockNum >= global.NEW_ACCOUNT_INCREMENT)
                Data.Value.OperationID = TR.OperationID
            Data.Value.OperationID++

            this.WriteStateTR(Data, BlockNum, TrNum)

            TR.Value = TotalSum

            let arr = [];
            MapItem = {}
            let arrpub = [];
            for(let i = 0; i < TR.To.length; i++)
            {
                let Item = TR.To[i];

                let DataTo = this.ReadStateTR(Item.ID);
                if(!DataTo)
                    return "Error receiver account ID: " + Item.ID;
                if(!ZeroSum && Data.Currency !== DataTo.Currency)
                    return "Error receiver currency";
                for(let j = 0; j < 33; j++)
                    arrpub[arrpub.length] = DataTo.PubKey[j]

                if(DataTo.Value.Smart)
                {
                    if(TR.To.length > 1)
                        return "Error - smart accounts can not be used in a multiple transaction";
                }

                if(TR.Version === 3 && Item.ID === 0 && Item.PubKey && Item.PubKey.length === 33)
                {
                    if(Item.SumCOIN < PRICE_DAO(BlockNum).NewAccount)
                        return "Not enough money for create account with index: " + i;
                    let name = TR.Description;
                    let index = name.indexOf("\n");
                    if(index !==  - 1)
                        name = name.substr(0, index)

                    let Account = this.NewAccountTR(BlockNum, TrNum, 0);
                    Account.PubKey = Item.PubKey
                    Account.Name = name
                    this.WriteStateTR(Account, BlockNum, TrNum)
                    this.ResultTx = Account.Num

                    Item.ID = Account.Num
                    this.SendMoneyTR(Block, Data.Num, Account.Num, {SumCOIN:Item.SumCOIN, SumCENT:Item.SumCENT}, BlockNum, TrNum, TR.Description,
                        TR.Description, 1)
                    this.SendMoneyTR(Block, Account.Num, 0, {SumCOIN:PRICE_DAO(BlockNum).NewAccount, SumCENT:0}, BlockNum, TrNum, "Fee for create account",
                        "", 1)
                }
                else
                {
                    if(TR.Version < 3)
                    {
                        if(Item.ID === TR.FromID || MapItem[Item.ID])
                            continue;
                        MapItem[Item.ID] = 1
                    }

                    this.SendMoneyTR(Block, Data.Num, DataTo.Num, {SumCOIN:Item.SumCOIN, SumCENT:Item.SumCENT}, BlockNum, TrNum, TR.Description,
                        TR.Description, 0)
                    arr.push(DataTo)
                }
            }
            if(TR.Version < 3 && arr.length === 0)
                return "No recipients";
            let hash;
            if(TR.Version === 2 || TR.Version === 3)
            {
                for(let j = 0; j < Body.length - 64 - 12; j++)
                    arrpub[arrpub.length] = Body[j]
                hash = SHA3BUF(arrpub, BlockNum)
            }
            else if(TR.Version === 4 && BlockNum >= global.UPDATE_CODE_6)
            {
                hash = SHA3BUF(Body.slice(0, Body.length - 64), BlockNum)
            }
            else if(!TR.Version)
            {
                hash = SHA3BUF(Body.slice(0, Body.length - 64 - 12), BlockNum)
            }
            else
            {
                return "Error transaction version";
            }
            let Result = CheckSign(hash, TR.Sign, Data.PubKey);

            if(!Result)
            {
                return "Error sign transaction";
            }

            //Run next transactions
            if(TR.Body && TR.Body.length)
            {
                let App = global.DAppByType[TR.Body[0]];
                if(App)
                {
                    TR.FromPubKey = Data.PubKey
                    Result = App.OnProcessTransaction(Block, TR.Body, BlockNum, TrNum, TR)
                    if(Result !== true)
                        return Result;
                }
            }

            return true;
        }

        TRChangeAccount(Block, Body, BlockNum, TrNum)
        {
            if(BlockNum < UPDATE_CODE_SHARDING)
                return true;

            if(Body.length < 160)
                return "Error length transaction";

            try
            {
                let TR = SerializeLib.GetObjectFromBuffer(Body, FORMAT_ACC_CHANGE, {});
            }
            catch(e)
            {
                return "Error transaction format";
            }

            if(!TR.Name.trim())
                return "Account name required";

            let Res = this.CheckSignAccountTx(BlockNum, Body, TR.OperationID);
            if(!Res.result)
                return Res.text;

            let Account = Res.ItemAccount;

            Account.PubKey = TR.PubKey
            Account.Name = TR.Name
            Account.Value.OperationID = TR.OperationID + 1

            this.WriteStateTR(Account, BlockNum, TrNum)

            return true;
        }

        OnWriteNewAccountTR(Data, BlockNum, TrNum)
        {
            if(BlockNum < SMART_BLOCKNUM_START)
                Data.Value.Smart = 0
            Data.BlockNumCreate = BlockNum

            if(BlockNum >= global.UPDATE_CODE_5)
            {
                let AMID = Data.Adviser;
                if(AMID < 1e9 || AMID >= 1e10)
                    Data.Adviser = 0
                else
                {
                    let CurNum = this.GetIDByAMID(AMID);
                    if(CurNum && CurNum < Data.Num)
                    {
                        ToLog("Account:" + Data.Num + " - was find AMID: " + AMID + " in Account: " + CurNum + ", AMID set to 0", 2)
                        Data.Adviser = 0
                    }
                }
            }
            else if(Data.Adviser > this.GetMaxAccount())
            {
                Data.Adviser = 0
            }

            if(Data.Value.Smart > SMARTS.GetMaxNum())
                Data.Value.Smart = 0
            if(Data.Currency > SMARTS.GetMaxNum())
                Data.Currency = 0
            if(Data.Currency)
            {
                let Smart = SMARTS.ReadSmart(Data.Currency);
                if(!Smart || !Smart.TokenGenerate)
                    Data.Currency = 0
            }
        }

        NewAccountTR(BlockNum, TrNum, SmartNum)
        {
            let Data = {Num:this.GetMaxAccount() + 1, New:1, Changed:1, ChangeTrNum:TrNum, BackupValue:{}, PubKey:[], Currency:0, Adviser:0,
                Value:{SumCOIN:0, SumCENT:0, OperationID:0, Smart:SmartNum, Data:[]}};
            return Data;
        }

        ReadStateTR(Num)
        {
            Num = global.ParseNum(Num)

            return this.DBState.Read(Num);
        }

        WriteStateTR(Data, BlockNum, TrNum)
        {
            Data.Changed = 1
            Data.ChangeTrNum = TrNum

            if(Data.New)
                this.OnWriteNewAccountTR(Data, BlockNum, TrNum)
            this.DBStateWriteInner(Data, BlockNum, 0)
        }

        WriteHistoryTR(AccountNum, HistoryObj)
        {
            return this.WriteHistory(AccountNum, HistoryObj);
        }

        SendMoneyTR(Block, FromID, ToID, CoinSum, BlockNum, TrNum, DescriptionFrom, DescriptionTo, OperationCount, bSmartMode, OperationNum,Currency,TokenID)
        {
            //проверки и выравнивания
            FromID = global.ParseNum(FromID);
            ToID = global.ParseNum(ToID);

            if(CoinSum.SumCENT >= 1e9)
            {
                throw "ERROR SumCENT>=1e9";
            }



            let FromData = this.ReadStateTR(FromID);

            let Smart;
            // if(FromID==1445)
            //     console.log("SendMoneyTR: "+FromID+"->"+ToID+" Sum:",FLOAT_FROM_COIN(CoinSum),"Currency:",Currency,FromData.Currency)
            // if(Currency && FromData.Currency==Currency)
            //     Currency=0;

            if(Currency && FromData.Currency === Currency)// && GETVERSION(BlockNum)>=3)
                Currency=0;


            let CoinSumTo;
            if(Currency)
            {
                //перевод soft токенов
                if(!TokenID)
                    TokenID="";

                Smart = SMARTS.ReadSmart(Currency);
                if(!Smart)
                    throw "ERROR Read smart: "+Currency;
                if(Smart.Version<2)
                    throw "Smart contract "+Currency+" is not a Software Token";

                let PayContext = {FromID:FromID, ToID:ToID, Description:DescriptionFrom, Value:CoinSum,Currency:Currency,TokenID:TokenID,SmartMode:bSmartMode};

                CoinSumTo=global.RunSmartMethod(Block, undefined, Smart, undefined, BlockNum, TrNum, PayContext, "OnTransfer",{From:FromID,To:ToID,Amount:CoinSum,ID:TokenID},[],0,1);

                FromData = this.ReadStateTR(FromID);//reload
            }



            if(!FromData)
                throw "Send: Error account FromNum: " + FromID;
            let ToData;
            if(FromID==ToID)
                ToData=FromData;
            else
                ToData = this.ReadStateTR(ToID);//перечитываем
            if(!ToData)
                throw "Send: Error account ToNum: " + ToID;


            if(!Currency)
            {
                //перевод обычных монет

                if(!SUB(FromData.Value, CoinSum))
                {
                    throw "Not enough money on the account ID:" + FromID;
                }
                ADD(ToData.Value, CoinSum);
                this.WriteStateTR(ToData, BlockNum, TrNum);
                if(!ISZERO(CoinSum) && FromData.Currency !== ToData.Currency)
                    throw "Different currencies. Accounts: " + FromID + " and " + ToID;
            }

            FromData.Value.OperationID += OperationCount;
            this.WriteStateTR(FromData, BlockNum, TrNum);


            //console.log("2:",FLOAT_FROM_COIN(FromData.Value));
            this.DoSmartEvents(Block, FromID, ToID, CoinSum,CoinSumTo, BlockNum, TrNum, DescriptionFrom, DescriptionTo, FromData,ToData, bSmartMode, Smart,Currency,TokenID);
            //console.log("3:",FLOAT_FROM_COIN(FromData.Value));

            return CoinSumTo;//возврат реально переведенной суммы - для варианта монет с fee
        }

        DoSmartEvents(Block, FromID, ToID, CoinSum, CoinSumTo, BlockNum, TrNum, DescriptionFrom, DescriptionTo, FromData,ToData, bSmartMode, Smart,Currency,TokenID)
        {
            if(!CoinSumTo || CoinSumTo.SumCOIN===undefined || CoinSumTo.SumCENT===undefined)
                CoinSumTo=CoinSum;

            if(FromID >= global.START_HISTORY)
            {
                let DescriptionFrom2 = DescriptionFrom;
                if(DescriptionFrom2.length > 100)
                    DescriptionFrom2 = DescriptionFrom2.substr(0, 100)
                let HistoryObj = {Direct:"-", Receive:0, CurID:FromID, CorrID:ToID, BlockNum:BlockNum, TrNum:TrNum, FromID:FromID, ToID:ToID,
                    SumCOIN:CoinSum.SumCOIN, SumCENT:CoinSum.SumCENT, Description:DescriptionFrom2,
                    SmartMode:bSmartMode};

                if(Smart)
                {
                    HistoryObj.SmartMode=4;
                    HistoryObj.Currency=Currency;
                    HistoryObj.Token=Smart.ShortName;
                    HistoryObj.ID=TokenID;
                }

                this.WriteHistoryTR(FromID, HistoryObj)
            }
            if(ToID >= global.START_HISTORY)
            {
                let DescriptionTo2 = DescriptionTo;
                if(DescriptionTo2.length > 100)
                    DescriptionTo2 = DescriptionTo2.substr(0, 100)
                let HistoryObj = {Direct:"+", Receive:1, CurID:ToID, CorrID:FromID, BlockNum:BlockNum, TrNum:TrNum, FromID:FromID, ToID:ToID,
                    SumCOIN:CoinSumTo.SumCOIN, SumCENT:CoinSumTo.SumCENT, Description:DescriptionTo2,
                    SmartMode:bSmartMode};
                if(Smart)
                {
                    HistoryObj.SmartMode=4;
                    HistoryObj.Currency=Currency;
                    HistoryObj.Token=Smart.ShortName;
                    HistoryObj.ID=TokenID;
                }
                this.WriteHistoryTR(ToID, HistoryObj);
            }


            if(FromData.Value.Smart)
            {
                let Context = {FromID:FromID, ToID:ToID, Description:DescriptionFrom, Value:CoinSum,Currency:Currency,TokenID:TokenID};
                if(BlockNum >= global.UPDATE_CODE_SHARDING)
                    Context.SmartMode = (bSmartMode ? 1 : 0);
                global.RunSmartMethod(Block, undefined, FromData.Value.Smart, FromData, BlockNum, TrNum, Context, "OnSend");
            }
            if(ToData.Value.Smart)
            {
                let Context = {FromID:FromID, ToID:ToID, Description:DescriptionTo, Value:CoinSumTo,Currency:Currency,TokenID:TokenID};
                if(BlockNum >= global.UPDATE_CODE_SHARDING)
                    Context.SmartMode = (bSmartMode ? 1 : 0);
                global.RunSmartMethod(Block, undefined, ToData.Value.Smart, ToData, BlockNum, TrNum, Context, "OnGet");
            }

        }

    }

    return AccountTR;
}