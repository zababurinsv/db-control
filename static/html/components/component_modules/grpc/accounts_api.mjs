export default (obj) => {
    new Promise( async (resolve, reject) => {
        let sys = {}
        sys.this = obj
        console.log({
            'this': sys
        })
        resolve(sys)
    })

    // const echoService_helloWorld = new sys.this.GreeterPromiseClient('http://localhost:8080', null, null)
    // console.log('server api',{
    //     helloWorld
    // })
    // const request = new self.HelloRequest({name:'test'});
    //
    // const call = echoService_helloWorld.sayHello(request, {},
    //     (err, response) => {
    //         console.log(response.getMessage());
    //     });
    //
    // call.on('status', (status) => {
    //     console.log('status', status)
    // });
}
