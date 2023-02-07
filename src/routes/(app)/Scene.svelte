<script lang="ts">
	import { T, useFrame, PerspectiveCamera, DirectionalLight, AmbientLight, HemisphereLight, Pass, OrbitControls, Layers, useThrelte } from "@threlte/core";
	import { get } from "svelte/store";
	import {ACESFilmicToneMapping, Color , Object3D, sRGBEncoding, Vector2, Vector3} from "three";
	import { DEG2RAD, lerp } from "three/src/math/MathUtils";
	import {cam, controls, dev} from "$lib/stores"
	import { Debug, World } from '@threlte/rapier'
	import gsap from "gsap";
	import {BloomPass} from "three/examples/jsm/postprocessing/BloomPass"
	import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass"
	import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass"
	import { onMount, tick } from "svelte";
	import { RGBToHex } from "$lib/helper";
	import { Environment } from "@threlte/extras";
	// move camera on mousemove
	const { pointer, camera } = useThrelte()
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
	
	onMount(()=>{

		let save = localStorage.getItem("controls")
		if(save){
			let parse = JSON.parse(save)

			/**
			 * Recursively assign values to object from a copy to prevent changing reference
			 * @param obj
			 * @param copy
			 */
			function valueAssign(obj: {[key:string]:any}, copy:{[key:string]:any}){
				for(let key in obj){
					if(typeof obj[key] != 'object'){
						obj[key] = copy[key]
					}else{
						valueAssign(obj[key], copy[key])
					}
				}
			}
			valueAssign($controls,parse)
		}
	})
	onMount(async()=>{
		await tick()
		$controls = {...$controls}
	})
	const {renderer} = useThrelte()
	let smaapass: SMAAPass
	$:{
		if(renderer){
			// 
    		renderer.outputEncoding = sRGBEncoding
			renderer.physicallyCorrectLights = true
			renderer.toneMapping = ACESFilmicToneMapping
			renderer.toneMappingExposure = 1
			renderer.setClearColor(0x000000,1)
			smaapass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
		}
	}
	
	const {scene} = useThrelte()
	scene.background = new Color("rgb(10,10,10)");
</script>
{#key smaapass}
	{#if smaapass}
	<!-- <Pass pass={smaapass}></Pass> -->
	<Pass pass={new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1, 1, 0.6 )}></Pass>
	{/if}
{/key}
<Environment path="src/assets/environment/" 
	files="dawn.hdr" 
	format="hdr" 
	encoding={sRGBEncoding}
/>
<AmbientLight intensity={$controls.ambient.intensity} color={RGBToHex($controls.ambient.color)}></AmbientLight>
<HemisphereLight intensity={$controls.hemisphere.intensity} groundColor={RGBToHex($controls.hemisphere.groundColor)} skyColor={RGBToHex($controls.hemisphere.skyColor)}></HemisphereLight>
<World gravity={{y:-19.62}}>
	<!-- <Debug depthTest={false} depthWrite={false} /> -->
	<PerspectiveCamera position={{x:0,y:3,z:20}} fov={30}>
		{#if $dev}
		<OrbitControls
		target={{ y: 0 }}
		maxPolarAngle={360 * DEG2RAD}
		minPolarAngle={0 * DEG2RAD}
		maxAzimuthAngle={180 * DEG2RAD}
		minAzimuthAngle={-180 * DEG2RAD}
		enableZoom={true}
		/>
		{/if}
	</PerspectiveCamera>
	<slot/>
</World>
<svelte:window on:beforeunload={()=>localStorage.setItem("controls",JSON.stringify($controls))} on:mousemove={(e)=>pan(e)}></svelte:window>
