<script lang="ts">
    import { RigidBody, AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
	import { useGltf } from "@threlte/extras";
	import { mat_nekocom_connectors } from "../Materials";
	import type { RigidBodyTypeString } from "@threlte/rapier/dist/lib/parseRigidBodyType";
    
	const { gltf } = useGltf('src/assets/models/nekocom.gltf')

    export let rigidBodyType: RigidBodyTypeString
    export let pos:[x: number, y: number, z: number]
</script>
{#if $gltf}
<RigidBody type={rigidBodyType}>
    <AutoColliders shape={'trimesh'}>
        <T.Group {...$$restProps} position={pos} scale={3} rotation={[0,Math.PI,0]} name={"nekocom"}>
            <!-- GLTF -->
            <T.Group>
            <T.Mesh receiveShadow castShadow geometry={$gltf.nodes.monitor.geometry} material={$gltf.materials.monitor} />
            <!-- <T.Mesh receiveShadow castShadow geometry={$gltf.nodes.monitor.geometry} material={mat} /> -->
            <T.Mesh castShadow geometry={$gltf.nodes.tail.geometry} material={$gltf.materials.tail} position={[-1.13, -0.66, 0.6]} />
            <T.Mesh castShadow     
                geometry={$gltf.nodes.tail_connector.geometry}
                material={mat_nekocom_connectors}
                position={[-0.03, -1.21, 0.39]}
            />
            <T.Mesh castShadow geometry={$gltf.nodes.ear_band.geometry}
                material={$gltf.materials['ear connector']}
                position={[0.01, 0.84, -0.19]}
            />
            <T.Group position={[-0.77, 1.42, -0.43]} rotation={[-1.52, 1.16, 1.71]}>
                <T.Mesh castShadow geometry={$gltf.nodes.Cube002.geometry} material={$gltf.materials['inside ear']} />
                <T.Mesh castShadow geometry={$gltf.nodes.Cube002_1.geometry} material={$gltf.materials['outside ear']} />
            </T.Group>
            <T.Group position={[0.72, 1.42, -0.43]} rotation={[-1.52, -1.16, -1.71]}>
                <T.Mesh castShadow geometry={$gltf.nodes.Cube004.geometry} material={$gltf.materials['inside ear']} />
                <T.Mesh castShadow geometry={$gltf.nodes.Cube004_1.geometry} material={$gltf.materials['outside ear']} />
            </T.Group>
            <T.Mesh castShadow geometry={$gltf.nodes.left_paw.geometry} material={$gltf.materials.paw} position={[-0.56, -1.31, -0.74]} />
            <T.Mesh castShadow geometry={$gltf.nodes.right_paw.geometry} material={$gltf.materials.paw} position={[0.58, -1.31, -0.74]} />
            <T.Mesh
                geometry={$gltf.nodes.paw_connector_right.geometry}
                material={mat_nekocom_connectors}
                position={[0.55, -1.21, -0.43]} castShadow/>
            <T.Mesh castShadow geometry={$gltf.nodes.paw_connector_left.geometry}
                material={mat_nekocom_connectors}
                position={[-0.59, -1.21, -0.43]}
            />
            </T.Group>
            <slot></slot>
        </T.Group>
    </AutoColliders>
</RigidBody>
{/if}