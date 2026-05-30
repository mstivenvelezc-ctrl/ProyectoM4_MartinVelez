    // src/googleAuth.ts — maneja auth de Google con redirect en producción
    import {
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    } from "firebase/auth";
    import { auth, googleProvider } from "./firebase";

    const esProduccion = import.meta.env.PROD;

    export async function signInWithGoogle() {
    if (esProduccion) {
        await signInWithRedirect(auth, googleProvider);
        return null; // el resultado llega en getGoogleRedirectResult
    } else {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    }
    }

    export async function getGoogleRedirectResult() {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    return result.user;
    }