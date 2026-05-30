    // src/googleAuth.ts
    import { signInWithPopup, getRedirectResult } from "firebase/auth";
    import { auth, googleProvider } from "./firebase";

    export async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
    }

    export async function getGoogleRedirectResult() {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    return result.user;
    }