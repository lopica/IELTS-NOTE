let gapiInstance: typeof gapi | null = null;

export function getGapi(callback?: () => void): typeof gapi {
  if (!gapiInstance) gapiInstance = window.gapi;
  if (!gapiInstance.client) {
    gapiInstance.load("client", () => initializeGapiClient(callback));
  }
  return gapiInstance;
}

async function initializeGapiClient(callback?: () => void) {
  await gapi.client
    .init({
      apiKey: import.meta.env.VITE_API_KEY,
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
      ],
    })
    .catch((error: any) => {
      console.error("Error initializing gapi client", error);
    });

  if (callback) callback();
}
