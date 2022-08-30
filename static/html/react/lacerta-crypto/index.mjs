import componentApp from './App.js';

export default  (obj) => {
    return new Promise(function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {
            const mountPoint = document.createElement('div')
            let App = await componentApp('App')
            let Component = config['Component']
            let retargetEvents =  config['retargetEvents']
            let ReactDOM = config['ReactDOM']
            let React = config['React']

            window.wc = {
                "stringToUint8Array": stringToUint8Array,
                "sha256": sha256,
                "base58encode": base58encode
            };
            window.wt = {
                "nodeInteraction": nodeInteraction,
                "invokeScript": invokeScript,
                "broadcast": broadcast,
                "waitForTx": waitForTx
            };

            let dappaddress = '3N5HzCuVFaprA1w6eo9MdFmkCG77foHZu6a';
            let baseUri = 'https://testnodes.wavesnodes.com';
            nodeInteraction.accountData(dappaddress, baseUri).then((v) => {
                window.dAppData = v;
                if (v) {
                    window.dAppDataKeys = Object.keys(v);
                    // console.log("dApp Account data:");
                    // console.log(v);
                    console.log(JSON.stringify(v));
                }
            });

            const authData = { data: "Auth on my 'Coupon Bazaar' site" };
            if (WavesKeeper) {
                WavesKeeper.initialPromise
                    .then((keeperApi) => {
                        /*...init app*/
                        keeperApi.publicState().then(state => {
                            // console.log("Waves Keeper data:"); //displaying the result in the console
                            // console.log(state); //displaying the result in the console
                            /*...processing data */
                        }).catch(error => {
                            console.error(error); // displaying the result in the console
                            /*...processing errors */
                            WavesKeeper.auth( authData )
                                .then(auth => {
                                    // console.log( auth ); //displaying the result on the console
                                    /*...processing data */
                                }).catch(error => {
                                console.error( error ); // displaying the result on the console
                                /*...processing errors */
                            })
                        })
                    })
            } else {
                alert("To Auth WavesKeeper should be installed.");
            }




            let index = config['babel']['transform'](`
                 ${App}
                 retargetEvents(mountPoint)
                 ReactDOM.render(
                 <ThemeProvider theme={theme}>
                    <>
                        <GlobalStyle />
                        <App />
                    </>
                </ThemeProvider>, 
                 ,mountPoint);
             `,config['babel']['availablePresets']['react'])


            eval(index.code)
            resolve(mountPoint)
        })})}