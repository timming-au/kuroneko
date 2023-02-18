<script lang="ts">
	import { bloomObject } from "$lib/stores";
	import { useThrelte } from "@threlte/core";
	import { BlendFunction, DepthDownsamplingPass, EffectComposer, EffectPass, NormalPass, RenderPass, SelectiveBloomEffect, SMAAEffect, SSAOEffect, TextureEffect } from "postprocessing";
	import { onMount } from "svelte";
	import { ACESFilmicToneMapping, HalfFloatType, Object3D, sRGBEncoding } from "three";

    export let loaded:boolean
    const { renderer, advance, scene, camera } = useThrelte()
    let bloomStrong: SelectiveBloomEffect
    let bloomWeak: SelectiveBloomEffect
    let bloomSun: SelectiveBloomEffect
    let composer:EffectComposer 
    onMount(()=>{
        composer = new EffectComposer(renderer,{
            frameBufferType: HalfFloatType
        });
        composer.addPass(new RenderPass(scene, $camera));

        // sun bloom
        bloomSun = new SelectiveBloomEffect(scene, $camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0,
            luminanceSmoothing: 0,
            intensity: 50,
            radius: 0.6
        });
        bloomSun.inverted = false
        bloomSun.selection.layer = 7
        // strong bloom
        bloomStrong = new SelectiveBloomEffect(scene, $camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0,
            luminanceSmoothing: 0,
            intensity: 1,
            radius: 0.5
        });
        bloomStrong.inverted = false
        bloomStrong.selection.layer = 6

        // weak bloom
        bloomWeak = new SelectiveBloomEffect(scene, $camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0.5,
            luminanceSmoothing: 0.1,
            intensity: 0.2,
            radius: 0.2
        });
        bloomWeak.inverted = false
        bloomWeak.selection.layer = 5
        composer.addPass(new EffectPass($camera,new SMAAEffect(), bloomWeak, bloomStrong, bloomSun));
    })
	function render(){
		requestAnimationFrame(render)
        if(composer) composer.render()
		advance()
	}
	$:{
		loaded && render()
	}
    function traverseWithoutParent(objects:Object3D[] = [], object: Object3D): Object3D[]{
        if(object.children.length > 0){
            object.children.forEach((child)=>{
                traverseWithoutParent(objects, child)
            })
        }else{
            objects.push(object)
        }
        return objects
    }
    $:{
        if($bloomObject){
            if($bloomObject[1] == "sun" && bloomSun){
                traverseWithoutParent(undefined,$bloomObject[0]).forEach((object)=>{
                    bloomSun.selection.toggle(object)
                })
            }
            if($bloomObject[1] == "strong" && bloomStrong){
                traverseWithoutParent(undefined,$bloomObject[0]).forEach((object)=>{
                    bloomStrong.selection.toggle(object)
                })
            }
            if($bloomObject[1] == "weak" && bloomWeak){
                traverseWithoutParent(undefined,$bloomObject[0]).forEach((object)=>{
                    bloomWeak.selection.toggle(object)
                })
            }
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