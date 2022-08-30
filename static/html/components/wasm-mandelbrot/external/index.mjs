import wasm from "/static/html/components/wasm-mandelbrot/external/wasm/dist/index.js";
export default async (v,p,c,obj,r) => {
    const canvasMandelbrotTiled = obj['this']['shadowRoot'].querySelector('#mandelbrotTiled');
    const context = canvasMandelbrotTiled.getContext('2d');
    wasm({
        onRuntimeInitialized() {
            const width = canvasMandelbrotTiled.clientWidth;
            const height = canvasMandelbrotTiled.clientHeight;
            if (canvasMandelbrotTiled.width !== width || canvasMandelbrotTiled.height !== height) {
                canvasMandelbrotTiled.width = width;
                canvasMandelbrotTiled.height = height;
            }
            const mandelbrot = new this['Mandelbrot'](width, height,1, -0.5, 0);

            function drawTile() {
                const tile = mandelbrot.nextTile();
                if (tile) {
                    const imageData = new ImageData(new Uint8ClampedArray(tile.data), tile.width, tile.height);
                    context.putImageData(imageData, tile.x, tile.y);
                    window.requestAnimationFrame(drawTile);
                }
            }
            window.requestAnimationFrame(drawTile);
        }
    })

    return { v,p,c,obj,r }
}