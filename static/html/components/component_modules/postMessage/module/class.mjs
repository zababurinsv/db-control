import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import queue from '/static/html/components/component_modules/queue/queue.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import emoji from '/static/html/components/component_modules/emoji/emoji.mjs';
let iframe = {}
iframe.staticProperty = {}
let Class = class Post {
    constructor() {
        this.iframe = this.iframe.bind(this)
        this.windows = this.windows.bind(this)
        this.listener = this.listener.bind(this)
        this.iframeListener = this.iframeListener.bind(this)
        this.end = this.end.bind(this)
        document.addEventListener('post-end', this.end)
    }
    iframe(host='',path='',view = true,property='',color = 'black', substrate={},relation=''  ){
        return new Promise(async function (resolve, reject) {
            window.addEventListener("message", async (event) => {
                if(event.origin === host){
                    if(event.data.status === 'true'){
                        console.log(`${emoji('smile')} response`,event.origin,'--->',event.data, )
                        resolve(true)
                    }else{
                        console.log(`${emoji('panda_face')} request`,event.data)
                        for(let key in substrate ){
                            if(key !== relation){
                                delete substrate[key]
                            }
                        }
                        if(Object.keys(substrate).length > 1){
                            console.warn(`${emoji('rage')} class.mjs postMessage у объекта должно быть одно свойтсво --->`, substrate)
                        }else if(Object.keys(substrate).length === 0){
                            console.warn(`${emoji('rage')} class.mjs postMessage субстран не посылается, может быть он существует на стороне обработчика --->`, substrate)
                        }
                        event.source.postMessage({view:view,property:property,color:color,substrate:substrate,relation:relation },event.origin)
                    }
                }else{
                    console.log(`${emoji('rage')} monopoly Not Allowed`, '--->' ,event,':host === origin', host,'===', event.origin)
                }
            });
    
            let ifrm = document.createElement("iframe");
            ifrm.setAttribute("src", `${host}${path}`);
            ifrm.setAttribute('frameBorder', '0');
            ifrm.setAttribute('width', '100%');
            ifrm.style.height = "40vw";
            if(document.body.querySelector('#components') === undefined){
                document.body.appendChild(ifrm)
            }else{
                document.body.querySelector('#components').appendChild(ifrm)
            }
       
        })
    }
    iframeListener(access= ''){
        return new Promise(async function (resolve, reject) {
            if(location.pathname === '/post'){
                try {
                    window.addEventListener ("message", async (event) => {
                        console.log('~~~~~~~~dd~~~~~~~~ddd~~~~~~~~~~~~~~~~~~~~~', location.pathname, access)
                        if(event.origin === access){
                            console.log(`${emoji('smile')} Allowed`, event.data)
                            if(isEmpty(event.data.view)) console.assert(false,`${emoji('thinking')} нет аргумента view`)
                            if(isEmpty(event.data.property)) console.assert(false,`${emoji('thinking')} нет аргумента property`)
                            if(isEmpty(event.data.color)) console.assert(false,`${emoji('thinking')} нет аргумента color`)
                            if(isEmpty(event.data.substrate)) console.assert(false,`${emoji('thinking')} нет аргумента substrate`)
                            if(isEmpty(event.data.relation)) console.assert(false,`${emoji('thinking')} нет аргумента relation`)
                            queue(event.data.view, event.data.property,event.data.color,event.data.substrate,event.data.relation)
                        }else{
                            console.log(`${emoji('rage')} not allowed`, event.origin,'--->', event)
                        }
                    })
                    let msg = { '/': `${location.host}`, connect: true };
                    window.parent.postMessage(msg, `${access}`)
                }catch (e) {
                    resolve({status:false, err: e})
                }
            }else if(location.pathname === '/import'){
                window.addEventListener ("message", async (event) => {
                    if(event.origin === access){
    
                        console.log('3333333333333',event)
                    }
                })
                window.parent.postMessage(true, `http://localhost:6040`)
            }else{
                resolve({status:false})
            }
        })
    }
    windows(host='',path='',view = true,property='',color = 'black', substrate={},relation=''  ){
        return new Promise(async function (resolve, reject) {
            let hosts =  host
            let scrollWidth = Math.max(
                document.body.scrollWidth, document.documentElement.scrollWidth,
                document.body.offsetWidth, document.documentElement.offsetWidth,
                document.body.clientWidth, document.documentElement.clientWidth
            );
            window.addEventListener("message", async (event) => {
                if(event.origin === host){
                    if(event.data.status === 'true'){
                        console.log(`${emoji('smile')} response`,event.origin,'--->',event.data, )
                        resolve(true)
                    }else{
                        console.log(`${emoji('panda_face')} request`,event.data)
                        for(let key in substrate ){
                            if(key !== relation){
                                delete substrate[key]
                            }
                        }
                        if(Object.keys(substrate).length > 1){
                            console.warn(`${emoji('rage')} class.mjs postMessage у объекта должно быть одно свойтсво --->`, substrate)
                        }else if(Object.keys(substrate).length === 0){
                            console.warn(`${emoji('rage')} class.mjs postMessage субстран не посылается, может быть он существует на стороне обработчика --->`, substrate)
                        }
                        event.source.postMessage({view:view,property:property,color:color,substrate:substrate,relation:relation },event.origin)
                    }
                }else{
                    // console.log(`${emoji('rage')} waves Not Allowed`, '--->' ,event,':host === origin', host,'===', event.origin)
                }
            });
            window.open(`${host}${path}`,`${relation}`,`height=${scrollWidth/3},width=${scrollWidth/1.5},scrollbars=no,toolbar=no,menubar=no,status=no,resizable=no,scrollbars=no,location=no,top=${scrollWidth/2-((scrollWidth/1.5)/2)},left=${scrollWidth/2-((scrollWidth/1.8)/2)}`);
       
        })
    }
    listener(access= ''){
        return new Promise(async function (resolve, reject) {
            if(location.pathname === '/post'){
                try {
                    window.addEventListener ("message", async (event) => {
                        if(event.origin === access){
                            console.log(`${emoji('smile')} Allowed`, event.data)
                            if(isEmpty(event.data.view)) console.assert(false,`${emoji('thinking')} нет аргумента view`)
                            if(isEmpty(event.data.property)) console.assert(false,`${emoji('thinking')} нет аргумента property`)
                            if(isEmpty(event.data.color)) console.assert(false,`${emoji('thinking')} нет аргумента color`)
                            if(isEmpty(event.data.substrate)) console.assert(false,`${emoji('thinking')} нет аргумента substrate`)
                            if(isEmpty(event.data.relation)) console.assert(false,`${emoji('thinking')} нет аргумента relation`)
                            queue(event.data.view, event.data.property,event.data.color,event.data.substrate,event.data.relation)
                        }else{
                            console.log(`${emoji('rage')} not allowed`, event.origin,'--->', event)
                        }
                    })
                    let msg = { '/': `${location.host}`, connect: true };
                    window.opener.postMessage(msg, `${access}`)
                    window.opener.focus();
                }catch (e) {
                    resolve({status:false, err: e})
                }
            }else{
                resolve({status:false})
            }
        })
    }

    end(event){
        console.log(`${emoji('smile')} send`,event.detail, event.detail.data.origin)
        window.opener.postMessage({status:'true', data:event.detail}, `${event.detail.data.origin}`)
        window.close()
    }
    get self() {
        return object
    }
}

export default Class

//     window.removeEventListener('message', async ()=>{}, false);
//