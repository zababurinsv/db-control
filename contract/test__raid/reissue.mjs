const seed = 'hire cart mushroom transfer twelve frog three garbage title nephew attitude stuff'
console.log('issue address:', address(seed))

it('re-issue coupon smart token', async function(){
    const tokenParams = {
        quantity: 100,
        assetId:"3EqCg8e21CcN39zsgmjkkU27QUEG6ee2ZuVS2EydBspf",
        reissuable:true,
    };
    const signedIssueTx = reissue(tokenParams, seed);
    let tx = await broadcast(signedIssueTx);
    console.log('token', tx)
    await waitForTx(tx.id)
    console.log('token id:', tx.id)
})