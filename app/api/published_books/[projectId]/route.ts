import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const response = await fetch(
    `${process.env.BACKEND_API}/published_books/${projectId}`,
  );
  const result = await response.json();
  return NextResponse.json(result);
}
