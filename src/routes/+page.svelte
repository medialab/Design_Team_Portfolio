<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import type { PageProps } from './$types';
	import { SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, buildCanonicalUrl } from '$lib/utils/seo';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { deviceType } from '$lib/stores/device-type';

	let { data }: PageProps = $props();

	const pageTitle = SITE_NAME;
	const pageDescription = SITE_DESCRIPTION;
	const pageUrl = buildCanonicalUrl('/');
	const pageImage = DEFAULT_OG_IMAGE;

	let hoveredCardIndex = $state<number | null>(null);

	const handleCardHoverChange = (event: CustomEvent<{ index: number; hovered: boolean }>) => {
		if (event.detail.hovered) {
			hoveredCardIndex = event.detail.index;
			return;
		}

		if (hoveredCardIndex === event.detail.index) {
			hoveredCardIndex = null;
		}
	};

	let isPageLoaded = $state(false);

	onMount(() => {
		isPageLoaded = true;
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={pageUrl} />

	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={pageImage} />
	<meta property="og:image:alt" content="Design Team Portfolio preview" />

	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:url" content={pageUrl} />
	<meta name="twitter:image" content={pageImage} />
	<meta name="twitter:image:alt" content="Design Team Portfolio preview" />
</svelte:head>

<section
	class="hidden max-md:z-[1] max-md:flex max-md:h-[90dvh] max-md:w-full max-md:items-center max-md:justify-start max-md:p-5"
>
	{#if isPageLoaded}
		<div class="w-[90%] flex flex-col gap-2">
			<h1 transition:fly={{ y: 50, duration: 700, delay: 100 }}>
				<span>This is the portfolio of the </span>
				<a href={resolve('/about')} transition:fly={{ y: 50, duration: 700, delay: 120 }}
					><u>Collective Inquiries and Inventive Formats group</u>
				</a>
				<span>@ médialab Sciences Po</span>
			</h1>
			<p class="notes" transition:fly={{ y: 50, duration: 700, delay: 350 }}>
				All the projects listed are part of the collective effort of conducting participatory
				inquiries via design-first methods.
			</p>
		</div>
	{/if}
</section>

<section
	class="md:mt-40 flex h-auto w-full flex-row flex-wrap justify-center gap-10 md:p-10 p-5 items-start overflow-visible"
>
	{#each data.cards as card, index}
		<Card
			isMobile={$deviceType.isMobile}
			isDimmed={hoveredCardIndex !== null && hoveredCardIndex !== index}
			thumbnail={card.thumb}
			tag={card.tag}
			title={card.title}
			stackPreview={card.stackPreview}
			{index}
			on:hoverchange={handleCardHoverChange}
		/>
	{/each}
</section>
