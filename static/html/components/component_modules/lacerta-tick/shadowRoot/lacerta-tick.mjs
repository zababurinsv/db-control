function tickPromiseShadow(t,e,o,_,n){return t[`${t.idt}`].tick[e]||(t[`${t.idt}`].tick[e]=0),o=t[`${t.idt}`].tick[e],new Promise(function(c,a){if("xxxx"!==e)if(0===o&&0!==_)t0=performance.now(),t2=performance.now(),console.log("_-_-_-_-_-shadow-_-_-_-_-_","type:",e,"state: 0","count:",o,"count:",o,":",t0,"= 0 :ms");else if(1===o)t1=performance.now(),t1-=t0,console.log("_-_-_-_-_-shadow-_-_-_-_-_","type:",e,"state: 1","count:",o,"count:",o,":",t1,":ms"),console.assert(!0,`\n\n\n                время => ${t1} ${t2}\n\n\n\n                `);else if(2===o)t2=(t2=performance.now())-t0-t1,console.log("_-_-_-_-_-shadow-_-_-_-_-_","type:",e,"count:",o,"count:",o,t2,":ms"),console.assert(!0,`\n\n\n                время => ${t1} ${t2} ${t0}\n\n\n\n                `);else if(o===_)if(n&&"default"!==n){t4=t3+t1+t2+t0;let _=(t3=performance.now())-t0;t3-=t4,t.tick.data={},t.tick.data[e]={},t.tick.data[e].type=e,t.tick.data[e].count=o,t.tick.data[e].time=t3,t.tick.data[e].preset=n,t.tick.data[e].all=_,t.tick.data.type=e,console.log("",t.tick.data),t.editor.tick[e]++,c(t)}else{t4=t3+t1+t2+t0,t3=performance.now(),0===_&&(t0=t3);let n=t3+t1+t2;t3-=t4,c(console.assert(!1,"_-_-_-_-_-shadow-_-_-_-_-_","type:",e,";count:",o,";time:",t3,";:ms","All Time",n,"ms",styles[3]`
                          _______
                           {___}
                           /   \\
                          |     |
                        ^{0}^|^{0}^
                          |     |
                          |-----|
                          |-----|
        ${t}-------------     ---------------${o}
                        |_________|
            `))}else{t4=t3+t1+t2+t0,t3=performance.now();let _=(t3-=t4)+t1+t2;t.editor.tick[e]++,console.log("_-_-_-_-_-shadow-_-_-_-_-_","type:",e,"count:",o,"time:",t3,":ms","All Time",_,"ms")}else console.assert(!1,"tickPromise неизвестный тип",t,e,_)})}let t0=0,t1=0,t2=0,t3=0,t4=0,styles=["background: red","background: orange","background: gold","background: yellowgreen","background: skyblue","background: steelblue","background: darkviolet"];export default tickPromiseShadow;