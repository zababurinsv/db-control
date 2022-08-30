import change from '/static/html/components/component_modules/change/change.mjs'
import indexedDB from '/static/html/components/component_modules/indexedDB/indexedDB.mjs'
let dictionary = [ {
    city:[],
    search: ''
},
    { name:[],
        search: '' },
    { object:[],
        search: '' },
    { dateExperiences:[],
        search: '' },
    { class:[],
        search: '' },
    { type:[],
        search: ''  },
    { metro:[],
        search: '' },
    { geo:[],
        search: '' },
    { plans:[],
        search: '' },
    { price:[],
        search: '' },
    { finish:[],
        search: ''},
    { description:[],
        search: '' },
    { timestampUpdate:[],
        search: ''}]

for(let i in dictionary){
    for(let j in dictionary[i]){
        switch (j) {
            case 'city':
                dictionary[i][j].push({word:'москва', change:'москва'})
                dictionary[i][j].push({word:'санкт-петербург', change:'санкт-петербург'})
                dictionary[i][j].push({word:'подмосковье', change:'москва'})
                break
            case 'name':
                dictionary[i][j].push({word:'Tokio группа', change:'Tekia Group'})
                dictionary[i][j].push({word:'Tokio группа', change:'Tekia Group'})
                dictionary[i][j].push({word:'таким грубым', change:'Tekia Group'})
                dictionary[i][j].push({word:'Так я группу', change:'Tekia Group'})
                dictionary[i][j].push({word:'роуз групп', change:'роуз групп'})
                dictionary[i][j].push({word:'кортрос', change:'кортрос'})
                dictionary[i][j].push({word:'Капитал гроуп', change:'Капитал гроуп'})
                dictionary[i][j].push({word:'вайнбридж', change:'вайнбридж'})
                break
            case 'object':
                dictionary[i][j].push({word:'Биг Тайм', change:'Биг Тайм'})
                dictionary[i][j].push({word:'Спайрс', change:'Спайрс'})
                dictionary[i][j].push({word:'Микрогород в лесу', change:'Микрогород в лесу'})
                dictionary[i][j].push({word:'Big Time', change:'Big Time'})
                dictionary[i][j].push({word:'Прайс', change:'Спайрс'})
                break
            case 'dateExperiences':

                break
            case 'class':
                dictionary[i][j].push({word:'обычный', change:'обычный'})
                dictionary[i][j].push({word:'обычно', change:'обычный'})
                dictionary[i][j].push({word:'элитный', change:'элитный'})
                dictionary[i][j].push({word:'элитно', change:'элитный'})
                dictionary[i][j].push({word:'комфорт', change:'комфорт'})
                break
            case 'type':

                break
            case 'metro':

                break
            case 'geo':

                break
            case 'plans':

                break
            case 'price':

                break
            case 'finish':

                break
            case 'description':

                break
            case 'timestampUpdate':

                break
            default:
                // console.assert(false, 'новые поля', m)
                break
        }
    }
}
(async ()=>{
    await indexedDB['set']({type:'dictionary', data:dictionary })
})()

