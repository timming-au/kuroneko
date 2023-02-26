import type { Graph } from "$lib/types";
import { writable, type Writable } from "svelte/store";
import type { Object3D } from "three";

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
export const bloomObject: Writable<[obj:Object3D,type:string]>=writable()
export const envIntensity: Writable<number>= writable(0.01)

//default
const def = writable({
    com:{
        intensity:20,
        power:50,
    },
    explore: {
        sensitivity: 0.1,
        enabled: false,
    }
})
export const controls:Writable<{
    com:{
        intensity:number,
        power:number,
    },
    explore: {
        sensitivity: number
        enabled: boolean
    }
}> = def