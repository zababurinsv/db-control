/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

/**
 *
 * Compression of network traffic
 *
**/
'use strict';
import logs from '../../../debug/index.mjs'

let debug = (maxCount, id, props, data, ...args) => {
    let path = import.meta.url
    let from = path.search('/jinn');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(maxCount,url, id, props, data, ...args)
}
export default async (global) => {
    debug(-2, '🐒[(self)a]', global.PROCESS_NAME)
    const zlib = global.zlib
    const buffer = global.buffer
    const crypto = global.crypto
    const process = global.process
    if(global.IS_NODE_JS) {
        let Stream  = await import('stream')
        let Writable = Stream.Writable
        if (global.JINN_MODULES) {
            global.JINN_MODULES.push({InitClass: InitClass, Name: "Zip"});
        }

        global.glUseZip = 1;

        const ZIP_PACKET_SIZE = 32 * 1024;
        const ZIP_WINDOW_BITS = 15;

        const level = (!zlib.constants) ? zlib.Z_BEST_SPEED: zlib.constants.Z_BEST_SPEED;
        let zip_options = {
            flush: (!zlib.constants)?zlib.Z_SYNC_FLUSH:zlib.constants.Z_SYNC_FLUSH,
            chunkSize: ZIP_PACKET_SIZE,
            windowBits: ZIP_WINDOW_BITS,
            level: level
        };


        function InitClass(Engine)
        {
            Engine.PrepareOnSendZip = function (Child,Data)
            {

                if(!Child.EncodeZip)
                {

                    Child.EncodeZip = zlib.createGzip(zip_options);
                    Child.WriterZip = new Writable({objectMode:true, write:function (chunk,encoding,callback)
                        {
                            callback(0);
                            Engine.SendToNetwork(Child, chunk);
                        }});
                    Child.EncodeZip.pipe(Child.WriterZip);
                    Child.EncodeZip.on('error', function (err)
                    {
                        Child.ToError("EncodeZip: " + err, 3);
                    });
                    Child.WriterZip.WorkNum = Child.WorkNum;
                }
                Child.EncodeZip.write(buffer.from(Data));
            };
            Engine.PrepareOnReceiveZip = function (Child,Chunk)
            {
                let DecodeZip = Child.DecodeZip;
                if(!DecodeZip)
                {
                    DecodeZip = zlib.createGunzip(zip_options);
                    Child.WriterUnZip = new Writable({objectMode:true, write:function (chunk,encoding,callback)
                        {
                            callback(0);
                            Engine.PrepareOnReceive(Child, chunk);
                        }});
                    DecodeZip.pipe(Child.WriterUnZip);
                    DecodeZip.on('error', function (err)
                    {
                        Child.ToError("DecodeZip packet=" + Child.ReceivePacketCount + " work=" + Child.WriterUnZip.WorkNum + "/" + Child.WorkNum + " " + err);
                    });
                    Child.WriterUnZip.WorkNum = Child.WorkNum;
                    Child.DecodeZip = DecodeZip;
                }
                DecodeZip.write(Chunk);
            };
        }

        function TestZip(windowBits, PacketSize) {
            const zlib = require('zlib');

            let zip_options = {
                flush: zlib.constants.Z_SYNC_FLUSH,
                chunkSize: PacketSize,
                windowBits: windowBits,
                level: zlib.constants.Z_BEST_SPEED
            };

            let Count = 640 * 1024;
            let buffer = crypto.randomBytes(Count);
            let startTime = process.hrtime();
            zlib.gzipSync(buffer, zip_options);
            let Time = process.hrtime(startTime);
            let deltaTime = Time[0] * 1000 + Time[1] / 1e6;

            console.log("windowBits:" + windowBits + " PacketSize:" + PacketSize + "  Time=" + deltaTime + "ms");
        }
    } else {
        let Writable = global.Writable
        if (global.JINN_MODULES) {
            global.JINN_MODULES.push({InitClass: InitClass, Name: "Zip"});
        }

        global.glUseZip = 1;

        const ZIP_PACKET_SIZE = 32 * 1024;
        const ZIP_WINDOW_BITS = 15;

        const level = zlib.Z_BEST_SPEED;
        let zip_options = {
            flush: zlib.Z_SYNC_FLUSH,
            chunkSize: ZIP_PACKET_SIZE,
            windowBits: ZIP_WINDOW_BITS,
            level: level
        };


        function InitClass(Engine)
        {
            Engine.PrepareOnSendZip = function (Child,Data)
            {

                if(!Child.EncodeZip)
                {

                    Child.EncodeZip = zlib.createGzip(zip_options);
                    Child.WriterZip = new Writable({objectMode:true, write:function (chunk,encoding,callback)
                        {
                            callback(0);
                            Engine.SendToNetwork(Child, chunk);
                        }});
                    Child.EncodeZip.pipe(Child.WriterZip);
                    Child.EncodeZip.on('error', function (err)
                    {
                        Child.ToError("EncodeZip: " + err, 3);
                    });
                    Child.WriterZip.WorkNum = Child.WorkNum;
                }
                Child.EncodeZip.write(buffer.from(Data));
            };
            Engine.PrepareOnReceiveZip = function (Child,Chunk)
            {
                let DecodeZip = Child.DecodeZip;
                if(!DecodeZip)
                {
                    DecodeZip = zlib.createGunzip(zip_options);
                    Child.WriterUnZip = new Writable({objectMode:true, write:function (chunk,encoding,callback)
                        {
                            callback(0);
                            Engine.PrepareOnReceive(Child, chunk);
                        }});
                    DecodeZip.pipe(Child.WriterUnZip);
                    DecodeZip.on('error', function (err)
                    {
                        Child.ToError("DecodeZip packet=" + Child.ReceivePacketCount + " work=" + Child.WriterUnZip.WorkNum + "/" + Child.WorkNum + " " + err);
                    });
                    Child.WriterUnZip.WorkNum = Child.WorkNum;
                    Child.DecodeZip = DecodeZip;
                }
                DecodeZip.write(Chunk);
            };
        }

        function TestZip(windowBits, PacketSize) {
            const zlib = require('zlib');

            let zip_options = {
                flush: zlib.constants.Z_SYNC_FLUSH,
                chunkSize: PacketSize,
                windowBits: windowBits,
                level: zlib.constants.Z_BEST_SPEED
            };

            let Count = 640 * 1024;
            let buffer = crypto.randomBytes(Count);
            let startTime = process.hrtime();
            zlib.gzipSync(buffer, zip_options);
            let Time = process.hrtime(startTime);
            let deltaTime = Time[0] * 1000 + Time[1] / 1e6;

            console.log("windowBits:" + windowBits + " PacketSize:" + PacketSize + "  Time=" + deltaTime + "ms");
        }
    }
}