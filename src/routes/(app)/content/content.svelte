<script lang="ts">
	import { HTML } from "@threlte/extras";
	import { Euler } from "three";
    export let scale:number;
    import "../../../app.css"
</script>
<HTML {...$$restProps} {scale} transform rotation={new Euler(0,Math.PI,0)}>
    <h1 class="text-white text-6xl">nya</h1>
</HTML>