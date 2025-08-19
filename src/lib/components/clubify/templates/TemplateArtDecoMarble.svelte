<script lang="ts">
	import GemIcon from '@lucide/svelte/icons/gem';
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
	class="relative h-[600px] w-[600px] overflow-hidden bg-[#0b0d10]"
	bind:this={photocardDiv}
>
	<div
		class="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.04),transparent_40%)]"
	></div>
	<div
		class="absolute inset-0 -z-10 opacity-[0.08] mix-blend-soft-light [background:repeating-linear-gradient(45deg,#fff_0_2px,transparent_2px_8px)]"
	></div>

	<div class="pointer-events-none absolute inset-5 rounded-lg ring-2 ring-amber-400/40"></div>
	<div
		class="pointer-events-none absolute inset-5 rounded-lg [mask-composite:exclude] p-3 ring-1 ring-amber-300/20 [mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)]"
	></div>

	<div
		class="pointer-events-none absolute top-6 left-6 h-10 w-10 border-t-2 border-l-2 border-amber-400/60"
	></div>
	<div
		class="pointer-events-none absolute top-6 right-6 h-10 w-10 border-t-2 border-r-2 border-amber-400/60"
	></div>
	<div
		class="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b-2 border-l-2 border-amber-400/60"
	></div>
	<div
		class="pointer-events-none absolute right-6 bottom-6 h-10 w-10 border-r-2 border-b-2 border-amber-400/60"
	></div>

	<div class="relative z-10 flex h-full w-full">
		<div class="flex w-[45%] items-center justify-center py-8 pl-8">
			<div class="relative w-full">
				<div
					class="absolute -inset-3 -z-10 rounded-[14px] bg-gradient-to-br from-amber-300/10 via-yellow-400/10 to-transparent blur-xl"
				></div>
				<div class="overflow-hidden rounded-[12px] bg-[#0f1216] ring-2 ring-amber-400/50">
					<div
						class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.12),transparent_60%)]"
					></div>
					<img
						src={data.portrait}
						alt="Portrait"
						class="h-[410px] w-full object-cover object-center"
					/>
				</div>
				<div
					class="pointer-events-none absolute -top-6 left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-amber-400/60 to-transparent"
				></div>
				<div
					class="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-t from-amber-400/60 to-transparent"
				></div>
			</div>
		</div>

		<div class="flex w-[55%] flex-col justify-around p-8 pr-10 text-stone-100">
			<div class="flex flex-col gap-2">
				<div
					class="inline-flex items-center gap-2 self-start rounded-sm bg-amber-400/10 px-2.5 py-1 ring-1 ring-amber-400/30"
				>
					<div
						class="flex size-5 items-center justify-center rounded-sm bg-amber-400/15 ring-1 ring-amber-300/40"
					>
						<GemIcon class="size-5 text-amber-300" />
					</div>
					<span class="text-lg leading-tight tracking-tight text-amber-100">{data.club}</span>
				</div>
				<p class="text-xs tracking-[0.22em] text-stone-300/80 uppercase">{data.institution}</p>
			</div>

			<div class="mt-3">
				<h2 class="font-serif text-[40px] leading-tight font-semibold tracking-tight text-stone-50">
					{data.name}
				</h2>
				<p class="mt-2 text-xl font-bold text-amber-300">
					<span
						class="inline-block rounded-sm px-2 py-0.5 tracking-[0.18em] uppercase ring-1 ring-amber-300/60"
						>{data.designation}</span
					>
				</p>
			</div>

			<div>
				<div class="mt-6 h-px w-24 bg-gradient-to-r from-amber-400/60 to-transparent"></div>
				<p class="mt-2 text-xs font-medium text-stone-300">Executive Committee {committeeYear}</p>
			</div>
		</div>
	</div>

	<GemIcon class="pointer-events-none absolute right-6 bottom-6 z-0 size-36 text-amber-300/10" />
</div>
