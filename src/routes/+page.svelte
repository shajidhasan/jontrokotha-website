<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import { SiFacebook } from '@icons-pack/svelte-simple-icons';
</script>

<svelte:head>
	<title>Jontrokotha - Tales of Coding, AI, and Tech</title>
	<meta
		name="description"
		content="Stay updated with the latest news in coding, AI, and tech on our Facebook page!"
	/>
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-gray-50 py-12">
	<div class="mx-auto max-w-2xl px-6">
		<!-- Logo -->
		<div class="mb-8">
			<img src={logo} alt="Jontrokotha" class="mx-auto h-24 w-24 rounded-xl object-contain" />
		</div>

		<!-- Title -->
		<div class="mb-4 flex items-end justify-center gap-2">
			<h1
				class="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-4xl font-medium tracking-tighter text-transparent md:text-5xl"
			>
				Jontrokotha
			</h1>
			<span class="text-lg text-gray-600 md:text-xl">
				by <a
					href="https://sh4jid.me"
					target="_blank"
					rel="noopener noreferrer"
					class="underline hover:text-gray-800">@sh4jid</a
				>
			</span>
		</div>
		<p class="mb-8 text-center text-xl text-gray-600 md:text-2xl">Tales of Coding, AI, and Tech</p>

		<!-- Subtitle -->
		<div class="mx-auto prose prose-lg mb-12">
			<p>
				<!-- 
              The <strong> tag gives the project name strong importance, 
              indicating it's a key term. 
            -->
				<strong>Jontrokotha</strong>, which translates to "Tech Tales," is a social media platform
				dedicated to making technology news accessible to the Bengali speakers.
			</p>

			<p>
				Our page is powered by an automated script that finds, summarizes, and posts news directly
				to our Facebook page. The script will be made open-source soon!
			</p>
		</div>

		<div class="flex flex-col items-center">
			<!-- Facebook Link -->
			<div class="mb-8">
				<a
					href="https://facebook.com/jontrokotha"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 hover:shadow-xl"
				>
					<span class="mr-3">
						<SiFacebook size={24} />
					</span>
					Visit Facebook Page
				</a>
			</div>
			<!-- Privacy Policy Link -->
			<div class="text-sm text-gray-500">
				<a href="/privacy" class="underline hover:text-gray-700">Privacy Policy</a>
			</div>
		</div>
	</div>
</main>
