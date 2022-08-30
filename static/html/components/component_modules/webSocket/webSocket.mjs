let object = {}
object['staticProperty'] = []
object['staticProperty']['socket'] = undefined
object['staticProperty']['verify'] = true
object['staticProperty']['create'] = (url) =>{
    if(object['staticProperty']['socket'] === undefined){
        object['staticProperty']['verify'] = false
        object['staticProperty']['socket'] = new WebSocket("ws://tunnel-reverse.herokuapp.com");
    }else{
        object['staticProperty']['verify'] = true
    }
    return object['staticProperty']['socket']
}
export default async (obj)=>{
    return new Promise((resolve, reject) => {
        object['socketProtocol'] =  'wss'
        object['class'] = class WebSocket {
            constructor(name) {
                this.socket = object['staticProperty']['create']("ws://tunnel-reverse.herokuapp.com");
                if( object['staticProperty']['verify'] === true){

                }else{
                    this.socket.onopen = function() {
                        console.log('connect is open')
                        let openConnect = new CustomEvent('openConnect', {
                            detail: {
                                data:'openConnect'
                            }
                        })
                        document.dispatchEvent(openConnect)
                    };
                    this.socket.onclose = function(event) {
                        if (event.wasClean) {
                            // alert('Соединение закрыто чисто');
                            console.log('Соединение закрыто чисто')
                            object['staticProperty']['socket'] = undefined
                        } else {
                            console.log('Обрыв соединения')
                            object['staticProperty']['socket'] = undefined
                        }
                        console.log('Код: ' + event.code )
                        // alert('Код: ' + event.code + ' причина: ' + event.reason);
                    };
                    this.socket.onerror = function(error) {
                        alert("Ошибка " + error.message);
                    };
                    this.socket.addEventListener('message', function (event) {
                        console.log('response~~~~~~~',event)
                    });
                }
            }

            self() {
                return object
            }
        }
        resolve(object)
    })
}