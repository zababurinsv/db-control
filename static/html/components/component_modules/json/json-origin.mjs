import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
// import SELECT from '/static/html/components/component_modules/json/module-select.mjs'
// import Helper from '/static/html/components/component_modules/json/module-helper.mjs'
// import TRANSFORM from '/static/html/components/component_modules/json/module-transform.mjs'
// import Conditional from '/static/html/components/component_modules/json/module-conditional.mjs'
// import Performance from '/static/html/components/component_modules/performance/performance.mjs'
// let performance = Performance()

// colorlog(true, 'assert' ,'constructor', SELECT, 'performance')

let object = {}
let SELECT = {}
SELECT['$progress'] = false
SELECT['$selected'] = false
let Conditional = {}
let root;


let Helper = {}
let TRANSFORM = {}

Helper['is_template'] = (str)=>{
   return  new Promise(async function (resolve, reject) {
    let re = /\{\{(.+)\}\}/g;
        resolve(re.test(str))
   })
}


SELECT.exec = (current, path, filter) => {
    return  new Promise(async function (resolve, reject) {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }
        try {

            //colorlog('>~~~~~~~~~ SELECT.exec ~~~exec~~~~<','#eb3456',current,path, filter )
            // if current matches the pattern, put it in the selected array
            if (typeof current === 'string') {
                // leaf node should be ignored
                // we're lookin for keys only
            } else if (await Helper.is_array(current)) {
                for (let i=0; i<current.length; i++) {
                    //colorlog('>~~~~~~~~~ SELECT.exec ~~~exec~~~~<','#eb3456',current[i], path+'['+i+']', filter )
                   await SELECT.exec(current[i], path+'['+i+']', filter);
                }
            } else {
                // object
                for (let key in current) {
                    // '$root' is a special key that links to the root node
                    // so shouldn't be used to iterate
                    //colorlog('>~~~~~~~~~ SELECT.exec ~~~exec~~~~<','#eb3456',current, key,current[key])
                    if (key !== '$root') {
                        if (filter(key, current[key])) {
                            let index = SELECT.$selected.length;
                            SELECT.$selected.push({
                                index: index,
                                key: key,
                                path: path,
                                object: current,
                                value: current[key],
                            });
                        }
                        //colorlog('>~~~~~~~~~ SELECT.exec ~~~exec~~~~<','#eb3456',current[key], path+'["'+key+'"]', filter)
                       await SELECT.exec(current[key], path+'["'+key+'"]', filter);
                    }
                }
            }


        }catch (e) {
            err({
                _:'exec',
                error: e
            })
        }
    })
}

