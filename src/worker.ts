export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
  BOOK_DOWNLOAD_PASSWORD: string;
}

const MODELS = {
  "flux-schnell": "@cf/black-forest-labs/flux-1-schnell",
  "flux-klein-4b": "@cf/black-forest-labs/flux-2-klein-4b",
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

    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const form = await request.formData();
        const prompt = String(form.get("prompt") || "").trim();
        const ratio = String(form.get("ratio") || "1:1");
        const modelKey = String(form.get("model") || "flux-schnell");

        if (!prompt) {
          return Response.json(
            { success: false, error: "Please write a prompt." },
            { status: 400 }
          );
        }

        const modelId = (MODELS as Record<string, string>)[modelKey];
        if (!modelId) {
          return Response.json(
            { success: false, error: "This model is not available." },
            { status: 400 }
          );
        }

        const sizes: Record<string, [number, number]> = {
          "1:1": [1024, 1024],
          "4:3": [1024, 768],
          "3:4": [768, 1024],
          "16:9": [1024, 576],
          "9:16": [576, 1024],
        };
        const [width, height] = sizes[ratio] || [1024, 1024];

        let result: any;

        if (modelKey === "flux-klein-4b") {
          const body = new FormData();
          body.append("prompt", prompt);
          body.append("width", String(width));
          body.append("height", String(height));
          const packed = new Response(body);
          result = await (env.AI as any).run(modelId, {
            multipart: {
              body: packed.body,
              contentType: packed.headers.get("content-type"),
            },
          });
        } else {
          result = await (env.AI as any).run(modelId, {
            prompt,
            steps: 4,
          });
        }

        return Response.json({ success: true, image: result });
      } catch (err) {
        return Response.json(
          {
            success: false,
            error:
              err instanceof Error ? err.message : "Image generation failed.",
          },
          { status: 500 }
        );
      }
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
