<script lang="ts">
	import porichitiLogo from '$lib/assets/porichiti/porichiti_logo.png';

	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Trophy from '@lucide/svelte/icons/trophy';
	import Music from '@lucide/svelte/icons/music';
	import Mic from '@lucide/svelte/icons/mic';
	import Heart from '@lucide/svelte/icons/heart';

	const buttonBaseClasses =
		'flex items-center justify-center gap-2 border-2 border-black px-4 py-2 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-sm shadow-[4px_4px_0px_#000]';
	const talentButtonClasses = `${buttonBaseClasses} bg-purple-500 text-white hover:bg-purple-600 active:translate-x-px active:translate-y-px active:shadow-none focus:ring-purple-500`;

	const talentCategories = [
		{ icon: Music, name: 'Dance', description: 'Show off your moves and rhythm' },
		{ icon: Mic, name: 'Singing', description: 'Share your melodious voice' },
		{ icon: Heart, name: 'Recitation', description: 'Express through poetry and prose' },
		{ icon: Sparkles, name: 'Other Talents', description: 'Any other creative performance' }
	];
</script>

<svelte:head>
	<title>Porichiti '24 - By Joyoddhoney | Jontrokotha</title>
	<meta name="description" content="Porichiti '24 - Thank you for 5000+ generations!" />
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
			<!-- Main announcement -->
			<div class="mb-6 border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000] md:p-8">
				<div class="text-center">
					<h2 class="text-pretty text-gray-900 sm:text-xl">
						After 5000+ Generations, We're Stopping The Pixel-Art App!
					</h2>
				</div>
			</div>

			<!-- Talent Show Section -->
			<div class="border-2 border-purple-500 bg-purple-50 p-6 shadow-[8px_8px_0px_#7c3aed] md:p-8">
				<div class="mb-6 text-center">
					<Trophy class="mx-auto mb-4 h-12 w-12 text-purple-600" />
					<h3 class="mb-2 text-lg font-bold text-purple-900 sm:text-xl">
						'24 Batch of CUET - Join Our Talent Show! 🌟
					</h3>
					<p class="mb-4 text-sm text-pretty text-purple-800">
						Calling all talented individuals from the '24 batch! It's time to showcase your amazing
						skills and creativity.
					</p>
				</div>

				<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{#each talentCategories as category}
						<div class="flex items-center gap-3 rounded-lg border-2 border-purple-300 bg-white p-4">
							<svelte:component
								this={category.icon}
								class="h-8 w-8 flex-shrink-0 text-purple-600"
							/>
							<div>
								<h4 class="mb-2 text-sm font-semibold text-purple-900">{category.name}</h4>
								<p class="text-xs text-purple-700">{category.description}</p>
							</div>
						</div>
					{/each}
				</div>

				<div class="text-center">
					<a
						href="https://dub.sh/porichiti"
						target="_blank"
						rel="noopener noreferrer"
						class={talentButtonClasses}
					>
						<Trophy class="h-5 w-5" />
						<span>Learn More</span>
					</a>
					<p class="mt-5 text-sm text-purple-700">
						Don't miss this opportunity to shine and connect with the entire campus!
					</p>
				</div>
			</div>
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
