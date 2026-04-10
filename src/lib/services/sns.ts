import { apiFetch } from "../ministack-client";

export interface SNSTopic {
  name: string;
  arn: string;
}

export async function listTopics(): Promise<SNSTopic[]> {
  const res = await apiFetch("/?Action=ListTopics");
  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return Array.from(doc.getElementsByTagName("member")).map((el) => {
    const arn = el.getElementsByTagName("TopicArn")[0]?.textContent ?? "";
    return { arn, name: arn.split(":").pop() ?? arn };
  });
}
