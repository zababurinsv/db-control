import { GObject } from './object.mjs';

export class GText extends GObject
{
    constructor( fontWeight, fontSize, fontFamily, x, y, width, height ) {        
        super( x, y, width, height );
        this.setFontWeight( fontWeight );
        this.setFontSize( fontSize );
        this.setFontFamily( fontFamily );
    }  
    setFontWeight( fontWeight ) {
        this.fontWeight = fontWeight;
    }
    getFontWeight() {
        return this.fontWeight;
    }
    setFontSize( fontSize ) {
        this.fontSize = fontSize;
    }
    getFontSize() {
        return this.fontSize;
    }
    setFontFamily( fontFamily ) {
        this.fontFamily = fontFamily;
    }
    getFontFamily() {
        return this.fontFamily;
    }    
    draw( textColor, textOut, autoMeasure ) {
        const wa = document.getElementById('wa');
        if (wa.childNodes.length > 1) wa.childNodes[1].remove(); 
        const cs = document.createElement('canvas');
        var ctx = cs.getContext('2d');
        ctx.font = this.getFontWeight().toString() +
            ' ' + this.getFontSize().toString() + 
            'px ' + this.getFontFamily();
        var fh = this.getHeight();
        var fw = this.getWidth();
        if ( autoMeasure == true ) {
            let mesure = ctx.measureText( textOut );
            fh = mesure.fontBoundingBoxAscent + mesure.fontBoundingBoxDescent;
            fw = mesure.width;
            this.setWidth(Math.ceil(fw));
            this.setHeight(Math.ceil(fh));    
        } else {
            ////////////////////////////////////
            // TODO: иначе, сделать по центру
            ////////////////////////////////////
        }
        cs.width = this.getWidth();
        cs.height = this.getHeight();
        ctx.font = this.getFontWeight().toString() + 
            ' ' + this.getFontSize().toString() + 
            'px ' + this.getFontFamily();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.0)';
        ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
        ctx.fillStyle = textColor;
        ctx.fillText( textOut, 0, this.getFontSize(), fw );
        wa.appendChild(cs);
        const imageBitmap = createImageBitmap(cs);
        cs.remove();
        return imageBitmap;
        //cs.style.display = 'block';
    }
    getColors( instance )
    {
        return new Float32Array([
            1.0, 0.0, 0.0, // 🔴
            0.0, 1.0, 0.0, // 🟢
            0.0, 1.0, 0.0, // 🟢
            0.0, 0.0, 1.0, // 🔵
            0.0, 0.0, 1.0, // 🔵
            0.0, 1.0, 0.0, // 🟢
            0.0, 1.0, 0.0, // 🟢
            1.0, 0.0, 0.0  // 🔴
        ]);
    }
    getPositions( instance )
    {
        let objectWidth = this.getWidth() - 1;
        let objectHeight = this.getHeight() - 1;
        let offsetX = this.getX() + 1;
        let offsetY = this.getY() + 1;
        return new Float32Array([
            instance.calcX(offsetX-1), instance.calcY(offsetY), 0.0,
            instance.calcX(objectWidth+offsetX), instance.calcY(offsetY), 0.0,

            instance.calcX(objectWidth+offsetX), instance.calcY(offsetY), 0.0,
            instance.calcX(objectWidth+offsetX), instance.calcY(objectHeight+offsetY), 0.0,

            instance.calcX(objectWidth+offsetX), instance.calcY(objectHeight+offsetY), 0.0,
            instance.calcX(offsetX), instance.calcY(objectHeight+offsetY), 0.0,

            instance.calcX(offsetX), instance.calcY(objectHeight+offsetY), 0.0,
            instance.calcX(offsetX), instance.calcY(offsetY), 0.0
        ]);
    }
}