<script lang="ts">
	import { PUBLIC_API_BASE } from '$env/static/public';
	import toast, { Toaster } from 'svelte-5-french-toast';

	import CheckIcon from '@lucide/svelte/icons/check';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import Settings from '@lucide/svelte/icons/settings';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Send from '@lucide/svelte/icons/send';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

	import logo from '$lib/assets/logo.png';

	interface Article {
		title: string;
		url: string;
		score?: number;
		domain: string;
	}

	interface NewsResponse {
		articles: Article[];
		total_count: number;
	}

	let tokenLoaded = $state(false);

	// Initialize bearer token from localStorage
	let bearerToken = $derived.by(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('jontrokotha_bearer_token') || '';
		}
		tokenLoaded = true;
		return '';
	});

	let articles = $state<Article[]>([]);
	let loading = $state(false);
	let newArticleUrl = $state('');
	let publishingStates = $state<Record<string, boolean>>({});
	let showTokenInput = $state(false);
	let tokenInput = $state('');
	let showPassword = $state(false);

	const fetchNews = async () => {
		if (!bearerToken.trim()) {
			toast.error('Bearer token is required');
			return;
		}

		loading = true;

		try {
			const response = await fetch(`${PUBLIC_API_BASE}/news`, {
				headers: {
					Authorization: `Bearer ${bearerToken}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: NewsResponse = await response.json();
			articles = data.articles;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to fetch news');
		} finally {
			loading = false;
		}
	};

	const publishArticle = async (articleUrl: string) => {
		if (!bearerToken.trim()) {
			toast.error('Bearer token is required');
			return;
		}

		publishingStates[articleUrl] = true;

		try {
			const response = await fetch(`${PUBLIC_API_BASE}/publish`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${bearerToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ url: articleUrl })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
			}

			toast.success('Article published successfully!');

			const result = await response.json();

			window.open(`https://www.facebook.com/${result.post_id}`, '_blank');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to publish article');
		} finally {
			publishingStates[articleUrl] = false;
		}
	};

	const publishNewArticle = async () => {
		if (!newArticleUrl.trim()) {
			toast.error('Article URL is required');
			return;
		}

		await publishArticle(newArticleUrl);
		newArticleUrl = '';
	};

	const clearToken = () => {
		bearerToken = '';
		if (typeof window !== 'undefined') {
			localStorage.removeItem('jontrokotha_bearer_token');
		}
		toast.success('Bearer token cleared');
	};

	const toggleTokenInput = () => {
		showTokenInput = !showTokenInput;
		if (showTokenInput) {
			tokenInput = bearerToken;
		}
	};

	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};

	const onSaveToken = (event: Event) => {
		event.preventDefault();
		if (!tokenInput.trim()) {
			toast.error('Bearer token cannot be empty');
			return;
		}
		bearerToken = tokenInput;
		if (typeof window !== 'undefined') {
			localStorage.setItem('jontrokotha_bearer_token', tokenInput);
		}
		toast.success('Bearer token saved successfully!');
		toggleTokenInput();
		tokenInput = '';
	};
</script>

<svelte:head>
	<title>Jontrokotha Studio - News Management Dashboard</title>
	<meta
		name="description"
		content="Manage and publish news articles to Jontrokotha Facebook page. News management dashboard for administrators."
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-6 md:py-12">
	<div class="mx-auto max-w-4xl px-4 md:px-6">
		<!-- Header -->
		<header class="mb-8 text-center">
			<div class="mb-3">
				<img
					src={logo}
					alt="Jontrokotha"
					class="mx-auto h-12 w-12 rounded-lg object-contain md:h-16 md:w-16"
				/>
			</div>
			<h1
				class="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-2xl font-medium tracking-tight text-transparent md:text-3xl"
			>
				Jontrokotha Studio
			</h1>
		</header>

		<!-- API Token Section -->
		<section class="mb-6">
			{#if !bearerToken.trim()}
				<div class="rounded-lg border border-amber-200 bg-amber-50 p-4">
					<div class="flex items-center gap-3">
						<AlertTriangle class="h-5 w-5 text-amber-600" />
						<p class="flex-1 text-sm text-amber-800">Configure your API token to manage articles</p>
						<button
							onclick={toggleTokenInput}
							class="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
						>
							<Settings class="h-4 w-4" />
							Setup
						</button>
					</div>
				</div>
			{:else}
				<div class="rounded-lg border border-green-200 bg-green-50 p-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="rounded-full bg-green-500/20 p-1">
								<CheckIcon class="h-4 w-4 text-green-600" />
							</div>
							<span class="text-sm font-medium text-green-800">Token configured</span>
						</div>
						<div class="flex items-center gap-2">
							<button
								onclick={toggleTokenInput}
								class="inline-flex items-center gap-1 text-xs text-green-700 hover:text-green-800"
							>
								<Settings class="h-3 w-3" />
								Update
							</button>
							<button
								onclick={clearToken}
								class="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
							>
								<Trash2 class="h-3 w-3" />
								Clear
							</button>
						</div>
					</div>
				</div>
			{/if}

			{#if showTokenInput}
				<form
					onsubmit={onSaveToken}
					class="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
				>
					<label for="token" class="mb-2 block text-sm font-medium text-gray-700"
						>Bearer Token</label
					>
					<div class="relative">
						<input
							id="token"
							type={showPassword ? 'text' : 'password'}
							placeholder="Enter your API bearer token"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm transition-colors focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none"
							bind:value={tokenInput}
						/>
						<button
							type="button"
							onclick={togglePasswordVisibility}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
						>
							{#if showPassword}
								<EyeOff class="h-4 w-4" />
							{:else}
								<Eye class="h-4 w-4" />
							{/if}
						</button>
					</div>
					<div class="mt-3 flex justify-end gap-2">
						<button
							type="button"
							onclick={toggleTokenInput}
							class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="rounded-lg bg-purple-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-400"
						>
							Save
						</button>
					</div>
				</form>
			{/if}
		</section>

		<!-- News Articles -->
		<section class="mb-6">
			<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 class="text-lg font-semibold text-gray-800 md:text-xl">Latest Articles</h2>
				<button
					onclick={fetchNews}
					disabled={loading || !bearerToken.trim()}
					class="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"
				>
					<RefreshCw class="h-4 w-4 {loading ? 'animate-spin' : ''}" />
					{loading ? 'Loading...' : 'Refresh'}
				</button>
			</div>

			{#if articles.length === 0 && !loading}
				<div class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
					<p class="text-sm text-gray-500">
						No articles loaded. Click refresh to fetch latest news.
					</p>
				</div>
			{:else}
				<div class="space-y-3">
					{#each articles as article}
						<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
							<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div class="min-w-0 flex-1">
									<h3 class="mb-2 line-clamp-2 text-sm leading-5 font-medium sm:text-base">
										<a
											href={article.url}
											target="_blank"
											rel="noopener noreferrer"
											class="text-blue-600 transition-colors hover:text-blue-800 hover:underline"
										>
											{article.title}
											<ExternalLink class="ml-1 inline h-3 w-3" />
										</a>
									</h3>
									<div class="flex flex-wrap items-center gap-2 text-xs text-gray-600">
										<span class="rounded-full bg-gray-100 px-2 py-1">{article.domain}</span>
										{#if article.score}
											<span class="font-medium">Score: {article.score}</span>
										{/if}
									</div>
								</div>
								<button
									onclick={() => publishArticle(article.url)}
									disabled={publishingStates[article.url] || !bearerToken.trim()}
									class="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400 sm:shrink-0"
								>
									<Send class="h-4 w-4" />
									{publishingStates[article.url] ? 'Publishing...' : 'Publish'}
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Publish New Article -->
		<section class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<div class="mb-3 flex items-center gap-2">
				<Plus class="h-5 w-5 text-gray-600" />
				<h2 class="text-lg font-semibold text-gray-800">Publish New Article</h2>
			</div>
			<div class="flex flex-col gap-3 sm:flex-row">
				<input
					type="url"
					bind:value={newArticleUrl}
					placeholder="Enter article URL to publish"
					class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none"
				/>
				<button
					onclick={publishNewArticle}
					disabled={!newArticleUrl.trim() || !bearerToken.trim()}
					class="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400 sm:shrink-0"
				>
					<Send class="h-4 w-4" />
					Publish
				</button>
			</div>
		</section>
	</div>
</div>

<Toaster />

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}
</style>
