import sndlib from "/static/html/components/sound-interface/external/wasm/dist/sndfile.js";
import audio from "/static/html/components/sound-interface/external/audio.mjs";

export default async (v,p,c,obj,r) => {
    sndlib({
        onRuntimeInitialized() {
            let     Module = this
            let     retptr = null;
            let 	gchannels;

            console.log('~~~~~~~~~~~~~~~~~', Module)
            let exchangedb = new Float64Array(framescount * gchannels);
            let totalcount = exchangedb.length * exchangedb.BYTES_PER_ELEMENT;
            retptr = Module._malloc(totalcount);

        }
    })
    return { v,p,c,obj,r }
}