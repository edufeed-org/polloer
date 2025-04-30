<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { ndk, connected } from '$lib/stores';
	import { browser } from '$app/environment';
	import { login } from '$lib';

	let { children } = $props();

	onMount(async () => {
		if (browser) {
			try {
				await login()
				await $ndk.connect();
				console.log('NDK initialized successfully');
				connected.set(true);
			} catch (error) {
				console.error('Failed to initialize NDK:', error);
			}
		}
	});
</script>

{@render children()}
