/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/

/**
 *
 * @type {{GetBlockList: (function(*, *): number), GetBlockFile: (function(*, *): number), InjectHTML: (function(*, *, *): Promise<unknown>), CreateAccount: (function(*, *): number), listener: {OnInfo: web3.listener.OnInfo, OnLogin: web3.listener.OnLogin, GetPubKey: (function(*): number), OnEvent: web3.listener.OnEvent}, Login: ((function(*, *, *): (Promise<unknown>))|*), SendCall: (function(*, *): number), GetAccountList: (function(*, *): number), Send: (function(*): number), GetTransactionList: (function(*, *): number), ComputeSecret: (function(*, *): number), SetVisibleBlock: web3.SetVisibleBlock, GetSmartList: (function(*, *): number), _CounterId: number, Logout: (function(): number), StaticCall: (function(*, *): number), _MapId: {}, SendMessage: ((function(*, *): (number))|*)}}
 */
let web3 = {
    Login: function (SmartNum,UrlPath,Forse) {
        let dapp = document.querySelector('#idTeraWallet')
        if(!dapp) {
            return web3.InjectHTML(UrlPath, SmartNum, Forse);
        } else {
            return web3.SendMessage({cmd:"login", smart:SmartNum, Forse:Forse});
        }
    },
    CreateAccount:function (Item,F) {
        return web3.SendMessage({cmd:"sendcreate", Item:Item}, F);
    },
    listener: {
        OnLogin:function (F) {
            console.log('~~~~~~~~OnLogin~~~~~~~~~~')
            web3._OnLogin = F;
        },
        OnInfo:function (F) {
            console.log('~~~~~~~~OnInfo~~~~~~~~~~')
            web3._OnInfo = F;
        },
        OnEvent:function (F) {
            console.log('~~~~~~~~OnEvent~~~~~~~~~~')
            web3._OnEvent = F;
        },
        GetPubKey:function (F) {
            console.log('~~~~~~~~GetPubKey~~~~~~~~~~')
            return web3.SendMessage({cmd:"GetPubKey"}, F);
        },
    },
    Logout:function () {
        web3.SetVisibleBlock("idTeraWallet", 0);
        return web3.SendMessage({cmd:"logout"});
    },
    Send:function (Tx) {
        web3.SetVisibleBlock("idTeraWallet", 1);
        return web3.SendMessage({cmd:"send", Item:Tx});
    },
    SendCall:function (Item,F) {
        return web3.SendMessage({cmd:"sendcall", Item:Item}, F);
    },
    StaticCall:function (Item,F) {
        return web3.SendMessage({cmd:"staticcall", Item:Item}, F);
    },
    GetAccountList:function (Params,F) {
        var Data = {cmd:"DappAccountList", Params:Params};
        return web3.SendMessage(Data, F);
    },
    GetSmartList:function (Params,F) {
        var Data = {cmd:"DappSmartList", Params:Params};
        return web3.SendMessage(Data, F);
    },
    GetBlockList:function (Params,F) {
        var Data = {cmd:"DappBlockList", Params:Params};
        return web3.SendMessage(Data, F);
    },
    GetTransactionList:function (Params,F) {
        var Data = {cmd:"DappTransactionList", Params:Params};
        return web3.SendMessage(Data, F);
    },
    GetBlockFile:function (Params,F) {
        var Data = {cmd:"DappBlockFile", Params:Params};
        return web3.SendMessage(Data, F);
    },
    ComputeSecret:function (Params,F) {
        return web3.SendMessage({cmd:"ComputeSecret", Params:Params}, F);
    },
    _CounterId:0,
    _MapId:{},
    SetVisibleBlock: (name,b) => {
        let id = name;
        if(id) {
            document.querySelector(`#${name}`).style.display = b ? 'block' : "none";
        }
    },
    SendMessage: (Data, F) => {
        if(F) {
            web3._CounterId++;
            web3._MapId[web3._CounterId] = F;
            Data.id = web3._CounterId;
        }
        let win = window.frames.terawallet;
        if(!win) {
            return 0;
        } else {
            console.log('ssssssssss postMessage sssssssssss', Data)
            win.postMessage(Data, "*");
            return 1;
        }
    },
    InjectHTML: (UrlPath,SmartNum,Forse) => {
        return new Promise(resolve => {
            if(!UrlPath) {
                UrlPath = "https://terawallet.org/web3-wallet.html";
            }
            let idTeraWallet = document.querySelector('#idTeraWallet')
            if(idTeraWallet) {
                console.log("Was created tera-HTML tags");
                resolve(false)
            } else {
                let body = document.body
                console.log(body)
                if(!body) {
                    console.error("Not find tag <BODY>");
                    resolve(false)
                } else {
                    let iframe = document.createElement('iframe');
                    iframe.name = 'terawallet';
                    iframe.sandbox = "allow-scripts allow-popups allow-same-origin";
                    iframe.src = UrlPath;
                    iframe.style = "display: none; width:45vw; height: 33vw; padding: 0; margin: 10px;  " + "border: 1px solid gray; border-radius:5px; box-shadow: 0 0 5px rgb(0 0 0); " + "position:absolute; top:50px; left: calc(50% - 160px);";
                    iframe.id = "idTeraWallet";
                    body.appendChild(iframe);
                    iframe.onload = function () {
                        if(SmartNum) {
                            web3.SendMessage({cmd:"login", smart:SmartNum, Forse:Forse});
                            resolve(iframe)
                        } else {
                            resolve(iframe)
                        }
                    };
                }
            }
        })
    }
}

export default web3

