<script lang="ts">
	import { useGltf } from '@threlte/extras';
	import { BoxGeometry, BufferGeometry, InstancedMesh, Material, Matrix4, Mesh, MeshBasicMaterial, Object3D, Vector3, type BufferAttribute } from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
	import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';

    export let planetObject: Mesh;

	const gltfUrl = new URL('$src/assets/models/trees/treestest.gltf', import.meta.url).href
	const { gltf } = useGltf(gltfUrl)
    $:{
        if(planetObject && $gltf){
            render()
        }
    }
    function render(){
        let models = $gltf!.nodes
        let semisnow = planetObject.children[4] as Mesh
        let grass = planetObject.children[5] as Mesh
        console.log(planetObject)
        const trees:{
            sakura:{[name:string]:{
                branch:{
                    geometry:BufferGeometry,
                    material:Material
                },
                leaf:{
                    geometry:BufferGeometry,
                    material:Material
                }
            }},
            normal:{[name:string]:{
                branch:{
                    geometry:BufferGeometry,
                    material:Material
                },
                leaf:{
                    geometry:BufferGeometry,
                    material:Material
                }
            }}
        } = {
            sakura:{

            },
            normal:{

            }
        }
        for(let name in models){
            if(name.includes("sakura")){
                if(name.includes("branch")){
                    trees.sakura[name].branch.geometry = models[name].geometry
                }else if(name.includes("leaf")){
                    trees.sakura[name].leaf.geometry = models[name].geometry
                }
            }
            else if(name.includes("tree")){
                if(name.includes("branch")){
                    trees.normal[name].branch.geometry = models[name].geometry
                }else if(name.includes("leaf")){
                    trees.normal[name].leaf.geometry = models[name].geometry
                }
            }
        }
        const sampler = new MeshSurfaceSampler( grass )
        .setWeightAttribute("_tree")
        .build();

        const sampleMesh = new InstancedMesh( new BoxGeometry(0.2,0.2,0.9), new MeshBasicMaterial(), 100 );

        const position = new Vector3();

        const _matrix = new Matrix4();

        // Sample randomly from the surface, creating an instance of the sample
        // geometry at each sample point.
        let dummy = new Object3D()
        
        for ( let i = 0; i < 100; i ++ ) {
            let normal: Vector3 = new Vector3()
            sampler.sample( position, normal );

            dummy.position.set(...position.toArray());
            dummy.lookAt(normal)
            dummy.updateMatrix()

            sampleMesh.setMatrixAt( i, dummy.matrix );
        }

        sampleMesh.instanceMatrix.needsUpdate = true;
        planetObject.add(sampleMesh);	
        console.log(planetObject)
    }
</script>