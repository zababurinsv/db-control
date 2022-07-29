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

it('transfer', async function(){
    let tx = await broadcast(transfer({amount:500000000, recipient: recipient, fee:500000 }, accountAseed))
    await waitForTx(tx.id)
    console.log(JSON.stringify(tx))
})
