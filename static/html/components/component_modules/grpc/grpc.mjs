let sys = {}
sys.proto = {}
sys.hostname = {}
sys.echoService = {}
sys.EchoRequest = {}
sys.set = (service = 'default') => {
    return new Promise((resolve) => {
        let keys = Object.keys(service)
        for(let i =0; i< keys.length;i++) {
            if(keys[i].indexOf('PromiseClient') !== -1) {
                let name = keys[i].replace('PromiseClient','');
                sys.echoService[`${name}`] = new service[`${keys[i]}`](sys.hostname);
                resolve(sys)
                break
            }
        }
    })
}
export default (proto = {},hostname = 'http://localhost:8080') => {
   return new Promise((resolve) => {
        sys.proto = proto
        sys.hostname = hostname
        resolve(sys)
   });
}
