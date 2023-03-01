<script lang="ts">
	import { bloomObject, quality } from "$lib/stores";
	import { useThrelte } from "@threlte/core";
	import { BlendFunction, CopyMaterial, Effect, EffectComposer, EffectPass, GodRaysEffect, KernelSize, Pass, RenderPass, SelectiveBloomEffect, ShaderPass, SMAAEffect, SMAAPreset } from "postprocessing";
	import { onMount } from "svelte";
	import { ACESFilmicToneMapping, HalfFloatType, Mesh, Object3D, sRGBEncoding } from "three";

    export let loaded:boolean
    export let sun: Mesh
    const { renderer, advance, scene, camera } = useThrelte()
    let sunIsInitialised = false;
    let composer:EffectComposer 
    let mounted = false
    let bloomBuffer: [obj: Object3D<THREE.Event>, type: string][] = []
    onMount(()=>{
        composer = new EffectComposer(renderer,{
            frameBufferType: HalfFloatType
        });
        composer.addPass(new RenderPass(scene, $camera));

        Object.entries(passes.init()).forEach(([_,pass])=>{
            composer.addPass(pass)
        })
        mounted = true
    })
    $:{
        if(mounted && $quality && sunIsInitialised){
            if($quality == "low"){
                for(let pass in passFactory){
                    if(pass != "shader"){
                        passFactory[pass].disable()
                    }
                }
            }else if($quality == "med"){
                for(let pass in passFactory){
                    if(pass != "shader"){
                        passFactory[pass].enable()
                    }
                }
                passFactory.godrays.setRes(270)
                passFactory.godrays.setKernelSize(KernelSize.MEDIUM)
                passFactory.smaa.effect!.applyPreset(SMAAPreset.MEDIUM)
            }else if($quality == "high"){
                for(let pass in passFactory){
                    if(pass != "shader"){
                        passFactory[pass].enable()
                    }
                }
                passFactory.godrays.setRes(1080)
                passFactory.godrays.setKernelSize(KernelSize.SMALL)
                passFactory.smaa.effect!.applyPreset(SMAAPreset.ULTRA)
            }
        }
        console.log(composer)
    }
    $:{
        if(mounted && sun && !sunIsInitialised){
            passFactory.godrays.initSun(sun)
            let pass = passFactory.godrays.init()
            
            if(pass) composer.addPass(pass,composer.passes.length-1)
            sunIsInitialised = true;
        }
    }
    const passFactory:{
        smaa:{
            pass: EffectPass | null,
            effect: SMAAEffect | null,
            init(): EffectPass,
            disable(): void,
            enable(): void,
        },
        bloom: {
            pass: EffectPass | null,
            sun: SelectiveBloomEffect | null,
            strong: SelectiveBloomEffect | null,
            weak: SelectiveBloomEffect | null,
            init(): EffectPass,
            disable(): void,
            enable(): void,
        },
        godrays:{
            pass: EffectPass | null,
            sun: Mesh | null,
            effect: GodRaysEffect | null
            setRes(width:number):void
            setKernelSize(size: KernelSize):void
            initSun(sun:Mesh): void
            init(): EffectPass | undefined,
            disable(): void,
            enable(): void,
        },
        shader: {
            pass: ShaderPass | null,
            init(): ShaderPass,
            disable(): void,
            enable(): void,
        },
    } = {
        godrays:{
            pass: null,
            sun: null,
            effect: null,
            setRes:function(width:number){
                if(this.effect){
                    this.effect.resolution.width = width
                }
            },
            setKernelSize:function(size:KernelSize){
                if(this.effect){
                    this.effect.blurPass.kernelSize = size
                }
            },
            initSun:function(sun){
                this.sun = sun
            },
            init: function(){
                if(this.sun){
                    this.effect = new GodRaysEffect($camera, this.sun, {
                        resolutionX: 1080,
                        kernelSize: KernelSize.SMALL,
                        density: 0.96,
                        decay: 0.96,
                        weight: 0.3,
                        exposure: 0.54,
                        samples: 120,
                        clampMax: 1.0
                    })
                    this.pass = new EffectPass($camera,this.effect)
                    return this.pass
                }
            },
            disable: function(){
                if(this.pass){
                    this.pass.enabled = false
                }else{
                    console.log("effect pass not initialised!")
                }
            },
            enable: function(){
                if(this.pass){
                    this.pass.enabled = true
                }else{
                    console.log("effect pass not initialised!")
                }
            },
        },
        bloom: {
            pass: null,
            sun: null,
            strong: null,
            weak: null,
            init: function(){
                // sun bloom
                this.sun = new SelectiveBloomEffect(scene, $camera, {
                    blendFunction: BlendFunction.ADD,
                    mipmapBlur: true,
                    luminanceThreshold: 0,
                    luminanceSmoothing: 0,
                    intensity: 50,
                    radius: 0.6
                });
                this.sun.inverted = false
                this.sun.selection.layer = 7

                // strong bloom
                this.strong = new SelectiveBloomEffect(scene, $camera, {
                    blendFunction: BlendFunction.ADD,
                    mipmapBlur: true,
                    luminanceThreshold: 0,
                    luminanceSmoothing: 0,
                    intensity: 1,
                    radius: 0.5
                });
                this.strong.inverted = false
                this.strong.selection.layer = 6

                // weak bloom
                this.weak = new SelectiveBloomEffect(scene, $camera, {
                    blendFunction: BlendFunction.ADD,
                    mipmapBlur: true,
                    luminanceThreshold: 0.5,
                    luminanceSmoothing: 0.1,
                    intensity: 0.2,
                    radius: 0.2
                });
                this.weak.inverted = false
                this.weak.selection.layer = 5
        
                this.pass = new EffectPass($camera, this.weak, this.strong, this.sun)
                return this.pass
            },
            disable: function(){
                if(this.pass){
                    this.pass.enabled = false
                }else{
                    console.log("effect pass not initialised!")
                }
            },
            enable: function(){
                if(this.pass){
                    this.pass.enabled = true
                }else{
                    console.log("effect pass not initialised!")
                }
            },
        },
        smaa: {
            pass: null,
            effect: null,
            init: function(){
                this.effect = new SMAAEffect({preset:SMAAPreset.MEDIUM})
                this.pass = new EffectPass($camera, this.effect)
                return this.pass
            },
            disable: function(){
                if(this.pass){
                    this.pass.enabled = false
                }else{
                    console.log("effect pass not initialised!")
                }
            },
            enable: function(){
                if(this.pass){
                    this.pass.enabled = true
                }else{
                    console.log("effect pass not initialised!")
                }
            },
        },
        
        shader: {
            pass: null,
            init: function(){
                let shaderPass = new ShaderPass(new CopyMaterial())
                this.pass = shaderPass
                return this.pass
            },
            disable: function(){
                if(this.pass){
                    this.pass.enabled = false
                }else{
                    console.log("shader pass not initialised!")
                }
            },
            enable: function(){
                if(this.pass){
                    this.pass.enabled = true
                }else{
                    console.log("shader pass not initialised!")
                }
            },
        },
    }
    const passes:{
        passes: {[passName:string]:Pass},
        init(): {[passName:string]:Pass},
    } = {
        passes: {},
        init: function(){
            let keys = Object.keys(passFactory)
            keys.forEach((key)=>{
                if(typeof passFactory[key] == "object"){
                    let pass = passFactory[key].init()
                    if(pass){
                        this.passes[key] = pass as Pass
                    }
                }
            })
            return this.passes
        }
    }
	function render(){
		requestAnimationFrame(render)
        if(composer) composer.render()
		advance()
	}
	$:{
		loaded && render()
	}
    function traverseWithoutParent(objects:Object3D[] = [], object: Object3D): Object3D[]{
        if(object.children.length > 0){
            object.children.forEach((child)=>{
                traverseWithoutParent(objects, child)
            })
        }else{
            objects.push(object)
        }
        return objects
    }
    $:{
        if($bloomObject){
            bloomBuffer = [...bloomBuffer,$bloomObject]
        }
    }
    $:{
        if(bloomBuffer && mounted){
            bloomBuffer.forEach(([obj,type])=>{
                if(Object.hasOwn(passFactory["bloom"], type)){
                    traverseWithoutParent(undefined,obj).forEach((object)=>{
                        passFactory["bloom"][type].selection.toggle(object)
                    })
                }
            })
            bloomBuffer = []
        }
    }
	$:{
		if(renderer){
			// 
    		renderer.outputEncoding = sRGBEncoding
			renderer.physicallyCorrectLights = true
			renderer.toneMapping = ACESFilmicToneMapping
			renderer.toneMappingExposure = 1
			renderer.setClearColor(0x000000,1)
		}
	}
	$:{
		if(renderer && scene && $camera){
			renderer.compile(scene, $camera)
		}
	}
</script>