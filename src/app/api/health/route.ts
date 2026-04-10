import { NextResponse } from "next/server";

const ENDPOINT =
  process.env.NEXT_PUBLIC_MINISTACK_ENDPOINT ?? "http://localhost:4566";

export async function GET() {
  const res = await fetch(`${ENDPOINT}/_ministack/health`, {
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data);
}
