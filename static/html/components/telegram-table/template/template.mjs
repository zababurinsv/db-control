function getOptions (object){
    return new Promise(async (resolve, reject) => {
        let htmlOptions = ``
        if(object === 'null'){
            htmlOptions = htmlOptions + `<option value="0">0</option>`
        }else{
            object = object.split(',')
            let temp = []
            for(let i =0; i < object.length;i++){
                let tempObj = object[i].replace(/[^-0-9]/gim,'')
                if(tempObj.length !== 0){
                    if(tempObj.length > 1){
                        console.warn('слишком большое колличество символов')
                    }else{
                        temp.push(tempObj)
                    }
                }

            }
            for(let i=0; i < temp.length; i++){
                // console.assert(false, temp)
                htmlOptions = htmlOptions + `<option value="${temp[i]}">${temp[i]}</option> \n`
            }
        }
        resolve(htmlOptions)
    })
}
function getOptionsPrice(object){
    return new Promise(async (resolve, reject) => {
        let htmlOptions = ``
        if(object === 'null'){
            htmlOptions = htmlOptions + `<option value="0">0</option>`
        }else{
            object = object.split(',')
            for(let i=0; i < object.length; i++){

                object[i] = object[i].replace(/^\s*(.*)\s*$/, '$1')
                htmlOptions = htmlOptions + `<option value="${object[i]}">${object[i]}</option> \n`
            }
        }
        resolve(htmlOptions)
    })
}

export default (item, col)=>{
    return new Promise(async (resolve, reject) => {
        let out = (obj)=>{
            resolve(obj)
        }
        let err = (obj)=>{
            reject(obj)
        }
        out(`
<div class="item">
    <div class="item-row" style="order:${col};">${item['assetId']}</div>
    <div class="item-row" style="order:${col};">${item['sender']}</div>
    <div class="item-row" style="order:${col};">${item['name']}</div>
    <div class="item-row" style="order:${col};">${item['description']}</div>
    <div class="item-row" style="order:${col};">${item['timestamp']}</div>
    <div class="item-row" style="order:${col};">${item['assetId']}</div>
</div>`)
    })
}