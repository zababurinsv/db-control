import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
let octokit = []
octokit.staticProperty = []
octokit.staticProperty.octokit = undefined
octokit.staticProperty.owner = undefined
octokit.staticProperty.repo = undefined
octokit.staticProperty.file = undefined
octokit.staticProperty.commits = undefined
let script = async (token)=>{
    return new Promise(async function (resolve, reject) {
        let githubScript = document.createElement('script');
        githubScript.src = '/static/html/components/component_modules/github/Octokit.mjs'
        githubScript.setAttribute('defer','')
        document.body.appendChild(githubScript)
        githubScript.onload = async (out) =>{
            octokit.staticProperty.octokit = new (await github.default())['Octokit']({
                auth: token
            });
            // octokit.staticProperty.repo = await fetch(`https://api.github.com/users/zababurinsv/images?type=all `)
           
           // console.assert(false,octokit.staticProperty.octokit )
            resolve(octokit.staticProperty.octokit)
        }
    })
}

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

async function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}
async function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
export default (parameters={_:'default', obj:undefined})=>{
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
                        if(parameters['_'] === key){
                            await script(parameters[key])
                            try{
                                const { data } = await octokit.staticProperty.octokit.request("/user");
                                octokit.staticProperty.owner = data.login
                                localStorage.setItem('github', parameters[key]);
                                localStorage.setItem('login',data['login']);
                                localStorage.setItem('avatar_url',data['avatar_url']);
                                localStorage.setItem('name',data['name']);
                                localStorage.setItem('html_url',data['html_url']);
                                out(data)
                            }catch (e) {
                                localStorage.removeItem('github');
                                out({error:e,status:undefined})
                            }
                        }else{
                            console.warn('условие не проходит',parameters['_'] , '!==',  key)
                        }
                        break
                    case "get":
                        if(parameters[key] === parameters['_']){
                            if(isEmpty(octokit.staticProperty.octokit)){
                                console.assert(false, 'нужно авторизоваться')
                            }else{


octokit.staticProperty.repo =  await fetch('https://api.github.com/graphql', {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "authorization": "Bearer 469ef2375fb227724168f49cc182aedfa5dafe31"
                                    },
                                    body:JSON.stringify({
                                        query: `
{
    repository(name: "${parameters['repo']}", owner: "zababurinsv") {
    id
    descriptionHTML
    name
    openGraphImageUrl
    isPrivate
    }
}
                                    `})
                                })
octokit.staticProperty.repo = await octokit.staticProperty.repo.json()

                                out(octokit.staticProperty.repo)
                            }
                        }
                        break
                    case "create":
                        if(parameters[key] === parameters['_']){
                            if(isEmpty(octokit.staticProperty.octokit)){
                                console.assert(false, 'нужно авторизоваться')
                            }else{
                                octokit.staticProperty.repo =  await fetch('https://api.github.com/graphql', {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "authorization": "Bearer 469ef2375fb227724168f49cc182aedfa5dafe31"
                                    },
                                    body:JSON.stringify({
                                        query: `
mutation create {
  __typename
  createRepository(input: {name: "${parameters.create}", visibility: PRIVATE, description: "${parameters.create}", template: false, hasIssuesEnabled: true, hasWikiEnabled: true}) {
    clientMutationId
    repository {
      descriptionHTML
      homepageUrl
      id
      owner {
        id
      }
      createdAt
      name
    }
  }
}
                                    `})
                                })
                                octokit.staticProperty.repo = await octokit.staticProperty.repo.json()

                                out(octokit.staticProperty.repo)
                            }
                        }
                        break
                    case "file":
                        if(parameters[key] === parameters['_']){
                            if(isEmpty(octokit.staticProperty.octokit)){
                                console.assert(false, 'нужно авторизоваться')
                            }else{
                                octokit.staticProperty.file =  await fetch(`https://api.github.com/repos/zababurinsv/${parameters.repo}/contents/${parameters.file}.mjs`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "authorization": "Bearer 469ef2375fb227724168f49cc182aedfa5dafe31"
                                    },
                                    body:JSON.stringify({
                                        "message": `update`,
                                        "committer": {
                                            "name": "Zababurin Sergey",
                                            "email": "s.zababurin.v@gmail.com"
                                        },
                                        "content": "bXkgbmV3IGZpbGUgY29udGVudHM="
                                    })
                                })
                                octokit.staticProperty.file = await octokit.staticProperty.file.json()

                                out(octokit.staticProperty.file)
                            }
                        }
                        break
                    case "getfile":
                        if(parameters[key] === parameters['_']){
                            if(isEmpty(octokit.staticProperty.octokit)){
                                console.assert(false, 'нужно авторизоваться')
                            }else{
                                octokit.staticProperty.file =  await fetch(`https://api.github.com/repos/zababurinsv/${parameters.repo}/contents/${parameters.getfile}.mjs`, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "authorization": "Bearer 469ef2375fb227724168f49cc182aedfa5dafe31"
                                    }
                                })
                                octokit.staticProperty.file = await octokit.staticProperty.file.json()

                                out(octokit.staticProperty.file)
                            }
                        }
                        break
                    case "save":
                        if(parameters[key] === parameters['_']){
                            if(isEmpty(octokit.staticProperty.octokit)){
                                console.assert(false, 'нужно авторизоваться')
                            }else{
                                octokit.staticProperty.file =  await fetch(`https://api.github.com/repos/zababurinsv/${parameters.repo}/contents/${parameters.file}.mjs`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "authorization": "Bearer 469ef2375fb227724168f49cc182aedfa5dafe31"
                                    },
                                    body:JSON.stringify({
                                        "message": `update`,
                                        "committer": {
                                            "name": "Zababurin Sergey",
                                            "email": "s.zababurin.v@gmail.com"
                                        },
                                        "content":`${parameters.save}`,
                                        "sha": parameters.sha
                                    })
                                })
                                octokit.staticProperty.file = await octokit.staticProperty.file.json()

                                out(octokit.staticProperty.file)
                            }
                        }
                        break
                    case "commits":
                        if(parameters[key] === parameters['_']){
                            if(isEmpty(octokit.staticProperty.octokit)){
                                console.assert(false, 'нужно авторизоваться')
                            }else{
                                octokit.staticProperty.commits =  await fetch(`https://api.github.com/repos/zababurinsv/images/commits/master`, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "authorization": "Bearer 469ef2375fb227724168f49cc182aedfa5dafe31"
                                    }
                                })
                                octokit.staticProperty.commits = await octokit.staticProperty.commits.json()

                                out(octokit.staticProperty.commits)
                            }
                        }
                        break
                    case "decoder":
                        if(parameters[key] === parameters['_']){
                                out(await b64DecodeUnicode(parameters.decoder))
                        }
                        break
                    case "encoder":
                        if(parameters[key] === parameters['_']){
                            out(await b64EncodeUnicode(parameters.encoder))
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