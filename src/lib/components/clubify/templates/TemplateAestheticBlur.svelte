<script lang="ts">
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import type { PhotocardData } from '$lib/types';

	let {
		photocardDiv = $bindable(),
		data
	}: { photocardDiv: HTMLDivElement | null; data: PhotocardData } = $props();

	let committeeYear = $derived.by(() => {
		const currentYear = new Date().getFullYear();
		return `${currentYear}-${currentYear + 1}`;
	});

	const confetti = [
		{ x: 15, y: 20, size: 'w-2 h-2', color: 'bg-yellow-400', rotation: 'rotate-12' },
		{ x: 85, y: 15, size: 'w-1 h-1', color: 'bg-pink-400', rotation: 'rotate-45' },
		{ x: 25, y: 35, size: 'w-1.5 h-1.5', color: 'bg-blue-400', rotation: '-rotate-12' },
		{ x: 75, y: 25, size: 'w-2 h-1', color: 'bg-green-400', rotation: 'rotate-90' },
		{ x: 45, y: 10, size: 'w-1 h-2', color: 'bg-purple-400', rotation: 'rotate-45' },
		{ x: 65, y: 40, size: 'w-1.5 h-1.5', color: 'bg-red-400', rotation: '-rotate-45' },
		{ x: 10, y: 60, size: 'w-1 h-1', color: 'bg-cyan-400', rotation: 'rotate-12' },
		{ x: 90, y: 55, size: 'w-2 h-1', color: 'bg-orange-400', rotation: '-rotate-12' },
		{ x: 30, y: 70, size: 'w-1.5 h-1.5', color: 'bg-indigo-400', rotation: 'rotate-90' },
		{ x: 70, y: 65, size: 'w-1 h-2', color: 'bg-teal-400', rotation: '-rotate-45' },
		{ x: 55, y: 80, size: 'w-2 h-2', color: 'bg-lime-400', rotation: 'rotate-45' },
		{ x: 20, y: 85, size: 'w-1 h-1', color: 'bg-rose-400', rotation: '-rotate-12' }
	];
</script>

<div
	id="photocard"
	class="relative h-[600px] w-[600px] overflow-hidden bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300"
	bind:this={photocardDiv}
>
	<div
		class="pointer-events-none absolute inset-0 -z-30 bg-gradient-to-br from-purple-400/20 via-pink-300/20 to-blue-400/20"
	></div>

	<img
		src={data.portrait}
		alt="Blurred Portrait"
		class="pointer-events-none absolute bottom-0 left-1/2 -z-20 h-[120%] w-auto -translate-x-1/2 scale-110 object-cover opacity-50 blur-lg"
	/>

	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 mix-blend-overlay"
	></div>

	<div
		class="pointer-events-none absolute -top-10 -right-10 -z-10 h-56 w-56 rounded-full bg-gradient-to-br from-rose-300/30 to-pink-400/20 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -bottom-12 -left-12 -z-10 h-48 w-48 rounded-full bg-gradient-to-tr from-sky-300/30 to-cyan-400/20 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute top-1/2 right-1/4 -z-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-300/25 to-purple-400/15 blur-2xl"
	></div>

	{#each confetti as piece}
		<div
			class="pointer-events-none absolute -z-5 {piece.size} {piece.color} {piece.rotation} rounded-sm opacity-80"
			style="left: {piece.x}%; top: {piece.y}%;"
		></div>
	{/each}

	<img
		src={data.portrait}
		alt="Portrait"
		class="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[90%] w-auto -translate-x-1/2"
	/>

	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 z-25 h-1/2 bg-gradient-to-t from-black/40 via-purple-900/15 to-transparent"
	></div>

	<div class="absolute top-5 right-0 left-0 z-30">
		<div class="flex justify-center px-2">
			<div
				class="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-lg ring-1 ring-white/50"
			>
				<div
					class="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-1 ring-purple-300/30"
				>
					<SparklesIcon class="size-4 text-purple-700" />
				</div>
				<span
					class="bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-lg font-bold tracking-wide text-transparent"
					>{data.club}</span
				>
			</div>
		</div>
	</div>

	<div class="absolute bottom-20 left-1/2 z-30 w-[88%] -translate-x-1/2 text-center">
		<p
			class="mb-4 font-medium tracking-wider text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
		>
			Executive Committee {committeeYear}
		</p>
		<h2
			class="font-serif text-[42px] leading-none font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
			style="text-shadow: 0 0 20px rgba(255,255,255,0.3), 0 4px 16px rgba(0,0,0,0.7)"
		>
			{data.name}
		</h2>
		<p class="mt-6 text-xl font-bold text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
			<span
				class="inline-block rounded-lg bg-gradient-to-r from-white via-gray-50 to-white px-3 py-1 tracking-[0.18em] text-stone-900 uppercase shadow-lg ring-2 ring-white/60"
			>
				{data.designation}
			</span>
		</p>
	</div>

	<p
		class="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 text-center text-sm font-semibold tracking-[0.24em] text-white/95 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
		style="text-shadow: 0 0 10px rgba(255,255,255,0.2)"
	>
		{data.institution}
	</p>

	<SparklesIcon class="pointer-events-none absolute bottom-4 left-4 z-10 size-32 text-white/15" />
</div>
