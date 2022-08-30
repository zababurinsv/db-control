import isEmpty from "/home/sergey/PhpstormProjects/system/core/docs/static/html/components/component_modules/isEmpty/isEmpty.mjs";

function photoshopDropShadow2CSSBoxShadow(color, opacity, angle, distance, spread, size) {
    // convert the angle to radians
    angle = (180 - angle) * Math.PI / 180;

    // the color is just an rgba() color with the opacity.
    // for simplicity this function expects color to be an rgb string
    // in CSS, opacity is a decimal between 0 and 1 instead of a percentage
    let outColor = "rgba(" + color + "," + opacity + ")";
   let colorInset = "rgba(" + color + "," + opacity * 0.3 + ")";
    // other calculations
    var offsetX = Math.round(Math.cos(angle) * distance) + "px",
        offsetY = Math.round(Math.sin(angle) * distance) + "px",
        spreadRadius = (size * spread / 100) + "px",
        blurRadius = (size - parseInt(spreadRadius, 10)) + "px";
    return {
        boxInset:offsetX + " " + offsetY + " " + blurRadius + " " + spreadRadius + " " + colorInset,
        box:offsetX + " " + offsetY + " " + blurRadius + " " + spreadRadius + " " + outColor,
        text:offsetX + " " + offsetY + " " + spreadRadius + " " + outColor
    }
}

function color(item) {
    let txt = false
    let rgb = {}
    if(!isEmpty(item.text)) {
        txt = true
        if(item.text.style.hasOwnProperty('fillColor')) {
            rgb = `${item.text.style.fillColor.r},${item.text.style.fillColor.g},${item.text.style.fillColor.b},${item.text.style.fillColor.a}`
        } else if (item.text.style.hasOwnProperty('strokeColor')) {
            rgb = `${item.text.style.strokeColor.r},${item.text.style.strokeColor.g},${item.text.style.strokeColor.b},${item.text.style.strokeColor.a}`
        } else {
            console.assert(false, item.text.style)
        }
    }
    return {
        status: txt,
        color: rgb
    }
}

function element(v,item,c,obj,r) {
    let out = {}
    if(isEmpty(obj['preset']['action'])) {
        console.warn('не выбран action для preset -а')
    } else {
        obj['preset']['action'](v,item,c,obj,r)
    }
}
export default (v,p,c,obj,r) =>{
    return new Promise(async (resolve, reject)=>{
            for(let item of p) {
                if((item.top * obj['PSD']['layout']['relation'])<= (obj['PSD']['layout'].innerHeight * obj['PSD']['layout'].relation)) {

                    console.log('$$~~~~~~~~~~ index.psd ~~~~~~~~~~$$>>>', {
                        name: item['name'].toLowerCase(),
                        origin: item,
                        effects: item.effects,
                        PSDheight:  obj['PSD']['layout'].innerHeight * obj['PSD']['layout'].relation,
                        objectHeight: item.top * obj['PSD']['layout']['relation']
                    })
                if(isEmpty(item.canvas)) {
                    console.warn('нет canvas', item)
                } else {
                    let shadow = {}
                    if(!isEmpty(item.effects)) {
                        shadow =  photoshopDropShadow2CSSBoxShadow(
                            `${item.effects.dropShadow.color.r},${item.effects.dropShadow.color.g},${item.effects.dropShadow.color.b}`,
                            item.effects.dropShadow.opacity,
                            item.effects.dropShadow.angle,
                            item.effects.dropShadow.distance.value,
                            item.effects.dropShadow.choke.value,
                            item.effects.dropShadow.size.value
                        )
                    }
                    let txt = color(item)
                    switch (item['name'].split(' ').length) {
                        case 1:
                            element(v, txt.status ? {
                                _: 'txt',
                                name:item['name'].toLowerCase(),
                                text: item.text.text,
                                slot:item['name'].toLowerCase(),
                                class:`${r}-${item['name'].toLowerCase()}`,
                                top:item.top * obj['PSD']['layout']['relation'],
                                left:item.left * obj['PSD']['layout']['relation'],
                                style: {
                                    shadow: shadow,
                                    name:item.text.style.font.name,
                                    fontFamily:`${item.text.style.font.name}, serif`,
                                    fontSize: parseFloat((item.text.style.fontSize * item.text.transform[0] * obj['PSD']['layout']['relation']).toFixed(1)),
                                    LineHeight: item.text.style.fontSize + (item.text.style.leading / 2),
                                    transform: item.text.transform,
                                    color: `rgba(${txt.color})`,
                                    top: item.top * obj['PSD']['layout']['relation'],
                                    left: item.left * obj['PSD']['layout']['relation'],
                                },
                                orientation: item.text.orientation
                            } : {
                                _: 'image',
                                name:item['name'].toLowerCase(),
                                slot:item['name'].toLowerCase(),
                                class:`${r}-${item['name'].toLowerCase()}`,
                                top:item.top * obj['PSD']['layout']['relation'],
                                left:item.left * obj['PSD']['layout']['relation'],
                                canvas:item.canvas,
                                width:item.canvas.width * obj['PSD']['layout']['relation']
                            }, c, obj, r)
                            break
                        default:
                            console.warn('нет обработчкика данных компонентов', item['name'])
                            break
                    }
                }
            }
        }
    })
}