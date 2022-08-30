import { Application } from './renderer.mjs';

const canvas = document.getElementById('gfx');
const renderer = new Application(canvas);

function setCanvasSize(canvas)
{
    const devicePixelRatio = window.devicePixelRatio || 1;

    const borderSize = (window.innerWidth * devicePixelRatio) / 6;
    canvas.width = ((window.innerWidth * devicePixelRatio) - borderSize) & ~3;
    canvas.height = ((window.innerHeight * devicePixelRatio) - borderSize) & ~3;
}

setCanvasSize(canvas);

/*
window.addEventListener('resize', async ()=>{
	setCanvasSize(canvas);
    await renderer.restart();
}, true);
*/

renderer.start();

