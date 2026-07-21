// Load image metadata (width, height, format, src) using vite-imagetools

import type { ImageMetadata } from './types';

type MediaFileModule = ImageMetadata | string;
type MediaFileLoader = () => Promise<MediaFileModule>;
type ImageMetadataLoader = () => Promise<ImageMetadata>;
export const mediaFilesModules = import.meta.glob(
	[
		'$lib/projects/*/*.png',
		'$lib/projects/*/*.jpg',
		'$lib/projects/*/*.jpeg',
		'$lib/projects/*/*.JPG',
		'$lib/projects/*/*.JPEG',
		'$lib/projects/*/*.webp',
		'$lib/projects/*/*.gif',
		'$lib/projects/*/*.pdf',
		'$lib/projects/*/*.mp4',
		'$lib/projects/*/*.mov',
		'$lib/projects/*/*.MOV',
		'$lib/projects/*/*.webm',
		'$lib/projects/*/_videos/*.mp4',
		'$lib/projects/*/_videos/*.mov',
		'$lib/projects/*/_videos/*.MOV',
		'$lib/projects/*/_videos/*.webm',
		'$lib/projects/*/_documents/*.pdf'
	],
	{
		eager: false,
		import: 'default',
		query: {
			metadata: '',
			w: '1200',
			as: 'metadata',
			enhanced: false,
			quality: 80,
			//format: 'webp',
			allowUpscale: false,
			allowDownscale: true,
			removeMetadata: true
		}
	}
) as Record<string, MediaFileLoader>;

export const subGalleryModules = import.meta.glob(
	[
		'$lib/projects/*/*/*.png',
		'$lib/projects/*/*/*.jpg',
		'$lib/projects/*/*/*.jpeg',
		'$lib/projects/*/*/*.JPG',
		'$lib/projects/*/*/*.JPEG',
		'$lib/projects/*/*/*.webp',
		'$lib/projects/*/*/*.gif'
	],
	{
		eager: false,
		import: 'default',
		query: {
			metadata: '',
			w: '1200',
			as: 'metadata',
			enhanced: true,
			quality: 80,
			format: 'webp',
			allowUpscale: 'true',
			allowDownscale: 'true',
			removeMetadata: 'false'
		}
	}
) as Record<string, ImageMetadataLoader>;

export const ditheredMediaFilesModules = import.meta.glob(['$lib/ditheredMedia/**/*.png'], {
	eager: false,
	import: 'default',
	query: {
		metadata: '',
		as: 'metadata',
		removeMetadata: 'false'
	}
}) as Record<string, ImageMetadataLoader>;

export const homeMediaMetadataLoaders = import.meta.glob(
	[
		'$lib/projects/*/*.png',
		'$lib/projects/*/*.jpg',
		'$lib/projects/*/*.jpeg',
		'$lib/projects/*/*.JPG',
		'$lib/projects/*/*.JPEG',
		'$lib/projects/*/*.webp',
		'$lib/projects/*/*.gif'
	],
	{
		eager: false,
		import: 'default',
		query: {
			metadata: '',
			w: '400',
			as: 'metadata',
			enhanced: true,
			quality: 70,
			//format: 'webp',
			allowUpscale: true,
			allowDownscale: true,
			removeMetadata: false
		}
	}
) as Record<string, ImageMetadataLoader>;

export const homeDitheredMediaMetadataLoaders = import.meta.glob(['$lib/ditheredMedia/**/*.png'], {
	eager: false,
	import: 'default',
	query: {
		metadata: '',
		as: 'metadata',
		removeMetadata: 'false'
	}
}) as Record<string, ImageMetadataLoader>;
