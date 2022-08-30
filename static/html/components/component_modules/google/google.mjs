import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import url from '/static/html/components/component_modules/shortUrl/shortUrl.mjs'
let obj = {}
obj['gapi'] = {}
obj['git'] = {}
obj.staticProperty = []
obj.staticProperty.init = {}
obj.staticProperty.gapi = undefined
obj.staticProperty.props = []
obj.staticProperty.githubFiles = []
let loader = (url, name) =>{
    return new Promise(function (resolve, reject) {
        let load = document.createElement('script');
        load.src = url
        document.body.appendChild(load)
        load.onload = (out) =>{
            resolve(window[name])
        }
    })
}

obj['gapi']['props'] = async (object) => obj.staticProperty.props = {
        CLIENT_ID: '65532128836-81nvk7kq2jhluec20p567n3vrv28m7lq.apps.googleusercontent.com',
        API_KEY: 'AIzaSyCXA62m-07h--UlJHJtcSoFbufFtwbxQe4',
        DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        SCOPES: 'https://www.googleapis.com/auth/drive.metadata.readonly',
        authorizeButton: object.this.shadowRoot.querySelector('#authorizeButton'),
        signoutButton: object.this.shadowRoot.querySelector('#signoutButton'),
        pre: object.this.shadowRoot.querySelector('#content')
}

obj['gapi']['handleClientLoad'] = async function (folder) {
    gapi.load('client:auth2', obj['gapi']['initClient']);
}
obj['gapi']['initClient'] = async () => {
    gapi.client.init({
        apiKey: obj.staticProperty.props.API_KEY,
        clientId: obj.staticProperty.props.CLIENT_ID,
        discoveryDocs: obj.staticProperty.props.DISCOVERY_DOCS,
        scope: obj.staticProperty.props.SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(obj['gapi']['updateSigninStatus']);
        obj['gapi']['updateSigninStatus'](gapi.auth2.getAuthInstance().isSignedIn.get());
        obj.staticProperty.props.authorizeButton.onclick = obj['gapi']['handleAuthClick'];
        obj.staticProperty.props.signoutButton.onclick = obj['gapi']['handleSignoutClick'];
    }, function(error) {
        console.assert(false, JSON.stringify(error, null, 2))
    });
}

obj['gapi']['updateSigninStatus'] = async (isSignedIn) => {
    if (isSignedIn) {
        obj.staticProperty.props.authorizeButton.style.display = 'none';
        obj.staticProperty.props.signoutButton.style.display = 'block';
        obj.staticProperty.gapi = gapi
        localStorage.setItem('google', 'true');
        obj.staticProperty.init().then((object)=>{
            document.dispatchEvent( new CustomEvent('signInGoogle', {
                detail: {
                    _:object._,
                    id:object.id,
                    parent:object.parent,
                    previous:object.previous,
                    files: object['files']
                }
            }))
        })
    } else {
        obj.staticProperty.props.authorizeButton.style.display = 'block';
        obj.staticProperty.props.signoutButton.style.display = 'none';
        obj.staticProperty.gapi = undefined
        localStorage.removeItem('google');
        obj.staticProperty.init().then((object)=>{
            document.dispatchEvent( new CustomEvent('signOut', {
                detail: {
                    _:object._,
                    id:object.id,
                    parent:object.parent,
                    previous:object.previous,
                    files: undefined
                }
            }))
        })
    }
}

obj['gapi']['handleAuthClick'] = async () => {
    gapi.auth2.getAuthInstance().signIn();
}
obj['gapi']['handleSignoutClick'] = async () => {
    gapi.auth2.getAuthInstance().signOut();
}

obj['gapi']['files'] = async (object) => {
    if(isEmpty(object._)){
        console.assert(false, 'Должно быть определение obj:_')
    }else{
        if(isEmpty(object.parent)){
            console.assert(false, 'Должно быть определение одительского объекта obj:parent', object)
        }else{
            if(isEmpty(object.id)){
                console.assert(false, 'нет id',object)
            }else{

                let files = await obj.staticProperty.gapi.client.drive.files.list({
                    'q': `'${object['folder']['id']}' in parents`,
                    'pageSize': 10
                })
                return {
                    _:object._,
                    id:object.id,
                    parent:object.parent,
                    previous:object.previous,
                    files: files['result']['files']
                }
            }

        }
    }
}

