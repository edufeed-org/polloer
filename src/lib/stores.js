import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { writable, derived } from "svelte/store";
import { NDKUser } from "@nostr-dev-kit/ndk";

export let connected = writable(false);

const _ndk = new NDKSvelte({
  explicitRelayUrls: [
    'wss://relay-rpi.edufeed.org'
  ],
});

export const ndk = writable(_ndk)

export const user = derived(ndk, $ndk => {
  console.log("updating user")
  if ($ndk.signer !== undefined) {
    return new NDKUser($ndk.signer);
  }
  return undefined;
});
