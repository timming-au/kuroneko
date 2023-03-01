<script lang="ts">
    import { controls, isMobile, quality } from "$lib/stores";
    import type { GUI } from 'dat.gui';
    import Stats from "stats.js"
    import { onDestroy, onMount, tick } from "svelte";
    import "../../app.css"
    let gui: GUI
    import gsap from "gsap";
	import type { QualitySettings } from "$lib/types";
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
    onMount(async()=>{
        await tick()
        stats = new Stats()
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );
        requestAnimationFrame( animate );
        sliderSens.value = $controls.explore.sensitivity + ''
        updateSlider(sliderSens)
        showInterface()
        document.addEventListener("keydown",onKeyDown)
        window.addEventListener("blur",showInterface)
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
            display: !overlayVisible ? "none" : "flex"
        })
    }
    function animate() {

        stats.update()

        requestAnimationFrame( animate );

    }
    function updateSlider(e){
        sliderSensFillPercentage = (e.value-e.min)/(e.max-e.min)*100
    }
    let sliderSensFillPercentage = 0
    let overlayVisible = false
    let overlay: HTMLElement
    let sliderSens: HTMLInputElement
    let tabs = ["settings","about"]
    let qualities: Record<string, QualitySettings> = {lo:"low",md:"med",hi:"high"}
    let menu = "settings"
    let hoverQuality = $quality
    let hoverTab = menu
