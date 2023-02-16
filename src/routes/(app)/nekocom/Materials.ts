import { Color, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial } from "three";


export const mat_glass = new MeshPhysicalMaterial({
    color: 0x111111,
    roughness: 0.2,
    flatShading: true,
    opacity: 0.2,
    transparent: true,
    transmission:0
});

export const mat_pink = new MeshPhongMaterial({
    color      :  new Color("rgb(255,70,80)"),
    emissive   :  new Color("rgb(255,120,120)"),
    specular   :  new Color("rgb(255,155,155)"),
    shininess  :  10,
    emissiveIntensity: 0.3,
    flatShading: true,
    reflectivity:1,
    opacity    : 1
});

export const mat_bulb = new MeshStandardMaterial({
    emissive: 0x000000,
    emissiveIntensity: 1,
    color: 0x000000,
    roughness: 1,
    flatShading: true,
});