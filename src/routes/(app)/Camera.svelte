<script lang="ts">
	import { dev } from "$lib/stores";
	import { OrbitControls, useThrelte, PerspectiveCamera, useFrame } from "@threlte/core";
	import { useFixedJoint } from "@threlte/rapier";
	import type { PerspectiveCamera as PerspectiveCamera3 } from "three";
	import { DEG2RAD } from "three/src/math/MathUtils";
	import { FlyControls } from "./Fly";
    const {camera, renderer} = useThrelte()
    let controls: FlyControls
    $:{
        if($camera && renderer){
            controls = new FlyControls( $camera, renderer.domElement );
            controls.domElement = renderer.domElement;
            controls.rollSpeed = Math.PI / 24;
            controls.autoForward = false;
            controls.dragToLook = false;
        }
    }
    useFrame((_,delta)=>{
        if(controls){
            controls.update( delta );
        }
    })
</script>

<PerspectiveCamera near={0.1} far={200} position={{x:0,y:0,z:0}} fov={90}>
    <!-- {#if $dev}
    <OrbitControls
    target={{ y: 0 }}
    maxPolarAngle={360 * DEG2RAD}
    minPolarAngle={0 * DEG2RAD}
    maxAzimuthAngle={180 * DEG2RAD}
    minAzimuthAngle={-180 * DEG2RAD}
    enableZoom={true}
    />
    {/if} -->
</PerspectiveCamera>
