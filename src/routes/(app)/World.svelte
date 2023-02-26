<script lang="ts">
	import { useThrelte } from "@threlte/core";
	import { Group, Vector3 } from "three";
	import Moon from "./moon/Moon.svelte";
	import Nekocom from "./nekocom/Nekocom.svelte";
	import Planet from "./planet/Planet.svelte";
	import Sun from "./sun/Sun.svelte";
	import Trees from "./trees/Trees.svelte";

    const {camera} = useThrelte()
	$:{
		if(nekoComObj && $camera){
			let pos = nekoComObj.getWorldPosition(new Vector3())
			let {x,y,z} = new Vector3().copy(pos).add(new Vector3(0,0,3))
			$camera.position.set(x,y,z)
			$camera.lookAt(pos)
		}
	}
	let nekoComObj: Group;
	let planetScale = 1
	let planetModel: Group
</script>

<Sun planetScale={planetScale} pos={[30,5,150]}/>
<Planet bind:model={planetModel} rotate bloomType="weak" scale={planetScale}>
	<Trees planetObject={planetModel}/>
	<Nekocom bloomType="strong" scale={0.1} comPos={[-0.17,3.32,0.18]} bind:obj={nekoComObj}/>
</Planet>
<Moon orbit pos={[10,1,-10]} rotateOrigin={[0,0,0]}/>

