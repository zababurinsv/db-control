import psd from '/static/html/components/component_modules/bundle/psd/psd.index.mjs'
import index from '/static/html/components/design-property-layout-main/template/index/index.mjs'
import Zip from '/static/html/components/component_modules/bundle/zip/zip.index.mjs'
let PSD = {
    file: false,
    block: false,
    render: false,
    save: false
}
async function init(v,p,c,obj,r) {
    if(obj['preset']['status']) {
        switch (obj['preset']['name']) {
            case 'index':
                obj['preset']['action'] = index
                obj['preset']['container'] = obj['this']['shadowRoot'].querySelector('.design-property-layout-main')
                break
            default:
                console.warn('пресет не обрабатывается', obj['preset']['name'])
                break
        }
    }
    return {v,p,c,obj,r}
}
async function render(v,p,c,obj,r) {
    if(!PSD.file) {
        // if(window.confirm('загрузить default psd ?')) {
        if(true) {
            await init(v,p,c,obj,r)
            await psd.write(true,'','red',obj,`${PSD.block}`)
        } else {
            console.error('загрузите psd файл')
        }
    } else {
        await init(v,p,c,obj,r)
        await psd.write(true,PSD.file,'red',obj,`${PSD.block}`)
    }
    return {v,p,c,obj,r}
}
export default async (v,p,c,obj,r) => {

    obj.this.shadowRoot.querySelector('#psd-file').addEventListener('input',async (event)=>{
        let reader = new FileReader();
        reader.onload = function() {
            PSD.file = this.result
        }
        reader.readAsArrayBuffer(event.path[0].files[0]);
    })
    obj.this.shadowRoot.querySelector('#psd-block').onfocus = function() {
        obj.this.shadowRoot.querySelector('#psd-block').value = ''
    };
    obj.this.shadowRoot.querySelector('#psd-block').addEventListener('input',async (event)=>{
        let regex = new RegExp("^[a-zA-Z\\-]+$");
        if(regex.test(event.target.value)) {
            PSD.block = event.target.value
        } else {
            console.error('!!! Возможны только кирилические символы и тире !!!')
            PSD.block = false
        }
    })
    obj.this.shadowRoot.querySelector('#psd-render').addEventListener('click',async (event)=>{
        if(!PSD.block) {
            console.error('название блока небыло введено, устанавливается default значение', obj.this.shadowRoot.querySelector('#psd-block').value)
            PSD.block = 'default-component'
            await render(v,p,c,obj,r)
        } else {
           await render(v,p,c,obj,r)
        }
    })
    obj.this.shadowRoot.querySelector('#psd-download').addEventListener('click',async (event)=>{
        let response =  await fetch('/images/core/psd/desktop.psd')
        let blob = await response.blob()
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = "default.psd";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();
    })
}