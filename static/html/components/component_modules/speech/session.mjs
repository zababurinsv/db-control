export default{set:async(e,t,...s)=>new Promise(async(t,s)=>{switch(e.type){case"item":((e,s,a)=>{(e=>{t(e)})(sessionStorage.setItem(e.key,e.value))})(e);break;default:(e=>{s(e)})(`новая функция ${e.type} `)}}),get:async(e,t,...s)=>new Promise(async(t,s)=>{let a=e=>{t(e)};switch(e.type){case"item":((e,t,s)=>{a(sessionStorage.getItem(e.key))})(e);break;case"all":((e,t,s)=>{let y=Object.keys(sessionStorage),n=[];for(let e=0;e<y.length;e++)y[e].split("_").length>1||n.push(JSON.parse(sessionStorage.getItem(y[e])));a(n)})();break;default:(e=>{s(e)})(`новая функция ${e.type} `)}}),put:async(e,t,...s)=>new Promise(async(t,s)=>{switch(e.type){case"getAll":break;default:(e=>{s(e)})(`новая функция ${e.type} `)}}),delete:async(e,t,...s)=>new Promise(async(t,s)=>{switch(e.type){case"item":((e,s,a)=>{(e=>{t(e)})(sessionStorage.removeItem(e.key))})(e);break;default:(e=>{s(e)})(`новая функция ${e.type} `)}})};