<script lang="ts">
	import { processImage } from '$lib/imageProcessor';
	import porichitiLogo from '$lib/assets/porichiti_logo.png';
	import porichitiBg from '$lib/assets/porichiti_bg.png';
	import { toPng } from 'html-to-image';
	import { onDestroy } from 'svelte';

	import Download from '@lucide/svelte/icons/download';
	import UploadCloud from '@lucide/svelte/icons/upload-cloud';
	import Undo2 from '@lucide/svelte/icons/undo-2';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let selectedFile: File | null = null;
	let previewUrl: string | null = null;
	let processedImageData: string | null = null;

	let isProcessing = false;
	let isDownloading = false;
	let errorMessage = '';

	let compositionRef: HTMLElement;

	const loadingMessages = [
		'Brewing pixels...',
		'Rendering...',
		'Almost there...',
		'Magic happening...',
		'Dusting pixels...',
		'In the oven...',
		'Synthesizing...',
		'Compiling art...',
		'Painting...'
	];

	let currentLoadingMessage = loadingMessages[0];
	let intervalId: ReturnType<typeof setInterval>;

	function updateLoadingMessage() {
		let newMessage = currentLoadingMessage;
		while (newMessage === currentLoadingMessage) {
			const randomIndex = Math.floor(Math.random() * loadingMessages.length);
			newMessage = loadingMessages[randomIndex];
		}
		currentLoadingMessage = newMessage;
	}

	$: if (isProcessing) {
		updateLoadingMessage();
		intervalId = setInterval(updateLoadingMessage, 5000);
	} else {
		if (intervalId) {
			clearInterval(intervalId);
		}
	}

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			if (!file.type.startsWith('image/')) {
				errorMessage = 'Please select a valid image file.';
				return;
			}
			if (file.size > 10 * 1024 * 1024) {
				errorMessage = 'Image is too big! (Max 10MB)';
				return;
			}

			selectedFile = file;
			errorMessage = '';

			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
			previewUrl = URL.createObjectURL(file);
		}
	}

	async function handleSubmit() {
		if (!selectedFile) {
			errorMessage = 'First, select an image!';
			return;
		}

		isProcessing = true;
		errorMessage = '';
		processedImageData = null;

		try {
			const formData = new FormData();
			formData.append('image', selectedFile);

			const response = await fetch('/api/porichiti', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`);
			}

			const result = await response.json();
			const serverImageUrl = result.imageUrl;

			if (serverImageUrl) {
				processedImageData = await processImage(serverImageUrl);
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Something went wrong...';
		} finally {
			isProcessing = false;
		}
	}

	async function downloadComposition() {
		if (!compositionRef) return;

		isDownloading = true;
		try {
			const dataUrl = await toPng(compositionRef, {
				quality: 1.0,
				pixelRatio: 2
			});
			const link = document.createElement('a');
			link.download = 'porichiti-24-masterpiece.png';
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error('Failed to generate image', err);
			errorMessage = 'Could not generate download. Please try again.';
		} finally {
			isDownloading = false;
		}
	}

	function resetForm() {
		selectedFile = null;
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		previewUrl = null;
		processedImageData = null;
		errorMessage = '';

		const fileInput = document.getElementById('imageInput') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	const buttonBaseClasses =
		'flex items-center justify-center gap-2 border-2 border-black px-4 py-2 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-sm shadow-[4px_4px_0px_#000]';
	const primaryButtonClasses = `${buttonBaseClasses} bg-blue-500 text-white hover:bg-blue-600 active:translate-x-px active:translate-y-px active:shadow-none focus:ring-blue-500`;
	const secondaryButtonClasses = `${buttonBaseClasses} bg-gray-200 text-gray-800 hover:bg-gray-300 active:translate-x-px active:translate-y-px active:shadow-none focus:ring-gray-400`;
	const downloadButtonClasses = `${buttonBaseClasses} bg-green-500 text-white hover:bg-green-600 active:translate-x-px active:translate-y-px active:shadow-none focus:ring-green-500`;
	const announcementButtonClasses = `${buttonBaseClasses} bg-yellow-400 text-black hover:bg-yellow-500 active:translate-x-px active:translate-y-px active:shadow-none focus:ring-yellow-400`;
</script>

<svelte:head>
	<title>Porichiti '24 - By Joyoddhoney | Jontrokotha</title>
	<meta name="description" content="Generate your pixel art CUETian selfie!" />
</svelte:head>

<main
	class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 py-8 font-sink sm:py-12"
>
	<div class="mx-auto max-w-4xl px-4 sm:px-6">
		<!-- Header -->
		<div class="mb-8 text-center md:mb-12">
			<img src={porichitiLogo} alt="Porichiti Logo" class="mx-auto w-64 sm:w-80" />
			<p class="mx-auto mt-2 max-w-2xl text-base text-gray-600 sm:text-lg">By Joyoddhoney</p>
		</div>

		<div class="mx-auto max-w-2xl">
			{#if !processedImageData}
				<!-- UPLOAD FORM STATE -->
				<div class="border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-8">
					<!-- ADDED INSTRUCTIONAL TEXT -->
					<div class="mb-6">
						<p class="mt-1 text-sm text-pretty text-gray-600">
							To get your CUET selfie, please upload a clear photo of yourself.
						</p>
					</div>

					<div class="mb-6">
						<label
							for="imageInput"
							class="{primaryButtonClasses} w-full cursor-pointer text-center"
						>
							<UploadCloud class="h-5 w-5" />
							{selectedFile ? 'Change Photo' : 'Upload Your Photo'}
						</label>
						<input
							id="imageInput"
							type="file"
							accept="image/*"
							on:change={handleFileSelect}
							class="hidden"
							disabled={isProcessing}
						/>
						<p class="mt-4 text-center text-xs text-gray-500">A portrait, looking at the camera</p>

						{#if errorMessage}
							<p class="mt-4 text-center text-sm text-red-600">{errorMessage}</p>
						{/if}
					</div>

					{#if previewUrl}
						<div class="mb-6">
							<h3 class="mb-3 text-sm font-medium text-gray-700">Preview:</h3>
							<div class="overflow-hidden border-2 border-black bg-gray-100">
								<img src={previewUrl} alt="Preview" class="h-48 w-full object-contain sm:h-64" />
							</div>
						</div>
					{/if}

					{#if selectedFile}
						<div class="flex gap-4">
							<button
								type="button"
								on:click={handleSubmit}
								disabled={!selectedFile || isProcessing}
								class="flex-1 {primaryButtonClasses}"
							>
								{#if isProcessing}
									<Loader2 class="h-4 w-4 animate-spin" />
									<span>{currentLoadingMessage}</span>
								{:else}
									Generate My CUET Selfie!
								{/if}
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<div class="border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-8">
					<div
						class="mb-6 flex flex-col items-start gap-3 border-2 border-yellow-400 bg-yellow-50 p-4"
					>
						<p class="text-xs text-yellow-800 sm:text-sm">
							<span class="font-medium">🎭 Special Announcement!</span> Online talent show for CUET '24
							batch. All ’24 students invited.
						</p>
						<a
							href="https://fb.com/joyoddhoney"
							target="_blank"
							rel="noopener noreferrer"
							class={announcementButtonClasses}
						>
							Learn More
						</a>
					</div>

					<h3 class="mb-4 text-base font-medium text-gray-900 sm:text-lg">
						Here's your CUET selfie!
					</h3>

					<div
						bind:this={compositionRef}
						class="relative aspect-square w-full overflow-hidden border-2 border-black bg-white"
					>
						<img src={porichitiBg} alt="Pixel Art Background" class="h-full w-full object-cover" />
						<img
							src={processedImageData}
							alt="Your pixelated self"
							class="absolute bottom-0 left-10 z-10 h-2/3 object-contain"
						/>
					</div>

					<div class="mt-6 flex flex-col gap-4 sm:flex-row">
						<button
							on:click={downloadComposition}
							disabled={isDownloading}
							class="flex-1 {downloadButtonClasses}"
						>
							{#if isDownloading}
								<Loader2 class="h-4 w-4 animate-spin" />
								<span>Preparing...</span>
							{:else}
								<Download class="h-5 w-5" />
								<span>Download Masterpiece</span>
							{/if}
						</button>
						<button on:click={resetForm} class={secondaryButtonClasses}>
							<Undo2 class="h-5 w-5" />
							<span>Start Over</span>
						</button>
					</div>
					<p class="mt-4 text-center text-xs text-gray-500 italic">
						Having trouble downloading? This app works best on Google Chrome.
					</p>
				</div>
			{/if}
		</div>
	</div>
</main>

<footer class="flex h-16 flex-col justify-center border-t-2 border-black bg-white font-sink">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6">
		<p class="text-sm text-gray-600">
			Built by
			<a
				href="https://sh4jid.me"
				target="_blank"
				rel="noopener noreferrer"
				class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
			>
				sh4jid</a
			>, powered by
			<span class="font-medium text-gray-800">Jontrokotha</span>
		</p>
	</div>
</footer>
