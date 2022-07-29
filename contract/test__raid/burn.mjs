const seed = 'hire cart mushroom transfer twelve frog three garbage title nephew attitude stuff'
console.log('issue address:', address(seed))

it('burn custom token', async function(){
    const burnCustomtokenParams = {
        quantity: 10,
        assetId:"3EqCg8e21CcN39zsgmjkkU27QUEG6ee2ZuVS2EydBspf",
        reissuable:true,
    };
    const signedIssueTx = burn(burnCustomtokenParams, seed);
    let tx = await broadcast(signedIssueTx);
    console.log('token', tx)
    await waitForTx(tx.id)
    console.log('token id:', tx.id)
})