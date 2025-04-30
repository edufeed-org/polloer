<script>
	import { goto } from '$app/navigation';
	import { ndk, connected, user, ndkReady } from '$lib/stores';
	import { NDKEvent, NDKNip07Signer, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
	import { writable } from 'svelte/store';
	import QRCode from 'qrcode';
	import { login } from '$lib';

	let question = '';
	let questionId = writable(''); ;
	let questionShortId = 0;
	let qrCodeUrl = writable('');
	let timer = 0;
	let votingEnabled = false;
	let sessionId = '';
	let event = writable();

	async function joinSession() {
		console.log('join ' + sessionId);
		const filter = {
			kinds: [1342],
			'#d': [sessionId + ''], // filter by `d` tag
		};
		console.log(filter)
		const question = await $ndk.fetchEvent(filter);
		console.log('question', question);
		goto('/q/' + question.id);
		login()
	}
	async function postQuestion() {
		questionShortId = 10000000 + Math.floor(Math.random() * 90000000);
		$event = new NDKEvent($ndk, {
			kind: 30342,
			content: question,
			tags: [['d', questionShortId + '']]
		});
		await $event.publishReplaceable();
		console.log("event id", $event.id)
		$questionId = `${$event.kind}:${$event.pubkey}:${$event.dTag}`;
		$qrCodeUrl = await QRCode.toDataURL(`${window.location.origin}/q/${$questionId}`, {
			width: 800,
		});
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
	
	$effect(() => {
		if ($ndkReady) {
			if ($ndk.activeUser) {
				console.log('User:', $user);
			} else {
				login();
			}
		}
	});
</script>

<div class="main-layout">
    <img src="logo.png" alt="" class="logo">
	{#if !$user}
		<div class="login"><button class="btn btn-primary" onclick={() => login()}>Login</button></div>
	{/if}

	{#if !$questionId}
		<div class="mx-auto p-4">
			<h1 class="mb-4 text-2xl font-bold">Join a session!</h1>
			{#if $connected}
				<div class="join">
					<input type="number" class="border p-2" placeholder="Session id" bind:value={sessionId} />
					<button class="btn btn-primary rounded" onclick={() => joinSession()}> Join </button>
				</div>
			{/if}
		</div>
		<div class="divider" />
	{/if}
	<div class="mx-auto p-4">
		<h1 class="mb-4 text-2xl font-bold">Ask a Question</h1>

		{#if $connected}
		{#key $questionId}
			{#if $questionId === ''}
				<div>
					<textarea
						class="mb-4 w-full rounded border p-2"
						placeholder="Type your question here..."
						bind:value={question}
					></textarea>
					<button class="btn btn-primary rounded" onclick={postQuestion}> Post Question </button>
				</div>
			{:else}
				<div class="qr-share mt-4">
					<h2 class="text-xl font-bold">Share Your Question</h2>
					<img src={$qrCodeUrl} alt="QR Code" class="mt-2" />
					<p class="mb-5 text-center">Share this QR code or link:</p>
					<p class="text-center">
						<a href={`/q/${$questionId}`}>{`/q/`}<span class="font-bold">{questionShortId}</span></a>
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
		{/key}
		{/if}
	</div>
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.qr-share img {
		width: 100%;
		border: 3px solid #eee;
	}
	.login {
      display: flex;
      justify-content: center;
	}
	.logo {
			display: flex;
			margin: 0 auto;
	    max-width: 250px;
			border-radius: 50%;
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
