<script lang="ts">
	import {AmbientLight, HemisphereLight, Pass, useThrelte } from "@threlte/core";
	import {Color, GridHelper, Vector2} from "three";
	import {cam, controls} from "$lib/stores"
	import { World } from '@threlte/rapier'
	import gsap from "gsap";
	import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass"
	import { RGBToHex } from "$lib/helper";
	import Hdr from "./hdr.svelte";
	import Camera from "./camera.svelte";
	import Renderer from "./Renderer.svelte";
	import Controls from "./Controls.svelte"

	export let loaded: boolean
	// move camera on mousemove
	const { pointer, camera,scene} = useThrelte()
	function pan(e: MouseEvent){
		return
		if($cam.pan){
			let c = $camera
			let [rex,rey,rez] = [...$cam.expectedRotation]
			let [pex,pey,pez] = [...$cam.expectedPosition]

			// lerp rotation smoothly
			gsap.to(c.rotation,{
				y: (rey - c.rotation.y - ($pointer.x * Math.PI))/30,
				x: (rex - c.rotation.x + ($pointer.y * Math.PI))/30,
				duration:2,
				ease:"power3.out"
			})
			// lerp position smoothly
			gsap.to(c.position,{
				x: pey + (pey - c.position.y - ($pointer.x * 450))/30,
				y: pex + (pex - c.position.x - ($pointer.y * 450))/30,
				duration:2,
				ease:"power3.out"
			})
		}
	}
	
	scene.background = new Color("rgb(10,10,10)");
	scene.add(new GridHelper(100,10))
</script>
<Renderer loaded={loaded}/>
<Controls/>
<!-- <Pass pass={new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1, 1, 0 )}></Pass> -->

<Hdr/>
<Camera/>

<AmbientLight intensity={$controls.ambient.intensity} color={RGBToHex($controls.ambient.color)}></AmbientLight>
<HemisphereLight intensity={$controls.hemisphere.intensity} groundColor={RGBToHex($controls.hemisphere.groundColor)} skyColor={RGBToHex($controls.hemisphere.skyColor)}></HemisphereLight>
<World gravity={{y:-19.62}}>
	<!-- <Debug depthTest={false} depthWrite={false} /> -->
	<slot/>
</World>
<svelte:window on:beforeunload={()=>localStorage.setItem("controls",JSON.stringify($controls))} on:mousemove={(e)=>pan(e)}></svelte:window>
