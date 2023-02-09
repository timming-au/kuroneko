<script lang="ts">
	import { controls } from "$lib/stores";
    import { T } from "@threlte/core";
	import { BoxGeometry, Mesh, Object3D } from "three";
	import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
	import { mat_glass } from "./Materials";

    export let panel: Mesh
    // init rect light 
    RectAreaLightUniformsLib.init()
</script>
<T.Mesh bind:ref={panel} position={[0,0,-0.8]} geometry={new BoxGeometry(1.6,1.6,0.1)} material={mat_glass}>
    <T.RectAreaLight color={"rgb(252, 81, 138)"} power={500} position={[0,0,0]} width={5} height={5} intensity={$controls.com.intensity} rotation={[0,Math.PI,0]}/>
    <T.RectAreaLight color={"rgb(252, 81, 138)"} power={500} position={[0,0,0]} width={5} height={5} intensity={$controls.com.intensity} rotation={[0,0,0]}/>
</T.Mesh>