/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/
import BufferBrowser from "../../buffer/index.mjs";
import logs from '../../debug/index.mjs'
let debug = (maxCount = -1, id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(maxCount,url, id, args)
}
export default (global) => {
    debug(-1, '🎵[(tests)a]', global.PROCESS_NAME)
    const process = global.process
    const buffer = global.buffer
    function DoTestBlockDB(Start,CountBlock)
    {
        var Str;
        var Count = 0;
        for(var num = Start; num < Start + CountBlock; num++)
        {
            var Block = global.SERVER.ReadBlockHeaderDB(num);
            if(!Block)
                break;

            if(!global.SERVER.CheckSeqHashDB(Block, "WriteBlockHeaderDB"))
            {
                Str = "Error on block " + num;
                break;
            }

            Count++;
        }

        if(!Str)
            Str = "Test OK. Start from: " + Start + " Block process count: " + Count;

        global.ToLog(Str);
        return Str;
    }

    global.DoTestBlockDB = DoTestBlockDB;

    global.SpeedSignLib = 0;
    global.TestSignLib = TestSignLib;
    function TestSignLib(MaxTime) {
        debug(-2,'🎵[(tests*)TestSignLib]')
        if(!MaxTime) {
            MaxTime = global.DEF_PERIOD_SIGN_LIB;
        }


        var hash = buffer.from("A6B0914953F515F4686B2BA921B8FAC66EE6A6D3E317B43E981EBBA52393BFC6", "hex");
        var PubKey = buffer.from("026A04AB98D9E4774AD806E302DDDEB63BEA16B5CB5F223EE77478E861BB583EB3", "hex");
        var Sign = buffer.from("5D5382C65E4C1E8D412D5F30F87B8F72F371E9E4FC170761BCE583A961CF44966F92B38D402BC1CBCB7567335051A321B93F4E32112129AED4AB602E093A1187",
            "hex");
        let startTime = (global.IS_NODE_JS)
            ? process.hrtime()
            : performance.now();
        let deltaTime = 1;
        let Num = 0
        for(Num; Num < 1000; Num++)
        {
            let Result = (global.IS_NODE_JS)
                ? global.secp256k1.verify(hash, Sign, PubKey)
                : global.secp256k1.verifySignatureCompact(Sign, PubKey, hash)
            if(!Result)
            {
                global.ToError("Error test sign");
                process.exit(0);
            }

            let Time = (global.IS_NODE_JS)
                ? process.hrtime(startTime)
                : performance.now();

            deltaTime = (global.IS_NODE_JS)
                ? (Time[0] * 1000 + Time[1] / 1e6)
                : Time - startTime

            if(deltaTime > MaxTime) {
                break;
            }
        }

        if(!deltaTime) {
            deltaTime = 1;
        }


        global.SpeedSignLib = Math.floor(Num * 500 / deltaTime);
        debug(-2,'🎵[(TestSignLib*)result]',`TestSignLib: num: ${Num}  SpeedSignLib: ${global.SpeedSignLib} per sec`)
        // global.ToLog(`TestSignLib: num: ${Num}  SpeedSignLib: ${global.SpeedSignLib} per sec`);
        Num = null
        if(global.SpeedSignLib < 800) {
            debug(-2,'🎵[(TestSignLib*)WARNING]',global.SpeedSignLib)
            global.ToLog("*************** WARNING: VERY SLOW LIBRARY: secp256k1 ***************");
            global.ToLog("You can only process: " + global.SpeedSignLib + " transactions");
            global.ToLog("Install all dependent packages, see detail: https://www.npmjs.com/package/secp256k1");
            return 0;
        }

        return 1;
    }
}