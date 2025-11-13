// Client-side utility functions
import type { ImageMetadata } from '$lib/medias';
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

// Optimized Floyd-Steinberg dithering algorithm with pure B&W
function floydSteinbergDither(imageData: ImageData): ImageData {
	const pixels = imageData.data;
	const width = imageData.width;
	const height = imageData.height;
	const dataLength = pixels.length;

	// Pre-calculate error distribution factors
	const FACTOR_RIGHT = 7 / 16;
	const FACTOR_DOWN_LEFT = 3 / 16;
	const FACTOR_DOWN = 5 / 16;
	const FACTOR_DOWN_RIGHT = 1 / 16;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const idx = (y * width + x) * 4;

			// Convert to grayscale using luminance
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

			// Optimized error distribution with inline bounds checking
			const addError = (offset: number, factor: number) => {
				const targetIdx = idx + offset;
				if (targetIdx >= 0 && targetIdx < dataLength) {
					const newVal = pixels[targetIdx] + err * factor;
					const clamped = Math.max(0, Math.min(255, newVal));
					pixels[targetIdx] = clamped;
					pixels[targetIdx + 1] = clamped;
					pixels[targetIdx + 2] = clamped;
				}
			};

			// Floyd-Steinberg error distribution (right, down-left, down, down-right)
			if (x < width - 1) addError(4, FACTOR_RIGHT);
			if (x > 0 && y < height - 1) addError((width - 1) * 4, FACTOR_DOWN_LEFT);
			if (y < height - 1) addError(width * 4, FACTOR_DOWN);
			if (x < width - 1 && y < height - 1) addError((width + 1) * 4, FACTOR_DOWN_RIGHT);
		}
	}

	return imageData;
}

// Optimized dithering function - lighter weight with fewer canvas operations
export const ditherConversion = (imageSrc: string, dotSize: number = 3): Promise<string> => {
	if (typeof window === 'undefined') {
		return Promise.reject(new Error('Dithering can only be performed in the browser'));
	}

	// Type guard: ensure imageSrc is a string
	if (typeof imageSrc !== 'string' || !imageSrc) {
		return Promise.reject(new Error(`Invalid image source: expected string, got ${typeof imageSrc}`));
	}

	return new Promise((resolve, reject) => {
		const img = new Image();
		
		// Set crossOrigin before the image loads to avoid CORS issues (only for external images)
		if (!imageSrc.startsWith(window.location.origin) && !imageSrc.startsWith('/')) {
			img.crossOrigin = 'anonymous';
		}

		img.onload = () => {
			try {
				const originalWidth = img.naturalWidth || img.width;
				const originalHeight = img.naturalHeight || img.height;

				// Cap maximum dimensions to avoid processing huge images (reduces memory and processing time)
				const MAX_DIMENSION = 2000;
				const scale = Math.min(1, MAX_DIMENSION / Math.max(originalWidth, originalHeight));
				const cappedWidth = Math.floor(originalWidth * scale);
				const cappedHeight = Math.floor(originalHeight * scale);

				// Calculate scaled down size for bigger dots
				const scaledWidth = Math.floor(cappedWidth / dotSize);
				const scaledHeight = Math.floor(cappedHeight / dotSize);

				// Create single canvas (reuse if possible, but create new for thread safety)
				const canvas = document.createElement('canvas');
				canvas.width = scaledWidth;
				canvas.height = scaledHeight;
				
				const ctx = canvas.getContext('2d', { willReadFrequently: true });
				if (!ctx) {
					reject(new Error('Could not get canvas context'));
					return;
				}

				// Draw scaled down image directly
				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

				// Get image data and apply dithering
				const imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
				const ditheredData = floydSteinbergDither(imageData);
				ctx.putImageData(ditheredData, 0, 0);

				// Scale back up to capped size (only if needed)
				if (scale < 1 || dotSize > 1) {
					const finalCanvas = document.createElement('canvas');
					const finalCtx = finalCanvas.getContext('2d');
					if (!finalCtx) {
						reject(new Error('Could not get final canvas context'));
						return;
					}
					finalCanvas.width = cappedWidth;
					finalCanvas.height = cappedHeight;
					finalCtx.imageSmoothingEnabled = false;
					finalCtx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, cappedWidth, cappedHeight);
					// Use JPEG with 85% quality for smaller file size (vs PNG)
					resolve(finalCanvas.toDataURL('image/jpeg', 0.85));
				} else {
					// Use JPEG with 85% quality for smaller file size (vs PNG)
					resolve(canvas.toDataURL('image/jpeg', 0.85));
				}
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
