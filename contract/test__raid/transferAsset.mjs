const seed = 'hire cart mushroom transfer twelve frog three garbage title nephew attitude stuff'

it('transfer custom token', async function(){
    let transferCustomTokenParams = {
        assetId: 'DKu7YW7NzQwTGqcRgaeTMoDjXNcoYHgm7BERU9gVSoGA',
        recipient: '3MyrRRPwQaf94YdZnwAHE7QxBp1sRRiH9zd',
        amount: 3

    }
    const signedIssueTx = transfer(transferCustomTokenParams, seed)
    let tx = await broadcast(signedIssueTx)
    await waitForTx(tx.id)
    console.log(JSON.stringify(tx))
})