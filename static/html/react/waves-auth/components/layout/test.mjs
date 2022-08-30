export default  (obj) => {
    return new Promise(function (resolve, reject) {
        bundle['default'](obj,null, async function (error, react) {
            let connect = await react['reactRedux']['connect']
            let PropTypes = react['PropTypes']
            let Component = react['React']['Component']

            let template = react['babel']['transform'](`     
   
                 resolve({test:'ok'})        
 
            `,react['babel']['availablePresets']['react'])


            template = react['generate']['default'](template.ast,template.options, template.code ).code;

            eval(template)
          // console.assert(false, template)
        })
    })
}

