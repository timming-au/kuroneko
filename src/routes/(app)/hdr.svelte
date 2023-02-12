<script>
	import { Environment } from "@threlte/extras";
	import { sRGBEncoding } from "three";

	const hdrUrl = new URL('$src/assets/environment/dawn.hdr', import.meta.url).href
	let path = hdrUrl.substring(0,hdrUrl.lastIndexOf("/")+1)
	let file = hdrUrl.substring(hdrUrl.lastIndexOf("/")+1,hdrUrl.length)
</script>

<Environment path={path}
files={file}
format="hdr" 
encoding={sRGBEncoding}
/>