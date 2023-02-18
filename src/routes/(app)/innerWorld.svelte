<script lang="ts">
	import { T, useFrame, useThrelte } from "@threlte/core";
	import { DirectionalLightHelper, Group, Vector3 } from "three";
	import { RGBToString } from "$lib/helper";
	import { controls, dev } from "$lib/stores";
	import Nekocom from "./nekocom/Nekocom.svelte";
	import Planet from "./planet/Planet.svelte";
	import Sun from "./sun/Sun.svelte";

    const {scene, camera} = useThrelte()
	// light helper
	let directionalLight: any;
	let helper: DirectionalLightHelper
    $:{
        if($dev && directionalLight && scene){
			if(helper){
				scene.remove(helper)
			}
			helper = new DirectionalLightHelper( directionalLight, 5 );
			scene.add( helper );
        }
    }
	$:{
		if(nekoComObj && $camera){
			let pos = nekoComObj.getWorldPosition(new Vector3())
			let {x,y,z} = new Vector3().copy(pos).add(new Vector3(0,0,3))
			$camera.position.set(x,y,z)
			$camera.lookAt(pos)
			$camera.userData.orbitControls.target = pos
		}
	}
	let nekoComObj: Group;
	let directionalLightPos:[x:number,y:number,z:number] = (function(){return Object.values($controls.directional.pos) as [x:number,y:number,z:number]})()
	$:{
		directionalLightPos = (function(){return Object.values($controls.directional.pos) as [x:number,y:number,z:number]})()
	}
</script>
<!-- 
<CollisionGroups groups={[0, 15]}>
	<RigidBody type={"fixed"}>
		<AutoColliders shape={"cuboid"}>
			<T.Mesh receiveShadow geometry={floor.getGeometry()} material={floor.material} position={[0,10,-125]}></T.Mesh>
		</AutoColliders>
	</RigidBody>
</CollisionGroups> -->
{#if $dev}
{#key nekoComObj && $controls}
{#if nekoComObj}
<T.DirectionalLight color={RGBToString($controls.directional.color)} bind:ref={directionalLight} castShadow intensity={$controls.directional.intensity} position={directionalLightPos} target={nekoComObj}></T.DirectionalLight>
{/if}
{/key}
{:else}
<T.DirectionalLight color={RGBToString($controls.directional.color)} bind:ref={directionalLight} castShadow intensity={$controls.directional.intensity} position={directionalLightPos} target={nekoComObj}></T.DirectionalLight>
{/if}
<!-- <Planet pos={[0,-20,0]} bloomType="weak" scale={7}></Planet> -->
<Sun position={[30,50,50]}/>
<Planet rotate position={[0,0,0]} bloomType="weak" scale={4}>
	<Nekocom bloomType="strong" scale={0.1} comPos={[-0.17,3.32,0.18]} bind:obj={nekoComObj}/>
</Planet>

