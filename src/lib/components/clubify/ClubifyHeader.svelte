<script lang="ts">
	import logo from '$lib/assets/logo.png';
</script>

<header class="w-full border-b border-zinc-200 bg-white">
	<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
		<div class="flex items-center gap-3">
			<a href="/clubify">
				<img src={logo} alt="Jontrokotha Logo" class="h-9 w-9 rounded-lg shadow-sm" />
			</a>
			<div class="flex flex-col">
				<a href="/clubify">
					<span class="text-xl font-semibold tracking-tight text-zinc-900">Clubify</span>
				</a>
				<span class="text-xs text-zinc-500"
					>by
					<a href="/" class="hover:underline"> Jontrokotha </a>
				</span>
			</div>
		</div>

		<a
			href="https://fb.com/jontrokotha.live"
			class="group inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#166FE5] focus:ring-2 focus:ring-[#1877F2]/30 focus:outline-none"
			aria-label="Follow Jontrokotha on Facebook"
			target="_blank"
			rel="noopener noreferrer"
		>
			<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4">
				<path
					fill="currentColor"
					d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
				/></svg
			>
			<span>Follow Page</span>
		</a>
	</div>
</header>
