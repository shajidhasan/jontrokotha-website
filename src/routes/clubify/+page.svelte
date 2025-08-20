<script lang="ts">
	import type { PhotocardData } from '$lib/types';
	import ClubifyHeader from '$lib/components/clubify/ClubifyHeader.svelte';
	// import ClubifyForm from '$lib/components/clubify/ClubifyForm.svelte';
	// import ClubifyResult from '$lib/components/clubify/ClubifyResult.svelte';
	import { getRandomClub, getRandomDesignation } from '$lib/data/clubify';
	import ClubifyFooter from '$lib/components/clubify/ClubifyFooter.svelte';
	import logo from '$lib/assets/logo.png';
	import { PUBLIC_CLUBIFY_API_BASE } from '$env/static/public';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';

	// Form state
	let name = $state('');
	let institution = $state('');
	let imageFile: File | null = $state(null);
	let isLoading = $state(false);
	let isGenerated = $state(false);

	// Result state
	let data: PhotocardData | null = $state(null);
	let selectedTemplate = $state(0);

	const handleImageUpload = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			imageFile = target.files[0];
		}
	};

	const submitPhoto = async () => {
		if (!name || !institution || !imageFile) {
			alert('Please fill in all fields and upload an image.');
			return;
		}

		isLoading = true;

		try {
			// Create form data for the API call
			const formData = new FormData();
			formData.append('file', imageFile);
			formData.append('name', name);

			// Send to server
			const response = await fetch(`${PUBLIC_CLUBIFY_API_BASE}/process-image/`, {
				method: 'POST',
				headers: {
					accept: 'image/webp'
				},
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to process image');
			}

			// Get the processed image as blob and convert to URL
			const blob = await response.blob();
			const processedImageUrl = URL.createObjectURL(blob);

			// Generate random template, club, and designation
			selectedTemplate = Math.floor(Math.random() * 6);

			// Create the photocard data
			data = {
				name,
				institution,
				club: getRandomClub(),
				designation: getRandomDesignation(),
				portrait: processedImageUrl
			};

			isGenerated = true;
		} catch (error) {
			console.error('Error:', error);
			alert('Failed to process image. Please try again.');
		} finally {
			isLoading = false;
		}
	};

	const resetForm = () => {
		isGenerated = false;
		name = '';
		institution = '';
		imageFile = null;
		data = null;
	};
</script>

<svelte:head>
	<title>Clubify – Find out which club you belong to | Jontrokotha</title>
	<meta
		name="description"
		content="Upload a photo and instantly discover your club with a personalized photocard. Fun, free, and shareable."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Jontrokotha" />
	<meta property="og:title" content="Clubify – Find out which club you belong to | Jontrokotha" />
	<meta
		property="og:description"
		content="Upload a photo and instantly discover your club with a personalized photocard. Fun, free, and shareable."
	/>
	<meta property="og:image" content={logo} />
	<link rel="canonical" href="/clubify" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Clubify – Find out which club you belong to | Jontrokotha" />
	<meta
		name="twitter:description"
		content="Upload a photo and instantly discover your club with a personalized photocard."
	/>
	<meta name="twitter:image" content={logo} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-zinc-50">
	<ClubifyHeader />

	<!-- {#if !isGenerated}
		<ClubifyForm
			bind:name
			bind:institution
			bind:imageFile
			{isLoading}
			onSubmit={submitPhoto}
			onImageUpload={handleImageUpload}
		/>
	{:else if data}
		<ClubifyResult {data} onCreateAnother={resetForm} />
	{/if} -->

	<div class="flex flex-1 items-center justify-center px-4 py-12">
		<div class="mx-auto max-w-2xl text-center">
			<div class="rounded-2xl border border-zinc-200 bg-white p-8 md:p-12">
				<div class="mb-6">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100"
					>
						<CircleAlertIcon class="h-8 w-8 text-amber-600" />
					</div>
					<h2 class="mb-4 text-3xl font-bold text-zinc-900">Clubify is Temporarily Paused</h2>
				</div>

				<p class="mb-4 text-lg leading-relaxed text-balance text-zinc-600">
					We've temporarily paused Clubify. So sorry if you have missed it! But keep an eye out on
					our Facebook for more exciting things in the future.
				</p>

				<a
					href="https://fb.com/jontrokotha.live"
					class="group mb-4 inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#166FE5] focus:ring-2 focus:ring-[#1877F2]/30 focus:outline-none"
					aria-label="Follow Jontrokotha on Facebook"
					target="_blank"
					rel="noopener noreferrer"
				>
					<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4">
						<path
							fill="currentColor"
							d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
						/></svg
					>
					<span>Follow Page</span>
				</a>
				<p class="text-sm text-zinc-500">Thank you for your patience and support! ❤️</p>
			</div>
		</div>
	</div>

	<ClubifyFooter />
</div>
