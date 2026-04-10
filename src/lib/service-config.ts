import type { Column } from "../components/ResourceTable";
import { listTables } from "./services/dynamodb";
import { listFunctions } from "./services/lambda";
import { listBuckets } from "./services/s3";
import { listSecrets } from "./services/secretsmanager";
import { listTopics } from "./services/sns";
import { listQueues } from "./services/sqs";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Timeout for per-service resource-count fetches on the dashboard. */
export const FETCH_COUNT_TIMEOUT_MS = 5_000;

/** Polling interval for the health endpoint. */
export const HEALTH_POLL_INTERVAL_MS = 5_000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ServiceKey =
  | "s3"
  | "sqs"
  | "dynamodb"
  | "lambda"
  | "sns"
  | "secretsmanager";

/** Shape used by the dynamic resource list page. */
export interface ServiceConfig {
  label: string;
  noun: string;
  iconPath: string;
  columns: Column[];
  fetchRows: () => Promise<Record<string, string>[]>;
}

/** Shape used by the dashboard service cards. */
export interface ServiceDef {
  key: ServiceKey;
  label: string;
  noun: string;
  iconPath: string;
  href: string;
  fetchCount: () => Promise<number>;
}

// ---------------------------------------------------------------------------
// Service registry — one entry per AWS service
// Adding a 7th service: add one entry here and nowhere else.
// ---------------------------------------------------------------------------

export const SERVICE_CONFIG: Record<ServiceKey, ServiceConfig> = {
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

/**
 * Dashboard service card definitions — one entry per AWS service.
 * `fetchCount` derives from the same service module used in `SERVICE_CONFIG`.
 */
export const SERVICES: ServiceDef[] = [
  {
    key: "s3",
    label: "S3",
    noun: "Buckets",
    iconPath: "/icons/aws/s3.svg",
    href: "/resources/s3",
    fetchCount: () => listBuckets().then((items) => items.length),
  },
  {
    key: "dynamodb",
    label: "DynamoDB",
    noun: "Tables",
    iconPath: "/icons/aws/dynamodb.svg",
    href: "/resources/dynamodb",
    fetchCount: () => listTables().then((items) => items.length),
  },
  {
    key: "lambda",
    label: "Lambda",
    noun: "Functions",
    iconPath: "/icons/aws/lambda.svg",
    href: "/resources/lambda",
    fetchCount: () => listFunctions().then((items) => items.length),
  },
  {
    key: "sqs",
    label: "SQS",
    noun: "Queues",
    iconPath: "/icons/aws/simple-queue-service.svg",
    href: "/resources/sqs",
    fetchCount: () => listQueues().then((items) => items.length),
  },
  {
    key: "sns",
    label: "SNS",
    noun: "Topics",
    iconPath: "/icons/aws/simple-notification-service.svg",
    href: "/resources/sns",
    fetchCount: () => listTopics().then((items) => items.length),
  },
  {
    key: "secretsmanager",
    label: "Secrets Manager",
    noun: "Secrets",
    iconPath: "/icons/aws/secrets-manager.svg",
    href: "/resources/secretsmanager",
    fetchCount: () => listSecrets().then((items) => items.length),
  },
];

/** Type guard — narrows an arbitrary string to a valid ServiceKey. */
export function isServiceKey(s: string): s is ServiceKey {
  return s in SERVICE_CONFIG;
}
