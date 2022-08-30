export default {
    set:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'plan':
                    (async (obj, type, rest)=>{

                        obj['this'].addEventListener('click', async (e)=>{
                            let verify = true
                            let item =  e.target.parentNode
                            while(verify){
                                if(item.tagName === 'TR'){
                                    verify = false
                                }else{
                                    item =  item.parentNode
                                }
                            }
                            switch (e.target.name) {
                                case 'plan':
                                    let price = item.querySelector('.price')
                                    price = price.querySelector('select')
                                    price.selectedIndex = e.target.selectedIndex
                                    break
                                case 'price':
                                    let plan = item.querySelector('.plan')
                                    plan = plan.querySelector('select')
                                    plan.selectedIndex = e.target.selectedIndex
                                    break
                                default:
                                    break
                            }
                        })
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