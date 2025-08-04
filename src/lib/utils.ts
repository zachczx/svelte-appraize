export function stopDefaultEvents(evt: Event) {
	evt.preventDefault();
	evt.stopPropagation();
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
