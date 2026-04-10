"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import ResourceTable, { type Column } from "../../../components/ResourceTable";
import { listTables } from "../../../lib/services/dynamodb";
import { listFunctions } from "../../../lib/services/lambda";
import { listBuckets } from "../../../lib/services/s3";
import { listSecrets } from "../../../lib/services/secretsmanager";
import { listTopics } from "../../../lib/services/sns";
import { listQueues } from "../../../lib/services/sqs";

type ServiceKey =
  | "s3"
  | "sqs"
  | "dynamodb"
  | "lambda"
  | "sns"
  | "secretsmanager";

interface ServiceConfig {
  label: string;
  noun: string;
  iconPath: string;
  columns: Column[];
  fetchRows: () => Promise<Record<string, string>[]>;
}

const SERVICE_CONFIG: Record<ServiceKey, ServiceConfig> = {
  s3: {
    label: "S3",
    noun: "Buckets",
    iconPath: "/icons/aws/s3.svg",
    columns: [
      { key: "name", label: "Name" },
      { key: "creationDate", label: "Creation Date" },
    ],
    fetchRows: async () => {
      const items = await listBuckets();
      return items.map((b) => ({ name: b.name, creationDate: b.creationDate }));
    },
  },
  sqs: {
    label: "SQS",
    noun: "Queues",
    iconPath: "/icons/aws/simple-queue-service.svg",
    columns: [
      { key: "name", label: "Name" },
      { key: "url", label: "URL" },
    ],
    fetchRows: async () => {
      const items = await listQueues();
      return items.map((q) => ({ name: q.name, url: q.url }));
    },
  },
  dynamodb: {
    label: "DynamoDB",
    noun: "Tables",
    iconPath: "/icons/aws/dynamodb.svg",
    columns: [{ key: "name", label: "Table Name" }],
    fetchRows: async () => {
      const items = await listTables();
      return items.map((name) => ({ name }));
    },
  },
  lambda: {
    label: "Lambda",
    noun: "Functions",
    iconPath: "/icons/aws/lambda.svg",
    columns: [
      { key: "name", label: "Name" },
      { key: "runtime", label: "Runtime" },
      { key: "lastModified", label: "Last Modified" },
    ],
    fetchRows: async () => {
      const items = await listFunctions();
      return items.map((f) => ({
        name: f.name,
        runtime: f.runtime,
        lastModified: f.lastModified,
      }));
    },
  },
  sns: {
    label: "SNS",
    noun: "Topics",
    iconPath: "/icons/aws/simple-notification-service.svg",
    columns: [
      { key: "name", label: "Name" },
      { key: "arn", label: "ARN" },
    ],
    fetchRows: async () => {
      const items = await listTopics();
      return items.map((t) => ({ name: t.name, arn: t.arn }));
    },
  },
  secretsmanager: {
    label: "Secrets Manager",
    noun: "Secrets",
    iconPath: "/icons/aws/secrets-manager.svg",
    columns: [
      { key: "name", label: "Name" },
      { key: "arn", label: "ARN" },
      { key: "lastChanged", label: "Last Changed" },
    ],
    fetchRows: async () => {
      const items = await listSecrets();
      return items.map((s) => ({
        name: s.name,
        arn: s.arn,
        lastChanged: s.lastChanged,
      }));
    },
  },
};

function isServiceKey(s: string): s is ServiceKey {
  return s in SERVICE_CONFIG;
}

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
