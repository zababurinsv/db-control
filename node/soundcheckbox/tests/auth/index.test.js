'use strict'
const assert = window['@newkind/tests'].assert;

export default () => {
    describe(`Positive`, function() {
        this.timeout(3000);

        before(async () => {
            console.log('before');
        });

        after(async () => {
            console.log('after');
        });

        it('login', async () => {

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
