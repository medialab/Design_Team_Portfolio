import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [
		imagetools(),
		sveltekit()
	],
	server: {
		fs: {
			// Allow serving files from one level up (for svelte-pdf in parent directory)
			allow: ['..']
		}
	}
});
