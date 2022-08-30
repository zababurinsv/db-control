customElements.define("telegram-sidebar-right-top",class extends HTMLElement{static get observedAttributes(){return["elWidth","elHeight","cursorTop","cursorLeft"]}constructor(){super();let t=[],e=[],l=[],n=[];function i(t,e,l){return new Promise(function(e,l){t["template-shadow"]=[],t["template-light"]=[];let n=[];n.swap=!1,n.external=!1,n.light=!1,n.slider=!1,n.one=!1;for(let e=0;e<t.type.length;e++){if(-1!==t.type[e].indexOf("slider")&&t.type[e].split("-").length>1){n.slider=!0;for(let l in t.type[e].split("-"))switch(t.type[e].split("-")[l]){case"one":n.one=!0}}if(t.type[e].length)switch(t.type[e]){case"swap":n.swap=!0;break;case"external":n.external=!0;break;case"light":n.light=!0;break;case"slider":n.slider=!0}}if(!0===n.swap){for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-light"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),r(t.this.children[e]),t["template-light"].push(t.this.children[e])):(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),r(t.this.children[e]),t["template-shadow"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-light"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),r(t.template.children[e]),t["template-light"].push(t.template.children[e])):(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),r(t.template.children[e]),t["template-shadow"].push(t.template.children[e]))}else{for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-shadow"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(r(t.this.children[e]),t["template-shadow"].push(t.this.children[e])):(r(t.this.children[e]),t["template-light"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-shadow"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(r(t.template.children[e]),t["template-shadow"].push(t.template.children[e])):(r(t.template.children[e]),t["template-light"].push(t.template.children[e]))}t.verify=n,!0===t.verify.slider?function(t){return new Promise(function(e,l){fetch(`/static/html/components/varan-slider/template/${t.slot}.html`).then(function(t){if(t.ok)return t.text()}).then(function(l){let n=new DOMParser,i=n.parseFromString(l,"text/html");t.slider=i.getElementsByTagName("template")[0].content.cloneNode(!0);let s=document.createElement("section");s.className="slider",s.slot="view",s.appendChild(t.slider),t.slider=s,e(t)}).catch(t=>t)})}(t).then(t=>{t["template-light"].push(t.slider),t.this.appendChild(t.slider),function(t,e,l){return new Promise(function(l,n){if(e){switch(e){case"slider":(function(t,e){return new Promise(function(l,n){for(let n=0;n<t.state.length;n++)for(let i=0;i<t[`template-${t.state[n]}`].length;i++)0===t[`template-${t.state[n]}`][i].getElementsByClassName(e).length||(t.slider=t[`template-${t.state[n]}`][i].getElementsByClassName(e)[0],l(t[`template-${t.state[n]}`][i].getElementsByClassName(e)[0]))})})(t,"peppermint").then(e=>{(function(t){return new Promise(function(e,l){e(Peppermint(t,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(t){}}))})})(e).then(e=>{t.slider=e,l(t)})})}l(t)}else l(t)})}(t,"slider").then(t=>{if(!0===t.verify.one)for(let l=0;l<t.state.length;l++)for(let n=0;n<t[`template-${t.state[l]}`].length;n++)"wall"===t[`template-${t.state[l]}`][n].className&&(t[`template-${t.state[l]}`].splice(n,1),e(t));else e(t)})}):e(t)})}function s(e,l){return new Promise(function(l,n){e["path-template"]=`/static/html/components/${e.component}/${e.component}.html`,fetch(e["path-template"]).then(function(t){if(t.ok)return t.text()}).then(function(n){let s=(new DOMParser).parseFromString(n,"text/html");e.template=s.getElementsByTagName("template")[0].content.cloneNode(!0),function(e){return new Promise(function(l,n){e["path-external"]=`/static/html/components/${e.component}/external/${e.component}-external.html`,fetch(e["path-external"]).then(function(t){return!1===t.ok?t.ok:t.text()}).then(function(n){if(!1===n);else{let i=new DOMParser,s=i.parseFromString(n,"text/html");e.external=s.querySelectorAll("section"),function(e){return new Promise(function(l,n){e["external-property"]=t["external-property"];let i=[],s=[],r=[];for(let t=0;t<e.external.length;t++){for(let l=0;l<e.external[t].children.length;l++)switch(e.external[t].children[l].tagName){case"SCRIPT":e.external[t].getAttribute("id")&&(s.script=e.external[t].children[l]);break;case"COMPONENT-ID":s.id=e.external[t].children[l].innerText;break;case"COMPONENT-ACTION":for(let n=0;n<e.external[t].children[l].children.length;n++)r.push(e.external[t].children[l].children[n].innerText);s.actions=r}i.push(s),s=[]}e["external-property"]=i,l(e)}).catch(t=>{})}(e).then(t=>{0===t["external-property"].length?l(t):function(t){return new Promise(function(e,l){t["words-action"]=[];let n=[];for(let l=0;l<t["external-property"].length;l++){for(let e=0;e<t["external-property"][l].actions.length;e++)for(let i=0;i<t.words.length;i++)-1!==t["external-property"][l].actions[e].indexOf(t.words[i])&&("shadowRoot"!==t.words[i]&&"shadow"!==t.words[e]||(n.shadow=!0),"light"!==t.words[i]&&"лайт"!==t.words[e]||(n.light=!0),"editor"===t.words[i]&&(n.editor=!0),"слайдер"===t.words[i]&&(n["editor-slider"]=!0),"swap"===t.words[i]&&(n.swap=!0));t["words-action"]=n;for(let e in t["external-property"])for(let l in t["external-property"][e])switch(l){case"id":let n=document.createElement(t["external-property"][e][l]);n.setAttribute("type","external"),t.this.appendChild(n)}e(t)}})}(t).then(t=>{l(t)})})}}).catch(t=>{throw t})})}(e).then(t=>{i(t,t["type-swap"],t["type-external"]).then(t=>{if(!0===t.verify.swap){if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e=0;e<t["template-shadow"].length;e++)t.this.shadowRoot.appendChild(t["template-shadow"][e])}if(0!==t["template-light"].length)for(let e=0;e<t["template-light"].length;e++)t.this.appendChild(t["template-light"][e])}else{if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e in t["template-shadow"])t.this.shadowRoot.appendChild(t["template-shadow"][e])}if(0!==t["template-light"].length)for(let e in t["template-light"])t.this.appendChild(t["template-light"][e])}l(t)})})}).catch(t=>t)})}function r(t){return new Promise(function(e,l){t.getAttribute("import");const n=document.createElement("script");let i=!1;for(let e in document.head.getElementsByTagName("script"))"object"==typeof document.head.getElementsByTagName("script")[e]&&-1!==document.head.getElementsByTagName("script")[e].outerHTML.indexOf(t.tagName.toLowerCase())&&(i=!0);!0===i||(n.type="module",n.src=`/static/html/components/${t.tagName.toLowerCase()}/${t.tagName.toLowerCase()}.mjs`,n.onload=e,n.onerror=l,document.head.appendChild(n))})}var a;e.push("component-id"),e.push("script"),e.push("component-action"),l.push("h1"),l.push("innerText"),n.push("shadowRoot"),n.push("head"),n.push("shadow"),n.push("light"),n.push("lightDom"),n.push("editor"),n.push("слайдер"),n.push("swap"),t.this=this,t["type-supported"]=l,(a=this,new Promise(function(t,e){let l=[];l.indexeddb=null,l.firebase=null,l.localStorage=null,l.mongo=null,l.mySql=null,l.state=[],l.state.push("shadow"),l.state.push("light"),l.words=n,l["type-swap"]=!1,l["type-external"]=!1,l["document-offsetWidth"]=document.body.offsetWidth;let i=!1;if(l.getAttribute=((t,e,l)=>{if("template"===l){if(!t.getAttribute("type"))return t.setAttribute("type","default"),!1;for(let l=0;l<t.getAttribute("type").split("-").length;l++)t.getAttribute("type").split("-")[l]===e&&(i=!0);return i}if(t[`verify-${e}`]=!1,0===t.this.getAttribute("type").split("-").length)return!1;for(let l=0;l<t.this.getAttribute("type").split("-").length;l++)t.this.getAttribute("type").split("-")[l]===e?t[`verify-${e}`]=!0:t[`verify-${e}`]=!1;return t[`verify-${e}`]}),a.tagName.toLowerCase()&&(l.component=a.tagName.toLowerCase()),"object"!=typeof a);else{if(a.getAttribute("type")){l.type=a.getAttribute("type").split("-");for(let t=0;t<l.type.length;t++)l.type[t]=l.type[t].replace(/:/g,"-");for(let t in l.type)switch(l.type[t]){case"swap":l["type-swap"]=!0;break;case"external":l["type-external"]=!0}}else l.type=["default"],a.setAttribute("type","default");if(a.slot?l.slot=a.slot:(a.slot=a.tagName.toLowerCase(),l.slot=a.slot),a.getAttribute("type")){let t=!1;for(let e in a.getAttribute("type").split("-"))-1!==a.getAttribute("type").split("-")[e].indexOf("style:")&&(t=!0);l["style-custom"]=!0===t?"not-default":"default"}}l.shadowRoot=!1,l.this=a,t(l)})).then(t=>(s(t).then(t=>(function(t){return new Promise(function(e,l){let n=document.createElement("style"),i=document.createElement("style");for(let e=0;e<t.type.length;e++)"swap"===t.type[e]?"scoped"===t.type[e]&&n.setAttribute("scoped",""):"scoped"===t.type[e]&&i.setAttribute("scoped","");for(let l=0;l<t.state.length;l++){switch(t[`path-style-${t.state[l]}`]=`@import '/static/html/components/${t.component}/${t.state[l]}/${t.component}.css'; @import '/static/html/components/${t.component}/${t.state[l]}/${t.component}-custom.css';`,t.state[l]){case"shadow":n.innerText=t[`path-style-${t.state[l]}`];break;case"light":i.innerText=t[`path-style-${t.state[l]}`]}"swap"===t.state[l]?!0===t.shadowRoot?(t.this.shadowRoot.appendChild(i),t.this.appendChild(n),e(t)):t.this.appendChild(n):!0===t.shadowRoot?(t.this.shadowRoot.appendChild(n),t.this.appendChild(i),e(t)):t.this.appendChild(i)}e(t)})}(t).then(t=>(async function(t){}(),t)),t)),t))}attributeChangedCallback(t,e,l){this.disabled?(this.setAttribute("tabindex","-1"),this.setAttribute("aria-disabled","true")):(this.setAttribute("tabindex","0"),this.setAttribute("aria-disabled","false"))}});