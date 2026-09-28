export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
  BOOK_DOWNLOAD_PASSWORD: string;
}

const MODELS = {
  "flux-schnell": "@cf/black-forest-labs/flux-1-schnell",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/test") {
      return Response.json({
        success: true,
        message: "Gopal AI Studio backend is online.",
      });
    }

    if (url.pathname === "/api/models") {
      return Response.json({
        success: true,
        models: MODELS,
      });
    }

    // Protected PDF download
    if (
      url.pathname.startsWith("/api/download/") &&
      request.method === "POST"
    ) {
      const password = request.headers.get("x-download-password");

      if (!password || password !== env.BOOK_DOWNLOAD_PASSWORD) {
        return Response.json(
          {
            success: false,
            message: "Wrong password",
          },
          { status: 401 }
        );
      }

      const file = url.pathname.replace("/api/download/", "");

      // Only allow PDF files from /books
      if (!file.endsWith(".pdf") || file.includes("/") || file.includes("..")) {
        return new Response("Invalid file", { status: 400 });
      }

      const pdfResponse = await env.ASSETS.fetch(
        new Request(new URL(`/books/${file}`, request.url))
      );

      if (!pdfResponse.ok) {
        return new Response("PDF not found", { status: 404 });
      }

      return new Response(pdfResponse.body, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${file}"`,
          "Cache-Control": "private, no-store",
        },
      });
    }

    let response = await env.ASSETS.fetch(request);

    // SPA fallback for React Router
    if (response.status === 404) {
      return env.ASSETS.fetch(
        new Request(new URL("/", request.url))
      );
    }

    return response;
  },
};
