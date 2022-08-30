function init (){
    // console.assert(false)
    fetch('/static/html/components/component_modules/lacerta-crypto/Exchange/v1/3533.json')
        .then(function(response) {
            console.assert(false, response)
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.json();
        })
        .then(function(json) {
            console.assert(false, json)
            colorLog('(~~~~(~~~(~~(~~~exchange V2~~~)~~)~~~)~~~~)','#3498DB  ',  json)


        })
        .catch(function(error) {

        });
    fetch('/static/html/components/component_modules/lacerta-crypto/Exchange/v1/CPf7EWE4hPrBNKJpzBtBm9os4UsyZ8Eebhzwq4EqLWqG.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.json();
        })
        .then(function(json) {

            colorLog('(~~~~(~~~(~~(~~~exchange V3~~~)~~)~~~)~~~~)','#3498DB  ',  json)


        })
        .catch(function(error) {

        });


    fetch('/static/html/components/component_modules/lacerta-crypto/Exchange/v2/28biMwpgZVjAUk5iJnWvphaFgr8Tybwqe6s5JxGTdDWJ.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.json();
        })
        .then(function(json) {

            colorLog('(~~~~(~~~(~~(~~~exchange V1~~~)~~)~~~)~~~~)','#3498DB  ',  json)


        })
        .catch(function(error) {

        });

    fetch('/static/html/components/component_modules/lacerta-crypto/Exchange/v2/469802.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.json();
        })
        .then(function(json) {

            colorLog('(~~~~(~~~(~~(~~~exchange V1~~~)~~)~~~)~~~~)','#3498DB  ',  json)


        })
        .catch(function(error) {

        });
}

export default {
    init: obj => { return init() }
}

