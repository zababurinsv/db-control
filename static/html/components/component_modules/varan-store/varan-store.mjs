let store = {}

store['commit'] = async function (obj, type) {
    console.log('<--- commit --->')
    return obj
}
store['getters'] = async function (obj, type) {
    console.log('<--- getters --->', obj)
    return obj
}
store['dispatch'] = async function (obj, type) {
    console.log('<--- dispatch --->', obj)
    if (!window.localStorage) {
        window.localStorage = {
            getItem: function (sKey) {
                if (!sKey || !this.hasOwnProperty(sKey)) { return null }
                return unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'))
            },
            key: function (nKeyId) {
                return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, '').split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId])
            },
            setItem: function (sKey, sValue) {
                if (!sKey) { return }
                document.cookie = escape(sKey) + '=' + escape(sValue) + '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/'
                this.length = document.cookie.match(/\=/g).length
            },
            length: 0,
            removeItem: function (sKey) {
                if (!sKey || !this.hasOwnProperty(sKey)) { return }
                document.cookie = escape(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
                this.length--
            },
            hasOwnProperty: function (sKey) {
                return (new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)
            }
        }
        window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length
    }
    let localStore = {
        dispatch: store.dispatch,
        commit: store.commit,
        getters: store.getters
    }
    let object = {
        id: type['name'],
        slot: obj['slot'],
        state: obj['state']
    }
    let task = {
        name: type['name'],
        parent: type['parent'],
        newValue: type['newValue'],
        oldValue: type['oldValue'],
        state: type['state'],
        this: localStore
    }
    var event = new CustomEvent('store', {
        detail: {
            obj: object,
            task: task,
            state: task.state,
            value: task.newValue
        }
    })
    document.dispatchEvent(event)
    localStorage.setItem(JSON.stringify(object), JSON.stringify(task))
    return obj
}

function getProxy (obj) {
    const handler = {
        get: function (obj, prop) {
            if (obj[prop] === undefined) { } else {
                // console.log('~~~~~~~~getters~~~~~~~~~~~', obj[prop])
            }
            return obj[prop]
        },
        set: function (obj, prop, value) {
            obj[prop] = value
            // console.log('~~~~~~~~set~~~~~~~~~~~', prop, obj, obj[prop])
            return obj[prop]
        }
    }
    return new Proxy(obj, handler)
}

let init = async function (obj) {
    store = await getProxy(store)
    store['state'] = {}
    obj['store'] = store
    return obj
}

export default {
    init: (obj) => { return init(obj) }
}
