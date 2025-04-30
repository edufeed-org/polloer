<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	import Comment from '$lib/components/Comment.svelte';
	import { ndk, connected, ndkReady } from '$lib/stores';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { writable } from 'svelte/store';

	function submitComment() {
		const commentEvent = new NDKEvent($ndk, {
			kind: 2222,
			content: comment,
			tags: [['E', data.id]]
		});
		commentEvent.publish();
	}

	let comment = '';
	let comments = writable([]);
	let question = writable('');

	$effect(() => {
		if ($ndkReady) {
			const sub = $ndk.subscribe({ kinds: [2222], '#E': [data.id] });
			sub.on('event', (event) => {
				$comments = [...$comments, event];
				console.log(`${event.content}`);
			});
		}
	});
</script>

<div class="mx-auto flex flex-col items-center justify-center w-3/4">
	{#await $ndk.fetchEvent(data.id) then question}
		{#if question}
			<div class="mb-4 w-full rounded border p-2">
				<h2>Question: {question.content}</h2>
			</div>

			<div class="w-full flex flex-col items-center justify-center gap-2 mb-2">
				<h1 class="text-xl">Ideensammlung</h1>
				<textarea class="w-full border" bind:value={comment} placeholder="Mein Kommentar"></textarea>
				<button class="btn btn-success" onclick={() => submitComment()}>Absenden</button>
			</div>
		{:else}
			<p>Loading...</p>
		{/if}
	{:catch error}
		<p>Error fetching question: {error.message}</p>
	{/await}

	<div class="mx-auto flex w-full flex-col items-center justify-center gap-2">
		{#each $comments as event}
			<Comment {event} />
		{/each}
	</div>
</div>
