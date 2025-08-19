<script lang="ts">
	import CpuIcon from '@lucide/svelte/icons/cpu';
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
	class="relative h-[600px] w-[600px] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-neutral-900"
	bind:this={photocardDiv}
>
	<div
		class="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px]"
	></div>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:100%_3px] mix-blend-screen"
	></div>

	<div
		class="pointer-events-none absolute -top-10 -left-6 -z-10 h-80 w-1 rotate-12 bg-gradient-to-b from-cyan-400/0 via-cyan-400/70 to-cyan-400/0 blur-[1px]"
	></div>
	<div
		class="pointer-events-none absolute -right-10 -bottom-10 -z-10 h-80 w-1 -rotate-12 bg-gradient-to-b from-fuchsia-400/0 via-fuchsia-400/70 to-fuchsia-400/0 blur-[1px]"
	></div>

	<div class="absolute top-5 right-0 left-0 z-30">
		<div class="flex items-center justify-center">
			<div class="flex items-center justify-between gap-2 rounded-full p-2 ring-1 backdrop-blur">
				<div
					class="flex size-7 items-center justify-center rounded-full bg-cyan-400/20 ring-1 ring-cyan-300/40"
				>
					<CpuIcon class="size-4 text-cyan-200" />
				</div>
				<p
					class="mx-auto my-2 text-center text-base font-semibold tracking-[0.3em] text-cyan-100 uppercase"
				>
					{data.club}
				</p>
			</div>
		</div>

		<div class="flex justify-center">
			<div
				class="max-w-[440px] rounded-md bg-white/5 px-3 py-1 text-center text-balance backdrop-blur"
			>
				<span class="text-xs font-medium text-slate-300 uppercase">
					{data.institution}
				</span>
			</div>
		</div>
	</div>

	<div class="relative z-10 flex h-full w-full items-end justify-center pb-24">
		<div
			class="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[360px] -translate-x-1/2 -translate-y-1/2 [transform:rotateX(65deg)] rounded-full ring-1 ring-cyan-400/30"
		></div>
		<div
			class="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[420px] -translate-x-1/2 -translate-y-1/2 [transform:rotateX(70deg)_rotate(20deg)] rounded-full ring-1 ring-fuchsia-400/25"
		></div>
		<div
			class="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[300px] -translate-x-1/2 -translate-y-1/2 [transform:rotateX(60deg)_rotate(-18deg)] rounded-full ring-1 ring-cyan-300/20"
		></div>

		<img
			src={data.portrait}
			alt="Portrait"
			class="relative z-20 h-[78%] w-auto object-contain drop-shadow-[0_25px_45px_rgba(34,211,238,0.28)]"
		/>

		<div
			class="pointer-events-none absolute bottom-4 left-1/2 -z-10 h-56 w-[120%] origin-bottom -translate-x-1/2 [transform:perspective(800px)_rotateX(60deg)] bg-[length:28px_28px] opacity-45 [background:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)]"
		></div>
		<div
			class="pointer-events-none absolute bottom-24 left-1/2 -z-10 h-20 w-56 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-2xl"
		></div>
	</div>
	<div
		class="pointer-events-none absolute right-0 bottom-14 left-0 z-30 flex flex-col items-center text-center"
	>
		<h2
			class="rounded-lg border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 px-4 py-3 text-center font-sans text-xl leading-none font-bold tracking-wider backdrop-blur-sm"
		>
			<span
				class="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent uppercase drop-shadow drop-shadow-cyan-300/20"
				>{data.designation}</span
			>
		</h2>
	</div>

	<div
		class="pointer-events-none absolute right-0 bottom-24 left-0 z-30 flex flex-col items-center text-center"
	>
		<h2
			class="w-[80%] -skew-x-3 rounded-lg border border-cyan-400/20 bg-slate-900/85 px-6 py-3 text-center font-serif text-[36px] leading-none font-bold tracking-tight shadow-[0_8px_32px_rgba(34,211,238,0.15)] backdrop-blur-sm"
		>
			<span
				class="bg-gradient-to-r from-cyan-200 via-sky-200 to-fuchsia-200 bg-clip-text text-transparent"
				>{data.name}</span
			>
		</h2>
	</div>
	<p class="absolute right-0 bottom-4 left-0 text-center text-[11px] font-medium text-slate-300/90">
		Executive Committee {committeeYear}
	</p>

	<CpuIcon class="pointer-events-none absolute bottom-6 left-6 z-0 size-40 text-cyan-300/10" />
</div>
