export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/test') {
      return Response.json({
        success: true,
        message: 'Gopal AI Studio backend is online.'
      });
    }

    return env.ASSETS.fetch(request);
  },
};
