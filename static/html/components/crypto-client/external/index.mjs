import grpc from '/static/html/components/component_modules/grpc/grpc.mjs'
export default async (v,p,c,obj,r) => {
    await (import('/static/html/components/component_modules/bundle/grpc/grpc.index.mjs'))
    let client = await grpc(window.grpc, 'http://localhost:8080')
    let sys = await client.set(client.proto.accounts_api)
    sys = await client.set(client.proto.helloWorld)

    let req = new client.proto.helloWorld.HelloRequest()
    req.setName('Alice')

    let call = sys.echoService.Greeter.sayHello(req,{}, (err, response) => {
        console.log('res',response);
    })
    call.on('status', (status) => {
        console.log('status', status)
    });
    call.on('data', (data) => {
        console.log('data', data)
    });
    call.on('end', () => {
        console.log('end')
    });
}
