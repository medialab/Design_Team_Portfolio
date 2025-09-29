<script lang="ts">
    import type { PageProps } from './$types';
    import Header from '$lib/components/header.svelte';
    import Footer from '$lib/components/footer.svelte';

    import test_image from '$lib/media/test.gif';

    let { data }: PageProps = $props();
    const project = data.project;
    const projectMediaFiles = data.projectMediaFiles;

    let videoRefs: HTMLVideoElement[] = [];
</script>

<Header isHome={false} tag={project.tag}/>

<Footer />

<section class="main_container">
    <div class="scroller_container">
        <div class="hero_card">
            <div class="thumb_cont">
                <img src={test_image} alt={project.title} />
            </div>
            <div class="hero_text">
                <h1>{project.title}</h1>
                <div class="hero_infos">
                    <p class="notes">{project.project_type} | {project.year_begin} - {project.year_end}</p>
                    <p class="notes">Inquiry lead: {project.inquiry_lead}</p>
                </div>
                
            </div>

            <article class="article_container">
                <hr class="divider">
                <div>
                    <h2>Context</h2>
                    <p>{project.description}</p>
                </div>

                {#each Object.entries(projectMediaFiles) as [key, mediaFile]}
                    {#if key.endsWith('.webm')}
                        <div>
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
                        <div class={mediaFile.width > mediaFile.height ? 'horizontal-image' : 'vertical-image'}>
                            <img
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
    }

    .divider {
        width: 100%;
        height: 1px;
        background-color: #1c1c1c;
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
        background-color:#F9F9F9;
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



</style>