<script lang="ts">
	//import { onMount } from 'svelte';
	import { isMobile } from '$lib/utils';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { resolve } from '$app/paths';
	import { ditherConversion } from '$lib/utils';

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

	let stackImagesDithered = $state<boolean[]>([]);
	let isMobileDevice: Boolean = $state(false);

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
			const rx = mode === 1 ? 0 : Math.random() * 2 - 1;
			const ry = mode === 0 ? 0 : Math.random() * 2 - 1;
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
		const stacksCount =
			props.imageStack && Object.keys(props.imageStack).length > 0
				? Object.keys(props.imageStack).length
				: mockArray.length;
		ensureLayerVectors(stacksCount);
	});

	$effect(() => {
		// react to mouse movement
		void props.mousePosition;
		updateFarness();
	});

	let isPageLoaded = $state(false);

	const getCatImage = async () => {
		return Promise.resolve(`https://cataas.com/cat?${Math.random()}`);
	}

	onMount(async () => {
		isMobileDevice = await isMobile();
		setTimeout(() => {
			isPageLoaded = true;
		}, 100);
	});
</script>

<a
	bind:this={cardEl}
	class="card_container"
	href={resolve('/[project]', { project: props.tag })}
	style="transform: scale({isMobileDevice
		? 1
		: 1 +
			0.1 *
				-farness}); will-change: transform; transform-style: preserve-3d; background-color: {isPageLoaded
		? 'var(--primary-white)'
		: 'transparent'};"
>
	<div class="image_container" style="aspect-ratio: {ra};">
	{#if props.thumb}
		{#await ditherConversion(props.thumb)}
			{#if browser && isPageLoaded}
				<div transition:fade={{ duration: 500, easing: cubicOut }}>
					<LottiePlayer
						src={ditheringLottie}
						autoplay={true}
						loop={true}
						controls={false}
						renderer="svg"
						background="tra"
						height="100%"
						width="100%"
						controlsLayout={[
							'previousFrame',
							'playpause',
							'stop',
							'nextFrame',
							'progress',
							'frame',
							'loop',
							'spacer',
							'background',
							'snapshot',
							'zoom',
							'info'
						]}
					/>
				</div>
			{/if}
		{:then ditheredImage: string}
			<img
				src={ditheredImage as string}
				alt={props.title}
				data-sveltekit-preload-data="eager"
				loading="eager"
				fetchpriority="high"
				{...props.thumb ? {} : { crossorigin: 'anonymous' }}
			/>
		{/await}
	{:else}
		{#await getCatImage() then catImage}
			{#await ditherConversion(catImage)}
				{#if browser && isPageLoaded}
						<LottiePlayer
							src={ditheringLottie}
							autoplay={true}
							loop={true}
							controls={false}
							renderer="svg"
							background="tra"
							height="100%"
							width="100%"
							controlsLayout={[
								'previousFrame',
								'playpause',
								'stop',
								'nextFrame',
								'progress',
								'frame',
								'loop',
								'spacer',
								'background',
								'snapshot',
								'zoom',
								'info'
							]}
						/>
				{/if}
			{:then ditheredCatImage}
				<img
					src={ditheredCatImage}
					alt={props.title}
					loading="eager"
					fetchpriority="high"
					data-sveltekit-preload-data="eager"
				/>
			{/await}
		{/await}
	{/if}

		{#if !isMobileDevice && !props.isMobile}
			<div class="image_stack">
				{#if props.imageStack && Object.keys(props.imageStack).length > 0}
						{#each Object.keys(props.imageStack) as imageSrc, index}
								{#await ditherConversion(imageSrc as string) then ditheredImg}
									<img
									src={ditheredImg}
									loading="lazy"
									fetchpriority="low"
									alt={props.title}
									style="z-index: {index + 1}; opacity: {Math.max(0.15, 1 - index * 0.12)}; transform: translate({(layerVectors[index]?.x ?? 0) *
										(props.translateMultiplier ?? 14) *
										farness *
										((index + 1) / Object.keys(props.imageStack).length)}px, {(layerVectors[index]?.y ?? 0) *
										(props.translateMultiplier ?? 14) *
										farness *
										((index + 1) / Object.keys(props.imageStack).length)}px); transition: transform 0.12s var(--curve);"/>
								{/await}
						{/each}
					
				{:else if browser && isPageLoaded}
					{#each mockArray as _, index}
						{#await ditherConversion(`https://cataas.com/cat?${Math.random()}?card`) then ditheredCatImage}
							<img
								crossorigin="anonymous"
								src={ditheredCatImage}
								alt={props.title}
								style="z-index: {-1 * index}; opacity: {stackImagesDithered[index]
									? index === 0
										? 1
										: Math.max(0.15, 1 - index * 0.12)
									: 0}; transform: translate({(layerVectors[index]?.x ?? 0) *
									(props.translateMultiplier ?? 14) *
									farness *
									((index + 1) / mockArray.length)}px, {(layerVectors[index]?.y ?? 0) *
									(props.translateMultiplier ?? 14) *
									farness *
									((index + 1) / mockArray.length)}px); transition: opacity 0.3s var(--curve);"
							/>
						{:catch error}
							<p>Error dithering image: {error}</p>
						{/await}
					{/each}
                {/if}

				
			</div>
		{/if}
	</div>
	<div
		class="info_container"
		style="max-width: {props.cardSize === 'S' ? '20ch' : props.cardSize === 'M' ? '25ch' : '35ch'};"
	>
		<p
			class="notes"
			id="tag_container"
			class:hidden={!isPageLoaded}
			class:transitioned={isPageLoaded}
		>
			#{props.tag}
		</p>
		<h2 id="title_container" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
			{props.title}
		</h2>
		<div
			class="specifications_container"
			class:hidden={!isPageLoaded}
			class:transitioned={isPageLoaded}
		>
			{#if props.project_type && props.year_end}
				<p class="notes">{props.project_type} | {props.year_begin} - {props.year_end}</p>
			{:else}
				<p class="notes">{props.year_begin}</p>
			{/if}
			{#if props.team_people}
				<p class="notes" id="people">Research team: {props.team_people}</p>
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
		mix-blend-mode: multiply;
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
		mix-blend-mode: multiply;
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
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: visible;
		text-overflow: ellipsis;
	}

	.info_container > * {
		background-color: var(--primary-white);
	}


	#people {
		line-clamp: 1;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
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
