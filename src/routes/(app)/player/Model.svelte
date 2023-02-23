<script lang="ts">

	import { T } from "@threlte/core";
	import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
  export let model: Mesh
  export let shadow: boolean = false
  $:{
    if(model){
      model.traverse((obj)=>{
        obj.castShadow = true
        obj.receiveShadow = true
      })
    }
  }
</script>
<T.Mesh bind:ref={model} geometry={new BoxGeometry(1.5,4,0.5)} material={new MeshBasicMaterial()}>
</T.Mesh>