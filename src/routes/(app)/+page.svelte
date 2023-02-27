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
        percentReal: 0,
    }
    
    DefaultLoadingManager.onLoad = function(){
		load.done = true;
        gsap.to("#loading",{
            opacity: 0,
            delay:0.5,
            duration:0.5,
            ease: "linear",
        }).then(()=>{
            document.getElementById("loading")!.style.display = "none"
        });
    }
    DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        gsap.to(load,{
            percentReal: Math.round(itemsLoaded / itemsTotal * 1000) / 10,
            duration:0.5,
            ease: "linear",
            onUpdate:()=>{
                load.percent = Math.floor(Math.max(load.percent, load.percentReal))
                console.log(load.percent)
            }
        })
    };
    let canvas: HTMLDivElement
    
</script>
<div id="loading" class="z-[9999999999] gap-2 w-screen h-screen absolute flex-col bg-black flex items-center justify-center text-xl">
    <p class="text-white">Booting... {load.percent}%</p>
    <div class="relative w-24 h-2 bg-[#54464d] rounded flex items-center">
        <div style="width:{load.percent}%" class="h-full bg-pink-300 rounded"></div>
        <img alt="paw" src="paw.png" class="absolute left-0 -ml-[11px]" style="left:{load.percent}%;transform:rotate({load.percent/100*360}deg)"/>
    </div>
</div>
<span class="w-screen h-screen absolute" id="main">
    <div id="canvas" bind:this={canvas} class="w-screen h-screen absolute">
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
</span>