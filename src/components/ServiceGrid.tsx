"use client";

import { useState } from "react";
import ServiceCard from "./ServiceCard";

const SERVICES = [
  {
    service: "s3",
    label: "S3",
    noun: "Buckets",
    iconPath: "/icons/aws/s3.svg",
  },
  {
    service: "sqs",
    label: "SQS",
    noun: "Queues",
    iconPath: "/icons/aws/simple-queue-service.svg",
  },
  {
    service: "dynamodb",
    label: "DynamoDB",
    noun: "Tables",
    iconPath: "/icons/aws/dynamodb.svg",
  },
  {
    service: "lambda",
    label: "Lambda",
    noun: "Functions",
    iconPath: "/icons/aws/lambda.svg",
  },
  {
    service: "sns",
    label: "SNS",
    noun: "Topics",
    iconPath: "/icons/aws/simple-notification-service.svg",
  },
  {
    service: "secretsmanager",
    label: "Secrets Manager",
    noun: "Secrets",
    iconPath: "/icons/aws/secrets-manager.svg",
  },
] as const;

export default function ServiceGrid() {
  const [query, setQuery] = useState("");

  const filtered = query
    ? SERVICES.filter(
        (s) =>
          s.label.toLowerCase().includes(query.toLowerCase()) ||
          s.noun.toLowerCase().includes(query.toLowerCase()),
      )
    : SERVICES;

  return (
    <div className="space-y-4">
      <div className="relative">
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
          placeholder="Which service are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((s) => (
            <ServiceCard key={s.service} {...s} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-zinc-500">
          No services match &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  );
}
