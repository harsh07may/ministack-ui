"use client";

import { useEffect, useState } from "react";
import { getEndpoint } from "../lib/ministack-client";

export interface HealthState {
  healthy: boolean;
  version: string;
  endpoint: string;
  services: Record<string, string>;
}

export function useHealth(): HealthState {
  const endpoint = getEndpoint();
  const [state, setState] = useState<HealthState>({
    healthy: false,
    version: "",
    endpoint,
    services: {},
  });

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        const services: Record<string, string> = data.services ?? {};
        const allUp = Object.values(services).every((v) => v === "available");
        setState({
          healthy: allUp,
          version: data.version ?? "",
          endpoint,
          services,
        });
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
