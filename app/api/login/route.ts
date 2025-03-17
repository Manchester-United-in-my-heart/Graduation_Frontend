import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const token = await req.json();
  const form = new FormData();
  form.append("username", token.username);
  form.append("password", token.password);
  try {
    const response = await fetch(`${process.env.BACKEND_API}/token`, {
      method: "POST",
      body: form,
    });
    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.error(error);
  }
}
