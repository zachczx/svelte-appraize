// Svelte Magic UI

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

// Svelte Magic UI

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + key + ':' + style[key] + ';';
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: transform + 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')',
				opacity: t,
			});
		},
		easing: cubicOut,
	};
};

export function stopDefaultEvents(evt: Event) {
	evt.preventDefault();
	evt.stopPropagation();
}

/**
 * I tried writing this for the blog post dates using getFullYear() etc, but this was subpar.
 * Problem: Sounds good in theory but if it counts as 1 month difference between 5 Dec and 30 Nov, even if only a few days passed.
 * Very tiresome to have to account for all ways of calculation, so I decided to revert to manually doing 365 days a year, 30 days a month
 */
export function CalculateDateAgo(postDate: Date) {
	const today = new Date();
	const yearsInBetween = today.getFullYear() - postDate.getFullYear();
	const monthsInBetween = today.getMonth() - postDate.getMonth();
	const daysInBetween = today.getDate() - postDate.getDate();
	let differenceString = '';
	if (yearsInBetween === 0 && monthsInBetween === 0) {
		if (daysInBetween === 0) {
			differenceString = `Today`;
		} else if (daysInBetween === 1) {
			differenceString = `1 day ago`;
		} else {
			differenceString = `${daysInBetween} days ago`;
		}
	} else if (yearsInBetween === 0 && monthsInBetween < 2 && monthsInBetween >= 1) {
		differenceString = `1 month ago`;
	} else if (yearsInBetween === 0 && monthsInBetween >= 2) {
		differenceString = `${monthsInBetween} months ago`;
	} else if (yearsInBetween >= 1 && yearsInBetween < 2) {
		differenceString = `1 year ago`;
	} else if (yearsInBetween >= 2) {
		// Several years
		//Check number of months
		if (monthsInBetween >= 11) {
			differenceString = `${yearsInBetween + 1} years ago`;
		} else {
			differenceString = `${yearsInBetween} years ago`;
		}
	}

	return differenceString;
}

/**
 *
 * @param str get rid of weird characters in filename, from cloudflare r2 upload
 * @returns
 */
export function slugify(str: string) {
	return str
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/\./g, '-')
		.replace(/-+/g, '-')
		.replace(/[^a-z0-9-]/g, '-');
}
