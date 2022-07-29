const account = "3NB6ViLiZv3r5EdQ2Q8GA8GKpuwmG3zevAt"

const accountAliceAddress = "3NAofrCBLJZ7XXSwSZfdQcAcypDwZgKSwhD"
const accountBobAddress = "3MwYBj7oXEHZxNMBbSYPK8ZvhnP9Rdj58hJ"
const accountCooperAddress = "3MsahoQ1xtzWBAKqdJGdSvCZZZEDWWfDLqc"
const accountDianaAddress = "3MtQqwq9xzbt9cXqxeZDjs5VJxK9m2jThoz"

const accountSeed = "rapid cup ring cupboard smile elite random crazy found drink mass decrease"

const accountAliceSeed = "can smart holiday walk spice power learn matter metal fade chaos silly"
const accountBobSeed = "hurt divide saddle chalk piano oak cage swap copper learn raw fashion"
const accountCooperSeed = "force gospel latin wet repeat zoo trust vacant can tuna security waste"
const accountDianaSeed = "ecology effort fiction casual festival wage hole raise rich honey rotate page"

let seed = [accountAliceSeed,accountBobSeed,accountCooperSeed]

let commits = ["G8ZMEiXEGefpEdgEFN5mYr6oEEABJrtcBBLkZf6Ujmcq","Bf2yysmAoroXAzVidK1wxuVYpRGLy1nWe6cNAGXBf5Hi","ACHSFMGY7bp3aHryCLYc499XvojeGrgBp59zSvwgLnkQ"]
let reveals = ["delisted","featured","featured"]
let salts = ["random1","random2","random3"]

it('non-fungible token (NFT)', async function(){
    let tokenParamsCustomIndivisible = {
        name: 'account_test_3',
        quantity:1,
        decimals:0,
        reisuable:false,
        description:'it is special token for bid'

    }
    const signedIssueTx = issue(tokenParamsCustomIndivisible, accountSeed)
    let txObjectSignedTwo = issue(signedIssueTx, seed[0])
    let txObjectSignedThre = issue(txObjectSignedTwo, seed[1])
    let tx = await broadcast(txObjectSignedThre)
    console.log("response", tx)
    await waitForTx(tx.id)
    console.log('tx/token id' + tx.id)
})
