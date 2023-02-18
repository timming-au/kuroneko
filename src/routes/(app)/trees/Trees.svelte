<script lang="ts">
	import { BackSide, BufferGeometry, DoubleSide, FrontSide, InstancedMesh, Material, Mesh, MeshDistanceMaterial, MeshStandardMaterial, Object3D, Vector3 } from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
	import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
	import { treesMaterial } from './Materials';
    import { envIntensity } from '$lib/stores';

    export let planetObject: Mesh;

    type Tree = {
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
    }
    let loader = new GLTFLoader()
    let gltf: Mesh[]
	const gltfUrl = new URL('$src/assets/models/trees/trees.gltf', import.meta.url).href
	loader.load(gltfUrl,(models)=>{
        gltf = models.scene.children as Mesh[]
    })
    $:{
        if(planetObject && gltf){
            gltf.forEach((mesh:Mesh)=>{
                (mesh.material as MeshStandardMaterial).envMapIntensity = $envIntensity
            })
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
            [type:string]:Tree,
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
                    trees[type][name][part].geometry!.rotateX(-Math.PI/2)
                    treesMaterial[type][part].envMapIntensity = 0.1
                    trees[type][name][part].material = treesMaterial[type][part]
                }else{
                    console.log("unknown part:",part)
                }
            }
        })
        
        scatterTrees(10,trees.tree,0.05,"_tree",grass)
        scatterTrees(6,trees.sakura,0.05,"_sakura",grass)
    }   
    
    
    function scatterTrees(count: number, treeObj: Tree, maxScale: number, weightName: string, meshSurface: Mesh){
        for(let name in treeObj){
            let tree = treeObj[name]
            // instantiate trees
            let sampler = new MeshSurfaceSampler( meshSurface )
            .setWeightAttribute(weightName)
            .build();
            let branch = new InstancedMesh( tree.branch.geometry, tree.branch.material, count );
            let leaf = new InstancedMesh( tree.leaf.geometry, tree.leaf.material, count );
            
            branch.castShadow = true
            leaf.castShadow = true
            branch.receiveShadow = true
            leaf.receiveShadow = true

            const position = new Vector3();

            // Sample randomly from the surface, creating an instance of the sample
            // geometry at each sample point.
            let dummy = new Object3D()
            
            for ( let i = 0; i < count; i++ ) {
                let normal: Vector3 = new Vector3()

                sampler.sample( position, normal);

                dummy.position.set(...position.toArray());
                dummy.lookAt(normal)
                dummy.rotateZ(Math.random()*Math.PI*2)

                let [x,y] = dummy.rotation
                let scale = [x,y].map(rotation => (Math.abs(Math.sin(parseFloat(rotation.toString())))/4+0.75)**2).reduce( (a, b) => (a + b) )*maxScale-maxScale/5*Math.random()
                
                dummy.scale.set(scale,scale,scale)
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