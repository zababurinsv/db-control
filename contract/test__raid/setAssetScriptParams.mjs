const seed = 'hire cart mushroom transfer twelve frog three garbage title nephew attitude stuff'
console.log('issue address:', address(seed))

it('set Asset-Script-Params', async function(){
    const assetScriptParams = {
        assetId:"EjtH2eHWtdp7YftHeyDyYJ5cH8obCQEVkj7nT9sLXik6",
        chainId: "T",
        script:"AwQAAAAERGF0YQkBAAAAB0FkZHJlc3MAAAABAQAAABoBVO3RY6wxhKIyY7/1LRanRPSnakDty1uHhgQAAAAKZW5hYmxlQnVybgkBAAAAB2V4dHJhY3QAAAABCQAEGwAAAAIFAAAABERhdGECAAAACmVuYWJsZUJ1cm4EAAAACW1pbkFtb3VudAkBAAAAB2V4dHJhY3QAAAABCQAEGgAAAAIFAAAABERhdGECAAAACW1pbkFtb3VudAQAAAAHJG1hdGNoMAUAAAACdHgDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAE0V4Y2hhbmdlVHJhbnNhY3Rpb24EAAAACGV4Y2hhbmdlBQAAAAckbWF0Y2gwBgb9sG/i",
        senderPublicKey: "4cgCZ4LmmQTEWhj5chfbQJzQC8nbdRMJiDArCSW13s4y",
        timestamp: Date.now(),
        fee: 100400000
    };
    const signedAssetScriptTx = setAssetScript(assetScriptParams, seed);
    let tx = await broadcast(signedAssetScriptTx);
    console.log('token', tx)
    await waitForTx(tx.id)
    console.log('token id:', tx.id)
})
