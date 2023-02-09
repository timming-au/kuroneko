<script>
	import { Environment } from "@threlte/extras";
	import { sRGBEncoding } from "three";
</script>

<Environment path="src/assets/environment/" 
files="dawn.hdr" 
format="hdr" 
encoding={sRGBEncoding}
/>