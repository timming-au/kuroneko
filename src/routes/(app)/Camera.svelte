<script>
	import { dev } from "$lib/stores";
	import { OrbitControls, useThrelte, PerspectiveCamera } from "@threlte/core";
	import { DEG2RAD } from "three/src/math/MathUtils";
</script>

<PerspectiveCamera near={0.1} far={200} position={{x:0,y:0,z:0}} fov={90}>
    {#if $dev}
    <OrbitControls
    target={{ y: 0 }}
    maxPolarAngle={360 * DEG2RAD}
    minPolarAngle={0 * DEG2RAD}
    maxAzimuthAngle={180 * DEG2RAD}
    minAzimuthAngle={-180 * DEG2RAD}
    enableZoom={true}
    />
    {/if}
</PerspectiveCamera>
