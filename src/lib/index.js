import { NDKNip07Signer, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { ndk as ndkStore, user as userStore } from "$lib/stores";
import { get } from "svelte/store";

export async function login() {
    let ndk = get(ndkStore)
    let user = get(userStore)
    if (window.nostr) {
        const signer = new NDKNip07Signer();
        ndk.signer = signer;
        const signedUser = await signer.user();
        userStore.set(signedUser)
    } else {
        const storedPrivateKey = window.localStorage.getItem('nostrPrivateKey');
        if (storedPrivateKey) {
            const privateKey = JSON.parse(storedPrivateKey);
            console.log("stored private key", privateKey)
            const signer = new NDKPrivateKeySigner(privateKey);
            ndk.signer = signer;
            const signedUser = await signer.user();
            userStore.set(signedUser)

        } else {
            console.log('No private key found, generating a new one...');
            const privateKey = NDKPrivateKeySigner.generate();
            const signer = new NDKPrivateKeySigner(privateKey.privateKey);
            console.log('Generated Private Key:', privateKey);
            ndk.signer = signer;
            const signedUser = await signer.user();
            userStore.set(signedUser)

            window.localStorage.setItem('nostrPrivateKey', JSON.stringify(privateKey.privateKey));
        }
    }
}
