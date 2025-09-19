import { useEffect, useRef } from "react";
import { getGapi } from "~/lib/GAPI";
import { getTokenClient } from "~/lib/GSI";
import useStore from "~/lib/store";

export default function useLogin() {
    const tokenClient = useRef<google.accounts.oauth2.TokenClient>(null);
  const gapiRef = useRef<typeof gapi>(null);
  const { isGapiLoaded, isGoogleLoaded, setIsAuthenticated, setIsGapiLoaded } = useStore();

  async function handleAuthClick() {
    if (tokenClient.current && gapiRef.current) {
      if (gapiRef.current.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.current.requestAccessToken({ prompt: "consent" });
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.current.requestAccessToken({ prompt: "" });
      }
    }
  }

  useEffect(() => {
    if (isGoogleLoaded) {
      tokenClient.current = getTokenClient(() => setIsAuthenticated(true));
    }
  }, [isGoogleLoaded]);

  useEffect(() => {
    if (isGapiLoaded) {
      gapiRef.current = getGapi();
    }
  }, [isGapiLoaded]);

  return { handleAuthClick };
}
