import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { getGapi } from "~/lib/GAPI";
import useStore from "~/lib/store";

export default function useGuard() {
  const { isAuthenticated, setIsAuthenticated, isGapiLoaded } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const gapiRef = useRef<typeof gapi>(null);

  useEffect(() => {
    if (isGapiLoaded) {
      gapiRef.current = getGapi();
    }
  }, [isGapiLoaded]);

  useEffect(() => {
    if (!isGapiLoaded || gapiRef.current === null) return;
    const token = localStorage.getItem("access_token");
    const expiresIn = localStorage.getItem("expires_in");
    
    const isTokenValid =
      token && expiresIn && (Number(JSON.parse(expiresIn)) > Date.now());
    if (isTokenValid) {
      if (!isAuthenticated) setIsAuthenticated(true);
      if (location.pathname === "/") navigate("/list");
      gapiRef.current.client.setToken({ access_token: token });
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_in");
      if (isAuthenticated) setIsAuthenticated(false);
      if (location.pathname !== "/") {
        toast.error("Please sign in to continue");
        navigate("/");
      }
    }
  }, [
    isAuthenticated,
    location.pathname,
    navigate,
    setIsAuthenticated,
    isGapiLoaded,
  ]);
}
