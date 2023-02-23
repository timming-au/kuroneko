<script lang="ts">
	import { RGBToHex } from "$lib/helper";
	import { cam, controls } from "$lib/stores";
	import { AmbientLight, HemisphereLight, useThrelte, Fog, T } from "@threlte/core";
	import { Debug, World as RapierWorld } from '@threlte/rapier';
	import gsap from "gsap";
	import { onMount } from "svelte";
	import { Color,  GridHelper } from "three";
	import Camera from "./Camera.svelte";
	import Controls from "./Controls.svelte";
	import Hdr from "./Hdr.svelte";
	import Renderer from "./Renderer.svelte";
	import World from "./World.svelte";

	export let loaded: boolean
	// move camera on mousemove
	const { pointer, camera, scene, renderer} = useThrelte()
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
<RapierWorld gravity={{y:-19.62}}>
	<World/>
	<Debug depthTest={false} depthWrite={false} />
</RapierWorld>
<!-- <Fog near={1} far={200} color={new Color(0,0,0)}/> -->
<svelte:window on:beforeunload={()=>localStorage.setItem("controls",JSON.stringify($controls))} on:mousemove={(e)=>pan(e)}></svelte:window>
