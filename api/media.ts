import { get } from "@vercel/blob";

function header(request: any, name: string) {
  const headers = request?.headers;
  if (!headers) return "";
  if (typeof headers.get === "function") return String(headers.get(name) || "");
  const direct = headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
  if (Array.isArray(direct)) return String(direct[0] || "");
  return direct == null ? "" : String(direct);
}

function requestUrl(request: any) {
  const raw = String(request?.url || "/");
  if (/^https?:\/\//i.test(raw)) return raw;
  const proto = header(request, "x-forwarded-proto") || "https";
  const host = header(request, "host") || "noirknull.in";
  return `${proto}://${host}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export default async function handler(request: any) {
  if (String(request?.method || "GET").toUpperCase() !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const pathname = new URL(requestUrl(request)).searchParams.get("path");
    if (!pathname || !pathname.startsWith("noirknull/media/")) {
      return new Response("Not Found", { status: 404 });
    }

    const result = await get(pathname, { access: "private", useCache: false });
    if (!result) return new Response("Not Found", { status: 404 });

    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("MEDIA_READ_FAILED", error);
    return new Response("Not Found", { status: 404 });
  }
}
