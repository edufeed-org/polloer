<script>
	let { event, showReactions } = $props();

	import { onMount } from 'svelte';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { ndk } from '$lib/stores';
	import { writable } from 'svelte/store';
	import { Carta, Markdown, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */
	import DOMPurify from 'dompurify';
	import { Confetti } from 'svelte-confetti';

	console.log('show reactions', showReactions, event);

	// Create a new instance of Carta (you might also want to add a sanitizer if you're processing user input)
	let carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});
	let reactions = writable([]);
	let reacted = writable(window.localStorage.getItem(event.id));
	let reaction = writable({});
	let clicked = writable(false);

	async function sendReaction() {
		const reactionEvent = new NDKEvent($ndk, {
			kind: 7,
			content: '👍',
			tags: [['e', event.id]]
		});
		await reactionEvent.publish();
		$reaction = reactionEvent;
		const r = await $ndk.fetchEvents({ kinds: [7], '#e': [event.id] });
		console.log('r', r);
		$reactions = Array.from(r);
		window.localStorage.setItem(event.id, 'true');
		$reacted = 'true';
		$clicked = true;
	}

	async function deleteVote() {
		const deletionEvent = new NDKEvent($ndk, {
			kind: 5,
			content: 'User deleted vote',
			tags: [
				['e', event.id],
				['k', 7]
			]
		});
		await deletionEvent.publish();
		window.localStorage.removeItem(event.id);
		$reacted = 'false';
	}

	onMount(async () => {
		const r = await $ndk.fetchEvents({ kinds: [7], '#e': [event.id] });
		$reactions = Array.from(r);
	});
</script>

<div class="comment w-full border p-2">
	{#key event.content}
		<Markdown {carta} value={event.content} />
	{/key}

	<div class="reactions flex gap-2">
		{#if $reacted}
			<span>👍 {$reactions.length}</span>
			<span class="thanks">Danke für deinen Vote!</span>
			<!-- <button onclick={() => deleteVote()} class="btn">Vote zurückziehen</button> -->
		{:else if showReactions === 'true'}
			<button onclick={() => sendReaction()} class="like">👍</button>
			<span>{$reactions.length}</span>
		{/if}
		{#if $clicked}
			<Confetti />
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
