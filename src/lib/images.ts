// Load image metadata (width, height, format, src) using vite-imagetools

export type ImageMetadata = {
    src: string;
    width: number;
    height: number;
    format: string;
};

export const mediaFilesModules: Record<string, ImageMetadata> = import.meta.glob(
    [
        '$lib/media/**/*.png',
        '$lib/media/**/*.jpg',
        '$lib/media/**/*.jpeg',
        '$lib/media/**/*.webp',
        '$lib/media/**/*.gif',
        '$lib/media/**/*.webm'

    ],
    {
        eager: true,
        // Append imagetools query to every matched file so imports resolve to metadata objects
        // as=metadata yields an object with src, width, height, and format
        query: { imagetools: '', as: 'metadata' }
    }
);


