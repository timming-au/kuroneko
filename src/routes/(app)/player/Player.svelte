<script lang="ts">
	import type RAPIER from "@dimforge/rapier3d-compat";
	import { T } from "@threlte/core";
	import { RigidBody, AutoColliders, BasicPlayerController, useRapier, Collider, Debug } from "@threlte/rapier";
	import { onMount } from "svelte";
  import type { Mesh } from "three";
	import PlayerController from "./Controller";
  import Model from "./Model.svelte";
  
  export let shadow: boolean = false;
  const {world} = useRapier()
  let collider: RAPIER.Collider[]
  let model: Mesh;
  let rigidBody: RAPIER.RigidBody
  $:{
    console.log(collider)
    console.log(model)
  }
</script>
<RigidBody {...$$restProps} rigidBody={rigidBody}>
  <Debug></Debug>
  <AutoColliders colliders={collider}>
    <Model shadow bind:model={model}></Model>
  </AutoColliders>
</RigidBody>