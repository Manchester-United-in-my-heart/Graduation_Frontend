import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const data = await req.formData();
  const name = data.get("name");
  const description = data.get("description");
  const coverImage = data.get("coverImage");
  const isPublic = data.get("isPublic") === "true";
  const isAllowedToTrain = data.get("isAllowedToTrain") === "true";
  const accessToken = data.get("accessToken");

  const formDataToSend = new FormData();
  
  formDataToSend.append("name", name || "");
  formDataToSend.append("description", description || "");
  if (coverImage) {
    formDataToSend.append("cover_image", coverImage);
  }
  formDataToSend.append("is_public", isPublic.toString());
  formDataToSend.append("is_allow_to_train", isAllowedToTrain.toString());

  const response = await fetch(`${process.env.BACKEND_API}/projects/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: formDataToSend,
  });
  const result = await response.json();
  return NextResponse.json(result);
}
