import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { accessToken } = await request.json();
  const response = await fetch(`${process.env.BACKEND_API}/projects/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await response.json();
  return NextResponse.json(result);
}
