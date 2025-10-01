<script>
    import logo from '$lib/media/sp_logo.svg';

    import { goto } from '$app/navigation';
</script>

<button onclick={() => goto('/')} aria-label="Go to home"><img src={logo} alt="logo" class="hover_logo"></button>
    <button class="hover_container" onclick={() => goto('/')} id="backhome" data-sveltekit-preload-data aria-label="Back to home">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1000 1000 1000" fill="#1f1f1f"><path d="M600-160v-360H272l64 64-56 56-160-160 160-160 56 56-64 64h328q33 0 56.5 23.5T680-520v360h-80Z"/>
    </svg>
</button>

<style>

    .hover_container {
        display: none;
    }

    .hover_logo  {
        display: none;
    }

    @media (max-width: 768px) {
        :global(.hover_container) {
            display: flex !important;
            flex-direction: column;
            position: fixed;
            right: calc(var(--spacing-s));
            top: calc(var(--spacing-s));
            overflow: visible;
            background-color: var(--color-background);
            z-index: 10;
            padding: var(--spacing-xs) 0px var(--spacing-xs) var(--spacing-xs);
        }

        :global(.hover_container > svg) {
            width: 40px;
            height: 40px;
        }

        :global(.hover_logo) {
            position: fixed;
            display: inline-block !important;
            left: var(--spacing-m);
            top: var(--spacing-m);
            margin: var(--spacing-xs) var(--spacing-xs) var(--spacing-xs) 0px;
            width: 30px;
            height: 30px;
            background-color: var(--color-background);
        }
    }
</style>