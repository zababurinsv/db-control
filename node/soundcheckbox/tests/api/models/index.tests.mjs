'use strict'
const assert = window['@newkind/tests'].assert;
const expect = window['@newkind/tests'].expect;

import req from '/modules/request/index.mjs';
// Example POST method implementation:


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
                const data = await req.post('http://localhost:4552/api/models', { answer: 42 })
                console.log('DATA', data);
                return  true;
            } catch (e) {
                console.log('ERROR', e);
                return false;
            }
        })

        it('get models', async () => {
            try {
                const data = await req.get('http://localhost:4552/api/models');
                console.log('DATA', data);
                return  true;
            } catch (error) {
                expect(error).to.be.an('Error')
                // expect(e.status).to.be(true);
                // return Promise.reject(new Error(e));
                // expect(() => e.status === false).to.throw('Oh no');
                // console.log(e);
                // assert(false);
            }
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
