type StoreData = {
  products?: unknown;
  featured?: unknown;
  eternalFits?: unknown;
  homepage?: unknown;
  categories?: unknown;
  [key: string]: unknown;
};

type Env = {
  ASSETS: any;
  NOIRKNULL_BUCKET: any;
  MIGRATION_TOKEN?: string;
};

const STORE_KEY = "noirknull/data/store.json";
const MIGRATION_SOURCE = "https://noirknull.in";

function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store, max-age=0, must-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...(init.headers || {}),
    },
  });
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;

  try {
    const url = new URL(origin);
    return (
      origin === "https://noirknull.in" ||
      origin === "https://www.noirknull.in" ||
      url.hostname.endsWith(".workers.dev") ||
      url.hostname.endsWith(".noirknull.in") ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

async function readStore(env: Env): Promise<StoreData | null> {
  const object = await env.NOIRKNULL_BUCKET.get(STORE_KEY);
  if (!object) return null;

  const text = await new Response(object.body).text();
  return JSON.parse(text) as StoreData;
}

async function writeStore(env: Env, data: StoreData) {
  await env.NOIRKNULL_BUCKET.put(STORE_KEY, JSON.stringify(data), {
    httpMetadata: {
      contentType: "application/json",
      cacheControl: "no-store, max-age=0, must-revalidate",
    },
  });
}

async function readStoreApi(env: Env) {
  try {
    const data = await readStore(env);
    return json({ ok: true, exists: Boolean(data), data });
  } catch (error) {
    console.error("STORE_READ_FAILED", error);
    return json(
      { ok: false, error: "Unable to read store data" },
      { status: 500 },
    );
  }
}

async function writeStoreApi(request: Request, env: Env) {
  if (!allowedOrigin(request)) {
    return json({ ok: false, error: "Origin not allowed" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      section?: keyof StoreData;
      value?: unknown;
      data?: StoreData;
    };

    const current = (await readStore(env)) || {};
    const next = body?.data
      ? { ...current, ...body.data }
      : body?.section
        ? { ...current, [body.section]: body.value }
        : null;

    if (!next) {
      return json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    await writeStore(env, next);
    return json({ ok: true, data: next });
  } catch (error) {
    console.error("STORE_WRITE_FAILED", error);
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

async function uploadMedia(request: Request, env: Env) {
  if (!allowedOrigin(request)) {
    return json({ ok: false, error: "Origin not allowed" }, { status: 403 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return json({ ok: false, error: "No file supplied" }, { status: 400 });
    }

    const safeName =
      file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "upload";
    const pathname =
      "noirknull/media/" +
      Date.now() +
      "-" +
      crypto.randomUUID() +
      "-" +
      safeName;

    await env.NOIRKNULL_BUCKET.put(pathname, file.stream(), {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    return json({
      ok: true,
      url: "/api/media?path=" + encodeURIComponent(pathname),
    });
  } catch (error) {
    console.error("UPLOAD_FAILED", error);
    return json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}

async function serveMedia(request: Request, env: Env) {
  try {
    const pathname = new URL(request.url).searchParams.get("path");
    if (!pathname || !pathname.startsWith("noirknull/media/")) {
      return new Response("Not Found", { status: 404 });
    }

    const object = await env.NOIRKNULL_BUCKET.get(pathname);
    if (!object) return new Response("Not Found", { status: 404 });

    return new Response(object.body, {
      headers: {
        "Content-Type":
          object.httpMetadata?.contentType || "application/octet-stream",
        "Cache-Control":
          object.httpMetadata?.cacheControl ||
          "public, max-age=31536000, immutable",
        ...(object.httpEtag ? { ETag: object.httpEtag } : {}),
      },
    });
  } catch (error) {
    console.error("MEDIA_READ_FAILED", error);
    return new Response("Not Found", { status: 404 });
  }
}

function collectMediaReferences(
  value: unknown,
  output = new Set<string>(),
): Set<string> {
  if (typeof value === "string") {
    if (value.startsWith("/api/media?path=")) output.add(value);
    return output;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectMediaReferences(item, output);
    return output;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value as Record<string, unknown>)) {
      collectMediaReferences(item, output);
    }
  }

  return output;
}

async function migrateFromVercel(request: Request, env: Env) {
  const expected = env.MIGRATION_TOKEN;
  const provided = request.headers
    .get("Authorization")
    ?.replace(/^Bearer\s+/i, "");

  if (!expected || provided !== expected) {
    return json(
      { ok: false, error: "Migration is not authorized" },
      { status: 401 },
    );
  }

  try {
    const sourceStoreResponse = await fetch(MIGRATION_SOURCE + "/api/store", {
      headers: { Accept: "application/json" },
    });

    if (!sourceStoreResponse.ok) {
      return json(
        { ok: false, error: "Could not read the current store from Vercel" },
        { status: 502 },
      );
    }

    const payload = (await sourceStoreResponse.json()) as {
      ok?: boolean;
      data?: StoreData | null;
    };

    if (!payload?.ok || !payload.data) {
      return json(
        { ok: false, error: "The source store did not contain usable data" },
        { status: 502 },
      );
    }

    const mediaReferences = [...collectMediaReferences(payload.data)];
    const migratedMedia: string[] = [];
    const failedMedia: string[] = [];

    for (const reference of mediaReferences) {
      try {
        const sourceUrl = new URL(reference, MIGRATION_SOURCE);
        const pathname = sourceUrl.searchParams.get("path");

        if (!pathname || !pathname.startsWith("noirknull/media/")) {
          failedMedia.push(reference);
          continue;
        }

        const mediaResponse = await fetch(sourceUrl.toString());

        if (!mediaResponse.ok) {
          failedMedia.push(reference);
          continue;
        }

        const mediaBytes = await mediaResponse.arrayBuffer();

        await env.NOIRKNULL_BUCKET.put(pathname, mediaBytes, {
          httpMetadata: {
            contentType:
              mediaResponse.headers.get("content-type") ||
              "application/octet-stream",
            cacheControl: "public, max-age=31536000, immutable",
          },
        });

        migratedMedia.push(pathname);
      } catch {
        failedMedia.push(reference);
      }
    }

    await writeStore(env, payload.data);

    return json({
      ok: true,
      source: MIGRATION_SOURCE,
      mediaFound: mediaReferences.length,
      mediaMigrated: migratedMedia.length,
      mediaFailed: failedMedia.length,
      failedMedia,
      message:
        "Store data and referenced media were copied into Cloudflare R2. Test the Cloudflare site before retiring Vercel.",
    });
  } catch (error) {
    console.error("VERCEL_MIGRATION_FAILED", error);
    return json({ ok: false, error: "Migration failed" }, { status: 500 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, platform: "cloudflare" });
    }

    if (url.pathname === "/api/store") {
      if (request.method === "GET") return readStoreApi(env);
      if (request.method === "POST") return writeStoreApi(request, env);
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (url.pathname === "/api/upload" && request.method === "POST") {
      return uploadMedia(request, env);
    }

    if (url.pathname === "/api/media" && request.method === "GET") {
      return serveMedia(request, env);
    }

    if (
      url.pathname === "/api/migrate-from-vercel" &&
      request.method === "POST"
    ) {
      return migrateFromVercel(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
