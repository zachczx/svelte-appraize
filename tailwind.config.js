/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			keyframes: {
				wiggle: {
					'0%': {
						transform: 'skewX(9deg)',
					},
					'10%': {
						transform: 'skewX(-8deg)',
					},
					'20%': {
						transform: 'skewX(7deg)',
					},
					'30%': {
						transform: 'skewX(-6deg)',
					},
					'40%': {
						transform: 'skewX(5deg)',
					},
					'50%': {
						transform: 'skewX(-4deg)',
					},
					'60%': {
						transform: 'skewX(3deg)',
					},
					'70%': {
						transform: 'skewX(-2deg)',
					},
					'80%': {
						transform: 'skewX(1deg)',
					},
					'90%': {
						transform: 'skewX(0deg)',
					},
					'100%': {
						transform: 'skewX(0deg)',
					},
				},
			},
			animation: { wiggle: 'wiggle 2s ease-out infinite' },
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['light'],
	},
};
