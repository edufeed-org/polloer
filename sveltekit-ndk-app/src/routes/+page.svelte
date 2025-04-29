<script>
	import { onMount } from 'svelte';
	import NDKSvelte from '@nostr-dev-kit/ndk-svelte';
	import { writable, derived } from 'svelte/store';

	const ndk = new NDKSvelte({
		explicitRelayUrls: ['wss://relay-rpi.edufeed.org']
	});

	const connected = writable(false);
	let events = writable([]);
	let liascriptEvents = writable([]);
	const count = derived(events, ($events) => $events.length);

	onMount(async () => {
		try {
			await ndk.connect();
			connected.set(true);

			events = ndk.storeSubscribe({ kinds: [30142] }, { closeOnEose: false });
			liascriptEvents = ndk.storeSubscribe({ kinds: [30143] }, { closeOnEose: false });

			console.log('Subscription created and store initialized');
		} catch (error) {
			console.error('Error connecting to Nostr relay:', error);
		}
	});
</script>

{#if $connected}
	<p class="status connected">Connected to Nostr relay</p>
{:else}
	<p class="status connecting">Connecting to Nostr relay...</p>
{/if}

<h1>Nostr Events</h1>
<p>
	{$count} events seen
</p>

{#if $events && $events.length > 0}
	<h2>Recent events</h2>
	<ul>
		{#each $events as event}
			<li>
				Event ID: {event.id.substring(0, 8)}...
				{#if event.content}
					<p>Content: {event.content}</p>
				{/if}
			</li>
		{/each}
	</ul>
{:else}
	<p>No events received yet. Waiting for events...</p>
{/if}

<style>
	.status {
		padding: 8px;
		border-radius: 4px;
		margin-bottom: 16px;
	}
	.connecting {
		background-color: #fff3cd;
		color: #856404;
	}
	.connected {
		background-color: #d4edda;
		color: #155724;
	}
	h1 {
		margin-bottom: 16px;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		border: 1px solid #eee;
		padding: 12px;
		margin-bottom: 8px;
		border-radius: 4px;
	}
</style>