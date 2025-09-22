<script lang="ts">
	import { processImage } from '$lib/imageProcessor';
	import porichitiLogo from '$lib/assets/porichiti/porichiti_logo.png';
	import porichitiBg from '$lib/assets/porichiti/porichiti_bg.png';

	import bird1 from '$lib/assets/porichiti/bird_1.gif';
	import cloud1 from '$lib/assets/porichiti/cloud_1.png';
	import cloud2 from '$lib/assets/porichiti/cloud_2.png';
	import cloud3 from '$lib/assets/porichiti/cloud_3.png';
	import cloud4 from '$lib/assets/porichiti/cloud_4.png';

	import { toPng } from 'html-to-image';
	import { onDestroy } from 'svelte';

	import Download from '@lucide/svelte/icons/download';
	import UploadCloud from '@lucide/svelte/icons/upload-cloud';
	import Undo2 from '@lucide/svelte/icons/undo-2';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import imageCompression from 'browser-image-compression';

	let selectedFile: File | null = null;
	let previewUrl: string | null = null;
	let processedImageData: string | null = null;
	let selectedPose: string = 'v-sign';

	let isProcessing = false;
	let isDownloading = false;
	let errorMessage = '';

	let compositionRef: HTMLElement;

	let birdX = 110;
	let birdY = 10;
	let animationId: number;
	let clouds = [
		{ x: -25, y: 5, speed: 0.025, image: cloud1, height: 'h-[12%]' },
		{ x: 65, y: 15, speed: 0.1, image: cloud2, height: 'h-[10%]' },
		{ x: 15, y: 25, speed: 0.035, image: cloud3, height: 'h-[15%]' },
		{ x: -115, y: 20, speed: 0.05, image: cloud4, height: 'h-[5%]' }
	];

	const poses = [
		{ id: 'v-sign', name: 'V Sign', emoji: '✌️', description: 'Peace sign with hand' },
		{ id: 'crying', name: 'Crying', emoji: '😭', description: 'Crying with spraying tears' },
		{ id: 'flexing', name: 'Flexing', emoji: '💪', description: 'Showing off muscles/strength' },
		{ id: 'thinking', name: 'Thinking', emoji: '🤔', description: 'Hand on chin, pondering pose' }
	];

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

	const updateLoadingMessage = () => {
		let newMessage = currentLoadingMessage;
		while (newMessage === currentLoadingMessage) {
			const randomIndex = Math.floor(Math.random() * loadingMessages.length);
			newMessage = loadingMessages[randomIndex];
		}
		currentLoadingMessage = newMessage;
	};

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
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	});

	import { onMount } from 'svelte';
	import { choice } from '$lib/utilities';

	onMount(() => {
		animateElements();
	});

	const animateElements = () => {
		birdX -= 0.08;
		if (birdX < -15) {
			birdX = 110;
			birdY = Math.random() * 50;
		}

		clouds = clouds.map((cloud) => ({
			...cloud,
			x: cloud.x + cloud.speed
		}));

		clouds = clouds.map((cloud) => {
			if (cloud.x > 110) {
				return {
					...cloud,
					x: -50,
					y: Math.random() * 30,
					height: choice(['h-[12%]', 'h-[10%]', 'h-[5%]', 'h-[10%]'])
				};
			}
			return cloud;
		});

		animationId = requestAnimationFrame(animateElements);
	};

	const handleFileSelect = async (event: Event) => {
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

			const options = {
				maxSizeMB: 0.5,
				maxWidthOrHeight: 500,
				useWebWorker: true
			};

			try {
				const compressedFile = await imageCompression(file, options);
				selectedFile = compressedFile;
				errorMessage = '';

				if (previewUrl) {
					URL.revokeObjectURL(previewUrl);
				}
				previewUrl = URL.createObjectURL(compressedFile);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleSubmit = async () => {
		if (!selectedFile) {
			errorMessage = 'First, select an image!';
			return;
		}

		isProcessing = true;
		errorMessage = '';
		processedImageData = null;

		try {
			const dataUrl = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(selectedFile!);
			});

			const response = await fetch('/api/porichiti', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					image: dataUrl,
					mimeType: selectedFile.type,
					pose: selectedPose
				})
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
	};

	const downloadComposition = async () => {
		if (!compositionRef) return;

		isDownloading = true;
		try {
			const dataUrl = await toPng(compositionRef, {
				quality: 1.0,
				pixelRatio: 4
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
	};

	const resetForm = () => {
		selectedFile = null;
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		previewUrl = null;
		processedImageData = null;
		errorMessage = '';
		selectedPose = 'v-sign';

		const fileInput = document.getElementById('imageInput') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	};

	const buttonBaseClasses =
		'flex items-center justify-center gap-2 border-2 border-black px-4 py-2 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-sm shadow-[4px_4px_0px_#000]';
	const primaryButtonClasses = `${buttonBaseClasses} bg-blue-500 text-white hover:bg-blue-600 active:translate-x-px active:translate-y-px active:shadow-none focus:ring-blue-500`;
	const secondaryButtonClasses = `${buttonBaseClasses} bg-gray-200 text-gray-800 hover:bg-gray-300 active:translate-x-px active:translate-y-px active:shadow-none focus:ring-gray-400`;
	const downloadButtonClasses = `${buttonBaseClasses} bg-green-500 text-white hover:bg-green-600 active:translate-x-px active:translate-y-px active:shadow-none focus:ring-green-500`;
	const announcementButtonClasses = `${buttonBaseClasses} bg-yellow-400 text-black hover:bg-yellow-500 active:translate-x-px active:translate-y-px active:shadow-none focus:ring-yellow-400`;
</script>

<svelte:head>
	<title>Porichiti '24 - By Joyoddhoney | Jontrokotha</title>
	<meta name="description" content="Generate your CUETian pixel art!" />
</svelte:head>

<main
	class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 py-8 font-sink sm:py-12"
>
	<div class="mx-auto max-w-4xl px-4 sm:px-6">
		<div class="mb-8 text-center md:mb-12">
			<img src={porichitiLogo} alt="Porichiti Logo" class="mx-auto w-48 sm:w-64" />
			<p class="mx-auto mt-2 max-w-2xl text-base text-gray-600 sm:text-lg">By Joyoddhoney</p>
		</div>

		<div class="mx-auto max-w-2xl">
			{#if !processedImageData}
				<div class="border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-8">
					<div class="mb-6">
						<p class="mt-1 text-sm text-pretty text-gray-600">
							To get your CUET Pixel Art, please upload a clear photo of yourself.
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
						<p class="mt-4 text-center text-xs text-balance text-gray-500">
							A portrait, looking at the camera
						</p>

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

						<div class="mb-6">
							<h3 class="mb-3 text-sm font-medium text-gray-700">Choose Your Pose:</h3>
							<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
								{#each poses as pose}
									<button
										type="button"
										on:click={() => (selectedPose = pose.id)}
										class="flex flex-col items-center gap-2 border-2 p-3 text-center transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none {selectedPose ===
										pose.id
											? 'border-blue-500 bg-blue-50 text-blue-700'
											: 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'}"
										disabled={isProcessing}
									>
										<span class="text-2xl">{pose.emoji}</span>
										<span class="text-xs font-medium">{pose.name}</span>
									</button>
								{/each}
							</div>
							<p class="mt-2 text-center text-xs text-gray-500">
								{poses.find((p) => p.id === selectedPose)?.description}
							</p>
						</div>
					{/if}

					{#if selectedFile}
						<div class="flex gap-4">
							<button
								type="button"
								on:click={handleSubmit}
								disabled={!selectedFile || isProcessing}
								class="flex-1 leading-loose text-balance {primaryButtonClasses}"
							>
								{#if isProcessing}
									<Loader2 class="h-4 w-4 animate-spin" />
									<span>{currentLoadingMessage}</span>
								{:else}
									Generate My CUET Pixel Art!
								{/if}
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<div class="border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-8">
					<h3 class="mb-4 text-base font-medium text-gray-900 sm:text-lg">
						Here's your CUET Pixel Art!
					</h3>

					<div
						bind:this={compositionRef}
						class="composition-container relative aspect-square w-full overflow-hidden border-2 border-black bg-white"
					>
						<img src={porichitiBg} alt="Pixel Art Background" class="h-full w-full object-cover" />
						<img
							src={processedImageData}
							alt="Your pixelated self"
							class="absolute bottom-0 left-0 z-10 h-3/5 object-contain"
						/>

						{#each clouds as cloud, i}
							<img
								src={cloud.image}
								alt="Cloud {i + 1}"
								class="floating-element absolute {cloud.height} object-contain"
								style="left: {cloud.x}%; top: {cloud.y}%; z-index: {i + 1};"
							/>
						{/each}

						<img
							src={bird1}
							alt="Bird"
							class="floating-element absolute z-5 h-[8%] object-contain"
							style="left: {birdX}%; top: {birdY}%;"
						/>
					</div>

					<div
						class="my-6 flex flex-col items-start gap-3 border-2 border-yellow-400 bg-yellow-50 p-4"
					>
						<p class="text-xs text-yellow-800 sm:text-sm">
							<span class="font-medium">🌟 Attention ’24 Batch!</span> Showcase your talent at our upcoming
							show!
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
					<p class="mt-4 text-xs text-balance text-pretty text-gray-500 italic">
						Having trouble downloading? This app works best on Google Chrome.
					</p>
				</div>
			{/if}
		</div>
	</div>
</main>

<footer class="flex h-16 flex-col justify-center border-t-2 border-black bg-white font-sink">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6">
		<p class="text-sm text-balance text-gray-600">
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

<style>
	.floating-element {
		transition: transform 0.1s ease-out;
		will-change: transform;
	}

	.composition-container * {
		pointer-events: none;
	}
</style>
