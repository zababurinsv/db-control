
    let  eventSource = new window.EventSource(`http://localhost:7777/event-stream`);
    eventSource.addEventListener('open', function(event) {
        console.log("Connection")
    }, false)
    eventSource.addEventListener('error', function(event) {
        if (event.readyState == EventSource.CLOSED) {
            console.log("Connection was closed")
        }
    }, false)
    eventSource.addEventListener('message', (event) => {
        console.log('~~~~~~~sss~~~~~~~~', event)
    },false);




    document.querySelector('.client-address').addEventListener('click',async (event)=>{

        let formData = new FormData();

        formData.append("address", event.target.parentNode.querySelector('#client-address').value)

        fetch(`http://localhost:7777/show-add`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                // console.log('~~~~~~~~~~~~',app)
                // document.querySelector('#client-info').innerHTML = ''
                // document.querySelector('#client-message').innerHTML = ''
                // document.querySelector('#client-info').innerHTML = app['info']
                // document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })

    document.querySelector('.client-testgiver').addEventListener('click',async (event)=>{

        let formData = new FormData();

        formData.append("address", event.target.parentNode.querySelector('#client-testgiver').value)
        formData.append("name", event.target.parentNode.querySelector('#client-accountName').value)

        fetch(`http://localhost:7777/testgiver`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                // console.log('~~~~~~~~~~~~',app)
                // document.querySelector('#client-info').innerHTML = ''
                // document.querySelector('#client-message').innerHTML = ''
                // document.querySelector('#client-info').innerHTML = app['info']
                // document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('.client-sendfile').addEventListener('click',async (event)=>{

        let formData = new FormData();
        formData.append("name", event.target.parentNode.querySelector('#client-sendfile').value)

        fetch(`http://localhost:7777/sendfile`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
        .then(function (app) {
            // console.log('~~~~~~~~~~~~',app)
            // document.querySelector('#client-info').innerHTML = ''
            // document.querySelector('#client-message').innerHTML = ''
            // document.querySelector('#client-info').innerHTML = app['info']
            // document.querySelector('#client-message').innerHTML = app['msg']
        })
        .catch(function (error) {
            console.warn( 'error', error)
        })

    })

    document.querySelector('.fift-createWallet').addEventListener('click',async (event)=>{
        // console.assert(false, event.target.parentNode.querySelector('#client-getaccount').value)
        let formData = new FormData();
        // console.assert(false, event.target.parentNode.querySelector('#fift-createWallet').value)
        formData.append("name", event.target.parentNode.querySelector('#fift-createWallet').value)

        fetch(`http://localhost:7777/createWallet`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                // document.querySelector('#client-info').innerHTML = ''
                // document.querySelector('#client-message').innerHTML = ''
                // document.querySelector('#client-info').innerHTML = app['info']
                // document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-run').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/start`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
        .then(function (app) {
            document.querySelector('#client-info').innerHTML = ''
            document.querySelector('#client-message').innerHTML = ''
            document.querySelector('#client-info').innerHTML = app['info']
            document.querySelector('#client-message').innerHTML = app['msg']
        })
        .catch(function (error) {
            console.warn( 'error', error)
        })
        
    })
    document.querySelector('#client-quit').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/quit`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })

    document.querySelector('#client-account').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/account`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {

              console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-help').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/help`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-time').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/time`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-remote-version').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/remote-version`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-last').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/last`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })


    document.querySelector('#client-status').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/status`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('.client-getaccount').addEventListener('click',async (event)=>{

        // console.assert(false, event.target.parentNode.querySelector('#client-getaccount').value)

        let formData = new FormData();


        formData.append("account", event.target.parentNode.querySelector('#client-getaccount').value);

        fetch(`http://localhost:7777/getaccount`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('.client-runmethod').addEventListener('click',async (event)=>{

        let formData = new FormData();
        formData.append("account", event.target.parentNode.querySelector('#client-runmethod').value);
        fetch(`http://localhost:7777/runmethod`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-allshards').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/allshards`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })

    document.querySelector('#client-getconfig').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/getconfig`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-getconfigfrom').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/getconfigfrom`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-saveconfig').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/saveconfig`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-gethead').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/gethead`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-getblock').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/getblock`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-dumpblock').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/dumpblock`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-getstate').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/getstate`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-dumpstate ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/dumpstate `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-dumptrans ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/dumptrans `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-lasttrans ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/lasttrans `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-listblocktrans ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/listblocktrans `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-blkproofchain ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/blkproofchain `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-byseqno').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/byseqno`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-bylt').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/bylt`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-byutime').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/byutime`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-quit').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/quit`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })