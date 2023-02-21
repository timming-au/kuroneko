<script lang="ts">

	import { PointLight, T, useFrame, useThrelte } from "@threlte/core";
	import { Group, IcosahedronGeometry, Mesh, MeshPhongMaterial, PointLightHelper, SphereGeometry, Vector2, Vector3, type PointLight as PointLight3 } from "three";
	import { mat_sun } from "./Materials";
    export const type = new Group();
    import type { BloomType } from '$lib/types';
	import { bloomObject } from "$lib/stores";
	export let bloomType: BloomType = "sun"
    let obj: Mesh
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
        if(light){
            setQuality("light", "high", light)
            scene.add(new PointLightHelper(light,2,0x00ff00))
        }
    }
	$:{
		if(bloomType && obj){
			$bloomObject = [obj, bloomType]
		}
	}
    useFrame((_,delta)=>{
        if(obj){
            obj.rotateOnAxis(new Vector3(0,0,1),1*delta)
        }
    })
    let radius = 5
</script>
<T.Mesh bind:ref={obj} {...$$restProps}>
    <T.Mesh geometry={new IcosahedronGeometry(radius,2)} material={mat_sun}></T.Mesh>
</T.Mesh>
{#if obj}
<PointLight shadow color={0xff7e33} position={obj.position} power={500} intensity={50000} bind:light={light}></PointLight>
{/if}