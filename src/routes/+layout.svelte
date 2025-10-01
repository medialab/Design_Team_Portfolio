<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { colorMode } from '$lib/utils';

	let { children } = $props();

	$effect(() => {
		if ($colorMode === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {	
			document.documentElement.setAttribute('data-theme', 'light');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<style>
	:global(body) {
		background-color: var(--color-background);
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Inter', sans-serif;
		letter-spacing: -0.03em;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
	}

	:global(:root) {
		--spacing-xs: 5px;
		--spacing-s: 10px;
		--spacing-m: 20px;
		--spacing-l: 40px;
		--spacing-xl: 80px;
		--spacing-xxl: 160px;

		--permanent-black: #1f1f1f;
	}

	:global([data-theme="light"]) {
		--color-background: #F9F9F9; /*For bg*/
		--color-surface: #FFFFFF;/* For info container and things that are currently purely white */
	
		--dark-primary: #1F1F1F; /* For text and other things that are currently purely black */
		--dark-secondary: #AFAFAF; /* For text calss notes */
	}

	:global([data-theme="dark"]) {
		/* Light mode colors (default) */
		--color-background: #000000; /*For bg*/
		--color-surface: #FFFFFF; /* For info container and things that are currently purely white */

		--dark-primary: #dcdcdc; /* For text and other things that are currently purely black */
		--dark-secondary: #575757; /* For text calss notes */
	}

	:global(h1) {
		font-size: 18px;
		font-weight: 400;
		line-height: 1.1;
		color: var(--dark-primary);
	}

	:global(h2) {
		font-size: 22px;
		font-weight: 400;
		line-height: 1.1;
	}

	:global(.notes) {
		font-size: 12px;
		color: var(--dark-secondary);
	}

	:global(p) {
		font-size: 16px;
		font-weight: 400;
		line-height: 1.3;
		color: var(--dark-primary);
	}

	:global(.medium) {
		font-size: 18px;
		font-weight: 500;
		line-height: 1.3;
	}

	:global(button, a) {
		all: unset;
		box-sizing: border-box;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
	}

	:global(::-webkit-scrollbar) {
		width: 20px;
	}

	:global(::-webkit-scrollbar-track) {
		background: var(--color-background);
	}

	:global(::-webkit-scrollbar-thumb) {
		background: var(--color-surface);
		border-radius: 1px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: var(--color-surface);
	}

	:global(html) {
		scrollbar-width: thin;
		scrollbar-color: var(--color-surface) var(--color-background);
	}

	@media (max-width: 768px) {
		:global(h1) {
			font-size: 36px;
			font-weight: 500;
			word-spacing: -0.08em;
		}

		:global(h2) {
			font-size: 16px;
			font-weight: 300;
			word-spacing: -0.08em;
		}

		:global(body) {
			display: flex;
			flex-direction: column;
		}


		
	}
</style>
