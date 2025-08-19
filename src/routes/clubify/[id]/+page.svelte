<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';
	import SquareArrowUpRightIcon from '@lucide/svelte/icons/square-arrow-up-right';
	import ClubifyHeader from '$lib/components/clubify/ClubifyHeader.svelte';
	import ClubifyFooter from '$lib/components/clubify/ClubifyFooter.svelte';

	onMount(() => {
		// Trigger multiple confetti bursts for more celebration
		const triggerConfetti = () => {
			confetti({
				particleCount: 150,
				spread: 70,
				origin: { y: 0.2 },
				colors: ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b']
			});

			setTimeout(() => {
				confetti({
					particleCount: 100,
					spread: 50,
					origin: { x: 0.2, y: 0.4 },
					colors: ['#10b981', '#06b6d4', '#8b5cf6']
				});
			}, 200);

			setTimeout(() => {
				confetti({
					particleCount: 100,
					spread: 50,
					origin: { x: 0.8, y: 0.4 },
					colors: ['#f59e0b', '#ef4444', '#84cc16']
				});
			}, 400);
		};

		triggerConfetti();
	});
</script>

<div class="flex min-h-screen flex-col bg-zinc-50">
	<ClubifyHeader />

	<div class="flex-1">
		<div
			class="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center p-6 pt-20 sm:p-8"
		>
			<div class="mb-8 flex-shrink-0 text-[5rem]">🎉</div>

			<h1 class="mb-4 text-center text-4xl text-zinc-800">Congratulations!</h1>

			<p class="mb-8 text-center text-xl text-zinc-600">
				🎪 Your club assignment has been announced on our page! Time to share the excitement!
			</p>
			<div class="mb-8 space-y-4">
				<div
					class="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
				>
					<div class="flex-shrink-0 text-2xl">📱</div>
					<div>
						<p class="font-medium text-zinc-800">Share the post to your timeline</p>
					</div>
				</div>

				<div
					class="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
				>
					<div class="flex-shrink-0 text-2xl">👥</div>
					<div>
						<p class="font-medium text-zinc-800">
							Challenge your friends, ask them to find out what club they get
						</p>
					</div>
				</div>
			</div>
			<a
				href="https://fb.com/{page.params.id}"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex w-full items-center justify-center gap-3 rounded-full bg-indigo-600 px-4 py-3 text-lg text-sm font-medium text-white shadow-lg ring-1 shadow-indigo-600/20 ring-black/5 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none md:text-lg"
			>
				<SquareArrowUpRightIcon class="size-4 md:size-6" />
				<span> Open Facebook Post </span>
			</a>
		</div>
	</div>

	<ClubifyFooter />
</div>
