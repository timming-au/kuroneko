<script>
	import { useThrelte } from "@threlte/core";
	import { Environment } from "@threlte/extras";
	import { sRGBEncoding } from "three";

	const hdrUrl = new URL('$src/assets/environment/dawn.hdr', import.meta.url).href
	let path = hdrUrl.substring(0,hdrUrl.lastIndexOf("/")+1)
	let file = hdrUrl.substring(hdrUrl.lastIndexOf("/")+1,hdrUrl.length)
	console.log(hdrUrl,path,file)
</script>

<Environment path={path}
files={file}
format="hdr" 
encoding={sRGBEncoding}
/>