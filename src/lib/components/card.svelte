<script lang="ts">
    //import type { ImageMetadata } from '$lib/images';
    //import { onMount } from 'svelte';
    import { isMobile } from '$lib/utils';
    import { onMount } from 'svelte';
    import { dither } from '$lib/actions/dither';
    import {browser} from '$app/environment';
    import {fade} from 'svelte/transition'
    import {cubicOut} from 'svelte/easing'
    
    //@ts-ignore
    import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';

    import ditheringLottie from '$lib/assets/DITHERING.json';

    

    let props = $props();

    let ra: string = $state('4/3');

    if (props.imageShape === 'Vertical') {
        ra = '3/4';
    } else if (props.imageShape === 'Horizontal') {
        ra = '4/3';
    } else if (props.imageShape === 'Square') {
        ra = '1/1';
    }

    let mockArray = $state([0, 1, 2, 3, 4]);

    let cardEl: HTMLAnchorElement | null = null;

    type Vec2 = { x: number; y: number };
    let layerVectors = $state<Vec2[]>([]);
    let farness = $state(0);
    
    // Track dithering state
    let mainImageDithered = $state(false);
    let stackImagesDithered = $state<boolean[]>([]);
    let isMobileDevice: Boolean = $state(false);

    // Computed variable: true when ALL images are dithered
    let allImagesDithered = $derived(
        isMobileDevice 
            ? mainImageDithered  // On mobile, only check main image
            : mainImageDithered && stackImagesDithered.every(isDithered => isDithered)  // On desktop, check all
    );

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
        // Initialize dithered state for stack images
        stackImagesDithered = new Array(count).fill(false);
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

    
    
    let isPageLoaded = $state(false);

    onMount(async () => {
        isMobileDevice = await isMobile();
        //console.log('Is mobile:', isMobileDevice);

        setTimeout(() => {
            isPageLoaded = true;
        }, 100);
    });

</script>

<a 
    bind:this={cardEl} 
    class="card_container" 
    href="/{props.tag}" 
    style="transform: scale({isMobileDevice ? 1 : 1 + 0.1 * - farness}); will-change: transform; transform-style: preserve-3d; background-color: {isPageLoaded ? 'var(--primary-white)' : 'transparent'};"
>   
    <div class="image_container"
    style="aspect-ratio: {ra};">

        <div class="card_container_dithering"
        
        class:dithering={allImagesDithered}
        class:dithered={!allImagesDithered}>
            
            {#if browser && isPageLoaded}
            <div transition:fade={{ duration: 500, easing: cubicOut }}>
                <LottiePlayer
                    
                    src={ditheringLottie}
                    autoplay={true}
                    loop={true}
                    controls={false}
                    renderer='svg'
                    background='tra'
                    height='800px'
                    width='800px'
                    controlsLayout={[
                            "previousFrame",
                            "playpause",
                            "stop",
                            "nextFrame",
                            "progress",
                            "frame",
                            "loop",
                            "spacer",
                            "background",
                            "snapshot",
                            "zoom",
                            "info"
                        ]} />
                </div>
            {/if}
        </div>

        <img 
            use:dither={{ onDithered: () => mainImageDithered = true }}
            src={props.image || `https://cataas.com/cat?width=800&height=600&t=${Math.random()}`}
            alt={props.title} 
            data-sveltekit-preload-data="eager" 
            loading="eager" 
            fetchpriority="high" 
            {...(props.image ? {} : { crossorigin: 'anonymous' })}
            class:dithering={!allImagesDithered}
            class:dithered={allImagesDithered}
        />

        {#if !isMobileDevice}
            <div class="image_stack">
                <!-- {#if props.imageStacks && Object.keys(props.imageStacks).length > 0}
                    {#each Object.entries(props.imageStacks) as [, imageSrc], index}
                        <img
                        src={(imageSrc as ImageMetadata).src}
                        alt={props.title}
                        style="z-index: {index + 1}; opacity: {Math.max(0.15, 1 - index * 0.12)};"/>
                    {/each}
                {/if}-->
                {#each mockArray as _, index}
                    <img
                        use:dither={{ onDithered: () => stackImagesDithered[index] = true }}
                        crossorigin="anonymous"
                        src={`https://cataas.com/cat?${Math.random()}?card`}
                        alt={props.title}
                        style="z-index: {(-1 * index)}; opacity: {stackImagesDithered[index] ? (index === 0 ? 1 : Math.max(0.15, 1 - index * 0.12)) : 0}; transform: translate({(layerVectors[index]?.x ?? 0) * (props.translateMultiplier ?? 14) * farness * ((index + 1) / mockArray.length)}px, {(layerVectors[index]?.y ?? 0) * (props.translateMultiplier ?? 14) * farness * ((index + 1) / mockArray.length)}px); transition: opacity 0.3s var(--curve);"
                        />
                {/each}
            </div>
        {/if}
        
        
    </div>
    <div class="info_container" style="max-width: {props.cardSize === 'S' ? '20ch' : props.cardSize === 'M' ? '25ch' : '35ch'};">
        <p class="notes" id="tag_container" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>#{props.tag}</p>
        <h2 id="title_container" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>{props.title}</h2>
        <div class="specifications_container" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
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
        background-color: unset;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
    }

    .card_container:hover {
        transform: translateY(-2px);
    }

    .card_container:hover .image_stack {
        opacity: 0;
        transition: opacity 0.2s var(--curve);
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
        mix-blend-mode: hard-light;
        filter: grayscale(1);
        transition: mix-blend-mode 0.2s var(--curve);
    }

    .image_container > img:hover {
        mix-blend-mode: default;
        transition: mix-blend-mode 0.2s var(--curve);
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
        transition: opacity 0.2s var(--curve);
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
        transition: transform 0.12s var(--curve);
        mix-blend-mode:hard-light;
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
        transition: all 0.5s var(--curve);
    }

    .info_container > h2 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .info_container > * {
        background-color: var(--primary-white);
    }

    .card_container_dithering {
        width: 100%;
        height: 100%;
        background-color: transparent;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        transition: all 1s var(--curve);
    }

    .dithering {
        opacity: 0;
        transform: translateY(+10%);
        clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
        transition: all 1s var(--curve);
    }

    .dithered {
        opacity: 1;
        transform: translateY(0%);
        clip-path: polygon(0 100%, 100% 100%, 100% 0, 0 0);
        transition: all 1s var(--curve);
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
            right: var(--spacing-s);
            top: var(--spacing-s);
        }

        .info_container {
            padding: 0px;
            position: relative;
            padding: var(--spacing-s);
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