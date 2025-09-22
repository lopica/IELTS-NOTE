import { useEffect } from "react";
import useStore from "~/lib/store";

export default function useWatch() {
  const { tokenClient } = useStore();
  
  useEffect(() => {
    if (tokenClient) console.log(tokenClient);
    else console.log("no token client");
  }, [tokenClient]);
}
