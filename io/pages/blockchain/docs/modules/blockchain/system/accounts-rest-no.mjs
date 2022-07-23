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

//Rest account states
import accountsScroll from "./accounts-scroll.mjs"
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
    let AccountsScroll = accountsScroll(global)
    class AccountRest extends AccountsScroll
    {
        constructor(bReadOnly)
        {
            super(bReadOnly)
        }

        ClearRest()
        {
        }

        CloseRest()
        {
        }

        TruncateRest(Num)
        {
        }

        DBStateWriteInner(Data, BlockNum)
        {
            this.ControlStorageDeposit(Data, BlockNum);
            this.DBState.Write(Data);

            this.SetAMIDTab(Data, BlockNum);
        }

        GetPrevAccountValue(Num, BlockNum)
        {

            var Data = this.ReadState(Num);
            if(!Data)
                return 0;
            if(Data.Currency !== 0)
                return 0;

            var Value = Data.Value;
            var MinBlockNum = BlockNum - 10;

            var Account = this.DBStateHistory.Read(Num);
            if(!Account)
                return undefined;

            var Count = 50;
            var Position = Account.NextPos;
            while(Count > 0 && Position)
            {
                Count--

                var Item = this.ReadHistory(Position);
                if(!Item)
                    break;
                Position = Item.NextPos

                if(Item.BlockNum <= MinBlockNum)
                {
                    break;
                }
                if(Item.Direct === "+")
                {
                    if(!SUB(Value, Item))
                    {
                        Value = {SumCOIN:0, SumCENT:0}
                    }
                }
                else
                {
                    ADD(Value, Item)
                }
            }

            return Value;
        }
    };

    return AccountRest;

}