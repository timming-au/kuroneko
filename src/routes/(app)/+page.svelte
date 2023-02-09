<script lang="ts">
    import {Canvas} from "@threlte/core";
	import Scene from "./Scene.svelte";
	import InnerWorld from "./innerWorld.svelte";
	import Interface from "./interface.svelte";
	import { controls, dev } from "$lib/stores";
    import "../../app.css"

</script>
{#if $dev}
<Interface/>
{/if}
<div class="w-screen h-screen absolute">
    <Canvas rendererParameters={{"logarithmicDepthBuffer":true,"antialias":true}}>
        <Scene>
            <InnerWorld></InnerWorld>
        </Scene>
    </Canvas>
</div>