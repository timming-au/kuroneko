<script lang="ts">
    import { controls } from "$lib/stores";
    import { GUI } from 'dat.gui'
	import { onMount } from "svelte";
	import { onDestroy } from "svelte";
    import { tick } from "svelte";
    let gui: GUI
    onMount(async()=>{
        await tick()
        gui = new GUI()
        
        // com light
        const comFolder = gui.addFolder('comLight')
        comFolder.add($controls.com, 'intensity', 0.1, 10)
        comFolder.add($controls.com, 'distance', 10, 400)
        comFolder.open()

        // point light
        const directFolder = gui.addFolder('directLight')
        directFolder.add($controls.directional, 'intensity', 0.1, 10)
        for(let key in $controls.directional.color){
            directFolder.add($controls.directional.color, key, 0,255)
        }
        for(let key in $controls.directional.pos){
            directFolder.add($controls.directional.pos, key, -10,10)
        }
        directFolder.open()

        // ambient light
        const ambientFolder = gui.addFolder('ambientLight')
        for(let key in $controls.ambient.color){
            ambientFolder.add($controls.ambient.color, key, 0,255)
        }
        ambientFolder.add($controls.ambient, 'intensity',0.1,100)
        ambientFolder.open()

        // hemisphere light
        const hemiFolder = gui.addFolder('hemisphereLight')
        hemiFolder.add($controls.hemisphere, 'intensity',0.1,100)
        hemiFolder.open()

        // > skyColor
        const hemiSkyColorFolder = hemiFolder.addFolder('skyColor')
        for(let key in $controls.hemisphere.skyColor){
            hemiSkyColorFolder.add($controls.hemisphere.skyColor, key, 0,255)
        }
        hemiSkyColorFolder.open()

        // > groundColor
        const hemiGroundColorFolder = hemiFolder.addFolder('groundColor')
        for(let key in $controls.hemisphere.groundColor){
            hemiGroundColorFolder.add($controls.hemisphere.groundColor, key, 0,255)
        }
        hemiGroundColorFolder.open()

        /**
         * Recursive loop to iterate through all folders and controllers
         * Time complexity is n where n = number of elements
         * @param folder
         */
        function assign(folder: GUI){
            let controllers = folder.__controllers
            controllers.forEach((controller)=>{
                controller.onChange(()=>{
                    $controls = {...$controls}
                })
            })
            let folders = folder.__folders
            if(folder){
                Object.values(folders).forEach((folder)=>{
                    assign(folder)
                })
            }
        }
        assign(gui)
        
    })
    onDestroy(()=>{
        if(gui){
            gui.destroy()
        }
    })
</script>