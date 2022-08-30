// import templateItem from "./template.js";
// import form from "./form.js";
// import pagination from "./pagination.js";
// import update from '/js/module/update_c.js'
// import addEventListener from "./addEventListener.js";
// import listener from '/js/module/listener.js'

import templateItem from "/static/html/components/telegram-table/template/template.mjs";
import form from "/static/html/components/telegram-table/template/template-form.mjs";
import pagination from "/static/html/components/component_modules/tablePagination/tablePagination.mjs";
import update from '/static/html/components/component_modules/tableUpdate/update_c.mjs'
import addEventListener from "/static/html/components/component_modules/tableAddEventListener/addEventListener.mjs";
import listener from '/static/html/components/component_modules/tableListener/tableListener.mjs'


export default (self)=> {
    return new Promise(async (resolve, reject) => {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (obj) => {
            reject(obj)
        }

        fetch('http://dev.work/api/item',{
            method: 'GET'
        })
            .then(function(response) {
                return response.json();
            })
            .then(async function(itemsObject) {
                for(let i =0; i < itemsObject.length;i++){
                    let itemObject =  await templateItem(itemsObject[i])


                    self.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                }
                let del = self.querySelectorAll('.delete')
                let edit = self.querySelectorAll('.edit')
                let plan = self.querySelectorAll('.search_input_plan')

                // console.assert(false)
                for(let i =0; i < del.length;i++){ await addEventListener(del[i], self) }
                for(let i =0; i < edit.length;i++){
                    edit[i].addEventListener('click', async (e)=>{
                        let verify = true
                        let item =  e.target.parentNode
                        while(verify){
                            if(item.tagName === 'TR'){
                                verify = false
                            }else{
                                item =  item.parentNode
                            }
                        }
                        verify = true
                        let button =  e.target.parentNode
                        while(verify){
                            if(button.tagName === 'MAIN-TABLE'){
                                verify = false
                            }else{
                                button =  button.parentNode
                            }
                        }

                        button.querySelector('.btn-primary').style.display = 'none'
                        item = item.querySelectorAll('td')
                        let editObject = {}
                        let selectedIndex = 0
                        let tempPrice = {}
                        for(let i =0; i < item.length -1; i++){
                            if(i === 0){
                                editObject['id'] = item[i].innerText
                                sessionStorage.setItem('id',item[i].innerText);
                            }else{
                                switch (i) {
                                    case 1:
                                        switch (item[i].innerText) {
                                            case 'Санкт-Петербург':
                                                sessionStorage.setItem('city',2);
                                                editObject['city'] = 2
                                                break
                                            case 'Москва':
                                                sessionStorage.setItem('city', 1);
                                                editObject['city'] = 1
                                                break
                                            default:
                                                sessionStorage.setItem('city', 0);
                                                editObject['city'] = 0
                                                break
                                        }
                                        break
                                    case 2:
                                        sessionStorage.setItem('name',item[i].innerText);
                                        editObject['name'] = item[i].innerText
                                        break
                                    case 3:
                                        sessionStorage.setItem('object',item[i].innerText);
                                        editObject['object'] = item[i].innerText
                                        break
                                    case 4:
                                        sessionStorage.setItem('dateExperiences',item[i].innerText);
                                        editObject['dateExperiences'] = item[i].innerText
                                        break
                                    case 5:
                                        sessionStorage.setItem('class',item[i].innerText);
                                        editObject['class'] = item[i].innerText
                                        break
                                    case 6:
                                        sessionStorage.setItem('type',item[i].innerText);
                                        editObject['type'] = item[i].innerText
                                        break
                                    case 7:
                                        sessionStorage.setItem('metro',item[i].innerText);
                                        editObject['metro'] = item[i].innerText
                                        break
                                    case 8:
                                        sessionStorage.setItem('geo',item[i].innerText);
                                        editObject['geo'] = item[i].innerText
                                        break
                                    case 9:
                                        let plan = ''
                                        let tempPlan = item[i].querySelectorAll('option')
                                        for(let i =0; i < tempPlan.length; i++){
                                            if(i === 0){
                                                plan = `${tempPlan[i].value}`
                                            }else{
                                                plan = `${plan},${tempPlan[i].value}`
                                            }

                                        }
                                        selectedIndex = parseInt(item[i].querySelector('select').selectedIndex, 10)
                                        sessionStorage.setItem('plans',plan);
                                        editObject['plans'] = plan
                                        break
                                    case 10:
                                        let price = ''
                                        let tempPrice = item[i].querySelectorAll('option')

                                        for(let i =0; i < tempPrice.length; i++){
                                            if(i === 0){
                                                price = `${tempPrice[i].value}`
                                            }else{
                                                price = `${price},${tempPrice[i].value}`
                                            }

                                        }
                                        sessionStorage.setItem('price',price);
                                        editObject['price'] = price
                                        break
                                    case 11:
                                        sessionStorage.setItem('finish',item[i].innerText);
                                        editObject['finish'] = item[i].innerText
                                        break
                                    case 12:
                                        sessionStorage.setItem('description',item[i].innerText);
                                        editObject['description'] = item[i].innerText
                                        break
                                    default:
                                        console.assert(false, `новое свойство ${i}`, item[i])
                                        break

                                }
                            }
                        }
                        let updateObject = await form(editObject, tempPrice[selectedIndex])
                        // console.assert(false, updateObject)
                        document.querySelector('#formConteiner').innerHTML = ''
                        document.querySelector('#formConteiner').insertAdjacentHTML('beforeend', updateObject)
                        document.querySelector('#city').selectedIndex =  sessionStorage.getItem('city');
                        // console.assert(false, document.querySelector('#city'))
                        document.querySelector('#city').addEventListener("change",  async (event)=>{
                            sessionStorage.setItem('city',event.target.selectedIndex);
                        })
                        let itemObject = document.querySelector('#object-form')
                        for(let i = 0; i < itemObject.querySelectorAll('input').length; i++){
                            itemObject.querySelectorAll('input')[i].oninput = function(event) {
                                sessionStorage.setItem(`${event.target.name}`,event.target.value)
                            };
                        }
                        for(let i = 0; i < itemObject.querySelectorAll('textarea').length; i++){
                            itemObject.querySelectorAll('textarea')[i].addEventListener('input', (event) => {
                                sessionStorage.setItem(`${event.target.name}`,event.target.value);
                            });
                        }
                        document.querySelector('.btn-success').addEventListener('click', async (e)=>{
                            // e.target.parentNode.querySelector('#file-upload').files[0])
                            let verify = true
                            let item =  e.target.parentNode
                            while(verify){
                                if(item.tagName === 'MAIN-TABLE'){
                                    verify = false
                                }else{
                                    item =  item.parentNode
                                }
                            }
                            item.querySelector('.btn-primary').style.display = 'flex'
                            if(e.target.parentNode.querySelector('#file-upload').files[0] === 'undefined' ||e.target.parentNode.querySelector('#file-upload').files[0] === undefined ){

                                let putItem = JSON.stringify({
                                    "city":  sessionStorage.getItem('city'),
                                    "name":  sessionStorage.getItem('name'),
                                    "object":  sessionStorage.getItem('object'),
                                    "dateExperiences":  sessionStorage.getItem('dateExperiences'),
                                    "class": sessionStorage.getItem('class'),
                                    "type": sessionStorage.getItem('type'),
                                    "metro": sessionStorage.getItem('metro'),
                                    "geo":sessionStorage.getItem('geo'),
                                    "plans": sessionStorage.getItem('plans'),
                                    "price": sessionStorage.getItem('price'),
                                    "finish": sessionStorage.getItem('finish'),
                                    "image":sessionStorage.getItem('fileUpload'),
                                    "description":sessionStorage.getItem('description'),
                                    "timestampUpdate":(Date.now()).toString()
                                });

                                let xhr = new XMLHttpRequest();
                                xhr.withCredentials = true;
                                xhr.addEventListener("readystatechange", async function () {
                                    if (this.readyState === 4) {
                                        self.querySelector('tbody').innerHTML = ''
                                        self.querySelector('#formConteiner').innerHTML = ''
                                        sessionStorage.clear()
                                        await update(self)

                                    }
                                });
                                xhr.open("PUT", `http://dev.work/api/item/${sessionStorage.getItem('id')}`);
                                xhr.setRequestHeader("Content-Type", "application/json");
                                xhr.setRequestHeader("cache-control", "no-cache");
                                xhr.send(putItem);

                            }else{
                                let putItem = JSON.stringify({
                                    "city":  sessionStorage.getItem('city'),
                                    "name":  sessionStorage.getItem('name'),
                                    "object":  sessionStorage.getItem('object'),
                                    "dateExperiences":  sessionStorage.getItem('dateExperiences'),
                                    "class": sessionStorage.getItem('class'),
                                    "type": sessionStorage.getItem('type'),
                                    "metro": sessionStorage.getItem('metro'),
                                    "geo":sessionStorage.getItem('geo'),
                                    "plans": sessionStorage.getItem('plans'),
                                    "price": sessionStorage.getItem('price'),
                                    "finish": sessionStorage.getItem('finish'),
                                    "description":sessionStorage.getItem('description'),
                                    "image":await toBase64(e.target.parentNode.querySelector('#file-upload').files[0]),
                                    "timestampUpdate":(Date.now()).toString()
                                });


                                let xhr = new XMLHttpRequest();
                                xhr.withCredentials = true;
                                xhr.addEventListener("readystatechange", async function () {
                                    if (this.readyState === 4) {
                                        self.querySelector('tbody').innerHTML = ''
                                        self.querySelector('#formConteiner').innerHTML = ''
                                        sessionStorage.clear()
                                        await update(self)

                                    }
                                });
                                xhr.open("PUT", `http://dev.work/api/item/${sessionStorage.getItem('id')}`);
                                xhr.setRequestHeader("Content-Type", "application/json");
                                xhr.setRequestHeader("cache-control", "no-cache");
                                xhr.send(putItem);
                            }


                        })
                    })
                }
                for(let i =0; i < plan.length; i++){

                    await listener['set']({type:'plan', this:plan[i]})
                }

                self.querySelector('.close').addEventListener('click', async (e)=>{
                    let verify = true
                    let item =  e.target
                    while(verify){
                        if(item.tagName === 'MAIN-TABLE'){
                            verify = false
                        }else{
                            item =  item.parentNode
                        }
                    }
                    item.querySelector('#formConteiner').innerHTML = ''
                    sessionStorage.clear()
                })
                self.querySelector('.btn-primary').addEventListener('click', async (e)=>{

                    let verify = true
                    let button =  e.target.parentNode
                    while(verify){
                        if(button.tagName === 'MAIN-TABLE'){
                            verify = false
                        }else{
                            button =  button.parentNode
                        }
                    }
                    button.querySelector('.btn-primary').style.display = 'none'

                    // let object = e.target.parentNode.parentNode
                    verify = true
                    // let item =  e.target.parentNode
                    // let verify = true
                    let item =  e.target
                    while(verify){
                        if(item.tagName === 'MAIN-TABLE'){
                            verify = false
                        }else{
                            item =  item.parentNode
                        }
                    }

                    let itemObject = await form()
                    item.querySelector('#formConteiner').innerHTML = ''
                    item.querySelector('#formConteiner').insertAdjacentHTML('beforeend', itemObject)

                    sessionStorage.setItem('city',0);
                    self.querySelector('#city').addEventListener("change",  async (event)=>{
                        sessionStorage.setItem('city',event.target.selectedIndex);
                    })
                    itemObject = item.querySelector('#object-form')
                    for(let i = 0; i < itemObject.querySelectorAll('input').length; i++){
                        itemObject.querySelectorAll('input')[i].addEventListener('input', (event) => {
                            sessionStorage.setItem(`${event.target.name}`,event.target.value);
                        });
                    }
                    for(let i = 0; i < itemObject.querySelectorAll('textarea').length; i++){
                        itemObject.querySelectorAll('textarea')[i].addEventListener('input', (event) => {
                            sessionStorage.setItem(`${event.target.name}`,event.target.value);
                        });
                    }
                    item.querySelector('.btn-success').addEventListener('click', async (e)=>{

                        // console.assert(false, e.target.parentNode.querySelector('#file-upload').files[0]['name'])
                        let data = new FormData();
                        let outItem = {}
                        for(let i=0; i < object.querySelectorAll('input').length; i++){
                            data.append(`${object.querySelectorAll('input')[i].name}`, sessionStorage.getItem(`${object.querySelectorAll('input')[i].name}`));
                            sessionStorage.removeItem(`${item.querySelectorAll('input')[i].name}`)
                        }

                        for(let i=0; i < object.querySelectorAll('textarea').length; i++){
                            data.append(`${object.querySelectorAll('textarea')[i].name}`, sessionStorage.getItem(`${object.querySelectorAll('textarea')[i].name}`));
                            sessionStorage.removeItem(`${item.querySelectorAll('textarea')[i].name}`)
                        }

                        data.append('city', sessionStorage.getItem('city'))
                        data.append('timestampUpdate', [])
                        const toBase64 = file => new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = error => reject(error);
                        });

                        if (object.querySelector('#file-upload').files[0] === undefined){
                            data.append('image', [])
                        }else{
                            let file = await  toBase64(object.querySelector('#file-upload').files[0])
                            if( item.querySelector('#file-upload').files[0]){
                                data.append('image', file)
                            }
                        }




                        // console.assert(false,e.target.parentNode.querySelector('#file-upload').files[0]['name'].split('.')[0] )

                        let timestamp = Date.now()
                        data.append('timestamp', timestamp)
                        fetch(`http://dev.work/api/item/`,{
                            method: 'POST',
                            body:data
                        })
                            .then(function(response) {
                                return response.text();
                            })
                            .then(async function(myJson) {
                                console.log(myJson);
                                self.querySelector('tbody').innerHTML = ''
                                self.querySelector('#formConteiner').innerHTML = ''
                                sessionStorage.clear()
                                await update(self)
                            });
                    })
                })
                pagination(self);
            });
    })
}