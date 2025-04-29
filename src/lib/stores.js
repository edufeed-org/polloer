import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { writable, derived } from "svelte/store";
import { NDKNip07Signer } from "@nostr-dev-kit/ndk";

export let connected = writable(false);

export const ndk = writable(new NDKSvelte);

export const ndkReady = derived(ndk, $ndk => $ndk !== null);

export async function initializeNDK() {
    const signer = new NDKNip07Signer
  const ndkInstance = new NDKSvelte({
    explicitRelayUrls: [
      'wss://relay-rpi.edufeed.org'
    ],
  });
  
  await ndkInstance.connect();

//   ndkInstance.signer = signer;
  ndk.set(ndkInstance);
  
  return ndkInstance;
}