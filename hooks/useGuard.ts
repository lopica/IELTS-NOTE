import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useStore from "~/lib/store";

export default function useGuard() {
  const { gapi } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gapi) return;
    if (!gapi.client) {
      navigate("/");
      toast.error("Timeout! Please login.");
      return;
    }
    const token = gapi.client.getToken();
    if (!token) {
      navigate("/");
      toast.error("Timeout! Please login.");
      return;
    }
  }, [gapi]);

}
