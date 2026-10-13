import { get } from "@vercel/blob";

export default async function handler(request: Request) {
  if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405 });
  try {
    const pathname = new URL(request.url).searchParams.get("path");
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
    console.error(error);
    return new Response("Not Found", { status: 404 });
  }
}
