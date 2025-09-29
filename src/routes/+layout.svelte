<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}


<style>
	:global(body) {
		background-color: #F9F9F9;
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
	}

	:global(h1) {
		font-size: 18px;
		font-weight: 400;
		line-height: 1.1;
	}

	:global(h2) {
		font-size: 22px;
		font-weight: 400;
		line-height: 1.1;
	}

	:global(.notes) {
		font-size: 12px;
		color: #AFAFAF;
	}

	:global(p) {
		font-size: 16px;
		font-weight: 400;
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
</style>
