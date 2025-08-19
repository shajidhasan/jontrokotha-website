<script lang="ts">
	import FlowerIcon from '@lucide/svelte/icons/flower';
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
	class="relative h-[600px] w-[600px] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
	bind:this={photocardDiv}
>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_60%)]"
	></div>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"
	></div>
	<div
		class="pointer-events-none absolute top-16 -left-24 -z-10 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -right-24 bottom-0 -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
	></div>

	<div class="relative h-full w-full">
		<div class="z-10 flex h-full w-[70%] flex-col justify-between p-8">
			<div class="flex flex-col gap-2">
				<div
					class="inline-flex items-center gap-2 self-start rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10 backdrop-blur"
				>
					<div
						class="flex size-5 items-center justify-center rounded-full bg-indigo-500/20 ring-1 ring-indigo-400/30"
					>
						<FlowerIcon class="size-5 text-indigo-300" />
					</div>
					<span class="font-semibold tracking-wide text-slate-100">{data.club}</span>
				</div>
				<p class="mt-2 text-xs tracking-[0.22em] text-slate-400/80 uppercase">{data.institution}</p>
			</div>

			<div class="mt-2 text-white">
				<h2 class="font-serif text-4xl leading-tight font-semibold tracking-tight">{data.name}</h2>
				<p class="mt-2 max-w-[200px] text-2xl font-extrabold">
					<span
						class="bg-gradient-to-r from-indigo-300 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent uppercase"
						>{data.designation}</span
					>
				</p>
			</div>

			<div>
				<div class="mt-6 h-px w-24 bg-gradient-to-r from-white/30 to-transparent"></div>
				<p class="mt-3 max-w-[200px] text-xs font-medium text-slate-400">
					Executive Committee {committeeYear}
				</p>
			</div>
		</div>

		<div
			class="absolute top-0 left-[62%] z-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
		></div>
	</div>

	<div
		class="absolute top-0 right-0 bottom-0 z-0 w-[50%] bg-gradient-to-b from-slate-800/80 to-slate-700/60"
		style="clip-path: polygon(25% 0, 100% 0, 100% 100%, 0% 100%);"
	></div>

	<FlowerIcon class="pointer-events-none absolute bottom-6 -left-10 z-0 size-40 text-white/5" />

	<div class="absolute -right-[25%] bottom-0 z-10 flex h-full w-full items-end justify-end">
		<img
			src={data.portrait}
			alt="Student Portrait"
			class="h-[95%] w-auto object-bottom drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]"
		/>
	</div>
</div>
