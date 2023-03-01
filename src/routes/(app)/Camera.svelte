<script lang="ts">
	import { controls, isMobile } from "$lib/stores";
	import { PerspectiveCamera, useFrame, useThrelte } from "@threlte/core";
	import { onDestroy, onMount } from "svelte";
	import { tick } from "svelte";
	import { Group, Vector3 } from "three";
	import Astronaut from "./astronaut/Astronaut.svelte";
	import { FirstPersonCamera } from "./Controller";
    import {ArcballControls} from "three/examples/jsm/controls/ArcballControls"
    const {camera, renderer, scene} = useThrelte()
    let fpsCamera: FirstPersonCamera
    let arcball: ArcballControls
    let astronaut: Group
    export let position = new Vector3(0,0,10)
    $:{
        $controls.explore.sensitivity, updateSens()
    }
    $:{
        if(fpsCamera){
            $controls.explore.enabled, fpsCamera.toggleAvailability($controls.explore.enabled)
        }
    }
    function updateSens(){
        if(fpsCamera){
            fpsCamera.sensitivity = $controls.explore.sensitivity
        }
    }
    onMount(async()=>{
        await tick()
        if($camera){
            if(renderer){
                if($isMobile){
                    arcball = new ArcballControls($camera,renderer.domElement, scene)
                    arcball.adjustNearFar = true
                    arcball.maxDistance = 100
                    arcball.minDistance = 1
                    arcball.update()
                }else{
                    if(fpsCamera){
                        fpsCamera.destroy_()
                    }
                    fpsCamera = new FirstPersonCamera( ($camera as unknown as PerspectiveCamera), document.documentElement, renderer.domElement, position, $controls.explore.sensitivity);
                }
            }
        }
        
    })
    onDestroy(()=>{
        if(fpsCamera){
            fpsCamera.destroy_()
        }
    })
    useFrame((_,delta)=>{
        if(fpsCamera){
            fpsCamera.update( delta );
        }
    })
</script>
<div class="absolute z-[9999999999] top-0 left-0">{$camera.position.toArray()}</div>
<PerspectiveCamera position={position} near={0.05} far={300} fov={90}>
    <Astronaut bind:obj={astronaut} rotation={[0,Math.PI,0]} scale={0.1} position={[0,0,0]}/>
</PerspectiveCamera>
