import Template from '/static/html/components/blockchain-account/template/js/index.mjs'
export default async (v,p,c,obj,r) => {
    // for(let i =0; i < 3;i++){
    //     obj.this.shadowRoot.querySelector('#waves-game').insertAdjacentHTML('beforeend', await Template['blockchainAccount']())
    // }
    let template = obj['path-template'].split('/')
    // console.assert(false, template[`${template.length -1}`])
    if(template[`${template.length -1}`].toString() === 'blockchain-account-waves-game-user.html') {
        obj.this.shadowRoot.querySelector('#waves-game').insertAdjacentHTML('beforeend', await Template['blockchainAccount'](true, 1, 'red', {},'contract'))
    }else {
        obj.this.shadowRoot.querySelector('#waves-game').insertAdjacentHTML('beforeend', await Template['blockchainAccount']())
    }
    document.addEventListener('setWallet',async (event)=>{
        let itemAccount = obj['this'].shadowRoot.querySelectorAll('li.id')
        let itemPublickKey = obj['this'].shadowRoot.querySelectorAll('li.name')
        for(let i = 0; i < 3; i++){
            itemAccount[i].innerHTML = `address : ${event.detail.substrate[i]['user']['address'] }`
            itemPublickKey[i].innerHTML = `Key : ${event.detail.substrate[i]['user']['publicKey'] } `

        }
        event.detail.callback('set true')
    })
}