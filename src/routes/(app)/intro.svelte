<script lang="ts">
	import { Pass, T, useFrame } from "@threlte/core";
    import { useThrelte } from "@threlte/core";
	import { useGltf } from "@threlte/extras";
	import { AutoColliders, Collider, CollisionGroups, RigidBody } from "@threlte/rapier";
	import { BoxGeometry, Color, DodecahedronGeometry, Euler, HemisphereLight, IcosahedronGeometry, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, OctahedronGeometry, PlaneGeometry, PointLight, PointLightHelper, PolyhedronGeometry, RectAreaLight, Sphere, SphereGeometry, SpotLight, SpotLightHelper, TetrahedronGeometry, Vector2, Vector3 } from "three";
	
	import Nekocom from "./nekocom/Nekocom.svelte";
	import { cam, controls, dev } from "$lib/stores";
	import { TriMesh } from "@dimforge/rapier3d-compat";

    const {scene} = useThrelte()
	// light helper
	let light: any;
	// light helper
	let comLight: any;
    $:{
        if(light && comLight && scene && $dev){
            const sphereSize = 1;
            scene.add( new PointLightHelper( light, sphereSize ));
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

</script>
<!-- 
<CollisionGroups groups={[0, 15]}>
	<RigidBody type={"fixed"}>
		<AutoColliders shape={"cuboid"}>
			<T.Mesh receiveShadow geometry={floor.getGeometry()} material={floor.material} position={[0,10,-125]}></T.Mesh>
		</AutoColliders>
	</RigidBody>
</CollisionGroups> -->
<Nekocom/>

