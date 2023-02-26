<script lang="ts">
	import { controls } from "$lib/stores";
	import { T } from "@threlte/core";
	import { BoxGeometry, Mesh, RectAreaLight } from "three";
	import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
	import { mat_glass } from "./Materials";

    export let panel: Mesh
    // init rect light 
    RectAreaLightUniformsLib.init()

    let panel_0:RectAreaLight, panel_1:RectAreaLight   

</script>
<T.Group position={[0,0,-0.8]}>
    <T.Mesh bind:ref={panel} geometry={new BoxGeometry(1.6,1.6,0.1)} material={mat_glass}>
        <T.RectAreaLight bind:ref={panel_0} color={"rgb(252, 81, 138)"} power={500} position={[0,0,0]} width={1.5 * ($$props.scale ? $$props.scale : 1)} height={1.5 * ($$props.scale ? $$props.scale : 1)} intensity={$controls.com.intensity} rotation={[0,Math.PI,0]}/>
        <T.RectAreaLight bind:ref={panel_1} color={"rgb(252, 81, 138)"} power={500} position={[0,0,0]} width={1.5 * ($$props.scale ? $$props.scale : 1)} height={1.5 * ($$props.scale ? $$props.scale : 1)} intensity={$controls.com.intensity} rotation={[0,0,0]}/>
    </T.Mesh>
    <slot/>
</T.Group>