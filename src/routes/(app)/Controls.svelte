<script lang="ts">
	import { controls } from "$lib/stores";
	import { onMount, tick } from "svelte";


	onMount(()=>{
        let save = localStorage.getItem("controls")
        if(save){
            let parse = JSON.parse(save)

            /**
             * Recursively assign values to object from a copy to prevent changing reference
             * @param obj
             * @param copy
             */
            function valueAssign(obj: {[key:string]:any}, copy:{[key:string]:any}){
                for(let key in obj){
                    if(typeof obj[key] != 'object'){
                        obj[key] = copy[key]
                    }else{
                        valueAssign(obj[key], copy[key])
                    }
                }
            }
            valueAssign($controls,parse)
        }
    })
    onMount(async()=>{
        await tick()
        $controls = {...$controls}
    })
</script>