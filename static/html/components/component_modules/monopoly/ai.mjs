import square from './square.mjs'
import gamePlay from './gameplay.mjs'
import mInterface from './interface.mjs'
let AI = []
AI['staticProperty'] = []
AI['staticProperty'].count = 0
export default {
	get:(obj, payload, ...rest)=>{
		return  new Promise((resolve, reject) => {
			function out(obj) {
				resolve(obj)
			}
			function wrr(obj) {
				reject(obj)
			}
			switch (obj['type']) {
				case 'AITest':
					(async (obj, payload, rest)=>{
						try {
							obj['player']['AI'] = {}
							obj['player']['AI'].alertList = "";
							AI['staticProperty']['count']++
							obj['player'].name = "AI Test " + 	AI['staticProperty']['count'] ;
							out(payload)
						}catch (e) {

						}
					})(obj,payload, ...rest)
					break
				case 'buyProperty':
					(async (obj, payload, rest)=>{
						try {
							console.log("buyProperty");
							let s = square[index];
							if (p.money > s.price + 50) {
								return true;
							} else {
								return false;
							}
						}catch (e) {

						}
					})(obj,payload, ...rest)
					break
				case 'acceptTrade':
					(async (obj, payload, rest)=>{
						try{
							console.log("acceptTrade");
							let tradeValue = 0;
							let money = tradeObj.getMoney();
							let initiator = tradeObj.getInitiator();
							let recipient = tradeObj.getRecipient();
							let property = [];

							tradeValue += 10 * tradeObj.getCommunityChestJailCard();
							tradeValue += 10 * tradeObj.getChanceJailCard();

							tradeValue += money;

							for (var i = 0; i < 40; i++) {
								property[i] = tradeObj.getProperty(i);
								tradeValue += tradeObj.getProperty(i) * square[i].price * (square[i].mortgage ? 0.5 : 1);
							}

							console.log(tradeValue);

							var proposedMoney = 25 - tradeValue + money;

							if (tradeValue > 25) {
								return true;
							} else if (tradeValue >= -50 && initiator.money > proposedMoney) {

								return new Trade(initiator, recipient, proposedMoney, property, tradeObj.getCommunityChestJailCard(), tradeObj.getChanceJailCard());
							}
						}catch (e) {

						}
					})(obj,payload, ...rest)
					break
				case 'beforeTurn':
					(async (obj, payload, rest)=>{
					let p =	obj['player']
					let s;
					let allGroupOwned;
					let max;
					let leastHouseProperty;
					let leastHouseNumber;
					// Buy houses.
					for (let i = 0; i < 40; i++) {
						s = payload['square'][i];
						if (s.owner === p.index && s.groupNumber >= 3) {
							max = s.group.length;


							console.log(s)
							//console.assert(false, max)
							allGroupOwned = true;
							leastHouseNumber = 6; // No property will ever have 6 houses.

							for (let j = max - 1; j >= 0; j--) {
								if (payload['square'][s.group[j]].owner !== p.index) {
									allGroupOwned = false;
									break;
								}

								if (square[s.group[j]].house < leastHouseNumber) {
									leastHouseProperty = payload['square'][s.group[j]];
									leastHouseNumber = leastHouseProperty.house;
								}
							}

							if (!allGroupOwned) {
								continue;
							}

							if (p.money > leastHouseProperty.houseprice + 100) {
								//console.assert(false, leastHouseProperty)
								buyHouse(leastHouseProperty.index);
							}


						}
					}

					// Unmortgage property
					for (var i = 39; i >= 0; i--) {
						s = payload['square'][i];

						if (s.owner === p.index && s.mortgage && p.money > s.price) {
						await mInterface['get']({type:'unmortgage', count:i}, payload)
						}
					}
					out(false)
					})(obj,payload, ...rest)
					break
				case 'payDebt':
					(async (obj, payload, rest)=>{
						obj['monopoly'] = await square['get']({type:'classic',monopoly:obj['monopoly']})
						for (let i = 39; i >= 0; i--) {
						let	s = obj['monopoly']['square'][i];

							if (s.owner === obj['monopoly']['player'].index && !s.mortgage && s.house === 0) {
								gamePlay['get']({type:'mortgage', value: i}, obj)
								console.log(s.name);
							}



							if (obj['monopoly']['player'].money >= 0) {

								out(obj)
							}
						}
						out(obj)
					})(obj,payload, ...rest)
					break
				case 'bid':
					(async (obj, payload, rest)=>{
						try{
							//console.assert(false, obj)
								let bid;
								 bid = obj['currentBid'] + Math.round(Math.random() * 20 + 10);

								if (p.money < bid + 50 || bid > payload['square'][obj['property']].price * 1.5) {
									return -1;
								} else {
									return bid;
								}
							out(obj)
						}catch (e) {
							//console.assert(false, e)
						}
					})(obj,payload, ...rest)
					break
				case 'postBail':
					(async (obj, payload, rest)=>{
						try{
							//console.assert(false, payload )

							// p.jailroll === 2 on third turn in jail.
							if ((p.communityChestJailCard || p.chanceJailCard) && p.jailroll === 2) {
								return true;
							} else {
								return false;
							}
							out(obj)
						}catch (e) {
							//console.assert(false, e)
						}
					})(obj,payload, ...rest)
					break
				case 'onLand':
					(async (obj, payload, rest)=>{
						try{
							console.log("onLand");
							var proposedTrade;
							var property = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
							var railroadIndexes = [5, 15, 25, 35];
							var requestedRailroad;
							var offeredUtility;
							var s;

							// If AI owns exactly one utility, try to trade it for a railroad.
							for (var i = 0; i < 4; i++) {
								s = square[railroadIndexes[i]];

								if (s.owner !== 0 && s.owner !== p.index) {
									requestedRailroad = s.index;
									break;
								}
							}

							if (square[12].owner === p.index && square[28].owner !== p.index) {
								offeredUtility = 12;
							} else if (square[28].owner === p.index && square[12].owner !== p.index) {
								offeredUtility = 28;
							}

							if (utilityForRailroadFlag && game.getDie(1) !== game.getDie(2) && requestedRailroad && offeredUtility) {
								utilityForRailroadFlag = false;
								property[requestedRailroad] = -1;
								property[offeredUtility] = 1;

								proposedTrade = new Trade(p, player[square[requestedRailroad].owner], 0, property, 0, 0)

								game.trade(proposedTrade);
								return true;
							}

							return false;
							out(obj)
						}catch (e) {
							//console.assert(false, e)
						}
					})(obj,payload, ...rest)
					break
				default:
					break
			}

		})
	}
}
