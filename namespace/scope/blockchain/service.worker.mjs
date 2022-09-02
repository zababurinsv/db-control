import * as Comlink from "/modules/comlink/dist/esm/comlink.min.mjs";

let CACHE_NAME = "@newkind/cache@0.1.1";
let urlsToCache = [
    '/blockchain/web/blockviewer.html',
    '/blockchain/web/console.html',
    '/blockchain/web/dapp-edit.html',
    '/blockchain/web/explorer.html',
    '/blockchain/web/history.html',
    '/blockchain/web/map.html',
    '/blockchain/web/monitor.html',
    '/blockchain/web/network.html',
    '/blockchain/web/nw-loading.html',
    '/blockchain/web/password.html',
    '/blockchain/web/stat.html',
    '/blockchain/web/tera.ico',
    '/blockchain/web/wallet.html',
    '/blockchain/web/web3-wallet.html',
    '/blockchain/web/web-wallet.html'
];
//1s
let CONFIG = {
    CACHE: CACHE_NAME,
    URLS: urlsToCache,
    AllowList: [CACHE_NAME],
    timeout: 0,
    memory: {},
    progressIndicatorUrls: "/\?requestId=/i;",
    strategy: {
        NetworkOrCache: false,
        CacheOnly: false,
        CacheAndUpdate: false,
        CacheUpdateAndRefresh: false,
        EmbeddedFallback: false
    },
    contentType: (destination) => {
        switch (destination) {
            case'audio':
                return 'audio/mpeg';
                break
            default:
                return false
                break
        }
    }
}

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CONFIG.CACHE)
            .then(cache => {
                console.log('💖 addAll', CONFIG.URLS)
                console.log('CONFIG.URLS', CONFIG.URLS)
                return cache.addAll(CONFIG.URLS);
            })
            .then(self.skipWaiting())
    );
    console.log('🖤 service install')
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim())
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (CONFIG.AllowList.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    console.log('🖤 service activate')
});

self.addEventListener('notificationclick', function(event) {
    console.log('🖤 service notificationclick', event)
    // event.notification.close();df

    // var promise = new Promise(function(resolve) {
    //     setTimeout(resolve, 1000);
    // }).then(function() {
    //     return clients.openWindow(event.data.locator);
    // });
    //
    // event.waitUntil(promise);
});

self.addEventListener('push', function(event) {
    console.log('🖤 service push', event)
    // console.log('Received a push message', event);
    // let title = 'Yay a message.';
    // let body = 'We have received a push message.';
    // let icon = '/images/icon-192x192.png';
    // let tag = 'simple-push-demo-notification-tag';
    // event.waitUntil(
    //     self.registration.showNotification(title, {
    //         body: body,
    //         icon: icon,
    //         tag: tag
    //     })
    // );
});

self.addEventListener('sync', (event) => {
    console.log('🖤 service sync', event)
    // console.log('event sync', event)
    // if (event.tag == 'event1') {f
    //     event.waitUntil(doSomething())
    // }вввпарапsssssssssss
})

self.addEventListener('fetch', event => {
    console.log('🖤 service fetch', event.request.url)
    if(CONFIG.strategy.NetworkOrCache) {
        event.respondWith(fromNetwork(event.request, CONFIG.timeout)
            .catch((err) => {
                //console.log(`Error: ${err.message()}`);
                fromCache(event.request);
                // .catch(() => return useFallback()));
            }));
    } else if(CONFIG.strategy.CacheOnly) {
        event.respondWith(fromCache(event.request));
    } else if(CONFIG.strategy.CacheAndUpdate) {
        event.respondWith(fromCache(event.request));
        event.waitUntil(update(event.request));
    } else if(CONFIG.strategy.CacheUpdateAndRefresh) {
        // Как и в предыдущем примере, сначала `respondWith()` потом `waitUntil()`
        event.respondWith(fromCache(event.request));
        event.waitUntil(
            update(event.request)
                // В конце, после получения "свежих" данных от сервера уведомляем всех клиентов.
                .then(refresh)
        );
    } else {
        event.respondWith(fetch(new Request(event.request,{ headers: {
                'Content-Type': CONFIG.contentType(event.request.destination)
            }}))
            .then(response => {
                    //console.log('*** service response ***')
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    return response;
                }
            ).catch(() => useFallback() )
        );
    }
})

self.addEventListener("message", async (event) => {
    console.log('🖤 🌼 service message', event.data)
    if (event.data && event.data.state && event.data.state.isConnected && event.data.state.type === "proxy-memory") {
        console.log('🖤 🌼 service message', event.data.state)
        for(let port in event.data.state.to) {
            CONFIG.memory = Comlink.wrap(event.data.state.to[port])
        }
        console.log('🖤 🌼 🎫 service message', event.data.state)
        event.source.postMessage({
            state: {
                'proxy-memory': true
            }
        })
    } else {
        if(event.data.test) {
            // await CONFIG.memory.fs.list.dir()
            console.log('🖤 🌼 🎫 service message', event.data.state)
            event.source.postMessage({
                state: {
                    '~~~~~ test ~~~~~': true
                }
            })
        }
    }
});

