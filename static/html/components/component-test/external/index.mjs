let object = {}
import { tests } from '/static/html/components/component_modules/loader/loader.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import loader from '/static/html/components/component_modules/loader/loader.mjs'
export default async (v,p,c,obj,r) => {
    return new Promise(async (resolve, reject) =>{
        // let mocha =  await loader('/static/html/components/component_modules/mocha/mocha.js', 'mocha', obj)
        // let sw = {}
        // await mocha.setup('bdd')

        // if(location.hostname === 'localhost'){
        //     sw = location.host
        // }else{
        //     sw =  location.pathname
        // }
        // switch (sw) {
        //     case 'localhost:1111':
        //         await tests('/tests/game/monopoly.mjs','tests', obj)
        //         break
        //     case 'localhost:6040':
        //         await tests('/tests/game/monopoly.mjs','tests', obj)
        //         break
        //     case 'zababurinsv.github.io':
        //         await tests('/tests/game/monopoly.mjs','tests', obj)
        //         break
        //     case 'localhost:4999':
        //         await tests('/tests/wallet.mjs','tests', obj)
        //         break
        //     case 'localhost:7030':
        //         await tests('/tests/wallet.mjs','tests', obj)
        //         break
        //     case 'localhost:8020':
        //         await tests('/tests/faucet.mjs','tests', obj)
        //         break
        //     case 'localhost:4060':
        //         await tests('/tests/game.mjs','tests', obj)
        //         break
        //     default:
        //         await tests('/tests/wallet.mjs','tests')
        //         console.warn('неизвестный источник', location)
        //         break
        // }
        // let fileTest =await fetch('/tests/game/monopoly.mjs')
        // fileTest = await fileTest.blob()
        // const objectURL = URL.createObjectURL(fileTest);
        // await mocha.addFile(objectURL);

        // console.assert(false, mocha)
        // console.assert(false, mocha)
       // let runs = mocha.run()
       // runs.on('end', function (test) {
       //     console.log('##########################', test)
       //  });
       //  runs.on('error', function (test) {
       //      console.log('##########################eeee', test)
       //
       //  });
    })
}