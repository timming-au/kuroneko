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
    emissive: 0x000000,
    emissiveIntensity: 1,
    color: 0x000000,
    roughness: 0.3,
    flatShading: true,
    opacity: 0.5,
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

export const mat_bulb = new MeshPhysicalMaterial({
    emissive: 0xffffee,
    emissiveIntensity: 1,
    color: 0xffffee,
    roughness: 0.5,
    flatShading: true,
    transparent: true,
    transmission:0,
    clearcoat:1,
});