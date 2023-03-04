<script lang="ts">

	import { PointLight, SpotLight, T, useFrame, useThrelte } from "@threlte/core";
	import { CameraHelper, DirectionalLight, DirectionalLightHelper, Group, IcosahedronGeometry, Mesh, MeshPhongMaterial, Object3D, PointLightHelper, SphereGeometry,  Vector2, Vector3, WebGLRenderer, WebGLRenderTarget, type PointLight as PointLight3 } from "three";
	import { mat_sun } from "./Materials";
    export const type = new Group();
    import type { BloomType } from '$lib/types';
	import { bloomObject, quality } from "$lib/stores";
	export let bloomType: BloomType = "sun"
    export let pos: [x:number,y:number,z:number] = [0,0,0]
    export let planetScale: number = 1
    export let sun: Mesh
    let dirLight: DirectionalLight
    let sunMesh: Mesh
    let sunGroup: Group
    let light: PointLight3
    const {scene} = useThrelte()
    let settings = {
        low: {
            light:{
                castShadow: false,
            }
        },
        med: {
            light:{
                castShadow: true,
                shadow:{
                    mapSize: new Vector2(512,512),
                    radius: 1,
                    normalBias: 0.2,
                    camera:{
                        far:1000,
                        near:10,
                    },
                }
            }
        },
        high: {
            light:{
                castShadow: true,
                shadow:{
                    mapSize: new Vector2(2048,2048),
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
            dirLight = new DirectionalLight(0xff7e33,5)
            sunGroup.add( dirLight );
            dirLight.shadow.camera.top = 3.75 * planetScale;
            dirLight.shadow.camera.bottom = -3.75 * planetScale;
            dirLight.shadow.camera.left = -3.75 * planetScale;
            dirLight.shadow.camera.right = 3.75 * planetScale;
            // scene.add( new CameraHelper( dirLight.shadow.camera ) );
        }
    }
    $:{
        if($quality && dirLight && scene && sunMesh){
            if(dirLight.shadow.map){
                dirLight.shadow.map.dispose()
                dirLight.shadow.map = null as unknown as WebGLRenderTarget
            }
            dirLight.shadow.dispose()
            setQuality("light", $quality, dirLight)
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
        <T.Mesh bind:ref={sun} geometry={new IcosahedronGeometry(radius,2)} material={mat_sun}></T.Mesh>
    </T.Mesh>
</T.Group>