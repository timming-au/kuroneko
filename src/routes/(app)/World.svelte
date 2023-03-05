<script lang="ts">
	import type { Group, Mesh } from "three";
	import Moon from "./moon/Moon.svelte";
	import Nekocom from "./nekocom/Nekocom.svelte";
	import Planet from "./planet/Planet.svelte";
	import Sun from "./sun/Sun.svelte";
	import Trees from "./trees/Trees.svelte";
	import Stars from "./Stars.svelte";

	let nekoComObj: Group;
	let planetScale = 1
	let planetModel: Group
	export let sun: Mesh
</script>

<Sun bind:sun={sun} planetScale={planetScale} pos={[30,5,150]}/>
<Planet bind:model={planetModel} rotate bloomType="weak" scale={planetScale}>
	<Trees planetObject={planetModel}/>
	<Nekocom bloomType="strong" scale={0.1} comPos={[-0.17,3.32,0.18]} bind:obj={nekoComObj}></Nekocom>
</Planet>
<Moon orbit pos={[10,1,-10]} rotateOrigin={[0,0,0]}/>
<Stars/>

