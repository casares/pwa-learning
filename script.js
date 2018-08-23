/* Registro de un Service Worker */
(()=>{
    if ( 'serviceWorker' in navigator ) { // Si el navegador soporta Services Workers
        window.addEventListener("load", () => { // Handler para que se registre al cargar la ventana
            var registerServiceWorker = navigator.serviceWorker.register("./sw.js"); // Se registra en el objeto navigator
            registerServiceWorker //El registro devuelve una promesa
                .then( registration => { //Si la promesa se resuelve
                    console.log(registration);
                    console.log("Service Worker registrado con éxito", registration.scope);
                    //imprime el acceso que tiene el Service Worker
                    //en este caso todo el servidor porque así lo definimos en manifest.json (propiedad "scope")
                })
                .catch( err =>{//Si la promesa se rechaza
                    console.log("Registro de Service Worker fallido", err);
                });
        });
    }


/* Lanzar una notificacion, pidiendo permiso al usuario*/
/* Esto se ha pasado al service worker*/

    /* if(window.Notification && Notification.permission !== "denied"){
        Notification.requestPermission(status =>{
            console.log("Notification: Estado del permiso de notificaciones: " + status);
            let notification = new Notification(
                "Notificación de Prueba",
                {
                    body:"PWA notificación",
                    icon: "./img/icons/icon_128x128.png",
                }
            );
        });
    } */
})();

(()=>{
    const headerElement = document.querySelector(".header");
    const metaTagThemeElement = document.querySelector("meta[name=theme-color]");
    function networkStatus(event){
        console.log("[networkStatus] Event:" + event);
        console.log("[networkStatus] Event type:" + event.type);
        if (navigator.onLine) {
            metaTagThemeElement.setAttribute("content","gray");
        } else {
            metaTagThemeElement.setAttribute("content", "#F0CBCB");
        }
    }
    document.addEventListener("DOMContentLoaded",event =>{
        if (!navigator.onLine){
            console.log("[DOM Content Loaded Handler] there de object this is:" + this);
            netWorkStatus(this);
        }
        window.addEventListener("online",networkStatus);
        window.addEventListener("offline",networkStatus);
    });
})();