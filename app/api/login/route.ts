import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const token = await req.json();

  console.log("Before sending data");
  console.log(token);

  const form = new FormData();
  form.append("username", token.username);
  form.append("password", token.password);
  console.log("Before sending data");
  console.log(`${process.env.BACKEND_API}/token`);
  try {
    const response = await fetch(`${process.env.BACKEND_API}/token`, {
      method: "POST",
      body: form,
    });
    const result = await response.json();

    console.log(result);

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.error();
  }
}
