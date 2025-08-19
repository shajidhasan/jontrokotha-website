<script lang="ts">
	import type { PhotocardData } from '$lib/types';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import TemplateElegant from '$lib/components/clubify/templates/TemplateElegant.svelte';
	import TemplateRegal from '$lib/components/clubify/templates/TemplateRegal.svelte';
	import TemplateGrungeWall from '$lib/components/clubify/templates/TemplateGrungeWall.svelte';
	import TemplateAestheticBlur from '$lib/components/clubify/templates/TemplateAestheticBlur.svelte';
	import TemplateFuturisticHolo from '$lib/components/clubify/templates/TemplateFuturisticHolo.svelte';
	import TemplateArtDecoMarble from '$lib/components/clubify/templates/TemplateArtDecoMarble.svelte';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import { getDifferentClub, getDifferentDesignation } from '$lib/data/clubify';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';
	import { toPng } from 'html-to-image';
	import { slugify } from '$lib/utilities';
	import { PUBLIC_CLUBIFY_API_BASE } from '$env/static/public';
	import { goto } from '$app/navigation';

	interface Props {
		data: PhotocardData;
		onCreateAnother: () => void;
	}

	let { data = $bindable(), onCreateAnother }: Props = $props();

	const templates = [
		TemplateElegant,
		TemplateRegal,
		TemplateGrungeWall,
		TemplateAestheticBlur,
		TemplateFuturisticHolo,
		TemplateArtDecoMarble
	];

	let photocardContainerDiv: HTMLDivElement | null = $state(null);
	let photocardDiv: HTMLDivElement | null = $state(null);

	let randomizing = $state(false);
	let selectedTemplate = $derived(Math.floor(Math.random() * templates.length));
	let postingToFacebook = $state(false);

	const Template = $derived(templates[selectedTemplate]);

	const downloadCard = async () => {
		if (!photocardDiv) return;

		const dataUrl = await toPng(photocardDiv, {
			quality: 1.0,
			pixelRatio: 3,
			style: {
				transform: 'scale(1)',
				transformOrigin: 'top left'
			}
		});
		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = `${slugify(data.name)}-${slugify(data.club)}.png`;
		link.click();
	};

	const onPostToFacebook = async () => {
		if (!photocardDiv) return;

		try {
			postingToFacebook = true;
			const dataUrl = await toPng(photocardDiv, {
				quality: 1.0,
				pixelRatio: 2,
				style: {
					transform: 'scale(1)',
					transformOrigin: 'top left'
				}
			});

			const response = await fetch(`${PUBLIC_CLUBIFY_API_BASE}/post-to-jontrokotha`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: data.name,
					club: data.club,
					photo: dataUrl
				})
			});

			if (!response.ok) {
				alert('Failed to post to Facebook');
				return;
			}
			const jsonData = await response.json();

			postingToFacebook = false;

			goto(`/clubify/${jsonData.post_id}`);
		} catch (error) {
			postingToFacebook = false;
			alert('Failed to post to Facebook');
		}
	};

	// Helper function to get a different template index
	const getDifferentTemplate = (currentTemplate: number): number => {
		let newTemplate = Math.floor(Math.random() * templates.length);
		// Keep trying until we get a different template
		while (newTemplate === currentTemplate) {
			newTemplate = Math.floor(Math.random() * templates.length);
		}
		return newTemplate;
	};

	const onRandomize = () => {
		randomizing = true;
		setTimeout(() => {
			// Store current values to ensure we get different ones
			const currentDesignation = data.designation;
			const currentClub = data.club;
			const currentTemplate = selectedTemplate;

			// Get different values
			data.designation = getDifferentDesignation(currentDesignation);
			data.club = getDifferentClub(currentClub);
			selectedTemplate = getDifferentTemplate(currentTemplate);

			randomizing = false;

			setTimeout(() => {
				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 }
				});
			}, 500);
		}, 500);
	};

	const onResize = () => {
		if (photocardDiv && photocardContainerDiv) {
			console.log('onResize');
			// Apply CSS transform scale to fit the parent
			const parentWidth = photocardContainerDiv.clientWidth;
			console.log(parentWidth);
			const scale = parentWidth / 600; // 600 is the original width of the preview
			photocardDiv.style.transform = `scale(${scale})`;
			photocardDiv.style.transformOrigin = 'top left'; // Ensure scaling starts from top left
		}
	};

	$effect(() => {
		onResize();
	});

	onMount(() => {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 }
		});
	});
</script>

<svelte:window onresize={onResize} />

<div class="flex-1">
	<div class="mx-auto flex max-w-3xl flex-col">
		<div class="p-4 sm:p-6">
			<div class="mb-6">
				<h2 class="text-3xl tracking-tight text-zinc-900">Congratulations!</h2>
				<p class="mt-2 text-base text-zinc-500">You're in a club now!</p>
			</div>

			<!-- Card Display -->
			<div
				bind:this={photocardContainerDiv}
				class="relative mx-auto aspect-square ring-1 ring-zinc-200"
			>
				{#if randomizing}
					<div
						in:fade={{ duration: 300 }}
						out:fade={{ duration: 300, delay: 500 }}
						class="absolute inset-0 z-100 flex items-center justify-center bg-white"
					>
						<LoaderIcon class="h-20 w-20 animate-spin text-zinc-300" />
					</div>
				{/if}
				<div class="absolute inset-0">
					<Template {data} bind:photocardDiv />
				</div>
			</div>

			<!-- Action Area -->
			<div class="mt-6 space-y-3">
				<!-- Primary CTA -->
				<button
					onclick={onPostToFacebook}
					class="group flex w-full items-center justify-center gap-3 rounded-full bg-indigo-600 px-4 py-3 text-lg text-sm font-medium text-white shadow-lg ring-1 shadow-indigo-600/20 ring-black/5 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none md:text-lg"
					disabled={postingToFacebook}
				>
					{#if postingToFacebook}
						<LoaderIcon class="h-4 w-4 animate-spin" />
					{:else}
						<svg
							role="img"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							class="size-4 md:size-6"
						>
							<path
								fill="currentColor"
								d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
							/></svg
						>
					{/if}
					<span> Post to Jontrokotha Facebook Page </span>
				</button>

				<!-- Secondary row: randomize + subtle download link -->
				<div class="flex items-center justify-between">
					<button
						onclick={onRandomize}
						class="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none"
					>
						<RefreshCwIcon class={`h-4 w-4 ${randomizing ? 'animate-spin' : ''}`} />
						Try Again
					</button>

					<button
						onclick={downloadCard}
						class="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 underline decoration-dotted underline-offset-4 transition-colors hover:text-zinc-600"
					>
						<DownloadIcon class="h-4 w-4" />
						Download as image
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
