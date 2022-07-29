const accountAliceAddress = "3Ms9sUb7W3L55LLGxeHWiqgTfdH9yn2mayb"
const accountBobAddress = "3NBbYm1bs9CbK5pHZZHgv6YP7HofrUAEcDj"
const accountCooperAddress = "3MyrRRPwQaf94YdZnwAHE7QxBp1sRRiH9zd"

const accountAliceSeed = "float develop virtual tooth survey please absent rapid transfer much twice indoor"
const accountBobSeed = "hire cart mushroom transfer twelve frog three garbage title nephew attitude stuff"
const accountCooperSeed = "rapid pioneer moment glide physical verb island silver ordinary mad cradle crop"

let user = 0
let seed = [accountAliceSeed,accountBobSeed,accountCooperSeed]

it ('verify by oracle ', async function (){
    let ts = invokeScript({
        dApp: address(accountAliceSeed),
        call:{
            function:"setStatus",
            args: [
                { type:"string", value: "3MyrRRPwQaf94YdZnwAHE7QxBp1sRRiH9zd"},
                { type:"string", value: "verified"}

            ]},
        payment:[]

    }, seed[user])

    let tx = await broadcast(ts);
    await waitForTx(tx.id)
})

