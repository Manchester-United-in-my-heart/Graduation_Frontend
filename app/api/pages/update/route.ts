import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { projectId, pageId, accessToken, updatedText } = await req.json();
  const response = await fetch(
    `${process.env.BACKEND_API}/projects/${projectId}/pages/${pageId}/update`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify({
        updatedText: updatedText,
      }),
    },
  );
  const result = await response.json();
  return NextResponse.json(result);
}
