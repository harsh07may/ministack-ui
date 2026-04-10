"use client";

import { useEffect, useRef, useState } from "react";
import { useSearch } from "../contexts/search";

function ResetModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4">
          <p className="text-sm font-semibold text-zinc-100 mb-1">
            Reset environment?
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This wipes every resource — buckets, tables, queues, functions, and
            secrets. The action cannot be undone.
          </p>
        </div>
        <div className="flex gap-2 px-6 pb-5 pt-1">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-xs font-medium tracking-wider uppercase rounded border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-xs font-medium tracking-wider uppercase rounded bg-red-900/60 border border-red-800 text-red-300 hover:bg-red-800/60 hover:text-red-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopBar() {
  const { query, setQuery } = useSearch();
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleConfirm() {
    setConfirming(false);
    setResetting(true);
    try {
      await fetch("/api/reset", { method: "POST" });
    } finally {
      setResetting(false);
      window.location.reload();
    }
  }

  return (
    <>
      {confirming && (
        <ResetModal
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-zinc-800/60 bg-zinc-950 shrink-0">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none"
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
            placeholder="Search resources, ARNs, or logs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={resetting}
          className="px-4 py-3 text-xs font-medium tracking-wider uppercase rounded border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {resetting ? "Resetting…" : "Reset Environment"}
        </button>
      </div>
    </>
  );
}
