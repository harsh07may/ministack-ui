import { apiFetch } from "../ministack-client";

export async function listTables(): Promise<string[]> {
  const res = await apiFetch("/", {
    method: "POST",
    headers: {
      "X-Amz-Target": "DynamoDB_20120810.ListTables",
      "Content-Type": "application/x-amz-json-1.0",
    },
    body: "{}",
  });
  const data = await res.json();
  return data.TableNames ?? [];
}
