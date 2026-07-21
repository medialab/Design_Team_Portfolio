export const SITE_ORIGIN: string =
	(typeof process !== 'undefined' && (process as any).env?.SITE_ORIGIN) || 'https://medialab.github.io';

export const SITE_BASE_PATH: string =
	(typeof process !== 'undefined' && (process as any).env?.SITE_BASE_PATH) || '/glean';
