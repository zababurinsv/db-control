// import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'

export default async (v,p,c,obj,r) => {
    /*
    let waves = await Waves()
    await store({
        input:'waves-balance',
        this:obj['this'],
        parent: obj['this'].getAttribute('parent'),
        slot:obj['slot'],
        type:'obj'
    }, 'set', 'type')


    document.addEventListener('object-player',async (event)=>{
        if(!isEmpty(event.detail.substrate.game.id)){
            obj['this']['shadowRoot'].querySelector('#info').style.display = 'none'
            console.log('~~~~~~~~~~~~~~',event.detail.substrate.game.id)
            let asset ={}
            if(event.detail.substrate.game.id === '[object Object]'){
                asset.error = true
            }else{
                asset = await waves.details(event.detail.substrate.game.id)
            }

            if(!isEmpty(asset.error)){
                obj['this']['shadowRoot'].querySelector('#info').style.display = 'flex'

                obj['this']['shadowRoot'].querySelector('li.status').innerHTML = `Status: await creating`

                obj['this']['shadowRoot'].querySelector('li.id').innerHTML = `id: `
                obj['this']['shadowRoot'].querySelector('li.date').innerHTML = `Date: `
                obj['this']['shadowRoot'].querySelector('li.name').innerHTML = `Name: `
                obj['this']['shadowRoot'].querySelector('li.feeAssetId').innerHTML = `Fee Asset Id:`
                obj['this']['shadowRoot'].querySelector('li.issuer').innerHTML = `Issuer: `
                obj['this']['shadowRoot'].querySelector('li.description').innerHTML = `Description: `
                obj['this']['shadowRoot'].querySelector('p.player').innerText = ''
                obj['this']['shadowRoot'].querySelector('img.player').src =`/static/html/components/waves-game/images/no_image.jpg`

                obj['this']['shadowRoot'].querySelector('ul.player-game-info').classList.remove("active")
                obj['this']['shadowRoot'].querySelector('li.id').classList.remove("active")
                obj['this']['shadowRoot'].querySelector('li.date').classList.remove("active")
                obj['this']['shadowRoot'].querySelector('li.name').classList.remove("active")
                obj['this']['shadowRoot'].querySelector('li.feeAssetId').classList.remove("active")
                obj['this']['shadowRoot'].querySelector('li.issuer').classList.remove("active")
                obj['this']['shadowRoot'].querySelector('li.description').classList.remove("active")
                obj['this']['shadowRoot'].querySelector('#player').style.marginLeft = '0.5vw'
            }else{
                let feeAssetId = asset.minSponsoredAssetFee
                if(feeAssetId === null){
                    feeAssetId = 0
                }
                obj['this']['shadowRoot'].querySelector('li.status').innerHTML = `Status: ready for game`

                obj['this']['shadowRoot'].querySelector('#player').style.margin = '0'
                obj['this']['shadowRoot'].querySelector('ul.player-game-info').classList.add("active")
                obj['this']['shadowRoot'].querySelector('li.id').classList.add("active")
                obj['this']['shadowRoot'].querySelector('li.date').classList.add("active")
                obj['this']['shadowRoot'].querySelector('li.name').classList.add("active")
                obj['this']['shadowRoot'].querySelector('li.feeAssetId').classList.add("active")
                obj['this']['shadowRoot'].querySelector('li.issuer').classList.add("active")
                obj['this']['shadowRoot'].querySelector('li.description').classList.add("active")

                obj['this']['shadowRoot'].querySelector('li.id').innerHTML = `id: ${asset.assetId}`
                obj['this']['shadowRoot'].querySelector('li.date').innerHTML = `Date: ${new Date(asset.issueTimestamp)}`
                obj['this']['shadowRoot'].querySelector('li.name').innerHTML = `Name: ${asset.name}`
                obj['this']['shadowRoot'].querySelector('li.feeAssetId').innerHTML = `Fee Asset Id: ${feeAssetId}`
                obj['this']['shadowRoot'].querySelector('li.issuer').innerHTML = `Issuer: ${asset.issuer}`
                obj['this']['shadowRoot'].querySelector('li.description').innerHTML = `Description: ${JSON.parse(asset.description).name}`

                // obj['this']['shadowRoot'].querySelector('div.content').innerHTML = JSON.stringify(event['detail'].substrate,null,4)
                obj['this']['shadowRoot'].querySelector('p.player').innerText = asset.name
                obj['this']['shadowRoot'].querySelector('img.player').src =`${JSON.parse(asset.description).imageUrl}`

            }
        }else{
            obj['this']['shadowRoot'].querySelector('#info').style.display = 'flex'

            obj['this']['shadowRoot'].querySelector('li.status').innerHTML = `Status: await creating`

            obj['this']['shadowRoot'].querySelector('li.id').innerHTML = `id: `
            obj['this']['shadowRoot'].querySelector('li.date').innerHTML = `Date: `
            obj['this']['shadowRoot'].querySelector('li.name').innerHTML = `Name: `
            obj['this']['shadowRoot'].querySelector('li.feeAssetId').innerHTML = `Fee Asset Id:`
            obj['this']['shadowRoot'].querySelector('li.issuer').innerHTML = `Issuer: `
            obj['this']['shadowRoot'].querySelector('li.description').innerHTML = `Description: `
            obj['this']['shadowRoot'].querySelector('p.player').innerText = ''
            obj['this']['shadowRoot'].querySelector('img.player').src =`/static/html/components/waves-game/images/no_image.jpg`

            obj['this']['shadowRoot'].querySelector('ul.player-game-info').classList.remove("active")
            obj['this']['shadowRoot'].querySelector('li.id').classList.remove("active")
            obj['this']['shadowRoot'].querySelector('li.date').classList.remove("active")
            obj['this']['shadowRoot'].querySelector('li.name').classList.remove("active")
            obj['this']['shadowRoot'].querySelector('li.feeAssetId').classList.remove("active")
            obj['this']['shadowRoot'].querySelector('li.issuer').classList.remove("active")
            obj['this']['shadowRoot'].querySelector('li.description').classList.remove("active")
            obj['this']['shadowRoot'].querySelector('#player').style.marginLeft = '0.5vw'
        }
        event.detail.callback(true)
    })
    document.addEventListener('gameName',async (event)=>{
        let classes = event.detail.substrate[`${event.detail.relation}`][0].get
        let description = event.detail.substrate[`${event.detail.relation}`][1].description
        let name = obj['this'].shadowRoot.querySelector(`#${classes}`).value
        let desc = obj['this'].shadowRoot.querySelector(`textarea.${classes}`).value = description

        event.detail.callback(name)
    })

    document.addEventListener('nft-game-params',async (event)=>{
        obj['this']['shadowRoot'].querySelector('div.content').innerHTML = ''
        obj['this']['shadowRoot'].querySelector('div.content').innerHTML = event.detail.substrate
        event.detail.callback('true')
    })

    document.addEventListener('objectPlayer',async (event)=>{

        console.log( event['detail'].substrate.assetId)
        console.log(JSON.parse(event['detail'].substrate.description)['imageUrl'])
        console.log(event['detail'].substrate)
        console.log(new Date(event['detail'].substrate.timestamp))

        // console.assert(false, event['detail'].substrate)

        let feeAssetId = event['detail'].substrate.feeAssetId
        if(feeAssetId === null){
            feeAssetId = 0
        }

        obj['this']['shadowRoot'].querySelector('li.status').innerHTML = `Status: ready for game`


        obj['this']['shadowRoot'].querySelector('li.id').innerHTML = `id: ${event['detail'].substrate.assetId}`
        obj['this']['shadowRoot'].querySelector('li.date').innerHTML = `Date: ${new Date(event['detail'].substrate.timestamp)}`
        obj['this']['shadowRoot'].querySelector('li.name').innerHTML = `Name: ${event['detail'].substrate.name}`
        obj['this']['shadowRoot'].querySelector('li.feeAssetId').innerHTML = `Fee Asset Id: ${feeAssetId}`
        obj['this']['shadowRoot'].querySelector('li.description').innerHTML = `Description: ${JSON.parse(event.detail.substrate.description).name}`

        // obj['this']['shadowRoot'].querySelector('div.content').innerHTML = JSON.stringify(event['detail'].substrate,null,4)
        obj['this']['shadowRoot'].querySelector('p.player').innerText = JSON.parse(event.detail.substrate.description).name
        obj['this']['shadowRoot'].querySelector('img.player').src = JSON.parse(event.detail.substrate.description).imageUrl


        event.detail.callback('true')
    })
    */
}