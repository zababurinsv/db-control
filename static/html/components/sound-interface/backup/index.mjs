import sndlib from "/static/html/components/sound-interface/external/wasm/dist/sndfile.js";
import audio from "/static/html/components/sound-interface/external/audio.mjs";

export default async (v,p,c,obj,r) => {
    await audio(v,p,c,obj,r)
    sndlib({
        onRuntimeInitialized() {
            let     canvas = obj['this']['shadowRoot'].querySelector('#can');
            let     Module = this
            let 	gstartframe; 			// global file start frame offset
            let 	gframescount;			// 10000;

            let 	gcachestartframe;		// cache buffer start frame offset
            let 	gcacheframescount;      // 1000;

            let 	gcachedb;			    // cache data buffer

            let 	gchannels;
            let	    gerror;
            let 	gintervalId;

            let     source;
            let     voiceSelect = obj['this']['shadowRoot'].querySelector("#voice");
            let     mute = obj['this']['shadowRoot'].querySelector('.mute'); // mute button
            // console.assert(false, audioCtx)

// event listeners to change visualize and voice settings


            function getcachedatabuffer( cachestartframe, cacheframescount ) {
                try {
                    if ( gcachedb == null )
                        return null;

                    var itemscount = 0;

                    if ( (gcachedb.length - cachestartframe * gchannels) >= (cacheframescount * gchannels) ) {
                        itemscount = cacheframescount * gchannels;
                    } else {
                        if ( (gcachedb.length - cachestartframe * gchannels) > 0 ) {
                            itemscount = gcachedb.length - cachestartframe * gchannels;
                        } else {
                            return new Float64Array();
                        }
                    }

                    return gcachedb.subarray(cachestartframe*gchannels, cachestartframe*gchannels + itemscount);

                } catch (e) {
                    console.log(e);
                    throw e;
                }
            }

            function getdatabuffer( filename, startframe, framescount ) {
                var retptr = null;
                try {
                    ///////////////////////////////////////
                    //| ----- | ----- | -----------------
                    //|   0   |   1   | samples
                    //| ----- | ----- | -----------------
                    //|       |       | channel = 0x01
                    //| frame | frame | -----------------
                    //|       |       | channel = 0x02
                    //| ----- | ----- | -----------------
                    ///////////////////////////////////////
                    // count = frame * channels

                    let exchangedb = new Float64Array(framescount * gchannels);

                    //////////////////////
                    // for tests...
                    //				for (i=0; i<10; i++) {
                    //					exchangedb[i] = 3.14 * i;
                    //				}

                    var totalcount = exchangedb.length * exchangedb.BYTES_PER_ELEMENT;
                    retptr = Module._malloc(totalcount);
                    var tempdb = new Uint8Array(Module.HEAPU8.buffer, retptr, totalcount);
                    tempdb.set(new Uint8Array(exchangedb.buffer));

                    var retvalue = Module.ccall(
                        'processsoundfile',
                        'number',
                        ['string','number','number', 'number'],
                        [filename, startframe, retptr, framescount]
                    );
                    return new Float64Array(tempdb.buffer, retptr, retvalue * gchannels);
                } catch (e) {
                    console.log(e);
                    throw e;
                } finally {
                    if ( retptr !== null )
                        Module._free( retptr );
                }
            }

            function defaultvalues() {
                gstartframe = 0; 		// global file start frame offset
                gframescount = 10000;		// global file frame count

                gcachestartframe = 0;		// cache buffer start frame offset
                gcacheframescount = 1000;      // cache buffer frame count

                gcachedb = null;		// cache data buffer
                gerror = null;

                gchannels = 0;
            }

            function terminate()
            {
                if (gintervalId > 0) {
                    clearInterval(gintervalId);
                    gintervalId = 0
                }
            }


            function calculatescale( maxlast, maxmedium, last ) {
                return ( ( maxlast * last ) / maxmedium );
            }


            function clear() {
                // var canvas = document.getElementById('can');
                if (canvas.getContext) {

                    let ctx = canvas.getContext('2d');

                    let origwidth = canvas.width;
                    let origheight = canvas.height;

                    ctx.clearRect(0, 0, origwidth, origheight);
                }
            }



            function draw( tempdb ) {
                if (canvas.getContext) {

                    let ctx = canvas.getContext('2d');

                    ctx.lineWidth = 1;

                    let origwidth = canvas.width;
                    let origheight = canvas.height;

                    ctx.save();

                    ctx.clearRect(0, 0, origwidth, origheight);

                    ctx.beginPath();

                    ctx.moveTo( 0, origheight / 2 );
                    ctx.lineTo( origwidth, origheight / 2 );

                    ctx.stroke();

                    ctx.beginPath();

                    let offsetx = 0;
                    let currentchannel = 0;

                    for ( let i = 0; i < ( tempdb.length / gchannels ); i++ ) {
                        let dindex = i * gchannels + currentchannel;

                        let tempx = 0;

                        if ( i === 0 ) {
                            offsetx = Math.trunc( calculatescale(origwidth, gcacheframescount, i) );
                            ctx.moveTo( offsetx, ( calculatescale(origheight / 2, 2, tempdb[dindex] ) + origheight / 2 ) );
                        }

                        tempx = Math.trunc( calculatescale(origwidth, gcacheframescount, i) );
                        //if ( tempx == offsetx )
                        //	continue;

                        offsetx = tempx;
                        ctx.lineTo( offsetx, ( calculatescale(origheight / 2, 2, tempdb[dindex] ) + origheight / 2 ) );
                    };

                    ctx.stroke();

                    ctx.restore();
                }
            }



            function processfileinput(fileinput) {

                if (fileinput.files.length === 0) {
                    return;
                } else {

                    let file = fileinput.files[0];

                    let filereader = new FileReader();

                    filereader.onload = function () {

                        var retptr = null;

                        try {
                            var retdata = new Uint8Array( filereader.result );
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The same interest result... //
/////////////////////////////////
//                                    FS.createDataFile('/', file.name, data, true, true, true);
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            retptr = Module._malloc( retdata.length * retdata.BYTES_PER_ELEMENT );
                            console.log('~~~~~~~~~~~~~~', retptr)
                            Module.HEAPU8.set( retdata, retptr );

                            var retvalue = Module.ccall(
                                'savesoundfile',
                                'number',
                                ['string','number','number'],
                                [file.name, retptr, retdata.length]
                            );

                            if ( retvalue > 0 ) {
                                gchannels = Module.ccall(
                                    'getchannels',
                                    'number',
                                    ['string'],
                                    [file.name]
                                );
                            } else {
                                throw "unable to save '" + file.name + "' file...";
                            }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Reset...                    //
/////////////////////////////////
//                                    fileInput.value = '';
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        } catch ( e ) {
                            gchannels = 0;
                            gerror = e;
                        } finally {
                            if ( retptr !== null )
                                Module._free( retptr );
                        }

                        if ( gerror ) throw gerror;

                    };

                    filereader.readAsArrayBuffer(file);

                }
            }

            let inputAudio = obj['this']['shadowRoot'].querySelector('#fileinput')
            inputAudio.addEventListener('change', (event) => {
                if (gintervalId > 0) {
                    clearInterval(gintervalId);
                    gintervalId = 0
                }

                clear();
                defaultvalues();

                processfileinput( inputAudio );
            });


            (async ()=>{

                defaultvalues();

                obj['this']['shadowRoot'].querySelector('#startbutton').addEventListener('click',
                    function() {
                        try {
                            var fileinput = obj['this']['shadowRoot'].querySelector('#fileinput');

                            if (fileinput.files.length === 0){
                                return;

                            } else {

                                var file = fileinput.files[0];

                                gintervalId = setInterval( function() {
                                    var exchangedb = getcachedatabuffer( gcachestartframe, gcacheframescount );
                                    if ( exchangedb == null ) {

                                        gstartframe = 0;
                                        gcachestartframe = 0;

                                        gcachedb = getdatabuffer( file.name, gstartframe, gframescount );
                                        if ( gcachedb.length > 0 ) {
                                            exchangedb = getcachedatabuffer( gcachestartframe, gcacheframescount );

                                            gstartframe += 100;
                                            gcachestartframe += 100;
                                        } else {
                                            console.log("stop1");
                                            terminate();
                                        }

                                    } else {
                                        if ( ( gcachedb.length / gchannels ) < gframescount ) {

                                            ////////////////////////////////////////////////
                                            // we don't need in read from file...

                                            if ( exchangedb.length === 0 ) {
                                                console.log("completed...");
                                                terminate();
                                            }

                                            gcachestartframe += 100;

                                        } else {
                                            if ( ( exchangedb.length / gchannels ) < gcacheframescount ) {
                                                gcachestartframe = 0;
                                                gcachedb = getdatabuffer( file.name, gstartframe, gframescount );
                                                if ( gcachedb.length > 0 ) {
                                                    exchangedb = getcachedatabuffer( gcachestartframe, gcacheframescount );

                                                    gstartframe += 100;
                                                    gcachestartframe += 100;
                                                } else {
                                                    console.log("stop2");
                                                    terminate();
                                                }
                                            } else {
                                                gstartframe += 100;
                                                gcachestartframe += 100;
                                            }
                                        }
                                    }

                                    draw( exchangedb );

                                }, 200 );
                            }
                        } catch (e) {
                            gchannels = 0;
                            gerror = e;
                        }

                        if (gerror) throw gerror;
                    }
                );

                obj['this']['shadowRoot'].querySelector('#stopbutton').addEventListener('click',(e) => {
                        terminate();
                    }
                );

            })()
        }
    })

    return { v,p,c,obj,r }
}