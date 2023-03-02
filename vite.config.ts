import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from "path"

const config: UserConfig = {
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['postprocessing','three', 'troika-three-text']
	},
    assetsInclude: ['**/*.gltf','**/*.hdr'],
    resolve: {
        alias: {
			$static: path.resolve('./static'),
            $src: path.resolve('./src')
        }
    },
};

export default config;
