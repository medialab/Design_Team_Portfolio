// Load image metadata (width, height, format, src) using vite-imagetools

export type ImageMetadata = {
	src: string;
	width: number;
	height: number;
	format: string;
	default: string;
};

export type OptimizedImage = {
	img: string;
	sources: {
		avif: string;
		webp: string;
	};
};

// Optimized images with dithering effect (lower quality)
export const mediaFilesModules: Record<string, ImageMetadata> = import.meta.glob(
	[
		'$lib/media/**/*.png',
		'$lib/media/**/*.jpg',
		'$lib/media/**/*.jpeg',
		'$lib/media/**/*.webp',
		'$lib/media/**/*.gif',
		'$lib/media/**/*.pdf',
		'$lib/media/**/THUMB/*',
		'$lib/media/**/*.mp4',
		'$lib/media/**/*.mov',
		'$lib/media/**/*.MOV'
	],
	{
		eager: true,
		query: {
			w: '1200',
			format: 'webp',
			quality: '90',
			metadata: '',
			as: 'metadata'
		}
	}
);

export function buildPictureSources(imagePath: string, widths: number[] = [400, 800, 1200]) {
	const srcset = (format: string) =>
		widths.map((w) => `${imagePath}?w=${w}&format=${format} ${w}w`).join(', ');

	return {
		avif: srcset('avif'),
		webp: srcset('webp'),
		fallback: srcset('jpg')
	};
}
