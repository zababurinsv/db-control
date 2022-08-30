//###############################################################################
//##
//# Copyright (C) 2014-2015 Andrea Rocco Lotronto, 2017 Nicola Peditto
//##
//# Licensed under the Apache License, Version 2.0 (the "License");
//# you may not use this file except in compliance with the License.
//# You may obtain a copy of the License at
//##
//# http://www.apache.org/licenses/LICENSE-2.0
//##
//# Unless required by applicable law or agreed to in writing, software
//# distributed under the License is distributed on an "AS IS" BASIS,
//# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//# See the License for the specific language governing permissions and
//# limitations under the License.
//##
//###############################################################################
// var log4js = require("log4js");
// var logger = log4js.getLogger('wstun');

// import { client as WebSocketClient } from 'websocket'
// import net from 'net'

// import bindSockets from './bindSockets_reverse'
// import tunnel from '/static/html/components/component_modules/webSocket/webSocket.mjs'
import log4js from 'log4js'
import WebSocketCl from 'websocket'
let WebSocketClient = WebSocketCl.client
import net from 'net'
import Url from 'url'
var logger = log4js.getLogger('wstun');

let bindSockets = function(wsconn, tcpconn) {

  wsconn.__paused = false;

  wsconn.on('message', function(message) {

    //logger.debug('[SYSTEM] --> WS MESSAGE:'); logger.debug(JSON.stringify(message));

    if (message.type === 'utf8') {
      return console.log('Error, Not supposed to received message ');
    }
    else if (message.type === 'binary') {
      if (false === tcpconn.write(message.binaryData)) {
        wsconn.socket.pause();
        wsconn.__paused = true;
        //DEBUG console.log('WS message pause true');
        return "";
      }
      else {
        if (true === wsconn.__paused) {
          wsconn.socket.resume();
          //DEBUG console.log('WS message pause false');
          return wsconn.__paused = false;
        }
      }
    }
  });

  wsconn.on("overflow", function() {
    //DEBUG console.log('TCP pause');
    return tcpconn.pause();
  });

  wsconn.socket.on("drain", function() {
    //DEBUG console.log('WS message pause false');
    return tcpconn.resume();
  });

  wsconn.on("error", function(err) {
    return console.log('[SYSTEM] --> WS Error: ' + err);
  });

  wsconn.on('close', function(reasonCode, description) {
    console.log("[SYSTEM] --> WS Peer " + wsconn.remoteAddress + " disconnected - Reason: ["+reasonCode+"] " + description);
    return tcpconn.destroy();
  });


  tcpconn.on("drain", function() {
    wsconn.socket.resume();
    //DEBUG console.log('WS resume');
    return wsconn.__paused = false;
  });

  tcpconn.on("data", function(buffer) {
    //DEBUG
    //console.log('[SYSTEM] --> TCP data received:\n\n\n' + buffer + "\n\n"); //console.log(JSON.stringify(buffer));
    return wsconn.sendBytes(buffer);
  });

  tcpconn.on("error", function(err) {
    console.log("[SYSTEM] --> TCP Error " + err);
    return tcpconn.destroy();
  });

  tcpconn.on("close", function() {
    //DEBUG
    console.log("[SYSTEM] --> TCP connection close.");
    //return tcpconn.destroy();
    return wsconn.close();
  });

};

// let wstunHost = 'ws://tunnel-reverse.herokuapp.com';
// let wstunHost = 'ws://localhost:5000';
// let sys = {
//     pid: process.pid,
//     port: process.env.PORT || 9876
// }
// let win = "localhost:" + sys.port
// reverse_client.start('5005', wstunHost, win);

let System = {}
System.state = {
  wst_client_reverse:false,
}
System.self = {
  this: this,
  system: () => { return System}
}
System.url = ''
System.wst_client_reverse = async function() {
  System.state.wst_client_reverse = true
  this.wsClientForControll = new WebSocketClient();
  System.self.this = this
  System.state.wst_client_reverse = false
  return System
};

System.start = function(portTunnel, wsHostUrl, remoteAddr) {

  //Getting paramiters

  var urlWsHostObj = Url.parse(wsHostUrl);
  var _ref1 = remoteAddr.split(":"), remoteHost = _ref1[0], remotePort = _ref1[1];
  var proto = wsHostUrl.split(":")[0];
  // if(proto == "wss")
    // require("../lib/https_override");

  System.url = `${wsHostUrl}/?dst=localhost:${portTunnel}`;
  console.log("[SYSTEM] - Connecting to", wsHostUrl)
  console.log("[SYSTEM] --> exposing", remoteAddr, "on port", portTunnel);
  System.self.this.wsClientForControll.connect(System.url, 'tunnel-protocol');
   System.self.this.wsClientForControll.on('connect', (function(_this){
     return function(wsConnectionForControll) {

       console.log("[SYSTEM] --> TCP connection established!");

       wsConnectionForControll.on('message', function(message) {

         //Only utf8 message used in Controll WS Socket
         var parsing = message.utf8Data.split(":");

         //Managing new TCP connection on WS Server
         if (parsing[0] === 'NC'){

           //Identification of ID connection
           var idConnection = parsing[1];

           System.self.this.wsClientData = new WebSocketClient();
           System.self.this.wsClientData.connect(wsHostUrl+"/?id="+idConnection, 'tunnel-protocol');

           //Management of new WS Client for every TCP connection on WS Server
           System.self.this.wsClientData.on('connect', (function(_this){

             return function(wsConnectionForData){

               //Waiting of WS Socket with WS Server
               wsConnectionForData.socket.pause();

               //DEBUG console.log("Connected wsClientData to WS-Server for id "+parsing[1]+" on localport::"+wsConnectionForData.socket.localPort);
               console.log("[SYSTEM] --> Start TCP connection on client to "+remoteHost+":"+remotePort);
               console.log('~~~~~~~~~~~~~tcpConnection', {
                 remoteHost:remoteHost,
                 remotePort: remotePort
               })
               tcpConnection(wsConnectionForData, remoteHost, remotePort);

             }
           })(this));

         }
       });

     }
  })(this))

  //Management of WS Connection failed
  System.self.this.wsClientForControll.on('connectFailed', function(error) {
    console.log("[SYSTEM] --> WS connect error: " + error.toString());
  });
};

function tcpConnection(wsConn, host, port){
  console.log('###{port: port, host: host}#########',{port: port, host: host})
  var tcpConn = net.connect( {port: port, host: host}, function(){});
  bindSockets(wsConn, tcpConn);

  tcpConn.on("connect",function(){
    //Resume of the WS Socket after the connection to WS Server
    wsConn.socket.resume();
  });

  tcpConn.on('error',(function(_this){
    return function(request){
      console.log("[SYSTEM] --> "+request);
    }
  })(this));

  //wst_client_reverse

}

export let system = System;

export default {
 system:System.wst_client_reverse
}