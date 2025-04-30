<script>
	import { goto } from '$app/navigation';
	import { ndk, connected, user } from '$lib/stores';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { writable } from 'svelte/store';
	import QRCode from 'qrcode';
	import { login } from '$lib';
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */
	import DOMPurify from 'dompurify';
	import { Confetti } from 'svelte-confetti';

	// Create a new instance of Carta (you might also want to add a sanitizer if you're processing user input)
	let carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});
	let question = writable('');
	let questionId = writable('');
	let questionShortId = 0;
	let qrCodeUrl = writable('');
	let votingEnabled = false;
	let sessionId = '';
	let event = writable();

	async function joinSession() {
		console.log('join ' + sessionId);
		const filter = {
			kinds: [1342],
			'#d': [sessionId + ''] // filter by `d` tag
		};
		console.log(filter);
		const question = await $ndk.fetchEvent(filter);
		console.log('question', question);
		goto('/q/' + question.id);
		login();
	}
	async function postQuestion() {
		questionShortId = 10000000 + Math.floor(Math.random() * 90000000);
		$event = new NDKEvent($ndk, {
			kind: 30342,
			content: $question,
			tags: [['d', questionShortId + '']]
		});
		await $event.publishReplaceable();
		console.log('event id', $event.id);
		$questionId = `${$event.kind}:${$event.pubkey}:${$event.dTag}`;
		$qrCodeUrl = await QRCode.toDataURL(`${window.location.origin}/q/${$questionId}`, {
			width: 800
		});
	}
</script>

<div class="main-layout">
	<img src="logo.png" alt="" class="logo" />
	{#if $ndk?.signer === undefined}
		<div class="login">
			<button class="btn btn-primary" onclick={login}>Login</button>
		</div>
	{/if}

	{#if !$questionId}
		<div class="mx-auto p-4">
			<h1 class="mb-4 text-2xl font-bold">An einer Ideensammlung teilnehmen</h1>
			{#if $connected}
				<div class="join">
					<input type="number" class="border p-2" placeholder="12345678" bind:value={sessionId} />
					<button class="btn btn-primary rounded" onclick={() => joinSession()}>
						Teilnehmen
					</button>
				</div>
			{/if}
		</div>
		<div class="divider" />
	{/if}
	<div class="mx-auto p-4">
		<h1 class="mb-4 text-2xl font-bold">Eine Ideensammlung starten</h1>
		{#if $connected}
			{#key $questionId}
				{#if $questionId === ''}
					<div class="flex flex-col items-center justify-center">
						<MarkdownEditor bind:value={$question} {carta} />
						<div>
							<button class="btn btn-primary mt-5 rounded" onclick={postQuestion}> Starten </button>
						</div>
					</div>
				{:else}
					<div class="qr-share mt-4">
						<h2 class="text-xl font-bold">Diese Sammlung teilen</h2>
						<h3 class="short-id text-center">{questionShortId}</h3>
						<div class="flex justify-center">
							<Confetti
								amount="600"
								size="15"
								cone
								x={[-4.5, 4.5]}
								y={[-1.5, 1.5]}
								delay={[0, 1000]}
							/>
						</div>
						<img src={$qrCodeUrl} alt="QR Code" class="mt-2" />
						<p class="mb-1 text-center">Diesen QR-Code oder Link teilen:</p>
						<p class="mb-2 text-center text-xl">
							<a href={`/q/${$questionId}`}
								>{`${window.location.origin}/q/`}<span class="font-bold">{questionShortId}</span></a
							>
						</p>
						<!--
					<div class="mt-4">
						<label for="timer" class="mb-2 block">Set Timer (seconds):</label>
						<input type="number" id="timer" class="rounded border p-2" bind:value={timer} />
						<button class="ml-2 rounded bg-green-500 px-4 py-2 text-white" onclick={startTimer}>
							Start Timer
						</button>
					</div>
					-->
					</div>
				{/if}

				{#if votingEnabled}
					<div class="mt-4">
						<h2 class="text-xl font-bold">Abstimmung ist jetzt aktiv!</h2>
						<p>Es können jetzt Stimmen abgegeben werden.</p>
					</div>
				{/if}
			{/key}
		{/if}
	</div>
</div>

<style>
	:global(.carta-input) {
		height: 150px !important;
	}
	:global(.carta-editor) {
		width: 100% !important;
	}
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.short-id {
		font-size: 60px;
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
