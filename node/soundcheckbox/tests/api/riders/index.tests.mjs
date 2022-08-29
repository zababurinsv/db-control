'use strict'
const assert = window['@newkind/tests'].assert;
import req from '/modules/fetch/index.mjs';
// Example POST method implementation:


export default () => {
    describe(`Positive`, function() {
        this.timeout(10000);

        before(async () => {
            console.log('before');
        });

        after(async () => {
            console.log('after');
        });

        it.skip('create rider', async () => {
            try {
                const data = await req.post('http://localhost:4552/api/riders', { answer: 42 })
                console.log('DATA', data);
                return  true;
            } catch (e) {
                console.log('ERROR', e);
                return false;
            }
        })

        it('get rider', async () => {
            try {
                const data = await req.get('http://localhost:4552/api/riders')
                console.log('DATA', data);
                return  true;
            } catch (e) {
                console.log('ERROR', e);
                return false;
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
