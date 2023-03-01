<script lang="ts">
    import { isMobile } from "$lib/stores";
    import { Canvas } from "@threlte/core";
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { DefaultLoadingManager, PCFSoftShadowMap } from "three";
    import "../../app.css";
    import Interface from "./Interface.svelte";
    import Scene from "./Scene.svelte";
    onMount(()=>{
        let hasTouchScreen = false;
            if (Object.hasOwn(navigator,"maxTouchPoints")) {
                hasTouchScreen = navigator.maxTouchPoints > 0;
            } else if (Object.hasOwn(navigator,"msMaxTouchPoints")) {
                hasTouchScreen = navigator['msMaxTouchPoints'] > 0;
            } else {
            const mQ = matchMedia?.("(pointer:coarse)");
            if (mQ?.media === "(pointer:coarse)") {
                hasTouchScreen = !!mQ.matches;
            } else if ("orientation" in window) {
                hasTouchScreen = true; // deprecated, but good fallback
            } else {
                // Only as a last resort, fall back to user agent sniffing
                const UA = navigator.userAgent;
                hasTouchScreen =
                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
            }
        }
        $isMobile = hasTouchScreen
    })
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
            }
        })
    };
    let canvas: HTMLDivElement
    
</script>
<div id="loading" class="z-[9999999999] gap-2 w-full h-full absolute flex-col bg-black flex items-center justify-center text-xl">
    <p class="text-white">Booting... {load.percent}%</p>
    <div class="relative w-24 h-2 bg-[#54464d] rounded flex items-center">
        <div style="width:{load.percent}%" class="h-full bg-pink-300 rounded"></div>
        <img alt="paw" src="paw.png" class="absolute left-0 -ml-[11px]" style="left:{load.percent}%;transform:rotate({load.percent/100*360}deg)"/>
    </div>
</div>
<span class="w-full h-full fixed" id="main">
    <div id="canvas" bind:this={canvas} class="w-full h-full absolute">
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