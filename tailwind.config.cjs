/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'white': '#fff',
				'black': '#070507',
				'lavender': '#B195C7',
				'dark-lavender': '#4d385c',
			},
			fontFamily: {
				'sans': ['"Fira Sans"'],
				'serif': ['"Fira Mono"'],
			}
		},
	},
	plugins: [],
}
