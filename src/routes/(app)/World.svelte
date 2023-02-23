<script lang="ts">
	import { T, useFrame, useThrelte } from "@threlte/core";
	import { DirectionalLightHelper, Group, Vector3 } from "three";
	import { RGBToString } from "$lib/helper";
	import { controls, dev } from "$lib/stores";
	import Nekocom from "./nekocom/Nekocom.svelte";
	import Planet from "./planet/Planet.svelte";
	import Sun from "./sun/Sun.svelte";
	import Moon from "./moon/Moon.svelte";
	import Player from "./player/Player.svelte";

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
	let planetScale = 1
</script>

<Sun planetScale={planetScale} pos={[30,50,50]}/>
<Planet rotate bloomType="weak" position={new Vector3(0,0,0)} scale={planetScale}>
</Planet>
<Nekocom bloomType="strong" scale={0.1} comPos={[-0.17,3.32,0.18]} bind:obj={nekoComObj}/>
<Moon pos={[20,5,-100]} rotateOrigin={[0,0,0]}/>
<Player shadow={true} position={new Vector3(0,20,0)}/>

