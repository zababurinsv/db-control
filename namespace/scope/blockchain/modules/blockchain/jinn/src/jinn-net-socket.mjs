/*
 * @project: JINN
 * @version: 1.1
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2019-2021 [progr76@gmail.com]
 * Telegram:  https://t.me/progr76
*/

/**
 *
 * Working with network sockets, creating a network server
 *
**/

'use strict';

import logs from '../../../debug/index.mjs'
let debug = (maxCount, id, props, data, ...args) => {
    const main = -7
    const path = import.meta.url
    const from = path.search('/blockchain');
    const to = path.length;
    const url = path.substring(from,to);
    const count = (typeof maxCount === "string") ? parseInt(maxCount,10): (maxCount < 0)? main: maxCount
    // logs.assert(count, url, id, props, data, ...args)
}
let statusConst = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']
export default (global) => {
    debug('?[(self)a]', global.PROCESS_NAME)
    const net = global.net;
    const buffer = global.buffer

    global.JINN_MODULES.push({InitClass: InitClass, InitAfter: InitAfter, Name: "NetSocket"});


//Engine context

    function InitClass(Engine) {
        debug('?[(InitClass)createServer]')
        Engine.CreateServer = function () {
            debug(-5, '⚫[(server*)createServer]')
            Engine.Server = net.createServer(function (Socket) {
                Engine.SetEventsOnError(Socket);
                debug(-5, '⚫[(server*)Server is create]')
                if (global.StopNetwork) {
                    return;
                }

                if (!Socket || !Socket.remoteAddress) {
                    return;
                }

                if (Engine.WasBanIP({address: Socket.remoteAddress})) {
                    Engine.CloseSocket(Socket, undefined, "WAS BAN", true);
                    return;
                }

                var Child = Engine.RetNewConnectByIPPort(Socket.remoteAddress, Socket.remotePort, 1);

                if (Child) {
                    debug(-5, '------⚫[(server*) SetEventsProcessing]', {
                        "Socket.remoteAddress": Socket.remoteAddress,
                        "Socket.remotePort": Socket.remotePort
                    })
                    Child.InComeConnect = 1;
                    Child.ToLogNet("Connect from " + Socket.remoteAddress + ":" + Socket.remotePort);
                    Engine.SetEventsProcessing(Socket, Child, "Client", 1);
                } else {
                    debug(-5, '------⚫[(server*) Error child]', {
                        Child: Child,
                        Socket: Socket
                    })
                    Engine.CloseSocket(Socket, Child, "Error child");
                }
            });

            Engine.Server.on('close', function () {
                debug(-5, '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~?[(server*)close]')
            });

            Engine.Server.on('error', function (err) {
                debug(-5, '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~?[(server*)error]', err)
                if (err.code === 'EADDRINUSE') {
                    Engine.ToLog('Port ' + Engine.port + ' in use, retrying after 5 sec...');
                    if (Engine.Server)
                        Engine.Server.close();
                    setTimeout(function () {
                        Engine.RunListenServer();
                    }, 5000);
                }
            });

            Engine.RunListenServer();
        };

        Engine.RunListenServer = function () {
            debug(-5, '----------⚫[(RunListenServer*)]')
            Engine.port = Engine.port >>> 0;
            if (!Engine.port) {
                Engine.port = global.STANDART_PORT_NUMBER;
                if (!Engine.port) {
                    Engine.port = 30000;
                }
            }

            var LISTEN_IP;
            if (global.IP_VERSION === 6) {
                LISTEN_IP = "::";
            } else {
                LISTEN_IP = "0.0.0.0";
            }

            Engine.ToDebug("Prepare to run TCP server on " + LISTEN_IP + ":" + Engine.port);
            debug(-5, '----------⚫[(RunListenServer*) Prepare]', "Prepare to run TCP server on " + LISTEN_IP + ":" + Engine.port)
            Engine.Server.listen(Engine.port, LISTEN_IP, function () {
                let AddObj = Engine.Server.address();
                debug(-5, '-------------⚫[(RunListenServer*) Run]',"Run JINN TCP server on " + AddObj.family + " " + AddObj.address + ":" + AddObj.port)
                Engine.ToLog("Run JINN TCP server on " + AddObj.family + " " + AddObj.address + ":" + AddObj.port);
            });
        };

        Engine.SetEventsOnError = function (SOCKET, Child) {
            SOCKET.on('error', function (err) {
                debug("-5", '-------------⚫[(SetEventsOnError*)]',err.hostname, err.message)
                if (Child) {
                    Engine.AddCheckErrCount(Child, 1, "ERRORS:" + err, 1);
                }

                global.ToError("NET_ERROR:" + err, 4);
            });
        };

        Engine.SetEventsProcessing = function (SOCKET, Child, StrConnect, bAll) {
            debug(-5, '--------------------------------⚫[(net*)SetEventsProcessing]', {
                Child:Child,
                StrConnect: StrConnect,
                bAll: bAll
            })

            if (bAll && !Engine.LinkSocketToChild(SOCKET, Child, StrConnect)) {
                return;
            }

            SOCKET.on('close', function (err) {
                debug(-5, '------------------⚫[(SOCKET*)close]', err)
                Engine.ClearSocket(SOCKET, Child);
            });

            SOCKET.on('end', function () {
                debug(-5, '------------------⚫[(SOCKET*)end]')
                if (Child.LogNetBuf && Child.AddrItem) {
                    Engine.GetLogNetBuf(Child);
                }
            });

            if (!bAll) {
                return;
            }

            SOCKET.on('data', function (data) {
                debug(-5, '------------------⚫[(SOCKET*)data]', data)
                if (global.StopNetwork) {
                    return;
                }
                if (SOCKET.WasClose) {
                    return;
                } else if (SOCKET.WasChild) {
                    var StatusNum = Engine.GetSocketStatus(Child);
                    if (StatusNum === 100) {
                        Engine.ReceiveFromNetwork(Child, data);
                    } else {
                        Child.ToLog("SOCKET on data: Error GetSocketStatus=" + StatusNum, 4);
                    }
                }
            });
        };

        Engine.CloseSocket = function (Socket, Child, StrError, bSilently) {
            debug(-5, '------------------⚫[(SOCKET*)CloseSocket]', {
                Socket, Child, StrError, bSilently
            })
            if (!Socket || Socket.WasClose) {
                return;
            }

            if (!bSilently && Socket.remoteAddress) {
                var Name;
                if (Child) {
                    Name = global.ChildName(Child);
                } else {
                    Name = Socket.remoteAddress + ":" + Socket.remotePort;
                }
                var Str = "CloseSocket: " + Name + " " + StrError;
                Engine.ToLog(Str, 4);
                if (Child) {
                    Engine.ToLogNet(Child, Str);
                }
            }
            Engine.ClearSocket(Socket, Child);
            Socket.end();
        };

        Engine.ClearSocket = function (Socket, Child) {
            debug(-5, '------------------⚫[(SOCKET*)ClearSocket]', {
                Socket, Child
            })
            if (Child) {
                Child.Socket = undefined;
                Engine.OnDeleteConnect(Child, "ClearSocket");
            }

            Socket.WasClose = 1;
            SetSocketStatus(Socket, 0);
            Socket.WasChild = 0;
        };

        Engine.LinkSocketToChild = function (Socket, Child, ConnectType) {
            debug(-5, '------------------⚫[(SOCKET*)LinkSocketToChild]', {
                Socket, Child
            })
            if (Socket.WasChild) {
                global.ToLogTrace("Error LinkSocketToChild was Linked - " + global.ChildName(Child), 4);
                return 0;
            }

            Child.ConnectType = ConnectType;
            Socket.WasChild = 1;
            Child.Socket = Socket;
            if (ConnectType === "Server") {
                Child.DirectIP = 1;
            }

            SetSocketStatus(Socket, 100);
            return 1;
        };

        Engine.OnDeleteConnectNext = function (Child, StrError) {
            debug(-5, '------------------⚫[(SOCKET*)OnDeleteConnectNext]', {
                Child, StrError
            })

            if (Child.Socket) {
                Engine.CloseSocket(Child.Socket, Child, StrError);
            }

        };
    }

    function InitAfter(Engine) {
        debug(-5, '------------------⚫[(SOCKET*)InitAfter]', {
            Engine
        })
        Engine.CreateConnectionToChild = function (Child, F) {
            debug(-5, '------------------⚫[(SOCKET*)CreateConnectionToChild]', {
                Engine
            })

            if (global.StopNetwork) {
                return;
            }

            let State = Engine.GetSocketStatus(Child);
            if (State === 100) {
                F(1);
            } else {
                if (State === 0) {
                    debug(-8, '-------------------------⚫[(CreateConnectionToChild*)Child.ip]',{
                        "Child.port": Child.port,
                        "Child.ip": Child.ip
                    })
                    Child.Socket = net.createConnection(Child.port, Child.ip, function () {
                        debug(-5, '------------------------⚫[(CreateConnection*) Child.Socket]', Child.Socket)
                        if (Child.Socket) {
                            Engine.SetEventsOnError(Child.Socket, Child);
                            Engine.SetEventsProcessing(Child.Socket, Child, "Server", 1);
                        }
                        F(!!Child.Socket);
                        return;
                    });
                    Engine.SetEventsOnError(Child.Socket, Child);
                    SetSocketStatus(Child.Socket, 1);
                    Engine.SetEventsProcessing(Child.Socket, Child, "Server", 0);
                } else {
                    F(0);
                }
            }
        };

        Engine.CloseConnectionToChild = function (Child, StrError) {
            debug(-5, '------------------------⚫[(CloseConnectionToChild*) Child]', Child.ip)
            if (Child.Close) {
                Child.ToError("Socket was closed", "t");
                return;
            }
            if (!Child.IsOpen()) {
                Child.ToError("Socket not was opened", "t");
                return;
            }

            if (Child.Socket)
                Child.ToLog("CloseSocket: " + Child.Socket.remoteAddress + ":" + Child.Socket.remotePort + " " + StrError, 5);
            else
                Child.ToLog(StrError, 4);

            Engine.CloseSocket(Child.Socket, Child, "", 1);
        };

        Engine.SENDTONETWORK = function (Child, Data) {
            debug(-5, '-------------------------⚫[(CreateConnectionToChild*)SENDTONETWORK]', Data)
            if (global.StopNetwork) {
                return;
            }
            var State = Engine.GetSocketStatus(Child);
            if (State === 100) {
                Child.Socket.write(buffer.from(Data));
            } else {
            }
        };

        Engine.GetSocketStatus = function (Child) {
            if (!Child) {
                debug(-5, '-------------1-----------⚫[(SOCKET*)GetSocketStatus]', "0", Child.ip)
                return 0;
            }

            var Socket = Child.Socket;
            if (Socket && Socket.SocketStatus) {
                if (Socket.SocketStatus !== 100) {
                    var Delta = Date.now() - Socket.TimeStatus;
                    if (Delta > global.JINN_CONST.MAX_WAIT_PERIOD_FOR_STATUS) {
                        debug(-5, '--------2--------------⚫[(SOCKET*)GetSocketStatus]', "0", Child.ip)
                        return 0;
                    }
                }
                debug(-5, '-----------------⚫[(GetSocketStatus*)SocketStatus ip]', Socket.SocketStatus, Child.ip)
                return Socket.SocketStatus;
            } else {
                debug(-5, '-----------3---------⚫[(SOCKET*)GetSocketStatus]', "0", Child.ip)
                return 0;
            }
        };

        if (global.CLIENT_MODE) {
            return;
        }

        Engine.CreateServer();
    }


    function SetSocketStatus(Socket, Status) {
        if (Socket && Socket.SocketStatus !== Status) {
            debug(-5, '-----------------------------⚫[(SetSocketStatus*) Status]', Status)
            Socket.SocketStatus = Status;
            Socket.TimeStatus = Date.now();
        }
    }
}