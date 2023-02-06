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
        const pointFolder = gui.addFolder('pointLight')
        pointFolder.add($controls.point, 'intensity', 0.1, 10)
        pointFolder.add($controls.point, 'distance', 10, 400)
        pointFolder.open()

        // ambient light
        const ambientFolder = gui.addFolder('ambientLight')
        ambientFolder.add($controls.ambient.color, 'r', 0,255)
        ambientFolder.add($controls.ambient.color, 'g', 0,255)
        ambientFolder.add($controls.ambient.color, 'b', 0,255)
        ambientFolder.add($controls.ambient, 'intensity',0.1,100)
        ambientFolder.open()

        // hemisphere light
        const hemiFolder = gui.addFolder('hemisphereLight')
        hemiFolder.add($controls.hemisphere, 'intensity',0.1,100)
        hemiFolder.open()

        // > skyColor
        const hemiSkyColorFolder = hemiFolder.addFolder('skyColor')
        hemiSkyColorFolder.add($controls.hemisphere.skyColor, 'r', 0,255)
        hemiSkyColorFolder.add($controls.hemisphere.skyColor, 'g', 0,255)
        hemiSkyColorFolder.add($controls.hemisphere.skyColor, 'b', 0,255)
        hemiSkyColorFolder.open()

        // > groundColor
        const hemiGroundColorFolder = hemiFolder.addFolder('groundColor')
        hemiGroundColorFolder.add($controls.hemisphere.groundColor, 'r', 0,255)
        hemiGroundColorFolder.add($controls.hemisphere.groundColor, 'g', 0,255)
        hemiGroundColorFolder.add($controls.hemisphere.groundColor, 'b', 0,255)

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