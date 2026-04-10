"use client";

import { useEffect, useState } from "react";
import { getEndpoint } from "../lib/ministack-client";

export interface HealthState {
  healthy: boolean;
  version: string;
  endpoint: string;
}

export function useHealth(): HealthState {
  const endpoint = getEndpoint();
  const [state, setState] = useState<HealthState>({
    healthy: false,
    version: "",
    endpoint,
  });

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch(`${endpoint}/_ministack/health`);
        const data = await res.json();
        const allUp = Object.values(data.services ?? {}).every(
          (v) => v === "available",
        );
        setState({ healthy: allUp, version: data.version ?? "", endpoint });
      } catch {
        setState((prev) => ({ ...prev, healthy: false }));
      }
    }

    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [endpoint]);

  return state;
}
