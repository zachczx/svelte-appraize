/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			keyframes: {
				'shine-pulse': {
					'0%': {
						'background-position': '0% 0%',
					},
					'50%': {
						'background-position': '100% 100%',
					},
					to: {
						'background-position': '0% 0%',
					},
				},
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
				'border-beam': {
					'100%': {
						'offset-distance': '100%',
					},
				},
				scale: {
					'0%': { scale: '100%', color: 'currentColor' },
					'50%': { scale: '120%', color: '#610C9F', fontWeight: '900' },
					'100%': { scale: '100%', color: 'currentColor' },
				},
			},
			animation: { wiggle: 'wiggle 2s ease-out infinite' },
			animation: {
				'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
			},
			animation: { wiggleOne: 'wiggle 2s ease-out' },
			animation: { scale: 'scale 1s ease-out' },
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['light'],

					//primary in theme is #491eff
					// secondary: '#DA0C81',
					// info: '#940B92',
					// accent: '#E95793',
					// //'base-200': '#F8F4EC',
					//primary: '#610C9F',
					primary: '#640D6B',
					secondary: '#B51B75',
					'primary-content': 'white',
					'secondary-content': 'white',
					warning: '#E65C19',
					info: '#F8D082',
				},
			},
		],
	},
};
