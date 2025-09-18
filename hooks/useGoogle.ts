import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useStore from "~/lib/store";

export default function useGoogle() {
  const { tokenClient, setTokenClient, gapi, setGapi, google, setGoogle } =
    useStore();
    const navigate = useNavigate();

  function initializeGapiClient() {
    gapi.client
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
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("gapi script loaded");
      setGapi(window.gapi);
    };

    script.onerror = () => {
      console.error("Failed to load gapi script");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("gsi script loaded");
      setGoogle(window.google);
    };

    script.onerror = () => {
      console.error("Failed to load gsi script");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (gapi) {
      gapi.load("client", initializeGapiClient);
    }
  }, [gapi]);

  useEffect(() => {
    if (google) {
      setTokenClient(
        google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_CLIENT_ID,
          scope:
            "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
          callback: (tokenResponse: any) => {
            if (tokenResponse.error) {
              toast.error('Something went wrong, please try again later');
              return
            }
            toast.success('Login successfully')
            navigate('/list')
          },
        })
      );
    }
  }, [google]);

}
