import { GObject } from './object.mjs';

export class GBox extends GObject
{
    constructor( x, y, width, height ) {
        super( x, y, width, height );
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
        let objectwidth = this.getWidth() - 1;
        let objectheight = this.getHeight() - 1;
        let offsetx = this.getX() + 1;
        let offsety = this.getY() + 1;
        return new Float32Array([
            instance.calcX(offsetx-1), instance.calcY(offsety), 0.0,
            instance.calcX(objectwidth+offsetx), instance.calcY(offsety), 0.0,

            instance.calcX(objectwidth+offsetx), instance.calcY(offsety), 0.0,
            instance.calcX(objectwidth+offsetx), instance.calcY(objectheight+offsety), 0.0,

            instance.calcX(objectwidth+offsetx), instance.calcY(objectheight+offsety), 0.0,
            instance.calcX(offsetx), instance.calcY(objectheight+offsety), 0.0,

            instance.calcX(offsetx), instance.calcY(objectheight+offsety), 0.0,
            instance.calcX(offsetx), instance.calcY(offsety), 0.0
        ]);
    }
};