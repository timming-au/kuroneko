import { writable, type Writable } from "svelte/store";
import type { RGB } from "three";
import type { Graph } from "$lib/types";

export const navi = writable(false)
export const theme:Writable<"dark"|"light"> = writable("dark")
export const cam:Writable<{
    pan:boolean,
    expectedRotation: [x:number,y:number,z:number]
    expectedPosition: [x:number,y:number,z:number]
}> = writable({
    pan: true,
    expectedRotation: [0,0,0],
    expectedPosition: [0,0,0],
})
export const dev:Writable<boolean>=writable(true)
export const assetsLoaded:Writable<{[filename:string]:Graph}>=writable({})

//default
const def = writable({
    com:{
        intensity:1,
        distance:20,
        power:50,
    },
    directional:{
        intensity:1,
        color:{
            r:40,
            g:40,
            b:40,
        },
        pos:{
            x:0,
            y:0,
            z:0,
        }
    },
    ambient:{
        color:{
            r:40,
            g:40,
            b:40,
        },
        intensity:0.3,
    },
    hemisphere:{
        skyColor:{
            r:0,
            g:0,
            b:0,
        },
        groundColor:{
            r:0,
            g:0,
            b:0,
        },
        intensity: 0.3,
    },
})
export const controls:Writable<{
    com: {
        intensity: number;
        distance: number;
        power: number;
    };
    directional: {
        intensity: number;
        color:RGB
        pos:{
            x:number,
            y:number,
            z:number,
        }
    };
    ambient: {
        color: RGB
        intensity: number;
    };
    hemisphere: {
        skyColor: RGB
        groundColor: RGB
        intensity: number;
    };
}> = def