import mInterface from '/static/html/components/component_modules/monopoly/interface.mjs'
import classicedition from '/static/html/components/component_modules/monopoly/classicedition.mjs'
import gameplay from "/static/html/components/component_modules/monopoly/gameplay.mjs";
import auction from '/static/html/components/component_modules/monopoly/auction.mjs'
let trade = []
trade.staticProperty = []
trade['staticProperty']['initiator'] = []
trade['staticProperty']['recipient'] = []
trade['staticProperty']['property'] =  new Array(40)
trade['staticProperty']['money'] = []
trade['staticProperty']['communityChestJailCard'] = []
trade['staticProperty']['chanceJailCard'] = []
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
                case 'eliminatePlayer':
                    (async (obj, payload, rest)=>{
                        let p = payload['player'][payload['turn']];

                        for (let i = p.index; i < payload['pcount']; i++) {
                            payload['player'][i] = payload['player'][i + 1];
                            payload['player'][i].index = i;

                        }

                        for (var i = 0; i < 40; i++) {
                            if (payload['square'][i].owner >= p.index) {
                                payload['square'][i].owner--;
                            }
                        }

                        payload['pcount']--;
                        payload['turn']--;

                        if (payload['pcount'] === 2) {
                            payload['this'].getElementById("stats").style.width = "44.336vw";
                        } else if (payload['pcount'] === 3) {
                            payload['this'].getElementById("stats").style.width = "66.992vw";
                        }

                        if (payload['pcount'] === 1) {
                            await mInterface['get']({type:'updateMoney'},payload)
                            $("#control").hide();
                            $("#board").hide();
                            $("#refresh").show();

                            // // Display land counts for survey purposes.
                            // var text;
                            // for (var i = 0; i < 40; i++) {
                            // if (i === 0)
                            // text = square[i].landcount;
                            // else
                            // text += " " + square[i].landcount;
                            // }
                            // payload['this'].getElementById("refresh").innerHTML += "<br><br><div><textarea type='text' style='width: 980px;' onclick='javascript:select();' />" + text + "</textarea></div>";
                            await mInterface['get']({type:'popup', HTML:"<p>Congratulations, " + payload['player'][1].name + ", you have won the game.</p><div>"}, payload)
                        } else {
                            await mInterface['get']({type:'play'}, payload)
                        }
                        out(payload)
                    })(obj, payload, rest)
                    break
                case 'play':
                    (async (obj, payload, rest)=>{
                        // console.assert(false, payload)
                        if (await mInterface['get']({type:'auction'},payload)) {
                            out(payload)
                        }else{
                            console.assert(false, payload)
                            payload['turn']++;
                            if (payload['turn'] > payload['pcount']) {
                                payload['turn'] -= payload['pcount'];
                            }

                            let p = payload['player'][payload['turn']];
                            await mInterface['get']({type:'resetDice'}, payload);

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
                                    console.assert(false)
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
                            await mInterface['get']({type:'updateMoney'}, payload);
                            await mInterface['get']({type:'updatePosition'}, payload);
                            await mInterface['get']({type:'updateOwned'}, payload);

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
                case 'bankruptcy':
                    (async (obj,payload,  rest)=>{

                        let p = payload['player'][payload['turn']];
                        let pcredit = payload['player'][p.creditor];
                        payload['bankruptcyUnmortgageFee'] = 0

                        if (p.money >= 0) {
                            out(payload)
                        }
                        await mInterface['get']({type:'addAlert', value:p.name + " is bankrupt."}, payload);

                        if (p.creditor !== 0) {
                            pcredit.money += p.money;
                        }

                        for (let i = 0; i < 40; i++) {
                           let sq = payload['square'][i];
                            if (sq.owner == p.index) {
                                // Mortgaged properties will be tranfered by bankruptcyUnmortgage();
                                if (!sq.mortgage) {
                                    sq.owner = p.creditor;
                                } else {
                                    payload['bankruptcyUnmortgageFee'] += Math.round(sq.price * 0.1);
                                }

                                if (sq.house > 0) {
                                    if (p.creditor !== 0) {
                                        pcredit.money += sq.houseprice * 0.5 * sq.house;
                                    }
                                    sq.hotel = 0;
                                    sq.house = 0;
                                }

                                if (p.creditor === 0) {
                                    sq.mortgage = false;
                                    payload['auctionQueue'].push(i)
                                    sq.owner = 0;
                                }
                            }
                        }

                        await gameplay['get']({type:'updateMoney'},payload)

                        if (p.chanceJailCard) {
                            p.chanceJailCard = false;
                            pcredit.chanceJailCard = true;
                        }

                        if (p.communityChestJailCard) {
                            p.communityChestJailCard = false;
                            pcredit.communityChestJailCard = true;
                        }

                        if (payload['pcount'] === 2 ||  payload['bankruptcyUnmortgageFee'] === 0 || p.creditor === 0) {
                            await mInterface['get']({type:'eliminatePlayer'},payload)

                        } else {
                            await mInterface['get']({type:'addAlert', value:pcredit.name + " paid $" + payload['bankruptcyUnmortgageFee']  + " interest on the mortgaged properties received from " + p.name + "."}, payload);


                            await mInterface['get']({type:'popup', HTML:"<p>" + pcredit.name + ", you must pay $" + payload['bankruptcyUnmortgageFee']  + " interest on the mortgaged properties you received from " + p.name + ".</p>", action:async function() {

                                    await payload['player'][pcredit.index].pay(payload['bankruptcyUnmortgageFee'] , 0, payload);
                                    await mInterface['get']({type:'bankruptcyUnmortgage'}, payload)
                                }})
                        }

                    })(obj,payload, rest)
                    break
                case 'chanceCommunityChest':
                    (async (obj,payload,  rest)=>{

                        console.assert(false, payload)
                        let p = payload['player'][payload['turn']];
                        // Community Chest
                        if (p.position === 2 || p.position === 17 || p.position === 33) {
                            let communityChestIndex = payload['communityChestCards'].deck[payload['communityChestCards'].index];

                            // Remove the get out of jail free card from the deck.
                            if (communityChestIndex === 0) {
                                payload['communityChestCards'].deck.splice(payload['communityChestCards'].index, 1);
                            }


                            await mInterface['get']({type:'popup', HTML:`
                            <img src='/static/html/components/main-manager/images/community_chest_icon.png' style='height: 15vw; width: 15vw;  margin: 0.781vw 0.781vw 0.781vw 0;' />
                            <div class="containerCard">
                            <div style='font-weight: bold; font-size: 3vw; '>Community Chest:</div>
                            <div style='text-align: center;'>${payload['communityChestCards'][communityChestIndex].text}</div>
                            </div>
                            `, action:async function(obj, payload) {

                              await auction['get']({type:'communityChestAction', communityChestIndex: communityChestIndex}, payload);

                              }}, payload)
                            /*
                            await mInterface['get']({type:'popup', HTML:"<img src='/static/html/components/main-manager/images/community_chest_icon.png' style='height: 6vw; width: 6vw; float: left; margin: 0.781vw 0.781vw 0.781vw 0;' /> <div></div><div style='font-weight: bold; font-size: 3vw; '>Community Chest:</div><div style='text-align: justify;'>" + payload['communityChestCards'][communityChestIndex].text + "</div></div>", action:async function(obj, payload) {

                                    await auction['get']({type:'communityChestAction', communityChestIndex: communityChestIndex}, payload);

                                }}, payload)
*/
                            payload['communityChestCards'].index++;

                            if (payload['communityChestCards'].index >= payload['communityChestCards'].deck.length) {
                                payload['communityChestCards'].index = 0;
                            }

                            // Chance
                        } else if (p.position === 7 || p.position === 22 || p.position === 36) {
                            let chanceIndex = payload['chanceCards'].deck[payload['chanceCards'].index];

                            // Remove the get out of jail free card from the deck.
                            if (chanceIndex === 0) {
                                payload['chanceCards'].deck.splice(payload['chanceCards'].index, 1);
                            }
                            await mInterface['get']({type:'popup', HTML:"<img src='/static/html/components/main-manager/images/chance_icon.png' style='height: 7.883vw; width: 5vw; float: left; margin: 0.781vw 0.781vw 0.781vw 0;' /><div style='font-weight: bold; font-size: 3vw; '>Chance:</div><div style='text-align: justify;'>" + payload['chanceCards'][chanceIndex].text + "</div>", action:async function(obj, payload) {
                                    // console.assert(false, payload)
                                    // console.assert(false, chanceIndex)
                                    await auction['get']({type:'chanceAction', chanceIndex: chanceIndex},payload);
                                }},payload)
                            payload['chanceCards'].index++;

                            if ( payload['chanceCards'].index >=  payload['chanceCards'].deck.length) {
                                payload['chanceCards'].index = 0;
                            }
                        } else {
                            if (!p.human) {
                                p.AI.alertList = "";

                                if (!p.AI.onLand()) {
                                    game.next();
                                }
                            }
                        }

                    })(obj,payload, rest)
                    break
                case 'sellHouse':
                    (async (obj,payload, rest)=>{
                        let sq = payload['square'][obj['index']];
                        let p = payload['player'][sq.owner];
                        if (sq.hotel === 1) {
                            sq.hotel = 0;
                            sq.house = 4;
                            await mInterface['get']({type:'addAlert', value:p.name + " sold the hotel on " + sq.name + "."}, payload);
                        } else {
                            sq.house--;
                            await mInterface['get']({type:'addAlert', value:p.name + " sold a house on " + sq.name + "."}, payload);
                        }

                        p.money += sq.houseprice * 0.5;
                        await  gameplay['get']({type:'updateOwned', value:`` }, payload)
                        await gameplay['get']({type:'updateMoney'},payload)
                    })(obj, payload, rest)
                    break
                case 'buyHouse':
                    (async (obj,payload, rest)=>{
                        let sq = payload['square'][obj['index']];
                        let p = payload['player'][sq.owner];
                        let houseSum = 0;
                        let hotelSum = 0;

                        if (p.money - sq.houseprice < 0) {
                            if (sq.house == 4) {
                                out(false)
                            } else {
                                out(false)
                            }

                        } else {
                            for (let i = 0; i < 40; i++) {
                                if (payload['square'][i].hotel === 1) {
                                    hotelSum++;
                                } else {
                                    houseSum += payload['square'][i].house;
                                }
                            }

                            if (sq.house < 4) {
                                if (houseSum >= 32) {
                                    return false;

                                } else {
                                    sq.house++;
                                    await mInterface['get']({type:'addAlert', value:p.name + " placed a house on " + sq.name + "."}, payload);
                                }

                            } else {
                                if (hotelSum >= 12) {
                                    return;

                                } else {
                                    sq.house = 5;
                                    sq.hotel = 1;
                                    await mInterface['get']({type:'addAlert', value:p.name + " placed a hotel on " + sq.name + "."}, payload);
                                }
                            }

                            p.pay(sq.houseprice, 0, payload);

                            await  gameplay['get']({type:'updateOwned', value:`` }, payload)
                            await gameplay['get']({type:'updateMoney'},payload)
                        }
                    })(obj, payload, rest)
                    break
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

                        console.assert(false)

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
                                await gameplay['get']({type:'resetTrade',initiator:payload['tradeObj']['currentInitiator'],recipient:payload['player'][curentPlayer],allowRecipientToBeChanged: true }, payload)
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
                case 'addPropertyToAuctionQueue':
                    (async (obj,payload, rest)=>{
                    payload['auctionQueue'].push(obj['propertyIndex']);
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
                case 'auction':
                    (async (obj, payload, rest)=>{
                        //console.assert(payload)
                        if (await payload['auctionQueue'].length === 0) {
                            out(false)
                        }else{


                            // console.assert(false, payload['auctionQueue'])
                            let index = payload['auctionQueue'].shift();

                            if(index === undefined){

                            }else{
                                let s = payload['square'][index];

                                if (s.price === 0 || s.owner !== 0) {

                                    await mInterface['get']({type:'auction'}, payload)
                                    out(payload)
                                }else{

                                    payload['auctionproperty'] = index
                                    let auctionproperty = index;
                                    let highestbidder = 0;
                                    payload['highestbidder'] = 0
                                    payload['highestbid'] = 0
                                    let highestbid = 0;
                                    payload['currentbidder'] = payload['turn'] + 1
                                    let currentbidder = payload['turn'] + 1;

                                    if (payload['currentbidder'] > payload['pcount']) {
                                        payload['currentbidder'] -= payload['pcount'];
                                    }

                                    await mInterface['get']({type:'popup', HTML:`
<div style='font-weight: bold; font-size: 3vw; margin-bottom: 0.977vw;'>
Auction 
<span id='propertyname'></span>
</div>
<div>Highest Bid = $
<span id='highestbid'></span> (<span id='highestbidder'></span>)
</div>
<div>
<span id='currentbidder'></span>, it is your turn to bid.
</div>
<div>
<input id='bid' title='Enter an amount to bid on " + s.name + ".' style='width: 85%;' />
</div>
<div>
<input id='auctionBidItem' type='button' value='Bid' title='Place your bid.' />
<input id='auctionPassItem' type='button' value='Pass' title='Skip bidding this time.'  />
<input id='exitAuctionItem' type='button' value='Exit Auction' title='Stop bidding on " + s.name + " altogether.'  />
</div>`, option: "blank"}, payload);

                                    payload['this'].getElementById("propertyname").innerHTML = `<a id="propertynameItem" href='javascript:void(0);' class='statscellcolor'>${s.name}</a>`;


                                    payload['this'].querySelector(`#propertynameItem`).addEventListener('mouseout', async (event)=>{
                                        payload['this'].querySelector(`#deed`).style.display = 'none'
                                    })
                                    payload['this'].querySelector(`#propertynameItem`).addEventListener('mouseover', async (event)=>{
                                        await  mInterface['get']({type:'showdeed', property:payload['auctionproperty']}, payload)
                                    })
                                    payload['this'].getElementById("highestbid").innerHTML = "0";
                                    payload['this'].getElementById("highestbidder").innerHTML = "N/A";
                                    payload['this'].getElementById("currentbidder").innerHTML = payload['player'][payload['currentbidder']].name;
                                    payload['this'].getElementById("bid").onkeydown = async function (e) {
                                        let key = 0;
                                        let isCtrl = false;
                                        let isShift = false;

                                        if (window.event) {
                                            key = window.event.keyCode;
                                            isCtrl = window.event.ctrlKey;
                                            isShift = window.event.shiftKey;
                                        } else if (e) {
                                            key = e.keyCode;
                                            isCtrl = e.ctrlKey;
                                            isShift = e.shiftKey;
                                        }

                                        if (isNaN(key)) {
                                            return true;
                                        }

                                        if (key === 13) {
                                            await auction['get']({type:'auctionBid'}, payload)
                                            out(false)
                                        }

                                        // Allow backspace, tab, delete, arrow keys, or if control was pressed, respectively.
                                        if (key === 8 || key === 9 || key === 46 || (key >= 35 && key <= 40) || isCtrl) {
                                            return true;
                                        }

                                        if (isShift) {
                                            return false;
                                        }

                                        // Only allow number keys.
                                        out((key >= 48 && key <= 57) || (key >= 96 && key <= 105))
                                    };

                                    payload['this'].getElementById("bid").onfocus = function () {
                                        this.style.color = "black";
                                        if (isNaN(this.value)) {
                                            this.value = "";
                                        }
                                    };
                                    await mInterface['get']({type:'updateMoney'}, payload);

                                    if (!payload['player'][currentbidder].human) {

                                        //console.assert(false)
                                        payload['currentbidder']  = payload['turn']; // auctionPass advances currentbidder.
                                        await auction['get']({type:'auctionPass'}, payload)
                                    }
                                }
                                out(true)
                            }
                        }
                    })(obj, payload, rest)
                    break
                case'getTrade':
                    (async (obj,payload, rest)=>{
                        payload['tradeObj'] = trade['staticProperty']
                        out(payload)
                    })(obj,payload, rest)
                    break
                case'setTrade':
                    (async (obj,payload, rest)=>{
                        trade['staticProperty'] = obj['obj']
                        out(payload)
                    })(obj,payload, rest)
                    break
                case'trade':
                    (async (obj,payload, rest)=>{
                            // console.assert(false, obj)
                            trade['staticProperty']['initiator'] = obj['initiator']
                            trade['staticProperty']['recipient'] = obj['recipient']
                            trade['staticProperty']['property'] =  obj['property']
                            trade['staticProperty']['money'] = obj['money']
                            trade['staticProperty']['communityChestJailCard'] = obj['communityChestJailCard']
                            trade['staticProperty']['chanceJailCard'] = obj['chanceJailCard']
                            payload['tradeObj'] =  trade['staticProperty']
                            payload['reversedTrade'] = trade['staticProperty']
                        await mInterface['get']({type:'setTrade', obj:trade['staticProperty']}, payload)
                        out(payload)
                    })(obj,payload, rest)
                    break
                case'addEventListener':
                    (async (obj,payload, rest)=>{

                        payload['this'].querySelector('#resignbutton').addEventListener('click',async (event)=>{

                            // console.assert(false)
                            await mInterface['get']({type:'resign'}, payload)

                        })
                        payload['this'].querySelector('#proposetradebutton').addEventListener('click',async (event)=>{

                            if (isNaN(payload['this'].getElementById("trade-leftp-money").value)) {
                                payload['this'].getElementById("trade-leftp-money").value = "This value must be a number.";
                                payload['this'].getElementById("trade-leftp-money").style.color = "red";
                                out(false)
                            }else {
                                if (isNaN(payload['this'].getElementById("trade-rightp-money").value)) {
                                    payload['this'].getElementById("trade-rightp-money").value = "This value must be a number.";
                                    payload['this'].getElementById("trade-rightp-money").style.color = "red";
                                    out(false)
                                } else {
                                    await mInterface['get']({type:'readTrade'},payload);
                                    payload['tradeObj']['reversedTradeProperty'] = []
                                    if (payload['tradeObj']['money'] > 0 && payload['tradeObj']['money'] > payload['tradeObj']['initiator'].money) {
                                        payload['this'].getElementById("trade-leftp-money").value = payload['tradeObj']['initiator'].name + " does not have $" + payload['tradeObj']['money'] + ".";
                                        payload['this'].getElementById("trade-leftp-money").style.color = "red";
                                        out(false)
                                    } else if (payload['tradeObj']['money'] < 0 && -payload['tradeObj']['money'] > payload['tradeObj']['recipient'].money) {
                                        payload['this'].getElementById("trade-rightp-money").value = payload['tradeObj']['recipient'].name + " does not have $" + (-payload['tradeObj']['money']) + ".";
                                        payload['this'].getElementById("trade-rightp-money").style.color = "red";
                                        out(false)
                                    }else{
                                        console.assert(false, payload)
                                        payload['tradeObj']['isAPropertySelected'] = 0
                                        payload['isAPropertySelected'] = 0
                                        let isAPropertySelected = 0;

                                        // Ensure that some properties are selected.
                                        for (let i = 0; i < 40; i++) {
                                            payload['tradeObj']['reversedTradeProperty'][i] = -payload['tradeObj']['property'][i]

                                            if( parseInt(payload['tradeObj']['property'][i],10) === -1 || parseInt(payload['tradeObj']['property'][i], 10)  === 1){
                                                payload['isAPropertySelected'] = 1
                                                payload['tradeObj']['isAPropertySelected'] = 1
                                            }
                                        }
                                        if(parseInt(payload['tradeObj']['communityChestJailCard'], 10) === 1 ||parseInt(payload['tradeObj']['communityChestJailCard'], 10) === -1 ){
                                            payload['isAPropertySelected'] = 1
                                            payload['tradeObj']['isAPropertySelected'] = 1
                                        }
                                        if(parseInt(payload['tradeObj']['chanceJailCard'], 10) === 1 || parseInt(payload['tradeObj']['chanceJailCard'], 10) === -1){
                                            payload['isAPropertySelected'] = 1
                                            payload['tradeObj']['isAPropertySelected'] = 1
                                        }
                                        if (payload['isAPropertySelected']  === 0) {
                                            let trade =  payload['this'].querySelector('#trade')

                                            if(!trade.querySelector('.errorTrade')){
                                                trade.querySelector('tbody').insertAdjacentHTML('afterbegin', `<tr class="errorTrade"><td class="trade-cell"><p>One or more properties must be selected in order to trade.</p></td></tr>`);
                                                trade.querySelector('.trade-cell').style.color = 'red'
                                            }else{
                                            }

                                            out(false)
                                        }else{
                                            if (payload['tradeObj']['initiator'].human && !confirm(payload['tradeObj']['initiator'].name + ", are you sure you want to make this offer to " + payload['tradeObj']['recipient'].name + "?")) {
                                                out(false)
                                            }else{

                                                // console.assert(false,payload['tradeObj'] )
                                                await mInterface['get']({
                                                    type:'trade',
                                                    recipient: payload['tradeObj']['initiator'],
                                                    initiator:payload['tradeObj']['recipient'],
                                                    money:-payload['tradeObj']['money'],
                                                    property:payload['tradeObj']['reversedTradeProperty'],
                                                    communityChestJailCard:payload['tradeObj']['communityChestJailCard'],
                                                    chanceJailCard:payload['tradeObj']['chanceJailCard']
                                                }, payload)
                                                // console.assert(false,payload['tradeObj'] )
                                                if (payload['tradeObj']['recipient'].human) {
                                                    await mInterface['get']({type:'writeTrade'},payload)

                                                    payload['this'].querySelector('#proposetradebutton').style.display = 'none'
                                                    payload['this'].querySelector('#canceltradebutton').style.display = 'none'
                                                    payload['this'].querySelector('#accepttradebutton').style.display = 'flex'
                                                    payload['this'].querySelector('#rejecttradebutton').style.display = 'flex'
                                                    // $("#proposetradebutton").hide();
                                                    // $("#canceltradebutton").hide();
                                                    // $("#accepttradebutton").show();
                                                    // $("#rejecttradebutton").show();

                                                    // console.assert(false, payload)
                                                    await mInterface['get']({type:'addAlert', value:payload['tradeObj']['initiator'].name + " initiated a trade with " + payload['tradeObj']['recipient'].name + "."}, payload);
                                                    await mInterface['get']({type:'popup', HTML:"<p>" + payload['tradeObj']['recipient'].name + " has proposed a trade with you, " + payload['tradeObj']['initiator'].name + ". You may accept, reject, or modify the offer.</p>"}, payload)
                                                    // console.assert(false, payload)
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
                                            }
                                        }
                                    }
                                }
                            }
                        })

                        payload['this'].querySelector('#canceltradebutton').addEventListener('click',async (event)=>{

                            if(payload['this'].querySelector('.errorTrade')){
                                payload['this'].querySelector('.errorTrade').remove()
                            }
                            payload['this'].querySelector('#board').style.display = 'flex'
                            payload['this'].querySelector('#control').style.display = 'flex'
                            payload['this'].querySelector('#trade').style.display = 'none'
                            payload['this'].querySelector('#popupbackground').style.display = 'none'

                            //console.assert(false, payload)

                            if (!payload['player'][payload['turn']].human) {
                                payload['player'][payload['turn']].AI.alertList = "";
                                game.next();
                            }


                        })
                        payload['this'].querySelector('#accepttradebutton').addEventListener('click',async (event)=>{
                            await mInterface['get']({type:'getTrade'},payload)
                            if (isNaN(payload['this'].getElementById("trade-leftp-money").value)) {
                                payload['this'].getElementById("trade-leftp-money").value = "This value must be a number.";
                                payload['this'].getElementById("trade-leftp-money").style.color = "red";
                             out(false)
                            }else{

                                if (isNaN(payload['this'].getElementById("trade-rightp-money").value)) {
                                    payload['this'].getElementById("trade-rightp-money").value = "This value must be a number.";
                                    payload['this'].getElementById("trade-rightp-money").style.color = "red";
                                    out(false)
                                }else{

                                    payload['showAlerts'] = true


                                    if (payload['tradeObj']) {
                                        payload['showAlerts'] = false;
                                    } else {
                                        await mInterface['get']({type:'readTrade'},payload);
                                    }

                                    if (payload['tradeObj']['money'] > 0 && payload['tradeObj']['money'] > payload['tradeObj']['initiator'].money) {
                                        payload['this'].getElementById("trade-leftp-money").value = payload['tradeObj']['initiator'].name + " does not have $" + payload['tradeObj']['money'] + ".";
                                        payload['this'].getElementById("trade-leftp-money").style.color = "red";
                                        out(false);
                                    } else if (payload['tradeObj']['money'] < 0 && -payload['tradeObj']['money'] > payload['tradeObj']['recipient'].money) {
                                        payload['this'].getElementById("trade-rightp-money").value = payload['tradeObj']['recipient'].name + " does not have $" + (-payload['tradeObj']['money']) + ".";
                                        payload['this'].getElementById("trade-rightp-money").style.color = "red";
                                        out(false);
                                    }else{


                                        // console.assert(false, payload)
                                        let isAPropertySelected = 0;
                                        payload['tradeObj']['isAPropertySelected'] = 0
                                        // Ensure that some properties are selected.
                                        for (let i = 0; i < 40; i++) {
                                            if(parseInt(payload['tradeObj']['property'][i], 10) === 1 ||parseInt(payload['tradeObj']['property'][i], 10) === -1 ){

                                                isAPropertySelected = 1
                                                payload['tradeObj']['isAPropertySelected'] = 1
                                            }
                                        }

                                        if(parseInt( payload['tradeObj']['communityChestJailCard'], 10) === 1 || parseInt( payload['tradeObj']['communityChestJailCard'], 10) === -1 ){
                                            payload['tradeObj']['isAPropertySelected'] = 1
                                            isAPropertySelected = 1
                                        }
                                        if(parseInt( payload['tradeObj']['chanceJailCard'], 10) === 1 || parseInt( payload['tradeObj']['chanceJailCard'], 10) === -1 ){
                                            payload['tradeObj']['isAPropertySelected'] = 1
                                            isAPropertySelected = 1
                                        }


                                        if (payload['tradeObj']['isAPropertySelected'] === 0) {
                                            await mInterface['get']({type:'popup', HTML:"<p>One or more properties must be selected in order to trade.</p>"}, payload)
                                            out(false)
                                        }else{
                                            if ( !confirm(payload['tradeObj']['initiator'].name + ", are you sure you want to make this exchange with " + payload['tradeObj']['recipient'].name + "?")) {
                                                out(false)
                                            }else{
                                                for (let i = 0; i < 40; i++) {

                                                    if (payload['tradeObj']['property'][i] === 1) {
                                                        payload['square'][i].owner = payload['tradeObj']['recipient'].index;
                                                        await mInterface['get']({type:'addAlert', value:payload['tradeObj']['recipient'].name + " received " + payload['square'][i].name + " from " + payload['tradeObj']['initiator'].name + "."}, payload);
                                                    } else if (payload['tradeObj']['property'][i] === -1) {
                                                        payload['square'][i].owner = payload['tradeObj']['initiator'].index;
                                                        await mInterface['get']({type:'addAlert', value:payload['tradeObj']['initiator'].name + " received " + payload['square'][i].name + " from " + payload['tradeObj']['recipient'].name + "."}, payload);
                                                    }

                                                }

                                                if (payload['tradeObj']['communityChestJailCard'] === 1) {
                                                    payload['tradeObj']['initiator'].communityChestJailCard = false;
                                                    payload['tradeObj']['recipient'].communityChestJailCard = true;
                                                    await mInterface['get']({type:'addAlert', value:payload['tradeObj']['recipient'].name + ' received a "Get Out of Jail Free" card from ' + payload['tradeObj']['initiator'].name + "."}, payload);
                                                } else if (payload['tradeObj']['communityChestJailCard'] === -1) {
                                                    payload['tradeObj']['initiator'].communityChestJailCard = true;
                                                    payload['tradeObj']['recipient'].communityChestJailCard = false;
                                                    await mInterface['get']({type:'addAlert', value:payload['tradeObj']['initiator'].name + ' received a "Get Out of Jail Free" card from ' + payload['tradeObj']['recipient'].name + "."}, payload);
                                                }

                                                if (payload['tradeObj']['chanceJailCard'] === 1) {
                                                    payload['tradeObj']['initiator'].chanceJailCard = false;
                                                    payload['tradeObj']['recipient'].chanceJailCard = true;
                                                    await mInterface['get']({type:'addAlert', value:payload['tradeObj']['recipient'].name + ' received a "Get Out of Jail Free" card from ' + payload['tradeObj']['initiator'].name + "."}, payload);

                                                } else if (payload['tradeObj']['chanceJailCard'] === -1) {
                                                    payload['tradeObj']['initiator'].chanceJailCard = true;
                                                    payload['tradeObj']['recipient'].chanceJailCard = false;
                                                    await mInterface['get']({type:'addAlert', value:payload['tradeObj']['initiator'].name + ' received a "Get Out of Jail Free" card from ' + payload['tradeObj']['recipient'].name + "."}, payload);

                                                }

                                                // Exchange money.
                                                if (payload['tradeObj']['money'] > 0) {
                                                    payload['tradeObj']['initiator'].pay(payload['tradeObj']['money'], payload['tradeObj']['recipient'].index, payload);
                                                    payload['tradeObj']['recipient'].money += payload['tradeObj']['money'];
                                                    await mInterface['get']({type:'addAlert', value:payload['tradeObj']['recipient'].name + " received $" + payload['tradeObj']['money'] + " from " + payload['tradeObj']['initiator'].name + "."}, payload);
                                                } else if (payload['tradeObj']['money'] < 0) {
                                                    payload['tradeObj']['money'] = -payload['tradeObj']['money'];

                                                    payload['tradeObj']['recipient'].pay(payload['tradeObj']['money'], payload['tradeObj']['initiator'].index, payload);
                                                    payload['tradeObj']['initiator'].money += payload['tradeObj']['money'];
                                                    await mInterface['get']({type:'addAlert', value:payload['tradeObj']['initiator'].name + " received $" + payload['tradeObj']['money'] + " from " + payload['tradeObj']['recipient'].name + "."}, payload);
                                                }

                                                await  gameplay['get']({type:'updateOwned', value:`` }, payload)
                                                await gameplay['get']({type:'updateMoney'},payload)


                                                /**
                                                 * Мой комментарий
                                                 * надо скорее всего очистить объект торговли
                                                 * @type {string}
                                                 */


                                                payload['this'].querySelector('#trade').style.display = 'none'
                                                payload['this'].querySelector('#popupbackground').style.display = 'none'

                                                // console.assert(false)
                                                // $("#board").show();
                                                // $("#control").show();
                                                // $("#trade").hide();

                                                if (!payload['player'][payload['turn']].human) {
                                                    payload['player'][payload['turn']].AI.alertList = "";
                                                    game.next();
                                                }





                                            }
                                        }
                                    }
                                }
                            }
                        })
                        payload['this'].querySelector('#rejecttradebutton').addEventListener('click',async (event)=>{



                            /**
                             * Мой комментарий
                             * надо скорее всего очистить объект торговли
                             * @type {string}
                             */

                            payload['this'].querySelector('#trade').style.display = 'none'
                            payload['this'].querySelector('#popupbackground').style.display = 'none'


                            //console.assert(false, obj)
                            if (!payload['player'][payload['turn']].human) {
                                payload['player'][payload['turn']].AI.alertList = "";
                                game.next();
                            }


                        })
                    })(obj,payload, rest)
                    break
                case 'land':
                    (async (obj,payload,  rest)=>{
                        obj['increasedRent'] = !!obj['increasedRent'] ; // Cast increasedRent to a boolean value. It is used for the ADVANCE TO THE NEAREST RAILROAD/UTILITY Chance cards.
                        let p = payload['player'][payload['turn']];
                        let s = payload['square'][p.position];


                        let die1 = payload['die1']
                        let die2 = payload['die2']
                        payload['this'].querySelector('#landed').style.display ='flex'
                        payload['this'].querySelector("#landed").innerHTML = "You landed on " + s.name + ".";
                        s.landcount++;
                        await mInterface['get']({type:'addAlert', value:`${p.name} landed on ${s.name}.`}, payload);
                        if (s.price !== 0 && s.owner === 0) {

                            if (!p.human) {

                                if (p.AI.buyProperty(p.position)) {
                                    await mInterface['get']({type:'buy'},payload)
                                }
                            } else {
                                payload['this'].querySelector(`#landed`).innerHTML ="<div>You landed on <a href='javascript:void(0);' id='previeCard' class='statscellcolor'>" + s.name +"."+"</a><input type='button' id='buyCards' value='Buy ($" + s.price + ")' title='Buy " + s.name + " for " + s.pricetext + ".'/></div>"


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

                            // console.assert(false, payload)
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
                                // console.assert(false)
                                // popup("<div>Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.</div>", gotojail);
                                // await mInterface['get']({type:'popup', value:"<div>Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.</div>", action:  await mInterface['get']({type:'gotojail'},payload)},payload)
                                await mInterface['get']({type:'popup', HTML:"<div>Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.</div>",action:async (obj, payload)=>{

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
                case 'subtractamount':
                    (async (obj,payload,  rest)=>{
                        let p = payload['player'][payload['turn']];
                        p.pay(obj['amount'], 0, payload);
                        await mInterface['get']({type:'addAlert', value:`${p.name} lost $ ${obj['amount']} from ${obj['cause']}.`}, payload);
                      out(payload)
                    })(obj,payload, rest)
                    break
                case 'gobackthreespaces':
                    (async (obj,payload,  rest)=>{
                        let p = payload['player'][payload['turn']];

                        p.position -= 3;
                        await gameplay['get']({type:'land'}, payload)
                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'advanceToNearestUtility':
                    (async (obj,payload,  rest)=>{
                        let p = payload['player'][payload['turn']];

                        if (p.position < 12) {
                            p.position = 12;
                        } else if (p.position >= 12 && p.position < 28) {
                            p.position = 28;
                        } else if (p.position >= 28) {
                            p.position = 12;
                            p.money += 200;
                            await mInterface['get']({type:'addAlert', value:`${p.name} collected a $200 salary for passing GO.`}, payload);
                        }
                        await gameplay['get']({type:'land', increasedRent: true}, payload)
                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'advanceToNearestRailroad':
                    (async (obj,payload,  rest)=>{

                        let p = payload['player'][payload['turn']];

                        await mInterface['get']({type:'updatePosition' }, payload)

                        if (p.position < 15) {
                            p.position = 15;
                        } else if (p.position >= 15 && p.position < 25) {
                            p.position = 25;
                        } else if (p.position >= 35) {
                            p.position = 5;
                            p.money += 200;
                            await mInterface['get']({type:'addAlert', value:`${p.name} collected a $200 salary for passing GO.`}, payload);
                        }

                        await mInterface['get']({type:'land', increasedRent: true}, payload)
                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'payeachplayer':
                    (async (obj,payload,  rest)=>{

                        let p = payload['player'][payload['turn']];
                        let total = 0;

                        for (let i = 1; i <= payload['pcount']; i++) {
                            if (i != payload['turn']) {
                                payload['player'][i].money += obj['amount'];
                                total += obj['amount'];
                                obj['creditor'] = p.money >= 0 ? i : obj['creditor'];

                                p.pay(obj['amount'], obj['creditor'], payload);
                            }
                        }
                        await mInterface['get']({type:'addAlert', value:`${p.name}  lost $ ${total} from ${obj['cause']}.`}, payload);
                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'addamount':
                    (async (obj,payload,  rest)=>{
                        let p = payload['player'][payload['turn']];
                        p.money += obj['amount'];
                        await mInterface['get']({type:'addAlert', value:`${p.name} received $ ${obj['amount']} from ${obj['cause']}.`}, payload);
                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'gotojail':
                    (async (obj,payload,  rest)=>{
                        let p = payload['player'][payload['turn']];
                        await mInterface['get']({type:'addAlert', value:`${p.name}  was sent directly to jail.`}, payload);

                        payload['this'].getElementById("landed").innerHTML = "You are in jail.";

                        p.jail = true;
                        payload['doublecount'] = 0;
                        payload['this'].getElementById("nextbutton").value = "End turn";
                        payload['this'].getElementById("nextbutton").title = "End turn and advance to the next player.";

                        if (p.human) {
                            payload['this'].getElementById("nextbutton").focus();
                        }
                        await mInterface['get']({type:'updatePosition' }, payload)
                        await mInterface['get']({type:'updateOwned' }, payload)

                        if (!p.human) {
                            console.assert(false, 'AI')
                            // await mInterface['get']({type:'popup', HTML: "You rolled doubles three times in a row. Go to jail.",action:gotojail,option:null}, obj);
                            // popup(p.AI.alertList, game.next);
                            p.AI.alertList = "";
                        }

                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'streetrepairs':
                    (async (obj,payload,  rest)=>{
                        let cost = 0;
                        for (let i = 0; i < 40; i++) {
                            let s = payload['square'][i];
                            if (s.owner == payload['turn']) {
                                if (s.hotel == 1)
                                    cost += obj['hotelprice'];
                                else
                                    cost += s.house * obj['houseprice'];
                            }
                        }

                        let p = payload['player'][payload['turn']];

                        if (cost > 0) {
                            p.pay(cost, 0, payload);

                            // If function was called by Community Chest.
                            if (obj['houseprice'] === 40) {
                                await mInterface['get']({type:'addAlert', value:`${p.name} lost $ ${cost}to Community Chest.`}, payload);
                            } else {
                                await mInterface['get']({type:'addAlert', value:`${p.name} lost $ ${cost} to Chance.`}, payload);
                            }
                        }
                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'rollDice':
                    (async (obj,payload,  rest)=>{
                        payload['die1'] = Math.floor(Math.random() * 6) + 1;
                        payload['die2']= Math.floor(Math.random() * 6) + 1;

                        // payload['die1'] = 0
                        // payload['die2']= 7

                        payload['areDiceRolled'] = true
                        out(payload)
                    })(obj,payload, rest)
                    break
                case 'resetDice':
                    (async (obj, payload, rest)=>{
                        payload['areDiceRolled'] = false
                        out(payload)
                    })(obj, payload, rest)
                    break
                case 'getDie':
                    (async (obj, payload, rest)=>{
                            if (obj['value'] === 1) {
                                 out(  payload['die1'])
                            } else {
                                out(  payload['die2'])
                            }
                    })(obj, payload, rest)
                    break
                case 'updateDice':
                    (async (obj, payload, rest)=>{

                        let die0 =   payload['die1'];
                        let die1 =   payload['die2'];


                    payload['this'].querySelector('#die0').style.display = 'flex'
                    payload['this'].querySelector('#die1').style.display = 'flex'

                    if (payload['this'].images) {
                        var element0 = payload['this'].getElementById("die0");
                        var element1 = payload['this'].getElementById("die1");

                        element0.classList.remove("die-no-img");
                        element1.classList.remove("die-no-img");

                        element0.title = "Die (" + die0 + " spots)";
                        element1.title = "Die (" + die1 + " spots)";

                        if (element0.firstChild) {
                            element0 = element0.firstChild;
                        } else {
                            element0 = element0.appendChild(document.createElement("img"));
                        }
                        console.assert(false)
                        element0.src = "/images/Die_" + die0 + ".png";
                        element0.alt = die0;

                        if (element1.firstChild) {
                            element1 = element1.firstChild;
                        } else {
                            element1 = element1.appendChild(document.createElement("img"));
                        }

                        element1.src = "images/Die_" + die1 + ".png";
                        element1.alt = die0;
                    } else {
                        payload['this'].getElementById("die0").textContent = die0;
                        payload['this'].getElementById("die1").textContent = die1;

                        payload['this'].getElementById("die0").title = "Die";
                        payload['this'].getElementById("die1").title = "Die";
                    }
                    out(payload)
                    })(obj, payload, rest)
                    break
                case 'updateMoney':
                    (async (obj, payload, rest)=>{
                    var p = payload['player'][payload['turn']];

                    payload['this'].getElementById("pmoney").innerHTML = "$" + p.money;

                    payload['this'].querySelector('.money-bar-row').style.display = 'none'


                    for (var i = 1; i <= payload['pcount']; i++) {
                       let p_i = payload['player'][i];

                        payload['this'].querySelector(`#moneybarrow${i}`).style.display = 'flex'
                        payload['this'].getElementById("p" + i + "moneybar").style.border = "2px solid " + p_i.color;
                        payload['this'].getElementById("p" + i + "money").innerHTML = p_i.money;
                        payload['this'].getElementById("p" + i + "moneyname").innerHTML = p_i.name;
                    }
                    // show("moneybarrow9"); // Don't remove this line or make the first for-loop stop when i <= 8, because this affects how the table is displayed.

                    if (payload['this'].getElementById("landed").innerHTML === "") {
                        payload['this'].querySelector('#landed').style.display = 'none'
                    }

                    payload['this'].getElementById("quickstats").style.borderColor = p.color;

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
                case 'addAlert':
                    (async (obj,payload, rest)=>{

                        let alert = payload['this'].querySelector('#alert')
                        let outDiv = document.createElement('div')
                        outDiv.innerText = obj['value']
                        alert.appendChild(outDiv)


                        // //console.assert(false, payload['player'])
                        // Animate scrolling down alert element.
                        // alert.stop().animate({"scrollTop": $alert.prop("scrollHeight")}, 1000);

                        if (!payload['player'][payload['turn']].human) {
                            // payload['player'][payload['turn']].AI.alertList += "<div>" + alertText + "</div>";
                        }

                        out(payload)
                    })(obj,payload,  rest)
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
                                // console.assert(false, payload)
                                payload['this'].querySelector('#popupwrap').style.display = 'none'
                                payload['this'].querySelector('#popupbackground').style.display = 'none'
                                obj['action'](obj, payload)
                            });
                            payload['this'].querySelector('#popupno').addEventListener('click',async ()=>{
                                // console.assert(false)
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
                        top = 5.2;
                        for (let i = payload['turn']; i <= payload['pcount']; i++) {
                            if (payload['player'][i].jail) {
                                payload['this'].getElementById("jailpositionholder").innerHTML += "<div class='cell-position' title='" + payload['player'][i].name + "' style='background-color: " + payload['player'][i].color + "; left: " + left + "vw; top: " + top + "vw;'></div>";

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
                                payload['this'].getElementById("jailpositionholder").innerHTML += "<div class='cell-position' title='" + payload['player'][i].name + "' style='background-color: " + payload['player'][i].color + "; left: " + left + "vw; top: " + top + "vw;'></div>";
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
                                    await  mInterface['get']({type:'showdeed', property:props}, payload)


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

                                await mInterface['get']({type:'updateOption'}, payload);
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

                            payload['this'].getElementById("buildings").innerHTML = "<img src='/static/html/components/main-manager/images/house.png' alt='' title='House' class='house' />:&nbsp;" + housesum + "&nbsp;&nbsp;<img src='/static/html/components/main-manager/images/hotel.png' alt='' title='Hotel' class='hotel' />:&nbsp;" + hotelsum;

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
                case 'advance':
                    (async (obj, payload, rest)=>{
                        let p = payload['player'][payload['turn']];

                        if (typeof obj['pass'] === "number") {
                            if (p.position < obj['pass']) {
                                p.position = obj['pass'];
                            } else {
                                p.position = obj['pass'];
                                p.money += 200;
                                await mInterface['get']({type:'addAlert', value:`${p.name} collected a $200 salary for passing GO. `}, payload);
                            }
                        }
                        if (p.position < obj['destination']) {
                            p.position = obj['destination'];
                        } else {
                            p.position = obj['destination'];
                            p.money += 200;
                            await mInterface['get']({type:'addAlert', value:`${p.name} collected a $200 salary for passing GO.`}, payload);
                        }

                        await gameplay['get']({type:'land'}, payload)

                    })(obj, payload, rest)
                    break
                default:
                    console.assert(false,`Новая функция ${obj['type']}` )
                    break
            }

        })
    },
    auction:(obj, payload, ...rest)=>{
        return  new Promise((resolve, reject) => {
            function out(obj) {
                resolve(obj)
            }
            function err(obj) {
                reject(obj)
            }
            switch (obj['type']) {
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

                        if (! await mInterface['auction']({type:'auction'},payload)) {
                            await gameplay['get']({type:'play', player: p}, payload);
                        }
                        out(payload)
                    })(obj, payload, rest)
                    break
                case 'auction':
                    (async (obj, payload, rest)=>{
                        //console.assert(payload)
                        if (await payload['auctionQueue'].length === 0) {
                            out(false)
                        }else{
                            // console.assert(false, payload['auctionQueue'])
                            let index = payload['auctionQueue'].shift();

                            if(index === undefined){

                            }else{
                                let s = payload['square'][index];

                                if (s.price === 0 || s.owner !== 0) {


                                    out(await mInterface['get']({type:'auction'}, payload))
                                }else{

                                    payload['auctionproperty'] = index
                                    let auctionproperty = index;
                                    let highestbidder = 0;
                                    payload['highestbidder'] = 0
                                    payload['highestbid'] = 0
                                    let highestbid = 0;
                                    payload['currentbidder'] = payload['turn'] + 1
                                    let currentbidder = payload['turn'] + 1;

                                    if (payload['currentbidder'] > payload['pcount']) {
                                        payload['currentbidder'] -= payload['pcount'];
                                    }

                                    await mInterface['get']({type:'popup', HTML:`
<div style='font-weight: bold; font-size: 3vw; margin-bottom: 0.977vw;'>
Auction 
<span id='propertyname'></span>
</div>
<div>Highest Bid = $
<span id='highestbid'></span> (<span id='highestbidder'></span>)
</div>
<div>
<span id='currentbidder'></span>, it is your turn to bid.
</div>
<div>
<input id='bid' title='Enter an amount to bid on " + s.name + ".' style='width: 85%;' />
</div>
<div>
<input id='auctionBidItem' type='button' value='Bid' title='Place your bid.' />
<input id='auctionPassItem' type='button' value='Pass' title='Skip bidding this time.'  />
<input id='exitAuctionItem' type='button' value='Exit Auction' title='Stop bidding on " + s.name + " altogether.'  />
</div>`, option: "blank"}, payload);

                                    payload['this'].getElementById("propertyname").innerHTML = `<a id="propertynameItem" href='javascript:void(0);' class='statscellcolor'>${s.name}</a>`;


                                    payload['this'].querySelector(`#propertynameItem`).addEventListener('mouseout', async (event)=>{
                                        payload['this'].querySelector(`#deed`).style.display = 'none'
                                    })
                                    payload['this'].querySelector(`#propertynameItem`).addEventListener('mouseover', async (event)=>{
                                        await  mInterface['get']({type:'showdeed', property:payload['auctionproperty']}, payload)
                                    })
                                    payload['this'].getElementById("highestbid").innerHTML = "0";
                                    payload['this'].getElementById("highestbidder").innerHTML = "N/A";
                                    payload['this'].getElementById("currentbidder").innerHTML = payload['player'][currentbidder].name;
                                    payload['this'].getElementById("bid").onkeydown = async function (e) {
                                        let key = 0;
                                        let isCtrl = false;
                                        let isShift = false;

                                        if (window.event) {
                                            key = window.event.keyCode;
                                            isCtrl = window.event.ctrlKey;
                                            isShift = window.event.shiftKey;
                                        } else if (e) {
                                            key = e.keyCode;
                                            isCtrl = e.ctrlKey;
                                            isShift = e.shiftKey;
                                        }

                                        if (isNaN(key)) {
                                            return true;
                                        }else{
                                            if (key === 13) {
                                                await auction['get']({type:'auctionBid'}, payload)
                                                out(false)
                                            }else{
                                                // Allow backspace, tab, delete, arrow keys, or if control was pressed, respectively.
                                                if (key === 8 || key === 9 || key === 46 || (key >= 35 && key <= 40) || isCtrl) {
                                                   out(true)
                                                }else{


                                                    if (isShift) {
                                                     out(false)
                                                    }else{

                                                        // Only allow number keys.
                                                        out((key >= 48 && key <= 57) || (key >= 96 && key <= 105))
                                                    }
                                                }
                                            }
                                        }
                                    };

                                    payload['this'].getElementById("bid").onfocus = function () {
                                        this.style.color = "black";
                                        if (isNaN(this.value)) {
                                            this.value = "";
                                        }
                                    };
                                    await mInterface['get']({type:'updateMoney'}, payload);

                                    if (!payload['player'][currentbidder].human) {

                                        //console.assert(false)
                                        payload['currentbidder']  = payload['turn']; // auctionPass advances currentbidder.
                                        await auction['get']({type:'auctionPass'}, payload)
                                    }
                                }
                                out(true)
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
                                await auction['get']({type:'finalizeAuction'}, payload)
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
                                        await auction['get']({type:'auctionBid', bid: bid}, payload)
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
                    break
            }

        })
    }
}
