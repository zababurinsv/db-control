import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import emoji from '/static/html/components/component_modules/emoji/emoji.mjs'

export default async (v,p,c,obj,r) => {
    await store({
        input:'waves-balance',
        this:obj['this'],
        parent: obj['this'].getAttribute('parent'),
        slot:obj['slot'],
        type:'obj'
    }, 'set', 'type')

    document.addEventListener('bank-form',async (event)=>{
        let request = event.detail.data
        switch (event['detail']['/']) {
            case 'bank-form':
                let balance = obj['this']['shadowRoot'].querySelector('#content')
                balance.insertAdjacentHTML('afterbegin',`
                                <p>Balance</p>
                                <div>${request.balance.balance/100000000}</div>`)
                await customEvents('bank-form-end', true)
                break
            default:
                console.warn(`${emoji('thinking')}результат не обрабатывается${emoji('thinking')}`, event['detail']['/'], event['detail'])
                customEvents('bank-form-end', false)
                break
        }
        document.addEventListener('input-wallet',async (event)=>{
            let request = event.detail.data
            switch (event['detail']['/']) {
                case 'input-wallet':
                    let address = obj['this']['shadowRoot'].querySelector('#faucet')
                    address.value = request.address
                    break
                default:
                    console.warn(`${emoji('thinking')}результат не обрабатывается${emoji('thinking')}`, event['detail']['/'], event['detail'])
                    customEvents('input-wallet-end', {status:false, error:`${emoji('thinking')}результат не обрабатывается${emoji('thinking')} ---> ${event['detail']['/']}`})
                    break
            }
        })
    })
}