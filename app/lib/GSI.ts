import type { GoogleTokenResponse } from "types/google-response";

export function getTokenClient(callback: () => void): google.accounts.oauth2.TokenClient {
  let tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_CLIENT_ID,
    scope:
      "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
    callback: (tokenResponse: GoogleTokenResponse) => {
      localStorage.setItem(
        "access_token",
        JSON.stringify(tokenResponse.access_token)
      );
      localStorage.setItem(
        "expires_in",
        JSON.stringify(new Date().getTime() + tokenResponse.expires_in * 1000)
      );
      callback()
    },
  });
  return tokenClient;
}
