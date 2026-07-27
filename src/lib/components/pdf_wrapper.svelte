<script lang="ts">
	import PdfViewer from 'svelte-pdf';
	import type { PdfWrapperProps } from '$lib/utils/types';

	let props: PdfWrapperProps = $props();

	let pdfPage = $state(1);

	// Functions to control page navigation
	function nextPage() {
		if (props.twoPage) {
			if (pdfPage % 2 === 0) {
				pdfPage++;
			} else {
				pdfPage += 2;
			}
		} else {
			pdfPage++;
		}
	}

	function prevPage() {
		if (props.twoPage) {
			if (pdfPage % 2 === 0) {
				pdfPage--;
			} else {
				pdfPage -= 2;
			}
		} else {
			pdfPage--;
		}
	}
</script>

<div
	id="pdf_viewer"
	class="pdf_viewer relative z-20 flex w-full place-content-center items-center justify-center overflow-hidden bg-transparent object-cover"
>
	<p
		id="pdf-next-arrow"
		onclick={nextPage}
		class="notes pointer-events-auto absolute top-1/2 right-0 z-30 h-fit w-fit -translate-y-1/2 bg-(--permanent-white) px-2.5 py-1.25 text-[32px] text-(--permanent-black) cursor-pointer"
	>
		→
	</p>
	<p
		id="pdf-prev-arrow"
		onclick={prevPage}
		class="notes pointer-events-auto absolute top-1/2 left-0 z-30 h-fit w-fit -translate-y-1/2 bg-(--permanent-white) px-2.5 py-1.25 text-[32px] text-(--permanent-black) cursor-pointer"
	>
		←
	</p>
	<PdfViewer
		url={props.mediafile.default}
		showButtons={[]}
		pageNum={pdfPage}
		showBorder={false}
		scale={props.scale}
		twoPage={props.twoPage}
	/>
</div>

<style>
	:global(.pdf_viewer > *) {
		margin: 0 !important;
	}

	:global(.null) {
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
	}

	:global(.parent) {
		margin: 0 !important;
	}

	:global(#topBtn) {
		display: none !important;
	}

	:global(#pdf-prev-arrow:hover),
	:global(#pdf-next-arrow:hover) {
		background: var(--permanent-black) !important;
		color: var(--permanent-white) !important;
	}
</style>
