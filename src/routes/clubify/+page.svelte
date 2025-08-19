<script lang="ts">
	import type { PhotocardData } from '$lib/types';
	import ClubifyHeader from '$lib/components/clubify/ClubifyHeader.svelte';
	import ClubifyForm from '$lib/components/clubify/ClubifyForm.svelte';
	import ClubifyResult from '$lib/components/clubify/ClubifyResult.svelte';
	import { getRandomClub, getRandomDesignation } from '$lib/data/clubify';
	import ClubifyFooter from '$lib/components/clubify/ClubifyFooter.svelte';
	import logo from '$lib/assets/logo.png';
	import { PUBLIC_CLUBIFY_API_BASE } from '$env/static/public';

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

	{#if !isGenerated}
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
	{/if}

	<ClubifyFooter />
</div>
