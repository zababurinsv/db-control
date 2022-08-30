import mInterface from './interface.mjs'
import monopoly from './monopoly.mjs'
import auction from "./auction.mjs";
import classicedition from "./classicedition.mjs";
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
                case 'resetTrade':
                    (async (obj, payload, rest)=>{

                        // console.assert(false, payload)
                        payload['currentSquare'] = {}
                        payload['currentTableRow'] = {}
                        payload['currentTableCell'] = {}
                        payload['currentTableCellCheckbox'] = {}
                        payload['nameSelect'] = {}
                        payload['currentOption'] = {}
                        payload['allGroupUninproved'] = {}
                        payload['currentName'] = {}
                        let currentSquare;
                        let currentTableRow;
                        let currentTableCell;
                        let currentTableCellCheckbox;
                        let nameSelect;
                        let currentOption;
                        let allGroupUninproved;
                        let currentName;

                        let tableRowOnClickLeftp = function(e) {
                            payload['this'].querySelector('#proposetradebutton').style.display = 'flex'
                            payload['this'].querySelector('#canceltradebutton').style.display = 'flex'
                            payload['this'].querySelector('#accepttradebutton').style.display = 'none'
                            payload['this'].querySelector('#rejecttradebutton').style.display = 'none'
                        };

                        let tableRowOnClick = function(e) {

                            let item = e.target.parentNode
                            item = item.querySelector('input')

                            payload['checkboxElement'] = item
                            if (payload['checkboxElement'] !== e.srcElement) {
                                payload['checkboxElement'].checked = !payload['checkboxElement'].checked;
                            }

                            payload['this'].querySelector('#proposetradebutton').style.display = 'flex'
                            payload['this'].querySelector('#canceltradebutton').style.display = 'flex'
                            payload['this'].querySelector('#accepttradebutton').style.display = 'none'
                            payload['this'].querySelector('#rejecttradebutton').style.display = 'none'
                        };

                        let initiatorProperty = payload['this'].getElementById("trade-leftp-property");
                        let recipientProperty = payload['this'].getElementById("trade-rightp-property");

                        payload['tradeObj']['currentInitiator'] = payload['tradeObj']['initiator'];
                        payload['tradeObj']['currentRecipient'] = payload['tradeObj']['recipient'];

                        // Empty elements.
                        while (initiatorProperty.lastChild) {
                            initiatorProperty.removeChild(initiatorProperty.lastChild);
                        }

                        while (recipientProperty.lastChild) {
                            recipientProperty.removeChild(recipientProperty.lastChild);
                        }

                        let initiatorSideTable = document.createElement("table");
                        let recipientSideTable = document.createElement("table");


                        for (let i = 0; i < 40; i++) {
                            currentSquare = payload['square'][i];

                            // A property cannot be traded if any properties in its group have been improved.
                            if (currentSquare.house > 0 || currentSquare.groupNumber === 0) {
                                continue;
                            }

                            allGroupUninproved = true;
                            let max = currentSquare.group.length;
                            for (let j = 0; j < max; j++) {

                                if (payload['square'][currentSquare.group[j]].house > 0) {
                                    allGroupUninproved = false;
                                    break;
                                }
                            }

                            if (!allGroupUninproved) {
                                continue;
                            }

                            // Offered properties.
                            if (currentSquare.owner === obj['initiator'].index) {
                                currentTableRow = initiatorSideTable.appendChild(document.createElement("tr"));
                                currentTableRow.addEventListener('click', tableRowOnClick)

                                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                                currentTableCell.className = "propertycellcheckbox";
                                currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
                                currentTableCellCheckbox.type = "checkbox";
                                currentTableCellCheckbox.id = "tradeleftcheckbox" + i;
                                currentTableCellCheckbox.title = "Check this box to include " + currentSquare.name + " in the trade.";

                                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                                currentTableCell.className = "propertycellcolor";
                                currentTableCell.setAttribute('show', i)
                                currentTableCell.style.backgroundColor = currentSquare.color;

                                if (currentSquare.groupNumber == 1 || currentSquare.groupNumber == 2) {
                                    currentTableCell.style.borderColor = "grey";
                                } else {
                                    currentTableCell.style.borderColor = currentSquare.color;
                                }

                                currentTableCell.propertyIndex = i;
                                currentTableCell.onmouseover = async function(event) {

                                    // console.assert(false, event.target.getAttribute('show'))
                                    await  mInterface['get']({type:'showdeed', property:event.target.getAttribute('show')}, payload)

                                };
                                currentTableCell.onmouseout = function(event) {
                                    payload['this'].querySelector('#deed').style.display = 'none'
                                    // $("#deed").hide();
                                };

                                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                                currentTableCell.className = "propertycellname";
                                if (currentSquare.mortgage) {
                                    currentTableCell.title = "Mortgaged";
                                    currentTableCell.style.color = "grey";
                                }
                                currentTableCell.textContent = currentSquare.name;

                                // Requested properties.
                            } else if (currentSquare.owner === payload['tradeObj']['recipient'].index) {
                                currentTableRow = recipientSideTable.appendChild(document.createElement("tr"));
                                currentTableRow.addEventListener('click', tableRowOnClick)

                                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                                currentTableCell.className = "propertycellcheckbox";
                                currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
                                currentTableCellCheckbox.type = "checkbox";
                                currentTableCellCheckbox.id = "traderightcheckbox" + i;
                                currentTableCellCheckbox.title = "Check this box to include " + currentSquare.name + " in the trade.";

                                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                                currentTableCell.className = "propertycellcolor";
                                currentTableCell.setAttribute('show', i)
                                currentTableCell.style.backgroundColor = currentSquare.color;

                                if (currentSquare.groupNumber == 1 || currentSquare.groupNumber == 2) {
                                    currentTableCell.style.borderColor = "grey";
                                } else {
                                    currentTableCell.style.borderColor = currentSquare.color;
                                }

                                currentTableCell.propertyIndex = i;
                                currentTableCell.onmouseover =async function(event) {

                                    await  mInterface['get']({type:'showdeed', property:event.target.getAttribute('show')}, payload)


                                };
                                currentTableCell.onmouseout =function() {
                                    payload['this'].querySelector('#deed').style.display = 'none'
                                    // $("#deed").hide();
                                };

                                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                                currentTableCell.className = "propertycellname";
                                if (currentSquare.mortgage) {
                                    currentTableCell.title = "Mortgaged";
                                    currentTableCell.style.color = "grey";
                                }
                                currentTableCell.textContent = currentSquare.name;
                            }
                        }

                        if (payload['tradeObj']['initiator'].communityChestJailCard) {
                            currentTableRow = initiatorSideTable.appendChild(document.createElement("tr"));
                            currentTableRow.addEventListener('click', tableRowOnClick)

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellcheckbox";
                            currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
                            currentTableCellCheckbox.type = "checkbox";
                            currentTableCellCheckbox.id = "tradeleftcheckbox40";
                            currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellcolor";
                            currentTableCell.style.backgroundColor = "white";
                            currentTableCell.style.borderColor = "grey";

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellname";

                            currentTableCell.textContent = "Get Out of Jail Free Card";
                        } else if (payload['tradeObj']['recipient'].communityChestJailCard) {
                            currentTableRow = recipientSideTable.appendChild(document.createElement("tr"));
                            currentTableRow.addEventListener('click', tableRowOnClick)

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellcheckbox";
                            currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
                            currentTableCellCheckbox.type = "checkbox";
                            currentTableCellCheckbox.id = "traderightcheckbox40";
                            currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellcolor";
                            currentTableCell.style.backgroundColor = "white";
                            currentTableCell.style.borderColor = "grey";

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellname";

                            currentTableCell.textContent = "Get Out of Jail Free Card";
                        }

                        if (payload['tradeObj']['initiator'].chanceJailCard) {
                            currentTableRow = initiatorSideTable.appendChild(document.createElement("tr"));
                            currentTableRow.addEventListener('click', tableRowOnClick)

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellcheckbox";
                            currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
                            currentTableCellCheckbox.type = "checkbox";
                            currentTableCellCheckbox.id = "tradeleftcheckbox41";
                            currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellcolor";
                            currentTableCell.style.backgroundColor = "white";
                            currentTableCell.style.borderColor = "grey";

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellname";

                            currentTableCell.textContent = "Get Out of Jail Free Card";
                        } else if (payload['tradeObj']['recipient'].chanceJailCard) {
                            currentTableRow = recipientSideTable.appendChild(document.createElement("tr"));
                            currentTableRow.addEventListener('click', tableRowOnClick)

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellcheckbox";
                            currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
                            currentTableCellCheckbox.type = "checkbox";
                            currentTableCellCheckbox.id = "traderightcheckbox41";
                            currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellcolor";
                            currentTableCell.style.backgroundColor = "white";
                            currentTableCell.style.borderColor = "grey";

                            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                            currentTableCell.className = "propertycellname";

                            currentTableCell.textContent = "Get Out of Jail Free Card";
                        }

                        // console.assert(false)

                        if (initiatorSideTable.lastChild) {
                            initiatorProperty.appendChild(initiatorSideTable);
                        } else {
                            initiatorProperty.textContent = payload['tradeObj']['initiator'].name + " has no properties to trade.";
                        }

                        if (recipientSideTable.lastChild) {
                            recipientProperty.appendChild(recipientSideTable);
                        } else {
                            recipientProperty.textContent = payload['tradeObj']['recipient'].name + " has no properties to trade.";
                        }

                        payload['this'].getElementById("trade-leftp-name").textContent = payload['tradeObj']['initiator'].name;

                        currentName = payload['this'].getElementById("trade-rightp-name");

                        // console.assert(false, obj)
                        if (obj['allowRecipientToBeChanged'] && payload['pcount'] > 2) {
                            // Empty element.
                            while (currentName.lastChild) {
                                currentName.removeChild(currentName.lastChild);
                            }

                            nameSelect = currentName.appendChild(document.createElement("select"));
                            for (let i = 1; i <= payload['pcount']; i++) {
                                if (i === payload['tradeObj']['initiator'].index) {
                                    continue;
                                }

                                currentOption = nameSelect.appendChild(document.createElement("option"));
                                currentOption.value = i + "";
                                currentOption.style.color = payload['player'][i].color;
                                currentOption.textContent = payload['player'][i].name;

                                if (i === payload['tradeObj']['recipient'].index) {
                                    currentOption.selected = "selected";
                                }
                            }

                            nameSelect.onchange = async function(event) {
                                let curentPlayer = parseInt(event.target.value, 10)
                                await mInterface['get']({type:'getTrade'},payload)
                                payload['tradeObj']['recipient'] = payload['player'][curentPlayer]
                                payload['tradeObj']['currentRecipient'] = payload['player'][curentPlayer]
                                await monopoly['get']({type:'resetTrade',initiator:payload['tradeObj']['currentInitiator'],recipient:payload['player'][curentPlayer],allowRecipientToBeChanged: true }, payload)
                            };

                            nameSelect.title = "Select a player to trade with.";
                        } else {
                            currentName.textContent = payload['tradeObj']['recipient'].name;
                        }

                        payload['this'].getElementById("trade-leftp-money").value = "0";
                        payload['this'].getElementById("trade-leftp-money").addEventListener('input', tableRowOnClickLeftp)
                        payload['this'].getElementById("trade-rightp-money").value = "0";
                        payload['this'].getElementById("trade-rightp-money").addEventListener('input', tableRowOnClickLeftp)
                        // console.assert(false)
                        out(true)
                    })(obj, payload, rest)
                    break
                case 'proposeTrade':
                    (async (obj, payload, rest)=>{
                        if (isNaN(payload['this'].getElementById("trade-leftp-money").value)) {
                            payload['this'].getElementById("trade-leftp-money").value = "This value must be a number.";
                            payload['this'].getElementById("trade-leftp-money").style.color = "red";
                            return false;
                        }

                        if (isNaN(payload['this'].getElementById("trade-rightp-money").value)) {
                            payload['this'].getElementById("trade-rightp-money").value = "This value must be a number.";
                            payload['this'].getElementById("trade-rightp-money").style.color = "red";
                            return false;
                        }

                        let tradeObj = readTrade();
                        let money = tradeObj.getMoney();
                        let initiator = tradeObj.getInitiator();
                        let recipient = tradeObj.getRecipient();
                        let reversedTradeProperty = [];

                        if (money > 0 && money > initiator.money) {
                            payload['this'].getElementById("trade-leftp-money").value = initiator.name + " does not have $" + money + ".";
                            payload['this'].getElementById("trade-leftp-money").style.color = "red";
                            return false;
                        } else if (money < 0 && -money > recipient.money) {
                            payload['this'].getElementById("trade-rightp-money").value = recipient.name + " does not have $" + (-money) + ".";
                            payload['this'].getElementById("trade-rightp-money").style.color = "red";
                            return false;
                        }

                        let isAPropertySelected = 0;

                        // Ensure that some properties are selected.
                        for (let i = 0; i < 40; i++) {
                            reversedTradeProperty[i] = -tradeObj.getProperty(i);
                            isAPropertySelected |= tradeObj.getProperty(i);
                        }

                        isAPropertySelected |= tradeObj.getCommunityChestJailCard();
                        isAPropertySelected |= tradeObj.getChanceJailCard();

                        if (isAPropertySelected === 0) {
                            popup("<p>One or more properties must be selected in order to trade.</p>");

                            return false;
                        }

                        if (initiator.human && !confirm(initiator.name + ", are you sure you want to make this offer to " + recipient.name + "?")) {
                            return false;
                        }

                        let reversedTrade = new Trade(recipient, initiator, -money, reversedTradeProperty, -tradeObj.getCommunityChestJailCard(), -tradeObj.getChanceJailCard());

                        if (recipient.human) {

                            writeTrade(reversedTrade);

                            // $("#proposetradebutton").hide();
                            // $("#canceltradebutton").hide();
                            // $("#accepttradebutton").show();
                            // $("#rejecttradebutton").show();

                            payload['this'].querySelector('#proposetradebutton').style.display = 'none'
                            payload['this'].querySelector('#canceltradebutton').style.display = 'none'
                            payload['this'].querySelector('#accepttradebutton').style.display = 'flex'
                            payload['this'].querySelector('#rejecttradebutton').style.display = 'flex'

                            addAlert(initiator.name + " initiated a trade with " + recipient.name + ".");
                            popup("<p>" + initiator.name + " has proposed a trade with you, " + recipient.name + ". You may accept, reject, or modify the offer.</p>");
                        } else {
                            let tradeResponse = recipient.AI.acceptTrade(tradeObj);

                            if (tradeResponse === true) {
                                popup("<p>" + recipient.name + " has accepted your offer.</p>");
                                this.acceptTrade(reversedTrade);
                            } else if (tradeResponse === false) {
                                popup("<p>" + recipient.name + " has declined your offer.</p>");
                                return;
                            } else if (tradeResponse instanceof Trade) {
                                popup("<p>" + recipient.name + " has proposed a counteroffer.</p>");
                                writeTrade(tradeResponse);

                                $("#proposetradebutton, #canceltradebutton").hide();
                                $("#accepttradebutton").show();
                                $("#rejecttradebutton").show();
                            }
                        }
                    })(obj, payload, rest)
                    break
                case 'gotojail':
                    (async (obj, payload, rest)=>{
                        let p = payload['player'][payload['turn']];
                        await monopoly['get']({type:'addAlert',value:`${p.name} was sent directly to jail.`  },payload)
                        payload['this'].getElementById("landed").innerHTML = "You are in jail.";
                        p.jail = true;
                        payload['doublecount'] = 0;
                        payload['this'].getElementById("nextbutton").value = "End turn";
                        payload['this'].getElementById("nextbutton").title = "End turn and advance to the next player.";
                        if (p.human) {
                            payload['this'].getElementById("nextbutton").focus();
                        }


                        await   monopoly['get']({type:'updatePosition', player: p}, payload)
                        await   monopoly['get']({type:'updateOwned', value:`` }, payload)

                        if (!p.human) {
                            popup(p.AI.alertList, game.next);
                            p.AI.alertList = "";
                        }

                    })(obj, payload, rest)
                    break
                case 'showdeed':
                    (async (obj,payload, rest)=>{
                        // console.assert(false, payload)
                        let sq = payload['square'][obj['property']];
                        payload['this'].querySelector('#deed').style.display = 'flex'
                        payload['this'].querySelector('#deed-normal').style.display = 'none'
                        payload['this'].querySelector('#deed-mortgaged').style.display = 'none'
                        payload['this'].querySelector('#deed-special').style.display = 'none'
                        // $("#deed").show();

                        // $("#deed-normal").hide();
                        // $("#deed-mortgaged").hide();
                        // $("#deed-special").hide();

                        if (sq.mortgage) {
                            payload['this'].querySelector('#deed-mortgaged').style.display = 'flex'
                            // $("#deed-mortgaged").show();
                            payload['this'].getElementById("deed-mortgaged-name").textContent = sq.name;
                            payload['this'].getElementById("deed-mortgaged-mortgage").textContent = (sq.price / 2);

                        } else {

                            if (sq.groupNumber >= 3) {
                                payload['this'].querySelector('#deed-normal').style.display = 'flex'
                                // $("#deed-normal").show();
                                payload['this'].getElementById("deed-header").style.backgroundColor = sq.color;
                                payload['this'].getElementById("deed-name").textContent = sq.name;
                                payload['this'].getElementById("deed-baserent").textContent = sq.baserent;
                                payload['this'].getElementById("deed-rent1").textContent = sq.rent1;
                                payload['this'].getElementById("deed-rent2").textContent = sq.rent2;
                                payload['this'].getElementById("deed-rent3").textContent = sq.rent3;
                                payload['this'].getElementById("deed-rent4").textContent = sq.rent4;
                                payload['this'].getElementById("deed-rent5").textContent = sq.rent5;
                                payload['this'].getElementById("deed-mortgage").textContent = (sq.price / 2);
                                payload['this'].getElementById("deed-houseprice").textContent = sq.houseprice;
                                payload['this'].getElementById("deed-hotelprice").textContent = sq.houseprice;

                            } else if (sq.groupNumber == 2) {
                                payload['this'].querySelector('#deed-special').style.display = 'flex'
                                payload['this'].getElementById("deed-special-name").textContent = sq.name;
                                payload['this'].getElementById("deed-special-text").innerHTML = await classicedition['get']({type:'utiltext'}, payload);
                                payload['this'].getElementById("deed-special-mortgage").textContent = (sq.price / 2);

                            } else if (sq.groupNumber == 1) {
                                payload['this'].querySelector('#deed-special').style.display = 'flex'
                                payload['this'].getElementById("deed-special-name").textContent = sq.name;
                                payload['this'].getElementById("deed-special-text").innerHTML = await classicedition['get']({type:'transtext'}, payload);
                                payload['this'].getElementById("deed-special-mortgage").textContent = (sq.price / 2);
                            }
                        }
                    })(obj, payload, rest)
                    break
                case 'land':
                    (async (obj,payload,  rest)=>{
                        obj['increasedRent'] = !!obj['increasedRent'] ; // Cast increasedRent to a boolean value. It is used for the ADVANCE TO THE NEAREST RAILROAD/UTILITY Chance cards.
                        let p = payload['player'][payload['turn']];
                        let s = payload['square'][p.position];


                        let die1 = payload['die1']
                        let die2 = payload['die2']
                        // console.assert(false)
                        payload['this'].querySelector('#landed').style.display ='flex'
                        payload['this'].querySelector("#landed").innerHTML = "You landed on " + s.name +".";
                        s.landcount++;
                        await mInterface['get']({type:'addAlert', value:`${p.name} landed on ${s.name}.`}, payload);
                        // Allow player to buy the property on which he landed.
                        if (s.price !== 0 && s.owner === 0) {

                            if (!p.human) {

                                if (p.AI.buyProperty(p.position)) {
                                    await mInterface['get']({type:'buy'},payload)
                                }
                            } else {
                                payload['this'].querySelector(`#landed`).innerHTML ="<div>You landed on <a href='javascript:void(0);' id='previeCard' class='statscellcolor'>" + s.name + "."+"</a><input type='button' id='buyCards' value='Buy ($" + s.price + ")' title='Buy " + s.name + " for " + s.pricetext + ".'/></div>"


                                payload['this'].querySelector(`#buyCards`).addEventListener('click', async (event)=>{
                                    // console.assert(false)
                                    let p = payload['player'][payload['turn']]
                                    let property = payload['square'][p.position];
                                    let cost = property.price;

                                    if (p.money >= cost) {
                                        let auctionQueue = []
                                        for(let i =0; i < payload['auctionQueue'].length;i++){
                                            if(payload['auctionQueue'][i] === p['position']){

                                            }else{
                                                auctionQueue.push(payload['auctionQueue'][i])
                                            }
                                        }
                                        payload['auctionQueue'] = auctionQueue
                                        p.pay(cost, 0, payload);

                                        property.owner = payload['turn'];

                                        await mInterface['get']({type:'updateMoney'},payload)
                                        await mInterface['get']({type:'addAlert', value:`${p.name} bought ${property.name} for ${property.pricetext}.`}, payload);
                                        await mInterface['get']({type:'updateOwned' }, payload)

                                        payload['this'].querySelector("#landed").style.display = 'none'
                                        // $("#landed").hide();

                                    } else {
                                        await mInterface['get']({type:'popup', HTML: "<p>" + p.name + ", you need $" + (property.price - p.money) + " more to buy " + property.name + ".</p>"}, payload)
                                    }
                                })
                                payload['this'].querySelector(`#previeCard`).addEventListener('mouseover', async (event)=>{
                                    let p = payload['player'][payload['turn']]
                                    let sq = payload['square'][p.position];
                                    payload['this'].querySelector('#deed').style.display = 'flex'
                                    // $("#deed").show();

                                    payload['this'].querySelector('#deed-special').style.display = 'none'
                                    payload['this'].querySelector('#deed-normal').style.display = 'none'
                                    payload['this'].querySelector('#deed-mortgaged').style.display = 'none'
                                    // $("#deed-normal").hide();
                                    // $("#deed-mortgaged").hide();
                                    // $("#deed-special").hide();

                                    if (sq.mortgage) {
                                        // $("#deed-mortgaged").show();
                                        payload['this'].querySelector('#deed-mortgaged').style.display = 'flex'
                                        payload['this'].getElementById("deed-mortgaged-name").textContent = sq.name;
                                        payload['this'].getElementById("deed-mortgaged-mortgage").textContent = (sq.price / 2);

                                    } else {

                                        if (sq.groupNumber >= 3) {
                                            // $("#deed-normal").show();
                                            payload['this'].querySelector('#deed-normal').style.display = 'flex'
                                            payload['this'].getElementById("deed-header").style.backgroundColor = sq.color;
                                            payload['this'].getElementById("deed-name").textContent = sq.name;
                                            payload['this'].getElementById("deed-baserent").textContent = sq.baserent;
                                            payload['this'].getElementById("deed-rent1").textContent = sq.rent1;
                                            payload['this'].getElementById("deed-rent2").textContent = sq.rent2;
                                            payload['this'].getElementById("deed-rent3").textContent = sq.rent3;
                                            payload['this'].getElementById("deed-rent4").textContent = sq.rent4;
                                            payload['this'].getElementById("deed-rent5").textContent = sq.rent5;
                                            payload['this'].getElementById("deed-mortgage").textContent = (sq.price / 2);
                                            payload['this'].getElementById("deed-houseprice").textContent = sq.houseprice;
                                            payload['this'].getElementById("deed-hotelprice").textContent = sq.houseprice;
                                        } else if (sq.groupNumber == 2) {
                                            // $("#deed-special").show();
                                            payload['this'].querySelector('#deed-special').style.display = 'flex'
                                            payload['this'].getElementById("deed-special-name").textContent = sq.name;
                                            payload['this'].getElementById("deed-special-text").innerHTML = await classicedition['get']({type:'utiltext'}, payload);
                                            payload['this'].getElementById("deed-special-mortgage").textContent = (sq.price / 2);
                                        } else if (sq.groupNumber == 1) {
                                            // $("#deed-special").show();
                                            payload['this'].querySelector('#deed-special').style.display = 'flex'
                                            payload['this'].getElementById("deed-special-name").textContent = sq.name;
                                            payload['this'].getElementById("deed-special-text").innerHTML = await classicedition['get']({type:'transtext'}, payload);
                                            payload['this'].getElementById("deed-special-mortgage").textContent = (sq.price / 2);
                                        }
                                    }



                                })
                                payload['this'].querySelector(`#previeCard`).addEventListener('mouseout', (event)=>{
                                    payload['this'].querySelector('#deed').style.display = 'none'
                                })

                            }
                            await  mInterface['get']({type:'addPropertyToAuctionQueue', propertyIndex:p.position},payload)
                        }

                        // Collect rent
                        if (s.owner !== 0 && s.owner != payload['turn'] && !s.mortgage) {
                            let groupowned = true;
                            payload['groupowned'] = true
                            let rent;

                            // Railroads
                            if (p.position == 5 || p.position == 15 || p.position == 25 || p.position == 35) {
                                if (obj['increasedRent']) {
                                    rent = 25;
                                    payload['rent']= 25;
                                } else {
                                    payload['rent']= 12.5;
                                    rent = 12.5;
                                }

                                if (s.owner == payload['square'][5].owner) {
                                    rent *= 2;
                                    payload['rent'] *= 2;
                                }
                                if (s.owner == payload['square'][15].owner) {
                                    rent *= 2;
                                    payload['rent'] *= 2;
                                }
                                if (s.owner == payload['square'][25].owner) {
                                    rent *= 2;
                                    payload['rent'] *= 2;
                                }
                                if (s.owner == payload['square'][35].owner) {
                                    rent *= 2;
                                    payload['rent'] *= 2;
                                }

                            } else if (p.position === 12) {
                                if (obj['increasedRent'] || payload['square'][28].owner == s.owner) {
                                    rent = (die1 + die2) * 10;
                                    payload['rent'] = (die1 + die2) * 10;
                                } else {
                                    rent = (die1 + die2) * 4;
                                    payload['rent'] = (die1 + die2) * 4;
                                }

                            } else if (p.position === 28) {
                                if (obj['increasedRent'] || payload['square'][12].owner == s.owner) {
                                    rent = (die1 + die2) * 10;
                                    payload['rent'] = (die1 + die2) * 10;
                                } else {
                                    rent = (die1 + die2) * 4;
                                    payload['rent'] = (die1 + die2) * 4;
                                }

                            } else {

                                for (let i = 0; i < 40; i++) {
                                    let sq = payload['square'][i];
                                    if (sq.groupNumber == s.groupNumber && sq.owner != s.owner) {
                                        groupowned = false;
                                        payload['groupowned'] = false
                                    }
                                }

                                if (!groupowned) {
                                    rent = s.baserent;
                                    payload['rent'] = s.baserent;
                                } else {
                                    if (s.house === 0) {
                                        rent = s.baserent * 2;
                                        payload['rent'] = s.baserent * 2;
                                    } else {
                                        rent = s["rent" + s.house];
                                        payload['rent'] = s["rent" + s.house];
                                    }
                                }
                            }
                            await mInterface['get']({type:'addAlert', value:`${p.name} paid $" ${rent} rent to. ${payload['player'][s.owner].name}`}, payload);
                            p.pay(rent, s.owner, payload);
                            payload['player'][s.owner].money += rent;

                            payload['this'].getElementById("landed").innerHTML = "You landed on " + s.name + ". " + payload['player'][s.owner].name + " collected $" + rent + " rent.";
                        } else if (s.owner > 0 && s.owner != payload['turn'] && s.mortgage) {
                            payload['this'].getElementById("landed").innerHTML = "You landed on " + s.name + ". Property is mortgaged; no rent was collected.";
                        }

                        // City Tax
                        if (p.position === 4) {
                            await mInterface['get']({type:'citytax'},payload)
                        }

                        // Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.
                        if (p.position === 30) {
                            await mInterface['get']({type:'updateMoney'},payload)
                            await mInterface['get']({type:'updatePosition' }, payload)

                            if (p.human) {
                                console.assert(false)
                                // popup("<div>Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.</div>", gotojail);
                                // await mInterface['get']({type:'popup', value:"<div>Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.</div>", action:  await mInterface['get']({type:'gotojail'},payload)},payload)
                                await mInterface['get']({type:'popup', HTML:"<div>Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.</div>",action:async ()=>{

                                        await mInterface['get']({type:'gotojail'},payload)

                                    }, option:null},payload)
                            } else {
                                await mInterface['get']({type:'gotojail'},payload)
                            }

                            out(payload)
                        }

                        // Luxury Tax
                        if (p.position === 38) {
                            await mInterface['get']({type:'luxurytax'},payload)
                        }

                        await mInterface['get']({type:'updateMoney'},payload)
                        await mInterface['get']({type:'updatePosition' }, payload)
                        // console.assert(false)
                        await mInterface['get']({type:'updateOwned' }, payload)


                        if (!p.human) {
                            popup(p.AI.alertList, chanceCommunityChest);
                            p.AI.alertList = "";
                        } else {

                            await mInterface['get']({type:'chanceCommunityChest' }, payload)
                        }
                        //console.assert(false, payload)
                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'updateMoney':
                    (async (obj, payload, rest)=>{

                        // console.assert(false, payload)
                        // console.log(obj)
                        // console.assert(false, payload)
                        let p = payload['player'][payload['turn']];
                        payload['this'].querySelector("#pmoney").innerHTML = "$" + p.money;
                        for(let i =0; i < payload['this'].querySelectorAll('.money-bar-row').length; i++){
                            payload['this'].querySelectorAll('.money-bar-row')[i].style.display = 'none'
                        }
                        // console.assert(false)
                        for (let i = 1; i <= payload['pcount']; i++) {
                            let p_i =  payload['player'][i];
                            payload['this'].querySelector(`#moneybarrow${i}`).style.display = 'flex'
                            payload['this'].getElementById("p" + i + "moneybar").style.border = "0.195vw solid " + p_i.color;
                            payload['this'].getElementById("p" + i + "money").innerHTML = p_i.money;
                            payload['this'].getElementById("p" + i + "moneyname").innerHTML = p_i.name;
                        }

                        // show("moneybarrow9"); // Don't remove this line or make the first for-loop stop when i <= 8, because this affects how the table is displayed.

                        if (payload['this'].querySelector("#landed").innerHTML === "") {

                            payload['this'].querySelector('#landed').style.display = 'none'
                        }

                        payload['this'].querySelector("#quickstats").style.borderColor = p.color;

                        if (p.money < 0) {
                            // payload['this'].getElementById("nextbutton").disabled = true;
                            payload['this'].querySelector('#resignbutton').style.display = 'flex'
                            payload['this'].querySelector('#nextbutton').style.display = 'none'
                        } else {
                            // payload['this'].getElementById("nextbutton").disabled = false;
                            payload['this'].querySelector('#resignbutton').style.display = 'none'
                            payload['this'].querySelector('#nextbutton').style.display = 'flex'
                        }
                        out(payload)
                    })(obj, payload, rest)
                    break
                case 'trade':
                    (async (obj, payload, rest)=>{
                        // payload['this'].querySelector('#board').style.display = 'none'
                        // payload['this'].querySelector('#control').style.display = 'none'
                        payload['this'].querySelector('#trade').style.display = 'flex'
                        payload['this'].querySelector('#popupbackground').style.display = 'flex'
                        payload['this'].querySelector('#proposetradebutton').style.display = 'flex'
                        payload['this'].querySelector('#canceltradebutton').style.display = 'flex'
                        payload['this'].querySelector('#accepttradebutton').style.display = 'none'
                        payload['this'].querySelector('#rejecttradebutton').style.display = 'none'
                        // $("#board").hide();
                        // $("#control").hide();
                        // $("#trade").show();
                        // $("#proposetradebutton").show();
                        // $("#canceltradebutton").show();
                        // $("#accepttradebutton").hide();
                        // $("#rejecttradebutton").hide();
                        // console.assert(false)
                        if (obj['tradeObj'] !== null) {
                            await mInterface['get']({type:'writeTrade', tradeObj:obj['tradeObj']},payload)
                            await mInterface['get']({type:'proposeTrade'},payload)
                        } else {
                            let initiator = payload['player'][payload['turn']];
                            let recipient = payload['turn'] === 1 ? payload['player'][2] : payload['player'][1];
                            await mInterface['get']({
                                type:'trade',
                                initiator:initiator,
                                recipient:recipient,
                                property: null,
                                money: null,
                                communityChestJailCard:null,
                                chanceJailCard: null
                            }, payload)
                            payload['tradeObj']['currentInitiator'] = payload['tradeObj']['initiator']
                            payload['tradeObj']['currentRecipient'] = payload['tradeObj']['recipient']
                            let currentInitiator = initiator;
                            let currentRecipient = recipient;
                            await mInterface['get']({type:'resetTrade', initiator:initiator, recipient:recipient, allowRecipientToBeChanged:true },payload)
                        }
                    })(obj, payload, rest)
                    break
                case 'popup':
                    (async (obj, payload, rest)=>{
                        // console.assert(false, obj)
                        payload['this'].getElementById("popuptext").innerHTML = obj['HTML'];
                        payload['this'].getElementById("popup").style.width = "61.297vw";
                        payload['this'].getElementById("popup").style.height = "16.297vw;";
                        payload['this'].getElementById("popup").style.top = "0";
                        payload['this'].getElementById("popup").style.left = "0";

                        if (!obj['option'] && typeof obj['action'] === "string") {
                            obj['option'] = obj['action'];
                        }

                        obj['option'] =   obj['option'] ?   obj['option'].toLowerCase() : "";

                        if (typeof obj['action'] !== "function") {
                            obj['action'] = null;
                        }

                        // Yes/No
                        if (  obj['option'] === "yes/no") {
                            payload['this'].getElementById("popuptext").innerHTML += "<div><input type=\"button\" value=\"Yes\" id=\"popupyes\" /><input type=\"button\" value=\"No\" id=\"popupno\" /></div>";

                            payload['this'].querySelector('#popupyes').addEventListener('click',async ()=>{
                                console.assert(false, payload)
                                payload['this'].querySelector('#popupwrap').style.display = 'none'
                                payload['this'].querySelector('#popupbackground').style.display = 'none'
                                obj['action'](obj, payload)
                            });
                            payload['this'].querySelector('#popupno').addEventListener('click',async ()=>{

                                console.assert(false)
                                payload['this'].querySelector('#popupwrap').style.display = 'none'
                                payload['this'].querySelector('#popupbackground').style.display = 'none'
                            });

                            // payload['this'].querySelector('#popupno').addEventListener('click',async ()=>{
                            //     console.assert(false)
                            //     obj['action'](obj, payload)
                            // });
                            // Ok
                        } else if (obj['option'] !== "blank") {

                            // console.assert(false, payload)

                            if(!payload['this'].querySelector('.containerCard')){
                                payload['this'].querySelector('#popuptext').insertAdjacentHTML('beforeend', "<div><input type='button' value='OK' id='popupclose' /></div>")
                            }else{
                                payload['this'].querySelector('.containerCard').insertAdjacentHTML('beforeend', "<div><input type='button' value='OK' id='popupclose' /></div>")
                            }

                            payload['this'].querySelector('#popupclose').focus()


                            payload['this'].querySelector('#popupclose').addEventListener('click',async ()=>{
                                payload['this'].querySelector('#popupwrap').style.display = 'none'
                                if(obj['action'] === null){
                                    if(obj['HTML'].indexOf('Go to jail') >  -1){
                                        payload['this'].querySelector('#popupbackground').style.display = 'none'
                                    }else if(obj['HTML'].indexOf('more to buy') >  -1){
                                        payload['this'].querySelector('#popupbackground').style.display = 'none'
                                    }
                                }else{
                                    payload['this'].querySelector('#popupbackground').style.display = 'none'
                                    obj['action'](obj, payload)
                                }
                            });
                        }

                        payload['this'].querySelector('#popupwrap').style.display = 'flex'
                        payload['this'].querySelector('#popupbackground').style.display = 'flex'
                        // Show using animation.
                        if(!payload['this'].querySelector('#auctionBidItem')){}else{
                            payload['this'].querySelector('#auctionBidItem').addEventListener('click',async ()=>{

                                //console.assert(false, payload)
                                await auction['get']({type:'auctionBid', bid: null},payload)
                            });
                        }

                        if(!payload['this'].querySelector('#auctionPassItem')){}else{
                            payload['this'].querySelector('#auctionPassItem').addEventListener('click',async ()=>{

                                //console.assert(false, payload)
                                await auction['get']({type:'auctionPass'},payload)
                            });
                        }

                        if(!payload['this'].querySelector('#exitAuctionItem')){}else{
                            payload['this'].querySelector('#exitAuctionItem').addEventListener('click',async ()=>{
                                //console.assert(false, payload)
                                if (confirm("Are you sure you want to stop bidding on this property altogether?")){
                                    await auction['get']({type:'auctionExit'},payload)
                                }
                            });
                        }

                        payload['this'].querySelector('#popupwrap').style.display = 'flex'
                        // $("#popupbackground").fadeIn(400, function() {

                        // $("#popupwrap").show();
                        // });
                        out(payload)
                    })(obj, payload, rest)
                    break
                case'updatePosition':
                    (async (obj, payload, rest)=>{

                        // console.assert(false)
                        // console.assert(false, payload['this'])
                        // Reset borders
                        payload['this'].getElementById("jail").style.border = "0.098vw solid black";
                        if(payload['this'].querySelector('#jailpositionholder')){
                            payload['this'].querySelector('#jailpositionholder').innerHTML = "";
                        }
                        for (let i = 0; i < 40; i++) {
                            payload['this'].getElementById("cell" + i).style.border = "0.098vw solid black";
                            payload['this'].getElementById("cell" + i + "positionholder").innerHTML = "";

                        }

                        let sq, left, top;

                        for (let x = 0; x < 40; x++) {
                            sq = payload['square'][x];
                            left = 0;
                            top = 0;

                            for (let y = payload['turn']; y <= payload['pcount']; y++) {

                                if (payload['player'][y].position === x && !payload['player'][y].jail) {
                                    payload['this'].getElementById("cell" + x + "positionholder").innerHTML += "<div class='cell-position' title='" + payload['player'][y].name + "' style='background-color: " + payload['player'][y].color + "; left: " + left + "vw; top: " + top + "px;'></div>";
                                    if (left == 36) {
                                        left = 0;
                                        top = 12;
                                    } else
                                        left += 1.2;
                                }
                            }

                            for (let y = 1; y < payload['turn']; y++) {

                                if (payload['player'][y].position == x && !payload['player'][y].jail) {
                                    payload['this'].getElementById("cell" + x + "positionholder").innerHTML += "<div class='cell-position' title='" + payload['player'][y].name + "' style='background-color: " + payload['player'][y].color + "; left: " + left + "vw; top: " + top + "px;'></div>";
                                    if (left == 36) {
                                        left = 0;
                                        top = 12;
                                    } else
                                        left += 1.2;
                                }
                            }
                        }

                        left = 0;
                        top = 63;
                        for (let i = payload['turn']; i <= payload['pcount']; i++) {
                            if (payload['player'][i].jail) {
                                payload['this'].getElementById("jailpositionholder").innerHTML += "<div class='cell-position' title='" + payload['player'][i].name + "' style='background-color: " + payload['player'][i].color + "; left: " + left + "vw; top: " + top + "px;'></div>";

                                if (left === 36) {
                                    left = 0;
                                    top = 41;
                                } else {
                                    left += 1.2;
                                }
                            }
                        }

                        for (let i = 1; i < payload['turn']; i++) {
                            if (payload['player'][i].jail) {
                                payload['this'].getElementById("jailpositionholder").innerHTML += "<div class='cell-position' title='" + payload['player'][i].name + "' style='background-color: " + payload['player'][i].color + "; left: " + left + "vw; top: " + top + "px;'></div>";
                                if (left === 36) {
                                    left = 0;
                                    top = 41;
                                } else
                                    left += 1.2;
                            }
                        }

                        let p = payload['player'][payload['turn']];

                        if (p.jail) {
                            payload['this'].getElementById("jail").style.border = "0.098vw solid " + p.color;
                        } else {
                            payload['this'].getElementById("cell" + p.position).style.border = "0.098vw solid " + p.color;
                        }

                        out(payload)
                        // for (let i=1; i <= pcount; i++) {
                        // payload['this'].getElementById("enlarge"+player[i].position+"token").innerHTML+="<img src='"+tokenArray[i].src+"' height='30' width='30' />";
                        // }
                    })(obj, payload, rest)
                    break
                case 'showStats':
                    (async (obj, payload, rest)=>{

                        let HTML, sq, p;
                        let mortgagetext,
                            housetext;
                        let write;
                        HTML = "<table align='center'><tr>";

                        for (let x = 1; x <= payload['pcount']; x++) {
                            write = false;
                            p = payload['player'][x];
                            if (x == 5) {
                                HTML += "</tr><tr>";
                            }
                            HTML += "<td class='statscell' id='statscell" + x + "' style='border: 0.195vw solid " + p.color + "' ><div class='statsplayername'>" + p.name + "</div>";

                            for (let i = 0; i < 40; i++) {
                                sq = payload['square'][i];

                                if (sq.owner == x) {
                                    mortgagetext = "",
                                        housetext = "";

                                    if (sq.mortgage) {
                                        mortgagetext = "title='Mortgaged' style='color: grey;'";
                                    }

                                    if (!write) {
                                        write = true;
                                        HTML += "<table>";
                                    }

                                    if (sq.house == 5) {
                                        housetext += "<span style='float: right; font-weight: bold;'>1&nbsp;x&nbsp;<img src='/static/html/components/main-manager/images/hotel.png' alt='' title='Hotel' class='hotel' style='float: none;' /></span>";
                                    } else if (sq.house > 0 && sq.house < 5) {
                                        housetext += "<span style='float: right; font-weight: bold;'>" + sq.house + "&nbsp;x&nbsp;<img src='/static/html/components/main-manager/images/house.png' alt='' title='House' class='house' style='float: none;' /></span>";
                                    }

                                    HTML += "<tr><td class='statscellcolor' style='background: " + sq.color + ";";

                                    if (sq.groupNumber == 1 || sq.groupNumber == 2) {
                                        HTML += " border: 0.098vw solid grey;";
                                    }
                                    // HTML += "' onmouseover='showdeed(" + i + ");' onmouseout='hidedeed();'></td><td class='statscellname' " + mortgagetext + ">" + sq.name + housetext + "</td></tr>";
                                    HTML += "' showdeed = "+ i +"></td><td class='statscellname' " + mortgagetext + ">" + sq.name + housetext + "</td></tr>";
                                }
                            }

                            if (p.communityChestJailCard) {
                                if (!write) {
                                    write = true;
                                    HTML += "<table>";
                                }
                                HTML += "<tr><td class='statscellcolor'></td><td class='statscellname'>Get Out of Jail Free Card</td></tr>";

                            }
                            if (p.chanceJailCard) {
                                if (!write) {
                                    write = true;
                                    HTML += "<table>";
                                }
                                HTML += "<tr><td class='statscellcolor'></td><td class='statscellname'>Get Out of Jail Free Card</td></tr>";

                            }

                            if (!write) {
                                HTML += p.name + " dosen't have any properties.";
                            } else {
                                HTML += "</table>";
                            }

                            HTML += "</td>";
                        }
                        HTML += "</tr></table><div id='titledeed'></div>";
                        // console.assert(false, HTML)
                        payload['this'].getElementById("statstext").innerHTML = HTML;
                        // console.assert(false, payload['this'].querySelector('#infoItemCard'))
                        if(!payload['this'].querySelector('.statscellcolor')){}else{
                            let nodeList = payload['this'].querySelectorAll('.statscellcolor')
                           for(let m = 0; m < nodeList.length; m++){

                               nodeList[m].addEventListener('mouseover', async (event)=>{
                                   let property = event.target.getAttribute('showdeed')
                                   await  mInterface['get']({type:'showdeed', property:property}, payload)
                               })
                               nodeList[m].addEventListener('mouseout', async (event)=>{
                                  payload['this'].querySelector('#deed').style.display = 'none'

                               })
                           }
                        }
                        payload['this'].querySelector('#statswrap').style.display = 'flex'
                        payload['this'].querySelector('#statsbackground').addEventListener('click', async (e)=>{
                            console.assert(false, e)
                        })

                        // Show using animation.
                        // $("#statsbackground").fadeIn(400, function() {
                        //     $("#statswrap").show();
                        // });
                    })(obj, payload, rest)
                    break
                case 'mortgage':
                    (async (obj,payload, rest)=>{
                        let sq = payload['monopoly']['square'][obj['value']];

                        // console.log(payload['monopoly']['square'], obj['value'])
                        // console.log(sq.owner)
                        // //console.assert(false, obj, payload['monopoly']['player'])

                        let p = payload['monopoly']['player'][sq.owner];

                        if (sq.house > 0 || sq.hotel > 0 || sq.mortgage) {
                            return false;
                        }
                        let mortgagePrice = Math.round(sq.price * 0.5);
                        let unmortgagePrice = Math.round(sq.price * 0.6);

                        sq.mortgage = true;
                        payload['monopoly']['player'].money += mortgagePrice;

                        payload['this'].getElementById("mortgagebutton").value = "Unmortgage for $" + unmortgagePrice;
                        payload['this'].getElementById("mortgagebutton").title = "Unmortgage " + sq.name + " for $" + unmortgagePrice + ".";

                      await  mInterface['get']({type:'addAlert', value:`${payload['player'].name} mortgaged ${sq.name} for $ ${mortgagePrice}.` },payload)
                      await  mInterface['get']({type:'updateOwned', value:`` }, payload)

                        //console.assert(false. payload)
                      await  mInterface['get']({type:'updateMoney', value:`` }, payload)

                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'roll':
                    (async (obj,payload, rest)=>{
                        let p = payload['player'][payload['turn']];

                        payload['this'].querySelector('#option').style.display = 'none'
                        payload['this'].querySelector('#buy').style.display = 'flex'
                        payload['this'].querySelector('#manage').style.display = 'none'
                        // $("#option").hide();
                        // $("#buy").show();
                        // $("#manage").hide();

                        if (p.human) {
                            payload['this'].getElementById("nextbutton").focus();
                        }
                        payload['this'].getElementById("nextbutton").value = "End turn";
                        payload['this'].getElementById("nextbutton").title = "End turn and advance to the next player.";

                        await monopoly['get']({type:'rollDice' }, payload);
                        let die1 = payload['die1']
                        let die2 = payload['die2']

                        payload['doublecount']++;

                        if (die1 == die2) {
                            await   mInterface['get']({type:'addAlert', value:`${p.name } rolled ${die1 + die2} - doubles.` },payload)
                        } else {
                            await  mInterface['get']({type:'addAlert', value:`${p.name } rolled ${die1 + die2}.` },payload)
                        }

                        if (die1 == die2 && !p.jail) {
                            await monopoly['get']({type:'updateDice', die1:die1, die2:die2}, payload);

                            if (payload['doublecount'] < 3) {
                                payload['this'].getElementById("nextbutton").value = "Roll again";
                                payload['this'].getElementById("nextbutton").title = "You threw doubles. Roll again.";

                                // If player rolls doubles three times in a row, send him to jail
                            } else if (payload['doublecount'] === 3) {
                                p.jail = true;
                                payload['doublecount'] = 0;
                                await mInterface['get']({type:'addAlert', value:`${p.name }  rolled doubles three times in a row.` },payload)
                                await monopoly['get']({type:'updateMoney'}, payload);


                                if (p.human) {
                                    await monopoly['get']({type:'popup', HTML: "You rolled doubles three times in a row. Go to jail.",
                                        action: await monopoly['get']({type:'gotojail'},payload),
                                        option:null}, payload);
                                } else {
                                    await monopoly['get']({type:'gotojail'}, payload);
                                }

                                return;
                            }
                        } else {
                            payload['this'].getElementById("nextbutton").value = "End turn";
                            payload['this'].getElementById("nextbutton").title = "End turn and advance to the next player.";
                            payload['doublecount']  = 0;
                        }

                        await monopoly['get']({type:'updatePosition', player: p}, payload)
                        await monopoly['get']({type:'updateMoney'}, payload);
                        await monopoly['get']({type:'updateOwned', player: p}, payload)
                        // console.assert(false, payload)
                        if (p.jail === true) {
                            p.jailroll++;

                            await monopoly['get']({type:'updateDice',die1:die1, die2:die2 }, payload)
                            if (die1 == die2) {
                                payload['this'].getElementById("jail").style.border = "0.098vw solid black";
                                payload['this'].getElementById("cell11").style.border = "0.195vw solid " + p.color;
                                payload['this'].querySelector('#landed').style.display = 'none'
                                // $("#landed").hide();

                                p.jail = false;
                                p.jailroll = 0;
                                p.position = 10 + die1 + die2;
                                payload['doublecount']  = 0;
                                await   mInterface['get']({type:'addAlert', value:`${p.name} rolled doubles to get out of jail.` },payload)
                                await monopoly['get']({type:'land'}, payload)
                            } else {
                                if (p.jailroll === 3) {

                                    if (p.human) {
                                        // console.assert(false)
                                        await monopoly['get']({type:'popup',
                                            HTML: "<p>You must pay the $50 fine.</p>",
                                            action: async ()=>{
                                                await mInterface['get']({type:'payFifty'}, payload)
                                                payload['player'][payload['turn']].position = 10 + die1 + die2;
                                                await monopoly['get']({type:'land'}, payload)
                                            },
                                            option:null}, payload);
                                    } else {
                                        await mInterface['get']({type:'payFifty'}, payload)
                                        p.position = 10 + die1 + die2;
                                        await monopoly['get']({type:'land'}, payload)
                                    }
                                } else {
                                    payload['this'].querySelector('#landed').style.display = 'flex'
                                    // $("#landed").show();
                                    payload['this'].getElementById("landed").innerHTML = "You are in jail.";

                                    if (!p.human) {
                                        // popup(p.AI.alertList, game.next);
                                        p.AI.alertList = "";
                                    }
                                }
                            }


                        } else {
                            await monopoly['get']({type:'updateDice',die1:die1, die2:die2 }, payload)

                            // Move player
                            p.position += die1 + die2;

                            // Collect $200 salary as you pass GO
                            if (p.position >= 40) {
                                p.position -= 40;
                                p.money += 200;
                                await  mInterface['get']({type:'addAlert', value:`${p.name}  collected a $200 salary for passing GO.` },payload)
                            }

                            await monopoly['get']({type:'land'}, payload)
                        }
                        ///////////////////////////////////////////////////
                       out(payload)
                    })(obj, payload, rest)
                    break
                case 'getCheckedProperty':
                    (async (obj, payload, rest)=>{

                        let card = -1
                        for (let i = 0; i < 42; i++) {
                            if (payload['this'].getElementById("propertycheckbox" + i) && payload['this'].getElementById("propertycheckbox" + i).checked) {
                                card = i
                                break
                            }
                        }
                        out(card)
                    })(obj, payload, rest)
                    break
                case 'updateOwned':
                    (async (obj,payload,  rest)=>{

                        // console.assert(false)
                        let p = payload['player'][payload['turn']];
                        let checkedproperty = (()=>{
                            for (let i = 0; i < 42; i++) {
                                if (payload['this'].getElementById("propertycheckbox" + i) && payload['this'].getElementById("propertycheckbox" + i).checked) {
                                    return i;
                                }
                            }
                            return -1; // No property is checked.

                        })()
                        payload['checkedproperty'] = checkedproperty
                        payload['this'].querySelector('#option').style.display = 'flex'
                        payload['this'].querySelector('#owned').style.display = 'flex'
                        // $("#option").show();
                        // $("#owned").show();
                        let HTML = "",
                            firstproperty = -1;

                        let mortgagetext = "",
                            housetext = "";
                        let sq;

                        for (let i = 0; i < 40; i++) {
                            sq = payload['square'][i];
                            if (sq.groupNumber && sq.owner === 0) {

                                payload['this'].querySelector(`#cell${i}owner`).style.display = 'none'
                                // $("#cell" + i + "owner").hide();
                            } else if (sq.groupNumber && sq.owner > 0) {
                                let currentCellOwner = payload['this'].getElementById("cell" + i + "owner");
                                currentCellOwner.style.display = "block";
                                currentCellOwner.style.backgroundColor = payload['player'][sq.owner].color;
                                currentCellOwner.title = payload['player'][sq.owner].name;
                            }
                        }

                        for (let i = 0; i < 40; i++) {
                            sq = payload['square'][i];
                            if (sq.owner == payload['turn']) {

                                mortgagetext = "";
                                if (sq.mortgage) {
                                    mortgagetext = "title='Mortgaged' style='color: grey;'";
                                }

                                housetext = "";
                                if (sq.house >= 1 && sq.house <= 4) {
                                    for (let x = 1; x <= sq.house; x++) {

                                        housetext += "<img src='/static/html/components/main-manager/images/house.png' alt='' title='House' class='house' />";
                                    }
                                } else if (sq.hotel) {
                                    housetext += "<img src='/static/html/components/main-manager/images/house.png' alt='' title='Hotel' class='hotel' />";
                                }

                                if (HTML === "") {
                                    HTML += "<table>";
                                    firstproperty = i;
                                }

                                HTML += "<tr class='property-cell-row'><td class='propertycellcheckbox'><input type='checkbox' id='propertycheckbox" + i + "' /></td><td class='propertycellcolor' style='background: " + sq.color + ";";

                                if (sq.groupNumber == 1 || sq.groupNumber == 2) {
                                    HTML += " border: 0.098vw solid grey; width: 1.758vw;";
                                }

                                // HTML += "' onmouseover='showdeed(" + i + ");' onmouseout='hidedeed();'></td><td class='propertycellname' " + mortgagetext + ">" + sq.name + housetext + "</td></tr>";
                                HTML += "' showdeed = " + i +" ></td> <td class = 'propertycellname' > "+ sq.name  + housetext + "</td> </tr>"

                            }
                        }

                        if (p.communityChestJailCard) {
                            if (HTML === "") {
                                firstproperty = 40;
                                HTML += "<table>";
                            }
                            HTML += "<tr class='property-cell-row'><td class='propertycellcheckbox'><input type='checkbox' id='propertycheckbox40' /></td><td class='propertycellcolor' style='background: white;'></td><td class='propertycellname'>Get Out of Jail Free Card</td></tr>";

                        }
                        if (p.chanceJailCard) {
                            if (HTML === "") {
                                firstproperty = 41;
                                HTML += "<table>";
                            }
                            HTML += "<tr class='property-cell-row'><td class='propertycellcheckbox'><input type='checkbox' id='propertycheckbox41' /></td><td class='propertycellcolor' style='background: white;'></td><td class='propertycellname'>Get Out of Jail Free Card</td></tr>";
                        }

                        if (HTML === "") {
                            HTML = p.name + ", you don't have any properties.";
                            payload['this'].querySelector('#option').style.display = 'none'
                            // $("#option").hide();
                        } else {
                            HTML += "</table>";
                        }

                        payload['this'].getElementById("owned").innerHTML = HTML;

                        if(payload['this'].querySelector('.propertycellcolor')){

                            let nodeList = payload['this'].querySelectorAll('.propertycellcolor')
                            for(let m = 0; m < nodeList.length; m++){
                                nodeList[m].addEventListener('mouseover', async (event)=>{
                                    // console.assert(false)
                                    let props = nodeList[m].getAttribute('showdeed')
                                    await  monopoly['get']({type:'showdeed', property:props}, payload)


                                })
                                nodeList[m].addEventListener('mouseout', async (event)=>{
                                    payload['this'].querySelector('#deed').style.display = 'none'
                                })

                            }
                        }
                        // Select previously selected property.
                        if (checkedproperty > -1 && payload['this'].getElementById("propertycheckbox" + checkedproperty)) {
                            payload['this'].getElementById("propertycheckbox" + checkedproperty).checked = true;
                        } else if (firstproperty > -1) {
                            payload['this'].getElementById("propertycheckbox" + firstproperty).checked = true;
                        }
                        let propertyCellRow =  payload['this'].querySelectorAll('.property-cell-row')
                        for(let i =0; i < propertyCellRow.length; i++){
                            propertyCellRow[i].addEventListener('click', async (e)=>{
                                let verify = true
                                let row = e.target.parentNode;
                                let all = {}
                                let item = false
                                while(verify){
                                    if(row.tagName === 'TR'){
                                        item = row
                                        row = row.parentNode
                                    }else if(row.tagName === 'TBODY') {
                                        all = row
                                        verify = false
                                    }else{
                                        row = row.parentNode
                                    }
                                }

                                if(!item){

                                }else{
                                    for(let i = 0; i < all.children.length;i++){
                                        all.children[i].querySelector('input').checked = false
                                    }

                                    item.querySelector('input').checked = true
                                    // console.assert(false, payload)
                                }

                                await monopoly['get']({type:'updateOption'}, payload);
                            })
                        }
                        await mInterface['get']({type:'updateOption'}, payload);
                        out(payload)
                    })(obj, payload, rest)
                    break
                case 'updateOption':
                    (async (obj, payload, rest)=>{

                        payload['this'].querySelector('#option').style.display = 'flex'
                        // $("#option").show();

                        let allGroupUninproved = true;
                        let allGroupUnmortgaged = true;
                        let checkedproperty = (()=>{

                            for (let i = 0; i < 42; i++) {
                                if (payload['this'].getElementById("propertycheckbox" + i) && payload['this'].getElementById("propertycheckbox" + i).checked) {
                                    return i;
                                }
                            }
                            return -1; // No property is checked.

                        })()

                        if (checkedproperty < 0 || checkedproperty >= 40) {
                            payload['this'].querySelector('#buyhousebutton').style.display = 'none'
                            payload['this'].querySelector('#sellhousebutton').style.display = 'none'
                            payload['this'].querySelector('#mortgagebutton').style.display = 'none'
                            // $("#buyhousebutton").hide();
                            // $("#sellhousebutton").hide();
                            // $("#mortgagebutton").hide();


                            let housesum = 32;
                            let hotelsum = 12;

                            for (let i = 0; i < 40; i++) {
                                let s = payload['square'][i];
                                if (s.hotel == 1)
                                    hotelsum--;
                                else
                                    housesum -= s.house;
                            }
                            payload['this'].querySelector('#buildings').style.display = 'flex'
                            // $("#buildings").show();

                            payload['this'].getElementById("buildings").innerHTML = "<img src='/static/html/components/main-manager/images/house.png' alt='' title='House' class='house' />:&nbsp;" + housesum + "&nbsp;&nbsp;<img src='/static/html/components/main-manager/images/hotel.png.png' alt='' title='Hotel' class='hotel' />:&nbsp;" + hotelsum;

                            out(payload)
                        }else{
                            payload['this'].querySelector('#buildings').style.display = 'none'
                            // $("#buildings").hide();
                            let sq = payload['square'][checkedproperty];

                            let buyhousebutton = payload['this'].getElementById("buyhousebutton");
                            let sellhousebutton = payload['this'].getElementById("sellhousebutton");
                            payload['this'].querySelector('#mortgagebutton').style.display = 'flex'
                            // $("#mortgagebutton").show();
                            payload['this'].getElementById("mortgagebutton").disabled = false;

                            if (sq.mortgage) {
                                payload['this'].getElementById("mortgagebutton").value = "Unmortgage ($" + Math.round(sq.price * 0.6) + ")";
                                payload['this'].getElementById("mortgagebutton").title = "Unmortgage " + sq.name + " for $" + Math.round(sq.price * 0.6) + ".";

                                payload['this'].querySelector('#buyhousebutton').style.display = 'none'
                                payload['this'].querySelector('#sellhousebutton').style.display = 'none'

                                // $("#buyhousebutton").hide();
                                // $("#sellhousebutton").hide();

                                allGroupUnmortgaged = false;
                            } else {
                                payload['this'].getElementById("mortgagebutton").value = "Mortgage ($" + (sq.price * 0.5) + ")";
                                payload['this'].getElementById("mortgagebutton").title = "Mortgage " + sq.name + " for $" + (sq.price * 0.5) + ".";

                                if (sq.groupNumber >= 3) {
                                    payload['this'].querySelector('#buyhousebutton').style.display = 'flex'
                                    payload['this'].querySelector('#sellhousebutton').style.display = 'flex'

                                    // $("#buyhousebutton").show();
                                    // $("#sellhousebutton").show();
                                    buyhousebutton.disabled = false;
                                    sellhousebutton.disabled = false;

                                    buyhousebutton.value = "Buy house ($" + sq.houseprice + ")";
                                    sellhousebutton.value = "Sell house ($" + (sq.houseprice * 0.5) + ")";
                                    buyhousebutton.title = "Buy a house for $" + sq.houseprice;
                                    sellhousebutton.title = "Sell a house for $" + (sq.houseprice * 0.5);

                                    if (sq.house == 4) {
                                        buyhousebutton.value = "Buy hotel ($" + sq.houseprice + ")";
                                        buyhousebutton.title = "Buy a hotel for $" + sq.houseprice;
                                    }
                                    if (sq.hotel == 1) {
                                        // $("#buyhousebutton").hide();
                                        payload['this'].querySelector('#buyhousebutton').style.display = 'none'

                                        sellhousebutton.value = "Sell hotel ($" + (sq.houseprice * 0.5) + ")";
                                        sellhousebutton.title = "Sell a hotel for $" + (sq.houseprice * 0.5);
                                    }

                                    let maxhouse = 0;
                                    let minhouse = 5;

                                    // for (let j = 0; j < max; j++) {
                                    //
                                    //     if (payload['square'][currentSquare.group[j]].house > 0) {
                                    //         allGroupUninproved = false;
                                    //         break;
                                    //     }
                                    // }

                                    let max = sq.group.length;
                                    for (let i = 0; i < max; i++) {
                                        let s = payload['square'][sq.group[i]];

                                        if (s.owner !== sq.owner) {
                                            buyhousebutton.disabled = true;
                                            sellhousebutton.disabled = true;
                                            buyhousebutton.title = "Before you can buy a house, you must own all the properties of this color-group.";
                                        } else {

                                            if (s.house > maxhouse) {
                                                maxhouse = s.house;
                                            }

                                            if (s.house < minhouse) {
                                                minhouse = s.house;
                                            }

                                            if (s.house > 0) {
                                                allGroupUninproved = false;
                                            }

                                            if (s.mortgage) {
                                                allGroupUnmortgaged = false;
                                            }
                                        }
                                    }

                                    if (!allGroupUnmortgaged) {
                                        buyhousebutton.disabled = true;
                                        buyhousebutton.title = "Before you can buy a house, you must unmortgage all the properties of this color-group.";
                                    }

                                    // Force even building
                                    if (sq.house > minhouse) {
                                        buyhousebutton.disabled = true;

                                        if (sq.house == 1) {
                                            buyhousebutton.title = "Before you can buy another house, the other properties of this color-group must all have one house.";
                                        } else if (sq.house == 4) {
                                            buyhousebutton.title = "Before you can buy a hotel, the other properties of this color-group must all have 4 houses.";
                                        } else {
                                            buyhousebutton.title = "Before you can buy a house, the other properties of this color-group must all have " + sq.house + " houses.";
                                        }
                                    }
                                    if (sq.house < maxhouse) {
                                        sellhousebutton.disabled = true;

                                        if (sq.house == 1) {
                                            sellhousebutton.title = "Before you can sell house, the other properties of this color-group must all have one house.";
                                        } else {
                                            sellhousebutton.title = "Before you can sell a house, the other properties of this color-group must all have " + sq.house + " houses.";
                                        }
                                    }

                                    if (sq.house === 0 && sq.hotel === 0) {
                                        payload['this'].querySelector('#sellhousebutton').style.display = 'none'
                                        // $("#sellhousebutton").hide();

                                    } else {
                                        payload['this'].querySelector('#mortgagebutton').style.display = 'none'
                                        // $("#mortgagebutton").hide();
                                    }

                                    // Before a property can be mortgaged or sold, all the properties of its color-group must unimproved.
                                    if (!allGroupUninproved) {
                                        payload['this'].getElementById("mortgagebutton").title = "Before a property can be mortgaged, all the properties of its color-group must unimproved.";
                                        payload['this'].getElementById("mortgagebutton").disabled = true;
                                    }
                                    out(payload)
                                } else {
                                    payload['this'].querySelector('#buyhousebutton').style.display = 'none'
                                    payload['this'].querySelector('#sellhousebutton').style.display = 'none'

                                    // $("#buyhousebutton").hide();
                                    // $("#sellhousebutton").hide();
                                    out(payload)
                                }
                            }
                            out(payload)
                        }
                    })(obj, payload, rest)
                    break
                case 'play':
                    (async (obj, payload, rest)=>{
                        // console.assert(false, payload)
                        if (await monopoly['auction']({type:'auction'},payload)) {
                           out(payload)
                        }else{
                            // console.assert(false, payload)
                            payload['turn']++;
                            if (payload['turn'] > payload['pcount']) {
                                payload['turn'] -= payload['pcount'];
                            }

                            let p = payload['player'][payload['turn']];
                            await monopoly['get']({type:'resetDice'}, payload);

                            payload['this'].getElementById("pname").innerHTML = p.name;
                            await mInterface['get']({type:'addAlert', value:"It is " + p.name + "'s turn." },payload)
                            // Check for bankruptcy.
                            p.pay(0, p.creditor, payload);
                            payload['this'].querySelector('#landed').style.display = 'none'
                            payload['this'].querySelector('#option').style.display = 'none'
                            payload['this'].querySelector('#manage').style.display = 'none'

                            payload['this'].querySelector('#board').style.display = 'flex'
                            payload['this'].querySelector('#control').style.display = 'flex'
                            payload['this'].querySelector('#moneybar').style.display = 'flex'
                            payload['this'].querySelector('#buy').style.display = 'flex'
                            // $("#landed, #option, #manage").hide();
                            // $("#board, #control, #moneybar, #viewstats, #buy").show();

                            payload['doublecount'] = 0;
                            if (p.human) {
                                payload['this'].getElementById("nextbutton").focus();
                            }
                            payload['this'].getElementById("nextbutton").value = "Roll Dice";
                            payload['this'].getElementById("nextbutton").title = "Roll the dice and move your token accordingly.";

                            payload['this'].querySelector('#die0').style.display = 'none'
                            payload['this'].querySelector('#die1').style.display = 'none'
                            // $("#die0").hide();
                            // $("#die1").hide();

                            if (p.jail) {
                                payload['this'].querySelector('#landed').style.display = 'flex'
                                // $("#landed").show();
                                payload['this'].getElementById("landed").innerHTML = "You are in jail.<input id='landedItemjail' type='button' title='Pay $50 fine to get out of jail immediately.' value='Pay $50 fine' />";

                                payload['this'].querySelector('#landedItemjail').addEventListener('click',async ()=>{
                                    // console.assert(false)
                                    await mInterface['get']({type:'payFifty'}, payload)
                                })

                                if (p.communityChestJailCard || p.chanceJailCard) {
                                    payload['this'].getElementById("landed").innerHTML += "<input type='button' id='gojfbutton' title='Use &quot;Get Out of Jail Free&quot; card.' value='Use Card' />";


                                    payload['this'].querySelector('#gojfbutton').addEventListener('click',async ()=>{

                                        // console.assert(false, payload)

                                        await mInterface['get']({type:'useJailCard'},payload)
                                    })
                                }

                                payload['this'].getElementById("nextbutton").title = "Roll the dice. If you throw doubles, you will get out of jail.";

                                if (p.jailroll === 0)
                                    await mInterface['get']({type:'addAlert', value:"This is " + p.name + "'s first turn in jail." },payload)
                                else if (p.jailroll === 1)
                                    await mInterface['get']({type:'addAlert', value:"This is " + p.name + "'s second turn in jail."},payload)
                                else if (p.jailroll === 2) {
                                    payload['this'].getElementById("landed").innerHTML += "<div>NOTE: If you do not throw doubles after this roll, you <i>must</i> pay the $50 fine.</div>";
                                    await mInterface['get']({type:'addAlert', value:"This is " + p.name + "'s third turn in jail."},payload)
                                }

                                if (!p.human && p.AI.postBail()) {
                                    if (p.communityChestJailCard || p.chanceJailCard) {
                                        await mInterface['get']({type:'useJailCard'},payload)
                                    } else {
                                        await mInterface['get']({type:'payfifty'},payload)
                                    }
                                }
                            }
                            await monopoly['get']({type:'updateMoney'}, payload);
                            await monopoly['get']({type:'updatePosition'}, payload);
                            await monopoly['get']({type:'updateOwned'}, payload);

                            let moneyBarArrow = payload['this'].querySelectorAll('.money-bar-arrow')

                            for(let i = 0; i < moneyBarArrow.length; i ++){
                                moneyBarArrow[i].style.display = 'none'
                            }
                            payload['this'].querySelector(`#p${payload['turn']}arrow`).style.display = 'flex'
                            // $(".money-bar-arrow").hide();
                            // $("#p" + payload['turn'] + "arrow").show();

                            if (!p.human) {
                                if (!p.AI.beforeTurn()) {
                                    await mInterface['get']({type:'next', player:p}, obj)
                                }
                            }

                        }
                    })(obj, payload, rest)
                    break
                case 'addAlert':
                    (async (obj,payload, rest)=>{

                        let alert = payload['this'].querySelector('#alert')
                        let outDiv = document.createElement('div')
                        outDiv.innerText = obj['value']
                        alert.appendChild(outDiv)


                        // //console.assert(false, payload['player'])
                        // Animate scrolling down alert element.
                        // alert.stop().animate({"scrollTop": $alert.prop("scrollHeight")}, 1000);

                        //console.assert(false, payload)
                        // if (!payload['player'][payload['turn']].human) {
                            // payload['player'][payload['turn']].AI.alertList += "<div>" + alertText + "</div>";
                        // }

                        out(payload)
                    })(obj,payload,  rest)
                    break
                default:
                    //console.assert(false, `новая функция ${obj['type']}`)
                    break
            }

        })
    }
}
