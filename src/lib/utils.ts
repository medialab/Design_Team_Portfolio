// Client-side utility functions
import type { ImageMetadata } from '$lib/images';
import { writable } from 'svelte/store';

type ImageShape = 'Horizontal' | 'Vertical' | 'Square';

export let colorMode = writable<'light' | 'dark'>('light');

export const isMobile = async (): Promise<boolean> => {
	if (typeof window === 'undefined') return false;

	// Check screen width only
	return window.innerWidth <= 768;
};

export const extractThumbnailImage = (
	mediaFilesModules: Record<string, ImageMetadata>,
	projectTag: string
): { src: string; shape: ImageShape } | null => {
	const thumbnailKey = Object.keys(mediaFilesModules).find(
		(key) => key.includes(`/${projectTag}/THUMB/`) && key.toLowerCase().includes('thumb')
	);

	if (!thumbnailKey) return null;

	const meta = mediaFilesModules[thumbnailKey];
	const shape: ImageShape =
		meta.width === meta.height ? 'Square' : meta.width > meta.height ? 'Horizontal' : 'Vertical';

	return { src: meta.src, shape };
};

// Black and white palette for dithering - PURE B&W only
const BW_PALETTE = [
	[0, 0, 0], // pure black
	[255, 255, 255] // pure white
];

// Floyd-Steinberg dithering algorithm with pure B&W
function floydSteinbergDither(imageData: ImageData, palette: number[][] = BW_PALETTE): ImageData {
	const pixels = imageData.data;
	const width = imageData.width;
	const height = imageData.height;

	const distributeError = (x: number, y: number, err: number, factor: number) => {
		if (x < 0 || x >= width || y < 0 || y >= height) return;

		const idx = (y * width + x) * 4;
		// Apply error to all RGB channels equally for grayscale
		const newVal = pixels[idx] + err * factor;
		pixels[idx] = Math.max(0, Math.min(255, newVal));
		pixels[idx + 1] = Math.max(0, Math.min(255, newVal));
		pixels[idx + 2] = Math.max(0, Math.min(255, newVal));
	};

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const idx = (y * width + x) * 4;

			// Convert to grayscale first using luminance
			const oldR = pixels[idx];
			const oldG = pixels[idx + 1];
			const oldB = pixels[idx + 2];
			const oldLuminance = 0.299 * oldR + 0.587 * oldG + 0.114 * oldB;

			// Find closest color (pure black or white)
			const newColor = oldLuminance > 127.5 ? 255 : 0;

			// Set pixel to pure black or white
			pixels[idx] = newColor;
			pixels[idx + 1] = newColor;
			pixels[idx + 2] = newColor;

			// Calculate error
			const err = oldLuminance - newColor;

			// Floyd-Steinberg error distribution
			distributeError(x + 1, y, err, 7 / 16);
			distributeError(x - 1, y + 1, err, 3 / 16);
			distributeError(x, y + 1, err, 5 / 16);
			distributeError(x + 1, y + 1, err, 1 / 16);
		}
	}

	return imageData;
}

// Apply dithering to an image element with bigger dots
export const applyDither = (img: HTMLImageElement, dotSize: number = 3): void => {
	if (typeof window === 'undefined') return;

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) return;

	const originalWidth = img.naturalWidth || img.width;
	const originalHeight = img.naturalHeight || img.height;

	// Calculate scaled down size for bigger dots
	const scaledWidth = Math.floor(originalWidth / dotSize);
	const scaledHeight = Math.floor(originalHeight / dotSize);

	// Create temporary canvas for downscaling
	const tempCanvas = document.createElement('canvas');
	const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
	if (!tempCtx) return;

	tempCanvas.width = scaledWidth;
	tempCanvas.height = scaledHeight;

	// Draw scaled down image
	tempCtx.imageSmoothingEnabled = false;
	tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

	// Get image data from scaled down version
	const imageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight);

	// Apply Floyd-Steinberg dithering
	const ditheredData = floydSteinbergDither(imageData);

	// Put dithered data back
	tempCtx.putImageData(ditheredData, 0, 0);

	// Scale back up to original size
	canvas.width = originalWidth;
	canvas.height = originalHeight;
	ctx.imageSmoothingEnabled = false; // Keep sharp pixels for bigger dots effect
	ctx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight, 0, 0, originalWidth, originalHeight);

	// Replace image src with dithered version
	img.src = canvas.toDataURL();
};

export const ditherConversion = (imageSrc: string, dotSize: number = 3): Promise<string> => {
	if (typeof window === 'undefined') {
		return Promise.reject(new Error('Dithering can only be performed in the browser'));
	}

	return new Promise((resolve, reject) => {
		const img = new Image();
		
		// Set crossOrigin before the image loads to avoid CORS issues (only for external images)
		if (!imageSrc.startsWith(window.location.origin) && !imageSrc.startsWith('/')) {
			img.crossOrigin = 'anonymous';
		}

		img.onload = () => {
			try {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d', { willReadFrequently: true });
				if (!ctx) {
					reject(new Error('Could not get canvas context'));
					return;
				}

				const originalWidth = img.naturalWidth || img.width;
				const originalHeight = img.naturalHeight || img.height;

				// Calculate scaled down size for bigger dots
				const scaledWidth = Math.floor(originalWidth / dotSize);
				const scaledHeight = Math.floor(originalHeight / dotSize);

				// Create temporary canvas for downscaling
				const tempCanvas = document.createElement('canvas');
				const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
				if (!tempCtx) {
					reject(new Error('Could not get temp canvas context'));
					return;
				}

				tempCanvas.width = scaledWidth;
				tempCanvas.height = scaledHeight;

				// Draw scaled down image
				tempCtx.imageSmoothingEnabled = false;
				tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

				// Get image data from scaled down version
				const imageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight);

				// Apply Floyd-Steinberg dithering
				const ditheredData = floydSteinbergDither(imageData);

				// Put dithered data back
				tempCtx.putImageData(ditheredData, 0, 0);

				// Scale back up to original size
				canvas.width = originalWidth;
				canvas.height = originalHeight;
				ctx.imageSmoothingEnabled = false; // Keep sharp pixels for bigger dots effect
				ctx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight, 0, 0, originalWidth, originalHeight);

				// Return the dithered image data URL
				resolve(canvas.toDataURL());
			} catch (error) {
				console.error('❌ Failed to dither image:', imageSrc, error);
				reject(error);
			}
		};

		img.onerror = () => {
			reject(new Error(`Failed to load image: ${imageSrc}`));
		};

		img.src = imageSrc;
	});
}; 
