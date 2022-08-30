/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

/**
 *
 * Serialization / deserialization of data sent to other nodes via the network
 *
**/
'use strict';

import logs from '../../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)
    global.JINN_MODULES.push({InitClass: InitClass, Name: "Serilize"});

//Engine context

    function InitClass(Engine) {
        Engine.SendFormatMap = {};
        Engine.GetBufferFromData = function (Method, Data, bSend) {
            var format = Engine.GetF(Method, bSend);
            if (format.struct === "")
                return undefined;

            var Buf = global.SerializeLib.GetBufferFromObject(Data, format.struct, format.wrk);
            return Buf;
        };

        Engine.GetDataFromBuffer = function (Method, Buf, bSend) {

            var format = Engine.GetF(Method, bSend);
            if (format.struct === "")
                return undefined;

            try {
                var Data = global.SerializeLib.GetObjectFromBuffer(Buf, format.struct, format.wrk);
                return Data;
            } catch (e) {
                ToLogOne(e);
                return undefined;
            }
        };

        Engine.GetF = function (Method, bSend) {
            var name;
            if (bSend)
                name = Method + "_SEND";
            else
                name = Method + "_RET";

            var format = Engine.SendFormatMap[name];
            if (format === undefined) {
                var Str = Engine[name];
                if (Str !== undefined) {
                    if (typeof Str === "object")
                        Str = global.SerializeLib.GetFormatFromObject(Str);

                    format = {struct: Str, wrk: {}};
                } else {
                    ToLogOne("NOT FOUND FORMAT FOR METHOD: " + name);
                    return {struct: ""};
                }
                Engine.SendFormatMap[name] = format;
            }
            return format;
        };
    }
}