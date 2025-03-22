import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { accessToken } = await req.json();
  try {
    const response = await fetch(`${process.env.BACKEND_API}/secret/train`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (response.status === 400) {
      return NextResponse.json({ status: 400 });
    } else {
      return NextResponse.json(await response.json());
    }
  } catch (error) {
    return NextResponse.error(error);
  }
}
