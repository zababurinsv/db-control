export default (v,p,c,obj,r) => {
  document.addEventListener('iframe',async (event)=>{
    if(event.detail === 'http://localhost:4999'){
      iframe.post(event.detail, {
        view:true,
        property:'прослушиваем получение кошелька',
        color:'6',
        substrate:{},
        relation:'await-wallet'
      },async (event)=>{

        console.log('--->>>>>', event)
      })
    }
  })
  // w = first
  // e = second
  // u = third
  obj['this'].shadowRoot.querySelector('#fs_fs').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fs_fs').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#fb_fs').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fb_fs').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#fb_ts').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fb_ts').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  })
  obj['this'].shadowRoot.querySelector('#fb_st').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fb_st').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  })
  obj['this'].shadowRoot.querySelector('#fb_ft').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)

    let timer = setTimeout((event) => {
      obj['this'].shadowRoot.querySelector('#fb_ft').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#fs_ft').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fs_ft').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#sb_sf').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#sb_sf').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#sb_fs').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#sb_fs').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#ss_st').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#ss_st').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#ss_ts').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#ss_ts').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#sb_ft').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#sb_ft').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#sb_tf').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#sb_tf').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
}