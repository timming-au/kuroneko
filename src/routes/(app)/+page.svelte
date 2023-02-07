<script lang="ts">
    import {Canvas} from "@threlte/core";
	import Scene from "./Scene.svelte";
	import Intro from "./intro.svelte";
	import Interface from "./Interface.svelte";
	import { controls, dev } from "$lib/stores";
    import "../../app.css"

</script>
{#if $dev}
<Interface/>
{/if}
<div class="w-screen h-screen absolute">
    <Canvas rendererParameters={{"logarithmicDepthBuffer":true,"antialias":true}}>
        <Scene>
            <Intro></Intro>
        </Scene>
    </Canvas>
</div>