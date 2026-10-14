import { put } from "@vercel/blob";

function header(request: any, name: string) {
  const headers = request?.headers;
  if (!headers) return "";
  if (typeof headers.get === "function") return String(headers.get(name) || "");
  const direct = headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
  if (Array.isArray(direct)) return String(direct[0] || "");
  return direct == null ? "" : String(direct);
}

function requestUrl(request: any) {
  const raw = String(request?.url || "/api/upload");
  if (/^https?:\/\//i.test(raw)) return raw;
  const proto = header(request, "x-forwarded-proto") || "https";
  const host = header(request, "host") || "noirknull.in";
  return `${proto}://${host}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

function allowedOrigin(request: any) {
  const origin = header(request, "origin");
  if (!origin) return false;
  try {
    const hostname = new URL(origin).hostname;
    return origin === "https://noirknull.in" || origin === "https://www.noirknull.in" ||
      origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:") ||
      hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

async function readRawBody(request: any): Promise<Buffer> {
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(request?.body)) return request.body;
  if (request?.body instanceof ArrayBuffer) return Buffer.from(request.body);
  if (request?.body instanceof Uint8Array) return Buffer.from(request.body);
  if (typeof request?.body === "string") return Buffer.from(request.body);

  if (typeof request?.on === "function") {
    const chunks: Buffer[] = [];
    for await (const chunk of request) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  return Buffer.alloc(0);
}

async function readFormData(request: any): Promise<FormData> {
  if (typeof request?.formData === "function") return request.formData();

  const body = await readRawBody(request);
  const headers = new Headers();
  const sourceHeaders = request?.headers || {};
  if (typeof sourceHeaders.forEach === "function") {
    sourceHeaders.forEach((value: string, key: string) => headers.set(key, value));
  } else {
    for (const [key, value] of Object.entries(sourceHeaders)) {
      if (value == null) continue;
      headers.set(key, Array.isArray(value) ? String(value[0]) : String(value));
    }
  }

  const webRequest = new Request(requestUrl(request), {
    method: "POST",
    headers,
    body,
    duplex: "half",
  } as any);

  return webRequest.formData();
}

export default async function handler(request: any) {
  const method = String(request?.method || "").toUpperCase();
  if (method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  if (!allowedOrigin(request)) return Response.json({ ok: false, error: "Origin not allowed" }, { status: 403 });

  try {
    const form = await readFormData(request);
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
