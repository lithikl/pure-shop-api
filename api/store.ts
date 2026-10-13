import { get, put } from "@vercel/blob";

type StoreData = {
  products?: unknown;
  featured?: unknown;
  eternalFits?: unknown;
  homepage?: unknown;
  categories?: unknown;
};

const PATH = "noirknull/data/store.json";

function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin") || "";
  if (!origin) return true;
  try {
    const hostname = new URL(origin).hostname;
    return (
      origin === "https://noirknull.in" ||
      origin === "https://www.noirknull.in" ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      hostname.endsWith(".vercel.app")
    );
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
  try {
    const result = await get(PATH, {
      access: "private",
      token: blobToken(),
      useCache: false,
    });
    if (!result) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as StoreData;
  } catch (error) {
    console.error("STORE_READ_FAILED", error);
    return null;
  }
}

async function writeStore(data: StoreData) {
  await put(PATH, JSON.stringify(data), {
    access: "private",
    token: blobToken(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export default async function handler(request: Request) {
  if (request.method === "GET") {
    const data = await readStore();
    return Response.json(
      { ok: true, exists: Boolean(data), data },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
    );
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!allowedOrigin(request)) {
    return Response.json({ ok: false, error: "Origin not allowed" }, { status: 403 });
  }

  try {
    const body = await request.json() as {
      section?: keyof StoreData;
      value?: unknown;
      data?: StoreData;
    };

    const current = (await readStore()) || {};
    const next = body.data
      ? { ...current, ...body.data }
      : body.section
        ? { ...current, [body.section]: body.value }
        : null;

    if (!next) {
      return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    await writeStore(next);
    return Response.json(
      { ok: true, data: next },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("STORE_WRITE_FAILED", error);
    return Response.json(
      { ok: false, error: "Unable to save store data" },
      { status: 500 },
    );
  }
}
