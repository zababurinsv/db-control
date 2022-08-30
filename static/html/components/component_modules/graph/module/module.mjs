// Global Variables
const proxyURL = "https://cors-anywhere.herokuapp.com/"; // This is in order to bypass the 'Access-Control-Allow-Origin' error
const QUANDL_API_KEY = "HUNY3ZLcWGwrqcPJkihf"; // The Quandl API Key
const assets = ["AAPL", "ACCL", "AIRM", "AIT", "AKS", "AMZN", "ARTNA", "ASPS", "BCRX", "BIOL", "BLOX", "BMRN", "BSET", "BZH", "CASS", "CDI", "CE", "CFNL", "CHTR", "COVS", "CSCO", "CST", "CTIC", "CUR", "DMD", "DOC", "ENH", "ENTA", "ENZ", "ESIO", "ETH", "EVC", "FB", "FFKT", "FORR", "GAIA", "GB", "GCI", "GPX", "HL", "HOMB", "HPQ", "HTZ", "IDTI", "IHS", "IVC", "KEM", "KWR", "LWAY", "MA", "MBRG", "MCD", "MDCI", "MFRM", "MRIN", "MSFT", "MTG", "NBL", "NEOG", "NEWM", "NKE", "NWLI", "OHI", "PE", "PEIX", "PENN", "PENX", "PM", "PRSC", "PWR", "PZZA", "QLYS", "RBCAA", "RJET", "RNR", "ROL", "RRC", "SAIA", "SB", "SQI", "SRE", "SWY", "TAP", "TBPH", "TCB", "TECH", "THS", "TMO", "TOWR", "TPLM", "TRMB", "TSLA", "UDR", "UEIC", "UVV", "VAL", "VTG", "WBA", "WBC", "WWW"]; // 100 possible underlying assets
let asset = ""; // the underlying asset name eg. "AAPL" or "MSFT"
let displayedDataPoints = []; // Revealed data points
let remainingDataPoints = []; // Hidden data points
let chart; // The Main Chart
let dataFlowIntervalFunction; // The Data Flow Interval Function
// let dataFlowIntervalTimer = Math.round((10/$("#data-speed-input").val())*1000); // The intervals (in milliseconds) on how often to execute the dataFlowIntervalFunction (min: 0.5s, max: 10s)
let dataFlowIntervalTimer = undefined
let isGamePaused = true; // isGamePaused boolean value
let isAssetHidden = true; // isAssetHidden boolean value
let isGameInProgress = false; // isGameInProgress boolean value
const initialCashBalance = 100000; // Initial Cash Balance
let gameHistory = { // Holds the game history and current state
    cashBalance: initialCashBalance,
    openPositions: 0,
    equity: initialCashBalance,
    totalBetsMatured: 0,
    totalBetsWon: 0,
    totalAmountWon: 0,
    totalAmountLost: 0,
    totalProfit: 0,
    history: []
};



export default ()=>{
    return new Promise(async (resolve, reject) => {
        resolve({
            proxyURL:proxyURL,
            QUANDL_API_KEY:QUANDL_API_KEY,
            assets:assets,
            asset:asset,
            displayedDataPoints:displayedDataPoints,
            remainingDataPoints:remainingDataPoints,
            chart:chart,
            dataFlowIntervalFunction:dataFlowIntervalFunction,
            dataFlowIntervalTimer:dataFlowIntervalTimer,
            isGamePaused:isGamePaused,
            isAssetHidden:isAssetHidden,
            isGameInProgress:isGameInProgress,
            gameHistory:gameHistory,
            initialCashBalance:initialCashBalance
        })
    })
}