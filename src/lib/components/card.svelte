<script lang="ts">
    //import type { ImageMetadata } from '$lib/images';
    //import { onMount } from 'svelte';
    import { isMobile } from '$lib/utils';
    import { onMount } from 'svelte';
    

    let props = $props();

    let ra: string = $state('4/3');

    if (props.imageShape === 'Vertical') {
        ra = '3/4';
    } else if (props.imageShape === 'Horizontal') {
        ra = '4/3';
    } else if (props.imageShape === 'Square') {
        ra = '1/1';
    }

    let mockArray = $state([0, 1, 2, 3]);

    let cardEl: HTMLAnchorElement | null = null;

    type Vec2 = { x: number; y: number };
    let layerVectors = $state<Vec2[]>([]);
    let farness = $state(0);

    const limitTranslation = (v: number) => Math.max(0, Math.min(1, v));

    const logScale = (n: number, k: number) => {
        // Maps n in [0,1] to [0,1] with a logarithmic curve controlled by k>0
        // Higher k increases curvature: slower near 0, faster near 1
        const kk = Math.max(0.0001, k);
        return Math.log1p(kk * n) / Math.log1p(kk);
    };

    const ensureLayerVectors = (count: number) => {
        if (layerVectors.length === count) return;
        const vectors: Vec2[] = [];
        for (let i = 0; i < count; i++) {
            const mode = Math.floor(Math.random() * 3); // 0: x, 1: y, 2: both
            const rx = mode === 1 ? 0 : (Math.random() * 2 - 1);
            const ry = mode === 0 ? 0 : (Math.random() * 2 - 1);
            vectors.push({ x: rx, y: ry });
        }
        layerVectors = vectors;
    };

    const updateFarness = () => {
        if (typeof window === 'undefined' || !cardEl) {
            farness = 0;
            return;
        }

        const rect = cardEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const mx = props.mousePosition?.x ?? cx;
        const my = props.mousePosition?.y ?? cy;
        const dist = Math.hypot(mx - cx, my - cy);
        const maxDist = Math.hypot(window.innerWidth, window.innerHeight) / 2;
        const n = limitTranslation(dist / (maxDist || 1));
        const k = props.scaleStrength ?? 4;
        farness = limitTranslation(logScale(n, k));
    };

    $effect(() => {
        const stacksCount = props.imageStacks && Object.keys(props.imageStacks).length > 0
            ? Object.keys(props.imageStacks).length
            : mockArray.length;
        ensureLayerVectors(stacksCount);
    });

    $effect(() => {
        // react to mouse movement
        void props.mousePosition;
        updateFarness();
    });

    
    let isMobileDevice = $state(false);

    onMount(async () => {
        isMobileDevice = await isMobile();
        //console.log('Is mobile:', isMobileDevice);
    });

</script>

<a bind:this={cardEl} class="card_container" href="/{props.tag}" style="transform: scale({isMobileDevice ? 1 : 1 + 0.1 * - farness}); will-change: transform; transform-style: preserve-3d;">
    <div class="image_container"
    style="aspect-ratio: {ra}">
        <img src={props.image} alt={props.title} data-sveltekit-preload-data="eager"/>
        
        <div class="image_stack">
           <!-- {#if props.imageStacks && Object.keys(props.imageStacks).length > 0}
                {#each Object.entries(props.imageStacks) as [, imageSrc], index}
                    <img
                    src={(imageSrc as ImageMetadata).src}
                    alt={props.title}
                    style="z-index: {index + 1}; opacity: {Math.max(0.15, 1 - index * 0.12)};"/>
                {/each}
            {/if}-->
            {#each mockArray as index}
                <img
                    src={`https://cataas.com/cat?${Math.random()}?card`}
                    alt={props.title}
                    style="z-index: {(-1 * index)}; opacity: {index === 0 ? 1 : Math.max(0.15, 1 - index * 0.12)}; transform: translate({(layerVectors[index]?.x ?? 0) * (props.translateMultiplier ?? 14) * farness * ((index + 1) / mockArray.length)}px, {(layerVectors[index]?.y ?? 0) * (props.translateMultiplier ?? 14) * farness * ((index + 1) / mockArray.length)}px);"
                    />
            {/each}
        </div>
    </div>
    <div class="info_container" style="max-width: {props.cardSize === 'S' ? '20ch' : props.cardSize === 'M' ? '25ch' : '35ch'}">
        <p class="notes" id="tag_container">#{props.tag}</p>
        <h2 id="title_container">{props.title}</h2>
        <div class="specifications_container">
            {#if props.project_type && props.year_end}
                <p class="notes">{props.project_type} | {props.year_begin} - {props.year_end}</p>
                {:else}
                    <p class="notes">{props.year_begin}</p>
            {/if}
            {#if props.inquiry_lead}
                <p class="notes">Inquiry lead: {props.inquiry_lead}</p>
            {/if}
        </div>
    </div>
</a>

<style>
    .card_container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        column-gap: 0px;
        width: fit-content;
        height: 14vh;
        background-color: white;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .card_container:hover {
        transform: translateY(-2px);
    }

    .card_container:hover .image_stack {
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .image_container {
        height: 100%;
        max-height: 100%;
        position: relative;
        place-self: center;
        z-index: 5;
    }

    .image_container > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: static;
        z-index: 1;
    }

    .image_stack {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        pointer-events: none;
        transition: opacity 0.2s ease;
    }

    .image_stack > * {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transition: transform 0.12s ease-out;
    }

    .info_container {
        display: flex;
        flex-direction: column;
        row-gap: var(--spacing-xs);
        align-items: flex-start;
        justify-content: center;
        width: fit-content;
        padding: var(--spacing-s);
        padding-left: 0px;
        z-index: 10;
        
        height: 100%;
        padding-left: var(--spacing-s);
    }

    .info_container > h2 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
        .card_container {
            flex-direction: column;
            height: fit-content;
            width: 100%;
            align-items: flex-start;
            position: relative;
            transform: scale(1);
            background-color: transparent;
        }

        .image_container {
            width: 100%;
            height: auto;
            aspect-ratio: 16/9;
            max-height: 25vh;
        }

        #tag_container {
            position: absolute;
            right: 0px;
            top: var(--spacing-s);
        }

        .info_container {
            padding: 0px;
            position: relative;
            padding-top: var(--spacing-s);
            width: 100%;
        }

        .info_container > h2 {
            width: 80%;
            overflow: visible;
        }

        .image_stack {
            display: none;
            visibility: hidden;
        }
    }
</style>