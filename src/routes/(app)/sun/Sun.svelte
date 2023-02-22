<script lang="ts">

	import { PointLight, SpotLight, T, useFrame, useThrelte } from "@threlte/core";
	import { CameraHelper, DirectionalLight, DirectionalLightHelper, Group, IcosahedronGeometry, Mesh, MeshPhongMaterial, Object3D, PointLightHelper, SphereGeometry,  Vector2, Vector3, type PointLight as PointLight3 } from "three";
	import { mat_sun } from "./Materials";
    export const type = new Group();
    import type { BloomType } from '$lib/types';
	import { bloomObject } from "$lib/stores";
	export let bloomType: BloomType = "sun"
    export let pos: [x:number,y:number,z:number] = [0,0,0]
    export let planetScale: number = 1
    let sunMesh: Mesh
    let sunGroup: Group
    let light: PointLight3
    const {scene} = useThrelte()
    let settings = {
        low: {
            light:{
                shadow:{
                    mapSize: new Vector2(256,256),
                    radius: 0.1,
                    normalBias: 0.9,
                    camera:{
                        far:1000,
                        near:10,
                    },
                }
            }
        },
        med: {
            light:{
                shadow:{
                    mapSize: new Vector2(2048,2048),
                    radius: 2,
                    normalBias: 0.1,
                    camera:{
                        far:1000,
                        near:10,
                    },
                }
            }
        },
        high: {
            light:{
                shadow:{
                    mapSize: new Vector2(4096,4096),
                    radius: 1,
                    normalBias: 0.05,
                    camera:{
                        far:1000,
                        near:10,
                    },
                }
            }
        }
    }
    function setQuality(objName: string, quality: "low" | "med" | "high", obj: Object){
        if(Object.hasOwn(settings[quality],objName)){
            // @ts-ignore
            _reQuality(settings[quality][objName],quality,obj)
        } else{
            console.log("prop", objName, "doesnt exist in quality settings")
        }
    }
    function _reQuality(prop: Object | any, quality: "low" | "med" | "high", obj: Object){
        Object.keys(prop).map(key=>{
            if(typeof prop[key] == 'object' && Object.hasOwn(obj,key)){
                // @ts-ignore
                _reQuality(prop[key], quality, obj[key])
            }else {
                // @ts-ignore
                obj[key] = prop[key]
            }
        })
        return
    }
    $:{
        if(scene && sunMesh){
            let dirLight = new DirectionalLight(0xff7e33,5)
            setQuality("light", "med", dirLight)
            sunGroup.add( dirLight );
            dirLight.castShadow = true
            dirLight.shadow.camera.top = 3.75 * planetScale;
            dirLight.shadow.camera.bottom = -3.75 * planetScale;
            dirLight.shadow.camera.left = -3.75 * planetScale;
            dirLight.shadow.camera.right = 3.75 * planetScale;
            scene.add( new CameraHelper( dirLight.shadow.camera ) );
        }
    }
	$:{
		if(bloomType && sunMesh){
			$bloomObject = [sunMesh, bloomType]
		}
	}
    useFrame((_,delta)=>{
        if(sunMesh){
            sunMesh.rotateOnAxis(new Vector3(0,0,1),1*delta)
        }
    })
    let radius = 5
</script>
<T.Group bind:ref={sunGroup} position={pos}>
    <T.Mesh bind:ref={sunMesh}>
        <T.Mesh geometry={new IcosahedronGeometry(radius,2)} material={mat_sun}></T.Mesh>
    </T.Mesh>
</T.Group>