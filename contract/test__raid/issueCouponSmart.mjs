const seed = 'rapid pioneer moment glide physical verb island silver ordinary mad cradle crop'
console.log('issue address:', address(seed))

it('issue coupon smart token', async function(){
    const tokenParams = {
        name:"my bazar coupon",
        quantity: 100,
        decimals: 0,
        reissuable: true,
        script: compile(file('token.ride')),
        description:'example coupon'
    };
    const signedIssueTx = issue(tokenParams, seed);
    let tx = await broadcast(signedIssueTx);
    await waitForTx(tx.id)
    console.log('token id:', tx.id)
})
