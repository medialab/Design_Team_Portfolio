<script lang="ts">
	// IMPORT COMPONENTS AND UTILITIES
	import type { PageProps } from './$types';
	import PdfWrapper from '$lib/components/pdf_wrapper.svelte';

	import { colorMode } from '$lib/utils/stores/color-mode';
	import { SITE_NAME } from '$lib/utils/seo';
	import { SITE_ORIGIN, SITE_BASE_PATH } from '$lib/utils/config';
	import { isImageMetadata } from '$lib/projects/guards';
	import { createPointerTrailMask } from '$lib/utils/pointer-trail';
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { inview } from 'svelte-inview';

	// SET UP THE POINTER TRAIL EFFECT FOR THE DITHER OVERLAY
	const options = {};
	const pointerTrail = createPointerTrailMask(1000);

	// GET THE FILE NAME WITHOUT THE EXTENSION FROM A FILE PATH
	const stemFromFilePath = (filePath: string): string | null => {
		const baseName = filePath.split('/').pop();
		if (!baseName) return null;
		const stem = baseName.replace(/\.[^.]+$/, '');
		return stem || null;
	};

	// GET THE TEXT LABEL FOR AN IMAGE FROM THE FILE NAME
	const didascaliaFromFilePath = (filePath: string | undefined): string | null => {
		if (!filePath) return null;
		const stem = stemFromFilePath(filePath);
		if (!stem) return null;
		return data.didascaliaByStem?.[stem] ?? null;
	};

	// GET THE PROJECT DATA FROM THE SERVER LOAD FUNCTION
	let { data }: PageProps = $props();

	const project = data.project;

	// SORT ALL MEDIA FILES BY FILE NAME (ALPHANUMERICAL ORDER)
	const orderedProjectMediaFiles = Object.keys(data.projectMediaFiles).sort((a, b) =>
		a.localeCompare(b, 'en', { numeric: true })
	);

	// SORT ALL SUB-GALLERY FILES BY FILE NAME (ALPHANUMERICAL ORDER)
	const orderedSubGalleryMediaFiles = Object.keys(data.subGalleryMediaFiles).sort((a, b) =>
		a.localeCompare(b, 'en', { numeric: true })
	);

	// A SINGLE MEDIA ITEM IN A ROW
	type MediaRowItem = {
		key: string;
		mediaFile: any;
		filePath: string | undefined;
		didascalia: string | null;
	};

	// A ROW IN THE MEDIA GRID
	type MediaRow =
		| { kind: 'video'; key: string; mediaFile: any; index: number }
		| { kind: 'pdf'; key: string; mediaFile: any }
		| { kind: 'image-full'; items: [MediaRowItem] }
		| { kind: 'image-portrait'; items: [MediaRowItem] };

	// BUILD THE LIST OF MEDIA ROWS
	// GROUP CONSECUTIVE PORTRAIT IMAGES INTO PAIRS
	// LANDSCAPE IMAGES, VIDEOS, AND PDF FILES EACH USE ONE ROW
	const mediaRows = $derived.by(() => {
		const rows: MediaRow[] = [];
		let videoIndex = 0;

		for (const key of orderedProjectMediaFiles) {
			const mediaFile = data.projectMediaFiles[key];

			// ADD A VIDEO ROW
			if (key.toLowerCase().endsWith('.mp4') || key.toLowerCase().endsWith('.mov')) {
				rows.push({ kind: 'video', key, mediaFile, index: videoIndex });
				videoIndex++;
			// ADD A PDF ROW
			} else if (key.endsWith('.pdf')) {
				rows.push({ kind: 'pdf', key, mediaFile });
			// ADD AN IMAGE ROW
			// DECIDE IF IT IS A LANDSCAPE IMAGE (FULL WIDTH) OR A PORTRAIT IMAGE (CENTERED)
			} else if (!key.toLowerCase().includes('thumb') && key && isImageMetadata(mediaFile)) {
				const filePath = key.split('/').pop();
				const didascalia = didascaliaFromFilePath(filePath);
				if (mediaFile.width > mediaFile.height) {
					rows.push({ kind: 'image-full', items: [{ key, mediaFile, filePath, didascalia }] });
				} else {
					rows.push({ kind: 'image-portrait', items: [{ key, mediaFile, filePath, didascalia }] });
				}
			}
		}

		return rows;
	});

	// BUILD THE PAGE METADATA
	const pageTitle = `${project.title} | ${SITE_NAME}`;
	const pageDescription = project.description;
	const pageUrl = `${SITE_ORIGIN}${SITE_BASE_PATH}/${encodeURIComponent(project.tag)}/`;
	const pageImage = data.thumbnailSrc ? `${SITE_ORIGIN}${data.thumbnailSrc}` : `${SITE_ORIGIN}${SITE_BASE_PATH}/og/og.png`;

	// STORE REFERENCES TO ALL VIDEO ELEMENTS
	// THIS LETS US CONTROL PLAYBACK WHEN THE VIDEO BECOMES VISIBLE
	let videoRefs: HTMLVideoElement[] = $state([]);

	// PAUSE ALL VIDEOS WHEN THE COMPONENT IS DESTROYED
	onDestroy(() => {
		videoRefs.forEach((video) => {
			if (video) {
				video.pause();
			}
		});
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
	<meta property="og:image:alt" content={`${project.title} preview`} />

	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:url" content={pageUrl} />
	<meta name="twitter:image" content={pageImage} />
	<meta name="twitter:image:alt" content={`${project.title} preview`} />

	<meta name="keywords" content={project.description.split(' ').join(', ')} />
	<meta name="author" content={project.author} />
	<meta name="robots" content="index, follow" />
	<meta name="theme-color" content="#000000" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="apple-mobile-web-app-title" content={pageTitle} />
</svelte:head>
{#key project}
	<!-- SECTION: MAIN LAYOUT -->
	<!-- THIS IS THE TWO-COLUMN LAYOUT FOR THE PROJECT PAGE -->
	<!-- LEFT COLUMN: STICKY METADATA SIDEBAR -->
	<!-- RIGHT COLUMN: MEDIA GALLERY -->
	<section
		id="project-page-section"
		class="relative flex min-h-screen w-full flex-row gap-5 max-md:mt-5 max-md:h-full max-md:w-full max-md:flex-col max-md:gap-5 max-md:p-5"
	>
		<!-- LEFT COLUMN: PROJECT METADATA -->
		<!-- THIS IS A STICKY SIDEBAR WITH THUMBNAIL, TITLE, PERIOD, TEAM, AND DESCRIPTION -->
		<div
			id="project-metadata"
			class="sticky top-28 ml-5 flex h-fit w-2/5 flex-col gap-5 overflow-visible bg-(--permanent-white) p-1.5 text-(--permanent-black) max-md:static max-md:top-auto max-md:ml-0 max-md:w-full max-md:bg-transparent max-md:p-0 max-md:translate-y-0"
		>
			<!-- THUMBNAIL AND DITHER OVERLAY -->
			<div
				id="thumbnail-container"
				class="relative grid h-[30%] w-full place-content-center overflow-hidden aspect-21/9 max-md:mt-20 max-md:aspect-31/9"
				style="transition-delay: 0.1s;"
				in:fly={{ y: 20, duration: 700, delay: 100 }}
			>
				{#if data.thumbnailSrc}
					<!-- STANDARD THUMBNAIL IMAGE -->
					<enhanced:img
						id="project-thumbnail"
						src={data.thumbnailSrc}
						alt={project.title}
						class="relative z-0 h-full w-full object-cover transition-[filter] duration-300 [transition-timing-function:--curve]"
						class:grayscale={$colorMode === 'dark'}
						onerror={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
					/>
					<!-- DITHER OVERLAY ON DESKTOP -->
					<!-- THIS IMAGE CREATES A POINTER TRAIL EFFECT ON TOP OF THE THUMBNAIL -->
					{#if data.ditherThumbnailSrc}
						<img
							id="dither-overlay"
							src={data.ditherThumbnailSrc}
							alt="Project thumbnail dither"
							class="absolute inset-0 z-[1] h-full w-full object-cover [-webkit-mask-image:radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_100%)] [mask-image:radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_100%)] max-md:hidden"
							onpointerleave={pointerTrail.handlePointerLeave}
							onpointerenter={pointerTrail.handlePointerEnter}
							onpointermove={pointerTrail.handlePointerMove}
							onmouseleave={pointerTrail.handleMouseLeave}
							onmouseenter={pointerTrail.handleMouseEnter}
							onmousemove={pointerTrail.handleMouseMove}
							ontouchstart={pointerTrail.handleTouchStart}
							ontouchmove={pointerTrail.handleTouchMove}
							ontouchend={pointerTrail.handleTouchEnd}
						/>
					{/if}
				{/if}
			</div>
			<!-- TITLE, PERIOD, AND TEAM -->
			<div id="metadata-info" class="flex h-fit w-full flex-col gap-2.5 max-md:relative max-md:w-full max-md:gap-5">
				<h1
					id="project-title"
					class="w-[90%] text-[32px] leading-[1.1] text-(--permanent-black) max-md:text-primary"
				>
					{project.title}
				</h1>
				<!-- PERIOD AND TEAM LABELS -->
				<div id="metadata-details" class="flex h-fit w-full flex-col gap-0">
					<p
						id="period-label"
						class="notes"
					>
						<b>{project.year_begin} - {project.year_end}</b>
					</p>
					<p
						id="team-label"
						class="notes"
					>
						{project.team_people}
					</p>
				</div>
			</div>
			<!-- PROJECT DESCRIPTION -->
			<div
				id="metadata-description"
				class="flex flex-col gap-1.25 overflow-hidden"
			>
				<p
					id="description-text"
					class="pr-1.25 [display:-webkit-box] overflow-hidden text-ellipsis [-webkit-box-orient:vertical] -webkit-line-clamp-10 line-clamp-10 max-md:pr-0 max-md:-webkit-line-clamp-15 max-md:line-clamp-15 text-(--permanent-black) max-md:text-primary"
				>
					{project.description}
				</p>

			</div>
		</div>

		<!-- RIGHT COLUMN: MEDIA GALLERY -->
		<!-- THIS IS A 2-COLUMN GRID WITH MEDIA FILES -->
		<!-- EACH ROW CAN BE A VIDEO, PDF, LANDSCAPE IMAGE, OR PORTRAIT IMAGE -->
		<article
			id="media-gallery"
			class="relative z-0 grid h-fit min-h-[calc(100vh-110px)] w-3/5 grid-cols-2 gap-x-5 gap-y-5 bg-background pt-28 pr-5 pb-20 max-md:flex max-md:w-full max-md:flex-col max-md:gap-2.5 max-md:p-0"
		>
			<!-- ITERATE OVER ALL PREPROCESSED MEDIA ROWS -->
			{#each mediaRows as row}
				<!-- VIDEO ROW -->
				<!-- THE VIDEO PLAYS WHEN IT BECOMES VISIBLE ON THE SCREEN -->
				<!-- THE VIDEO PAUSES WHEN IT LEAVES THE SCREEN -->
				{#if row.kind === 'video'}
					<div
						id="video-row"
						class="col-span-2 flex h-fit w-full flex-col gap-2.5"
						in:fly={{ y: 16, duration: 550 }}
					>
						<video
							id="video-element"
							src={row.mediaFile.default}
							use:inview={options}
							oninview_enter={() => {
								if (!videoRefs[row.index]) return;
								videoRefs[row.index].play();
							}}
							oninview_leave={() => {
								if (!videoRefs[row.index]) return;
								videoRefs[row.index].pause();
							}}
							preload="metadata"
							muted
							bind:this={videoRefs[row.index] as HTMLVideoElement}
							controls={false}
							autoplay={true}
							playsinline={true}
							loop={true}
							class="h-auto w-full transition-[filter] duration-300 [transition-timing-function:--curve]"
							class:grayscale={$colorMode === 'dark'}
						>
						</video>
					</div>
				<!-- PDF ROW -->
				<!-- THE PDF VIEWER LETS THE USER FLIP THROUGH PAGES -->
				{:else if row.kind === 'pdf'}
					{#if row.mediaFile.default}
						<div
							id="pdf-row"
							class="col-span-2 flex h-fit w-full flex-col gap-2.5"
							in:fly={{ y: 16, duration: 550 }}
						>
							<PdfWrapper
								mediafile={row.mediaFile}
								scale={0.7}
								twoPage={typeof window !== 'undefined' ? window.innerWidth >= 768 : false}
							/>
						</div>
					{/if}
				<!-- LANDSCAPE IMAGE ROW -->
				<!-- THE IMAGE SPANS THE FULL WIDTH (2 COLUMNS) OF THE ARTICLE GRID -->
				{:else if row.kind === 'image-full'}
					<div
						id="image-full-row"
						class="col-span-2 relative overflow-hidden"
						in:fly={{ y: 16, duration: 550 }}
						role="img"
						aria-label="Project media"
					>
						<enhanced:img
							id="image-full-element"
							class="h-auto w-full overflow-hidden bg-inverse object-cover transition-[filter] duration-300 [transition-timing-function:--curve]"
							class:grayscale={$colorMode === 'dark'}
							style="transition-delay: 0.4s;"
							src={row.items[0].mediaFile.src}
							alt="Project media"
						/>
						<!-- SHOW THE TEXT LABEL AT THE BOTTOM LEFT OF THE IMAGE -->
						{#if row.items[0].didascalia}
							<div
								id="image-full-didascalia"
								class="absolute bottom-0 left-0 z-10 h-5 w-fit bg-(--permanent-white) px-1.25 text-[12px] text-(--permanent-black)"
							>
								<p class="notes">{row.items[0].didascalia}</p>
							</div>
						{/if}
					</div>
				<!-- PORTRAIT IMAGE ROW -->
				<!-- THE IMAGE SPANS 2 COLUMNS BUT IS CENTERED IN A NARROWER CONTAINER -->
				{:else if row.kind === 'image-portrait'}
					<div
						id="image-portrait-row"
						class="col-span-2 flex justify-center bg-white"
						in:fly={{ y: 16, duration: 550 }}
					>
						<div id="image-portrait-container" class="relative w-1/2 max-md:w-full overflow-hidden" role="img" aria-label="Project media">
							<enhanced:img
								id="image-portrait-element"
								class="h-auto w-full overflow-hidden bg-inverse object-cover transition-[filter] duration-300 [transition-timing-function:--curve]"
								class:grayscale={$colorMode === 'dark'}
								style="transition-delay: 0.4s;"
								src={row.items[0].mediaFile.src}
								alt="Project media"
							/>
							<!-- SHOW THE TEXT LABEL AT THE BOTTOM LEFT OF THE IMAGE -->
							{#if row.items[0].didascalia}
								<div
									id="image-portrait-didascalia"
									class="absolute bottom-0 left-0 z-10 h-5 w-fit bg-(--permanent-white) px-1.25 text-[12px] text-(--permanent-black)"
								>
									<p class="notes">{row.items[0].didascalia}</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			{/each}
			<!-- SUB-GALLERY SECTION -->
			<!-- THIS IS A 3-COLUMN GRID WITH ADDITIONAL IMAGES -->
			{#if orderedSubGalleryMediaFiles.length > 0}
				<div id="sub-gallery" class="col-span-2 grid grid-flow-dense grid-cols-3 gap-2.5 max-md:grid-cols-2">
					{#each orderedSubGalleryMediaFiles as m}
						{@const mediaFile = data.subGalleryMediaFiles[m]}
						<div
							id="sub-gallery-item"
							class={`${mediaFile.width > mediaFile.height ? 'col-span-3 max-md:col-span-2' : 'col-span-1'} relative overflow-hidden`}
							role="img"
							aria-label="Sub gallery media"
						>
							<enhanced:img
								id="sub-gallery-image"
								src={mediaFile.src}
								alt="Sub gallery media"
								class="h-auto w-full overflow-hidden bg-inverse object-cover transition-[filter] duration-300 [transition-timing-function:--curve]"
							/>
						</div>
					{/each}
				</div>
			{/if}
		</article>
	</section>
{/key}
