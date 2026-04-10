import { apiFetch } from "../ministack-client";

export interface SQSQueue {
  name: string;
  url: string;
}

export async function listQueues(): Promise<SQSQueue[]> {
  const res = await apiFetch("/?Action=ListQueues");
  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return Array.from(doc.getElementsByTagName("QueueUrl")).map((el) => {
    const url = el.textContent ?? "";
    return { url, name: url.split("/").pop() ?? url };
  });
}
