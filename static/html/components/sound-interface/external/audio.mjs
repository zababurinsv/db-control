export default async (v,p,c,obj,r) => {
    let audio = obj['this']['shadowRoot'].querySelector('#audio-file')



        // if (navigator.mediaDevices === undefined) {
        //     navigator.mediaDevices = {};
        // }
        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        // if (navigator.mediaDevices.getUserMedia === undefined) {
        //     navigator.mediaDevices.getUserMedia = function(constraints) {
        //
        //         First get ahold of the legacy getUserMedia, if present
                // var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                //
                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                // if (!getUserMedia) {
                //     return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                // }
                //
                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                // return new Promise(function(resolve, reject) {
                //     getUserMedia.call(navigator, constraints, resolve, reject);
                // });
            // }
        // }
        // var source;
        // var stream;
        // var soundSource;
        // var context = new (window.AudioContext || window.webkitAudioContext)();
        // var audioStack = [];
        // var nextTime = 0;
        // fetch('/static/html/components/sound-interface/external/file_example_WAV_2MG.wav')
        //     .then(function(response) {
        //         console.assert(false)
                // var reader = response.body.getReader();
                // var header = null;//first 44bytes
                //
                // function appendBuffer( buffer1, buffer2 ) {
                //     var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
                //     tmp.set( new Uint8Array( buffer1 ), 0 );
                //     tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
                //     return tmp.buffer;
                // }
                //
                // function read() {
                //     return reader.read().then(async ({ value, done })=> {
                //
                //         var audioBuffer = null;
                //         if (header == null){
                //             copy first 44 bytes (wav header)
                            // header = value.buffer.slice(0,44);
                            // audioBuffer = value.buffer;
                        // }else{
                        //     audioBuffer = await appendBuffer(header,value.buffer);
                        // }
                        //
                        // context.decodeAudioData(audioBuffer, function(buffer) {
                        //
                        //     audioStack.push(buffer);
                        //     if (audioStack.length) {
                        //         scheduleBuffers();
                        //     }
                        // }, function(err) {
                        //     console.log("err(decodeAudioData): "+err);
                        // });
                        // if (done) {
                        //     console.log('done');
                        //     return;
                        // }
                        // read next buffer
                        // read();
                    // });
                // }
                // read();
                // function scheduleBuffers() {
                //     while ( audioStack.length) {
                //         var buffer    = audioStack.shift();
                //         var source    = context.createBufferSource();
                //         source.buffer = buffer;
                //         source.connect(context.destination);
                //         if (nextTime == 0)
                //             nextTime = context.currentTime + 0.02;  /// add 50ms latency to work well across systems - tune this if you like
                //         source.start(nextTime);
                //         nextTime += source.buffer.duration; // Make the next buffer wait the length of the last buffer before being played
                //
                //     }
                // }
            // })




        // var reader1 = new FileReader();
        // reader1.onload = function(ev) {
        //     let audioCtx = new (AudioContext || webkitAudioContext)();
        //     audioCtx.decodeAudioData(ev.target.result).then(function(buffer) {
        //         let soundSource = audioCtx.createBufferSource();
        //         soundSource.buffer = buffer;
        //         soundSource.connect(audioCtx.destination);
        //         soundSource.start(0);
        //     });
        // }
        // reader1.readAsArrayBuffer(event.path[0].files[0]);


    return {v,p,c,obj,r}
}