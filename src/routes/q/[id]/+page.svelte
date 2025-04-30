<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	import Comment from '$lib/components/Comment.svelte';
	import { ndk, ndkReady, user } from '$lib/stores';
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
		if(!$comment) {
			return;
		}
		const commentEvent = new NDKEvent($ndk, {
			kind: 2222,
			content: $comment,
			tags: [['E', data.id]]
		});
		commentEvent.publish();
		comment.set('');
	}

	let comment = writable('');
	let comments = writable([]);
	let question = writable()
	const [kind, pubkey, d] = data.id.split(":")
	const showReactions = writable(false);

	$effect(() => {
		if ($ndkReady) {
			console.log('ndk ready');
			const sub = $ndk.subscribe({ kinds: [2222], '#E': [data.id] });
			sub.on('event', (event) => {
				console.log(event);
				$comments = Array.from(new Set([...$comments, event]));
				console.log(`${event.content}`);
			});

			const questionSub = $ndk.subscribe({ kinds: [Number(kind)],  authors: [pubkey], "#d": [d]		 });
			questionSub.on('event', (event) => {
				$question = event;
				if ($question?.tags.find(t => t[0] === "reactions")[1] === "true") {
				console.log("reactions enabled")
				$showReactions = "true"
			}

							});

		}
	});

	async function startReactions(event) {
		console.log("start reactions", event)
		let updatedEvent = new NDKEvent($ndk, event )
		console.log("updated event", updatedEvent)
		updatedEvent.tags.push(['reactions', "true"])
		await updatedEvent.publishReplaceable();
		console.log("sent!", updatedEvent)
		$showReactions = "true"
	}
</script>


<div class="main-layout mx-auto flex w-3/4 flex-col items-center justify-center">
			{#if $question}
			{#if $question.pubkey === $user.pubkey && $showReactions === false}
			<button class="btn btn-primary mb-4" onclick={() => startReactions($question)}>Reaktionen/Voting aktivieren</button>
			{/if}
				<div class="question mb-4 w-full rounded border p-4 text-xl">
					<h2 class="text-xl font-bold">Frage / Thema:</h2>
					<Markdown {carta} value={$question.content} />
				</div>

				<div class="mb-2 flex w-full flex-col items-center justify-center gap-2">
					<h1 class="text-xl font-bold pt-15">Meine Idee hinzufügen</h1>
					<MarkdownEditor bind:value={$comment} {carta} />
					<button class="btn btn-primary mb-10 mt-5" onclick={() => submitComment()}>Hinzufügen</button>
				</div>
			{:else}
				<p>Loading...</p>
			{/if}

	<div class="mx-auto flex w-full flex-col items-center justify-center gap-5">
		{#key $showReactions}
		{#each $comments.sort((a, b) => a.created_at - b.created_at).reverse() as event}
			<Comment event={event} showReactions={$showReactions}  />
		{/each}
		{/key}
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
