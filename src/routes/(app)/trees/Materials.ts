import { MeshStandardMaterial } from "three";

export const treesMaterial = {
    sakura:{
        leaf:new MeshStandardMaterial({
            emissive: 0x000000,
            emissiveIntensity: 1,
            color: 0xffbfe7,
            roughness: 0.8,
            flatShading: true,
        }),
        branch: new MeshStandardMaterial({
            emissive: 0x000000,
            emissiveIntensity: 1,
            color: 0x545152,
            roughness: 1,
            flatShading: true,
        }),
    },
    tree:{
        leaf: new MeshStandardMaterial({
            emissive: 0x000000,
            emissiveIntensity: 1,
            color: 0x1c7337,
            roughness: 0.8,
            flatShading: true,
        }),
        branch: new MeshStandardMaterial({
            emissive: 0x000000,
            emissiveIntensity: 1,
            color: 0x383230,
            roughness: 1,
            flatShading: true,
        }),
    }
}