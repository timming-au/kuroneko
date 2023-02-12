<script lang="ts">
    import {Canvas} from "@threlte/core";
	import Scene from "./Scene.svelte";
	import InnerWorld from "./innerWorld.svelte";
	import Interface from "./Interface.svelte";
	import { controls, dev } from "$lib/stores";
    import "../../app.css"

</script>
<div class="w-screen h-screen absolute">
    <Canvas rendererParameters={{"logarithmicDepthBuffer":true,"antialias":true}}>
        {#if $dev}
        <Interface/>
        {/if}
        <Scene>
            <InnerWorld></InnerWorld>
        </Scene>
    </Canvas>
</div>