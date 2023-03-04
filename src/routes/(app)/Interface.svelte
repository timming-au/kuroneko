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
                    overlay.requestPointerLock();
                    toggleInterface()
                }
            }
        })
        document.addEventListener("pointerlockchange",function(e){
            if (document.pointerLockElement !== overlay) {
                showInterface()
            }else{
                hideInterface()
            }
        })
        overlay.addEventListener("keydown", onKeyDown)
    })
    onMount(()=>{
        showInterface()
    })
    onDestroy(()=>{
        if(overlay){
            overlay.removeEventListener("click",onKeyDown)
            overlay.removeEventListener("keydown", onKeyDown)
        }
        if(typeof document !== "undefined"){
            document.removeEventListener("pointerlockchange",function(e){
                if (document.pointerLockElement !== overlay) {
                    showInterface()
                }else{
                    hideInterface()
                }
            })
            document.removeEventListener("keydown",onKeyDown)
        }
    })
    function onKeyDown(e){
        if(e.key == "e" || e.key == "Escape"){
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
        animateOverlay()
    }
    function hideInterface(){
        overlayVisible = false
        $controls.explore.enabled = !overlayVisible
        animateOverlay()
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
    let overlayVisible = true
    let overlay: HTMLElement
    let sliderSens: HTMLInputElement
    let tabs = ["settings","about"]
    let qualities: Record<string, QualitySettings> = {lo:"low",md:"med",hi:"high"}
    let menu = "settings"
    let hoverQuality = $quality
    let hoverTab = menu
</script>
{#if $isMobile}
<div id="toggle" class="z-[99999999999] absolute top-6 right-6 w-10 h-10 border-2 border-red-300" on:keypress={()=>toggleInterface()} on:click={()=>toggleInterface()}></div>
{/if}
<div id="interface" bind:this={overlay} class="text-white z-[99999999] cursor-pointer bg-black bg-opacity-50 pointer-events-auto gap-6 lg:gap-12 flex-col absolute left-0 top-0 w-full h-full hidden items-center">
    <div class='flex flex-col justify-end mt-[3rem] lg:mt-[15vh] lg:flex-row lg:items-end' on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()}>
        <div class="flex lg:flex-row flex-col-reverse items-center lg:items-end lg:gap-8">
            <div class='flex items-end relative'>
                <span class="text-5xl lg:text-6xl">neko</span>
                <span class="text-[#ffa8d5] text-5xl lg:text-6xl">OS</span>
                <span class="absolute bottom-1 -right-9 text-xs text-gray-400">v1.0.0</span>
            </div>
            <div class='flex'>
                <picture>
                    <source media="(min-width: 768px)" srcset="cat-160.png">
                    <img src="cat-80.png" alt="cat-mascot">
                </picture>
            </div>
        </div>
        <div class="grid grid-cols-{tabs.length} grid-rows-1 lg:grid-cols-2 lg:grid-rows-{tabs.length} gap-2">
            {#each tabs as tab}
            <div id="{tab}" class="grid grid-rows-2 lg:col-span-2 lg:grid-cols-2 lg:grid-rows-1 lg:row-span-2 justify-center">
                <div class="flex items-center justify-center lg:justify-end">
                    <svg class="{hoverTab == tab ? "opacity-1" : "opacity-0"} rotate-90 lg:rotate-0" fill="none" width=24 height=24 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z" fill="currentColor"/> </svg>
                </div>
                <div on:keypress={()=>{menu = tab}} on:mouseleave={()=>{hoverTab = menu}} on:mouseenter={()=>{hoverTab = tab}} on:click={()=>{menu = tab}} class="cursor-pointer border-pink-300 {menu == tab ? "border-2 bg-pink-200 text-black font-semibold" : "border-[1px] hover:bg-pink-100 hover:bg-opacity-20"} px-1.5 py-1 flex items-center justify-center w-20">{tab}</div>
            </div>
            {/each}
        </div>
    </div>
    {#if menu == "settings"}
        <div id="settings" on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()}>
            <div class="flex-col flex lg:grid lg:grid-cols-2 lg:gap-12 min-w-[calc(40vw+5rem)] md:min-w-[calc(10vw+20rem)] max-w-[calc(50vw+5rem)] lg:min-w-[30rem] lg:max-w-[50rem]">
                <div class="flex flex-col gap-2 lg:gap-5 lg:min-w-[20rem]">
                    <p class="text-xl lg:text-3xl border-b-2 border-pink-300">settings</p>
                    {#if !$isMobile}
                    <div class="flex flex-col gap-2 lg:gap-4">
                        <div class="gap-1 flex items-center justify-center flex-col">
                            <div class="flex w-full justify-center items-center gap-4">
                                <label class="text-base lg:text-lg" for="sensitivity">camera sensitivity</label>
                                <p class="font-semibold text-md lg:text-xl">{$controls.explore.sensitivity}</p>
                            </div>
                            <input name="sensitivity" on:input={(e)=>{updateSlider(e.target)}}  bind:this={sliderSens} style={'background-image:linear-gradient(to right, #ffa8d5 0%, #ffa8d5 ' + sliderSensFillPercentage + '%, #54464d ' + sliderSensFillPercentage + '%, #54464d 100%)'} class="pointer-events-auto slider cursor-pointer" bind:value={$controls.explore.sensitivity} type="range" min=0.1 max=1 step=0.1>
                        </div>
                    </div>
                    {/if}
                    <div class="flex items-center justify-center flex-col">
                        <p class="text-md lg:text-lg">graphics quality</p>
                        <div class="flex items-center justify-center gap-2 lg:gap-4 border-t-[1px] border-pink-300 pt-2 lg:pt-4">
                            {#each Object.entries(qualities) as [abbr,q]}
                            <div id="{abbr}" class="col-span-1 flex-col flex items-center">
                                <div on:keypress={()=>{$quality = q}} on:click={()=>{$quality = q}} class="cursor-pointer border-pink-300 {$quality == q ? "border-2 bg-pink-200 text-black font-semibold" : "border-[1px] hover:bg-pink-100 hover:bg-opacity-20"} px-1.5 py-1 flex items-center justify-center w-12">{abbr}</div>
                                <div class="flex items-center justify-center">
                                    <svg class="{$quality == q ? "opacity-1" : "opacity-0"} -rotate-90" fill="none" width=24 height=24 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z" fill="currentColor"/> </svg>
                                </div>
                            </div>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-4 mt-4 lg:mt-0 lg:min-w-[25rem]">
                    <p class="text-xl lg:text-3xl border-b-2 border-pink-300">controls</p>
                    <div class="gap-2 flex flex-col items-center justify-center">
                        {#if $isMobile}
                            <div class="grid grid-cols-2 gap-2 items-center">
                                <div class="flex gap-1 col-span-1 justify-end">
                                    <div class="px-1 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">
                                        <svg width="36" height="36" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81.402 185.72">
                                            <defs>
                                                <clipPath id="a">
                                                    <path d="M0 612h792V0H0v612z"/>
                                                </clipPath>
                                            </defs>
                                            <g clip-path="url(#a)" transform="matrix(1.25 0 0 -1.25 -264.9 362.11)">
                                                <path style="fill:#fff" d="M0 0c-5.421 0-9.861-4.232-10.215-9.565-1.871 1.984-4.515 3.232-7.452 3.232-5.651 0-10.25-4.598-10.25-10.25 0-4.259 2.611-7.916 6.315-9.462l.296 2.069c-2.726 1.348-4.611 4.152-4.611 7.393 0 4.549 3.702 8.25 8.25 8.25 4.549 0 8.25-3.701 8.25-8.25a8.224 8.224 0 0 0-2.49-5.896l.231-2.4a10.247 10.247 0 0 1 4.225 7.611 10.345 10.345 0 0 1 1.641-1.406l.249 2.348A8.225 8.225 0 0 0-8.25-10.25C-8.25-5.701-4.549-2 0-2s8.25-3.701 8.25-8.25c0-3.239-1.882-6.041-4.605-7.39l.069-2.153c3.819 1.491 6.536 5.202 6.536 9.543C10.25-4.598 5.652 0 0 0" transform="translate(246.92 288.08)"/>
                                                <path style="fill:#fff" d="M0 0c-.075-.942-.136-1.7-.169-2.21-.202-3.127-.815-12.642-2.755-17.126-2.168-5.016-.772-11.404-.711-11.674l.05-.174c.389-1.097.252-2.365-.399-3.667-1.011-2.021-4.207-5.882-14.26-9.024-12.06-3.769-15.61-.183-15.853.081-1.07 1.789-21.037 35.413-20.409 51.094l.002.059-.002.06c-.31 7.854-.702 20.134-.51 21.766.153 1.299.074 3.166-.019 5.327-.103 2.413-.378 8.821.706 9.44.001-.001.071.015.245-.035l.337-.079.307.04c.133.017 3.337.355 4.938-6.049l.101.025c-.101-9.674-.104-17.314-.104-18.162 0-4.508-2.296-7.344-2.319-7.372l2.3-1.926c.123.145 3.019 3.649 3.019 9.298 0 17.823.463 57.967 1.828 61.138.706 1.348 2.144 2.267 3.269 2.073 1.17-.191 2.053-1.63 2.421-3.946.453-2.846.862-10.788 1.295-19.197 1.325-25.753 1.7-25.857 3.277-26.29.689-.19 1.405.095 1.825.724.929 1.395 1.218 7.026 1.729 25.669.274 9.993.649 23.679 1.38 25.358.451.959 1.579 1.62 2.618 1.573 1.376-.082 2.083-1.356 2.435-2.409.548-1.645.812-9.172 1.092-17.142.692-19.712 1.412-33.92 4.383-37.221l2.229 2.008c-1.233 1.37-2.029 7.141-2.57 14.093 2.345-.41 3.855-2.61 4.781-6.873.64-2.943 4.879-14.461 5.058-14.95l2.816 1.037a419.79 419.79 0 0 0-3.466 9.767c3.454-.501 5.308-4.056 7.279-8.567.546-1.248 1.061-2.427 1.615-3.359C1.611 20.108.398 4.973 0 0m2.368 24.709c-.459.772-.938 1.869-1.445 3.029C-.94 32.003-3.693 38.3-10.105 38.174a23.098 23.098 0 0 0-.476 1.713c-1.291 5.938-3.957 9.046-7.931 9.297-.405 6.205-.642 12.939-.825 18.165-.358 10.173-.592 16.025-1.246 17.985-.897 2.692-2.757 4.316-5.103 4.454-2.264.133-4.536-1.219-5.51-3.29-.896-1.906-1.209-9.941-1.664-26.553-.089-3.254-.185-6.764-.297-10.081-.196 3.374-.378 6.905-.539 10.05-.437 8.491-.85 16.511-1.328 19.514-.801 5.033-3.413 6.193-4.899 6.436-2.403.392-5.099-1.137-6.411-3.641-1.218-2.326-1.753-21.376-1.987-37.86-2.038 2.392-4.336 2.56-5.234 2.512-1.234.258-2.106-.155-2.632-.569-2.12-1.672-2.107-5.806-1.845-11.922.083-1.948.162-3.788.037-4.85-.278-2.367.399-19.89.489-22.176-.625-16.943 20.004-51.317 20.883-52.774l.057-.087c.299-.426 2.429-3.099 8.694-3.099 2.686 0 6.134.493 10.522 1.864C-6.792-43.439-2.795-39.182-1.3-36.191c.99 1.982 1.194 4.076.577 5.91-.138.68-1.113 5.9.553 9.754C1.753-16.079 2.46-8.053 2.825-2.403c.032.499.092 1.241.166 2.163.876 10.938 1.406 21.531-.623 24.949" transform="translate(271.67 191.31)"/>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <div class="flex col-span-1">
                                    <p>Pan/Zoom</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-2 items-center">
                                <div class="flex gap-1 col-span-1 justify-end">
                                    <div class="px-1 py-0.5 text-sm font-semibold text-pink-100 bg-gray-700 border-gray-300 border-b-[1px] rounded-sm">
                                        <svg width="36" height="36" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.797 180.31">
                                            <defs>
                                                <clipPath id="a">
                                                    <path d="M0 612h792V0H0v612z"/>
                                                </clipPath>
                                            </defs>
                                            <g clip-path="url(#a)" transform="matrix(1.25 0 0 -1.25 -309.26 587.98)">
                                                <path style="fill:#fff" d="M0 0c-5.652 0-10.25-4.598-10.25-10.25 0-3.841 2.127-7.191 5.262-8.946l.128 2.295c-2.051 1.503-3.39 3.921-3.39 6.651C-8.25-5.701-4.549-2 0-2s8.25-3.701 8.25-8.25a8.226 8.226 0 0 0-2.875-6.245l.132-2.386c2.847 1.823 4.743 5.007 4.743 8.631C10.25-4.598 5.652 0 0 0" transform="translate(266.25 468.75)"/>
                                                <path style="fill:#fff" d="M0 0c-.075-.942-.136-1.7-.169-2.209-.202-3.127-.815-12.642-2.755-17.127-2.168-5.015-.772-11.404-.711-11.674l.05-.173c.389-1.098.252-2.366-.399-3.667-1.011-2.022-4.207-5.883-14.26-9.025-12.061-3.768-15.611-.182-15.853.083-1.07 1.789-21.037 35.412-20.408 51.131.085 6.061.354 22.197.573 24.055.181 1.538-.068 3.638-.332 5.861-.252 2.124-.72 6.077-.165 6.716 0 0 .101.017.345-.053l.288-.052c.157-.016 3.773-.474 5.518-6.674-.049-3.081-.095-6.336-.138-9.779-.036-2.882-.062-5.009-.088-6.013-.154-5.854-2.135-9.625-2.155-9.662l1.321-.711 1.318-.714c.096.176 2.341 4.391 2.515 11.008.026 1.011.053 3.153.089 6.055.043 3.505.092 6.832.145 10.001l.054.014c-.015.063-.035.117-.052.179.454 27.12 1.24 41.845 2.336 43.779.918 1.345 2.407 2.042 3.71 1.734 1.13-.269 1.863-1.247 2.064-2.754.206-1.544.464-6.904.763-13.109.876-18.208 1.718-33.578 3.162-37.243l2.791 1.1c-.912 2.317-1.653 12.083-2.221 21.978 1.554.315 2.914.104 4.141-.639 2.749-1.665 4.453-5.878 5.13-9.266.688-3.439 1.469-12.615 1.476-12.708l2.99.253c-.032.384-.803 9.438-1.524 13.043-.088.44-.244 1.125-.477 1.94 5.81.123 7.262-5.721 7.415-6.428.64-2.943 4.879-14.461 5.058-14.95l2.816 1.037a421.452 421.452 0 0 0-3.466 9.767c3.453-.5 5.308-4.056 7.279-8.567.546-1.248 1.061-2.426 1.615-3.359C1.611 20.109.398 4.974 0 0m2.368 24.709c-.459.773-.938 1.869-1.445 3.029-1.863 4.266-4.615 10.563-11.028 10.436-.223.725-.391 1.32-.476 1.714-.794 3.653-4.09 9.471-11.385 8.716-1.013 2.362-2.592 4.918-5.003 6.378-1.762 1.068-3.731 1.421-5.863 1.08-.218 4.039-.408 7.975-.568 11.302-.314 6.532-.562 11.692-.785 13.361-.366 2.746-1.991 4.718-4.345 5.276-2.5.595-5.268-.597-6.881-2.962-1.428-2.094-2.251-13.479-2.754-39.42-2.145 2.597-4.529 3.122-5.219 3.217-1.443.373-2.377-.084-2.914-.541-1.869-1.592-1.441-5.207-.945-9.393.232-1.952.471-3.971.331-5.158-.281-2.39-.581-23.467-.592-24.324-.677-16.921 20.001-51.377 20.881-52.835l.057-.087c.299-.425 2.429-3.099 8.694-3.099 2.687 0 6.134.492 10.522 1.863C-6.792-43.439-2.795-39.182-1.3-36.191c.99 1.982 1.194 4.076.577 5.91-.138.68-1.113 5.901.553 9.755C1.753-16.078 2.46-8.053 2.825-2.403c.032.499.092 1.241.166 2.164.876 10.937 1.406 21.531-.623 24.948" transform="translate(306.67 376.31)"/>
                                            </g>
                                        </svg>                                        
                                    </div>
                                </div>
                                <div class="flex col-span-1">
                                    <p>Rotate</p>
                                </div>
                            </div>
                        {:else}
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
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
    {#if menu == "about"}
        <div id="about" on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()}>
            <div class="flex flex-col gap-4 lg:gap-10 max-w-[calc(50vw+5rem)] lg:max-w-[40rem]">
                <div class="flex flex-col gap-2 lg:gap-4">
                    <p class="text-2xl lg:text-4xl">about</p>
                    <span class="border-[1px] border-pink-300"/>
                </div>
                <div class="flex flex-col">
                    <p>A low-poly, pastel-colored planetary system mildly inspired by black cats. Exploration involves an astronaut.</p>
                </div>
                <a class="flex items-center gap-2" href="https://github.com/timming-au/kuroneko" target="_blank" rel="noreferrer">
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[24px] h-[24px] lg:w-[48px] lg:h-[48px]" viewBox="0 0 24 24"> <path d="M8 5h2v2H8V5zM6 7h2v2H6V7zM4 9h2v2H4V9zm-2 2h2v2H2v-2zm2 2h2v2H4v-2zm2 2h2v2H6v-2zm2 2h2v2H8v-2zm8-12h-2v2h2V5zm2 2h-2v2h2V7zm2 2h-2v2h2V9zm2 2h-2v2h2v-2zm-2 2h-2v2h2v-2zm-2 2h-2v2h2v-2zm-2 2h-2v2h2v-2z" fill="#ffa8d5"/> </svg>
                    <p class="text-lg lg:text-2xl border-b-[1px] border-pink-200">source</p>
                </a>
            </div>
        </div>
    {/if}
    
    {#if $isMobile}
        <div on:touchend={()=>toggleInterface()} class="border-[1px] border-pink-400 p-2 flex items-center justify-center gap-1 absolute bottom-[6%] lg:bottom-[15%]">
            <p>Tap here to resume exploration.</p>
        </div>
    {:else}
        <div on:keypress={(e)=>e.stopPropagation()} on:click={(e)=>e.stopPropagation()} class="flex items-center justify-center gap-1 absolute bottom-[10%] lg:bottom-[15%]">
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
        background-color:transparent;
        background-image:url('/paw.png');
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        height: 21px;
        width: 23px;    
    }
    .slider::-moz-range-thumb {
        border: none; /*Removes extra border that FF applies*/
        border-radius: 0; /*Removes default border-radius that FF applies*/
        background-color:transparent;
        background-image:url('/paw.png');
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
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