export {};

declare global {
  interface Window {
    google: typeof google;
  }

  namespace google {
    namespace accounts.oauth2 {
      interface TokenClientConfig {
        client_id: string;
        scope: string;
        prompt?: '' | 'none' | 'consent' | 'select_account';
        callback: (response: TokenResponse) => void;
        error_callback?: (error: { type: string; message: string }) => void;
        hint?: string;
        hosted_domain?: string;
        state?: string;
      }

      interface TokenResponse {
        access_token: string;
        expires_in: number;
        hd?: string;
        prompt: string;
        scope: string;
        state?: string;
        token_type: string;
      }

      interface TokenClient {
        requestAccessToken(additionalOptions?: {
          prompt?: '' | 'none' | 'consent' | 'select_account';
          hint?: string;
          state?: string;
        }): void;
      }

      function initTokenClient(config: TokenClientConfig): TokenClient;
    }
  }
}
