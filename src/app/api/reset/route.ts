import { NextResponse } from "next/server";

const ENDPOINT =
  process.env.NEXT_PUBLIC_MINISTACK_ENDPOINT ?? "http://localhost:4566";

export async function POST() {
  const res = await fetch(`${ENDPOINT}/_ministack/reset`, {
    method: "POST",
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data);
}
