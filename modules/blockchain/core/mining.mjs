/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/

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
    const fs = global.fs
    const os = global.os
    let StartCheckMining = 0;
    global.MiningPaused = 0;
    let ProcessMemorySize = 0;
    global.ArrMiningWrk = [];
    let BlockMining;

    function AllAlive() {
        for(let i = 0; i < global.ArrMiningWrk.length; i++) {
            if(global.ArrMiningWrk[i]) {
                global.ArrMiningWrk[i].send({cmd:"Alive", DELTA_CURRENT_TIME:global.DELTA_CURRENT_TIME});
            }
        }
    }

    function ClearArrMining()
    {
        for(let i = 0; i < global.ArrMiningWrk.length; i++)
        {
            if(global.ArrMiningWrk[i])
                global.ArrMiningWrk[i].send({cmd:"Exit"});
        }

        global.ArrMiningWrk = [];
    }
    function RunStopPOWProcess(Mode) {

        if(!global.GetCountMiningCPU() || global.GetCountMiningCPU() <= 0) {
            return;
        }
        if(!StartCheckMining)
        {
            StartCheckMining = 1;
            setInterval(RunStopPOWProcess, global.CHECK_RUN_MINING);
            setInterval(AllAlive, 1000);
        }
        if(global.NeedRestart) {
            return;
        }


        if(global.USE_MINING && global.MINING_START_TIME && global.MINING_PERIOD_TIME) {

            let Time = global.GetCurrentTime();
            let TimeCur = Time.getUTCHours() * 3600 + Time.getUTCMinutes() * 60 + Time.getUTCSeconds();

            let StartTime = GetSecFromStrTime(global.MINING_START_TIME);
            let RunPeriod = GetSecFromStrTime(global.MINING_PERIOD_TIME);

            let TimeEnd = StartTime + RunPeriod;

            global.MiningPaused = 1;
            if(TimeCur >= StartTime && TimeCur <= TimeEnd)
            {
                global.MiningPaused = 0;
            }
            else
            {
                StartTime -= 24 * 3600;
                TimeEnd -= 24 * 3600;
                if(TimeCur >= StartTime && TimeCur <= TimeEnd)
                {
                    global.MiningPaused = 0;
                }
            }

            if(global.ArrMiningWrk.length && global.MiningPaused)
            {
                global.ToLog("------------ MINING MUST STOP ON TIME");
                ClearArrMining();
                return;
            }
            else
            if(!global.ArrMiningWrk.length && !global.MiningPaused)
            {
                global.ToLog("*********** MINING MUST START ON TIME");
            }
            else
            {
                return;
            }
        }
        else
        {
            global.MiningPaused = 0;
        }

        if(!global.USE_MINING || Mode === "STOP")
        {
            ClearArrMining();
            return;
        }

        if(global.USE_MINING && global.ArrMiningWrk.length)
            return;

        if(!GetMiningAccount())
            return;

        let PathMiner = GetCodePath("../miner.mjs");
        if(!fs.existsSync(PathMiner))
            PathMiner = "./process/pow-process.mjs";

        if(global.ArrMiningWrk.length >= GetCountMiningCPU())
            return;

        let Memory;
        if(global.TEST_MINING) {
            Memory = 90 * 1e6 * global.GetCountMiningCPU();
        } else {
            if(global.SIZE_MINING_MEMORY)
                Memory =  + global.SIZE_MINING_MEMORY;
            else
            {
                Memory = os.freemem() - (800 + GetCountMiningCPU() * 80) * 1024 * 1014;
                if(Memory < 0)
                {
                    global.ToLog("Not enough memory to start processes.");
                    return;
                }
            }
        }

        ProcessMemorySize = Math.floor(Memory / GetCountMiningCPU());
        let StrProcessMemorySize = Math.floor(ProcessMemorySize / 1024 / 1024 * 1000) / 1000;
        global.ToLog("START MINER PROCESS COUNT: " + GetCountMiningCPU() + " Memory: " + StrProcessMemorySize + " Mb for each process");

        for(let R = 0; R < GetCountMiningCPU(); R++) {

            let Worker = global.RunFork(PathMiner);
            if(!Worker)
                continue;
            global.ArrMiningWrk.push(Worker);
            Worker.Num = global.ArrMiningWrk.length;

            Worker.on('message', function (msg)
            {
                console.log('~~~~~~ Worker ~~~~~~', msg)
                if(msg.cmd === "log")
                {
                    global.ToLog(msg.message);
                }
                else
                if(msg.cmd === "online")
                {
                    Worker.bOnline = true;
                    global.ToLog("RUNNING PROCESS:" + Worker.Num + ":" + msg.message);
                }
                else
                if(msg.cmd === "POW")
                {
                    global.SERVER.MiningProcess(msg);
                }
                else
                if(msg.cmd === "HASHRATE")
                {
                    ADD_HASH_RATE(msg.CountNonce);
                }
            });

            Worker.on('error', function (err)
            {
                if(!global.ArrMiningWrk.length)
                    return;
                ToError('ERROR IN PROCESS: ' + err);
            });

            Worker.on('close', function (code)
            {
                global.ToLog("STOP PROCESS: " + Worker.Num + " pid:" + Worker.pid);
                for(let i = 0; i < global.ArrMiningWrk.length; i++)
                {
                    if(global.ArrMiningWrk[i].pid === Worker.pid)
                    {
                        global.ToLog("Delete wrk from arr - pid:" + Worker.pid);
                        global.ArrMiningWrk.splice(i, 1);
                    }
                }
            });
        }
    }

    let GlSendMiningCount = 0;
    function SetCalcPOW(Block,cmd)
    {
        //RPC Mining support
        if(global.USE_API_MINING && global.WEB_PROCESS && global.WEB_PROCESS.Worker)
        {
            global.WEB_PROCESS.sendAll({cmd:"MiningBlock", Value:{BlockNum:Block.BlockNum, PrevHash:global.GetHexFromArr(Block.PrevHash),
                    SeqHash:global.GetHexFromArr(Block.SeqHash), Hash:global.GetHexFromArr(Block.Hash), Time:Date.now(), }});
        }

        if(!global.USE_MINING)
            return;

        if(!Block.Hash)
            global.ToLogTrace("!Block.Hash on Block=" + Block.BlockNum);
        if(!Block.PrevHash)
            global.ToLogTrace("!Block.PrevHash on Block=" + Block.BlockNum);
        if(!Block.SeqHash)
            global.ToLogTrace("!Block.SeqHash on Block=" + Block.BlockNum);

        if(global.ArrMiningWrk.length !== GetCountMiningCPU())
            return;
        if(global.POW_MAX_PERCENT > 100)
            global.POW_MAX_PERCENT = 100;
        if(global.POW_MAX_PERCENT < 0)
            global.POW_MAX_PERCENT = 0;

        BlockMining = Block;
        for(let i = 0; i < global.ArrMiningWrk.length; i++)
        {
            let CurWorker = global.ArrMiningWrk[i];
            if(!CurWorker.bOnline)
                continue;

            GlSendMiningCount++;

            CurWorker.send({id:GlSendMiningCount, cmd:cmd, BlockNum:Block.BlockNum, Account:GetMiningAccount(), MinerID:GetMiningAccount(),
                SeqHash:Block.SeqHash, Hash:Block.Hash, PrevHash:Block.PrevHash, Time:Date.now(), Num:CurWorker.Num, RunPeriod:global.POWRunPeriod,
                RunCount:global.POW_RUN_COUNT, Percent:global.POW_MAX_PERCENT, CountMiningCPU:GetCountMiningCPU(), ProcessMemorySize:ProcessMemorySize,
                LastNonce0:0, Meta:Block.Meta, });
        }
    }

    global.SetCalcPOW = SetCalcPOW;
    global.RunStopPOWProcess = RunStopPOWProcess;

}