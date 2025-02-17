import daisyui from 'daisyui';
import themes from 'daisyui/src/theming/themes';
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
					'50%': { scale: '120%', color: '#A94A4A', fontWeight: '900' },
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
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				light: {
					...themes.light,

					//https://colorhunt.co/palette/a94a4af4d793fff6da889e73
					primary: '#A94A4A',
					secondary: '#4AA9A9',
					'primary-content': '#fdfdfd',
					'secondary-content': '#fdfdfd',
					warning: '#E65C19',
					//neutral: '#555C66', //'rgba(43, 52, 64)',
					info: '#889E73',
					'base-200': '#FFF6DA',
					'base-300': '#F4D793',
					success: '#28A528',
					'success-content': 'white',
					error: '#DC2626',
					'error-content': '#fdfdfd',
				},
			},
		],
	},
};
