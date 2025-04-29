<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
	import NDKSvelte from '@nostr-dev-kit/ndk-svelte/svelte5';
	import { ndk, connected, initializeNDK } from '$lib/stores';
	import { browser } from '$app/environment';

	let { children } = $props();

	onMount(async () => {
		const nip07signer = new NDKNip07Signer();
		if (browser) {
      try {
        await initializeNDK();
        console.log('NDK initialized successfully');
		connected.set(true);

      } catch (error) {
        console.error('Failed to initialize NDK:', error);
      }
    }
		
	});
</script>

{@render children()}
