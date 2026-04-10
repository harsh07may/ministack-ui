"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearch } from "../contexts/search";
import { useHealth } from "../hooks/useHealth";
import {
  FETCH_COUNT_TIMEOUT_MS,
  SERVICES,
  type ServiceDef,
} from "../lib/service-config";

function extractPort(endpoint: string): string {
  try {
    return new URL(endpoint).port || "80";
  } catch {
    return "4566";
  }
}

export default function DashboardPage() {
  const { healthy, version, edition, endpoint, services } = useHealth();
  const { query } = useSearch();
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  const visibleServices: ServiceDef[] = query
    ? SERVICES.filter(
        (svc) =>
          svc.label.toLowerCase().includes(query.toLowerCase()) ||
          svc.noun.toLowerCase().includes(query.toLowerCase()),
      )
    : SERVICES;

  useEffect(() => {
    for (const svc of SERVICES) {
      const fetchWithTimeout = Promise.race([
        svc.fetchCount(),
        new Promise<number>((_, reject) =>
          setTimeout(
            () => reject(new Error("timeout")),
            FETCH_COUNT_TIMEOUT_MS,
          ),
        ),
      ]);
      fetchWithTimeout
        .then((n) => setCounts((prev) => ({ ...prev, [svc.key]: n })))
        .catch(() => setCounts((prev) => ({ ...prev, [svc.key]: null })));
    }
  }, []);

  const port = extractPort(endpoint);

  const stats = [
    { label: "Port", value: port },
    { label: "Edition", value: edition || "—" },
    { label: "Engine", value: version ? `v${version}` : "—" },
    {
      label: "Status",
      value: healthy ? "Healthy" : "Degraded",
      green: healthy,
    },
  ];

  return (
    <main className="py-8 px-12">
      {/* Page header + inline stats */}
      <div className="flex items-start justify-between gap-8 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">System Overview</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Infrastructure health and resource allocation.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 mt-1 p-2 bg-zinc-900/60">
          {stats.map(({ label, value, green }) => (
            <div
              key={label}
              className="border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-center min-w-20"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1">
                {label}
              </p>
              <p
                className={`text-sm font-semibold ${green ? "text-green-400" : "text-zinc-100"}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-3 gap-10">
        {visibleServices.map((svc) => {
          const running = services[svc.key] === "available";
          const count = counts[svc.key];

          return (
            <Link
              key={svc.key}
              href={svc.href}
              className="group flex flex-col bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-md overflow-hidden"
            >
              {/* Icon tile + name + status stacked */}
              <div className="flex gap-4 p-5">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                  <Image
                    src={svc.iconPath}
                    alt=""
                    width={22}
                    height={22}
                    unoptimized
                  />
                </div>
                <div className="pt-0.5">
                  <p className="font-sans font-semibold text-zinc-100 leading-tight">
                    {svc.label}
                  </p>
                  <span
                    className={`flex items-center gap-1.5 mt-1 text-[10px] font-medium uppercase tracking-wider ${
                      running ? "text-green-400" : "text-zinc-500"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${running ? "bg-green-400" : "bg-zinc-600"}`}
                    />
                    {running ? "Running" : "Idle"}
                  </span>
                </div>
              </div>

              {/* Metric row */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800/60">
                <span className="text-sm text-zinc-500">{svc.noun}</span>
                <span className="text-sm font-semibold text-zinc-100">
                  {count === undefined ? "…" : count === null ? "—" : count}
                </span>
              </div>

              {/* CTA — contained button, not full-width */}
              <div className="px-5 pb-5">
                <div className="py-3 bg-zinc-800 group-hover:bg-zinc-700/80 transition-colors text-center rounded-lg">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    Explore {svc.label}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
