export default(e,t,...o)=>new Promise(function(c,a){let n=e=>{console.log("~~~ err  ~~~",e),a(e)};switch(t){case"get":(async(e,a,r)=>{try{switch(console.log(`app(${t}[(${e.input})${e[a]}]property)`),e[a]){case"moderator":(async(e,t,o)=>{try{(e=>{console.log("~~~ out  ~~~"),c(e)})(e)}catch(e){n(e)}})(e,o[0],o[1],o[2],o[3]);break;default:n(`new type [(${t})${e[a]}]`)}}catch(e){n(e)}})(e,o[0],o[1],o[2],o[3]);break;default:n(`new function ${t}`)}});