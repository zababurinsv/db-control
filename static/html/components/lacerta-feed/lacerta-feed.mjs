import action from"/static/html/components/component_modules/action/action.mjs";customElements.define("lacerta-feed",class extends HTMLElement{constructor(){super();let e=[],t=[],s=[],l=[];function n(e){return new Promise(function(t,s){let l=document.createElement("style"),n=document.createElement("style");for(let t=0;t<e.type.length;t++)"swap"===e.type[t]?"scoped"===e.type[t]&&l.setAttribute("scoped",""):"scoped"===e.type[t]&&n.setAttribute("scoped","");for(let s=0;s<e.state.length;s++){switch(e[`path-style-${e.state[s]}`]=`@import '/static/html/components/${e.component}/${e.state[s]}/${e.component}.css'; @import '/static/html/components/${e.component}/${e.state[s]}/${e.component}-custom.css';`,e.state[s]){case"shadow":!0===e.verify.preset&&(e[`path-style-${e.state[s]}-preset`]=`@import '/static/html/components/${e.component}/template/${e.preset}/${e.component}-${e.preset}.css';`),l.innerText=e[`path-style-${e.state[s]}`]+e[`path-style-${e.state[s]}-preset`];break;case"light":!0===e.verify.preset&&(e[`path-style-${e.state[s]}-preset`]=`@import '/static/html/components/${e.component}/template/${e.preset}/${e.component}-${e.preset}.css';`),n.innerText=e[`path-style-${e.state[s]}`]+e[`path-style-${e.state[s]}-preset`]}"swap"===e.state[s]?!0===e.shadowRoot?(e.this.shadowRoot.appendChild(n),e.this.appendChild(l),t(e)):e.this.appendChild(l):!0===e.shadowRoot?(e.this.shadowRoot.appendChild(l),e.this.appendChild(n),t(e)):e.this.appendChild(n)}t(e)})}function r(e,t,s){return new Promise(function(t,s){e["template-shadow"]=[],e["template-light"]=[];let l=[];l.swap=!1,l.external=!1,l.light=!1,l.slider=!1,l.one=!1,l.sliderText=!1,l.text=!1;for(let t=0;t<e.type.length;t++){if(-1!==e.type[t].indexOf("slider")&&e.type[t].split("-").length>1){l.slider=!0;for(let s in e.type[t].split("-"))switch(e.type[t].split("-")[s]){case"one":l.one=!0}}if(e.type[t].length)switch(e.type[t]){case"swap":l.swap=!0;break;case"external":l.external=!0;break;case"light":l.light=!0;break;case"slider":l.slider=!0;break;case"sliderText":l.sliderText=!0;break;case"text":l.text=!0}}if(!0===l.swap){for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-light"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),console.log("ssssssssssssss11111111"),a(e.this.children[t]),e["template-light"].push(e.this.children[t])):(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),console.log("ssssssssssssss222222222"),a(e.this.children[t]),console.log("3333333333",e.this.children[t]),e["template-shadow"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-light"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),console.log("ssssssssssssss333333333"),a(e.template.children[t]),e["template-light"].push(e.template.children[t])):(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),console.log("ssssssssssssss4444444444"),a(e.template.children[t]),console.log("333333444443333",e.this.children[t]),e["template-shadow"].push(e.template.children[t]))}else{for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-shadow"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(console.log("ssssssssssssss555555555"),a(e.this.children[t]),e["template-shadow"].push(e.this.children[t]),console.log("33333344555554443333",e.this.children[t])):(console.log("ssssssssssssss666666666666"),a(e.this.children[t]),e["template-light"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),"SCRIPT"===e.template.children[t].tagName?(e["template-head"]=[],e["template-head"].push(e.template.children[t]),colorLog("<varan-rss>obj['template-head']</varan-rss>",e.template.children[t])):e["template-shadow"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(console.log("ssssssssssssss7777777777777"),a(e.template.children[t]),console.log("333333445777777888887755554443333",e.this.children[t]),e["template-shadow"].push(e.template.children[t])):(console.log("ssssssssssssss888888888888888"),a(e.template.children[t]),e["template-light"].push(e.template.children[t]))}for(let t in l)e.verify[t]=l[t];!0===e.verify.slider?function(e){return new Promise(function(t,s){fetch(`/static/html/components/varan-slider/template/${e.slot}.html`).then(function(e){if(e.ok)return e.text()}).then(function(t){let s=new DOMParser,l=s.parseFromString(t,"text/html");e.slider=l.getElementsByTagName("template")[0].content.cloneNode(!0);let n=document.createElement("section");n.className="slider",n.slot="view",n.appendChild(e.slider),e.slider=n,e["slider-template"]=n,e.verify.sliderText=!1;for(let t=0;t<e.type.length;t++)"slider-one-text"===e.type[t]&&(e.verify.sliderText=!0)}).catch(e=>e)})}(e).then(e=>{e["template-light"].push(e.slider),e.this.appendChild(e.slider),function(e,t){return new Promise(function(s,l){if(t){switch(t){case"slider":(function(e,t){return new Promise(function(s,l){for(let l=0;l<e.state.length;l++)for(let n=0;n<e[`template-${e.state[l]}`].length;n++)0===e[`template-${e.state[l]}`][n].getElementsByClassName(t).length||(e.slider=e[`template-${e.state[l]}`][n].getElementsByClassName(t)[0],s(e[`template-${e.state[l]}`][n].getElementsByClassName(t)[0]))})})(e,"peppermint").then(t=>{(function(e){return new Promise(function(t,s){t(Peppermint(e,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(e){}}))})})(t).then(t=>{e.slider=t,s(e)})})}s(e)}else s(e)})}(e,"slider").then(e=>{if(!0===e.verify.one)for(let s=0;s<e.state.length;s++)for(let l=0;l<e[`template-${e.state[s]}`].length;l++)"wall"===e[`template-${e.state[s]}`][l].className&&(e[`template-${e.state[s]}`].splice(l,1),t(e));else t(e)})}):t(e)})}function i(t,s){return new Promise(function(s,l){t.verify=[],t.this.hasAttribute("preset")?(t["path-template"]=`/static/html/components/${t.component}/template/${t.this.getAttribute("preset")}.html`,t.preset=`${t.this.getAttribute("preset")}`,t.verify.preset=!0):(t["path-template"]=`/static/html/components/${t.component}/${t.component}.html`,t.verify.preset=!1),fetch(t["path-template"]).then(function(e){if(e.ok)return e.text()}).then(function(l){let n=(new DOMParser).parseFromString(l,"text/html");t.template=n.getElementsByTagName("template")[0].content.cloneNode(!0),function(t){return new Promise(function(s,l){t["path-external"]=`/static/html/components/${t.component}/external/${t.component}-external.html`,fetch(t["path-external"]).then(function(e){return!1===e.ok?e.ok:e.text()}).then(function(l){if(!1===l);else{let n=new DOMParser,r=n.parseFromString(l,"text/html");t.external=r.querySelectorAll("section"),function(t){return new Promise(function(s,l){t["external-property"]=e["external-property"];let n=[],r=[],i=[];for(let e=0;e<t.external.length;e++){for(let s=0;s<t.external[e].children.length;s++)switch(t.external[e].children[s].tagName){case"SCRIPT":t.external[e].getAttribute("id")&&(r.script=t.external[e].children[s]);break;case"COMPONENT-ID":r.id=t.external[e].children[s].innerText;break;case"COMPONENT-ACTION":for(let l=0;l<t.external[e].children[s].children.length;l++)i.push(t.external[e].children[s].children[l].innerText);r.actions=i}n.push(r),r=[]}t["external-property"]=n,s(t)}).catch(e=>{})}(t).then(e=>{0===e["external-property"].length?s(e):function(e){return new Promise(function(t,s){e["words-action"]=[];let l=[];for(let s=0;s<e["external-property"].length;s++){for(let t=0;t<e["external-property"][s].actions.length;t++)for(let n=0;n<e.words.length;n++)-1!==e["external-property"][s].actions[t].indexOf(e.words[n])&&("shadowRoot"!==e.words[n]&&"shadow"!==e.words[t]||(l.shadow=!0),"light"!==e.words[n]&&"лайт"!==e.words[t]||(l.light=!0),"editor"===e.words[n]&&(l.editor=!0),"слайдер"===e.words[n]&&(l["editor-slider"]=!0),"swap"===e.words[n]&&(l.swap=!0));e["words-action"]=l;for(let t in e["external-property"])for(let s in e["external-property"][t])switch(s){case"id":let l=document.createElement(e["external-property"][t][s]);l.setAttribute("type","external"),e.this.appendChild(l)}t(e)}})}(e).then(e=>{s(e)})})}}).catch(e=>{throw e})})}(t).then(e=>{r(e,e["type-swap"],e["type-external"]).then(e=>{let t={};for(let s=0;s<e["template-light"].length;s++)"VARAN-MENU"===e["template-light"][s].tagName&&(t=e["template-light"].splice(s,1),e["template-light"].push(t[0]));if(!0===e.verify.swap){if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t=0;t<e["template-shadow"].length;t++)e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t=0;t<e["template-light"].length;t++)e.this.appendChild(e["template-light"][t]);console.assert(!0,e["template-head"])}else{if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t in e["template-shadow"])e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t in e["template-light"])e.this.appendChild(e["template-light"][t])}s(e)})})}).catch(e=>e)})}function a(e){return new Promise(function(t,s){const l=document.createElement("script");let n=!1;for(let t in document.head.getElementsByTagName("script"))"object"==typeof document.head.getElementsByTagName("script")[t]&&-1!==document.head.getElementsByTagName("script")[t].outerHTML.indexOf(e.tagName.toLowerCase())&&(n=!0);!0===n?colorLog("<varan-rss>script уже загружен</varan-rss>","yellow"):(l.src=`/static/html/components/${e.tagName.toLowerCase()}/${e.tagName.toLowerCase()}.mjs`,l.type="module",l.setAttribute("async",""),l.onload=t,l.onerror=s,document.head.appendChild(l))})}var o;t.push("component-id"),t.push("script"),t.push("component-action"),s.push("h1"),s.push("innerText"),l.push("shadowRoot"),l.push("head"),l.push("shadow"),l.push("light"),l.push("lightDom"),l.push("editor"),l.push("слайдер"),l.push("swap"),e.this=this,e["type-supported"]=s,(o=this,new Promise(function(e,t){let s=[];s.staticProperty=[],s.staticProperty.c=0,s.state=[],s.state.push("shadow"),s.state.push("light"),s.words=l,s["type-swap"]=!1,s["type-external"]=!1,s["document-offsetWidth"]=document.body.offsetWidth;let n=!1;if(s.getAttribute=((e,t,s)=>{if("template"===s){if(!e.getAttribute("type"))return e.setAttribute("type","default"),!1;for(let s=0;s<e.getAttribute("type").split("-").length;s++)e.getAttribute("type").split("-")[s]===t&&(n=!0);return n}if(e[`verify-${t}`]=!1,0===e.this.getAttribute("type").split("-").length)return!1;for(let s=0;s<e.this.getAttribute("type").split("-").length;s++)e.this.getAttribute("type").split("-")[s]===t?e[`verify-${t}`]=!0:e[`verify-${t}`]=!1;return e[`verify-${t}`]}),o.tagName.toLowerCase()&&(s.component=o.tagName.toLowerCase()),"object"!=typeof o);else{if(o.getAttribute("type")){s.type=o.getAttribute("type").split("-");for(let e=0;e<s.type.length;e++)s.type[e]=s.type[e].replace(/:/g,"-");for(let e in s.type)switch(s.type[e]){case"swap":s["type-swap"]=!0;break;case"external":s["type-external"]=!0}}else s.type=["default"],o.setAttribute("type","default");if(o.slot?s.slot=o.slot:(o.slot=o.tagName.toLowerCase(),s.slot=o.slot),o.getAttribute("type")){let e=!1;for(let t in o.getAttribute("type").split("-"))-1!==o.getAttribute("type").split("-")[t].indexOf("style:")&&(e=!0);s["style-custom"]=!0===e?"not-default":"default"}}o.hasAttribute("parent")?s.parent=o.getAttribute("parent"):console.warn("нет родительского элемента parent"),s.shadowRoot=!1,s.this=o,e(s)})).then(e=>{i(e).then(e=>{n(e).then(e=>{!async function(e){await action({input:"lacerta-feed",this:e.this,type:"store"},"set","type");let t=await action({input:"lacerta-feed",type:"feeds"},"get","type"),s=document.createElement("pre");if(0===t.mongo.length)s.innerText="нет каналов",e.this.shadowRoot.appendChild(s);else{n="word-wrap: break-word; white-space: pre-wrap;",s.style.wordWrap,s.innerText=t.mongo[0].feed.rss,s.innerText=s.innerText.replace(/<!\[CDATA\[(.*)\]\]>/g,"$1"),e.this.shadowRoot.appendChild(s)}}(e)})})})}});