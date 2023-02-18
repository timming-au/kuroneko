<script lang="ts">

	import { PointLight, T, useThrelte } from "@threlte/core";
	import { Group, Mesh, MeshPhongMaterial, PointLightHelper, SphereGeometry, Vector3, type PointLight as PointLight3 } from "three";
	import { mat_sun } from "./Materials";
    export const type = new Group();
    import type { BloomType } from '$lib/types';
	import { bloomObject } from "$lib/stores";
	export let bloomType: BloomType = "sun"
    let obj: Mesh
    let light: PointLight3
    const {scene} = useThrelte()
    $:{
        if(light){
            scene.add(new PointLightHelper(light,2,0x00ff00))
        }
    }
	$:{
		if(bloomType && obj){
			$bloomObject = [obj, bloomType]
		}
	}
    let radius = 20
</script>
<T.Mesh bind:ref={obj} {...$$restProps}>
    <T.Mesh geometry={new SphereGeometry(radius,24,24)} material={mat_sun}></T.Mesh>
</T.Mesh>
{#if obj}
<PointLight shadow={{bias:0.0001, mapSize:[2048,2048]}} color={0xff7e33} position={obj.position} power={50000} distance={5000} intensity={500000}></PointLight>
{/if}