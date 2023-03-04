<script lang="ts">
	import { controls } from "$lib/stores";
	import { useThrelte } from "@threlte/core";
	import { Color, Mesh } from "three";
	import Camera from "./Camera.svelte";
	import Controls from "./Controls.svelte";
	import Hdr from "./Hdr.svelte";
	import Renderer from "./Renderer.svelte";
	import World from "./World.svelte";

	export let loaded: boolean
	// move camera on mousemove
	const { scene } = useThrelte()
	// function pan(e: MouseEvent){
	// 	return
	// 	if($cam.pan){
	// 		let c = $camera
	// 		let [rex,rey,rez] = [...$cam.expectedRotation]
	// 		let [pex,pey,pez] = [...$cam.expectedPosition]

	// 		// lerp rotation smoothly
	// 		gsap.to(c.rotation,{
	// 			y: (rey - c.rotation.y - ($pointer.x * Math.PI))/30,
	// 			x: (rex - c.rotation.x + ($pointer.y * Math.PI))/30,
	// 			duration:2,
	// 			ease:"power3.out"
	// 		})
	// 		// lerp position smoothly
	// 		gsap.to(c.position,{
	// 			x: pey + (pey - c.position.y - ($pointer.x * 450))/30,
	// 			y: pex + (pex - c.position.x - ($pointer.y * 450))/30,
	// 			duration:2,
	// 			ease:"power3.out"
	// 		})
	// 	}
	// }
	let sun: Mesh;
	scene.background = new Color("rgb(10,10,10)");
</script>
<Renderer sun={sun} loaded={loaded}/>
<Controls/>

<Hdr/>
<Camera/>

<World bind:sun={sun}/>
<svelte:window on:beforeunload={()=>localStorage.setItem("controls",JSON.stringify($controls))}></svelte:window>
