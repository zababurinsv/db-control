import description from '/static/html/components/component_modules/description/description.mjs'
let object = undefined
export default (show, message='default', color ='default', ...args) =>{
    return  new Promise(async (resolve, reject) => {
        function out(obj) {
            resolve(obj)
        }
        function err(obj) {
            reject(obj)
        }
        try {
            if(typeof args[args.length-1] === 'string'){
                object = await description(show, '%c%O' + args[args.length-1],'color:' + color,'[(', args.slice(0, args.length-1),'*)',message,']')
            }else{
                console.assert(false, 'не выбранно отношение')
            }
            out(object)
        }catch (e) {
            err({
                _:'object',
                error: e
            })
        }
        
    })
}