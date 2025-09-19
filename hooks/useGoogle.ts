import { useEffect } from "react";
import { getGapi } from "~/lib/GAPI";
import useStore from "~/lib/store";

export default function useGoogle() {
  const { setIsGapiLoaded, setIsGoogleLoaded } = useStore();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("gapi script loaded");
      getGapi(() => setIsGapiLoaded(true));
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
      setIsGoogleLoaded(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load gsi script");
    };
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
}
