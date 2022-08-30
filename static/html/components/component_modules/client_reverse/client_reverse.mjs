import loader from '/static/html/components/component_modules/loader/loader.mjs'


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
  system: () => { return System},
  remoteHost: '',
  remotePort: ''
}
System.url = ''
System.wst_client_reverse = async function() {
  // await loader('/static/html/components/component_modules/webtcp/tcp.js','tcp')
  System.state.wst_client_reverse = true
  System.self.this = this
  System.state.wst_client_reverse = false
  return System
};

System.start = async function(portTunnel, wsHostUrl, remoteAddr) {

  System.self.remoteHost = location.hostname
  System.self.remotePort = location.port

  System.url = `${wsHostUrl}/?dst=localhost:${portTunnel}`;
  console.log("[SYSTEM] - Connecting to", System.url)
  console.log("[SYSTEM] --> exposing", remoteAddr, "on port", portTunnel);
  //Connection to Controll WS Server
  // System.self.this.wsClientForControll.connect(System.url, 'tunnel-protocol');
  System.self.this.wsClientForControll =  new WebSocket(System.url, 'tunnel-protocol')
  System.self.this.wsClientForControll.onclose = function(event) {
    if (event.wasClean) {
      console.log('[(SYSTEM*)Соединение закрыто чисто]')
    } else {
      console.log('[(SYSTEM*)Обрыв соединения]')
    }
    console.log('[(SYSTEM*)Код: ' + event.code,']' )
  };
  System.self.this.wsClientForControll.onerror = function(error) {
    console.log('[(SYSTEM*)Ошибка ' + error.message,']' )
  };

  System.self.this.wsClientForControll.onopen = (function(_this) {
    console.log("[SYSTEM] --> TCP connection established!");
    let sock = new SockJS('http://localhost:5005');
    sock.onopen = function(e) {

      console.log('[SYSTEM] --> TCP !!!!!!!!!!!!!! onopen');
      sock.send('test');
    };

    sock.onmessage = function(e) {
      console.log('[SYSTEM] --> TCP message');
      sock.close();
    };

    sock.onclose = function(e) {
      console.log('[SYSTEM] --> close TCP', e);
    };
  })
  System.self.this.wsClientForControll.addEventListener('message', function (message) {
    return new Promise(function (resolve, reject) {
      let parsing = message.data.split(":");
      if (parsing[0] === 'NC') {
        let idConnection = parsing[1];
        // console.log('[(SYSTEM*)idConnection', idConnection)


        System.self.this.wsClientData = new WebSocket(wsHostUrl+"/?id="+idConnection, 'tunnel-protocol')
        System.self.this.wsClientData.onopen = async function(event) {


          // console.log("[SYSTEM] --> Start TCP connection on client to "+System.self.remoteHost+":"+System.self.remotePort);
          // console.log('~~~~~~~~~~~~~tcpConnection', {
          //   remoteHost:System.self.remoteHost,
          //   remotePort: System.self.remotePort
          // })
          // tcpConnection(System.self.this.wsClientData, System.self.remoteHost, System.self.remotePort)
        }
        // System.self.this.wsClientData.addEventListener('message', (message)=>{

        // })
      }
    })
  });
  console.log('@@@@@@ system @@@@@@')
};

function convertStringToUTF8ByteArray(str) {
  // let binaryArray = new Uint8Array(str.length)
  // Array.prototype.forEach.call(binaryArray, function (el, idx, arr) { arr[idx] = str.charCodeAt(idx) })
  // return binaryArray
}

async function tcpConnection(wsConn, host, port){
  // console.log('[(SYSTEM*)wsClientData', {
  //   wsConn: wsConn,
  //   host:   host,
  //   port:   port
  // })
  // let sock = new SockJS('http://localhost:5005');
  // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$',sock )

  // wsConn.addEventListener('message', function(message) {

    // wsConn.send(message.data)
    // console.log('[SYSTEM] --> WS MESSAGE:', message.data);
  // })
  // bindSockets(wsConn, sock)
  return true
}



let bindSockets = function(wsconn, tcpconn) {

  wsconn.__paused = false;

  wsconn.addEventListener('message', function(message) {
    tcpconn.onopen = function() {
      console.log('open');
      console.log('[SYSTEM] --> WS MESSAGE:', message.data);
      tcpconn.send(message.data);
      // tcpconn.send(convertStringToUTF8ByteArray('test'));
    };

    tcpconn.onmessage = function(e) {
      console.log('message', e.data);
      tcpconn.close();
    };

    tcpconn.onclose = function() {
      console.log('close');
    };
    // logger.debug('[SYSTEM] --> WS MESSAGE:'); console.log(JSON.stringify(message));

    if (message.type === 'utf8') {
      return console.log('Error, Not supposed to received message ');
    }
    else if (message.type === 'binary') {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', message.binaryData)
      // if (false === tcpconn.write(message.binaryData)) {
      //   wsconn.socket.pause();
      //   wsconn.__paused = true;
        //DEBUG console.log('WS message pause true');
        // return "";
      // }
      // else {
      //   if (true === wsconn.__paused) {
      //     wsconn.socket.resume();
          //DEBUG console.log('WS message pause false');
          // return wsconn.__paused = false;
        // }
      // }
    }
  });

  // wsconn.on("overflow", function() {
    //DEBUG console.log('TCP pause');
    // return tcpconn.pause();
  // });

  // wsconn.socket.on("drain", function() {
    //DEBUG console.log('WS message pause false');
    // return tcpconn.resume();
  // });

  // wsconn.on("error", function(err) {
  //   return console.log('[SYSTEM] --> WS Error: ' + err);
  // });

  // wsconn.on('close', function(reasonCode, description) {
  //   console.log("[SYSTEM] --> WS Peer " + wsconn.remoteAddress + " disconnected - Reason: ["+reasonCode+"] " + description);
  //   return tcpconn.destroy();
  // });



  /*

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
   */
};
export let system = System;

export default {
 system:System.wst_client_reverse
}