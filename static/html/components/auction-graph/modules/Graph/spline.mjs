import { GObject } from './object.mjs';

export class GSpline extends GObject
{
    constructor( x, y, width, height ) {
        super( x, y, width, height );
        this.clearItems();
    }  
    appendItem( instance, position, color )
    {
        var vpositions = new Float32Array(this.positions.length + position.length);
        for (let i=0; i<this.positions.length; i++) 
            vpositions[i] = this.positions[i];
        vpositions[0 + this.positions.length] = position[0];
        vpositions[1 + this.positions.length] = position[1];
        vpositions[2 + this.positions.length] = position[2];
        this.positions = vpositions;
        var vcolors = new Float32Array(this.colors.length + color.length);
        for (let i=0; i<this.colors.length; i++) 
            vcolors[i] = this.colors[i];
        vcolors[0 + this.colors.length] = color[0];
        vcolors[1 + this.colors.length] = color[1];
        vcolors[2 + this.colors.length] = color[2];
        this.colors = vcolors;
    }
    clearItems() {
        this.positions = new Float32Array();
        this.colors = new Float32Array();
    }
    getPositions( instance ) {
        let vpositions = new Float32Array(this.positions.length);
        for ( let i = 0; i < this.positions.length; i = i + 3 ) {
            let x = this.getX() + this.positions[ i + 0 ] + 1 + 1;
            if ( x <= this.getX() + 1 ) x = this.getX() + 1 + 1;
            if ( x > this.getX() + this.getWidth() ) 
                x = this.getX() + this.getWidth();
            let y = this.getY() + this.positions[ i + 1 ] + 1 + 1;
            if ( y <= this.getY() + 1 ) y = this.getY() + 1 + 1;
            if ( y > this.getY() + this.getHeight() ) 
                y = this.getY() + this.getHeight();
            vpositions[ i + 0 ] = instance.calcX( ( i == 0 ) ? x - 1 : x );
            vpositions[ i + 1 ] = instance.calcY(y);
            vpositions[ i + 2 ] = this.positions[ i + 2 ];
        }
        return vpositions;
    }
    getColors( instance ) {
        return this.colors;
    }
    getBorderColors( instance )
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
    getBorderPositions( instance )
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