import head from '/static/html/components/crypto-dex/external/assets/head.mjs'
export default (v,p,c,s,r)=> {
  return new Promise(function (resolve, reject) {
    try {
      let orders = Symbol("id");
      let object = {
        "head": head,
        "S": {
          "f":  "WAVES",
          "s": "DUk2YTxhRoAqMJLus4G2b3fR8hMHVh6eiyFx5r29VR6t",
          "t":  "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p"
        },
        "W": {
          "f":  "WAVES",
          "s": "DUk2YTxhRoAqMJLus4G2b3fR8hMHVh6eiyFx5r29VR6t",
          "t":  "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p"
        },
        "T": {
          "f": "WAVES",
          "s":"E39SjE8Lj2yxJn3HswVJQvCnZ2oH4GEXrm5u2fTXuZqj",
          "t": "25FEqEjRkqK6yCkiT7Lz6SAYz7gUFCtxfCChnrVFD5AT"
        },
        "orders": {
          "ffs": [{"buy(fs)": {
              "amount": {
                "f":"",
                "s":""
              },
              "price":  ""
            }}, {"sell(ft)":{
              "amount": {
                "f":"",
                "t":""
              },
              "price":  ""
            }}, {"buy(st)":{
              "amount": {
                "s":"",
                "t":""
              },
              "price":  ""
            }}],
          "fft": [{"buy(ft)": {
              "amount": {
                "f":"",
                "t":""
              },
              "price":  ""
            }},{"sell(fs)":{
              "amount": {
                "f":"",
                "s":""
              },
              "price":  ""
            }},{"buy(ts)":{
              "amount": {
                "t":"",
                "s":""
              },
              "price":  ""
            }}],
          "ssf": [{"buy(sf)": {
              "amount": {
                "s":"",
                "f":""
              },
              "price":  ""
            }},{"sell(st)":{
              "amount": {
                "s":"",
                "t":""
              },
              "price":  ""
            }},{"buy(ft)":{
              "amount": {
                "f":"",
                "t":""
              },
              "price":  ""
            }}],
          "ttf": [{"buy(tf)": {
              "amount": {
                "t":"",
                "f":""
              },
              "price":  ""
            }},{"sell(ts)":{
              "amount": {
                "t":"",
                "s":""
              },
              "price":  ""
            }},{"buy(fs)":{
              "amount": {
                "f":"",
                "s":""
              },
              "price":  ""
            }}]
        }
      }
      resolve({
        status: 'ok',
        success: true,
        message: object,
        _scriptDir: import.meta.url
      })
    }catch (e) {
      resolve({
        status: 'ok',
        success: false,
        message: e,
        _scriptDir: import.meta.url
      })
    }
  })
}