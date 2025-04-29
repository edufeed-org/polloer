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
			tags: [["E", data.id]]
		});
		commentEvent.publish();
	}

	let comment = ""
	let comments = writable([]);
	let question = writable("")

	$effect(() => {
		if ($ndkReady) {
			const sub = $ndk.subscribe({ kinds: [2222], "#E": [data.id] });
			sub.on('event', (event) => {
				$comments = [...$comments, event];
				console.log(`${event.content}`);
			});
		}
	});
</script>

<div class="w-full flex flex-col justify-center mx-auto items-center">
	
<h1 class="">Identifier: {data.id}</h1>
<div>{@html data.id}</div>

{#await $ndk.fetchEvent(data.id) then question}
	{#if question}
		<div class="mb-4 w-full rounded border p-2">
			<h2>Question: {question.content}</h2>
			<p>Tags: {question.tags}</p>
			<p>Created At: {new Date(question.created_at * 1000).toLocaleString()}</p>
		</div>
		<div>
			<h1 class="text-xl">Ideensammlung</h1>
			<textarea bind:value={comment} placeholder="Mein Kommentar"></textarea>
			<button class="btn btn-error" onclick={() => submitComment()}>Absenden</button>
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
{:catch error}
	<p>Error fetching question: {error.message}</p>
{/await}

{#each $comments as event}
	<Comment {event} />
{/each}


</div>
