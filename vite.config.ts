import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from "path"

const config: UserConfig = {
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['three', 'troika-three-text']
	},
    assetsInclude: ['**/*.gltf'],
    resolve: {
        alias: {
			$static: path.resolve('./static'),
            $src: path.resolve('./src')
        }
    },
};

export default config;
