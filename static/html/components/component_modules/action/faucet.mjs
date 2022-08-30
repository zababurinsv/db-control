import Waves from '/static/html/components/component_modules/waves/index.mjs'
import emoji from '/static/html/components/component_modules/emoji/emoji.mjs';
import events from '/static/html/components/component_modules/CustomEvent/index.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
export default (views,property,color,substrate,relation)=>{
    return  new Promise(async (resolve, reject) => {
        color = 'action'
        let waves = await Waves()
        switch (relation.toLowerCase()) {
            case 'faucet-wallet':
                if(isEmpty(substrate[`${relation}`])){
                    console.warn(`${emoji('kissing_heart')} субстрат не определён --->`,  substrate)
                }else{
                   let transfer ={ transfer:[{
                        '/':'transfer',
                        relation:{
                        },
                        property:{
                            dapp:'zone tower six sound oblige horn false blue enroll flash pact all',
                            testnodes:'https://nodes-testnet.wavesnodes.com',
                        },
                        substrate:{
                            recipient:substrate[`${relation}`]['address']
                        },
                    }]
                   }
                    waves.transfer(true, [
                    'convince bubble claim case tube domain grief eyebrow decline witness bachelor mansion',
                    'discover swim emerge demise dwarf inmate utility cycle hospital pistol sugar emotion',
                    'kitten tooth maze behave purity dance differ stereo faint immune century peace'
                    ],'3', transfer ,'transfer')
                    document.addEventListener('transfer-end',async (event)=>{
                        if(event.detail.data.status){
                            console.log(`${emoji('bikini')} --->`, event.detail.data)
                            resolve(true)
                        }else{
                            reject( event.detail )
                        }
                    })
                }
                break
            default:
                console.warn(`${emoji('kissing_heart')} faucet.mjs нет обработчика --->`, relation.toLowerCase(), '[(' ,views,property,color,substrate,relation ,')a]')
                break
        }
        resolve({ key:true})
    })
}