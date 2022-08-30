let state = 'localhost'
let sys = {
  "ob":{
    "web":"https://web3-ob.herokuapp.com",
    "localhost":"http://localhost:7667"
  },
  "proxy": {
    eventSource: {
      "web":"undefined",
      "localhost":"http://localhost:8888/events"
    },
    host: {
      "localhost":"localhost",
      "web":"web3-ob.herokuapp.com"
    },
    port: {
      "localhost":7667,
      "web":443
    }
  },
  "eventSource": {
    "localhost": {
      withCredentials: true,
      headers: {'Access-Control-Allow-Origin': '*'},
    },
    "web": {
      withCredentials: true,
      headers: {'Access-Control-Allow-Origin': '*'},
    }
  }
}

export default (()=>{
  return new Promise((resolve,reject)=> {
    let eventSource = new EventSource(sys.proxy.eventSource[`${state}`],sys.eventSource[`${state}`]);
    eventSource.onmessage = function(event) {
      console.log(JSON.parse(event.data));
    };

    resolve({
      _scriptDir: import.meta.url,
      status: 'send message',
      success: true,
      message: true
    })
  })
})()
