import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import queue from '/static/html/components/component_modules/queue/queue.mjs'
import Module from '/static/html/components/component_modules/graph/module/module.mjs'
import loader from '/static/html/components/component_modules/loader/loader.mjs'
let object = {}
let Class = class Graph {
    constructor(self) {
        this.drawChart = this.drawChart.bind(this)
        this.getGraph = this.getGraph.bind(this)
        this.processRawData = this.processRawData.bind(this)
        this.generateDataArrays = this.generateDataArrays.bind(this)
        this.addEventListener = this.addEventListener.bind(this)
        this.clearPreviousGame = this.clearPreviousGame.bind(this)
        this.addDataPoint = this.addDataPoint.bind(this)
        this.numberToText = this.numberToText.bind(this)
        this.checkForExpiredOpenPositions = this.checkForExpiredOpenPositions.bind(this)
        document.addEventListener('typeScript-end-graph', this.end)
    }
    drawChart(view = true,property='a',color = 'black', substrate={_:'button'},relation='transfer' ){
        return new Promise(async (resolve, reject) => {
            let module = {}
            if(relation === 'graphInLine'){
                module = property
            }else{
                module = await Module()
            }
            substrate.this.shadowRoot.querySelector('#container').style.display = 'none'
            substrate.this.shadowRoot.querySelector('.chart-buttons-container').style.display = 'none'
            substrate.this.shadowRoot.querySelector('#loader-section').style.display = 'flex'
            module.asset = module.assets[Math.floor(Math.random()* module.assets.length)]
            let speedInput =  substrate.this.shadowRoot.querySelector('#data-speed-input').value
            module.dataFlowIntervalTimer = Math.round((10/speedInput)*1000)
            let rawData = await this.getGraph(module)
            const data = await this.processRawData(rawData);
            await this.generateDataArrays(data, module);
            let charts =  await loader('https://code.highcharts.com/stock/highstock.js','Highcharts' )
            let container =  substrate.this.shadowRoot.querySelector('#container')
            module.chart = charts.stockChart(container, {
                        rangeSelector: {
                            buttons: [
                                {type: 'month',count: 1,text: '1m'},
                                {type: 'month',count: 3,text: '3m'},
                                {type: 'month',count: 6,text: '6m'},
                                {type: 'year',count: 1,text: '1y'},
                                {type: 'all',text: 'All'}],
                            selected: window.innerWidth>768 ? 3 : 2,
                            inputEnabled: true
                        },
                        title: {
                            text: module.asset,
                            margin: 8
                        },
                        xAxis: {
                            crosshair: true
                        },
                        yAxis: {
                            crosshair: true
                        },
                        series: [{
                            type: 'candlestick',
                            name: module.isAssetHidden ? 'Series 1' : module.asset,
                            data: module.displayedDataPoints,
                            dataGrouping: {
                                units: [
                                    ['day', [1] ]
                                ]
                            }
                        }]
                    });
    
    
            let highchartsTitle = substrate.this.shadowRoot.querySelector('.highcharts-title')
            module.isAssetHidden ? highchartsTitle.style.opacity = '0' : highchartsTitle.style.opacity = '1';
          
            let loaderSection = substrate.this.shadowRoot.querySelector('#loader-section')
            let chartButtonsContainerLeft = substrate.this.shadowRoot.querySelector('#chart-buttons-container-left')
            let chartButtonsContainerRight = substrate.this.shadowRoot.querySelector('#chart-buttons-container-right')
           // console.assert(false,chartButtonsContainer )
            loaderSection.style.display ='none';
            container.style.display ='flex';
            chartButtonsContainerLeft.style.display ='flex';
            chartButtonsContainerRight.style.display ='flex';
            resolve(module)
        })
    }
    getGraph(module){
        return new Promise(async (resolve, reject) => {
        let result =  await fetch(`${module.proxyURL}https://www.quandl.com/api/v3/datasets/WIKI/${module.asset}/data.json?api_key=${module.QUANDL_API_KEY}`)
            result = await result.json()
            resolve(result)
        })
    }
    processRawData(rawData) {
        return new Promise(async (resolve, reject) => {
            rawData = rawData.dataset_data.data;
            let data = [];
            for(let i=0; i<rawData.length; i++) {
                let dataRow = [];
                dataRow.push(Date.parse(rawData[i][0]));
                for(let j=1; j<5; j++) {
                    dataRow.push(rawData[i][j]);
                }
                data.push(dataRow);
            }
            data.reverse(); // Ascending Order for Dates (raw data comes in descending order)
            resolve(data);
            
        })
    }
    generateDataArrays(data, module) {
        return new Promise(async (resolve, reject) => {
            const maxDisplayedIndex = data.length > 300 ? data.length-300 : 0; // Leave at least 300 hidden data points (or all points if less than 300 points available)
            const randomDisplayedIndex = Math.floor(Math.random()*maxDisplayedIndex);
            module.displayedDataPoints = [];
            module.remainingDataPoints = [];
            for(let i=0; i<randomDisplayedIndex; i++) module.displayedDataPoints.push(data[i]);
            for(let i=randomDisplayedIndex; i<data.length; i++) module.remainingDataPoints.push(data[i]);
            resolve(true)
        })
    }
    addEventListener(view = true,property='a',color = 'black', substrate={_:'button'},relation='transfer' ){
        return new Promise(async (resolve, reject) => {
        let module = property
        let startEndGame = substrate.this.shadowRoot.querySelector('#start-end-game')
        let showHideAsset = substrate.this.shadowRoot.querySelector('#show-hide-asset')
        let playPause = substrate.this.shadowRoot.querySelector('#play-pause')
        let refreshBtn = substrate.this.shadowRoot.querySelector('#refresh-btn')
        let dataSpeedInput = substrate.this.shadowRoot.querySelector('#data-speed-input')
        let highchartsTitle = substrate.this.shadowRoot.querySelector('.highcharts-title')
        let bettingAmount = substrate.this.shadowRoot.querySelector('#betting-amount')
        let expiry = substrate.this.shadowRoot.querySelector('#expiry')
        let buySellButtons = substrate.this.shadowRoot.querySelector('#buy-sell-buttons')
    
        let gameControls = substrate.this.shadowRoot.querySelector('#game-controls')
    
    
            showHideAsset.addEventListener('click', async (event)=>{
                if(module.isAssetHidden) {
                    showHideAsset.querySelector('img').src = '/static/html/components/crypto-graph/images/eyeSlash.svg'
                    highchartsTitle.style.opacity = '1';
                    module.chart.series[0].update({name: module.asset.toUpperCase()}, false);
                }
                else {
                    showHideAsset.querySelector('img').src = '/static/html/components/crypto-graph/images/eye.svg'
                    highchartsTitle.style.opacity = '0';
                    module.chart.series[0].update({name: 'Series 1'}, false);
                }
                module.isAssetHidden = !module.isAssetHidden;
                
            })
            refreshBtn.addEventListener('click', async (event)=>{
                if(module.gameHistory.history.length>0) {
                    this.clearPreviousGame(module, substrate);
                }
               await this.drawChart(true, module ,'4',substrate , 'graphInLine' );
                if(!module.isGamePaused) {
                    playPause.click();
                }
                else {
                    if(playPause.disabled === true) {
                        playPause.disabled = false;
                    }
                }
            })
            // Handle "play-pause" click
            playPause.addEventListener('click', async ()=>{
                if(module.isGamePaused) { // Continue data flow
    
                    playPause.querySelector('img').src ='/static/html/components/crypto-graph/images/pause.svg'
                    // $("#play-pause i").removeClass("glyphicon-play").addClass("glyphicon-pause");
                    module.dataFlowIntervalFunction = setInterval(() => this.addDataPoint(module, substrate), module.dataFlowIntervalTimer);
                }
                else { // Pause data flow
                    playPause.querySelector('img').src ='/static/html/components/crypto-graph/images/play.svg'
                    // $("#play-pause i").removeClass("glyphicon-pause").addClass("glyphicon-play");
                    clearInterval(module.dataFlowIntervalFunction);
                }
                module.isGamePaused = !module.isGamePaused;
            })

        
            
        startEndGame.addEventListener('click',async ()=>{
            if(module.isGameInProgress) { // end current game
                startEndGame.classList.remove("btn-danger")
                startEndGame.classList.add("btn-success")
                refreshBtn.disabled = false
                if(!module.isGamePaused) {
                    playPause.click()
                }
                gameControls.style.opacity = '0.5'
                module.isGameInProgress = !module.isGameInProgress;
            }
            else { // initiate game
                if(module.remainingDataPoints.length>0) {
                    if(module.gameHistory.history.length>0) { this.clearPreviousGame(module, substrate) }
                    startEndGame.classList.remove("btn-success")
                    startEndGame.classList.add("btn-danger")
                    refreshBtn.disabled = true
          
                    if(module.isGamePaused) { playPause.click() }
                    gameControls.style.opacity = '1'
                    module.isGameInProgress = !module.isGameInProgress;
                }
                else {
                    refreshBtn.classList.add("tada")
                    setTimeout(function(){
                        refreshBtn.classList.remove("tada")
                        }, 1000);
                }
            }
        })
        dataSpeedInput.addEventListener('input', async (e)=>{
            module.dataFlowIntervalTimer = Math.round((10/e.currentTarget.value)*1000);
                if(!module.isGamePaused) {
                    clearInterval(module.dataFlowIntervalFunction);
                    module.dataFlowIntervalFunction = setInterval(() => this.addDataPoint(module, substrate), module.dataFlowIntervalTimer);
                    }
                });
            })
        // $("#data-speed-input").on("input", function() {
        //     $(this).attr("style",`--val: ${$(this).val()};`);
        //     dataFlowIntervalTimer = Math.round((10/$(this).val())*1000);
        //     if(!isGamePaused) {
        //         clearInterval(dataFlowIntervalFunction);
        //         dataFlowIntervalFunction = setInterval(() => addDataPoint(), dataFlowIntervalTimer);
        //         }
        //     });
        // })
    }
    clearPreviousGame(module, substrate){
        return new Promise(async (resolve, reject) => {
            module.gameHistory = {
                cashBalance: module.initialCashBalance,
                openPositions: 0,
                equity: module.initialCashBalance,
                totalBetsMatured: 0,
                totalBetsWon: 0,
                totalAmountWon: 0,
                totalAmountLost: 0,
                totalProfit: 0,
                history: []
            };
            let cashBalance = substrate.this.shadowRoot.querySelector('#cash-balance')
            let openPositions = substrate.this.shadowRoot.querySelector('#open-positions')
            let equity = substrate.this.shadowRoot.querySelector('#equity')
            let winRate = substrate.this.shadowRoot.querySelector('#win-rate')
            let averageProfit = substrate.this.shadowRoot.querySelector('#average-profit')
            let averageLoss = substrate.this.shadowRoot.querySelector('#average-loss')
            let totalProfit = substrate.this.shadowRoot.querySelector('#total-profit')
            let bettingAmount = substrate.this.shadowRoot.querySelector('#betting-amount')
            let expiry = substrate.this.shadowRoot.querySelector('#expiry')
            let gameHistory = substrate.this.shadowRoot.querySelector('#game-history')
    
            cashBalance.innerText = ''
            cashBalance.innerText = this.numberToText(module.gameHistory.cashBalance)
            openPositions.innerText = ''
            openPositions.innerText =this.numberToText(module.gameHistory.openPositions)
            equity.innerText = ''
            equity.innerText = this.numberToText(module.gameHistory.equity)
            winRate.innerText = ''
            winRate.innerText = module.gameHistory.totalBetsWon + "/" + module.gameHistory.totalBetsMatured
            averageProfit.innerText = ''
            averageProfit.innerText = "0"
            averageLoss.innerText = ''
            averageLoss.innerText = "0"
            totalProfit.innerText = ''
            totalProfit.innerText = '$0'
            bettingAmount.setAttribute('max', module.gameHistory.cashBalance)
            bettingAmount.setAttribute('value', '1000')
            bettingAmount.value = 1000
            expiry.setAttribute('max','100')
            expiry.setAttribute('value','10')
            expiry.value = 10
            let tbody = gameHistory.querySelector('tbody')
            tbody.innerHTML = ''
            for(let i=1; i<=4; i++) {
                tbody.insertAdjacentHTML('beforeend',`
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                `)
            }
        })
    }
    addDataPoint(module, substrate) {
        let expiry = substrate.this.shadowRoot.querySelector('#expiry')
        let playPause = substrate.this.shadowRoot.querySelector('#play-pause')
        let startEndGame = substrate.this.shadowRoot.querySelector('#start-end-game')
        if(module.remainingDataPoints.length>0) {
            module.chart.series[0].addPoint(module.remainingDataPoints.shift()); // addPoint(options [,redraw] [,shift])
            if(module.remainingDataPoints.length <+ expiry.getAttribute("max")) {
                expiry.setAttribute('max', module.remainingDataPoints.length)
                expiry.blur();
            }
            this.checkForExpiredOpenPositions(module, substrate);
        }
        else { // Game Over...
            if(module.isGameInProgress){
                startEndGame.click()
            }
            else {
                playPause.click();
            }
            playPause.disabled = true;
        }
    }
    numberToText(num) {
        if(Math.abs(num)<1000) return num.toString();
        else {
            const intAndDecPart = num.toString().split(".");
            const intPart = intAndDecPart[0];
            let res="";
            let counter = 0;
            for(let i=intPart.length-1; i>0; i--) {
                res = intPart[i] + res;
                counter++;
                if(counter%3===0) res = "," + res;
            }
            res = intPart[0] + res;
            if(intAndDecPart.length===2) return res+"."+intAndDecPart[1];
            else return res;
        }
    }
    checkForExpiredOpenPositions(module, substrate) {
        const currentIndex = module.displayedDataPoints.length-1;
        const expiredIndexArray = []; // Currently expiring bets' indices (of gameHistory.history[])
        module.gameHistory.history.forEach((elem,index) => { if(elem.expiryIndex === currentIndex) expiredIndexArray.push(index); });
        if(expiredIndexArray.length>0) {
            // const expiryPrice = displayedDataPoints[currentIndex][4];
            let closedPositionsAmount = 0;
            let closedPositionsProfit = 0;
            for(let i=0; i<expiredIndexArray.length; i++) {
                // gameHistory.history[expiredIndexArray[i]].expiryPrice = expiryPrice;
                closedPositionsAmount+=module.gameHistory.history[expiredIndexArray[i]].bettingAmount;
                closedPositionsProfit+=module.gameHistory.history[expiredIndexArray[i]].profit;
    
                let text1 = this.numberToText(module.gameHistory.history[expiredIndexArray[i]].expiryPrice)
                let text2 = this.numberToText(module.gameHistory.history[expiredIndexArray[i]].profit)
                let bet = substrate.shadowRoot.querySelectorAll(`#bet-${module.gameHistory.history[expiredIndexArray[i]].id}td`)
                
                console.assert(false, bet)
                let bet2 = substrate.shadowRoot.querySelector(`#bet-${module.gameHistory.history[expiredIndexArray[i]].id}td`)
                // $("#bet-"+gameHistory.history[expiredIndexArray[i]].id+" td").eq(-2).text();
                // $("#bet-"+gameHistory.history[expiredIndexArray[i]].id+" td").eq(-1).text();
                // if(gameHistory.history[expiredIndexArray[i]].profit>0) {
                //     $("#bet-"+gameHistory.history[expiredIndexArray[i]].id).addClass("success");
                //     gameHistory.totalBetsWon++;
                //     gameHistory.totalAmountWon += gameHistory.history[expiredIndexArray[i]].profit;
                // }
                // else {
                //     $("#bet-"+gameHistory.history[expiredIndexArray[i]].id).addClass("danger");
                //     gameHistory.totalAmountLost += Math.abs(gameHistory.history[expiredIndexArray[i]].profit);
                // }
            // }
            // gameHistory.cashBalance += (closedPositionsAmount + closedPositionsProfit);
            // gameHistory.openPositions -= closedPositionsAmount;
            // gameHistory.equity = gameHistory.cashBalance + gameHistory.openPositions;
            // gameHistory.totalBetsMatured += expiredIndexArray.length;
            // gameHistory.totalProfit += closedPositionsProfit;
            // $("#cash-balance").text(numberToText(gameHistory.cashBalance));
            // $("#open-positions").text(numberToText(gameHistory.openPositions));
            // $("#equity").text(numberToText(gameHistory.equity));
            // $("#win-rate").text(gameHistory.totalBetsWon + "/" + gameHistory.totalBetsMatured);
            // if(gameHistory.totalBetsWon>0) { $("#average-profit").text(numberToText(round(gameHistory.totalAmountWon/gameHistory.totalBetsWon, 0))); }
            // if(gameHistory.totalBetsMatured-gameHistory.totalBetsWon>0) { $("#average-loss").text(numberToText(round(gameHistory.totalAmountLost/(gameHistory.totalBetsMatured-gameHistory.totalBetsWon), 0))); }
            // $("#total-profit").text(gameHistory.totalProfit>=0 ? "$" + numberToText(gameHistory.totalProfit) : "-$" + numberToText(Math.abs(gameHistory.totalProfit)));
            // $("#betting-amount").attr("max", gameHistory.cashBalance);
            // if(gameHistory.equity===0) { // Game Over...
            //     if(isGameInProgress){ $("#start-end-game").click(); }
            }
        }
    }
    end(event){
        queue(event['detail']['console'], '~end',event['detail']['color'],event['detail']['substrate'],event['detail']['relation']).then((data)=>{

            colorlog(true, 'stat','stat',data, 'статистика')

        })
    }
    get self() {
        return object
    }
}


export default Class