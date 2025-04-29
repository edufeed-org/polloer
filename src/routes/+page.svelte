<script>
	import { goto } from '$app/navigation';
	import { ndk, connected } from '$lib/stores';
	import { NDKEvent, NDKNip07Signer, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
	import { writable } from 'svelte/store';
	import QRCode from 'qrcode';

	let question = '';
	let questionId = '';
	let questionShortId = 0;
	let qrCodeUrl = '';
	let timer = 0;
	let comments = writable([]);
	let votingEnabled = false;
	let sessionId = '';

	async function joinSession() {
		console.log('join ' + questionShortId);
		const filter = {
			kinds: [2222],
			'#d': [questionShortId + ''], // filter by `d` tag
			limit: 1
		};
		const question = await $ndk.fetchEvent(filter);
		goto('/q/' + question.id);
	}
	async function postQuestion() {
		questionShortId = 10000000 + Math.floor(Math.random() * 90000000);
		const event = new NDKEvent($ndk, {
			kind: 1342,
			content: question,
			tags: [['d', questionShortId + '']]
		});
		await event.publish();
		questionId = event.id;
		qrCodeUrl = await QRCode.toDataURL(`${window.location.origin}/q/${questionId}`);
	}

	function startTimer() {
		const interval = setInterval(() => {
			if (timer > 0) {
				timer--;
			} else {
				clearInterval(interval);
				votingEnabled = true;
			}
		}, 1000);
	}

	function login() {
		if (window.nostr) {
			const signer = new NDKNip07Signer();
			$ndk.signer = signer;
		} else {
			const signer = new NDKPrivateKeySigner();
			const privateKey = signer.generatePrivateKey(); // Generates a new private key
			console.log('Generated Private Key:', privateKey);
		}
	}
</script>

<div class="main-layout">
	<button class="btn btn-success" onclick={() => login()}>Login</button>
	{#if !questionId}
		<div class="mx-auto p-4">
			<h1 class="mb-4 text-2xl font-bold">Join a session!</h1>
			{#if $connected}
				<div class="join">
					<input type="number" class="border p-2" placeholder="Session id" bind:value={sessionId} />
					<button class="btn btn-primary rounded" onclick={joinSession}> Join </button>
				</div>
			{/if}
		</div>
		<div class="divider" />
	{/if}
	<div class="mx-auto p-4">
		<h1 class="mb-4 text-2xl font-bold">Ask a Question</h1>

		{#if $connected}
			{#if !questionId}
				<div>
					<textarea
						class="mb-4 w-full rounded border p-2"
						placeholder="Type your question here..."
						bind:value={question}
					></textarea>
					<button class="btn btn-primary rounded" onclick={postQuestion}> Post Question </button>
				</div>
			{/if}

			{#if questionId}
				<div class="qr-share mt-4">
					<h2 class="text-xl font-bold">Share Your Question</h2>
					<img src={qrCodeUrl} alt="QR Code" class="mt-2" />
					<p class="mb-5 text-center">Share this QR code or link:</p>
					<p class="text-center">
						<a href={`/q/${questionId}`}>{`/q/`}<span class="font-bold">{questionShortId}</span></a>
					</p>
					<h3 class="text-center text-xl">{questionShortId}</h3>
					<div class="mt-4">
						<label for="timer" class="mb-2 block">Set Timer (seconds):</label>
						<input type="number" id="timer" class="rounded border p-2" bind:value={timer} />
						<button class="ml-2 rounded bg-green-500 px-4 py-2 text-white" onclick={startTimer}>
							Start Timer
						</button>
					</div>
				</div>
			{/if}

			{#if votingEnabled}
				<div class="mt-4">
					<h2 class="text-xl font-bold">Voting is now enabled!</h2>
					<p>Users can now vote on the question.</p>
				</div>
			{/if}
		{:else}
			<p>Connecting to Nostr relay...</p>
		{/if}
	</div>
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	:root {
		display: grid;
		place-items: center; /* shorthand for both horizontal and vertical centering */
		height: 100%;
	}
	.qr-share img {
		width: 100%;
		border: 3px solid #eee;
		aspect-ratio: 4 / 3;
	}
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
	.main-layout > div {
		width: 100%;
	}
	.divider {
		background-color: #eee;
		height: 1px;
	}
	.join {
		display: flex;
		gap: 10px;
		width: 100%;
	}
	.join input {
		flex-grow: 1;
	}
</style>
