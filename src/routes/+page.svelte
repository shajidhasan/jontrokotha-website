<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import { SiFacebook } from '@icons-pack/svelte-simple-icons';
</script>

<svelte:head>
	<title>যন্ত্রকথা - কোডিং, এআই ও প্রযুক্তির গল্প</title>
	<meta
		name="description"
		content="কোডিং, এআই আর টেক দুনিয়ার সব নতুন খবর এখন আমাদের ফেসবুক পেজে!"
	/>
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="mx-auto max-w-2xl px-6 text-center">
		<!-- Logo -->
		<div class="mb-8">
			<img src={logo} alt="যন্ত্রকথা" class="mx-auto h-24 w-24 rounded-xl object-contain" />
		</div>

		<!-- Title -->
		<h1
			class="mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
		>
			যন্ত্রকথা
		</h1>
		<p class="mb-8 text-xl text-gray-600 md:text-2xl">কোডিং, এআই ও প্রযুক্তির গল্প</p>

		<!-- Subtitle -->
		<div class="mx-auto prose prose-lg mb-12">
			<p class="font-serif leading-relaxed text-balance text-gray-700">
				কোডিং, এআই আর টেক দুনিয়ার সব নতুন খবর এখন আমাদের ফেসবুক পেজে! আপনিও যদি প্রযুক্তি
				ভালোবাসেন, থাকুন যন্ত্রগল্পের সাথে।
			</p>
		</div>

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
				আমাদের ফেসবুক পেজে যান
			</a>
		</div>

		<!-- Privacy Policy Link -->
		<div class="text-sm text-gray-500">
			<a href="/privacy" class="underline hover:text-gray-700">Privacy Policy</a>
		</div>
	</div>
</main>
