<script lang="ts">
	import CrownIcon from '@lucide/svelte/icons/crown';
	import type { PhotocardData } from '$lib/types';

	let {
		photocardDiv = $bindable(),
		data
	}: { photocardDiv: HTMLDivElement | null; data: PhotocardData } = $props();

	let committeeYear = $derived.by(() => {
		const currentYear = new Date().getFullYear();
		return `${currentYear}-${currentYear + 1}`;
	});
</script>

<div
	id="photocard"
	class="relative h-[600px] w-[600px] overflow-hidden bg-gradient-to-br from-[#faf8f3] via-white to-[#f7f3ea]"
	bind:this={photocardDiv}
>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:22px_22px]"
	></div>
	<div
		class="pointer-events-none absolute -top-10 -right-10 -z-10 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute bottom-0 -left-10 -z-10 h-56 w-56 rounded-full bg-yellow-500/10 blur-3xl"
	></div>

	<div class="relative z-10 h-full w-full">
		<div class="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
			<div
				class="inline-flex items-center gap-2 rounded-full bg-amber-50/70 px-3 py-1 ring-1 ring-amber-200/80"
			>
				<div
					class="flex size-5 items-center justify-center rounded-full bg-amber-400/20 ring-1 ring-amber-400/40"
				>
					<CrownIcon class="size-5 text-amber-700" />
				</div>
				<span class="text-xl font-semibold tracking-wide text-stone-800">{data.club}</span>
			</div>
			<p class="text-[10px] tracking-[0.24em] text-stone-500 uppercase">{data.institution}</p>

			<div
				class="relative mt-4 size-[200px] overflow-hidden rounded-full bg-stone-100 shadow-[0_20px_40px_rgba(0,0,0,0.12)] ring-2 ring-amber-400/40"
			>
				<div
					class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(252,211,77,0.18),transparent_60%)]"
				></div>
				<img src={data.portrait} alt="Student Portrait" class="h-[150%] w-auto object-cover" />
			</div>

			<h2
				class="mt-4 font-serif text-[40px] leading-tight font-semibold tracking-tight text-stone-900"
			>
				{data.name}
			</h2>
			<p class="mt-1 text-xl font-bold text-amber-800">
				<span
					class="inline-block rounded px-1.5 py-0.5 tracking-wider uppercase ring-1 ring-amber-300/80"
					>{data.designation}</span
				>
			</p>

			<div class="mt-4 h-px w-24 bg-gradient-to-r from-amber-400/70 to-transparent"></div>
			<p class="mt-2 text-xs font-medium text-stone-600">Executive Committee {committeeYear}</p>
		</div>
	</div>
	<CrownIcon class="pointer-events-none absolute bottom-8 -left-6 z-0 size-36 text-amber-900/5" />
</div>
