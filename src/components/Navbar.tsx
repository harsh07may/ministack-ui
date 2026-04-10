"use client";

import { useHealth } from "../hooks/useHealth";

export default function Navbar() {
  const { healthy, version, endpoint } = useHealth();

  return (
    <header className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
      <span
        className={`w-2 h-2 rounded-full ${healthy ? "bg-green-400" : "bg-red-500"}`}
        title={
          healthy
            ? "All services available"
            : "One or more services unavailable"
        }
      />
      <span className="text-sm font-mono text-zinc-300">{endpoint}</span>
      {version && (
        <span className="ml-auto text-xs text-zinc-500">{version}</span>
      )}
    </header>
  );
}