// Terminal methods
SELECT.objects = (obj = {_:'SELECT', SELECT:undefined}) =>{
    return  new Promise(async function (resolve, reject) {
        if(isEmpty(obj.SELECT)){
        }else{
            SELECT = obj.SELECT
        }

        SELECT.$progress = null;
        if (SELECT.$selected) {
            resolve(SELECT.$selected.map(function(item) { return item.object; }));
        } else {
            resolve([SELECT.$selected_root]);
        }


    })
}
SELECT.keys = (obj = {_:'SELECT', SELECT:undefined}) => {
    return  new Promise(async function (resolve, reject) {
        if(isEmpty(obj.SELECT)){
        }else{
            SELECT = obj.SELECT
        }


        SELECT.$progress = null;
        if (SELECT.$selected) {
            resolve(SELECT.$selected.map(function(item) { return item.key; }));
        } else {
            if (Array.isArray(SELECT.$selected_root)) {
                resolve(Object.keys(SELECT.$selected_root).map(function(key) { return parseInt(key); }));
            } else {
                resolve(Object.keys(SELECT.$selected_root));
            }
        }


    })

}
SELECT.paths = (obj = {_:'SELECT', SELECT:undefined}) => {
    return  new Promise(async function (resolve, reject) {
        if(isEmpty(obj.SELECT)){
        }else{
            SELECT = obj.SELECT
        }

        SELECT.$progress = null;
        if (SELECT.$selected) {
            resolve(SELECT.$selected.map(function(item) { return item.path; }));
        } else {
            if (Array.isArray(SELECT.$selected_root)) {
                resolve(Object.keys(SELECT.$selected_root).map(function(item) {
                    // key is integer
                    return '[' + item + ']';
                }))
            } else {
                resolve( Object.keys(SELECT.$selected_root).map(function(item) {
                    // key is string
                    return '["' + item + '"]';
                }))
            }
        }

    })
}
SELECT.values = (obj = {_:'SELECT', SELECT:undefined}) => {
    return  new Promise(async function (resolve, reject) {
        if(isEmpty(obj.SELECT)){
        }else{
            SELECT = obj.SELECT
        }
        SELECT.$progress = null;
        if (SELECT.$selected) {
            resolve(SELECT.$selected.map(function(item) { return item.value; }));
        } else {
            resolve(Object.values(SELECT.$selected_root));
        }


    })
}
SELECT.root = (obj = {_:'SELECT', SELECT:undefined}) =>{
    return  new Promise(async function (resolve, reject) {
        if(isEmpty(obj.SELECT)){
        }else{
            SELECT = obj.SELECT
        }
        SELECT.$progress = null;
        //colorlog('>~~~~~~~~~ SELECT.root ~~~$selected_root_out~~~~<','red',SELECT.$selected_root)
        resolve(SELECT.$selected_root)
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

TRANSFORM._fillout = (options) =>{
    return  new Promise(async function (resolve, reject) {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }
        try {
            // Given a template and fill it out with passed slot and its corresponding data
            let re = /\{\{(.*?)\}\}/g;
            let full_re = /^\{\{((?!\}\}).)*\}\}$/;
            let variable = options.variable;
            let data = options.data;
            let template = options.template;
                // 1. Evaluate the variable
                let slot = variable.replace(re, '$1');

                // data must exist. Otherwise replace with blank
                if (data) {
                    let func;
                    // Attach $root to each node so that we can reference it from anywhere
                    let data_type = typeof data;
                    if (['number', 'string', 'array', 'boolean', 'function'].indexOf(data_type)  === -1) {
                        data.$root =   root
                    }
                    // If the pattern ends with a return statement, but is NOT wrapped inside another function ([^}]*$), it's a function expression
                    let match = /function\([ ]*\)[ ]*\{(.*)\}[ ]*$/g.exec(slot);
                    if (match) {
                        func = Function('with(this) {' + match[1] + '}').bind(data);
                    } else if (/\breturn [^;]+;?[ ]*$/.test(slot) && /return[^}]*$/.test(slot)) {
                        // Function expression with explicit 'return' expression
                        func = Function('with(this) {' + slot + '}').bind(data);
                    } else {
                        // Function expression with explicit 'return' expression
                        // Ordinary simple expression that
                        func = Function('with(this) {return (' + slot + ')}').bind(data);
                    }
                    let evaluated = func();
                    delete data.$root;  // remove $root now that the parsing is over
                    if (evaluated) {
                        // In case of primitive types such as String, need to call valueOf() to get the actual value instead of the promoted object
                        evaluated = evaluated.valueOf();
                    }
                    if (typeof evaluated === 'undefined') {
                        // it tried to evaluate since the variable existed, but ended up evaluating to undefined
                        // (example: var a = [1,2,3,4]; var b = a[5];)
                        out(template);
                    } else {
                        // 2. Fill out the template with the evaluated value
                        // Be forgiving and print any type, even functions, so it's easier to debug
                        if (evaluated) {
                            // IDEAL CASE : Return the replaced template
                            if (template) {
                                // if the template is a pure template with no additional static text,
                                // And if the evaluated value is an object or an array, we return the object itself instead of
                                // replacing it into template via string replace, since that will turn it into a string.
                                if (full_re.test(template)) {
                                    out(evaluated);
                                } else {
                                    out(template.replace(variable, evaluated));
                                }
                            } else {
                                out(evaluated);
                            }
                        } else {
                            // Treat false or null as blanks (so that #if can handle it)
                            if (template) {
                                // if the template is a pure template with no additional static text,
                                // And if the evaluated value is an object or an array, we return the object itself instead of
                                // replacing it into template via string replace, since that will turn it into a string.
                                if (full_re.test(template)) {
                                    out(evaluated);
                                } else {
                                    out(template.replace(variable, ''));
                                }
                            } else {
                                return '';
                            }
                        }
                    }
                }else{
                    // REST OF THE CASES
                    // if evaluated is null or undefined,
                    // it probably means one of the following:
                    //  1. The current data being parsed is not for the current template
                    //  2. It's an error
                    //
                    //  In either case we need to return the original template unparsed.
                    //    1. for case1, we need to leave the template alone so that the template can be parsed
                    //      by another data set
                    //    2. for case2, it's better to just return the template so it's easier to debug
                    out(template);
                }
        }catch (e) {
            err({
                _:'_fillout',
                error: e
            })
        }
    })
}

