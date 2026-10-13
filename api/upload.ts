import { put } from "@vercel/blob";

function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin") || "";
  return origin === "https://noirknull.in" || origin === "https://www.noirknull.in" || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:") || (origin && /.vercel.app$/.test(new URL(origin).hostname || ""));
}

export default async function handler(request: Request) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  if (!allowedOrigin(request)) return Response.json({ ok: false, error: "Origin not allowed" }, { status: 403 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ ok: false, error: "No file supplied" }, { status: 400 });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "upload";
    const pathname = `noirknull/media/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const blob = await put(pathname, file, {
      access: "private",
      addRandomSuffix: false,
      contentType: file.type || "application/octet-stream",
    });

    return Response.json({ ok: true, url: `/api/media?path=${encodeURIComponent(blob.pathname)}` });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
