import { applyDither } from '$lib/utils';

interface DitherOptions {
    onDithered?: () => void;
    dotSize?: number;
}

export function dither(node: HTMLImageElement, options: DitherOptions = {}) {
    const { onDithered, dotSize = 6 } = options;

    // Set crossOrigin before the image loads to avoid CORS issues (only for external images)
    if (!node.src.startsWith(window.location.origin) && !node.src.startsWith('/')) {
        node.crossOrigin = 'anonymous   ';
    }

    const handleDither = () => {
        try {
            //console.log('Attempting to dither:', node.src);
            //console.log('Image naturalWidth:', node.naturalWidth, 'naturalHeight:', node.naturalHeight);
            //console.log('Image complete:', node.complete, 'crossOrigin:', node.crossOrigin);
            
            applyDither(node, dotSize);
            
            
            // Call the callback when dithering is complete
            if (onDithered) {
                onDithered();
            }
        } catch (error) {
            console.error('❌ Failed to dither image:', node.src, error);
            // Still call callback even if dithering fails so image shows
            if (onDithered) {
                onDithered();
            }
        }
    };

    // Use setTimeout to ensure the image is fully loaded and rendered
    if (node.complete && node.naturalWidth > 0) {
        setTimeout(handleDither, 0);
    } else {
        node.addEventListener('load', handleDither, { once: true });
    }

    return {
        destroy() {
            node.removeEventListener('load', handleDither);
        }
    };
}