TRANSFORM.fillout = (data, template, raw, view= true) =>{
    return  new Promise(async function (resolve, reject) {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }
        try {
            //colorlog('>~~~~~~~~~ TRANSFORM.fillout ~~~in~~~~~~<','#9beb34',data, template, raw)
            // 1. fill out if possible
            // 2. otherwise return the original
            let replaced = template;
            // Run fillout() only if it's a template. Otherwise just return the original string
            if (await Helper.is_template(template)) {
                let re = /\{\{(.*?)\}\}/g;

                // variables are all instances of {{ }} in the current expression
                // for example '{{this.item}} is {{this.user}}'s' has two variables: ['this.item', 'this.user']
                let variables = template.match(re);

                if (variables) {
                    //colorlog('>~~~~~~~~~ TRANSFORM.fillout ~~~variables~~1~~~~<','#9beb34',variables)
                    if (raw) {
                        // 'raw' is true only for when this is called from #each
                        // Because #each is expecting an array, it shouldn't be stringified.
                        // Therefore we pass template:null,
                        // which will result in returning the original result instead of trying to
                        // replace it into the template with a stringified version
                        replaced = await TRANSFORM._fillout({
                            variable: variables[0],
                            data: data,
                            template: null,
                        },view);
                    } else {
                        // Fill out the template for each variable

                        for (let i = 0; i < variables.length; i++) {
                            let variable = variables[i];
                            replaced = await TRANSFORM._fillout({
                                variable: variable,
                                data: data,
                                template: replaced,
                            },view);
                        }
                    }
                } else {
                    console.warn('здесь был return пока не вижу зачем он')
                }
            }
            //colorlog('>~~~~~~~~~ TRANSFORM.fillout ~~~out~~~~<','red',replaced)
            out(replaced);




        }catch (e) {
            err({
                _:'error menu',
                error: e
            })
        }

    })
}

TRANSFORM.tokenize =(str) => {
    return new Promise( async (resolve, reject) =>{
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            reject(error)
        }
        try {
            // INPUT : string
            // OUTPUT : {name: FUNCTION_NAME:STRING, args: ARGUMENT:ARRAY}
            let re = /\{\{(.+)\}\}/g;
            str = str.replace(re, '$1');
            // str : '#each $jason.items'

            let tokens = str.trim().split(' ');
            // => tokens: ['#each', '$jason.items']

            let func;
            let outItem = null
            if (tokens.length > 0) {
                if (tokens[0][0] === '#') {
                    func = tokens.shift();
                    // => func: '#each' or '#if'
                    // => tokens: ['$jason.items', '&&', '$jason.items.length', '>', '0']

                    let expression = tokens.join(' ');
                    // => expression: '$jason.items && $jason.items.length > 0'

                    outItem = { name: func, expression: expression }
                }
            }
            out(outItem)
        }catch (e) {
            err({
                _:'error menu',
                error: e
            })
        }
    })
}

