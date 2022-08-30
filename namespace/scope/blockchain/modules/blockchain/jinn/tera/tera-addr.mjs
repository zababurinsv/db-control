/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/


'use strict';

import logs from '../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    let path = import.meta.url
    let from = path.search('/jinn');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-5,url, id, props, data, ...args)
}

export default(global) => {
    debug('[(self)a]', global.PROCESS_NAME)
    function Init(Engine)
    {

        Engine.LastAddrSaveTime = Date.now();
        Engine.DoNodeAddr = function ()
        {
            var Period = Math.floor(global.JINN_CONST.RECONNECT_MIN_TIME / 2);

            var Delta = Math.floor((Date.now() - Engine.LastAddrSaveTime) / 1000);
            if(!Engine.NodesTree || Delta < Period)
                return;

            Engine.LastAddrSaveTime = Date.now();
            Engine.SaveAddrNodes();
        };

        const MIN_SCORE = 100;
        Engine.SaveAddrNodes = function () {
            var Arr = [];
            var it = Engine.NodesTree.iterator(), Item;
            while((Item = it.next()) !== null)
            {
                if(!Item.Score || Item.Score <= MIN_SCORE)
                    continue;

                var Power = Engine.GetAddrPower(Item.AddrHashPOW, Item.BlockNum);
                if(Item.System || global.MODELING)
                    Power += global.MIN_POW_ADDRES;

                if(Power < global.MIN_POW_ADDRES)
                    continue;

                var Item2 = {ip:Item.ip, port:Item.port, Score:Item.Score, System:Item.System, portweb:Item.portweb, ShardName:Item.ShardName};

                Arr.push(Item2);

                if(Arr.length >= global.JINN_CONST.MAX_RET_NODE_LIST)
                    break;
            }

            Engine.SortAddrArrByScore(Arr);
            var AddrData = {Arr:Arr, AddrItem:Engine.AddrItem};
            global.SaveParams(global.GetDataPath("jinn-nodes-" + global.GETNODES_VERSION + ".lst"), AddrData);
        };

        Engine.LoadAddrOnStart = function ()
        {
            var AddrData = global.LoadParams(global.GetDataPath("jinn-nodes-" + global.GETNODES_VERSION + ".lst"), {});
            debug(-2,'[(LoadAddrOnStart*)AddrData]')
            if(AddrData.AddrItem && AddrData.AddrItem.ip)
            {
                Engine.AddrItem = AddrData.AddrItem;
            }

            var Arr = AddrData.Arr;
            if(Arr)
            {
                if(Arr.length)
                {
                    Engine.UseExtraSlot = 1;
                }
                for(var i = 0; i < Arr.length; i++)
                {
                    var Item = Arr[i];
                    Engine.AddNodeAddr(Item);
                }
            }
        };
    }

    return {
        init:Init
    };
}