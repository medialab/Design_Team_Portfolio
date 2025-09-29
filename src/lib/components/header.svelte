<script>
import logo from '$lib/media/sp_logo.svg';

import { goto } from '$app/navigation';

let props = $props();
</script>

<header>
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

        <div class="hover_container">
            <p class="notes">Currently hovering</p>
            <p>None</p>
        </div>
    {:else}
        <div class="navigator_container">
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

        <a class="hover_container" href="/">
            <p class="notes">Back to home</p>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/></svg>
        </a>
    {/if}

    <div class="logo_container">
        <img src={logo} alt="logo">
        <p class="notes">What is this website</p>
        <h1>Portfolio of Sciences Po medialab's Design team</h1>
    </div>
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

</style>