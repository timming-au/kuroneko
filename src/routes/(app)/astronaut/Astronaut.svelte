<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@0.0.5 C:\Users\kuro\Desktop\web\kuroneko\src\assets\models\astronaut\astronaut.glb -k -t
-->
<script lang="ts">
  import type * as THREE from 'three'
  import { Group } from 'three'
  import { T, Three, type Props, type Events, type Slots } from '@threlte/core'
  import { useGltf } from '@threlte/extras'
	import { mat_basic, mat_shield } from './Materials';

  export const ref = new Group()
  export let obj: Group
  type GLTFResult = {
    nodes: {
      head: THREE.Mesh
      body: THREE.Mesh
      rleg: THREE.Mesh
      lleg: THREE.Mesh
      rarm: THREE.Mesh
      larm: THREE.Mesh
      Cube: THREE.Mesh
      shield: THREE.Mesh
    }
    materials: {
      body: THREE.MeshStandardMaterial
      shield: THREE.MeshStandardMaterial
    }
  }

	const gltfUrl = new URL('$src/assets/models/astronaut/astronaut.glb', import.meta.url).href
  const { gltf } = useGltf<GLTFResult>(gltfUrl, { useDraco: true })
  $: {
    if(obj){
      obj.traverse((child)=>{
        child.castShadow = true
      })
    }
  }
</script>

{#if $gltf}
<Three bind:ref={obj} type={ref} {...$$restProps}>
  <T.Mesh name="head" geometry={$gltf.nodes.head.geometry} material={$gltf.nodes.head.material} />
  <T.Mesh
    name="body"
    geometry={$gltf.nodes.body.geometry}
    material={mat_basic}
    position={[0, -1.21, 0]}
    scale={[0.63, 0.66, 0.66]}
  />
  <T.Mesh
    name="rleg"
    geometry={$gltf.nodes.rleg.geometry}
    material={mat_basic}
    position={[-0.44, -2.77, 0.23]}
  />
  <T.Mesh
    name="lleg"
    geometry={$gltf.nodes.lleg.geometry}
    material={mat_basic}
    position={[0.44, -2.77, 0.23]}
  />
  <T.Mesh
    name="rarm"
    geometry={$gltf.nodes.rarm.geometry}
    material={mat_basic}
    position={[-0.96, -1.16, -0.08]}
    scale={1.09}
  />
  <T.Mesh
    name="larm"
    geometry={$gltf.nodes.larm.geometry}
    material={mat_basic}
    position={[0.92, -1.14, -0.08]}
    scale={1.1}
  />
  <T.Mesh
    name="Cube"
    geometry={$gltf.nodes.Cube.geometry}
    material={mat_basic}
    position={[0.01, -1.2, -1.27]}
  />
  <T.Mesh name="shield" geometry={$gltf.nodes.shield.geometry} material={mat_shield} />

  <slot {ref} />
</Three>sd
{/if}
