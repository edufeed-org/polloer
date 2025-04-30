<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	import Comment from '$lib/components/Comment.svelte';
	import { ndk, ndkReady } from '$lib/stores';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { writable } from 'svelte/store';
	import { Carta, Markdown, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */
	import DOMPurify from 'dompurify';

	// Create a new instance of Carta (you might also want to add a sanitizer if you're processing user input)
	let carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});
	function submitComment() {
		const commentEvent = new NDKEvent($ndk, {
			kind: 2222,
			content: $comment,
			tags: [['E', data.id]]
		});
		commentEvent.publish();
	}

	let comment = writable('');
	let comments = writable([]);

	$effect(() => {
		if ($ndkReady) {
			console.log('ndk ready');
			const sub = $ndk.subscribe({ kinds: [2222], '#E': [data.id] });
			sub.on('event', (event) => {
				$comments = [...$comments, event];
				console.log(`${event.content}`);
			});
		}
	});
</script>

<div class="main-layout mx-auto flex w-3/4 flex-col items-center justify-center">
	{#key $ndkReady}
		{#await $ndk.fetchEvent(data.id) then question}
			{#if question}
				<div class="question mb-4 w-full rounded border p-4 text-xl">
					<h2>Question:<br />
						<Markdown {carta} value={question.content} />
				</h2>
				</div>

				<div class="mb-2 flex w-full flex-col items-center justify-center gap-2">
					<h1 class="text-xl">Ideensammlung</h1>
					<MarkdownEditor bind:value={$comment} {carta} />
					<button class="btn btn-primary mb-10" onclick={() => submitComment()}>Absenden</button>
				</div>
			{:else}
				<p>Loading...</p>
			{/if}
		{:catch error}
			<p>Error fetching question: {error.message}</p>
		{/await}
	{/key}

	<div class="mx-auto flex w-full flex-col items-center justify-center gap-5">
		{#each $comments.sort((a, b) => a.created_at - b.created_at).reverse() as event}
			<Comment {event} />
		{/each}
	</div>
</div>

<style>
    :global(.carta-input) {
        height: 100px !important;
    }
    :global(.carta-editor) {
        width: 100% !important;
    }
    .main-layout {
				padding: 30px;
        margin: auto;
        width: 100vw;
        max-width: 700px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 5%;
        height: 100%;
    }
		.question {
				border-radius: 20px;
				border-color: #ccc;
		}
</style>
