<script lang="ts">
	import { controls } from "$lib/stores";
	import { PerspectiveCamera, useFrame, useThrelte } from "@threlte/core";
	import { onDestroy, onMount } from "svelte";
	import { Vector3 } from "three";
	import Astronaut from "./astronaut/Astronaut.svelte";
	import { FirstPersonCamera } from "./Controller";
    const {camera, renderer} = useThrelte()
    let fpsCamera: FirstPersonCamera
    export let position = new Vector3(0,0,10)
    let a = 0
    $:{
        $controls.explore.sensitivity, updateSens()
    }
    function updateSens(){
        if(fpsCamera){
            fpsCamera.sensitivity = $controls.explore.sensitivity
        }
    }
    $:{
        if(fpsCamera){
            $controls.explore.enabled, fpsCamera.toggleAvailability($controls.explore.enabled)
        }
    }
    onMount(()=>{
        if($camera && renderer){
            if(fpsCamera){
                fpsCamera.destroy_()
            }
            fpsCamera = new FirstPersonCamera( ($camera as unknown as PerspectiveCamera), document.documentElement, renderer.domElement, position, $controls.explore.sensitivity);
        }
    })
    useFrame((_,delta)=>{
        if(fpsCamera){
            fpsCamera.update( delta );
        }
    })
    onDestroy(()=>{
        if(fpsCamera){
            fpsCamera.destroy_()
        }
    })
</script>
<PerspectiveCamera near={0.1} far={200} fov={90}>
    <Astronaut rotation={[0,Math.PI,0]} scale={0.1} position={[0,0,0]}/>
</PerspectiveCamera>
