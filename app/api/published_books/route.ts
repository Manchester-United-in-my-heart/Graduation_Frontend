import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const response = await fetch(`${process.env.BACKEND_API}/published_books`);
  const result = await response.json();
  return NextResponse.json(result);
}