function fromNetwork(request, timeout) {
    return new Promise((fulfill, reject) => {
        let timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(CONFIG.CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}

function update(request) {
    return caches.open(CONFIG.CACHE).then((cache) =>
        fetch(request).then((response) =>
            // cache.put(request, response)
            cache.put(request, response.clone()).then(() => response)
        )
    );
}

// Шлём сообщения об обновлении данных всем клиентам. dd
function refresh(response) {
    return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            // Подробнее про ETag можно прочитать тут
            // https://en.wikipedia.org/wiki/HTTP_ETag
            const message = {
                type: 'refresh',
                url: response.url,
                eTag: response.headers.get('ETag')
            };
            // Уведомляем клиент об обновлении данных.
            client.postMessage(JSON.stringify(message));
        });
    });
}

const FALLBACK = `
<html>
<head>
<title>Elite</title>
<style>
body {
  padding: 3em 0em;
  background: #eeeeee;
}
hr {
  color: lightgray;
  width: 100%;
}
img {
  float: left;
  opacity: .8;
}
#box {
  background: white;
  border: 1px solid lightgray;
  width: 600px;
  padding: 60px;
  margin: auto;
}
h1 {
  font-size: 130%;
  font-weight: bold;
  border-bottom: 1px solid lightgray;
  margin-left: 48px;
}
h2 {
  font-size: 100%;
  font-weight: normal;
  border-bottom: 1px solid lightgray;
  margin-left: 48px;
}
ul {
  font-size: 80%;
  padding-left: 48px;
  margin: 0;
}
#reloadButton {
  padding-left: 48px;
}
</style>
</head>
<body>
  <div id="box">
    <img src="data:image/png;base64, AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbbv+DGW3/mRlt/5kZbf+ZGq6/hIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGa3/ohkt/7/Zbj//2S3/v9lt/6WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGm5/iRlt/74Zbj//2W4//9luP//Zbf++mi4/i4gIPciGhr24hsb9uwbG/bsGhr24CEh9xoAAAAAAAAAAAAAAABnuP5mZLf+/2W4//9luP//Zbj//2S3/v9muP5yGBj2rhMT9v8TE/b/ExP2/xMT9f8YGPWkAAAAAAAAAAAAAAAAb7z/BGW3/tZluP//Zbj//2W4//9lt/7gJzH3ShMT9f8TE/b/ExP2/xMT9v8TE/b/ExP1/CAg9joAAAAAAAAAAAAAAABmuP5GZLf+6GS3/uhkt/7oZbf+UhgY9YQSEvX/ExP2/xMT9v8TE/b/ExP2/xIS9f8aGvZ8AAAAAD4++gQgIPZ6IiL2hiIi9oYgIPZ8KCj5BAAAAAAtLfgUFBT17BMT9v8TE/b/ExP2/xMT9v8VFfXoLCz4DgAAAAAaGvZqEhL1/xMT9v8TE/b/EhL1/xsb9nIAAAAAAAAAABwc9m4SEvX/ExP2/xMT9v8SEvX/HR32ZAAAAAAnJ/gSFRX16hMT9v8TE/b/ExP2/xMT9v8UFPXuJyf4Fp2xlAKNnqUYLC/mfhYW83ATE/VuFxf1aDc3+gIAAAAAGBj1fhIS9f8TE/b/ExP2/xMT9v8TE/b/ExP1/xkZ9YaGn3yIhZ57/4Wee/+Gn3yKAAAAAAAAAAAAAAAAAAAAACMj9zYTE/X8ExP2/xMT9v8TE/b/ExP2/xMT9f9JUshihZ57+IaffP+Gn3z/hZ579oigfiYAAAAAAAAAAAAAAAAAAAAAGBj1oBIS9f8TE/b/ExP2/xMT9f8YGPWmiKB+PIWee/+Gn3z/hp98/4Wee/+HoH06AAAAAAAAAAAAAAAAAAAAACUl9xgVFfXOExP11BMT9dQUFPXQJib3HgAAAACGn3ymhp98/4affP+Gn3ymAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiKB+EIihf0CIoX9AiKB+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADg/wAA4MMAAOCBAADggQAA8QEAAOeBAADDwwAAgf8AAIAPAACBDwAAgQ8AAMMPAAD//wAA//8AAA==" width="32" height="32"/>
    <h1>Elite</h1>
    <h2>When connecting to: https://zababurinsv.github.io/newkind-service/</h2>
    <ul>
      <li>Check the address for errors such as <b>ww</b>.example.com
      instead of <b>www</b>.example.com</li>
      <li>If the address is correct, try checking the network
      connection.</li>
      <li>If your computer or network is protected by a firewall or
      proxy, make sure that the browser demo is permitted to access
      the network.</li>
    </ul>
    <br/><br/>
  </div>
</body>
</html>
`

function useFallback() {
    return Promise.resolve(new Response(FALLBACK, { headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }}));
}
