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
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  ADMIN_PASSWORD?: string;
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Accept",
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

const ADMIN_TOKEN_TTL = 12 * 60 * 60 * 1000;

async function hmacHex(secret: string, value: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

async function createAdminToken(env: Env) {
  if (!env.ADMIN_PASSWORD) throw new Error("Admin password is not configured.");
  const payload = `${Date.now() + ADMIN_TOKEN_TTL}.${crypto.randomUUID()}`;
  return `${payload}.${await hmacHex(env.ADMIN_PASSWORD, payload)}`;
}

async function verifyAdminToken(request: Request, env: Env) {
  if (!env.ADMIN_PASSWORD) return false;
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const expiry = Number(parts[0]);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = await hmacHex(env.ADMIN_PASSWORD, payload);
  return safeEqual(expected, parts[2]);
}

async function adminLogin(request: Request, env: Env) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  if (!env.ADMIN_PASSWORD) return json({ ok: false, error: "Admin password is not configured." }, { status: 500 });
  try {
    const body = await request.json() as { password?: string };
    if (!body.password || body.password !== env.ADMIN_PASSWORD) return json({ ok: false, error: "Invalid admin password." }, { status: 401 });
    return json({ ok: true, token: await createAdminToken(env), expiresIn: ADMIN_TOKEN_TTL });
  } catch {
    return json({ ok: false, error: "Unable to sign in." }, { status: 400 });
  }
}

async function writeStoreApi(request: Request, env: Env) {
  if (!(await verifyAdminToken(request, env))) {
    return json({ ok: false, error: "Admin authentication required." }, { status: 401 });
  }
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
  if (!(await verifyAdminToken(request, env))) {
    return json({ ok: false, error: "Admin authentication required." }, { status: 401 });
  }
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



async function createRazorpayOrder(request: Request, env: Env) {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    return json({ ok: false, error: "Razorpay server keys are not configured." }, { status: 500 });
  }

  try {
    const body = (await request.json()) as {
      amount?: number;
      currency?: string;
      receipt?: string;
      shippingMethod?: "standard" | "express";
      items?: Array<{ productId?: number; quantity?: number; price?: number; size?: string }>;
      customer?: { name?: string; email?: string; phone?: string };
    };

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return json({ ok: false, error: "Your cart is empty." }, { status: 400 });
    }

    const store = await readStore(env);
    const products = Array.isArray(store?.products) ? store.products as Array<Record<string, unknown>> : [];
    let subtotal = 0;
    for (const item of body.items) {
      const product = products.find(entry => Number(entry.id) === Number(item.productId));
      const quantity = Math.max(1, Math.floor(Number(item.quantity || 1)));
      if (!product || !Number.isFinite(Number(product.price)) || Number(product.price) !== Number(item.price)) {
        return json({ ok: false, error: "Cart price changed. Please refresh your cart and try again." }, { status: 409 });
      }
      subtotal += Number(product.price) * quantity;
    }

    const shippingCost = body.shippingMethod === "express" ? 199 : subtotal >= 5000 ? 0 : 99;
    const expectedAmount = subtotal + shippingCost;
    const parsedAmount = Number(body.amount);
    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0 || parsedAmount !== expectedAmount) {
      return json({ ok: false, error: "Cart total changed. Please refresh your cart and try again." }, { status: 409 });
    }

    const credentials = btoa(
      `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`,
    );

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parsedAmount * 100,
        currency: body.currency || "INR",
        receipt: String(body.receipt || `noir-${Date.now()}`).slice(0, 40),
        notes: {
          customer_name: String(body.customer?.name || "").slice(0, 100),
          customer_email: String(body.customer?.email || "").slice(0, 100),
          customer_phone: String(body.customer?.phone || "").slice(0, 30),
        },
      }),
    });

    const raw = await response.text();
    let data: any = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      const credentialError = response.status === 401
        ? "Razorpay rejected the API credentials. The Cloudflare RAZORPAY_KEY_SECRET must belong to the Live Key ID configured for this Worker."
        : data?.error?.description || data?.error?.code || raw || "Razorpay order creation failed.";
      return json({ ok: false, error: credentialError }, { status: response.status });
    }

    return json({
      ok: true,
      id: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (error) {
    console.error("RAZORPAY_ORDER_FAILED", error);
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create Razorpay order.",
      },
      { status: 500 },
    );
  }
}

function hex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function verifyRazorpayPayment(request: Request, env: Env) {
  if (request.method !== "POST") {
    return json({ verified: false, error: "Method not allowed" }, { status: 405 });
  }

  if (!env.RAZORPAY_KEY_SECRET) {
    return json(
      { verified: false, error: "Razorpay server secret is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    const orderId = body.razorpay_order_id;
    const paymentId = body.razorpay_payment_id;
    const signature = body.razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      return json(
        {
          verified: false,
          error: "Incomplete payment verification data.",
        },
        { status: 400 },
      );
    }

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(env.RAZORPAY_KEY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const digest = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${orderId}|${paymentId}`),
    );

    const expected = hex(digest);
    if (!safeEqual(expected, signature)) {
      return json(
        { verified: false, error: "Invalid payment signature." },
        { status: 400 },
      );
    }

    return json({
      verified: true,
      payment_id: paymentId,
      order_id: orderId,
    });
  } catch (error) {
    console.error("RAZORPAY_VERIFY_FAILED", error);
    return json(
      { verified: false, error: "Unable to verify payment." },
      { status: 500 },
    );
  }
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
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Accept",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, platform: "cloudflare" });
    }

    if (url.pathname === "/api/admin/login") {
      return adminLogin(request, env);
    }

    if (url.pathname === "/api/create-order") {
      return createRazorpayOrder(request, env);
    }

    if (url.pathname === "/api/verify-payment") {
      return verifyRazorpayPayment(request, env);
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
