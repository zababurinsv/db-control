import update from '/static/html/components/component_modules/tableUpdate/update.mjs'

export default (obj, self)=>{
    return new Promise(async (resolve, reject) => {
        let out = (obj)=>{
            resolve(obj)
        }
        let err = (obj)=>{
            reject(obj)
        }

        // console.assert(false)

        obj.addEventListener('click', async (e)=>{
            let verify = true
            let id =  e.target.parentNode
            while(verify){
                if(id.tagName === 'TR'){
                    verify = false
                }else{
                    id =  id.parentNode
                }
            }
            id = parseInt(id.querySelector('td').innerText, 10)
            let result = confirm('Вы точно хотите удалить объект ?');
            if(result){
                fetch(`http://dev.work/api/item/${id}`,{
                    method: 'DELETE'
                })
                    .then(function(response) {
                        return response.text();
                    })
                    .then(async function(myJson) {
                        self.querySelector('tbody').innerHTML = ''
                        self.querySelector('#formConteiner').innerHTML = ''
                        sessionStorage.clear()
                       await update(self)
                    });
            }

        })
        out(self)
    })
}