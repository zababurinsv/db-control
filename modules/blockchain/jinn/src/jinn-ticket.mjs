/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

/**
 *
 * Reduction of the traffic of transactions through the use of tickets - short hash from the transaction
 * Algorithm:
 * First phase of dispatch of the tickets, then the phase of the transaction
 * Sending tickets by condition:
 * 1) Haven't sent yet
 * 2) And either did not receive, or received but it was not a new ticket
 * When you receive a ticket, set the special. flag:
 * - NEW_TIKET when it is a new ticket for us (i.e. did not receive from other nodes)
 * - OLD_TICKET-already in the ticket array
 * Transactions are sent only when the value of the ticket flag is not equal to OLD_TICKET (i.e. sent when the value is empty or equal to NEW_TIKET)
 *
**/


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
    global.DEBUG_KEY = "";
    global.JINN_MODULES.push({InitClass: InitClass, Name: "Ticket"});

    global.glUseTicket = 1;

    global.NEW_TIKET = "NEW";
    global.OLD_TICKET = "OLD";

//Engine context

    function InitClass(Engine) {
        Engine.ListTreeTicketAll = {};
        Engine.ListArrTicket = {};

        Engine.GetArrTicket = function (BlockNum) {
            let Arr = Engine.ListArrTicket[BlockNum];
            if (!Arr) {
                Arr = [];
                Engine.ListArrTicket[BlockNum] = Arr;
            }
            return Arr;
        };

        Engine.GetTreeTicketAll = function (BlockNum) {
            let Tree = Engine.ListTreeTicketAll[BlockNum];
            if (!Tree) {
                Tree = new global.RBTree(function (a, b) {
                    return global.CompareArr(a.HashTicket, b.HashTicket);
                });
                Engine.ListTreeTicketAll[BlockNum] = Tree;
            }
            return Tree;
        };

        Engine.InitItemTT = function (Item) {
            Item.TTSend = 0;
            Item.TTReceive = 0;

            Item.TXSend = 0;
            Item.TXReceive = 0;
            Item.TTTXReceive = 0;

            Item.TimeTTSend = 0;
        };

        Engine.AddToTreeWithAll = function (Tree, Item) {

            let Find = Tree.find(Item);
            if (Find) {
                if (Item.IsTx && !Find.IsTx) {
                    Engine.DoTxFromTicket(Find, Item);

                    return Find;
                }

                return 0;
            }
            Tree.insert(Item);
            Engine.InitItemTT(Item);

            return Item;
        };

        Engine.SendTicket = function (BlockNum) {
            if (!global.glUseTicket)
                return;

            let ArrTop = Engine.GetArrayFromTree(Engine.GetTreeTicketAll(BlockNum));

            let CurTime = Date.now();

            let Count = 0;
            let ArrChilds = Engine.GetTransferSession(BlockNum);
            let WasBreak = 0;
            for (let i = 0; i < ArrChilds.length; i++) {
                let ItemChild = ArrChilds[i];
                if (!ItemChild.Child) {
                    continue;
                }

                let Level = ItemChild.Child.Level;
                let TTArr = [];
                let ReqArr = [];
                let ChildCount = 0;
                for (let t = 0; t < ArrTop.length; t++) {
                    let Tt = ArrTop[t];

                    if (!Tt.TimeTTSend)
                        Tt.TimeTTSend = CurTime;

                    if (global.GetBit(Tt.TTSend, Level)) {
                        continue;
                    }

                    if (Tt.FromLevel === Level)
                        ReqArr.push(Tt);
                    else
                        TTArr.push(Tt);
                    Tt.TTSend = global.SetBit(Tt.TTSend, Level);

                    global.JINN_STAT.TTSend++;
                    global.JINN_STAT["TtSend" + Level]++;

                    Count++;
                    ChildCount++;

                    if (global.JINN_CONST.MAX_TRANSFER_TT && ChildCount >= global.JINN_CONST.MAX_TRANSFER_TT) {
                        WasBreak = 1;
                        break;
                    }
                }

                if (!ChildCount)
                    continue;

                Engine.Send("TRANSFERTT", ItemChild.Child, {BlockNum: BlockNum, TtArr: TTArr, ReqArr: ReqArr});
            }

            WasBreak = 1;
            if (!WasBreak)
                Engine.StepTaskTt[BlockNum] = 0;

            return Count;
        };

        Engine.TRANSFERTT_SEND = {
            BlockNum: "uint32",
            TtArr: [{HashTicket: "arr" + global.JINN_CONST.TT_TICKET_HASH_LENGTH}],
            ReqArr: [{HashTicket: "arr" + global.JINN_CONST.TT_TICKET_HASH_LENGTH}]
        };
        Engine.TRANSFERTT = function (Child, Data) {
            if (!Data)
                return;

            let BlockNum = Data.BlockNum;
            let ItemChild = Engine.FindTransferSessionByChild(Child, BlockNum);
            if (!ItemChild) {
                Child.ToError("TRANSFERTT : Error FindTransferSessionByChild BlockNum=" + BlockNum, 4);
                return {result: 0};
            }

            if (!Engine.CanProcessBlock(BlockNum, global.JINN_CONST.STEP_TICKET)) {
                Child.ToError("TRANSFERTT : CanProcessBlock Error BlockNum=" + BlockNum, 4);
                return {result: 0};
            }

            Engine.CheckHotConnection(Child);
            if (!Child || !Child.IsHot()) {
                global.JINN_STAT.ErrTt2++;
                return {result: 0};
            }

            let TreeTTAll = Engine.GetTreeTicketAll(BlockNum);

            let TTArr = Data.TtArr;
            let ReqArr = Data.ReqArr;
            Engine.CheckSizeTransferTXArray(Child, TTArr, global.JINN_CONST.MAX_TRANSFER_TT);
            Engine.CheckSizeTransferTXArray(Child, ReqArr, global.JINN_CONST.MAX_TRANSFER_TT);

            let Level = Child.Level;

            let CountNew = 0;
            for (let t = 0; t < TTArr.length; t++) {
                global.JINN_STAT.TtReceive++;
                global.JINN_STAT["TtReceive" + Level]++;

                let ItemReceive = TTArr[t];
                let Tt = TreeTTAll.find(ItemReceive);
                if (!Tt) {
                    CountNew++;
                    Tt = Engine.GetTicket(ItemReceive.HashTicket);

                    Tt.FromLevel = Level;

                    let Key = global.GetHexFromArr(ItemReceive.HashTicket);

                    let TxAdd = Engine.AddToTreeWithAll(TreeTTAll, Tt);
                }

                if (global.GetBit(Tt.TTReceive, Level))
                    continue;
                Tt.TTReceive = global.SetBit(Tt.TTReceive, Level);
            }

            for (let t = 0; t < ReqArr.length; t++) {
                global.JINN_STAT.TTTXReceive++;
                global.JINN_STAT["TtReceive" + Level]++;

                let ItemReceive = ReqArr[t];
                let Tt = TreeTTAll.find(ItemReceive);
                if (!Tt) {
                    Tt = Engine.GetTicket(ItemReceive.HashTicket);
                    Child.ToError("Not find item = " + Tt.KEY);
                    continue;
                }

                if (global.GetBit(Tt.TTTXReceive, Level))
                    continue;
                Tt.TTTXReceive = global.SetBit(Tt.TTTXReceive, Level);
            }

            if (CountNew) {
                Engine.StepTaskTt[BlockNum] = 1;
            }
        };
    }
}