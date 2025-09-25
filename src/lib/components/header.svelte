<script>
import logo from '$lib/media/sp_logo.svg';
</script>

<header>
    <div class="navigator_container">
        <p class="notes">Navigator</p>
        <div class="navigator_links">
            <a href="/"><h2>mosaic</h2></a>
            <p>/</p>
            <a href="/"><h2>about</h2></a>
        </div>
    </div>
    <div class="logo_container">
        <img src={logo} alt="logo">
        <p class="notes">What is this website</p>
        <h1>Portfolio of Sciences Po medialab's Design team</h1>
    </div>
    <div class="hover_container">
        <p class="notes">Currently hovering</p>
        <h2>None</h2>
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
        z-index: 100;
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
        flex-direction: column;
        align-items: center;
        width: fit-content;
        height: 100%;
        row-gap: var(--spacing-xs);
        background-color: white;
        padding: var(--spacing-xs);
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