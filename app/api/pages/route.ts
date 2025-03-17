import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { projectId, pageId, accessToken } = await req.json();
  const response = await fetch(
    `${process.env.BACKEND_API}/projects/${projectId}/pages/${pageId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const result = await response.json();
  return NextResponse.json(result);
}
