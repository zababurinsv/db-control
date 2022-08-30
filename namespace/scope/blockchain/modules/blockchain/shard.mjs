
'use strict';
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

    global.NETWORK="MAIN_JINN";
    global.SHARD_NAME="CREDIT";
    global.START_NETWORK_DATE=1638474045310;
    global.CONSENSUS_PERIOD_TIME=3000;//ms



    global.START_HISTORY=1;
    global.TEST_MINING=1;
    global.START_MINING=10;
//global.BLOCK_CREATE_INTERVAL=1;


    DevKeysInit();

//начальные ip нод
    global.SHARD_PARAMS.SeedServerArr=[{ip: "127.0.0.1", port: 3000, Score:10000000,System:1}];




    global.SHARD_PARAMS.GenesisAccountCreate=function()
    {
        ACCOUNTS.DBStateWriteInner({Num:0,PubKey:[],Value:{BlockNum:1,SumCOIN:1*TOTAL_SUPPLY_TERA},Name:"System"},1);
        ACCOUNTS.DBStateWriteInner({Num:1,PubKey:Buffer.from("025C5641EA56D3B7C4EB2D3C98214D687C9066801465325759FB853E36DA93026F","hex"),Value:{BlockNum:1,SumCOIN:1000000},Name:"Development"},1);
    };


    global.SHARD_PARAMS.GenesisSmartCreate=function()
    {
        SMARTS.DBSmartWrite({Num:0,ShortName:SHARD_NAME,Name:SHARD_NAME,Description:SHARD_NAME,BlockNum:0,TokenGenerate:1,Account:0,Category1:0});
    };


    global.SHARD_PARAMS.DoCoinBaseTR=function(Block)
    {
        if(Block.BlockNum<global.START_MINING)
            return;

        var OperationNum=0;
        OperationNum++;
        ACCOUNTS.SendMoneyTR(Block, 0, 1, {SumCOIN:1,SumCENT:0}, Block.BlockNum, 0xFFFF, "", "Development", 1, 0, OperationNum);

        var MinerID=ACCOUNTS.GetMinerFromBlock(Block);
        if(MinerID)
        {
            OperationNum++;
            ACCOUNTS.SendMoneyTR(Block, 0, MinerID, {SumCOIN:3,SumCENT:0}, Block.BlockNum, 0xFFFF, "", "Coin base", 1, 0, OperationNum);
        }
    };

    global.PRICE_DAO=function (BlockNum)
    {
        return {NewAccount:1, NewSmart:10, NewTokenSmart:100, NewShard:1000};
    }


    function DevKeysInit()
    {
        //for genesis block create
        var PubKey=Buffer.from("026A04AB98D9E4774AD806E302DDDEB63BEA16B5CB5F223EE77478E861BB583EB3","hex");

        //for accounts(8-15) create
        global.ARR_PUB_KEY=[];
        for(var i=0;i<100;i++)
            global.ARR_PUB_KEY[i]=global.GetHexFromArr(PubKey);

        //for check code sign in autoupdate mode
        global.DEVELOP_PUB_KEY_ARR=[Buffer.from("022E80AA78BC07C72781FAC12488096F0BFA7B4F48FBAB0F2A92E208D1EE3654DF","hex")];

    }
}