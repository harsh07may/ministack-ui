"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import ResourceTable from "../../../components/ResourceTable";
import { isServiceKey, SERVICE_CONFIG } from "../../../lib/service-config";

export default function ResourcePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = use(params);
  const config = isServiceKey(service) ? SERVICE_CONFIG[service] : null;

  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(config !== null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    setError(null);
    try {
      setRows(await config.fetchRows());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load resources");
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    if (!config) {
      notFound();
    } else {
      load();
    }
  }, [config, load]);

  const filteredRows = useMemo(
    () =>
      search
        ? rows.filter((row) =>
            Object.values(row).some((v) =>
              v.toLowerCase().includes(search.toLowerCase()),
            ),
          )
        : rows,
    [rows, search],
  );

  if (!config) return null;

  return (
    <main className="p-8 max-w-5xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm text-zinc-500 mb-5"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Resource Browser
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-200">{config.label}</span>
      </nav>

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Image
            src={config.iconPath}
            alt=""
            width={32}
            height={32}
            unoptimized
            className="shrink-0"
          />
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">
              {config.noun}
            </h1>
            <p className="font-sans text-xs text-zinc-500">{config.label}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="px-3 py-1.5 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors disabled:opacity-50"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-3">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="search"
          placeholder={`Filter ${config.noun.toLowerCase()}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      {/* Row count */}
      {!loading && rows.length > 0 && (
        <p className="text-xs text-zinc-600 mb-2">
          {filteredRows.length === rows.length
            ? `${rows.length} ${config.noun.toLowerCase()}`
            : `${filteredRows.length} of ${rows.length} ${config.noun.toLowerCase()}`}
        </p>
      )}

      {error ? (
        <p className="py-12 text-center text-sm text-red-400">{error}</p>
      ) : (
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
          <ResourceTable
            columns={config.columns}
            rows={filteredRows}
            loading={loading}
          />
        </div>
      )}
    </main>
  );
}
