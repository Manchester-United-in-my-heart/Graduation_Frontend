import { NextResponse } from "next/server";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { accessToken } = await request.json();

  const response = await fetch(
    `${process.env.BACKEND_API}/projects/${id}/request_epub_file`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const result = await response.json();

  return NextResponse.json(result);
}