TRANSFORM.run = (template, data) => {
    return new Promise( async (resolve, reject) =>{
        let out = (obj) => {
            // console.log('~~~ out  ~~~', obj['input'])
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }
        try {
            let result;
            let fun;
            //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~template~~~~~~<','#c203fc', template)
            if (typeof template === 'string') {
                // Leaf node, so call TRANSFORM.fillout()
                if (await Helper.is_template(template)) {
                    let include_string_re = /\{\{([ ]*#include)[ ]*([^ ]*)\}\}/g;
                    //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~include_string_re~~~~~~<','#c203fc', include_string_re)
                    if (include_string_re.test(template)) {
                        fun = await TRANSFORM.tokenize(template);
                        if (fun.expression) {
                            // if #include has arguments, evaluate it before attaching
                            result = await TRANSFORM.fillout(data, '{{' + fun.expression + '}}', true);
                        } else {
                            // shouldn't happen =>
                            // {'wrapper': '{{#include}}'}
                            result = template;
                        }
                    } else {
                        // non-#include
                        result = await TRANSFORM.fillout(data, template);
                    }
                } else {
                    result = template;
                }
            } else if (await Helper.is_array(template)) {
                if (await Conditional.is(template)) {
                    result =await Conditional.run(template, data);
                } else {
                    result = [];
                    for (let i = 0; i < template.length; i++) {
                        let item = await TRANSFORM.run(template[i], data);
                        if (item) {
                            // only push when the result is not null
                            // null could mean #if clauses where nothing matched => In this case instead of rendering 'null', should just skip it completely
                            // Todo : Distinguish between #if arrays and ordinary arrays, and return null for ordinary arrays
                            result.push(item);
                        }
                    }
                }
            } else if (Object.prototype.toString.call(template) === '[object Object]') {
                // template is an object
                result = {};

                // ## Handling #include
                // This needs to precede everything else since it's meant to be overwritten
                // in case of collision
                let include_object_re = /\{\{([ ]*#include)[ ]*(.*)\}\}/;
                let include_keys = Object.keys(template).filter(function(key) { return include_object_re.test(key); });
                if (include_keys.length > 0) {
                    // find the first key with #include
                    fun = await TRANSFORM.tokenize(include_keys[0]);
                    if (fun.expression) {
                        // if #include has arguments, evaluate it before attaching
                        result =await TRANSFORM.fillout(template[include_keys[0]], '{{' + fun.expression + '}}', true);
                    } else {
                        // no argument, simply attach the child
                        result = template[include_keys[0]];
                    }
                }

                for (let key in template) {
                    // Checking to see if the key contains template..
                    // Currently the only case for this are '#each' and '#include'
                    if (await Helper.is_template(key)) {
                        fun = await TRANSFORM.tokenize(key);
                        if (fun) {
                            if (fun.name === '#include') {
                                // this was handled above (before the for loop) so just ignore
                            } else if (fun.name === '#let') {
                                if (await Helper.is_array(template[key]) && template[key].length == 2) {
                                    let defs = template[key][0];
                                    let real_template = template[key][1];

                                    // 1. Parse the first item to assign variables
                                    let parsed_keys = TRANSFORM.run(defs, data);

                                    // 2. modify the data
                                    for(let parsed_key in parsed_keys) {
                                        TRANSFORM.memory[parsed_key] = parsed_keys[parsed_key];
                                        data[parsed_key] = parsed_keys[parsed_key];
                                    }

                                    // 2. Pass it into TRANSFORM.run
                                    result = await TRANSFORM.run(real_template, data);
                                }
                            } else if (fun.name === '#concat') {
                                if (await Helper.is_array(template[key])) {
                                    result = [];
                                    template[key].forEach(function(concat_item) {
                                        let res = TRANSFORM.run(concat_item, data);
                                        result = result.concat(res);
                                    });

                                    if (/\{\{(.*?)\}\}/.test(JSON.stringify(result))) {
                                        // concat should only trigger if all of its children
                                        // have successfully parsed.
                                        // so check for any template expression in the end result
                                        // and if there is one, revert to the original template
                                        result = template;
                                    }
                                }
                            } else if (fun.name === '#merge') {
                                if (await Helper.is_array(template[key])) {
                                    result = {};
                                    template[key].forEach(function(merge_item) {
                                        let res = TRANSFORM.run(merge_item, data);
                                        for (let key in res) {
                                            result[key] = res[key];
                                        }
                                    });
                                    // clean up $index from the result
                                    // necessary because #merge merges multiple objects into one,
                                    // and one of them may be 'this', in which case the $index attribute
                                    // will have snuck into the final result
                                    if(typeof data === 'object') {
                                        delete result["$index"];

                                        // #let handling
                                        for (let declared_vars in TRANSFORM.memory) {
                                            delete result[declared_vars];
                                        }
                                    } else {
                                        delete String.prototype.$index;
                                        delete Number.prototype.$index;
                                        delete Function.prototype.$index;
                                        delete Array.prototype.$index;
                                        delete Boolean.prototype.$index;

                                        // #let handling
                                        for (let declared_vars in TRANSFORM.memory) {
                                            delete String.prototype[declared_vars];
                                            delete Number.prototype[declared_vars];
                                            delete Function.prototype[declared_vars];
                                            delete Array.prototype[declared_vars];
                                            delete Boolean.prototype[declared_vars];
                                        }
                                    }
                                }
                            } else if (fun.name === '#each') {
                                //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~#each~~~~~~<','#c203fc', data, '{{' + fun.expression + '}}', true)
                                // newData will be filled with parsed results
                                let newData = await TRANSFORM.fillout(data, '{{' + fun.expression + '}}', true);

                                // Ideally newData should be an array since it was prefixed by #each
                                if (newData && await Helper.is_array(newData)) {
                                    result = [];
                                    for (let index = 0; index < newData.length; index++) {
                                        // temporarily set $index
                                        //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~#each~~~~~~<','#c203fc',newData[index])
                                        if(typeof newData[index] === 'object') {
                                            newData[index]["$index"] = index;
                                            // #let handling
                                            for (let declared_vars in TRANSFORM.memory) {
                                                newData[index][declared_vars] = TRANSFORM.memory[declared_vars];
                                            }
                                        } else {
                                            //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~#memory~~~~~~<','#c203fc',TRANSFORM.memory)
                                            String.prototype.$index = index;
                                            Number.prototype.$index = index;
                                            Function.prototype.$index = index;
                                            Array.prototype.$index = index;
                                            Boolean.prototype.$index = index;
                                            // #let handling
                                            for (let declared_vars in TRANSFORM.memory) {
                                                String.prototype[declared_vars] = TRANSFORM.memory[declared_vars];
                                                Number.prototype[declared_vars] = TRANSFORM.memory[declared_vars];
                                                Function.prototype[declared_vars] = TRANSFORM.memory[declared_vars];
                                                Array.prototype[declared_vars] = TRANSFORM.memory[declared_vars];
                                                Boolean.prototype[declared_vars] = TRANSFORM.memory[declared_vars];
                                            }
                                        }

                                        // run
                                        //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~#memory~~~~~~<','#c203fc',template[key], newData[index])
                                        let loop_item = await TRANSFORM.run(template[key], newData[index]);

                                        // clean up $index
                                        if(typeof newData[index] === 'object') {
                                            delete newData[index]["$index"];
                                            // #let handling
                                            for (let declared_vars in TRANSFORM.memory) {
                                                delete newData[index][declared_vars];
                                            }
                                        } else {
                                            //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~#delete~~~~~~<','#c203fc',template[key], newData[index])
                                            delete String.prototype.$index;
                                            delete Number.prototype.$index;
                                            delete Function.prototype.$index;
                                            delete Array.prototype.$index;
                                            delete Boolean.prototype.$index;
                                            // #let handling
                                            for (let declared_vars in TRANSFORM.memory) {
                                                delete String.prototype[declared_vars];
                                                delete Number.prototype[declared_vars];
                                                delete Function.prototype[declared_vars];
                                                delete Array.prototype[declared_vars];
                                                delete Boolean.prototype[declared_vars];
                                            }
                                        }

                                        if (loop_item) {
                                            // only push when the result is not null
                                            // null could mean #if clauses where nothing matched => In this case instead of rendering 'null', should just skip it completely
                                            result.push(loop_item);
                                            //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~#result~~~~~~<','#c203fc',loop_item,result)
                                        }
                                    }
                                } else {
                                    // In case it's not an array, it's an exception, since it was prefixed by #each.
                                    // This probably means this #each is not for the current variable
                                    // For example {{#each items}} may not be an array, but just leave it be, so
                                    // But don't get rid of it,
                                    // Instead, just leave it as template
                                    // So some other parse run could fill it in later.
                                    //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~#result = template~~~~~~<','#c203fc',template)

                                    result = template;
                                }
                            } // end of #each
                        } else { // end of if (fun)
                            // If the key is a template expression but aren't either #include or #each,
                            // it needs to be parsed
                            //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~TRANSFORM.fillout~~~~~~<','#c203fc',data, key)
                            //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~TRANSFORM.fillout~~~~~~<','#c203fc',data, template[key])
                            let k = await TRANSFORM.fillout(data, key);
                            let v = await TRANSFORM.fillout(data, template[key]);
                            if (k !== undefined && v !== undefined) {
                                result[k] = v;
                                //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~ result[k] = v;~~~~~~<','#c203fc',result,  result[k], k, v)
                            }
                        }
                    } else {
                        // Helper.is_template(key) was false, which means the key was not a template (hardcoded string)
                        if (typeof template[key] === 'string') {
                            fun = await TRANSFORM.tokenize(template[key]);
                            if (fun && fun.name === '#?') {
                                // If the key is a template expression but aren't either #include or #each,
                                // it needs to be parsed
                                let filled = await TRANSFORM.fillout(data, '{{' + fun.expression + '}}');
                                if (filled === '{{' + fun.expression + '}}' || !filled) {
                                    // case 1.
                                    // not parsed, which means the evaluation failed.

                                    // case 2.
                                    // returns fasly value

                                    // both cases mean this key should be excluded
                                } else {
                                    // only include if the evaluation is truthy
                                    result[key] = filled;
                                }
                            } else {
                                let item = await TRANSFORM.run(template[key], data);
                                if (item !== undefined) {
                                    result[key] = item;
                                }
                            }
                        } else {
                            let item = await TRANSFORM.run(template[key], data);
                            if (item !== undefined) {
                                result[key] = item;
                            }
                        }
                    }
                }
            } else {
                //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~out~~~template~~~<','red', template)
                out(template)
            }
            // //colorlog('>~~~~~~~~~ TRANSFORM.run ~~~out~~~result~~~<','red', result)
            out(result)


        }catch (e) {
            err({
                _:'error menu',
                error: e
            })
        }
    })
}

Conditional.is = (template) => {
    return new Promise( async (resolve, reject) => {
        let out = (obj) => {
            // console.log('~~~ out  ~~~', obj['input'])
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }
        try {
            //colorlog('>~~~~~~~~~ Conditional.is ~~~~~~~~~<','#8034eb', template)
            // TRUE ONLY IF it's in a correct format.
            // Otherwise return the original template
            // Condition 0. Must be an array
            // Condition 1. Must have at least one item
            // Condition 2. Each item in the array should be an object of a single key/value pair
            // Condition 3. starts with #if
            // Condition 4. in case there's more than two items, everything between the first and the last item should be #elseif
            // Condition 5. in case there's more than two items, the last one should be either '#else' or '#elseif'
            if (!await Helper.is_array(template)) {
                // Condition 0, it needs to be an array to be a conditional
                //colorlog('>~~~~~~~~~ Conditional.is ~~~~~false~~~~<','red', template)
                out(false);
            }else{
                // Condition 1.
                // Must have at least one item
                if (template.length === 0) {
                    //colorlog('>~~~~~~~~~ Conditional.is ~~~~~false~~~~<','red', template)
                    out(false);
                }else{


                    // Condition 2.
                    // Each item in the array should be an object
                    // , and  of a single key/value pair
                    let containsValidObjects = true;
                    for (let i = 0; i < template.length; i++) {
                        let item = template[0];
                        if (typeof item !== 'object') {
                            //colorlog('>~~~~~~~~~ Conditional.is ~~~~~~~~~<','#8034eb', item)
                            containsValidObjects = false;
                            break;
                        }
                        if (Object.keys(item).length !== 1) {
                            // first item in the array has multiple key value pairs, so invalid.
                            containsValidObjects = false;
                            break;
                        }
                    }
                    if (!containsValidObjects) {
                        out(false);
                    }else{

                        // Condition 3.
                        // the first item should have #if as its key
                        // the first item should also contain an expression
                        let first = template[0];
                        let func;
                        for (let key in first) {
                            func = await TRANSFORM.tokenize(key);
                            if (!func) {
                                //colorlog('>~~~~~~~~~ Conditional.is ~~~~~false~~~~<','red', template)
                                out(false);
                            }else {
                                if (!func.name) {
                                    //colorlog('>~~~~~~~~~ Conditional.is ~~~~~false~~~~<','red', template)
                                    out(false);
                                }else {
                                    // '{{#if }}'
                                    if (!func.expression || func.expression.length === 0) {
                                        //colorlog('>~~~~~~~~~ Conditional.is ~~~~~false~~~~<','red', template)
                                        out(false);
                                    }else{
                                        if (func.name.toLowerCase() !== '#if') {
                                            //colorlog('>~~~~~~~~~ Conditional.is ~~~~~false~~~~<','red', template)
                                            out(false);
                                        }

                                    }
                                }
                            }
                        }
                        if (template.length === 1) {
                            // If we got this far and the template has only one item, it means
                            // template had one item which was '#if' so it's valid
                            //colorlog('>~~~~~~~~~ Conditional.is ~~~~~true~~~~<','red', template)
                            out(true);
                        }else{
                            //colorlog('>~~~~~~~~~ Conditional.is ~~~~~else~~~~<','red', template)
                            // Condition 4.
                            // in case there's more than two items, everything between the first and the last item should be #elseif
                            let they_are_all_elseifs = true;
                            for (let template_index = 1; template_index < template.length-1; template_index++) {
                                let template_item = template[template_index];
                                for (let template_key in template_item) {
                                    func = await TRANSFORM.tokenize(template_key);
                                    if (func.name.toLowerCase() !== '#elseif') {
                                        they_are_all_elseifs = false;
                                        break;
                                    }
                                }
                            }
                            if (!they_are_all_elseifs) {
                                // There was at least one item that wasn't an elseif
                                // therefore invalid
                                out(true);
                            }else{


                                // If you've reached this point, it means we have multiple items and everything between the first and the last item
                                // are elseifs
                                // Now we need to check the validity of the last item
                                // Condition 5.
                                // in case there's more than one item, it should end with #else or #elseif
                                let last = template[template.length-1];
                                let verify = true
                                for (let last_key in last) {
                                    func = await TRANSFORM.tokenize(last_key);
                                    //colorlog('>~~~~~~~~~ Conditional.is ~~~~~~~~~<','#8034eb', func)
                                    if (['#else', '#elseif'].indexOf(func.name.toLowerCase()) === -1) {
                                        verify = false

                                    }
                                }
                                //colorlog('>~~~~~~~~~ Conditional.is ~~~~~verify~~~~<','red', verify)
                                // Congrats, if you've reached this point, it's valid
                                out(verify);

                            }
                        }
                    }
                }
            }
        }catch (e) {
            err({
                _:'is',
                error: e
            })
        }
    })
}

SELECT.select = (obj,filter, serialized) =>{
    return new Promise(async function (resolve, reject) {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            reject(error)
        }
        try{
            //colorlog('>~~~~~~~~~ SELECT.select ~~~~~~~~~<','#0362fc', SELECT)
            if(!isEmpty(filter)){
                obj.filter = filter
            }
            if(!isEmpty(serialized)){
                obj.serialized = serialized
            }
            // console.assert(false,obj )
            // iterate '$selected'
            //
            /*
            SELECT.$selected = [{
              value {
                '{{#include}}': {
                  '{{#each items}}': {
                    'type': 'label',
                    'text': '{{name}}'
                  }
                }
              },
              path: '$jason.head.actions.$load'
              ...
            }]
            */
            let json = {}
            if(isEmpty(obj.this)){
                json = obj;
            }else{
                json = obj.this
            }

            try {
                if (serialized){
                    json = JSON.parse(obj);
                }
            } catch (error) { }

            if (filter) {
                SELECT.$selected = [];
                await SELECT.exec(json, '', filter);
            } else {
                SELECT.$selected = null;
            }

            if (json && (Helper.is_array(json) || typeof json === 'object')) {
                if (!SELECT.$progress) {
                    //colorlog('>~~~~~~~~~ SELECT.select ~~~~$progress~~~~~<','#0362fc')
                    // initialize
                    if (Helper.is_array(json)) {
                        SELECT.$val = [];
                        SELECT.$selected_root = [];
                    } else {
                        SELECT.$val = {};
                        SELECT.$selected_root = {};
                    }
                }
                Object.keys(json).forEach(function(key) {
                    //for (let key in json) {
                    //colorlog('>~~~~~~~~~ SELECT.select ~~~~$progress~~~~~<','#0362fc', json[key])
                    SELECT.$val[key] = json[key];
                    SELECT.$selected_root[key] = json[key];
                });
            } else {
                SELECT.$val = json;
                SELECT.$selected_root = json;
            }
            SELECT.$progress = true; // set the 'in progress' flag
            //colorlog('>~~~~~~~~~ SELECT.select ~~~~out~~~~~<','red', SELECT)
            out(SELECT);

        }catch (e) {
            err({
                _:'error menu',
                error: e
            })
        }
    })
}

SELECT.transformWith = (obj,serialized, selected) => {
    return new Promise(async (resolve, reject) => {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            reject(error)
        }
        try{
            //colorlog('>~~~~~~~~~ SELECT.transformWith ~~~~~~~~~<','#6203fc', SELECT)
            // console.assert(false, SELECT.$progress)
            if(isEmpty(SELECT.$progress)){
                SELECT.$progress = null;
            }
            if(isEmpty(SELECT.$parsed)){
                SELECT.$parsed = [];
            }
            if(isEmpty(selected)){
            }else{
                SELECT = Object.assign(SELECT,selected);
                // console.warn('нужно проверить работоспособность при совпадении двух свойств', SELECT)
            }

            let template = {}
            if(isEmpty(obj.template)){
                template = obj;
            }else{
                //colorlog('>~~~~~~~~~ SELECT.transformWith ~~~template~~~~~~<','#6203fc', SELECT)
                template = obj.template;
            }
            if(isEmpty(serialized)){
                //colorlog('>~~~~~~~~~ SELECT.transformWith ~~~serialized~~~~~~<','#6203fc', SELECT)
                obj.serialized = serialized
            }
            try {
                if (serialized){
                    template = JSON.parse(obj);
                }
            } catch (error) { }
            SELECT.$template_root = template;
            String.prototype.$root = SELECT.$selected_root;
            Number.prototype.$root = SELECT.$selected_root;
            Function.prototype.$root = SELECT.$selected_root;
            Array.prototype.$root = SELECT.$selected_root;
            Boolean.prototype.$root = SELECT.$selected_root;
            root = SELECT.$selected_root;
            // generate new $selected_root
            if (SELECT.$selected && SELECT.$selected.length > 0) {
                SELECT.$selected.sort(function(a, b) {
                    // sort by path length, so that deeper level items will be replaced first
                    // TODO: may need to look into edge cases
                    return b.path.length - a.path.length;
                }).forEach(function(selection) {
                    console.assert(false)
                    //SELECT.$selected.forEach(function(selection) {
                    // parse selected
                    var parsed_object = TRANSFORM.run(template, selection.object);

                    // apply the result to root
                    SELECT.$selected_root =  Helper.resolve(SELECT.$selected_root, selection.path, parsed_object);

                    // update selected object with the parsed result
                    selection.object = parsed_object;
                });
                SELECT.$selected.sort(function(a, b) {
                    return a.index - b.index;
                });
            } else {
                var parsed_object = await TRANSFORM.run(template, SELECT.$selected_root);
                // apply the result to root
                SELECT.$selected_root = await Helper.resolve(SELECT.$selected_root, '', parsed_object);
            }
            delete String.prototype.$root;
            delete Number.prototype.$root;
            delete Function.prototype.$root;
            delete Array.prototype.$root;
            delete Boolean.prototype.$root;
            performance['now'](true)
            out(SELECT);
        }catch (e) {
            err({
                _:'error menu',
                error: e
            })
        }
    })
}
// Native JSON object override
let _stringify = JSON.stringify;
JSON.stringify = function(val, replacer, spaces) {
    var t = typeof val;
    if (['number', 'string', 'boolean'].indexOf(t) !== -1) {
        return _stringify(val, replacer, spaces);
    }
    if (!replacer) {
        return _stringify(val, function(key, val) {
            if (SELECT.$injected && SELECT.$injected.length > 0 && SELECT.$injected.indexOf(key) !== -1) { return undefined; }
            if (key === '$root' || key === '$index') {
                return undefined;
            }
            if (key in TRANSFORM.memory) {
                return undefined;
            }
            if (typeof val === 'function') {
                return '(' + val.toString() + ')';
            } else {
                return val;
            }
        }, spaces);
    } else {
        return _stringify(val, replacer, spaces);
    }
};
export default (obj = {_:'json'})=>{
    return new Promise( async (resolve, reject) =>{
        let out = (obj) => {
            // console.log('~~~ out  ~~~', obj['input'])
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }

        object['class'] = class Json {
            constructor(self) {
                this.select = this.select.bind(this)
                this.transformWith = this.transformWith.bind(this)
                this.root = this.root.bind(this)
                // colorlog(true, { key:'value' } ,'constructor', this, 'performance')
                // colorlog(true, `свойство1` ,'constructor', this, 'performance')
                // colorlog(true, `end` ,'constructor', this, 'performance')
                // colorlog(true, `свойство5` ,'constructor', this, 'performance')
                // colorlog(true, `свойство6` ,'success', this, 'performance2')
                // colorlog(true, `свойство7` ,'constructor', this, 'performance')
                // colorlog(true, `свойство8` ,'success', this, 'performance2')
                // colorlog(true, `end` ,'success', this, 'performance2')
                // colorlog(true, `свойства3` ,'constructor', this, 'performance')
                // colorlog(true, `свойство4` ,'constructor', this, 'performance')
                // colorlog(true, `end` ,'constructor', this, 'performance')
                // colorlog(true, `stat` ,'constructor', this, 'performance')

                // colorlog(true, `end` ,'constructor', this, 'performance')
                // console.assert(false)
                // console.log(performance.allMark)
            }
            root(obj){
                return SELECT.root(obj)
            }
            transformWith(obj,serialized, selected){
               return SELECT.transformWith(obj,serialized, selected)
            }
            select(obj ={
                _:'select',
                this:undefined,
                filter:false,
                serialized:false
            },filter, serialized){
                return SELECT.select(obj,filter, serialized)
            }
            get self() {
                return object
            }
        }
        out(object)
    })
}
