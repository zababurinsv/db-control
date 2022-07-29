const accountBobAddress = "3N2k1m1k8puQqxSz8g7MYj7oDGXiwATAsnT"
const accountAliceAddress = "3N4RLWN1ej3rfyb1BqL73yPxNub2Gw239Pi"
const accountCooperAddress = "3MpefB2XWCdvTCehG5adrAVkqiWmvGXFAQm"

const accountAliceSeed = "expose cross veteran venue raccoon amount hen rain venture blanket elephant canvas"
const accountBobSeed = "sadness plunge produce vague casino rebuild chalk frown degree stuff upon dignity"
const accountCooperSeed = "rich shiver romance tomato deliver salt rose mirror dose lonely surge early"

let commits = ["G8ZMEiXEGefpEdgEFN5mYr6oEEABJrtcBBLkZf6Ujmcq","Bf2yysmAoroXAzVidK1wxuVYpRGLy1nWe6cNAGXBf5Hi","ACHSFMGY7bp3aHryCLYc499XvojeGrgBp59zSvwgLnkQ"]
let reveals = ["delisted","featured","featured"]
let salts = ["random1","random2","random3"]
let seed = [accountAliceSeed,accountBobSeed,accountCooperSeed]

it('vote reveal', async function(){
    let item = "item_87SSHYKmoqHYhLQo4EAbkd1zdffff"
    let user = 2
    let ts = invokeScript({
        dApp: accountBobAddress,
        call:{
            function: "voteReveal",
            args: [
                { type:"string", value: item},
                { type:"string", value: reveals[user]},
                { type:"string", value: salts[user]}
            ]},
        payment:[]
    }, seed[user])
    let tx = await broadcast(ts)
    await waitForTx(tx.id)
    console.log(JSON.stringify(tx))
})