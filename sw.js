// Le damos un nombre para poder acceder a la cache
const 
    CACHE_NAME = "pwa-cache-v1",
    URLS_CACHE = [
        "./",
        "/",
        "./?utm=homescreen",
        "./index.html",
        "./index.html?utm=homescreen",
        "./favicon.ico",
        "./script.js",
        "./styles.css",
    ];

var handlerSwInstall = (event) => {
    console.log('[SW Install] run');
    event.waitUntil(
        caches.open(CACHE_NAME) // This can fail if URLS-CACHE return a 404 error
            .then( cache => {
                console.log("[SW Install] Archivos en cache");
                return cache.addAll(URLS_CACHE);
            })
            .then(()=>{
                self.skipWaiting(); // Fuerza al SW a activarse
            })
            .catch( error => {
                console.log("[SW Install] Error al abrir la cache \n" + error.message);
            })
    );
    
};

var handlerSwActivate = (event) => {
    console.log('[SW Activate] run');
    const cacheList = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(cachesNames =>{
                return Promise.all(
                    cachesNames.map(cacheName=>{
                        if(cacheList.indexOf(cacheName) === -1){ //No está en cache
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(()=>{
                console.log("[SW Activate] El cache está limpio y actualizado");
                return self.clients.claim();
            })
            .catch(
                error => {
                    console.log("[SW Activate] Error " + error.message)
                }
            )
    );
};

var handlerSwFetch = (event) => {
    console.log('[SW Fetch] run');
    event.respondWith(
        caches.match(event.request)
        .then(res =>{
            if(res){
                return res;
            }
            return fetch(request)
                .then(res=>{
                    let resToCache = res.clone();
                    caches.open(CACHE_NAME)
                    .then(cache=>{
                        cache
                            .put(request, resToCache)
                            .catch(error=>{
                                console.log(`${request.url}`, `[SW Fetch] ${error.message}`);
                            })
                    })
                })
        })
        .catch(error =>{
            console.log("[SW Fetch:] " + error.message)
        })
    );
};

var handlerSwPush = (event) => {
    console.log(event);
    console.log("[SW Push]");
    let pushTitle = "PWA First";
    let pushOptions = {
            body:"PWA notificación",
            icon: "./img/icons/icon_256x256.png",
            actions: [
                {
                    "action": "SI",
                    "title": "Me encanta la app",
                    "icon": "./img/icons/happy.png"
                },
                {
                    "action": "NO",
                    "title": "Odio la app",
                    "icon": "./img/icons/sad.png"
                }            
            ]
        };
    event.waitUntil(
        self.registration.showNotification(pushTitle, pushOptions)
    );
};

var handlerSwClickNotification = (event) => {
    if (event.action === "SI"){
        console.log("EL usuario pinchó en SI");
        clients.openWindow("https://google.com");
    } else {
        console.log("El usuario pinchó en NO");
    }
    event.notification.close();
}

self.addEventListener("install", handlerSwInstall);
self.addEventListener("activate", handlerSwActivate);
self.addEventListener("fetch", handlerSwFetch);
self.addEventListener("push", handlerSwPush);
self.addEventListener("clickNotification", handlerSwClickNotification);