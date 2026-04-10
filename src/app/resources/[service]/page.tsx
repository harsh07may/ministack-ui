"use client";

import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
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
  columns: Column[];
  fetchRows: () => Promise<Record<string, string>[]>;
}

const SERVICE_CONFIG: Record<ServiceKey, ServiceConfig> = {
  s3: {
    label: "S3",
    noun: "Buckets",
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
    columns: [{ key: "name", label: "Table Name" }],
    fetchRows: async () => {
      const items = await listTables();
      return items.map((name) => ({ name }));
    },
  },
  lambda: {
    label: "Lambda",
    noun: "Functions",
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

  if (!isServiceKey(service)) notFound();

  const config = SERVICE_CONFIG[service];
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await config.fetchRows());
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">
          <span>Resource Browser</span>
          <span className="mx-2">/</span>
          <span>{config.label}</span>
          <span className="mx-2">/</span>
          <span className="text-zinc-200">{config.noun}</span>
        </nav>
        <button
          type="button"
          onClick={load}
          className="px-3 py-1.5 text-sm rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>
      <div className="rounded-lg bg-zinc-900 overflow-hidden">
        <ResourceTable columns={config.columns} rows={rows} loading={loading} />
      </div>
    </main>
  );
}
