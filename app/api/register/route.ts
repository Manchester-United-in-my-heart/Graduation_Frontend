import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = await req.json();
  try {
    const response = await axios.post(`${process.env.BACKEND_API}/register`, {
      email: token.email,
      password: token.password,
      username: token.displayName,
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.error();
  }
}
