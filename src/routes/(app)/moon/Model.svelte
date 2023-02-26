<script lang="ts">

	import { T, Three } from "@threlte/core";
	import { useGltf } from "@threlte/extras";
	import { Group } from "three";
  export let obj: Group
  export let innerObj: Group
  export const ref = new Group()
  export let rotateOrigin: [x:number,y:number,z:number] = [0,0,0]
  export let pos: [x:number,y:number,z:number] = [0,0,0]
  let computedOrigin = pos.map((x,i) => x - rotateOrigin[i]) as [x:number,y:number,z:number]
  type GLTFResult = {
    nodes: {
      Icosphere_1: THREE.Mesh
      Icosphere_2: THREE.Mesh
    }
    materials: {
      light: THREE.MeshStandardMaterial
      dark: THREE.MeshStandardMaterial
    }
  }

	const gltfUrl = new URL('$src/assets/models/moon/moon.glb', import.meta.url).href
  const { gltf } = useGltf<GLTFResult>(gltfUrl, { useDraco: true })
  $:{
    if($gltf){
      for(let mat in $gltf.materials){
        $gltf.materials[mat].envMapIntensity = 0.1
      }
    }
  }
</script>

{#if $gltf}
  <Three bind:ref={obj} position={rotateOrigin} type={ref} {...$$restProps}>
    <T.Group bind:ref={innerObj} position={computedOrigin} scale={1}>
      <T.Mesh geometry={$gltf.nodes.Icosphere_1.geometry} material={$gltf.materials.light} />
      <T.Mesh geometry={$gltf.nodes.Icosphere_2.geometry} material={$gltf.materials.dark} />
      <slot {ref} />
    </T.Group>
  </Three>
{/if}