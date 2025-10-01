<script>
    import logo from '$lib/media/sp_logo.svg';

    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { isMobile } from '$lib/utils';

    let props = $props();
    let isMobileDevice = $state(false);

    onMount(async () => {
        isMobileDevice = await isMobile();
        //console.log('Is mobile:', isMobileDevice);
    });

</script>

{#if props.isHome}
    <header id="mobile_home_header">
        <div class="logo_container">
            <img src={logo} alt="logo">
                <h1>This is the portfolio of the Design team, inside mèdialab Sciences Po</h1>
                <p class="notes">All the projects listed are part of the collective effort of conducting participatory inquiries via design-first methods.</p>
        </div>
    </header>
{/if}


<header id="desktop_header">
    {#if props.isHome}
        <div class="navigator_container">
            <p class="notes">Navigator</p>
            <div class="navigator_links">
                <a href="/" onclick={() => goto('/')} style="opacity:{props.isHome ? '1' : '0.5'}">
                    <p>mosaic</p>
                </a>
                <p>/</p>
                <a href="/" onclick={() => goto('/about')} style="opacity:{!props.isHome ? '1' : '0.5'}">
                    <p>about</p>
                </a>
            </div>
        </div>
        <div class="logo_container">
            <img src={logo} alt="logo">
                <p class="notes">What is this website</p>
                <h1>Portfolio of Sciences Po medialab's Design team</h1>
        </div>
        <div class="hover_container">
            <p class="notes">Currently hovering</p>
            <p>None</p>
        </div>
    {:else}
        <div class="navigator_container" id="colorswitch">
            <p class="notes">Switch reading mode</p>
            <div class="navigator_links">
                <a href="/"><p>Light</p></a>
                <p>/</p>
                <a href="/"><p>Dark</p></a>
            </div>
        </div>

        <div class="logo_container">
            <img src={logo} alt="logo">
            <p class="notes">What is this website</p>
            <h1>Portfolio of Sciences Po medialab's Design team</h1>
        </div>

        <a class="hover_container" href="/" id="backhome">
            <p class="notes">Back to home</p>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/></svg>
        </a>
    {/if}
</header>



<style>

    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: fit-content;
        padding-left: var(--spacing-l);
        padding-right: var(--spacing-l);
        padding-top: var(--spacing-m);
        padding-bottom: var(--spacing-m);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }

    .navigator_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        row-gap: var(--spacing-xs);
        width: fit-content;
        height: 100%;
        background-color: white;
        padding: var(--spacing-xs);
    }

    .navigator_links {
        display: flex;
        flex-direction: row;
        column-gap: var(--spacing-xs);
        justify-content: center;
        align-items: center;
    }

    .logo_container {
        display: flex;
        position: absolute;
        flex-direction: column;
        align-items: center;
        width: fit-content;
        height: 100%;
        row-gap: var(--spacing-xs);
        background-color: white;
        padding: var(--spacing-xs);
        left: 50%;
        top: 10px;
        transform: translate(-50%);
        z-index: 1;
    }   

    .hover_container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        width: fit-content;
        height: 100%;
        row-gap: var(--spacing-xs);
        background-color: white;
        padding: var(--spacing-xs);
    }

    #mobile_home_header {
            display: none;
        }

        #desktop_header {
            display: flex;
        }

    @media (max-width: 768px) {

        header {
            width: 100%;
            height: 100%;
            min-height: 90vh;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1;
            display: block;
            place-content: center;
            align-items: center;
            padding: 0px;
            position: static;
        }

        .logo_container {
            position: static;
            align-items: flex-start;
            width: 33ch;
            height: fit-content;
            
            row-gap: var(--spacing-s);
            background-color: transparent;
            padding: 0px;
            
            transform: translate(0%);
            z-index: 1;
            margin: var(--spacing-m);
        }  
        
        .logo_container > img {
            width: 35px;
            height: 35px;
        }

        .logo_container > p {
            width: 35ch;
        }

        #mobile_home_header {
            display: block;
            padding: 0px;
            margin: 0px;
        }

        #desktop_header {
            display: none;
        }
    }

</style>