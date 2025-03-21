import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get('file');
  const accessToken = data.get('accessToken');
  const id = data.get('projectId');

  const formDataToSend = new FormData();
  formDataToSend.append('files', file);

  const response = await fetch(`${process.env.BACKEND_API}/projects/${id}/upload_images`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
    body: formDataToSend,
  });
  const result = await response.json();
  return NextResponse.json(result);
}