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

let datajson = {
    "title":"coupon bazar",
    "coupon_price": 10000000,
    "old_price": 1000000000,
    "new_price": 100000000,
    "address": "universe",
    "description": "i want to make love",
    "image": "https://ucarecdn.com/18737acb-8fb2-44e0-a949-ec241a72d543/",
}

it('purchase', async function(){
    let item = "item_87SSHYKmoqHYhLQo4EAbkd1zdzHHrtUkVLib1GVzpFBE"
    let ts = invokeScript({
        dApp: accountBobAddress,
        call:{
            function: "purchase",
            args: [
                { type:"string", value: item}
            ]},
        payment:[{amount:datajson.coupon_price, asset:null}]

    }, accountBobSeed)

    let tx = await broadcast(ts)
    await waitForTx(tx.id)
    console.log(JSON.stringify(tx))

})