import { apiFetch } from "../ministack-client";

export interface S3Bucket {
  name: string;
  creationDate: string;
}

export async function listBuckets(): Promise<S3Bucket[]> {
  const res = await apiFetch("/");
  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return Array.from(doc.getElementsByTagName("Bucket")).map((el) => ({
    name: el.getElementsByTagName("Name")[0]?.textContent ?? "",
    creationDate: el.getElementsByTagName("CreationDate")[0]?.textContent ?? "",
  }));
}
