import monopoly from '/static/html/components/component_modules/monopoly/monopoly.mjs'
import mInterface from '/static/html/components/component_modules/monopoly/interface.mjs'
import square from '/static/html/components/component_modules/monopoly/square.mjs'
import classicedition from '/static/html/components/component_modules/monopoly/classicedition.mjs'
import gameplay from '/static/html/components/component_modules/monopoly/gameplay.mjs'
import typeScript from '/static/html/components/component_modules/type/typeScript.mjs'
import ai from '/static/html/components/component_modules/monopoly/ai.mjs'
import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import monopolyObject from '/static/html/components/component_modules/monopoly/monopoly-object.mjs'
export default {
    get:async (obj, type, ...rest)=>{
        return  new Promise(async (resolve, reject) => {
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

                        // let tableRowOnClickLeftp = function(e) {
                        //     payload['this'].querySelector('#proposetradebutton').style.display = 'flex'
                        //     payload['this'].querySelector('#canceltradebutton').style.display = 'flex'
                        //     payload['this'].querySelector('#accepttradebutton').style.display = 'none'
                        //     payload['this'].querySelector('#rejecttradebutton').style.display = 'none'
                        // };

                        // let tableRowOnClick = function(e) {
                        //
                        //     let item = e.target.parentNode
                        //     item = item.querySelector('input')
                        //
                        //     payload['checkboxElement'] = item
                        //     if (payload['checkboxElement'] !== e.srcElement) {
                        //         payload['checkboxElement'].checked = !payload['checkboxElement'].checked;
                        //     }
                        //
                        //     payload['this'].querySelector('#proposetradebutton').style.display = 'flex'
                        //     payload['this'].querySelector('#canceltradebutton').style.display = 'flex'
                        //     payload['this'].querySelector('#accepttradebutton').style.display = 'none'
                        //     payload['this'].querySelector('#rejecttradebutton').style.display = 'none'
                        // };

                        console.assert(false, payload['this'])

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

                                    console.assert(false, event.target.getAttribute('show'))
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

                                    console.assert(false)
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
                case 'monopoly':
                    let monopoly = {}
                    let payload = {}
                    payload['tradeObj'] = {}
                    payload['die1'] = null
                    payload['die2'] = null
                    payload['areDiceRolled'] = false
                    payload['auctionQueue'] = []
                    payload['highestbidder'] = null
                    payload['highestbid'] = 0
                    payload['currentbidder'] = 1
                    payload['auctionproperty'] = null
                    payload['game'] = null
                    payload['tradeObj']['currentInitiator'] = null
                    payload['tradeObj']['currentRecipient'] = null
                    payload['tradeObj']['initiator'] = null
                    payload['tradeObj']['recipient'] = null
                    payload['player'] = []
                    payload['communityChestCards'] = []
                    payload['chanceCards'] = []
                    payload['square'] = []
                    payload['pcount'] = null
                    payload['turn'] = 0
                    payload['doublecount'] = 0
                    payload['bid'] = null
                    payload['this'] = obj['this'].shadowRoot
                    payload['checkedproperty'] = -1

                    monopoly['cards'] = {
                        _:'cards',
                        type: 'default',
                        communityChestCards: [],
                        chanceCards: undefined
                    }
                    monopoly['auction'] = {
                        _:'auction',
                        type: 'default',
                        auctionQueue: [],
                        highestbidder: undefined,
                        highestbid: 0,
                        currentbidder: 1,
                        auctionproperty: undefined
                    }
                    monopoly['trade'] = {
                        _:'trade',
                        type: 'default',
                        currentInitiator: [],
                        currentRecipient: undefined,
                        initiator: undefined,
                        recipient: undefined
                    }
                    monopoly['button'] ={
                        _:'button',
                        type:'default',
                        items: ['trade-leftp-money','trade-rightp-money'],
                        methods:['onkeydown', 'onfocus', 'onchange'],
                        actions:['tradeMoneyOnKeyDown', 'tradeMoneyOnFocus','tradeMoneyOnChange'],
                        onkeydown:{
                            _:'onkeydown',
                            'trade-leftp-money': undefined,
                            'trade-rightp-money': undefined
                        },
                        onfocus:{
                            _:'onfocus',
                            'trade-leftp-money': undefined,
                            'trade-rightp-money': undefined
                        },
                        onchange:{
                            _:'onfocus',
                            'trade-leftp-money': undefined,
                            'trade-rightp-money': undefined
                        },
                        tradeMoneyOnKeyDown: async ()=>{
                                console.log('~~~~~~~ tradeMoneyOnKeyDown ~~~~ menu-game.mjs ~~~')
                            let key = 0;
                            let isCtrl = false;
                            let isShift = false;

                            if (window.Event) {
                                key = window.Event.keyCode;
                                isCtrl = window.Event.ctrlKey;
                                isShift = window.Event.shiftKey;
                            } else if (e) {
                                key = e.keyCode;
                                isCtrl = e.ctrlKey;
                                isShift = e.shiftKey;
                            }

                            if (Number.isNaN(key)) {
                                return true;
                            }

                            if (key === 13) {
                                return false;
                            }
                            // Allow backspace, tab, delete, arrow keys, or if control was pressed, respectively.
                            if (key === 8 || key === 9 || key === 46 || (key >= 35 && key <= 40) || isCtrl) {
                                return true;
                            }

                            if (isShift) {
                                return false;
                            }
                            return (key >= 48 && key <= 57) || (key >= 96 && key <= 105);
                        },
                        tradeMoneyOnFocus:async () => {
                            console.log('~~~~~~~ tradeMoneyOnFocus ~~ menu-game.mjs ~~~~~')
                            this.style.color = "black";
                            if (Number.isNaN(this.value) || this.value === "0") {
                                this.value = "";
                            }
                        },
                        tradeMoneyOnChange: async (e) => {
                        console.log('~~~~~~~tradeMoneyOnChange~~~ menu-game.mjs ~~~~')
                        console.assert(false, e)
                        payload['this'].querySelector('#proposetradebutton').style.display = 'flex'
                        payload['this'].querySelector('#canceltradebutton').style.display = 'flex'
                        payload['this'].querySelector('#accepttradebutton').style.display = 'none'
                        payload['this'].querySelector('#rejecttradebutton').style.display = 'none'
                        let amount = this.value;

                        if (Number.isNaN(amount)) {
                            this.value = "This value must be a number.";
                            this.style.color = "red";
                            return false;
                        }

                        amount = Math.round(amount) || 0;
                        this.value = amount;

                        if (amount < 0) {
                            this.value = "This value must be greater than 0.";
                            this.style.color = "red";
                            return false;
                        }

                        return true;
                        }
                    }
                    monopoly['property'] ={
                        _:'property',
                        type:'default',
                        die1: undefined,
                        die2: undefined,
                        areDiceRolled: false,
                        turn: undefined,
                        doublecount: 0,
                        groupPropertyArray:[],
                        groupNumber: {}
                    }
                    monopoly['player'] = {
                        _:'player',
                        player: [],
                        items: ['bank','player 1','player 2','player 3','player 4','player 5','player 6','player 7','player 8'],
                        methods:['onkeydown', 'onfocus', 'onchange'],
                        actions:['playernumber_onchange', 'tradeMoneyOnFocus','tradeMoneyOnChange'],
                        addEventListener:['playernumber_onchange'],
                        name: 'the bank',
                        type: 'default',
                        pcount: undefined,
                        currentCell: 0,
                        currentCellAnchor: 0,
                        currentCellPositionHolder: 0,
                        currentCellName: 0,
                        currentCellOwner: 0,
                        jail: false,
                        cell:0
                    }
                    let type = await typeScript()
                    type.button(false, 'monopoly/menu-game.mjs','2',{_:'button'},'button')
                    type.player(true, 'monopoly/menu-game.mjs','5',{_:'player'},'player')


                    // for (let i = 0; i < 8; i++) {
                    //     payload['player'][i] = await mInterface['get']({type:'player', color:''})
                    //     payload['player'][i].index = i;
                    // }

                    // payload = await square['get']({type:'classic'}, payload)
                    // for (let i = 0; i < 40; i++) {
                    //     payload['groupNumber'] = payload['square'][i].groupNumber;
                    //
                    //     if (payload['groupNumber'] > 0) {
                    //         if (!payload['groupPropertyArray'][payload['groupNumber']]) {
                    //             payload['groupPropertyArray'][payload['groupNumber']] = [];
                    //         }
                    //         payload['groupPropertyArray'][payload['groupNumber']].push(i);
                    //     }
                    // }
                    //
                    //
                    // for (let i = 0; i < 40; i++) {
                    //     payload['groupNumber'] = payload['square'][i].groupNumber;
                    //
                    //     if (payload['groupNumber'] > 0) {
                    //         payload['square'][i].group =payload['groupPropertyArray'][payload['groupNumber']];
                    //     }
                    //
                    //     payload['square'][i].index = i;
                    // }
                    //
                    // payload['player'][1].human = true;
                    // payload['player'][0].name = "the bank";
                    //
                    // payload['communityChestCards'].index = 0;
                    // payload['chanceCards'].index = 0;
                    // payload['communityChestCards'].deck = []
                    // payload['chanceCards'].deck = []
                    //
                    //
                    // for (let i = 0; i < 16; i++) {
                    //     payload['chanceCards'].deck[i] = i;
                    //     payload['communityChestCards'].deck[i] = i;
                    // }
                    // payload['communityChestCards'].deck.sort(function() {return Math.random() - 0.5;});
                    // payload['chanceCards'].deck.sort(function() {return Math.random() - 0.5;});
                    //
                    // let playernumber = htmlManager.querySelector('#playernumber')

                // async  function playernumber_onchange(event) {
                //
                //     event['pcount'] = parseInt(htmlManager.querySelector(`#playernumber`).value, 10);
                //     let player = htmlManager.querySelectorAll('.player-input')
                //     for(let i =0; i < player.length;i++){
                //         if(event['pcount'] > i){
                //             player[i].style.display = 'flex'
                //         }else{
                //             player[i].style.display = 'none'
                //         }
                //     }
                // }
                //
                //     playernumber.addEventListener('change',playernumber_onchange);
                //     playernumber_onchange(payload)
                //     let nextbutton = htmlManager.querySelector('#nextbutton')
                //     nextbutton.addEventListener('click',async (event)=>{
                //         mInterface['get']({type:'next', player:payload['player'][payload['turn']]},payload)
                //     });
                //     let setup = htmlManager.querySelector('#setup')
                //     let noF5 = htmlManager.querySelector('#noF5')
                //
                //     let enlargeWrap = htmlManager.appendChild(document.createElement("div"));
                //     enlargeWrap.id = "enlarge-wrap";
                //     let HTML = "";
                //     for (let i = 0; i < 40; i++) {
                //         HTML += "<div id='enlarge" + i + "' class='enlarge'>";
                //         HTML += "<div id='enlarge" + i + "color' class='enlarge-color'></div><br /><div id='enlarge" + i + "name' class='enlarge-name'></div>";
                //         HTML += "<br /><div id='enlarge" + i + "price' class='enlarge-price'></div>";
                //         HTML += "<br /><div id='enlarge" + i + "token' class='enlarge-token'></div></div>";
                //     }
                //     enlargeWrap.innerHTML = HTML;
                //
                //     let currentCell;
                //     let currentCellAnchor;
                //     let currentCellPositionHolder;
                //     let currentCellName;
                //     let currentCellOwner;
                //
                //     for (var i = 0; i < 40; i++) {
                //         let s = payload['square'][i];
                //
                //         currentCell = htmlManager.getElementById("cell" + i);
                //
                //         currentCellAnchor = currentCell.appendChild(document.createElement("div"));
                //         currentCellAnchor.id = "cell" + i + "anchor";
                //         currentCellAnchor.className = "cell-anchor";
                //
                //         currentCellPositionHolder = currentCellAnchor.appendChild(document.createElement("div"));
                //         currentCellPositionHolder.id = "cell" + i + "positionholder";
                //         currentCellPositionHolder.className = "cell-position-holder";
                //         currentCellPositionHolder.enlargeId = "enlarge" + i;
                //
                //         currentCellName = currentCellAnchor.appendChild(document.createElement("div"));
                //         currentCellName.id = "cell" + i + "name";
                //         currentCellName.className = "cell-name";
                //         currentCellName.textContent = s.name;
                //
                //         if (payload['square'][i].groupNumber) {
                //             currentCellOwner = currentCellAnchor.appendChild(document.createElement("div"));
                //             currentCellOwner.id = "cell" + i + "owner";
                //             currentCellOwner.className = "cell-owner";
                //         }
                //
                //         htmlManager.getElementById("enlarge" + i + "color").style.backgroundColor = s.color;
                //         htmlManager.getElementById("enlarge" + i + "name").textContent = s.name;
                //         htmlManager.getElementById("enlarge" + i + "price").textContent = s.pricetext;
                //     }
                //
                //     htmlManager.getElementById("enlarge0token").innerHTML += '<img src="/static/html/components/main-manager/images/arrow_icon.png" width="50%" alt="" />';
                //     htmlManager.getElementById("enlarge20price").innerHTML += "<img src='/static/html/components/main-manager/images/free_parking_icon.png'  width='50%' alt='' style='position: relative; top: -1.953vw;' />";
                //     htmlManager.getElementById("enlarge38token").innerHTML += '<img src="/static/html/components/main-manager/images/tax_icon.png"  width="50%" alt="" style="position: relative; top: -1.953vw;" />';
                //
                //     await classicedition['get']({type:'corrections'},payload)
                    // Jail corrections
                    // htmlManager.querySelector('#jailpositionholder')
                    // htmlManager.querySelector('#jail')
                    // htmlManager.querySelector('#jail').insertAdjacentHTML('afterbegin', `<div id="jailpositionholder"></div><span>Jail</span>`);
                    // $("<span>").text("Jail").appendTo("#jail");
                    // htmlManager.getElementById("jail").enlargeId = "enlarge40";
                    // htmlManager.getElementById("enlarge-wrap").innerHTML += "<div id='enlarge40' class='enlarge'><div id='enlarge40color' class='enlarge-color'></div><br /><div id='enlarge40name' class='enlarge-name'>Jail</div><br /><div id='enlarge40price' class='enlarge-price'><img src='/static/html/components/main-manager/images/jake_icon.png' width='50%' alt='' style='position: relative; top: -1.953vw;' /></div><br /><div id='enlarge40token' class='enlarge-token'></div></div>";
                    // htmlManager.getElementById("enlarge40name").innerHTML = "Jail";
                    // let drag, dragX, dragY, dragObj, dragTop, dragLeft;

                    // let cell = htmlManager.querySelectorAll('.cell-position-holder')
                    // let jail = htmlManager.querySelectorAll('#jail')
                    // for(let i =0; i < jail.length; i++){
                    //     jail[i].addEventListener('mouseover',async (e)=>{
                    //         if(e.target.enlargeId === undefined){
                    //
                    //         }else{
                    //             htmlManager.querySelector(`#${e.target.enlargeId}`).style.display = 'flex'
                    //         }
                    //     })
                    //     jail[i].addEventListener('mousemove',async (e)=>{
                    //         if(e.target.enlargeId === undefined){
                    //
                    //         }else{
                    //             let element = htmlManager.querySelector(`#${e.target.enlargeId}`)
                    //             if (e.clientY + 20 > window.innerHeight - 204) {
                    //                 element.style.top = (window.innerHeight - 204) + "px";
                    //             } else {
                    //                 element.style.top = (e.clientY + 20) + "px";
                    //             }
                    //             element.style.left = (e.clientX + 10) + "px";
                    //         }
                    //     })
                    //     jail[i].addEventListener('mouseout',async (e)=>{
                    //         if(e.target.enlargeId === undefined){
                    //
                    //         }else {
                    //             htmlManager.querySelector(`#${e.target.enlargeId}`).style.display = 'none'
                    //         }
                    //     })
                    // }
                    // for(let i =0; i < cell.length; i++){
                    //     cell[i].addEventListener('mouseover',async (e)=>{
                    //         console.log('33333333333333', e.target.enlargeId)
                    //         if(e.target.enlargeId === undefined){
                    //
                    //         }else{
                    //             htmlManager.querySelector(`#${e.target.enlargeId}`).style.display = 'flex'
                    //         }
                    //     })
                    //     cell[i].addEventListener('mousemove',async (e)=>{
                    //
                    //         if(e.target.enlargeId === undefined){
                    //
                    //         }else{
                    //             let element = htmlManager.querySelector(`#${e.target.enlargeId}`);
                    //             if (e.clientY + 20 > window.innerHeight - 204) {
                    //                 element.style.top = (window.innerHeight - 204) + "px";
                    //             } else {
                    //                 element.style.top = (e.clientY + 20) + "px";
                    //             }
                    //
                    //             element.style.left = (e.clientX + 10) + "px";
                    //
                    //         }
                    //     })
                    //     cell[i].addEventListener('mouseout',async (e)=>{
                    //         if(e.target.enlargeId === undefined){
                    //         }else{
                    //             htmlManager.querySelector(`#${e.target.enlargeId}`).style.display = 'none'
                    //         }
                    //     })
                    // }
                    //
                    // htmlManager.querySelector("#main-manager").addEventListener('mousemove',async (e)=>{
                    //     let object;
                    //     if (e.target) {
                    //         object = e.target;
                    //     } else if (window.event && window.event.srcElement) {
                    //         object = window.event.srcElement;
                    //     }
                    //
                    //     if (object.classList.contains("propertycellcolor") || object.classList.contains("statscellcolor")) {
                    //         if (e.clientY + 20 > window.innerHeight - 279) {
                    //             htmlManager.getElementById("deed").style.top = (window.innerHeight - 279) + "px";
                    //         } else {
                    //             htmlManager.getElementById("deed").style.top = (e.clientY + 20) + "px";
                    //         }
                    //         htmlManager.getElementById("deed").style.left = (e.clientX + 10) + "px";
                    //
                    //
                    //     } else if (drag) {
                    //         if (e) {
                    //             dragObj.style.left = (dragLeft + e.clientX - dragX) + "px";
                    //             dragObj.style.top = (dragTop + e.clientY - dragY) + "px";
                    //
                    //         } else if (window.event) {
                    //             dragObj.style.left = (dragLeft + window.event.clientX - dragX) + "px";
                    //             dragObj.style.top = (dragTop + window.event.clientY - dragY) + "px";
                    //         }
                    //     }
                    // });
                    // document.querySelector("body").addEventListener('mouseup',(event)=>{
                    //     drag = false;
                    // });
                    // htmlManager.querySelector('#playGame').addEventListener('click',async (event)=>{
                    //
                    //     payload['this'].querySelector('#moneybarwrap').style.display = 'flex'
                    //     payload['pcount'] = parseInt(htmlManager.getElementById("playernumber").value, 10);
                    //     payload['playerArray'] = new Array(payload['pcount']);
                    //     let p;
                    //     (async (payload)=>{
                    //         let length =   payload['playerArray'].length;
                    //         let num;
                    //         let indexArray = [];
                    //         for (let i = 0; i < length; i++) {
                    //             indexArray[i] = i;
                    //         }
                    //         payload['indexArray'] = []
                    //         for (let i = 0; i < length; i++) {
                    //             Generate random number between 0 and indexArray.length - 1.
                                // num = Math.floor(Math.random() * indexArray.length);
                                // payload['indexArray'][i] = indexArray[num] + 1;
                                // indexArray.splice(num, 1);
                            // }
                        // })(payload)

                        // payload['playerArray'] = payload['indexArray']
                        // for (let i = 1; i <= payload['pcount']; i++) {
                        //     p = payload['player'][payload['playerArray'][i - 1]];
                        //     p.color = htmlManager.querySelector(`#player${i}color`).value.toLowerCase();
                        //     if (htmlManager.getElementById("player" + i + "ai").value === "0") {
                        //         p.name = htmlManager.getElementById("player" + i + "name").value;
                        //         p.human = true;
                        //     } else if (htmlManager.getElementById("player" + i + "ai").value === "1") {
                        //         p.human = false;
                        //         await ai['get']({type:'AITest', player: p}, payload)
                        //
                        //         p.AI = new AITest(p);
                            // }
                        // }
                        //
                        // htmlManager.querySelector('#board').style.display = 'flex'
                        // htmlManager.querySelector('#moneybar').style.display = 'flex'
                        // htmlManager.querySelector('#setup').style.display = 'none'
                        //
                        // if ( payload['pcount']  === 2) {
                        //     htmlManager.getElementById("stats").style.width = "454px";
                        // } else if ( payload['pcount']  === 3) {
                        //     htmlManager.getElementById("stats").style.width = "686px";
                        // }
                        //
                        // htmlManager.getElementById("stats").style.top = "0";
                        // htmlManager.getElementById("stats").style.left = "0";



                        /**
                         *
                         * Function Play game
                         *
                         */
                        // (async (payload)=>{
                            // console.assert(false)
                            /*
                            if (game.auction()) {
                                return;
                            }
        */
                            // payload['turn']++;
                            // if (payload['turn'] > payload['pcount']) {
                            //     payload['turn'] -= payload['pcount'];
                            // }
                            //
                            // let p = payload['player'][payload['turn']];
                            // payload = await monopoly['get']({type:'resetDice'}, payload);
                            // htmlManager.getElementById("pname").innerHTML = p.name;
                            // await mInterface['get']({type:'addAlert', value:`It is ${p.name} 's turn`}, payload)
                            // p.pay(0, p.creditor, payload);
                            //
                            // htmlManager.querySelector('#landed').style.display = 'none'
                            // htmlManager.querySelector('#option').style.display = 'none'
                            // htmlManager.querySelector('#manage').style.display = 'none'
                            //
                            // htmlManager.querySelector('#board').style.display = 'flex'
                            // htmlManager.querySelector('#control').style.display = 'flex'
                            // htmlManager.querySelector('#moneybar').style.display = 'flex'
                            // htmlManager.querySelector('#viewstats').style.display = 'flex'
                            // htmlManager.querySelector('#buy').style.display = 'flex'
                            //
                            // payload['doublecount'] = 0
                            // if (p.human) {
                            //     htmlManager.getElementById("nextbutton").focus();
                            // }
                            // htmlManager.getElementById("nextbutton").value = "Roll Dice";
                            // htmlManager.getElementById("nextbutton").title = "Roll the dice and move your token accordingly.";

                            // //console.assert(false, payload)

                            // htmlManager.querySelector('#die0').style.display = 'none'
                            // htmlManager.querySelector('#die1').style.display = 'none'
                            // if (p.jail) {
                            //
                            //     let landed = htmlManager.querySelector(`#landed`).style.display = 'flex'
                            //     htmlManager.getElementById("landed").innerHTML = "You are in jail.<input id='landedItemJail' type='button' title='Pay $50 fine to get out of jail immediately.' value='Pay $50 fine' />";
                            //     htmlManager.querySelector('landedItemJail').addEventListener('click', async ()=>{
                            //
                                    // console.assert(false, payload)

                                    // await mInterface['get']({type:'payFifty'}, payload)
                                // })
                                // if (p.communityChestJailCard || p.chanceJailCard) {
                                //     htmlManager.getElementById("landed").innerHTML += "<input type='button' id='gojfbutton' title='Use &quot;Get Out of Jail Free&quot; card.' value='Use Card' />";
                                //
                                //     htmlManager.querySelector('gojfbutton').addEventListener('click', async ()=>{
                                //
                                        // console.assert(false, payload)

                                        // await mInterface['get']({type:'useJailCard'},payload)
                                    // })
                                //
                                // }

                                // htmlManager.getElementById("nextbutton").title = "Roll the dice. If you throw doubles, you will get out of jail.";
                                //
                                // if (p.jailroll === 0)
                                //     await mInterface['get']({type:'addAlert', value:`This is ${p.name} 's first turn in jail.`}, payload)
                                // else if (p.jailroll === 1)
                                //     await mInterface['get']({type:'addAlert', value:`This is ${p.name} 's second turn in jail.`}, payload)
                                // else if (p.jailroll === 2) {
                                //     htmlManager.getElementById("landed").innerHTML += "<div>NOTE: If you do not throw doubles after this roll, you <i>must</i> pay the $50 fine.</div>";
                                //     await mInterface['get']({type:'addAlert', value:`This is ${p.name} 's third turn in jail.`}, payload)
                                // }
                                // if (!p.human && p.AI.postBail()) {
                                //     if (p.communityChestJailCard || p.chanceJailCard) {
                                //         await mInterface['get']({type:'useJailCard'}, payload)
                                //     } else {
                                //         await mInterface['get']({type:'payFifty'}, payload)
                                //     }
                                // }
                            // }
                            //
                            // //console.assert(false)
                            // await gameplay['get']({type:'updateMoney' }, payload)
                            // await gameplay['get']({type:'updatePosition' }, payload)
                            // await gameplay['get']({type:'updateOwned' }, payload)


                            // let arrow =  htmlManager.querySelectorAll('.money-bar-arrow')
                            // for(let j =0; j <arrow.length; j++){
                            //     if(payload['currentbidder'] === j){}else{
                            //         arrow[j].style.display = 'none'
                            //     }
                            // }
                            // if (!p.human) {
                            //
                            //
                            //     if (!await ai['get']({type:'beforeTurn', player: p}, payload)) {
                            //         await mInterface['get']({type:'next', player:p}, payload)
                            //     }
                            // }
                        //
                        // })(payload)
                        /**
                         *
                         * end play
                         */
                    // })

                    // htmlManager.getElementById("statsdrag").onmousedown =async function(e) {
                        //console.assert(false, e)
                        // dragObj = htmlManager.getElementById("stats");
                        // dragObj.style.position = "relative";
                        //
                        // dragTop = parseInt(dragObj.style.top, 10) || 0;
                        // dragLeft = parseInt(dragObj.style.left, 10) || 0;
                        //
                        // if (window.event) {
                        //     dragX = window.event.clientX;
                        //     dragY = window.event.clientY;
                        // } else if (e) {
                        //     dragX = e.clientX;
                        //     dragY = e.clientY;
                        // }
                        //
                        // drag = true;
                    // };

                    // htmlManager.getElementById("popupdrag").onmousedown = async function(e) {
                        //console.assert(false, e)
                        // dragObj = htmlManager.getElementById("popup");
                        // dragObj.style.position = "relative";
                        //
                        // dragTop = parseInt(dragObj.style.top, 10) || 0;
                        // dragLeft = parseInt(dragObj.style.left, 10) || 0;
                        //
                        // if (window.event) {
                        //     dragX = window.event.clientX;
                        //     dragY = window.event.clientY;
                        // } else if (e) {
                        //     dragX = e.clientX;
                        //     dragY = e.clientY;
                        // }
                        //
                        // drag = true;
                    // };

                    // htmlManager.querySelector('#mortgagebutton').addEventListener('click',async (event)=>{
                        //console.assert(false, event)


                        // let checkedProperty = await mInterface['get']({type:'getCheckedProperty'},payload);
                        // let s = payload['square'][checkedProperty];
                        // if (s.mortgage) {
                        //     if (payload['player'][s.owner].money < Math.round(s.price * 0.6)) {
                        //         await mInterface['get']({type:'popup', HTML:`<p>You need $ ${(Math.round(s.price * 0.6) - payload['player'][s.owner].money)}  more to unmortgage ${ s.name} .</p>`},payload)
                        //     } else {
                        //         await mInterface['get']({type:'popup', HTML:`<p>${payload['player'][s.owner].name}  are you sure you want to unmortgage ${s.name} for $ ${Math.round(s.price * 0.6)} ? .</p>`,
                        //             action: async (obj, payload)=>{
                        //
                        //                 await mInterface['get']({type:'unmortgage', index:checkedProperty}, payload)
                        //             },
                        //             option: "Yes/No"
                        //         },payload)
                        //     }
                        // } else {
                        //
                        //     await mInterface['get']({type:'popup', HTML:`<p>${payload['player'][s.owner].name}  are you sure you want to unmortgage ${s.name} for $ ${ Math.round(s.price * 0.5)} ? .</p>`,
                        //         action: async (obj, payload)=>{
                        //
                        //             await mInterface['get']({type:'mortgage', index:checkedProperty}, payload)
                        //
                        //         },
                        //         option: "Yes/No"
                        //     },payload)
                        // }
                    //
                    // });
                    //
                    //
                    // htmlManager.querySelector('#buyhousebutton').addEventListener('click',async (event)=>{
                    //     let checkedProperty = (()=>{
                    //
                    //         for (let i = 0; i < 42; i++) {
                    //             if (htmlManager.getElementById("propertycheckbox" + i) && htmlManager.getElementById("propertycheckbox" + i).checked) {
                    //                 return i;
                    //             }
                    //         }
                    //         return -1;
                    //     })();
                    //     let s = payload['square'][checkedProperty];
                    //     let p = payload['player'][s.owner];
                    //     let houseSum = 0;
                    //     let hotelSum = 0;
                    //
                    //     if (p.money < s.houseprice) {
                    //         if (s.house === 4) {
                    //             popup("<p>You need $" + (s.houseprice - player[s.owner].money) + " more to buy a hotel for " + s.name + ".</p>");
                    //             await mInterface['get']({type:'popup', HTML:"<p>You need $" + (s.houseprice - payload['player'][s.owner].money) + " more to buy a hotel for " + s.name + ".</p>"},payload)
                    //             out(payload)
                    //         } else {
                    //             await mInterface['get']({type:'popup', HTML:"<p>You need $" + (s.houseprice - payload['player'][s.owner].money) + " more to buy a house for " + s.name + ".</p>"},payload)
                    //             out(payload)
                    //         }
                    //     }
                    //
                    //     for (let i = 0; i < 40; i++) {
                    //         if (payload['square'][i].hotel === 1) {
                    //             hotelSum++;
                    //         } else {
                    //             houseSum += payload['square'][i].house;
                    //         }
                    //     }
                    //
                    //     if (s.house < 4 && houseSum >= 32) {
                    //         await mInterface['get']({type:'popup', HTML:"<p>All 32 houses are owned. You must wait until one becomes available.</p>"},payload)
                    //         out(payload)
                    //     } else if (s.house === 4 && hotelSum >= 12) {
                    //         await mInterface['get']({type:'popup', HTML:"<p>All 12 hotels are owned. You must wait until one becomes available.</p>"},payload)
                    //         out(payload);
                    //     }
                    //
                    //     await monopoly['get']({type:'buyHouse', index:checkedProperty}, payload)
                    //
                    // });
                    // htmlManager.querySelector('#statsclose').addEventListener('click',async (event)=>{
                    //     payload['this'].querySelector('#statswrap').style.display = 'none'
                    //     payload['this'].querySelector('#statsbackground').style.display = 'none'
                        // $("#statswrap").hide();
                        // $("#statsbackground").fadeOut(400);
                    // });
                    // htmlManager.querySelector('#statsbackground').addEventListener('click',async (event)=>{
                    //
                    //     payload['this'].querySelector('#statswrap').style.display = 'none'
                    //     payload['this'].querySelector('#statsbackground').style.display = 'none'

                        // $("#statswrap").hide();
                        // $("#statsbackground").fadeOut(400);
                    // });

                    // htmlManager.querySelector('#buy-menu-item').addEventListener('click',async (event)=>{
                    //     htmlManager.querySelector(`#buy`).style.display ='flex'
                    //     htmlManager.querySelector(`#manage`).style.display ='none'

                        // Scroll alerts to bottom.
                        // $("#alert").scrollTop($("#alert").prop("scrollHeight"));
                    // });

                    // htmlManager.querySelector('#manage-menu-item').addEventListener('click',async (event)=>{
                    //     htmlManager.querySelector(`#buy`).style.display ='none'
                    //     htmlManager.querySelector(`#manage`).style.display ='flex'
                    // });


                    // htmlManager.querySelector('#sellhousebutton').addEventListener('click',async (event)=>{
                    //     let checkedProperty = (()=>{
                    //
                    //         for (let i = 0; i < 42; i++) {
                    //             if (htmlManager.getElementById("propertycheckbox" + i) && htmlManager.getElementById("propertycheckbox" + i).checked) {
                    //                 return i;
                    //             }
                    //         }
                    //         return -1;
                    //     })();
                    //     console.assert(false, event)
                        // await monopoly['get']({type:'sellHouse', index:checkedProperty}, payload)
                    // });
                    // htmlManager.querySelector('#viewstats').addEventListener('click',async (event)=>{
                        // console.assert(false, event)
                        // gameplay['get']({type:'showStats'}, payload)
                    //
                    // });

                    // htmlManager.querySelector('#trade-menu-item').addEventListener('click',async (event)=>{
                    //     await gameplay['get']({type:'trade', tradeObj:null}, payload)
                    //
                    // });
                    out(monopoly)
                    break
                default:
                    break
            }

        })

    }
}