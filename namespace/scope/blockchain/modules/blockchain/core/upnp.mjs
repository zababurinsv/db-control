/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/

// import Stun from "stun";
// import dns from "dns";
// import natUpnp from 'nat-upnp'

import logs from '../../debug/index.mjs'
let debug = (maxCount, system, property, substrate, ...args) => {
    let path = import.meta.url
    let from = path.search('/core');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(maxCount,url, system, property, substrate, args)
}

export default (global) => {
debug(-5, '🍇[(self)a]', global.PROCESS_NAME)
    let ClientUPNP ={}
    const natUpnp = global.natUpnp
    const Stun = global.stun
    const dns = global.dns

    debug(-3, '🍇[(StartPortMapping*)natUpnp]', {
        natUpnp
    })
    global.LOCAL_RUN = 0
    if(global.LOCAL_RUN) {
        global.StartPortMapping = function (ip,port,F) {
            debug(-3, '🍇[(StartPortMapping*)]', {
                ip,port,F
            })
            F(ip);
        };
    } else if(natUpnp) {
        ClientUPNP = natUpnp.createClient();
        debug(-3, '🍇[(natUpnp)StartUseUPNP]', {
            ClientUPNP
        })
        global.StartPortMapping = StartUseUPNP;

    } else {
        global.StartPortMapping = StartUseStun;
    }

    let PortMappingOK = 0;
    function StartUseUPNP(ip,port,F) {
        debug(-12, '--------------⚒[(StartUseUPNP*) ip,port,F]', {ip,port})

        if(PortMappingOK === port) {
            return;
        }

        if(F) {
            global.ToLog("USE UPNP");
        }

        ClientUPNP.portMapping({public:port, private:port, ttl:0}, function (err,results) {
            if(!err) {
                PortMappingOK = port;
                debug(-12, '--------------------⚒[(portMapping*)----------- OK port mapping]', port)
                global.ToLog("OK port mapping");
            } else {
                debug(-12, '--------------------⚒[(portMapping*)----------- Cannt port mapping]', port)
                global.ToLog("----------- Cannt port mapping: " + port);
                StartUseStun(ip, port, F);
                return;
            }

            if(F) {
                CheckMapping();
            }

            if(ip) {
                if(F) {
                    F(ip);
                }
                return;
            }

            ClientUPNP.externalIp(function (err,ip2) {
                if(err) {
                    global.ToLog("***********Error get externalIp");
                }
                global.ToLog("UPNP INTERNET IP:" + ip2);
                if(F) {
                    F(ip2);
                }
            });
        });
    }

    function StartUseStun(ip,port,F) {
        global.ToLog("NOT USE UPNP");
        debug(-5, '[(upnp)StartUseStun]', global.PROCESS_NAME, {
            ip,port,F
        })

        if(ip) {
            if(F) {
                F(ip);
            }
            return;
        }

        // let Stun = require('stun');
        let server = Stun.createServer();
        const request = Stun.createMessage(Stun.constants.STUN_BINDING_REQUEST);

        server.on('error', function (err) {
            global.ToLog("Error work stun server #2");
            if(F) {
                F();
            }
        });
        server.once('bindingResponse', function (stunMsg) {
            debug(-2, '[(server*)bindingResponse]', stunMsg)
            let value = stunMsg.getAttribute(Stun.constants.STUN_ATTR_XOR_MAPPED_ADDRESS).value;
            let ip2 = value.address;
            global.ToLog("STUN INTERNET IP:" + ip2);

            if(server) {
                server.close();
            }

            if(F) {
                F(ip2);
            }
        });

        let StrStunAddr = 'stun.l.google.com';
        dns.lookup(StrStunAddr, function (err,address,family) {
            if(!err)
                server.send(request, 19302, StrStunAddr);
            else
                global.ToLog("Error work stun server #1");
        });
    }

    function CheckMapping() {
        ClientUPNP.getMappings({local:true}, function (err,arr) {
            let WasFind = 0;
            if(arr) {
                for(let i = 0; i < arr.length; i++) {
                    let Item = arr[i];
                    if(Item && Item.public && Item.public.port === global.SERVER.port) {
                        WasFind = 1;
                        break;
                    }
                }
            }

            if(!WasFind) {
                global.ToLog("Start UPNP on port: " + global.SERVER.port);
                StartUseUPNP(global.SERVER.ip, global.SERVER.port);
            }
            setTimeout(CheckMapping, 600 * 1000);
        });
    }
}