const ENDPOINT =
  process.env.NEXT_PUBLIC_MINISTACK_ENDPOINT ?? "http://localhost:4566";

const DUMMY_AUTH =
  "AWS4-HMAC-SHA256 Credential=test/20240101/us-east-1/ministack/aws4_request, SignedHeaders=host, Signature=0000000000000000000000000000000000000000000000000000000000000000";

export function getEndpoint(): string {
  return ENDPOINT;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${ENDPOINT}${path}`, {
    ...options,
    headers: {
      Authorization: DUMMY_AUTH,
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`MiniStack ${res.status}: ${path}`);
  return res;
}
