import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		host: true
	},
	preview: {
		allowedHosts: true
	},
	plugins: [tailwindcss(), sveltekit()]
});
