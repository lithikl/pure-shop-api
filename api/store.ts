import { get, put } from "@vercel/blob";

type StoreData = {
  products?: unknown;
  featured?: unknown;
  eternalFits?: unknown;
  homepage?: unknown;
  categories?: unknown;
};

const PATH = "noirknull/data/store.json";

function header(request: any, name: string) {
  const headers = request?.headers;
  if (!headers) return "";
  if (typeof headers.get === "function") return String(headers.get(name) || "");
  const direct = headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
  if (Array.isArray(direct)) return String(direct[0] || "");
  return direct == null ? "" : String(direct);
}

function allowedOrigin(request: any) {
  const origin = header(request, "origin");
  if (!origin) return true;
  try {
    const hostname = new URL(origin).hostname;
    return origin === "https://noirknull.in" || origin === "https://www.noirknull.in" ||
      origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:") ||
      hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function blobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is missing");
  return token;
}

async function readStore(): Promise<StoreData | null> {
  console.log("STORE: starting blob get", PATH);

  const result = await get(PATH, {
    access: "private",
    token: blobToken(),
    useCache: false,
  });

  console.log("STORE: blob get completed", Boolean(result));

  if (!result) return null;
  return JSON.parse(await new Response(result.stream).text()) as StoreData;
}

async function readJsonBody(request: any): Promise<any> {
  if (typeof request?.json === "function") return request.json();

  if (request?.body !== undefined && request.body !== null) {
    if (typeof request.body === "string") return JSON.parse(request.body);
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(request.body)) {
      return JSON.parse(request.body.toString("utf8"));
    }
    if (request.body instanceof Uint8Array) {
      return JSON.parse(new TextDecoder().decode(request.body));
    }
    if (typeof request.body === "object") return request.body;
  }

  if (typeof request?.on === "function") {
    const chunks: Buffer[] = [];
    for await (const chunk of request) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    return raw ? JSON.parse(raw) : {};
  }

  return {};
}

export default async function handler(request: any) {
  const method = String(request?.method || "GET").toUpperCase();

  if (method === "GET") {
    try {
      const data = await readStore();
      return Response.json(
        { ok: true, exists: Boolean(data), data },
        { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
      );
    } catch (error) {
      console.error("STORE_READ_FAILED", error);
      return Response.json(
        { ok: false, error: "Unable to read store data" },
        { status: 500, headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
      );
    }
  }

  if (method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  if (!allowedOrigin(request)) return Response.json({ ok: false, error: "Origin not allowed" }, { status: 403 });

  try {
    const body = await readJsonBody(request) as { section?: keyof StoreData; value?: unknown; data?: StoreData };
    const current = (await readStore()) || {};
    const next = body?.data
      ? { ...current, ...body.data }
      : body?.section
        ? { ...current, [body.section]: body.value }
        : null;

    if (!next) return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });

    await put(PATH, JSON.stringify(next), {
      access: "private",
      token: blobToken(),
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    return Response.json(
      { ok: true, data: next },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
    );
  } catch (error) {
    console.error("STORE_WRITE_FAILED", error);
    return Response.json({ ok: false, error: "Unable to save store data" }, { status: 500 });
  }
}
