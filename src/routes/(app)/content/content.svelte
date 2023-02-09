<script lang="ts">
	import { HTML } from "@threlte/extras";
	import { Euler } from "three";
    export let scale:number;
    import "../../../app.css"
</script>
<HTML {...$$restProps} {scale} transform rotation={new Euler(0,Math.PI,0)}>
    <div class="w-[1080px] h-[1080px] border-green-600 border-[20px]">
        <h1 class="text-white text-6xl">qwertyuiop</h1>
    </div>
</HTML>