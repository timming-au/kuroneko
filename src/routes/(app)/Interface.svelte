<script lang="ts">
    import { controls } from "$lib/stores";
    import type { GUI } from 'dat.gui';
    import Stats from "stats.js"
    import { onDestroy, onMount, tick } from "svelte";
    let gui: GUI

    onMount(async()=>{
        await tick()
        let dat = await import('dat.gui')
        gui = new dat.GUI()
        
        // com light
        const comFolder = gui.addFolder('comLight')
        comFolder.add($controls.com, 'intensity', 0.1, 20)
        comFolder.add($controls.com, 'distance', 10, 400)
        comFolder.open()

        // ambient light
        const ambientFolder = gui.addFolder('ambientLight')
        for(let key in $controls.ambient.color){
            ambientFolder.add($controls.ambient.color, key, 0,255)
        }
        ambientFolder.add($controls.ambient, 'intensity',0.1,100)

        // hemisphere light
        const hemiFolder = gui.addFolder('hemisphereLight')
        hemiFolder.add($controls.hemisphere, 'intensity',0.1,100)

        // > skyColor
        const hemiSkyColorFolder = hemiFolder.addFolder('skyColor')
        for(let key in $controls.hemisphere.skyColor){
            hemiSkyColorFolder.add($controls.hemisphere.skyColor, key, 0,255)
        }

        // > groundColor
        const hemiGroundColorFolder = hemiFolder.addFolder('groundColor')
        for(let key in $controls.hemisphere.groundColor){
            hemiGroundColorFolder.add($controls.hemisphere.groundColor, key, 0,255)
        }

        const viewFolder = gui.addFolder('isPlayerView')
        viewFolder.add($controls.view, "player", false)
        viewFolder.open()
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
    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    function animate() {

        stats.update()

        requestAnimationFrame( animate );

    }

requestAnimationFrame( animate );
    onDestroy(()=>{
        if(gui){
            gui.destroy()
        }
    })
</script>