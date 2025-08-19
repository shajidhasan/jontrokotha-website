<script lang="ts">
	import PaintbrushIcon from '@lucide/svelte/icons/paintbrush';
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
	class="relative h-[600px] w-[600px] overflow-hidden bg-gradient-to-br from-[#f6f5f2] via-[#f2f1ec] to-[#ecebe5]"
	bind:this={photocardDiv}
>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:14px_14px] mix-blend-multiply"
	></div>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.03)_0.5px,transparent_0.5px),linear-gradient(90deg,rgba(0,0,0,0.03)_0.5px,transparent_0.5px)] bg-[size:22px_22px] opacity-60"
	></div>
	<div
		class="pointer-events-none absolute top-8 -left-12 -z-10 h-40 w-40 rounded-full bg-stone-400/10 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute right-0 bottom-6 -z-10 h-48 w-48 rounded-full bg-stone-500/10 blur-3xl"
	></div>

	<div class="relative z-10 flex h-full w-full">
		<div class="flex w-[45%] flex-col justify-between p-8 pr-4">
			<div class="flex flex-col gap-2">
				<div
					class="inline-flex w-[180%] items-center gap-2 self-start rounded-full bg-stone-200/70 px-3 py-1 ring-1 ring-stone-300/70"
				>
					<div
						class="flex size-5 items-center justify-center rounded-full bg-stone-800/10 ring-1 ring-stone-600/20"
					>
						<PaintbrushIcon class="size-5 text-stone-700" />
					</div>
					<span class="text-xl tracking-tight text-stone-800">{data.club}</span>
				</div>
				<p class="tracking-tight text-stone-500 uppercase">{data.institution}</p>
			</div>

			<div class="mt-2 text-stone-900">
				<h2 class="font-serif text-4xl leading-tight font-semibold tracking-tight">{data.name}</h2>
				<p class="mt-1 max-w-[220px] text-xl font-extrabold text-stone-700">
					<span
						class="inline-block rounded bg-stone-200/70 px-1.5 py-0.5 tracking-wider uppercase ring-1 ring-stone-300/80"
						>{data.designation}</span
					>
				</p>
			</div>

			<div>
				<div class="mt-6 h-px w-28 bg-gradient-to-r from-stone-500/50 to-transparent"></div>
				<p class="mt-3 max-w-[200px] text-lg font-medium text-stone-600">
					Executive Committee {committeeYear}
				</p>
			</div>
		</div>

		<div class="relative flex w-[55%] items-center justify-center p-6">
			<div class="relative w-[88%] max-w-[340px] -rotate-2">
				<div
					class="absolute -top-3 -left-2 z-30 h-6 w-16 rotate-[-10deg] rounded-[2px] bg-amber-200/80 shadow-sm"
				></div>
				<div
					class="absolute -right-2 -bottom-3 z-30 h-6 w-16 rotate-[12deg] rounded-[2px] bg-amber-200/80 shadow-sm"
				></div>

				<div
					class="relative overflow-hidden rounded-md bg-stone-50/80 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.15)] ring-1 ring-stone-300/70"
				>
					<div
						class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.05),transparent_60%)]"
					></div>
					<div class="overflow-hidden rounded-[4px] bg-stone-100">
						<img
							src={data.portrait}
							alt="Student Portrait"
							class="h-[380px] w-full object-cover object-center"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<PaintbrushIcon
		class="pointer-events-none absolute bottom-6 left-6 z-0 size-36 text-stone-700/5"
	/>
</div>
