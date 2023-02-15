<script lang="ts">
	import { useFrame, useThrelte } from "@threlte/core";
	import { ACESFilmicToneMapping, BoxGeometry, HalfFloatType, Mesh, MeshStandardMaterial, sRGBEncoding } from "three";
    import {Effect,BloomEffect, RenderPass, SelectiveBloomEffect, EffectPass, EffectComposer, BlendFunction} from "postprocessing"
	import { onMount } from "svelte";
    import { bloomObject } from "$lib/stores";
	import { assets } from "$internal/paths";

    export let loaded:boolean
    const { renderer, advance, scene, camera } = useThrelte()
    let bloomStrong: SelectiveBloomEffect
    let bloomWeak: SelectiveBloomEffect
    let composer:EffectComposer 
    let selectiveBlooms: SelectiveBloomEffect[] = []
    let pass: EffectPass
    onMount(()=>{
        composer = new EffectComposer(renderer,{
            frameBufferType: HalfFloatType
        });
        composer.addPass(new RenderPass(scene, $camera));

        // strong bloom
        bloomStrong = new SelectiveBloomEffect(scene, $camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0.2,
            luminanceSmoothing: 0,
            intensity: 5
        });
        bloomStrong.inverted = false
        bloomStrong.selection.layer = 6

        composer.addPass(new RenderPass(scene, $camera));
        // weak bloom
        bloomWeak = new SelectiveBloomEffect(scene, $camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0.5,
            luminanceSmoothing: 0.1,
            intensity: 1,
        });
        bloomWeak.inverted = false
        bloomWeak.selection.layer = 5
        composer.addPass(new EffectPass($camera, bloomWeak, bloomStrong));
    })
	function render(){
		requestAnimationFrame(render)
        if(composer) composer.render()
		advance()
	}
	$:{
		loaded && render()
	}
    $:{
        if($bloomObject)
        if($bloomObject[1] == "strong" && bloomStrong){
            $bloomObject[0].traverse((child)=>{
                bloomStrong.selection.toggle(child)
            })
            console.log(bloomStrong.selection)
        }
        else if($bloomObject[1] == "weak" && bloomWeak){
            
            $bloomObject[0].children.forEach((child)=>{
                bloomWeak.selection.toggle(child)
            })
            console.log(bloomWeak.selection)
        }
    }
	$:{
		if(renderer){
			// 
    		renderer.outputEncoding = sRGBEncoding
			renderer.physicallyCorrectLights = true
			renderer.toneMapping = ACESFilmicToneMapping
			renderer.toneMappingExposure = 1
			renderer.setClearColor(0x000000,1)
		}
	}
</script>