<script lang="ts">
	import { controls } from "$lib/stores";
    import { T } from "@threlte/core";
	import { HTML } from "@threlte/extras";
	import { BoxGeometry, Mesh, Object3D, RectAreaLight } from "three";
	import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
	import Content from "../content/content.svelte";
	import { mat_glass } from "./Materials";

    export let panel: Mesh
    // init rect light 
    RectAreaLightUniformsLib.init()

    let panel_0:RectAreaLight, panel_1:RectAreaLight   

    // on intensity change
    $: {
        if(panel_0 && panel_1){
            panel_0.intensity = $controls.com.intensity
            panel_1.intensity = $controls.com.intensity
        }
    }
</script>
<T.Group position={[0,0,-0.8]}>
    <T.Mesh bind:ref={panel} geometry={new BoxGeometry(1.6,1.6,0.1)} material={mat_glass}>
        <T.RectAreaLight bind:ref={panel_0} color={"rgb(252, 81, 138)"} power={500} position={[0,0,0]} width={5} height={5} intensity={1} rotation={[0,Math.PI,0]}/>
        <T.RectAreaLight bind:ref={panel_1} color={"rgb(252, 81, 138)"} power={500} position={[0,0,0]} width={5} height={5} intensity={1} rotation={[0,0,0]}/>
    </T.Mesh>
    <slot/>
</T.Group>