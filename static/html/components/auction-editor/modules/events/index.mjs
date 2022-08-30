import update from '/static/html/components/component_modules/tableUpdate/update.mjs'
import store from '/static/html/components/component_modules/store/index.mjs'

const getEditor = async (events, components) => {
  for(let item of components) {
    if(item.slot === events.currentTarget.getRootNode().host.getAttribute('parent')) {
      return item
    }
  }
  return false
}

const admin = async (events) => {
  const container = document.querySelector('.content__admin')
  const content = document.querySelector('#admin-card').content
  const templateItem = content.cloneNode(true)
  const activeItem = events.target.parentNode

  const timer = activeItem.querySelector('.timer').textContent
  const price = activeItem.querySelector('.price').textContent
  const name =  activeItem.querySelector('.name').textContent
  const images = activeItem.querySelector('.imgBid').src

  for(let item of events.target.classList) {
    if(item.indexOf('timestamp') !== -1) {
      templateItem.querySelector('.item').classList.add(item)
    }
  }

  container.innerHTML = ''

  templateItem.querySelector('.timer').textContent = timer
  templateItem.querySelector('.price').textContent = price
  templateItem.querySelector('.name').textContent = name
  templateItem.querySelector('.imgBid').src = images

  console.log('------ container --------', container)
  container.appendChild(templateItem)
  container.style.display = 'flex'
}

export const mouseenter = (events) => {
  const edit = events.target.querySelector('.item_edit')
  edit.style.display = 'flex'
  edit.addEventListener('click', admin)
}

export const mouseleave = (events) => {
  const edit = events.target.querySelector('.item_edit')
  edit.removeEventListener('click', admin)
  edit.style.display = 'none'
}

export const editor = (events) => {
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
}

export const start = (events) => {

}


export const bid = (events) => {

}

export const remove = (events) => {

}

export const menuReset = (events) => {

}

/**
 * @param events
 * @returns {Promise<void>}
 */
export const menuUpdate = async (events) => {
  const component = await getEditor(events, store.get.components('varan-editor'))
  store.dispatch({
    type: "auction.admin.update.lot",
    data: component.obj.this.querySelector('.wall').innerHTML,
    slot: component.slot
  })
}

export const menuSave = async (events) => {
  const component = await getEditor(events, store.get.components('varan-editor'))
  component.obj.this.querySelector('.wall').innerHTML = component.editor.quill.root.innerHTML
}