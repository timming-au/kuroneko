import { MeshStandardMaterial } from "three";

export const mat_sun = new MeshStandardMaterial({
    color: 0xff7e33,
    roughness: 1,
    flatShading: true,
    emissive: 0xff0000,
    emissiveIntensity:1,
});