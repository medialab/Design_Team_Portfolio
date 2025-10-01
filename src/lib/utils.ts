// Client-side utility functions

export const isMobile = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    // Check screen width only
    return window.innerWidth <= 768;
};

