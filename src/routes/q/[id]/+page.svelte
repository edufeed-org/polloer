<script>
	import { onDestroy } from 'svelte';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	import Comment from '$lib/components/Comment.svelte';
	import { ndk, user } from '$lib/stores';
	import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
	import { derived, writable } from 'svelte/store';
	import { Carta, Markdown, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */
	import DOMPurify from 'dompurify';

	// Create a new instance of Carta (you might also want to add a sanitizer if you're processing user input)
	let carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	function submitComment() {
		if (!$comment) {
			return;
		}
		submit.set(true);
		const commentEvent = new NDKEvent($ndk, {
			kind: 2222,
			content: $comment,
			tags: [['A', data.id]]
		});
		commentEvent.publish();
		comment.set('');
	}

	let comment = writable('');
	let submit = writable(false);
	const [kind, pubkey, d] = data.id.split(':');
	const showReactions = writable('false');
	const comments = writable([]);

	let commentStore = $ndk.storeSubscribe(
		{ kinds: [2222], '#A': [data.id] },
		{
			onEvent: (event) => {
				console.log('Event received', event);
				$comments = [event, ...$comments];
			},
			onEose: () => console.log('Subscription EOSE reached'),
			closeOnEose: false,
			autoStart: true
		}
	);
	commentStore.ref();

	let questionStore = $ndk.storeSubscribe({ kinds: [Number(kind)], authors: [pubkey], '#d': [d] });
	questionStore.ref();

	let question = derived(
		[questionStore],
		([$questionStore]) => {
			if ($questionStore.length === 0) {
				return null;
			}

			$questionStore.sort((a, b) => {
				return b.created_at - a.created_at;
			});
			const reactionTag = $questionStore[0].tags.find((t) => t[0] === 'reactions');
			if (reactionTag && reactionTag[1] === 'true') {
				console.log('reactions enabled');
				$showReactions = 'true';
			}
			console.log('question', $questionStore[0]);
			return $questionStore[0];
		},
		null
	);

	onDestroy(() => {
		commentStore.unsubscribe();
		questionStore.unsubscribe();
	});

	$effect(() => {
		if ($ndk.signer) {
			console.log('got a signer');
			console.log('start subscription');
			commentStore.startSubscription();

			questionStore.startSubscription();
			console.log('comment store', $commentStore);
		}
		console.log('user', $user);
	});

	async function startReactions(event) {
		console.log('start reactions', event);
		let updatedEvent = new NDKEvent($ndk, event);
		console.log('updated event', updatedEvent);
		updatedEvent.tags.push(['reactions', 'true']);
		await updatedEvent.publishReplaceable();
		console.log('sent!', updatedEvent);
		$showReactions = 'true';
	}
</script>

<div class="main-layout mx-auto flex w-3/4 flex-col items-center justify-center">
	{#key $question?.pubkey}
		{#if $question}
			{#if $user && $question?.pubkey === $user?.pubkey && $showReactions === "false"}
				<button class="btn btn-primary mb-4" onclick={() => startReactions($question)}
					>Reaktionen/Voting aktivieren</button
				>
			{/if}
			<div class="question mb-4 w-full rounded border p-4 text-xl">
				<h2 class="text-xl font-bold">Frage / Thema:</h2>
				<Markdown {carta} value={$question.content} />
			</div>

			<div class="mb-2 flex w-full flex-col items-center justify-center gap-2">
				<h1 class="pt-15 text-xl font-bold">Meine Idee hinzufügen</h1>
				<MarkdownEditor bind:value={$comment} {carta} />
				<button class="btn btn-primary mt-5 mb-10" onclick={() => submitComment()}
					>Hinzufügen</button
				>
			</div>
		{:else}
			<p>Loading...</p>
		{/if}
	{/key}

	<div class="mx-auto flex w-full flex-col items-center justify-center gap-5">
		{#each $commentStore as event}
			<Comment {event} showReactions={$showReactions} />
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
