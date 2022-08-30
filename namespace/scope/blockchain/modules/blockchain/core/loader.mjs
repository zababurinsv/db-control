/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/

"use strict";

// var fs = require("fs");
// const http = require('http');
// const https = require('https');
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
    const https = global.https
    const http = global.http
    const fs = global.fs
    function LoadShardParams(path,bCheckFinish)
    {
        var lib = http;
        if(path.substr(0, 5) === "https")
            lib = https;
        else
        if(path.substr(0, 4) !== "http")
            path = "http://" + path;

        console.log("Try connect to: " + path);
        lib.get(path + '/shard.js', function (res)
        {
            const statusCode = res.statusCode;
            const contentType = res.headers['content-type'];

            let error;
            if(statusCode !== 200)
            {
                error = new Error('Request Failed. Status Code: ' + statusCode);
            }
            else
            if(!/^application\/javascript/.test(contentType))
            {
                error = new Error("Invalid content-type. Expected application/javascript but received: " + contentType);
            }

            if(error)
            {
                console.error(error.message);
                res.resume();
                return CheckFinish(bCheckFinish);
            }

            let fname = global.GetDataPath("shard.mjs");
            let file_handle = fs.openSync(fname, "w");
            let Bytes = 0;
            res.on('data', function (chunk)
            {
                Bytes += chunk.length;
                fs.writeSync(file_handle, chunk, 0, chunk.length);
            });
            res.on('end', function ()
            {
                fs.closeSync(file_handle);

                console.log("Load OK, got " + Bytes + " bytes");
                return CheckFinish(bCheckFinish);
            });
        }).on('error', function (e)
        {
            console.error("Got error: " + e.message);
            return CheckFinish(bCheckFinish);
        });
    }

    function CheckFinish(bCheckFinish)
    {
        if(!bCheckFinish)
            return;

        setTimeout(function ()
        {
            process.exit();
        }, 2000);
    }
    return LoadShardParams;
}