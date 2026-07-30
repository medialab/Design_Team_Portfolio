export const SITE_ORIGIN: string =
	(typeof process !== 'undefined' && (process as any).env?.SITE_ORIGIN) || 'https://glean.medialab.sciencespo.fr';

export const SITE_BASE_PATH: string =
	(typeof process !== 'undefined' && (process as any).env?.SITE_BASE_PATH) || '';
