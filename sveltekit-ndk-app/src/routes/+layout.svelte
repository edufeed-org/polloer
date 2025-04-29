<!-- filepath: /sveltekit-ndk-app/sveltekit-ndk-app/src/routes/+layout.svelte -->
<script>
	export let segment;
</script>

<div class="min-h-screen flex flex-col">
	<header class="bg-blue-600 text-white p-4">
		<h1 class="text-xl">Nostr Event App</h1>
	</header>

	<main class="flex-grow p-4">
		<slot />
	</main>

	<footer class="bg-gray-800 text-white p-4 text-center">
		<p>&copy; 2023 Nostr Event App</p>
	</footer>
</div>

<style>
	/* Additional styles can be added here */
</style>