</script>
<div id="interface" bind:this={overlay} class="text-white z-[99999999] cursor-pointer bg-black bg-opacity-50 pointer-events-auto gap-6 md:gap-12 flex-col absolute left-0 top-0 w-full h-full flex items-center">
    <div class='flex flex-col justify-end mt-[5rem] md:mt-[15vh] md:flex-row md:items-end' on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()}>
        <div class="flex md:flex-row flex-col-reverse items-center md:items-end gap-4 md:gap-8">
            <div class='flex items-end relative'>
                <span class="text-4xl md:text-6xl">neko</span>
                <span class="text-[#ffa8d5] text-4xl md:text-6xl">OS</span>
                <span class="absolute bottom-1 -right-9 text-xs text-gray-400">v1.0.0</span>
            </div>
            <div class='flex'>
                <picture>
                    <source media="(min-width: 768px)" srcset="cat-160.png">
                    <img src="cat-80.png" alt="IfItDoesntMatchAnyMedia">
                </picture>
            </div>
        </div>
        <div class="grid grid-cols-{tabs.length} grid-rows-1 md:grid-cols-2 md:grid-rows-{tabs.length} gap-2">
            {#each tabs as tab}
            <div id="{tab}" class="grid grid-rows-2 md:col-span-2 md:grid-cols-2 md:grid-rows-1 md:row-span-2 justify-center">
                <div class="flex items-center justify-center md:justify-end">
                    <svg class="{hoverTab == tab ? "opacity-1" : "opacity-0"} rotate-90 md:rotate-0" fill="none" width=24 height=24 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z" fill="currentColor"/> </svg>
                </div>
                <div on:keypress={()=>{menu = tab}} on:mouseleave={()=>{hoverTab = menu}} on:mouseenter={()=>{hoverTab = tab}} on:click={()=>{menu = tab}} class="cursor-pointer border-pink-300 {menu == tab ? "border-2 bg-pink-200 text-black font-semibold" : "border-[1px] hover:bg-pink-100 hover:bg-opacity-20"} px-1.5 py-1 flex items-center justify-center w-20">{tab}</div>
            </div>
            {/each}
        </div>
    </div>
    {#if menu == "settings"}
        <div id="settings" on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()}>
            <div class="{$isMobile ? "grid grid-cols-1" : "flex-col flex md:grid md:grid-cols-2 md:gap-8"} max-w-[calc(50vw+5rem)] md:max-w-[calc(50vw+20rem)] lg:max-w-[50rem]">
                <div class="flex flex-col gap-2 md:gap-4">
                    <p class="text-2xl md:text-4xl">settings</p>
                    <span class="border-[1px] border-pink-300"/>
                    <div class="gap-1 flex items-center justify-center flex-col">
                        <div class="flex w-full justify-center items-center gap-4">
                            <label for="sensitivity">Camera sensitivity</label>
                            <p class="font-semibold text-base md:text-lg">{$controls.explore.sensitivity}</p>
                        </div>
                        <input name="sensitivity" on:input={(e)=>{updateSlider(e.target)}}  bind:this={sliderSens} style={'background-image:linear-gradient(to right, #ffa8d5 0%, #ffa8d5 ' + sliderSensFillPercentage + '%, #54464d ' + sliderSensFillPercentage + '%, #54464d 100%)'} class="pointer-events-auto slider cursor-pointer" bind:value={$controls.explore.sensitivity} type="range" min=0.1 max=1 step=0.1>
                    </div>
                    <div class="gap-1 flex items-center justify-center flex-col">
                        <p>Graphics quality</p>
                        <div class="grid grid-cols-{parseInt(Object.keys(qualities).length+"")} gap-2">
                            {#each Object.entries(qualities) as [abbr,q]}
                            <div id="{abbr}" class="col-span-1 flex-col flex items-center">
                                <div on:keypress={()=>{$quality = q}} on:mouseleave={()=>{hoverQuality = $quality}} on:mouseenter={()=>{hoverQuality = q}} on:click={()=>{$quality = q}} class="cursor-pointer border-pink-300 {$quality == q ? "border-2 bg-pink-200 text-black font-semibold" : "border-[1px] hover:bg-pink-100 hover:bg-opacity-20"} px-1.5 py-1 flex items-center justify-center w-12">{abbr}</div>
                                <div class="flex items-center justify-center">
                                    <svg class="{$quality == q ? "opacity-1" : "opacity-0"} -rotate-90" fill="none" width=24 height=24 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z" fill="currentColor"/> </svg>
                                </div>
                            </div>
                            {/each}
                        </div>
                    </div>
                </div>
                {#if !$isMobile}
                    <div class="flex flex-col gap-4 mt-10 md:mt-0">
                        <p class="text-2xl md:text-4xl">controls</p>
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
                {/if}
            </div>
        </div>
    {/if}
    {#if menu == "about"}
        <div id="about" on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()}>
            <div class="flex flex-col gap-4 md:gap-10 max-w-[calc(50vw+5rem)] md:max-w-[calc(50vw+5rem)] lg:max-w-[40rem]">
                <div class="flex flex-col gap-2 md:gap-4">
                    <p class="text-2xl md:text-4xl">about</p>
                    <span class="border-[1px] border-pink-300"/>
                </div>
                <div class="flex flex-col">
                    <p>A low-poly, pastel-colored planetary system mildly inspired by black cats. Exploration involves an astronaut.</p>
                </div>
                <a class="flex items-center gap-2" href="https://github.com/timming-au/kuroneko" target="_blank" rel="noreferrer">
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[24px] h-[24px] md:w-[48px] md:h-[48px]" viewBox="0 0 24 24"> <path d="M8 5h2v2H8V5zM6 7h2v2H6V7zM4 9h2v2H4V9zm-2 2h2v2H2v-2zm2 2h2v2H4v-2zm2 2h2v2H6v-2zm2 2h2v2H8v-2zm8-12h-2v2h2V5zm2 2h-2v2h2V7zm2 2h-2v2h2V9zm2 2h-2v2h2v-2zm-2 2h-2v2h2v-2zm-2 2h-2v2h2v-2zm-2 2h-2v2h2v-2z" fill="#ffa8d5"/> </svg>
                    <p class="text-lg md:text-2xl border-b-[1px] border-pink-200">source</p>
                </a>
            </div>
        </div>
    {/if}
    
    {#if $isMobile}
        <div on:touchend={()=>toggleInterface()} class="border-[1px] border-pink-400 p-2 flex items-center justify-center gap-1 absolute bottom-[10%] md:bottom-[15%]">
            <p>Tap here to resume exploration.</p>
        </div>
    {:else}
        <div on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()} class="flex items-center justify-center gap-1 absolute bottom-[10%] md:bottom-[15%]">
            <p>Press</p>
            <kbd class="px-1.5 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">E</kbd>
            <p>or</p>
            <kbd class="px-1.5 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">LMB</kbd>
            <p>to resume exploration.</p>
        </div>
    {/if}
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