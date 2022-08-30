import mInterface from './interface.mjs'
import monopoly from "./monopoly.mjs";
import gameplay from "./gameplay.mjs";
export default {
    get:(obj, payload, ...rest)=>{
        return  new Promise((resolve, reject) => {
            function out(obj) {
                resolve(obj)
            }
            function err(obj) {
                reject(obj)
            }
            switch (obj['type']) {
                case 'chanceAction':
                    (async (obj, payload, rest)=>{
                        //console.assert(false, payload)
                        var p = payload['player'][payload['turn']]; // This is needed for reference in action() method.

                        // $('#popupbackground').hide();
                        // $('#popupwrap').hide();
                        //console.assert(false, p)
                        //console.assert(payload['chanceCards'][obj['chanceIndex']])
                        payload['chanceCards'][obj['chanceIndex']].action(p, payload);
                        await monopoly['get']({type:'updateMoney'}, payload);


                        if (obj['chanceIndex'] !== 15 && !p.human) {
                            p.AI.alertList = "";
                            await mInterface['get']({type:'next', player:p}, obj)
                        }
                        out(payload)
                    })(obj, payload, rest)
                    break
                case 'communityChestAction':
                    (async (obj, payload, rest)=>{
                        //console.assert(false, payload)
                            var p = payload['player'][payload['turn']]; // This is needed for reference in action() method.

                            // $('#popupbackground').hide();
                            // $('#popupwrap').hide();
                            //console.assert(false, payload['communityChestCards'][obj['communityChestIndex']])

                            payload['communityChestCards'][obj['communityChestIndex']].action({player:p},payload);

                             await monopoly['get']({type:'updateMoney'}, payload);

                            if (obj['communityChestIndex'] !== 15 && !p.human) {
                                p.AI.alertList = "";
                                game.next();
                            }

                    })(obj, payload, rest)
                    break
                case 'finalizeAuction':
                    (async (obj, payload, rest)=>{
                        let p = payload['player'][payload['highestbidder']];
                        let sq = payload['square'][payload['auctionproperty']];

                        if (payload['highestbid'] > 0) {
                            p.pay(payload['highestbid'], 0, payload);
                            sq.owner = payload['highestbidder'];
                            await mInterface['get']({type:'addAlert', value:`${p.name} bought ${sq.name} for $ ${payload['highestbid']}.`}, payload);
                        }

                        for (let i = 1; i <= payload['pcount']; i++) {
                            payload['player'][i].bidding = true;
                        }


                        payload['this'].querySelector('#popupbackground').style.display = 'none'
                        payload['this'].querySelector('#popupwrap').style.display = 'none'
                        // $("#popupbackground").hide();
                        // $("#popupwrap").hide();

                        if (! await monopoly['auction']({type:'auction'},payload)) {
                            await gameplay['get']({type:'play', player: p}, payload);
                        }
                        out(payload)
                    })(obj, payload, rest)
                    break
                case 'auctionExit':
                    (async (obj,payload, rest)=>{
                        payload['player'][payload['currentbidder']].bidding = false;
                     await mInterface['get']({type:'auctionPass'}, payload);
                    })(obj,payload, rest)
                    break
                case 'auctionBid':
                    (async (obj,payload, rest)=>{

                        payload['bid'] = obj['bid'] || parseInt(payload['this'].getElementById("bid").value, 10);
                        let  bid = obj['bid'] || parseInt(payload['this'].getElementById("bid").value, 10);

                        if (bid === "" || bid === null) {
                            payload['this'].getElementById("bid").value = "Please enter a bid.";
                            payload['this'].getElementById("bid").style.color = "red";
                        } else if (isNaN(bid)) {
                            payload['this'].getElementById("bid").value = "Your bid must be a number.";
                            payload['this'].getElementById("bid").style.color = "red";
                        } else {

                            if (bid > payload['player'][payload['currentbidder']].money) {
                                payload['this'].getElementById("bid").value = "You don't have enough money to bid $" + bid + ".";
                                payload['this'].getElementById("bid").style.color = "red";
                            } else if (bid > payload['highestbid']) {
                                payload['highestbid'] = bid;
                                payload['this'].getElementById("highestbid").innerHTML = parseInt(bid, 10);
                                payload['highestbidder'] =payload['currentbidder'] ;
                                payload['this'].getElementById("highestbidder").innerHTML = payload['player'][payload['highestbidder']].name;

                                payload['this'].getElementById("bid").focus();

                                if (payload['player'][payload['currentbidder']].human) {
                                    mInterface['get']({type:'auctionPass'}, payload)
                                }
                            } else {
                                payload['this'].getElementById("bid").value = "Your bid must be greater than highest bid. ($" + highestbid + ")";
                                payload['this'].getElementById("bid").style.color = "red";
                            }
                        }
                    })(obj, payload, rest)
                    break
                case 'auctionPass':
                    (async (obj,payload, rest)=>{
                        if (payload['highestbidder'] === 0) {
                            payload['highestbidder'] = payload['currentbidder'];
                        }

                        while (true) {
                            payload['currentbidder']++;

                            if (payload['currentbidder'] > payload['pcount']) {
                                payload['currentbidder'] -= payload['pcount'];
                            }

                            if (payload['currentbidder'] == payload['highestbidder']) {
                                await mInterface['get']({type:'finalizeAuction'}, payload)
                                out(payload)
                            } else if (payload['player'][payload['currentbidder']].bidding) {
                                let p = payload['player'][payload['currentbidder']];

                                if (!p.human) {
                                    let bid = p.AI.bid(payload['auctionproperty'],payload['highestbid']);

                                    if (bid === -1 || payload['highestbid'] >= p.money) {
                                        p.bidding = false;

                                        window.alert(p.name + " exited the auction.");
                                        continue;

                                    } else if (bid === 0) {
                                        window.alert(p.name + " passed.");
                                        continue;

                                    } else if (bid > 0) {
                                        payload['bid'] = bid
                                        await mInterface['get']({type:'auctionBid', bid: bid}, payload)
                                        window.alert(p.name + " bid $" + bid + ".");
                                        continue;
                                    }
                                    out(payload);
                                } else {
                                    break;
                                }
                            }

                        }

                        payload['this'].getElementById("currentbidder").innerHTML = payload['player'][payload['currentbidder']].name;
                        payload['this'].getElementById("bid").value = "";
                        payload['this'].getElementById("bid").style.color = "black";
                    })(obj, payload, rest)
                    break
                default:
                    //console.assert(false, `новая функция ${obj['type']}`)
                    break
            }

        })
    }
}
