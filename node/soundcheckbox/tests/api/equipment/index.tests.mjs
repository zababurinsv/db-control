'use strict'
const assert = window['@newkind/tests'].assert;

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export default () => {
    describe(`Positive`, function() {
        this.timeout(3000);

        before(async () => {
            console.log('before');
        });

        after(async () => {
            console.log('after');
        });

        it('create rider', async () => {
            try {
                const data = await postData('http://localhost:4552/api/equipment', { answer: 42 })
                console.log('DATA', data);
                return  true;
            } catch (e) {
                console.log('ERROR', e);
                return false;
            }
        })

        it('authtorization', async () => {

        })
    })

    describe(`Negative`, function() {
        this.timeout(3000);

        before(async () => {
            console.log('before negative');
        });

        after(async () => {
            console.log('after negative');
        });

        it('login', async () => {

        })

        it('authtorization', async () => {

        })
    })
}
