export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
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

    return env.ASSETS.fetch(request);
  },
} 
