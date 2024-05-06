import { DEFAULT_SESSION_NAMES } from "@/constants";
import { useEffect, useState } from "react";

export const useSession = () => {
    const [sessionName, setSessionName] = useState(null)
    const sessionIdleTimeoutMins = '40'
    useEffect(() => {
        const defaultSessionName =
        DEFAULT_SESSION_NAMES[
          Math.floor(Math.random() * DEFAULT_SESSION_NAMES.length)
        ] +
        '-' +
        Math.floor(Math.random() * 1000);
      setSessionName(defaultSessionName.trim());
    },[])

    return {sessionName, sessionIdleTimeoutMins}
}