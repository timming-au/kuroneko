<script lang="ts">
	import { T, type Scale } from "@threlte/core";
	import { useGltf } from "@threlte/extras";
	import { AutoColliders, RigidBody } from "@threlte/rapier";
	import { DoubleSide, Vector3, type Group } from "three";
  import {mergeBufferGeometries} from "three/examples/jsm/utils/BufferGeometryUtils";

  export let model: Group
  const gltfUrl = new URL('$src/assets/models/planet/planet.glb', import.meta.url).href
  const { gltf } = useGltf(gltfUrl, { useDraco: true })
  
  $:{
    if($gltf){
      for(let mat in $gltf.materials){
        $gltf.materials[mat].envMapIntensity = 0.1
        $gltf.materials[mat].side = DoubleSide
      }
    }
  }
</script>
{#if $gltf}
  <T.Group receiveShadow castShadow rotation={[0,0,0]} bind:ref={model} name="planet">
    <T.Mesh receiveShadow castShadow name="Icosphere013" geometry={$gltf.nodes.Icosphere013.geometry} material={$gltf.materials.water} />
    <T.Mesh receiveShadow
  castShadow        name="Icosphere013_1"
      geometry={$gltf.nodes.Icosphere013_1.geometry}
      material={$gltf.materials['deep water']}
    />
    <T.Mesh receiveShadow
  castShadow        name="Icosphere013_2"
      geometry={$gltf.nodes.Icosphere013_2.geometry}
      material={$gltf.materials.deepdeepwater}
    />
    <T.Mesh receiveShadow castShadow  name="Icosphere013_3" geometry={$gltf.nodes.Icosphere013_3.geometry} material={$gltf.materials.Snow} />
    <T.Mesh receiveShadow castShadow  name="Icosphere013_4" geometry={$gltf.nodes.Icosphere013_4.geometry} material={$gltf.materials.semisnow} />
    <T.Mesh receiveShadow castShadow  name="Icosphere013_5" geometry={$gltf.nodes.Icosphere013_5.geometry} material={$gltf.materials.grass} />
    <T.Mesh receiveShadow castShadow  name="Icosphere013_6" geometry={$gltf.nodes.Icosphere013_6.geometry} material={$gltf.materials.grassside} />
    <slot/>
  </T.Group>
{/if}