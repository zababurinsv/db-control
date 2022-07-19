/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

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

    function Init(Engine) {

        Engine.ValueToEncrypt = function (Str,Size)
        {
            if(!Size || Size <= 6)
                global.ToLogTrace("ValueToEncrypt: Error size = " + Size);
            let ArrValue = GetArrFromStr(Str, Size - 6);

            let ArrEncrypt = GetEncrypt(ArrValue, Engine.ArrCommonSecret);
            return ArrEncrypt;
        };

        Engine.ValueFromEncrypt = function (Child,ArrEncrypt)
        {
            if(global.IsZeroArr(ArrEncrypt))
                return "";

            let Arr = global.GetDecrypt(ArrEncrypt, Child.ArrCommonSecret);
            let Str = global.Utf8ArrayToStr(Arr);
            return Str;
        };

        function TestEncryptDecrypt()
        {
            Engine.ArrCommonSecret = global.sha3("SecretPassword");
            let ArrEncrypt = Engine.ValueToEncrypt("Secret message!!!", 40);
            console.log("ArrEncrypt length=" + ArrEncrypt.length);
            console.log("ArrEncrypt=" + ArrEncrypt);

            let Str2 = Engine.ValueFromEncrypt({ArrCommonSecret:Engine.ArrCommonSecret}, ArrEncrypt);
            console.log("Message=" + Str2);

            process.exit();
        };
    }

    function XORHash(arr1,arr2,length)
    {
        let arr3 = [];
        for(let i = 0; i < length; i++)
        {
            arr3[i] = arr1[i] ^ arr2[i];
        }
        return arr3;
    }

    return {
        Init: Init
    };
}
