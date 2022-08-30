import store from"/static/html/components/component_modules/staticProperty/staticProperty.mjs";import matcher from"/static/html/components/component_modules/matcher/matcher.mjs";customElements.define("ton-client",class extends HTMLElement{static get observedAttributes(){return["feed"]}constructor(){super();let t=[],e=[],s=[],r=[];function l(e,s){return new Promise(function(s,r){if(e.verify=[],e.this.getAttribute("preset"))switch(e.this.getAttribute("preset")){case"default":e["path-template"]=`/static/html/components/${e.component}/template/${e.component}.html`,e.preset=`${e.this.getAttribute("preset")}`,e.verify.preset=!0;break;default:e["path-template"]=`/static/html/components/${e.component}/template/${e.this.getAttribute("preset")}.html`,e.preset=`${e.this.getAttribute("preset")}`,e.verify.preset=!0}else e["path-template"]=`/static/html/components/${e.component}/${e.component}.html`,e.verify.preset=!1;fetch(e["path-template"]).then(function(t){if(t.ok)return t.text()}).then(function(r){let l=(new DOMParser).parseFromString(r,"text/html");e.template=l.getElementsByTagName("template")[0].content.cloneNode(!0),function(e){return new Promise(function(s,r){e["path-external"]=`/static/html/components/${e.component}/external/${e.component}-external.html`,fetch(e["path-external"]).then(function(t){return!1===t.ok?t.ok:t.text()}).then(function(r){if(!1===r);else{let l=new DOMParser,o=l.parseFromString(r,"text/html");e.external=o.querySelectorAll("section"),function(e){return new Promise(function(s,r){e["external-property"]=t["external-property"];let l=[],o=[],n=[];for(let t=0;t<e.external.length;t++){for(let s=0;s<e.external[t].children.length;s++)switch(e.external[t].children[s].tagName){case"SCRIPT":e.external[t].getAttribute("id")&&(o.script=e.external[t].children[s]);break;case"COMPONENT-ID":o.id=e.external[t].children[s].innerText;break;case"COMPONENT-ACTION":for(let r=0;r<e.external[t].children[s].children.length;r++)n.push(e.external[t].children[s].children[r].innerText);o.actions=n}l.push(o),o=[]}e["external-property"]=l,s(e)}).catch(t=>{})}(e).then(t=>{0===t["external-property"].length?s(t):function(t){return new Promise(function(e,s){t["words-action"]=[];let r=[];for(let s=0;s<t["external-property"].length;s++){for(let e=0;e<t["external-property"][s].actions.length;e++)for(let l=0;l<t.words.length;l++)-1!==t["external-property"][s].actions[e].indexOf(t.words[l])&&("shadowRoot"!==t.words[l]&&"shadow"!==t.words[e]||(r.shadow=!0),"light"!==t.words[l]&&"лайт"!==t.words[e]||(r.light=!0),"editor"===t.words[l]&&(r.editor=!0),"слайдер"===t.words[l]&&(r["editor-slider"]=!0),"swap"===t.words[l]&&(r.swap=!0));t["words-action"]=r;for(let e in t["external-property"])for(let s in t["external-property"][e])switch(s){case"id":let r=document.createElement(t["external-property"][e][s]);r.setAttribute("type","external"),t.this.appendChild(r)}e(t)}})}(t).then(t=>{s(t)})})}}).catch(t=>{throw t})})}(e).then(t=>{(function(t,e,s){return new Promise(function(e,s){t["template-shadow"]=[],t["template-light"]=[];let r=[];r.swap=!1,r.blog=!1,r.external=!1,r.light=!1,r.slider=!1,r.one=!1,r.sliderText=!1,r.text=!1;for(let e=0;e<t.type.length;e++){if(-1!==t.type[e].indexOf("slider")&&t.type[e].split("-").length>1){r.slider=!0;for(let s in t.type[e].split("-"))switch(t.type[e].split("-")[s]){case"one":r.one=!0}}if(t.type[e].length)if(t.type[e].split("-").length>1)switch(t.type[e].split("-")[0]){case"blog":r.blog=!0;break;default:console.log("типы не отслеживаются",t.type[e])}else switch(t.type[e]){case"swap":r.swap=!0;break;case"external":r.external=!0;break;case"light":r.light=!0;break;case"slider":r.slider=!0;break;case"sliderText":r.sliderText=!0;break;case"text":r.text=!0}}if(t.this.getAttribute("parent")&&(t.parent=t.this.getAttribute("parent")),!0===r.swap){for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-light"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),o(t.this.children[e],t),t["template-light"].push(t.this.children[e])):(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),o(t.this.children[e],t),t["template-shadow"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-light"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),o(t.template.children[e],t),t["template-light"].push(t.template.children[e])):(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),o(t.template.children[e],t),t["template-shadow"].push(t.template.children[e]))}else{for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-shadow"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),o(t.this.children[e],t),t["template-shadow"].push(t.this.children[e])):(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),o(t.this.children[e],t),t["template-light"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-shadow"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),o(t.template.children[e],t),t["template-shadow"].push(t.template.children[e])):(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),o(t.template.children[e],t),t["template-light"].push(t.template.children[e]))}for(let e in r)t.verify[e]=r[e];e(t)})})(t,t["type-swap"],t["type-external"]).then(t=>{if(!0===t.verify.swap){if(0!==t["template-light"].length)for(let e=0;e<t["template-light"].length;e++)t.this.prepend(t["template-light"][e]);if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e=0;e<t["template-shadow"].length;e++)t.this.shadowRoot.appendChild(t["template-shadow"][e])}}else{if(0!==t["template-light"].length)for(let e in t["template-light"])t.this.appendChild(t["template-light"][e]);if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e in t["template-shadow"])t.this.shadowRoot.appendChild(t["template-shadow"][e])}}s(t)})})}).catch(t=>t)})}function o(t,e){return new Promise(function(s,r){let l=!1;for(let e=0;e<document.querySelectorAll("script").length;e++)-1!==document.querySelectorAll("script")[e].src.indexOf(t.tagName.toLowerCase())&&(l=!0);if(!0===l)console.log("модуль загружен");else{const l=document.createElement("script");l.src=`/static/html/components/${t.tagName.toLowerCase()}/${t.tagName.toLowerCase()}.mjs`,l.type="module",l.setAttribute("async",""),l.onload=s,l.onerror=r,e.this.appendChild(l)}})}var n;function i(t,e){let s=("; "+t).split("; "+e+"=");if(2==s.length)return s.pop().split(";").shift()}e.push("component-id"),e.push("script"),e.push("component-action"),s.push("h1"),s.push("innerText"),r.push("shadowRoot"),r.push("head"),r.push("shadow"),r.push("light"),r.push("lightDom"),r.push("editor"),r.push("слайдер"),r.push("swap"),t.this=this,t["type-supported"]=s,(n=this,new Promise(function(t,e){let s=[];s.staticProperty=[],s.staticProperty.c=0,s.state=[],s.state.push("shadow"),s.state.push("light"),s.words=r,s.parent=!1,s["type-swap"]=!1,s["type-external"]=!1,s["document-offsetWidth"]=document.body.offsetWidth;let l=!1;if(s.getAttribute=((t,e,s)=>{if("template"===s){if(!t.getAttribute("type"))return t.setAttribute("type","default"),!1;for(let s=0;s<t.getAttribute("type").split("-").length;s++)t.getAttribute("type").split("-")[s]===e&&(l=!0);return l}if(t[`verify-${e}`]=!1,0===t.this.getAttribute("type").split("-").length)return!1;for(let s=0;s<t.this.getAttribute("type").split("-").length;s++)t.this.getAttribute("type").split("-")[s]===e?t[`verify-${e}`]=!0:t[`verify-${e}`]=!1;return console.assert(!1,t),t[`verify-${e}`]}),n.tagName.toLowerCase()&&(s.component=n.tagName.toLowerCase()),"object"!=typeof n);else{if(n.getAttribute("type")){s.type=n.getAttribute("type").split("-");for(let t=0;t<s.type.length;t++)s.type[t]=s.type[t].replace(/:/g,"-");for(let t in s.type)switch(s.type[t]){case"swap":s["type-swap"]=!0;break;case"external":s["type-external"]=!0}}else s.type=["default"],n.setAttribute("type","default");if(n.slot?s.slot=n.slot:(n.slot=n.tagName.toLowerCase(),s.slot=n.slot),n.getAttribute("type")){let t=!1;for(let e in n.getAttribute("type").split("-"))-1!==n.getAttribute("type").split("-")[e].indexOf("style:")&&(t=!0);s["style-custom"]=!0===t?"not-default":"default"}}s.shadowRoot=!1,s.this=n,t(s)})).then(t=>{l(t).then(t=>{(function(t){return new Promise(function(e,s){let r=document.createElement("style"),l=document.createElement("style"),o={};(o=t.slot?t.slot:t.parent)||console.assert(!1,"не установленны ни слот ни парент");for(let e=0;e<t.type.length;e++)"swap"===t.type[e]?"scoped"===t.type[e]&&r.setAttribute("scoped",""):"scoped"===t.type[e]&&l.setAttribute("scoped","");for(let s=0;s<t.state.length;s++){switch(t[`path-style-${t.state[s]}`]=`@import '/static/html/components/${t.component}/${t.state[s]}/${t.component}.css'; @import '/static/html/components/${t.component}/${t.state[s]}/${t.component}-custom.css';`,t.state[s]){case"shadow":!0===t.verify.preset&&(t[`path-style-${t.state[s]}-preset`]=`@import '/static/html/components/${t.component}/template/${o}.css';`),r.innerText=t[`path-style-${t.state[s]}`]+t[`path-style-${t.state[s]}-preset`];break;case"light":!0===t.verify.preset&&(t[`path-style-${t.state[s]}-preset`]=`@import '/static/html/components/${t.component}/template/${o}.css';`),l.innerText=t[`path-style-${t.state[s]}`]+t[`path-style-${t.state[s]}-preset`]}"swap"===t.state[s]?!0===t.shadowRoot?(t.this.shadowRoot.appendChild(l),t.this.appendChild(r),e(t)):t.this.appendChild(r):!0===t.shadowRoot?(t.this.shadowRoot.appendChild(r),t.this.appendChild(l),e(t)):t.this.appendChild(l)}e(t)})})(t).then(t=>{!async function(t){await store({input:"ton-client",this:t.this,obj:t,slot:t.this.slot,type:"obj"},"set","type"),t.this.shadowRoot.querySelector("#hidden").addEventListener("click",async()=>{t.this.shadowRoot.querySelector("#hidden").classList.toggle("close"),t.this.shadowRoot.querySelector("#hidden").classList.contains("close")?(t.this.shadowRoot.querySelector("#connect").style.display="none",t.this.shadowRoot.querySelector("#content").style.display="none",t.this.shadowRoot.querySelector("#console").style.display="none"):(t.this.shadowRoot.querySelector("#connect").style.display="flex",t.this.shadowRoot.querySelector("#content").style.display="flex",t.this.shadowRoot.querySelector("#console").style.display="flex")}),t.this.shadowRoot.querySelector("label.name").addEventListener("click",async t=>{let e=i(document.cookie,"webRTC");if(e){let e=new FormData;e.append("name",t.target.parentNode.querySelector("input.name").value),t.target.parentNode.querySelector("input.name").value="";let s=await fetch("http://localhost:7777/createWallet",{method:"POST",body:e,credentials:"include"});if(!s.ok)throw new Error("HTTP error, status = "+s.status);s=await s.json(),console.log("~~~~id~~~~",s)}}),t.this.shadowRoot.querySelector("label.address").addEventListener("click",async t=>{let e=i(document.cookie,"webRTC");if(e){let e=new FormData;e.append("address",t.target.parentNode.querySelector("input.address").value);let s=await fetch("http://localhost:7777/show-add",{method:"POST",body:e,credentials:"include"});if(!s.ok)throw new Error("HTTP error, status = "+s.status);s=await s.json(),console.log("~~~~id~~~~",s)}}),t.this.shadowRoot.querySelector("label.account").addEventListener("click",async t=>{let e=i(document.cookie,"webRTC");if(e){let e=new FormData;e.append("account",t.target.parentNode.querySelector("input.account").value);let s=await fetch("http://localhost:7777/getaccount",{method:"POST",body:e,credentials:"include"});if(!s.ok)throw new Error("HTTP error, status = "+s.status);s=await s.json(),console.log("~~~~id~~~~",s)}}),t.this.shadowRoot.querySelector("label.runmethod").addEventListener("click",async t=>{let e=i(document.cookie,"webRTC");if(e){let e=new FormData;e.append("account",t.target.parentNode.querySelector("input.runmethod").value);let s=await fetch("http://localhost:7777/time",{method:"POST",body:e,credentials:"include"});if(!s.ok)throw new Error("HTTP error, status = "+s.status);s=await s.json(),console.log("~~~~id~~~~",s)}}),t.this.shadowRoot.querySelector("input.help").addEventListener("click",async t=>{let e=i(document.cookie,"webRTC");if(e){let t=await fetch("http://localhost:7777/help",{method:"GET",credentials:"include"});if(!t.ok)throw new Error("HTTP error, status = "+t.status);t=await t.json(),console.log("~~~~id~~~~",t)}}),t.this.shadowRoot.querySelector("input.time").addEventListener("click",async t=>{let e=i(document.cookie,"webRTC");if(e){let t=await fetch("http://localhost:7777/time",{method:"GET",credentials:"include"});if(!t.ok)throw new Error("HTTP error, status = "+t.status);t=await t.json(),console.log("~~~~id~~~~",t)}}),t.this.shadowRoot.querySelector("#erase").addEventListener("click",async e=>{t.this.shadowRoot.querySelector("#console").innerHTML=""}),t.this.shadowRoot.querySelector("input.last").addEventListener("click",async t=>{let e=i(document.cookie,"webRTC");if(e){let t=await fetch("http://localhost:7777/last",{method:"POST",credentials:"include"});if(!t.ok)throw new Error("HTTP error, status = "+t.status);t=await t.json(),console.log("~~~~id~~~~",t)}}),document.addEventListener("init",async e=>{let s=e.detail.data.init;if(t.this.shadowRoot.querySelector("#console").children.length>40)for(let e=0;e<t.this.shadowRoot.querySelector("#console").children.length;e++)e<35&&t.this.shadowRoot.querySelector("#console").children[e].remove();for(let e=0;e<s.length;e++){document.createElement("p");t.this.shadowRoot.querySelector("#console").insertAdjacentHTML("beforeend",`\n                <p>${s[e]}</p>\n                `)}});let e=new CustomEvent("ringPing",{detail:{data:""}});document.dispatchEvent(e)}(t)})})})}});