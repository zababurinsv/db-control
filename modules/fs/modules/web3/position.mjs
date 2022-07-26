import {pixelToVW} from './convert.mjs'
let develop = false
let element, bbox, inputX, inputY, offsetX, offsetY, raf;

export default (container) => {
    let state = { distX: 0, distY: 0 };
    function userPressed(event) {
        // element = event.target
        console.log('~~ userPressed ~~')
        // if (element.classList !== container.classList) {
            bbox = container.getBoundingClientRect()
            offsetX = bbox.x - event.clientX
            offsetY = bbox.y - event.clientY
            inputX = bbox.x
            inputY = bbox.y
            console.log(bbox.x, bbox.y, inputX, inputY)
            container.addEventListener('mousemove', userMoved, { passive: false });
            container.addEventListener('mouseup', userReleased, { passive: false });
        // }
    }

    function userMoved(event) {
        container.style.left = pixelToVW((event.clientX + offsetX)) + "vw";
        container.style.top = pixelToVW((event.clientY + offsetY)) + "vw";
    }

    function userReleased(event) {
        // let dir = window.zb.fs['/header'].readdir('/header')
        // let key = dir.find(item => item ===  `${element.classList[0]}`)
        // if(key === undefined) {
            // window.zb.fs['/header'].createDataFile('/header',`${element.classList[0]}`, JSON.stringify({
            //     left: `${element.style.left}`,
            //     top: `${element.style.top}`
            // }), true,true);
            // window.zb.fs['/header'].syncfs(false , (err) => { });
        // } else {
            // console.assert(false, key, element.style.left)
            // window.zb.fs['/header'].writeFile(`/header/${element.classList[0]}`,JSON.stringify({
            //     left: `${element.style.left}`,
            //     top: `${element.style.top}`
            // }));
            // window.zb.fs['/header'].syncfs(false , (err) => {  });
        // }
        container.removeEventListener('mousemove', userMoved, { passive: false });
        container.removeEventListener('mouseup', userReleased, { passive: false });
    }

    // container.addEventListener('pointerdown', userPressed, { passive: false });
    container.addEventListener('pointerdown', userPressed);

    return {
        status: true,
        message: null
    }
}
