<script lang="ts">
    import {Canvas} from "@threlte/core";
	import Scene from "./Scene.svelte";
	import InnerWorld from "./innerWorld.svelte";
	import Interface from "./Interface.svelte";
	import { dev } from "$lib/stores";
    import "../../app.css"
	import { DefaultLoadingManager } from "three";
    
    let isLoaded = false;
    DefaultLoadingManager.onLoad = function(){
		isLoaded = true;
        (document.getElementById("loading") as HTMLElement).style.display = "none";
        (document.getElementById("canvas") as HTMLElement).style.visibility = "visible";
    }
    DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
</script>
<div id="loading" class="w-screen h-screen absolute">
    Loading...
</div>
<div id="canvas" class="w-screen h-screen absolute invisible">
    <Canvas frameloop="never" rendererParameters={{"logarithmicDepthBuffer":true,"antialias":true}}>
        {#if $dev && window}
        <Interface/>
        {/if}
        <Scene loaded={isLoaded}>
            <InnerWorld></InnerWorld>
        </Scene>
    </Canvas>
</div>
