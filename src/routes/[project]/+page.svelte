<script lang="ts">
    import type { PageProps } from './$types';
    import Header from '$lib/components/header.svelte';
    import Footer from '$lib/components/footer.svelte';
    import { extractThumbnailImage } from '$lib/utils';
    import { onMount } from 'svelte';

    let { data }: PageProps = $props();
    const project = data.project;
    const projectMediaFiles = data.projectMediaFiles;

    let thumb = extractThumbnailImage(data.mediaFilesModules, project.tag)

    let isPageLoaded: Boolean = $state(false);

    let videoRefs: HTMLVideoElement[] = [];

    onMount(() => {
        isPageLoaded = true;
    });
</script>

<Header type="project" tag={project.tag} isAbout={false}/>

<section class="main_container">
    <div class="scroller_container">
        
        <div class="hero_card">
            <div class="thumb_cont" style="transition-delay: 0.1s;" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
                <img src={thumb?.src ?? `https://cataas.com/cat?${Math.random()}`} alt={project.title} />
            </div>
            <div class="hero_text">
               
               <h1 class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>{project.title}</h1>
                <div class="hero_infos">
                    <p class="notes" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded} style="transition-delay: 0.2s;">{project.project_type} | {project.year_begin} - {project.year_end}</p>
                    <p class="notes" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded} style="transition-delay: 0.2s;">Inquiry lead: {project.inquiry_lead}</p>
                </div>
                
            </div>

            <article class="article_container" >
                <hr class="divider" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded} style="transition-delay: 0.35s;">
                <div>
                    <p class="medium" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded} style="transition-delay: 0.35s;">Context</p>
                    <p id="description"class:hidden={!isPageLoaded} class:transitioned={isPageLoaded} style="transition-delay: 0.35s;">{project.description}</p>
                </div>

                {#each Object.entries(projectMediaFiles) as [key, mediaFile]}
                    {#if key.endsWith('.mp4')}
                        <div class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
                            <video
                            src={mediaFile.src}
                            preload="metadata"
                            bind:this={videoRefs[videoRefs.length]}
                            muted
                            autoplay={false}
                            oncanplay={
                                (event) => {
                                    const video = event.currentTarget as HTMLVideoElement;
                                    video.play();
                                }
                            }>   
                            </video>
                        </div>
                    {:else}
                        <div class={mediaFile.width > mediaFile.height ? 'horizontal-image' : 'vertical-image'} >
                            <img
                            class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}
                            style="transition-delay: 0.4s;"
                            src={mediaFile.src}
                            alt="Project media"
                            width={mediaFile.width}
                            height={mediaFile.height}
                            />
                        </div>
                    {/if}
                {/each}
            </article>
        </div>
    </div>
    <Footer />
</section>

<style>

    h1 {
        font-size: 32px;
        line-height: 1.1;
    }

    .main_container {
        display: grid;
        grid-template-columns: repeat(11, 1fr);
        grid-column-gap: var(--spacing-m);
        width: 100%;
        height: 100%;
        padding-top: 130px;
    }

    .scroller_container {
        grid-column: 4 / 9;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .hero_card {
        display: flex;
        flex-direction: column;
        row-gap: var(--spacing-m);
        width: 100%;
        height: fit-content;
    }

    .hero_text {
        display: flex;
        flex-direction: column;
        row-gap: var(--spacing-m);
        width: 100%;
        height: fit-content;
        padding: 0px var(--spacing-xs);
    }

    .hero_infos {
        display: flex;
        flex-direction: column;
        row-gap: 0px;
        width: 100%;
        height: fit-content;
    }
    
    .thumb_cont {
        display: block;
        width: 100%;
        height: 30%;
        aspect-ratio: 21/9;
        overflow: hidden;
        place-content: center;
    }

    .thumb_cont > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(1);
    }

    .divider {
        width: 100%;
        height: 1px;
        background-color: var(--permanent-black);
        grid-column: span 2;
    }

    .article_container {
        display: grid;
        grid-row-gap: var(--spacing-m);
        width: 100%;
        height: fit-content;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: var(--spacing-m);
        z-index: 2;
        background-color:var(--color-background);
        padding: var(--spacing-xs);
        padding-bottom: var(--spacing-xl);
    }

    .article_container > div {
        display: flex;
        flex-direction: column;
        row-gap: var(--spacing-s);
        width: 100%;
        height: fit-content;
        grid-column: span 2;  
    }

 

    .horizontal-image {
        grid-column: span 2 !important;
    }

    .vertical-image {   
        grid-column: span 1 !important;
    }

    .horizontal-image img,
    .vertical-image img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }

    @media (max-width: 768px) {
        .main_container {
            display: flex;
            flex-direction: column;
            row-gap: var(--spacing-m);
            width: 100%;
            height: 100%;
            padding: var(--spacing-m);
            padding-top: var(--spacing-m);
        }

        .scroller_container {
            grid-column: span 2;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
        }

        .thumb_cont {
            display: block;
            aspect-ratio: 31/9;
            width: 100%;
            margin-top: var(--spacing-xl);
        }

        .hero_text {
            width: 100%;
            position: relative;
            padding: 0px;
        }

        .hero_text > h1 {
            width: 90%;
            overflow: visible;
        }

        .article_container {
            padding: 0px;
            display: flex;
            flex-direction: column;
            row-gap: var(--spacing-m);
        }

        #description {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 15;
            line-clamp: 15;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: var(--spacing-m);
        }

        
    }



</style>