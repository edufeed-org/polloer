<script>
	let { event } = $props();

	import { onMount } from 'svelte';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { ndk, ndkReady, user } from '$lib/stores';
	import { writable } from 'svelte/store';
	import { login } from '$lib';

	let reactions = writable([]);
	let reacted = writable(window.localStorage.getItem(event.id));

	async function sendReaction() {
		const reactionEvent = new NDKEvent($ndk, {
			kind: 7,
			content: '👍',
			tags: [['e', event.id]]
		});
		await reactionEvent.publish();
		const r = await $ndk.fetchEvents({ kinds: [7], '#e': [event.id] });
		console.log('r', r);
		$reactions = Array.from(r);
		window.localStorage.setItem(event.id, 'true');
		$reacted = true;
	}

    async function deleteVote() {
        const deletionEvent = new NDKEvent($ndk, {
            kind: 5,
            content: "User deleted vote",
            tags: [
                ["e", event.id],
                ["k", 7]
            ]
        })
        await deletionEvent.publish()
        window.localStorage.removeItem(event.id)
        $reacted = false
    }

	onMount(async () => {
		if (!$user) {
			console.log('no user, logging in');
			login();
		}
		const r = await $ndk.fetchEvents({ kinds: [7], '#e': [event.id] });
		console.log('r', r);
		$reactions = Array.from(r);
	});
</script>

<div class="comment w-full border p-2">
	<p>{event.content}</p>
	<div class="flex gap-2 reactions">
		{#if $reacted}
			<span>👍 {$reactions.length}</span>
			<span class="thanks">Danke für deinen Vote!</span>
            <button onclick={() => deleteVote()} class="btn">Vote zurückziehen</button>
		{:else}
			<button onclick={() => sendReaction()} class="like">👍</button>
			<span>{$reactions.length}</span>
		{/if}
	</div>
</div>
<style>
		.like {
				cursor: pointer;
		}
		.reactions {
				padding-top: 10px;
				align-items: center;
		}
		.thanks {
				color: #777;
		}
	.comment {
      border-radius: 20px;
      border-color: #ccc;
	}
</style>
