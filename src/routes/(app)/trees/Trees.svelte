<script lang="ts">
	import { parse } from 'cookie';
	import { BoxGeometry, BufferGeometry, InstancedMesh, Material, Matrix4, Mesh, MeshBasicMaterial, Object3D, Vector3, type BufferAttribute, type Event as Event3 } from 'three';
	import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
	import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
    import { treesMaterial } from './Materials';

    export let planetObject: Mesh;

    let loader = new GLTFLoader()
    let gltf: Mesh[]
	const gltfUrl = new URL('$src/assets/models/trees/treestest.gltf', import.meta.url).href
	loader.load(gltfUrl,(models)=>{
        gltf = models.scene.children as Mesh[]
    })
    $:{
        if(planetObject && gltf){
            render()
        }
    }
    /**
     * Parses model given in format ([treeType]number)_{branch/leaf}
     * Returns [treeType], (name), {treePart}
     * @param name Name of model, must be in [name][number]_[branch/leaf]
     */
    function parseTree(name:string){
        return [name.substring(0,name.search(/\d/)), name.substring(0,name.indexOf("_")), name.substring(name.indexOf("_")+1)]
    }
    function render(){
        let models = gltf
        let semisnow = planetObject.children[4] as Mesh
        let grass = planetObject.children[5] as Mesh
        const trees:{
            [type:string]:{
                [name:string]:{
                    branch:{
                        geometry:BufferGeometry | undefined,
                        material:Material | undefined
                    },
                    leaf:{
                        geometry:BufferGeometry | undefined,
                        material:Material | undefined
                    }
                }
            },
        } = {}
        // 
        Object.values(models).map(obj=>{
            let [type, name, part] = parseTree(obj.name)
            if((part == "branch" || part == "leaf") && (type == "tree" || type == "sakura")){
                if(!Object.hasOwn(trees, type)){
                    trees[type] = {}
                }
                if(!Object.hasOwn(trees[type], name)){
                    trees[type][name] = {
                        branch:{
                            geometry:undefined,
                            material:undefined,
                        },
                        leaf:{
                            geometry:undefined,
                            material:undefined,
                        }
                    }
                }
                if(part == "branch" || part == "leaf"){
                    trees[type][name][part].geometry = obj.geometry
                    trees[type][name][part].geometry!.scale(0.1,0.1,0.1)
                    trees[type][name][part].geometry!.rotateX(-Math.PI)
                    trees[type][name][part].geometry!.translate(0,2,0)
                    trees[type][name][part].material = treesMaterial[type][part]
                }else{
                    console.log("unknown part:",part)
                }
            }
        })
        
        for(let name in trees.tree){
            let tree = trees.tree[name]
            // instantiate trees
            let sampler = new MeshSurfaceSampler( grass )
            .setWeightAttribute("_tree")
            .build();
            let count = 5
            let branch = new InstancedMesh( tree.branch.geometry, tree.branch.material, count );
            let leaf = new InstancedMesh( tree.leaf.geometry, tree.leaf.material, count );
            const position = new Vector3();

            // Sample randomly from the surface, creating an instance of the sample
            // geometry at each sample point.
            let dummy = new Object3D()
            
            for ( let i = 0; i < count; i ++ ) {
                let normal: Vector3 = new Vector3()
                sampler.sample( position, normal );

                dummy.position.set(...position.toArray());
                dummy.lookAt(normal)
                dummy.updateMatrix()

                branch.setMatrixAt( i, dummy.matrix );
                leaf.setMatrixAt( i, dummy.matrix );
            }

            branch.instanceMatrix.needsUpdate = true;
            leaf.instanceMatrix.needsUpdate = true;
            planetObject.add(branch);	
            planetObject.add(leaf);	
        }
       
    }
</script>