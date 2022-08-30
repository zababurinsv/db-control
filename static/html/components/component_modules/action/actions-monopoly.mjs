import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import Json from '/static/html/components/component_modules/json/json.mjs'
function bestCopyEver(src) {
    return Object.assign({}, src);
}
export default (views,property,color,substrate,relation)=>{
    return  new Promise(async (resolve, reject) => {
        color = 'action'
        await colorlog(views,'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',color, substrate, relation )
        switch (relation.toLowerCase()) {
            case 'button':
                let json = (await Json(views))
                let selected = await json.select(substrate)
                let jsonTemplate = {}
                if(property.hasOwnProperty('property')){
                    jsonTemplate = await json.transformWith(property.property, false, selected)
                }else{
                    jsonTemplate = await json.transformWith(property, false, selected)
                }
                let button = await json.root(jsonTemplate)
                await colorlog(views,'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',color, button, relation )
                document.dispatchEvent( new CustomEvent('actionButton', {
                    detail: {
                        _:'button',
                        button
                    }
                }))
                break
            case 'player':
                (async (views,property,color,substrate,relation)=>{

                    let json = (await Json(views))
                    let selected = await json.select(substrate)
                    let jsonTemplate = {}
                    if(property.hasOwnProperty('property')){
                        jsonTemplate = await json.transformWith(property.property, false, selected)
                    }else{
                        jsonTemplate = await json.transformWith(property, false, selected)
                    }
                    let button = await json.root(jsonTemplate)
                    await colorlog(views,'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',color, button, relation )
                    document.dispatchEvent( new CustomEvent('actionButton', {
                        detail: {
                            _:'button',
                            button
                        }
                    }))

                })(views,property,color,substrate,relation)

                break
            default:
                break
        }
        resolve({ key:true})
    })
}