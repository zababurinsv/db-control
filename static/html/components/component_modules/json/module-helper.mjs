let Helper = {}
Helper['is_template'] = (str)=>{
    return  new Promise(async function (resolve, reject) {
        let re = /\{\{(.+)\}\}/g;
        resolve(re.test(str))
    })
}


Helper['is_array'] = (item)=>{
    return  new Promise(async function (resolve, reject) {
        resolve(
            Array.isArray(item) ||
            (!!item &&
                typeof item === 'object' && typeof item.length === 'number' &&
                (item.length === 0 || (item.length > 0 && (item.length - 1) in item))
            )
        )
    })
}

Helper.resolve =(o, path, new_val)=> {
    return  new Promise(async function (resolve, reject) {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }
        try {
            //colorlog('>~~~~~~~~~ SELECT.root ~~~resolve~~~~<','#348feb',SELECT.$selected_root)
            // 1. Takes any object
            // 2. Finds subtree based on path
            // 3. Sets the value to new_val
            // 4. Returns the object;
            if (path && path.length > 0) {
                let func = Function('new_val', 'with(this) {this' + path + '=new_val; return this;}').bind(o);
                out(func(new_val));
            } else {
                o = new_val;
                out(o);
            }
        }catch (e) {
            err({
                _:'Helper.resolve',
                error: e
            })
        }
    })
}


export default Helper