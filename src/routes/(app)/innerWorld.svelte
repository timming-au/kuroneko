<script lang="ts">
	import { Pass, T, useFrame } from "@threlte/core";
    import { useThrelte } from "@threlte/core";
	import { useGltf } from "@threlte/extras";
	import { AutoColliders, Collider, CollisionGroups, RigidBody } from "@threlte/rapier";
	import { BoxGeometry, Color, DirectionalLightHelper, DodecahedronGeometry, Euler, Group, HemisphereLight, IcosahedronGeometry, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, OctahedronGeometry, PlaneGeometry, PointLight, PointLightHelper, PolyhedronGeometry, RectAreaLight, Sphere, SphereGeometry, SpotLight, SpotLightHelper, TetrahedronGeometry, Vector2, Vector3 } from "three";
	
	import Nekocom from "./nekocom/Nekocom.svelte";
	import { cam, controls, dev } from "$lib/stores";
	import { TriMesh } from "@dimforge/rapier3d-compat";
	import { RGBToHex, RGBToString } from "$lib/helper";

    const {scene} = useThrelte()
	// light helper
	let directionalLight: any;
	let helper: DirectionalLightHelper
    $:{
        if($dev && directionalLight && scene){
			if(helper){
				scene.remove(helper)
			}
			helper = new DirectionalLightHelper( directionalLight, 5 );
			scene.add( helper );
        }
    }

	// floor
	const floor = {
		width:100,
		height:3,
		depth:100,
		material:new MeshStandardMaterial({
			color      :  new Color("rgb(226,35,213)"),
			emissive   :  new Color("rgb(160,90,90)"),
			flatShading: true,
			opacity    : 1
		}),
		getGeometry: function(){
			return new BoxGeometry(...this.getDimensions())
		},
		getDimensions:function(){
			return [this.width,this.height,this.depth]
		}
	}
	const {camera} = useThrelte()
	$:{
		if(nekoComObj && $camera && $controls){
			$camera.lookAt(nekoComObj.getWorldPosition(new Vector3()))
		}
	}
	let nekoComObj: Group;
</script>
<!-- 
<CollisionGroups groups={[0, 15]}>
	<RigidBody type={"fixed"}>
		<AutoColliders shape={"cuboid"}>
			<T.Mesh receiveShadow geometry={floor.getGeometry()} material={floor.material} position={[0,10,-125]}></T.Mesh>
		</AutoColliders>
	</RigidBody>
</CollisionGroups> -->
{#key nekoComObj && $controls}
{#if nekoComObj}
<T.DirectionalLight color={RGBToString($controls.directional.color)} bind:ref={directionalLight} castShadow intensity={$controls.directional.intensity} position={Object.values($controls.directional.pos)} target={nekoComObj}></T.DirectionalLight>
{/if}
{/key}
<Nekocom bind:obj={nekoComObj}/>

