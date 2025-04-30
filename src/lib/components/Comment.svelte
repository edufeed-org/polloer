<script>
	let { event } = $props();

	import { onMount } from 'svelte';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { ndk, ndkReady, user } from '$lib/stores';
	import { writable } from 'svelte/store';
	import { login } from '$lib';

	let reactions = writable([]);

	async function sendReaction() {
		const reactionEvent = new NDKEvent($ndk, {
			kind: 7,
			content: '👍',
			tags: [['e', event.id]]
		});
		await reactionEvent.publish();
        const r = await $ndk.fetchEvents({kinds: [7], "#e": [event.id]})
        console.log("r", r)
        $reactions = Array.from(r);
	}

	onMount(async () => {
		if (!$user) {
			console.log('no user, logging in');
			login();
		}
        const r = await $ndk.fetchEvents({kinds: [7], "#e": [event.id]})
        console.log("r", r)
        $reactions = Array.from(r);
	});

</script>

<div class="w-full border p-2">
	<p>{event.content}</p>
	<button onclick={() => sendReaction()}>👍</button>
	<p>Reaction Count: {$reactions.length}</p>
</div>
