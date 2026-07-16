import { useCallback, useEffect, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import { useAuth } from "../contexts/AuthContext";
import { mapAuthError } from "../lib/authErrors";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = process.env
  .EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string;

if (!GOOGLE_WEB_CLIENT_ID) {
  throw new Error("Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");
}

export function useGoogleSignIn() {
  const { signInWithGoogle } = useAuth();
  const discovery = AuthSession.useAutoDiscovery("https://accounts.google.com");
  const rawNonceRef = useRef(Crypto.randomUUID());
  const [hashedNonce, setHashedNonce] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawNonceRef.current,
    ).then(setHashedNonce);
  }, []);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri: AuthSession.makeRedirectUri(),
      responseType: AuthSession.ResponseType.IdToken,
      usePKCE: false,
      extraParams: hashedNonce ? { nonce: hashedNonce } : {},
    },
    discovery,
  );

  useEffect(() => {
    if (!response) return;

    if (response.type === "success") {
      const idToken = response.params.id_token;
      if (!idToken) return;
      setIsSigningIn(true);
      setError(null);
      signInWithGoogle(idToken, rawNonceRef.current).then((result) => {
        setIsSigningIn(false);
        if (result.error) setError(result.error);
      });
    } else if (response.type === "error") {
      setError(mapAuthError(response.error));
    }
  }, [response, signInWithGoogle]);

  const safePromptAsync = useCallback(async () => {
    try {
      await promptAsync();
    } catch (err) {
      setError(mapAuthError(err));
    }
  }, [promptAsync]);

  return {
    promptAsync: safePromptAsync,
    isReady: !!request && !!hashedNonce,
    isSigningIn,
    error,
    clearError: () => setError(null),
  };
}
