const seed = 'hire cart mushroom transfer twelve frog three garbage title nephew attitude stuff'
console.log('issue address:', address(seed))

it('custom currency tokken', async function(){
    const tokenParamsCustomCurrency = {
        name: "lane-auction",
        quantity: 1000000,
        decimals: 0,
        reissuable:true,
        description:"Token for books"
    };
    const signedIssueTx = issue(tokenParamsCustomCurrency, seed);
    let tx = await broadcast(signedIssueTx);
    await waitForTx(tx.id)
    console.log('token id:', tx.id)
})