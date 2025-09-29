<script lang="ts">
    import Header from '$lib/components/header.svelte';
    import Footer from '$lib/components/footer.svelte';
    import Card from '$lib/components/card.svelte';
    import type { PageProps } from './$types';
    import type { ImageMetadata } from '$lib/images';
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';

    let { data }: PageProps = $props();

	type ImageShape = 'Horizontal' | 'Vertical' | 'Square';

	const extractThumbnailImage = (
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

    const projectMediaFilesObtainer = (
        mediaFilesModules: Record<string, ImageMetadata>,
        projectTag: string
    ): Record<string, ImageMetadata> => {
        return Object.keys(mediaFilesModules)
            .filter(key => key.includes(`/${projectTag}/`))
            .reduce((obj: Record<string, ImageMetadata>, key) => {
                obj[key] = mediaFilesModules[key];
                return obj;
            }, {});
    };

    type MousePosition = {
        x: number;
        y: number;
    };

    const mousePosition = writable<MousePosition>({ x: 0, y: 0 });

    const trackMousePosition = () => {
        const updateMousePosition = (event: MouseEvent) => {
            mousePosition.set({
                x: event.clientX,
                y: event.clientY
            });

            // Normalize to [-1, 1] relative to viewport center and expose as CSS vars
            if (typeof window !== 'undefined') {
                const vw = window.innerWidth || 1;
                const vh = window.innerHeight || 1;
                const nx = (event.clientX / vw) * 2 - 1;
                const ny = (event.clientY / vh) * 2 - 1;
                const root = document.documentElement;
                root.style.setProperty('--mx', String(nx));
                root.style.setProperty('--my', String(ny));
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', updateMousePosition);
            
            return () => {
                window.removeEventListener('mousemove', updateMousePosition);
            };
        }
        
        return () => {};
    };

    onMount(() => {
        trackMousePosition();
    });

    </script>
    
    <Header isHome={true}/>
    
    <section class="cards_container">
		{#each data.projects as project, index}
			{@const thumb = extractThumbnailImage(data.mediaFilesModules, project.tag)}
			<Card 
				image={thumb?.src ?? `https://cataas.com/cat?${Math.random()}`}
				tag={project.tag}
				title={project.title}
				project_type={project.project_type}
				year_begin={project.year_begin}
				year_end={project.year_end}
				inquiry_lead={project.inquiry_lead}
				imageShape={thumb?.shape ?? ['Horizontal', 'Square', 'Vertical'][Math.floor(Math.random() * 3)]}
                imageStacks={projectMediaFilesObtainer(data.mediaFilesModules, project.tag) ?? ''}
                mousePosition={$mousePosition}
                index={index}
                translateMultiplier={100}
                scaleStrength={1}
			/>
		{/each}

    </section>
    
    <Footer />
    
    <style>
    
    .cards_container {
        width: 100%;
        height: fit-content;
    
        padding: var(--spacing-l);
        margin-top: var(--spacing-xl);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        row-gap: var(--spacing-l);
        justify-content: space-between;
    }
    
    </style>