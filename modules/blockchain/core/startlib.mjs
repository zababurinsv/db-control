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
    const buffer = global.buffer

    global.GetDataPath = function GetDataPath(name) {
        if(global.DATA_PATH.substr(global.DATA_PATH.length - 1, 1) !== "/")
            global.DATA_PATH = global.DATA_PATH + "/";
        return global.GetNormalPathString(global.DATA_PATH + name);
    }
    global.GetCodePath = function GetCodePath(name)
    {
        if(global.CODE_PATH.substr(global.CODE_PATH.length - 1, 1) !== "/")
            global.CODE_PATH = global.CODE_PATH + "/";

        return global.GetNormalPathString(global.CODE_PATH + name);
    }

    global.GetNormalPathString = function (Str)
    {
        return Str.split("\\").join('/');
    }

    global.CheckCreateDir = function (Path,bHidden,IsFile) {
        Path = global.GetNormalPathString(Path);
        if(!fs.existsSync(Path)) {
            if(!bHidden) {
                console.log("Create: " + Path);
            }


            let arr = Path.split('/');
            let CurPath = arr[0];
            if(IsFile) {
                arr.length--;
            }

            for(let i = 1; i < arr.length; i++) {
                CurPath += "/" + arr[i];
                debug('⛑ [(CheckCreateDir*)mkdirSync]', arr, CurPath)
                if(!fs.existsSync(CurPath)) {
                    fs.mkdirSync(CurPath);
                }
            }
        }
    }

    global.CopyFiles = CopyFiles;
    function CopyFiles(FromPath,ToPath,bRecursive)
    {
        if(fs.existsSync(FromPath))
        {
            let arr = fs.readdirSync(FromPath);

            for(let i = 0; i < arr.length; i++)
            {
                let name1 = FromPath + "/" + arr[i];
                let name2 = ToPath + "/" + arr[i];
                if(fs.statSync(name1).isDirectory())
                {
                    if(bRecursive)
                    {
                        if(!fs.existsSync(name2))
                            fs.mkdirSync(name2);
                        CopyFiles(name1, name2, bRecursive);
                    }
                }
                else
                {
                    let data = fs.readFileSync(name1);
                    let file_handle = fs.openSync(name2, "w");
                    fs.writeSync(file_handle, data, 0, data.length);
                    fs.closeSync(file_handle);
                }
            }
        }
    }

    if(!global.ToLog)
        global.ToLog = function (Str)
        {
            console.log(Str);
        };

    global.FindBlockchainStartTime = function (bCheck)
    {
        let Num = Math.trunc(Date.now() / global.CONSENSUS_PERIOD_TIME);
        let PathFile = global.DATA_PATH + "DB/main-index";
        //add fs
        if(bCheck && !fs.existsSync(PathFile))
        {
            let StartTime = (Num - 16) * global.CONSENSUS_PERIOD_TIME;
            return StartTime;
        }

        try
        {
            let stat = fs.statSync(PathFile);
            stat.size = 200
            let MaxNum = Math.trunc(stat.size / 6) - 11;
            if(!MaxNum)
                MaxNum = 0;

            let StartTime = (Num - MaxNum - 8) * global.CONSENSUS_PERIOD_TIME;
            console.log("****************************** RUN MODE IN CONTINUE_DB MaxNum:" + MaxNum + " TIME:" + StartTime);
            return StartTime;
        }
        catch(e)
        {
            console.log("****************************** CANNT RUN MODE IN CONTINUE_DB: " + e.stack);
            return 0;
        }
    }


    global.GetHexFromArr = function (arr) {
        if(!arr)
            return "";
        else
            return buffer.from(arr).toString('hex').toUpperCase();
    }
    global.GetHexFromArr8 = function (arr) {
        return global.GetHexFromArr(arr).substr(0, 8);
    }

    global.GetArrFromHex = function (Str)
    {
        let array = [];
        for(let i = 0; i < Str.length / 2; i++)
        {
            array[i] = parseInt(Str.substr(i * 2, 2), 16);
        }
        return array;
    }

    global.runcode = function (filename)
    {
        let Str = fs.readFileSync(filename, "utf-8");
        eval(Str);
    }

}