<script>
	import { dev } from "$lib/stores";
	import { OrbitControls, useThrelte, PerspectiveCamera } from "@threlte/core";
	import { DEG2RAD } from "three/src/math/MathUtils";
    const {renderer} = useThrelte()
</script>

<PerspectiveCamera position={{x:500,y:500,z:500}} fov={90}>
    {#if $dev}
    <OrbitControls
    target={{ y: 1000 }}
    maxPolarAngle={360 * DEG2RAD}
    minPolarAngle={0 * DEG2RAD}
    maxAzimuthAngle={180 * DEG2RAD}
    minAzimuthAngle={-180 * DEG2RAD}
    enableZoom={true}
    />
    {/if}
</PerspectiveCamera>