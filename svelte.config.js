import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true,
		}),
	},
	vitePlugin: {
		inspector: true,
		experimental: {
			// This will suppress the warning
			disableLegacyReactivityWarnings: true,
		},
	},
	onwarn: (warning, handler) => {
		if (warning.code === 'a11y-missing-attribute') return
		// Suppress the specific warning about <slot> deprecation
		if (warning.message.includes('Using `<slot>` to render parent content is deprecated')) return
		if (warning.message.includes('Properties of objects and arrays are not reactive unless in runes mode')) return;

		// Handle all other warnings
		handler(warning)
	},
}

export default config
