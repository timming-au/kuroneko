<script lang="ts">
  import { RigidBody, AutoColliders } from "@threlte/rapier";
  import { T, Three } from "@threlte/core";
	import { useGltf } from "@threlte/extras";
	import type { RigidBodyTypeString } from "@threlte/rapier/dist/lib/parseRigidBodyType";
	import type { Group } from "three";

	const gltfUrl = new URL('$src/assets/models/nekocom/nekocom.gltf', import.meta.url).href
	const { gltf } = useGltf(gltfUrl)

  export let rigidBodyType: RigidBodyTypeString
  export let obj:Group
  $:{
    if(obj){
      obj.traverse((child)=>{
        if(child.isMesh){
          child.castShadow = true
        }
      })
    }
  }
</script>
{#if $gltf}
<RigidBody type={rigidBodyType}>
    <AutoColliders shape={'trimesh'}>
        <T.Group bind:ref={obj} {...$$restProps}>
            <T.Mesh geometry={$gltf.nodes.monitor.geometry} material={$gltf.materials.monitor} />
            <T.Mesh geometry={$gltf.nodes.tail.geometry} material={$gltf.materials.tail} position={[-1.13, -0.66, 0.6]} />
            <T.Mesh
              geometry={$gltf.nodes.tail_connector.geometry}
              material={$gltf.materials.connector}
              position={[-0.03, -1.21, 0.39]}
            />
            <T.Mesh
              geometry={$gltf.nodes.ear_band.geometry}
              material={$gltf.materials['ear connector']}
              position={[0.01, 0.84, -0.19]}
            />
            <T.Group position={[-0.77, 1.42, -0.43]} rotation={[-1.52, 1.16, 1.71]}>
              <T.Mesh geometry={$gltf.nodes.Cube002.geometry} material={$gltf.materials['inside ear']} />
              <T.Mesh geometry={$gltf.nodes.Cube002_1.geometry} material={$gltf.materials['outside ear']} />
            </T.Group>
            <T.Group position={[0.72, 1.42, -0.43]} rotation={[-1.52, -1.16, -1.71]}>
              <T.Mesh geometry={$gltf.nodes.Cube004.geometry} material={$gltf.materials['inside ear']} />
              <T.Mesh geometry={$gltf.nodes.Cube004_1.geometry} material={$gltf.materials['outside ear']} />
            </T.Group>
            <T.Mesh geometry={$gltf.nodes.left_paw.geometry} material={$gltf.materials.paw} position={[-0.56, -1.31, -0.74]} />
            <T.Mesh geometry={$gltf.nodes.right_paw.geometry} material={$gltf.materials.paw} position={[0.58, -1.31, -0.74]} />
            <T.Mesh
              geometry={$gltf.nodes.paw_connector_right.geometry}
              material={$gltf.materials.connector}
              position={[0.55, -1.21, -0.43]}
            />
            <T.Mesh
              geometry={$gltf.nodes.paw_connector_left.geometry}
              material={$gltf.materials.connector}
              position={[-0.59, -1.21, -0.43]}
            />
        
            <slot/>
        </T.Group>
    </AutoColliders>
</RigidBody>
{/if}