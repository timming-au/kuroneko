import { Color, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

export const mat_nekocom_base = new MeshStandardMaterial({
    color: new Color("rgb(20,20,20)"),
    emissive: new Color("rgb(5,5,5)"),
    roughness: 0.8,
    emissiveIntensity: 0.6,
    metalness:1,
    flatShading: true,
})

export const mat_nekocom_ear = new MeshStandardMaterial({
    color: new Color("rgb(5,5,5)"),
    emissive: new Color("rgb(20,20,20)"),
    roughness: 0,
    emissiveIntensity: 1,
    flatShading: true,
})

export const mat_glass = new MeshPhysicalMaterial({
    emissive: 0xff4545,
    emissiveIntensity: 1,
    color: 0x555555,
    roughness: 0.1,
    flatShading: true,
    opacity: 0.1,
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

export const mat_nekocom_connectors = new MeshPhongMaterial({
    color      :  new Color("rgb(255,70,80)"),
    emissive   :  new Color("rgb(255,70,70)"),
    specular   :  new Color("rgb(200,100,100)"),
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