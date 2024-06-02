/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			keyframes: {
				wiggle: {
					'0%': {
						transform: 'skewX(12deg)',
					},
					'10%': {
						transform: 'skewX(-11deg)',
					},
					'20%': {
						transform: 'skewX(10deg)',
					},
					'30%': {
						transform: 'skewX(-9deg)',
					},
					'40%': {
						transform: 'skewX(8deg)',
					},
					'50%': {
						transform: 'skewX(-7deg)',
					},
					'60%': {
						transform: 'skewX(6deg)',
					},
					'70%': {
						transform: 'skewX(-5deg)',
					},
					'80%': {
						transform: 'skewX(4deg)',
					},
					'90%': {
						transform: 'skewX(3deg)',
					},
					'100%': {
						transform: 'skewX(3deg)',
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
