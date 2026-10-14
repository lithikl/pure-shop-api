import { put } from "@vercel/blob";

function header(request: Request, name: string) {
  const headers = request.headers as Headers | Record<string, string | string[] | undefined>;
  if (headers instanceof Headers) return headers.get(name) || "";
  const value = headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function allowedOrigin(request: Request) {
  const origin = header(request, "origin");
  if (!origin) return false;
  try {
    const hostname = new URL(origin).hostname;
    return origin === "https://noirknull.in" || origin === "https://www.noirknull.in" ||
      origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:") ||
      hostname.endsWith(".vercel.app");
  } catch { return false; }
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
    console.error("UPLOAD_FAILED", error);
    return Response.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
