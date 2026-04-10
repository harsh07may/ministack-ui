import { apiFetch } from "../ministack-client";

export interface Secret {
  name: string;
  arn: string;
  lastChanged: string;
}

interface RawSecret {
  Name: string;
  ARN: string;
  LastChangedDate?: number;
}

export async function listSecrets(): Promise<Secret[]> {
  const res = await apiFetch("/", {
    method: "POST",
    headers: {
      "X-Amz-Target": "secretsmanager.ListSecrets",
      "Content-Type": "application/x-amz-json-1.1",
    },
    body: "{}",
  });
  const data = await res.json();
  return (data.SecretList ?? []).map((s: RawSecret) => ({
    name: s.Name,
    arn: s.ARN,
    lastChanged: s.LastChangedDate
      ? new Date(s.LastChangedDate * 1000).toISOString()
      : "—",
  }));
}
