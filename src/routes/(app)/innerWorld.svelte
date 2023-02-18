<script lang="ts">
	import { InteractiveObject, T } from "@threlte/core";
    import { useThrelte } from "@threlte/core";
	import { BoxGeometry, Color, DirectionalLightHelper, Group, MeshStandardMaterial, Vector3 } from "three";
	
	import Nekocom from "./nekocom/Nekocom.svelte";
	import { controls, dev } from "$lib/stores";
	import { RGBToString } from "$lib/helper";
	import { PolyhedronFactory } from "./Factory";
	import { mat_pink } from "./nekocom/Materials";
	import Planet from "./planet/Planet.svelte";
	import Sun from "./sun/Sun.svelte";

    const {scene} = useThrelte()
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
	const {camera} = useThrelte()
	$:{
		if(nekoComObj && $camera && $controls){
			let pos = nekoComObj.getWorldPosition(new Vector3())
			let {x,y,z} = new Vector3().copy(pos).add(new Vector3(0,0,10))
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
<Sun position={[30,50,200]}/>
<Planet position={[0,0,0]} bloomType="weak" scale={4}></Planet>
<Nekocom bloomType="strong" comPos={[0,14.1,0]} bind:obj={nekoComObj}/>

