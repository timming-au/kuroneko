<script lang="ts">
    import { controls } from "$lib/stores";
    import type { GUI } from 'dat.gui';
    import Stats from "stats.js"
    import { onDestroy, onMount, tick } from "svelte";
    import "../../app.css"
    let gui: GUI
    import gsap from "gsap";
    const KEYS = {
        'a': 65,
        's': 83,
        'w': 87,
        'd': 68,
        'space': 32,
        'shift': 16,
        'esc': 27
    };
    let stats: Stats;
    onMount(()=>{
        stats = new Stats()
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );
        requestAnimationFrame( animate );
        sliderSens.value = $controls.explore.sensitivity + ''
        updateSlider(sliderSens)
        showInterface()
        document.addEventListener("keydown",onKeyDown)
    })
    onMount(()=>{
        overlay.addEventListener("click", async function(e){                                    
            if(e.type == "click"){
                if (document.pointerLockElement !== overlay) {
                    await overlay.requestPointerLock();
                    toggleInterface()
                }
            }
        })
        overlay.addEventListener("keydown", onKeyDown)
    })
    onDestroy(()=>{
        if(overlay){
            overlay.removeEventListener("click",onKeyDown)
        }
    })
    onDestroy(()=>{
        if(typeof document !== "undefined"){
            document.removeEventListener("keydown",onKeyDown)
        }
    })
    function onKeyDown(e){
        if(e.key == "e"){
            if (document.pointerLockElement === overlay) {
                document.exitPointerLock()
                toggleInterface()
            } else {
                overlay.requestPointerLock();
                toggleInterface()
            }
        }
    }
    function showInterface(){
        overlayVisible = true
        $controls.explore.enabled = !overlayVisible
        animateOverlay(true)
    }
    function toggleInterface(){
        overlayVisible = !overlayVisible
        $controls.explore.enabled = !overlayVisible
        animateOverlay()
    }
    function animateOverlay(instant = false){
        gsap.to(overlay,{
            opacity: !overlayVisible ? 0 : 1,
            backdropFilter: `blur(${!overlayVisible ? 0 : 4}px)`,
            duration: instant ? 0 : 0.3,
            onComplete:()=>{
                overlay.style.display = !overlayVisible ? "none" : "flex"
            }
        })
    }
    function animate() {

        stats.update()

        requestAnimationFrame( animate );

    }
    function updateSlider(e){
        let value = (e.value-e.min)/(e.max-e.min)*100
        $controls.explore.sensitivity = e.value
        e.style.background = 'linear-gradient(to right, #ffa8d5 0%, #ffa8d5 ' + value + '%, #54464d ' + value + '%, #54464d 100%)'
    }
    let overlayVisible = false
    let overlay: HTMLElement
    let sliderSens: HTMLInputElement
    
</script>
<div id="interface" bind:this={overlay} class="text-white z-[9999999999] cursor-pointer bg-black bg-opacity-40 pointer-events-auto gap-12 flex-col absolute left-0 top-0 w-full h-full flex items-center justify-center transition-all">
    <div class='flex -mt-20' on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()}>
        <span class="text-6xl">neko</span>
        <span class="text-[#ffa8d5] text-6xl">OS</span>
    </div>
    <div class="grid grid-cols-2 gap-8" on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()}>
        <div class="flex flex-col gap-4" >
            <p class="text-4xl">settings</p>
            <span class="border-[1px] border-pink-300"/>
            <div class="gap-1 flex items-center justify-center flex-col">
                <div class="flex w-full justify-center items-center gap-4">
                    <label for="sensitivity">Camera sensitivity</label>
                    <p class="font-semibold text-lg">{$controls.explore.sensitivity}</p>
                </div>
                <input name="sensitivity" on:input={(e)=>{updateSlider(e.target)}}  bind:this={sliderSens} class="pointer-events-auto slider cursor-pointer" value={$controls.explore.sensitivity} type="range" min=0.1 max=1 step=0.1>
            </div>
        </div>
        <div class="flex flex-col gap-4">
            <p class="text-4xl">controls</p>
            <span class="border-[1px] border-pink-300"/>
            <div class="gap-2 flex flex-col items-center justify-center">
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex gap-1 col-span-1 justify-end">
                        <kbd class="px-2 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">W</kbd>
                        <kbd class="px-2 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">A</kbd>
                        <kbd class="px-2 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">S</kbd>
                        <kbd class="px-2 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">D</kbd>
                    </div>
                    <div class="flex col-span-1">
                        <p>Move</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex col-span-1 justify-end">
                        <kbd class="px-2 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">Space</kbd>
                    </div>
                    <div class="flex col-span-1">
                        <p>Ascend</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex col-span-1 justify-end">
                        <kbd class="px-2 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">Shift</kbd>
                    </div>
                    <div class="flex col-span-1">
                        <p>Descend</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex col-span-1 justify-end">
                        <kbd class="px-2 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">E</kbd>
                    </div>
                    <div class="flex col-span-1">
                        <p>Open/close interface</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()} class=" flex items-center justify-center gap-1">
        <p>Press</p>
        <kbd class="px-1.5 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">E</kbd>
        <p>or</p>
        <kbd class="px-1.5 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">LMB</kbd>
        <p>to resume exploration.</p>
    </div>
</div>
<style>
    #interface > div{
        cursor:default
    }
    kbd{
        cursor:default
    }
    .slider{
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        width: 15rem;
        height: 0.5rem;
        border-radius: 0.5rem;
        border: 1px black solid;
        background: linear-gradient(to right, #ffa8d5 0%, #ffa8d5 50%, #54464d 50%, #54464d 100%);

    }
    .slider::-webkit-slider-runnable-track {
        height: 0.5rem;
        border-radius: 0.5rem;
    }
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        margin-top: -0.4rem; /* Centers thumb on the track */
        background-image:url(paw.png);
        height: 21px;
        width: 23px;    
    }
    .slider::-moz-range-thumb {
        border: none; /*Removes extra border that FF applies*/
        border-radius: 0; /*Removes default border-radius that FF applies*/
        background-image:url(paw.png);
        height: 21px;
        width: 23px;  
    }
    .slider::-moz-range-track {
        height: 0.5rem;
        border-radius: 0.5rem;
    }
    .slider:focus {
        outline: none;
    }
</style>