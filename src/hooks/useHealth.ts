"use client";

import { useEffect, useState } from "react";
import { getEndpoint } from "../lib/ministack-client";
import { HEALTH_POLL_INTERVAL_MS } from "../lib/service-config";

export interface HealthState {
  healthy: boolean;
  version: string;
  edition: string;
  endpoint: string;
  services: Record<string, string>;
}

export function useHealth(): HealthState {
  const endpoint = getEndpoint();
  const [state, setState] = useState<HealthState>({
    healthy: false,
    version: "",
    edition: "",
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
          edition: data.edition ?? "",
          endpoint,
          services,
        });
      } catch {
        setState((prev) => ({ ...prev, healthy: false }));
      }
    }

    poll();
    const id = setInterval(poll, HEALTH_POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [endpoint]);

  return state;
}