export default {
    set:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            let search = obj['this'].parentNode.querySelectorAll('th')
            for(let key = 0; key < search.length; key++){
                if(search[key].querySelector('input')){
                    switch (search[key].querySelector('input').id) {
                        case'search_input_Developer':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'name':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_Object':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'object':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_Deadline':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'dateExperiences':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_houseClass':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'class':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_houseType':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'type':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_Metro':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'metro':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_geo':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'geo':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_plan':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'plans':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_price':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'price':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_Finish':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'finish':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        case'search_input_AdditionalInfo':
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'description':
                                            dictionary[j]['search'] = search[key].querySelector('input')
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                            break
                        default:
                            break

                    }
                }else{
                    if(search[key].querySelector('select')){
                        for(let j = 0; j < dictionary.length;j++){
                            for(let m in dictionary[j]){
                                switch (m) {
                                    case 'city':
                                        dictionary[j]['search'] = search[key].querySelector('select')
                                        break
                                    default:
                                        // console.assert(false, 'новые поля', m)
                                        break
                                }

                            }
                        }

                    }
                }
            }
            switch(obj['type']){
                case 'isFinal':
                    (async (obj, type, rest)=>{
                        let data = obj['data'].split(' ')
                        for(let i =0; i < data.length; i++){
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    switch (m) {
                                        case 'city':
                                            for(let k in dictionary[j][m]){

                                            }
                                            break
                                        case 'name':
                                            for(let k in dictionary[j][m]){
                                                // console.log('~~~~~~~isFinal~~name~~~~~~~~', dictionary[j]['search'])

                                            }
                                            break
                                        case 'object':
                                            for(let k in dictionary[j][m]){

                                                // console.log('~~~~~~~isFinal~~object~~~~~~~~', dictionary[j]['search'])
                                            }
                                            break
                                        case 'dateExperiences':
                                            for(let k in dictionary[j][m]){
                                                //    console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'class':
                                            for(let k in dictionary[j][m]){
                                                // console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'type':
                                            for(let k in dictionary[j][m]){
                                                // console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'metro':
                                            for(let k in dictionary[j][m]){
                                                // console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'geo':
                                            for(let k in dictionary[j][m]){
                                                //  console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'plans':
                                            for(let k in dictionary[j][m]){
                                                //  console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'price':
                                            for(let k in dictionary[j][m]){
                                                //   console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'finish':
                                            for(let k in dictionary[j][m]){
                                                //  console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'description':
                                            for(let k in dictionary[j][m]){
                                                // console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'timestampUpdate':
                                            for(let k in dictionary[j][m]){
                                                // console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                        }
                        out(true)
                    })(obj, type, rest)
                    out(true)
                    break
                case 'isRaw':
                    (async (obj, type, rest)=>{
                        let data = obj['data'].split(' ')
                        for(let i =0; i < data.length; i++){
                            for(let j = 0; j < dictionary.length;j++){
                                for(let m in dictionary[j]){
                                    // console.assert(false, dictionary[j], m)
                                    switch (m) {
                                        case 'city':
                                            for(let k in dictionary[j][m]){
                                                //   console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])
                                            }
                                            break
                                        case 'name':
                                            for(let k in dictionary[j][m]){
                                                //  console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])
                                            }
                                            break
                                        case 'object':
                                            for(let k in dictionary[j][m]){
                                                //   console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])
                                            }
                                            break
                                        case 'dateExperiences':
                                            for(let k in dictionary[j][m]){
                                                //   console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'class':
                                            for(let k in dictionary[j][m]){

                                                if(data[i].toLowerCase() === dictionary[j][m][k]['word'].toLowerCase()){
                                                    change(obj['this'].parentNode, {type:'search_input_houseClass', data: dictionary[j][m][k]['change']})
                                                }
                                            }
                                            break
                                        case 'type':
                                            for(let k in dictionary[j][m]){
                                                if(data[i].toLowerCase() === dictionary[j][m][k]['word'].toLowerCase()){
                                                    change(obj['this'].parentNode, {type:'search_input_houseType', data: dictionary[j][m][k]['change']})
                                                }
                                            }
                                            break
                                        case 'metro':
                                            for(let k in dictionary[j][m]){
                                                if(data[i].toLowerCase() === dictionary[j][m][k]['word'].toLowerCase()){
                                                    change(obj['this'].parentNode, {type:'search_input_houseType', data: dictionary[j][m][k]['change']})
                                                }
                                            }
                                            break
                                        case 'geo':
                                            for(let k in dictionary[j][m]){
                                                //  console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'plans':
                                            for(let k in dictionary[j][m]){
                                                //   console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'price':
                                            for(let k in dictionary[j][m]){
                                                //  console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'finish':
                                            for(let k in dictionary[j][m]){
                                                //   console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'description':
                                            for(let k in dictionary[j][m]){
                                                // console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])

                                            }
                                            break
                                        case 'timestampUpdate':
                                            for(let k in dictionary[j][m]){
                                                //    console.log('~~~~~~~isFinal~~sssss~~~~~~~~', dictionary[j][m][k])
                                            }
                                            break
                                        default:
                                            // console.assert(false, 'новые поля', m)
                                            break
                                    }

                                }
                            }
                        }
                        out(true)
                    })(obj, type, rest)
                    out(true)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }
        })
    },
    get:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'dictionary':
                    (async (obj, type, rest)=>{
                        dictionary =  await indexedDB['get']({type:'dictionary'})
                        out(dictionary)
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    put:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'getAll':
                    ((obj, type, rest)=>{



                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    delete:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'getAll':
                    ((obj, type, rest)=>{
                        out(sessionStorage.removeItem(obj['key']))
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    clearn: async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'sessionStorage':
                    ((obj, type, rest)=>{

                        out(true)
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }
        })
    }
}