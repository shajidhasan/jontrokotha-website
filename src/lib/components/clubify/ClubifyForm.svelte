<script lang="ts">
	import UploadIcon from '@lucide/svelte/icons/upload';
	import UserIcon from '@lucide/svelte/icons/user';
	import SchoolIcon from '@lucide/svelte/icons/school';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import CheckIcon from '@lucide/svelte/icons/check';
	import UploadCloudIcon from '@lucide/svelte/icons/upload-cloud';
	import { slide } from 'svelte/transition';

	interface Props {
		name: string;
		institution: string;
		imageFile: File | null;
		isLoading: boolean;
		onSubmit: () => Promise<void>;
		onImageUpload: (event: Event) => void;
	}

	let {
		name = $bindable(),
		institution = $bindable(),
		imageFile = $bindable(),
		isLoading,
		onSubmit,
		onImageUpload
	}: Props = $props();

	const isFormValid = $derived(name.trim() && institution.trim() && imageFile);
</script>

<div class="flex-1">
	<div class="mx-auto flex max-w-3xl flex-1 flex-col">
		<div class="p-6 sm:p-8">
			<!-- Minimalist Header -->
			<div class="mb-8">
				<h2 class="text-2xl tracking-tight text-zinc-900 md:text-3xl">
					Which Club Do You Belong To? 🤔
				</h2>
				<p class="mt-2 text-base text-zinc-500">
					Yes, you do belong to a club. And we shall help you find it! Fill in the details and let
					us do our magic. 🪄✨
				</p>
			</div>

			<form
				class="space-y-6"
				onsubmit={(e) => {
					e.preventDefault();
					onSubmit();
				}}
			>
				<!-- Name Input with Icon Inside -->
				<div>
					<label for="name" class="mb-2 block text-sm font-medium text-zinc-700"> Your Name </label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
							<UserIcon class="h-5 w-5 text-zinc-400" />
						</div>
						<input
							id="name"
							type="text"
							bind:value={name}
							placeholder="e.g., Ricky Barua"
							class="w-full rounded-xl border border-zinc-200 bg-white py-3 pr-3.5 pl-11 text-base text-zinc-800 shadow-sm transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
							required
						/>
					</div>
				</div>

				<!-- Institution Input with Icon Inside -->
				<div>
					<label for="institution" class="mb-2 block text-sm font-medium text-zinc-700">
						Institution
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
							<SchoolIcon class="h-5 w-5 text-zinc-400" />
						</div>
						<input
							id="institution"
							type="text"
							bind:value={institution}
							placeholder="e.g., Chittagong University of Engineering & Technology"
							class="w-full rounded-xl border border-zinc-200 bg-white py-3 pr-3.5 pl-11 text-base text-zinc-800 shadow-sm transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
							required
						/>
					</div>
				</div>

				<!-- File Upload -->
				<div>
					<label class="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
						<UploadIcon class="h-4 w-4" />
						Your Portrait
					</label>
					{#if imageFile}
						<!-- State after file is selected -->
						<div
							class="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 p-3"
						>
							<div class="flex min-w-0 items-center gap-3">
								<CheckIcon class="h-5 w-5 flex-shrink-0 text-emerald-600" />
								<p class="truncate text-sm font-medium text-emerald-800">{imageFile.name}</p>
							</div>
							<button
								type="button"
								onclick={() => (imageFile = null)}
								class="text-sm font-semibold text-zinc-600 hover:text-zinc-900"
							>
								Change
							</button>
						</div>
					{:else}
						<!-- Initial upload state -->
						<label
							for="image-upload"
							class="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white px-5 py-10 ring-1 ring-black/0 transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:ring-black/5"
						>
							<UploadCloudIcon class="h-10 w-10 text-zinc-400 group-hover:text-indigo-500" />
							<p class="mt-3 text-sm font-semibold text-zinc-700">Click or drag to upload</p>
							<p class="mt-1 text-xs text-zinc-500">PNG, JPG, or WEBP</p>
							<input
								id="image-upload"
								type="file"
								accept="image/*"
								onchange={onImageUpload}
								class="sr-only"
								required
							/>
						</label>
					{/if}
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={!isFormValid || isLoading}
					class="active:tranzinc-y-px flex w-full items-center justify-center gap-3 rounded-full bg-zinc-900 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-zinc-900/5 transition-all hover:bg-zinc-800 hover:shadow-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-400"
				>
					{#if isLoading}
						<LoaderIcon class="h-5 w-5 animate-spin" />
						<span>Please Wait...</span>
					{:else}
						<span> ✨ Let's Go! </span>
					{/if}
				</button>

				{#if isLoading}
					<div transition:slide class="mt-4 text-center text-sm text-balance text-zinc-500">
						We're running on a cheap server. Please give us a few seconds.
					</div>
				{/if}
			</form>
		</div>
	</div>
</div>
