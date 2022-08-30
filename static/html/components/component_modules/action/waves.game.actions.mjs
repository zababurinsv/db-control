import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'
let waves = new Waves()
let system = {
    net: {
        test:'T',
        main:'W',
        stage:'S',
    }
}
export default (async ()=> {
    console.log('# waves.game.actions')
    task.get(true, 'await', '5', '','/create/nft', async (object)=>{
        if(object.view) {
            let message = await waves.createNFT(object.views, object.property,object.color,object.substrate, object.relation)
            object.callback({
                status: message.status,
                success:true,
                message: message.message,
                _scriptDir: import.meta.url
            })
        } else {
            object.callback({
                status:true,
                success: true,
                message: 'pause',
                _scriptDir: import.meta.url
            })
        }
    })

    task.get(true, 'await', '5', '','/get/nft', async (object) => {
        if(object.view) {
            try {
                let message = false
                let  nft = await waves.getNFT(
                  config['accountsStore']['accountGroups'][`${object.property}`]['address'],
                  100, undefined, object.property)
                if (isEmpty(object.substrate.name)) {
                    message = nft.message
                } else {
                    if (nft.message.length !== 0) {
                        for(let item of nft.message) {
                            if(item.description.toLowerCase().indexOf(object.substrate.description) !== -1) {
                                if(!message) { message = [] }
                                message.push(item)
                            }
                        }
                    } else {

                    }
                }
                // await customEvents(true, 'отобразить данные на странице','3',object,'objectPlayer')
                object.callback({
                    status: true,
                    message: message,
                    _scriptDir: import.meta.url
                })
            } catch (e) {
                object.callback({
                    status: false,
                    message: e,
                    _scriptDir: import.meta.url
                })
            }
        } else {
            object.callback({
                status:true,
                message: 'pause',
                _scriptDir: import.meta.url
            })
        }
    })
    return {status:true}
})()