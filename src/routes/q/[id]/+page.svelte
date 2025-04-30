<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	import { onMount } from 'svelte';

	import Comment from '$lib/components/Comment.svelte';
	import { ndk, connected, ndkReady, user } from '$lib/stores';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { writable } from 'svelte/store';
	import { login } from '$lib';

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
	let question = writable()
	const [kind, pubkey, d] = data.id.split(":")
	const showReactions = writable(false);

	$effect(() => {
		if ($ndkReady) {
			console.log('ndk ready');
			const sub = $ndk.subscribe({ kinds: [2222], '#E': [data.id] });
			sub.on('event', (event) => {
				$comments = [...$comments, event];
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
			<button class="btn" onclick={() => startReactions($question)}>Start Reaktionen</button>

				<div class="question mb-4 w-full rounded border p-4 text-xl">
					<h2>Question:<br />{$question.content}</h2>
				</div>

				<div class="mb-2 flex w-full flex-col items-center justify-center gap-2">
					<h1 class="text-xl">Ideensammlung</h1>
					<textarea class="w-full border p-2" bind:value={comment} placeholder="Mein Kommentar"
					></textarea>
					<button class="btn btn-success" onclick={() => submitComment()}>Absenden</button>
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
    .main-layout {
        margin: auto;
        width: 100vw;
        max-width: 600px;
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
