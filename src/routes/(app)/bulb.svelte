<script lang="ts">
	import { T, useThrelte } from "@threlte/core";
	import { type PointLight, SphereGeometry, PointLightHelper, MeshStandardMaterial } from "three";
    import { controls } from "$lib/stores";

    let light: PointLight
    const {scene} = useThrelte()
    $:{
        if(light && scene){
            const sphereSize = 1;
            scene.add( new PointLightHelper( light, sphereSize ));
        }
    }

	const bulbMat = new MeshStandardMaterial({
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0xffffee,
		roughness: 0.2,
		flatShading: true
	});
    export let position:[x: number, y: number, z: number] = [5,25,-20]
</script>
<T.Group {position}>
	<T.PointLight castShadow distance={$controls.point.distance} intensity={$controls.point.intensity} bind:ref={light}></T.PointLight>
	<T.Mesh geometry={new SphereGeometry(4,16,16)} material={bulbMat}></T.Mesh>
</T.Group>
