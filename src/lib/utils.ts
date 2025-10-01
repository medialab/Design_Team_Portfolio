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
    const thumbnailKey = Object.keys(mediaFilesModules)
        .find(key => 
            key.includes(`/${projectTag}/`) && 
            key.toLowerCase().includes('thumb')
        );
    
    if (!thumbnailKey) return null;

    const meta = mediaFilesModules[thumbnailKey];
    const shape: ImageShape = meta.width === meta.height
        ? 'Square'
        : meta.width > meta.height
            ? 'Horizontal'
            : 'Vertical';

    return { src: meta.src, shape };
};