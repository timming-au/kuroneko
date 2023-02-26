<script lang="ts">
    import {Canvas} from "@threlte/core";
	import Scene from "./Scene.svelte";
	import World from "./World.svelte";
	import Interface from "./Interface.svelte";
	import { dev } from "$lib/stores";
    import "../../app.css"
	import { DefaultLoadingManager, PCFSoftShadowMap } from "three";
    import gsap from "gsap";
	import { onMount, onDestroy } from "svelte";
    
    let load = {
        done: false,
        percent: 0,
    }
    
    DefaultLoadingManager.onLoad = function(){
		load.done = true;
        (document.getElementById("loading") as HTMLElement).style.display = "none";
        (document.getElementById("canvas") as HTMLElement).style.visibility = "visible";
    }
    DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        gsap.to(load,{
            percent: Math.round(itemsLoaded / itemsTotal * 1000) / 10,
            duration:0.3,
            ease: "linear",
        })
        // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    let canvas: HTMLDivElement
    
</script>
<div id="loading" class="w-screen h-screen absolute bg-black flex items-center justify-center">
    <p>Loading... {load.percent}%</p>
    <div class="w-16 h-1 bg-gray-300 rounded">
        <div class="w-[{load.percent}%] h-full bg-white rounded"></div>
    </div>
</div>
<div id="canvas" bind:this={canvas} class="w-screen h-screen absolute invisible">
    <Canvas shadowMapType={PCFSoftShadowMap} frameloop="never" rendererParameters={{
        powerPreference: "high-performance",
        antialias: false,
        stencil: false,
        depth: false,
    }}>
        <Scene loaded={load.done}/>
    </Canvas>
</div>
<Interface/>