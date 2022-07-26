/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/


// let fs = require("fs");
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
    global.UpdateCodeFiles = function (StartNum) {
        let fname = global.GetDataPath("Update");
        if(!fs.existsSync(fname))
            return 0;

        let arr = fs.readdirSync(fname);
        let arr2 = [];
        for(let i = 0; i < arr.length; i++)
        {
            if(arr[i].substr(0, 7) === "wallet-")
            {
                arr2.push(parseInt(arr[i].substr(7)));
            }
        }
        arr2.sort(function (a,b)
        {
            return a - b;
        });

        for(let i = 0; i < arr2.length; i++)
        {
            let Num = arr2[i];
            let Name = "wallet-" + Num + ".zip";
            let Path = fname + "/" + Name;

            global.ToLog("Check file:" + Name);

            if(fs.existsSync(Path))
            {
                if(StartNum === Num)
                {
                    global.ToLog("UnpackCodeFile:" + Name);
                    UnpackCodeFile(Path);

                    if(StartNum % 2 === 0)
                    {
                        global.RestartNode(1);
                    }
                    else
                    {
                    }

                    return 1;
                }
                else
                {
                    global.ToLog("Delete old file update:" + Name);
                    fs.unlinkSync(Path);
                }
            }
        }

        return 0;
    }

    global.UnpackCodeFile = function (fname,bLog)
    {

        let data = fs.readFileSync(fname);
        let reader = ZIP.Reader(data);

        reader.forEach(function (entry)
        {
            let Name = entry.getName();
            let Path = GetCodePath(Name);

            if(entry.isFile())
            {
                if(global.DEV_MODE)
                {
                    global.ToLog("emulate unpack: " + Path);
                    return;
                }
                if(bLog)
                    global.ToLog(Path);

                let buf = entry.getData();
                global.CheckCreateDir(Path, true, true);

                let file_handle = fs.openSync(Path, "w");
                fs.writeSync(file_handle, buf, 0, buf.length);
                fs.closeSync(file_handle);
            }
            else
            {
            }
        });
        reader.close();
    }

    global.RestartNode = function RestartNode(bForce)
    {
        global.NeedRestart = 1;
        setTimeout(DoExit, 5000);

        if(global.nw || global.NWMODE) {

        } else {
            global.StopChildProcess();
            global.ToLog("********************************** FORCE RESTART!!!");
            return;
        }

        if(this.ActualNodes)
        {
            let it = this.ActualNodes.iterator(), Node;
            while((Node = it.next()) !== null)
            {
                if(Node.Socket) {
                    console.log('AAAAAAAAA CloseSocket AAAAAAAAAAA', CloseSocket)
                    CloseSocket(Node.Socket, "Restart");
                }

            }
        }

        global.SERVER.StopServer();
        global.SERVER.StopNode();
        global.StopChildProcess();

        global.ToLog("****************************************** RESTART!!!");
        global.ToLog("EXIT 1");
    }

    function DoExit()
    {
        global.ToLog("EXIT 2");
        if(global.nw || global.NWMODE)
        {
            global.ToLog("RESTART NW");

            let StrRun = '"' + process.argv[0] + '" --user-data-dir="..\\DATA\\Local" .\n';
            StrRun += StrRun;
            SaveToFile("run-next.bat", StrRun);

            const child_process = require('child_process');
            child_process.exec("run-next.bat", {shell:true});
        }

        global.ToLog("EXIT 3");
        process.exit(0);
    }

    function GetRunLine()
    {
        let StrRun = "";
        for(let i = 0; i < process.argv.length; i++)
            StrRun += '"' + process.argv[i] + '" ';
        return StrRun;
    }
}
