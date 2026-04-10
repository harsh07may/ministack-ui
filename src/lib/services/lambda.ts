import { apiFetch } from "../ministack-client";

export interface LambdaFunction {
  name: string;
  runtime: string;
  lastModified: string;
}

interface RawFunction {
  FunctionName: string;
  Runtime: string;
  LastModified: string;
}

export async function listFunctions(): Promise<LambdaFunction[]> {
  const res = await apiFetch("/2015-03-31/functions");
  const data = await res.json();
  return (data.Functions ?? []).map((f: RawFunction) => ({
    name: f.FunctionName,
    runtime: f.Runtime,
    lastModified: f.LastModified,
  }));
}