obj['gapi']['link'] = async (link) => {

    const webViewLink = await obj.staticProperty.gapi.client.drive.files.get({
        fileId: link,
        fields: 'webViewLink'
    })

    let links = `https://drive.google.com/uc?id=${link}`


    return {
        _:'response',
        link: links,
        webViewLink: webViewLink['result']['webViewLink'],
    }
}


obj['gapi']['id']= async (nameFile = undefined) => {
    if(nameFile === undefined){
        console.assert(false, 'добавьте name file')
    }else{
        let result = await obj.staticProperty.gapi.client.drive.files.list({
            'q': `mimeType='application/vnd.google-apps.folder' and name='${nameFile}'`
        })
        return result.result.files[0]
    }
}
obj['gapi']['root']= async () => {
        let result = await obj.staticProperty.gapi.client.drive.files.get({
            fileId:'root'
        })
      return result.result

}


obj['gapi']['listFiles'] = async (folder = undefined) => {
    let response =  await obj.staticProperty.gapi.client.drive.files.list({ })
    let files = response.result.files;
    let listFiles = []
    for(let key in files){
        switch (files[key].mimeType) {
            case 'image/png':
                listFiles.push({
                    mimeType: files[key].mimeType,
                    name:files[key].name,
                    link:`https://drive.google.com/uc?id=${files[key].id}`
                })
                break
            case 'image/jpeg':
                listFiles.push({
                    mimeType: files[key].mimeType,
                    name:files[key].name,
                    link:`https://drive.google.com/uc?id=${files[key].id}`
                })
                break
            default:
                console.warn('необрабатываемый mime type', files[key].mimeType)
                break
        }
    }
let gitHubFile = `export default async ()=>{
return JSON.parse(${JSON.stringify(listFiles)})
}`
    return gitHubFile
}


obj['gapi']['recursive'] = (object) =>{
    return new Promise(async function (resolve, reject) {
       let files = await obj.staticProperty.gapi.client.drive.files.list({
            'q': `'${object.sendToGitHub}' in parents`,
            'pageSize': 10
        })
        files = files.result.files
        for(let key in  files){
            switch (files[key]['mimeType']) {
                case 'image/jpeg':
                    obj.staticProperty.githubFiles.push({
                        mimeType: files[key].mimeType,
                        name:files[key].name,
                        link:`https://drive.google.com/uc?id=${files[key].id}`
                    })
                    break
                case 'image/png':
                    obj.staticProperty.githubFiles.push({
                        mimeType: files[key].mimeType,
                        name:files[key].name,
                        link:`https://drive.google.com/uc?id=${files[key].id}`
                    })
                    break
                case 'text/plain':

                    break
                case 'application/vnd.google-apps.folder':
                    await obj['gapi']['recursive']({
                        sendToGitHub: files[key].id
                    })
                    break
                default:
                    console.assert(false, 'неизвестный тип данных', object[key]['mimeType'])
                    break
            }
        }

        resolve({recursive:'true'})
    })
}

obj['gapi']['dirFolder'] = (object) =>{
    let githubFile = []
    return new Promise(async function (resolve, reject) {
        for(let key in  object){
            switch (object[key]['mimeType']) {
                case 'image/jpeg':
                    obj.staticProperty.githubFiles.push({
                        mimeType: object[key].mimeType,
                        name:object[key].name,
                        link:`https://drive.google.com/uc?id=${object[key].id}`
                    })
                    break
                case 'image/png':
                    obj.staticProperty.githubFiles.push({
                        mimeType: object[key].mimeType,
                        name:object[key].name,
                        link:`https://drive.google.com/uc?id=${object[key].id}`
                    })
                    break
                case 'text/plain':

                    break
                case 'application/vnd.google-apps.folder':
                    await obj['gapi']['recursive']({
                        sendToGitHub: object[key].id
                    })
                    break
                default:
                    console.assert(false, 'неизвестный тип данных', object[key]['mimeType'])
                    break
            }
        }

        resolve(object)
    })
}

