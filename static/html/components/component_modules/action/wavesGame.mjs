import emoji from '/static/html/components/component_modules/emoji/emoji.mjs';
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
export default (views,property,color,substrate,relation)=>{
    return  new Promise(async (resolve, reject) => {
        color = 'action'
        let waves = Waves.default
        switch (relation.toLowerCase()) {
            case 'create-nft':
                if(isEmpty(substrate[`${relation}`])){
                    console.warn(`${emoji('kissing_heart')} субстрат не определён --->`,  substrate)
                }else{
                    try {
                        let tokenParamsCustomIndivisible = {
                            name: substrate[`${relation}`].name,
                            quantity:1,
                            decimals:0,
                            reisuable:false,
                            chainId:'T',
                            description:substrate[`${relation}`].description,
                        }
                        // console.log(`${emoji('beer')} wavesGame.mjs`,tokenParamsCustomIndivisible)
                        // console.log(`${emoji('beer')} wavesGame.mjs`,substrate[`${relation}`].dapp)
                        // console.log(`${emoji('beer')} wavesGame.mjs`,substrate[`${relation}`].proofs[0])

                        const signedIssueTx = waves.transactions.issue(tokenParamsCustomIndivisible,substrate[`${relation}`].dapp)
                        let txObjectSignedTwo = waves.transactions.issue(signedIssueTx, substrate[`${relation}`].proofs[0])
                        let txObjectSignedThre = waves.transactions.issue(txObjectSignedTwo, substrate[`${relation}`].proofs[1])
                        let tx = await waves.transactions.broadcast(txObjectSignedThre, substrate[`${relation}`].node)
                        property.property(relation, tx)

                    }catch (e) {
                        console.warn({error: e})
                    }
                }
                break
            default:
                console.warn(`${emoji('kissing_heart')} wavesGame.mjs нет обработчика --->`, relation.toLowerCase(), '[(' ,views,property,color,substrate,relation ,')a]')
                break
        }
        resolve({ key:true})
    })
}