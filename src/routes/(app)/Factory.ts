/* eslint-disable @typescript-eslint/no-explicit-any */
import { DodecahedronGeometry, IcosahedronGeometry, OctahedronGeometry, PolyhedronGeometry, TetrahedronGeometry } from "three";

/**
 * Polyhedron factory that can generate polyhedrons.
 */
export const PolyhedronFactory:{
    /**
     * Contains information of possible geometries to be generated
    */
    shape:{[name:string]:new (...args:any[]) => PolyhedronGeometry}

    /**
     * Generates a random polyhedron geometry
    */
    getRand():PolyhedronGeometry
} = {
    shape:{
        ico: IcosahedronGeometry,
        dod: DodecahedronGeometry,
        oct: OctahedronGeometry,
        tet: TetrahedronGeometry,
    },
    getRand:function(){
        const rad = Math.ceil(Math.random()*1+1)
        const detail = Math.ceil(Math.random()*2)
        const keys = Object.keys(this.shape);
        return new this.shape[keys[ keys.length * Math.random() << 0]](rad,detail);
    }
}
