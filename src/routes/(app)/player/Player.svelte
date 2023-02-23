<script lang="ts">
	import type RAPIER from "@dimforge/rapier3d-compat";
	import { AutoColliders, RigidBody } from "@threlte/rapier";
	import type { Mesh } from "three";
	import Model from "./Model.svelte";
  
  export let shadow: boolean = false;
  let collider: RAPIER.Collider[]
  let model: Mesh;
  let rigidBody: RAPIER.RigidBody
</script>
<RigidBody {...$$restProps} rigidBody={rigidBody}>
  <AutoColliders colliders={collider}>
    <Model shadow={shadow} bind:model={model}></Model>
  </AutoColliders>
</RigidBody>