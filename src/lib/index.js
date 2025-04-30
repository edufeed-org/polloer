import { NDKNip07Signer, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { ndk } from "$lib/stores";
import { get } from "svelte/store";

export async function login() {
    if (window.nostr) {
        const signer = new NDKNip07Signer();
        get(ndk).signer = signer;
        signer.user();
    } else {
        console.log("no extension")
        const storedPrivateKey = window.localStorage.getItem('nostrPrivateKey');
        if (storedPrivateKey) {
            const privateKey = JSON.parse(storedPrivateKey);
            console.log("stored private key", privateKey)
            const signer = new NDKPrivateKeySigner(privateKey);
            ndk.update((ndk) => {
                ndk.signer = signer;
                return ndk;
            });
            // get(ndk).signer = signer;
            signer.user();
        } else {
            console.log('No private key found, generating a new one...');
            const privateKey = NDKPrivateKeySigner.generate();
            const signer = new NDKPrivateKeySigner(privateKey.privateKey);
            console.log('Generated Private Key:', privateKey);
            signer.user();
            window.localStorage.setItem('nostrPrivateKey', JSON.stringify(privateKey.privateKey));
            get(ndk).signer = signer;
        }
    }
}
