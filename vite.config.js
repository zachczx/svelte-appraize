import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { isoImport } from 'vite-plugin-iso-import';

// isoPlugin needed for apexcharts.
// Read: https://github.com/apexcharts/apexcharts.js/discussions/4175

export default defineConfig({
	plugins: [sveltekit(), isoImport()],
});
