<script lang="ts">

	import { T } from "@threlte/core";
	import { BoxGeometry, Mesh, MeshBasicMaterial, SphereGeometry } from "three";
  export let model: Mesh
  export let shadow: boolean = false
  $:{
    if(model && shadow){
      model.traverse((obj)=>{
        obj.castShadow = true
        obj.receiveShadow = true
      })
    }
  }
</script>
<T.Mesh bind:ref={model} geometry={new SphereGeometry(0.3,8,8)} material={new MeshBasicMaterial()}>
</T.Mesh>