obj['gapi']['sendToGitHub'] = async (object) => {

    let files ={}
    if(object.sendToGitHub === 'root'){
        files  =  await obj['gapi']['listFiles']()
    }else{
         files = await obj.staticProperty.gapi.client.drive.files.list({
            'q': `'${object.sendToGitHub}' in parents`,
            'pageSize': 10
        })
        await obj['gapi']['dirFolder'](files.result.files)
        files = obj.staticProperty.githubFiles
        obj.staticProperty.githubFiles =[]
        files = `export default async ()=>{
return JSON.parse(${JSON.stringify(files)})
}`
    }
    document.dispatchEvent( new CustomEvent('textToGitHub', {
        detail: {
            _:'google.mjs',
            content: files
        }
    }))
    return {send:'true'}
}

export default (parameters={_:'default',parent:undefined, obj:undefined})=>{
    return new Promise(async (resolve, reject) => {
        let template = {}
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err upload ~~~', error)
            reject(error)
        }
        if(isEmpty(parameters['_'])){
            console.assert(false, 'нет идентификатора _')
        }else {
            for(let key in parameters){
                switch (parameters['_']) {
                    case "init":
                        if(isEmpty(parameters['obj'])){
                            console.assert(false, 'нужен объект с html для кнопок {_:`есть`, obj:`нужно добавить`} ', parameters)
                        }else{
                            if(key === 'obj'){
                                await loader('https://apis.google.com/js/api.js', 'gapi')
                                await obj['gapi']['props'](parameters['obj'])
                                obj.staticProperty.init = async () =>{
                                    if(obj.staticProperty.gapi !== undefined){
                                        let object = {}
                                        let root = await obj['gapi']['root'](parameters)
                                        if(parameters['folder'] === undefined){
                                            object = await obj['gapi']['files']({
                                                _:'root',
                                                parent:'root',
                                                previous:'root',
                                                id:root.id,
                                                folder:root
                                            })
                                           return object
                                        }else{
                                            let root = await obj['gapi']['root'](parameters)
                                            if(object['folder'] !== undefined){
                                                object = await obj['gapi']['files']({
                                                    _:'root',
                                                    parent:'root',
                                                    previous:'root',
                                                    id:root.id,
                                                    folder:root
                                                })
                                                object =  await obj['gapi']['files'](object)
                                            }
                                        }
                                        out({Google:'initialization is ok'})
                                    }else{
                                        out({singout:'ok'})
                                        return {
                                            _:'response',
                                            folder:undefined
                                        }
                                    }
                                }
                                await obj['gapi']['handleClientLoad']()
                            }
                        }
                        break
                    case "folder":
                        if(parameters['_'] === key){

                            if(parameters.parent === undefined){
                                console.assert(false, 'укажите родительскую папку')
                            }else{
                                let id = {}
                                let files = {}
                                if(isEmpty(parameters.folder.id)){
                                    if(parameters.folder.toLowerCase() === 'root'){
                                        id = await obj['gapi']['root']()
                                    }else{
                                        id = await obj['gapi']['id'](`${parameters.folder.toLowerCase()}`)
                                    }
                                    if(isEmpty(id)){
                                        out(undefined)
                                    }else{
                                        parameters.folder = id
                                        parameters['id'] = parameters['folder']['id']
                                        files = await obj['gapi']['files'](parameters)
                                        out(files)
                                    }
                                }else{
                                    files = await obj['gapi']['files'](parameters)
                                    out(files)
                                }

                            }
                        }
                        break
                    case "root":
                        if(parameters['_'] === key){
                            let root = await obj['gapi']['root'](parameters)
                            console.assert(false, root)
                            out(root)
                        }
                        break
                    case "sendToGitHub":
                        if(parameters['_'] === key){
                            let files = await obj['gapi']['sendToGitHub'](parameters)
                            out(files)
                        }
                        break
                    case "link":
                        if(parameters['_'] === key){
                            out(await obj['gapi']['link'](parameters['link']))
                        }
                        break
                    default:
                        console.warn(false, 'неизвестный идентификатор _ --->', parameters['_'] )
                        break
                }
            }
        }
    })
}