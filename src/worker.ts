export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
  BOOK_DOWNLOAD_PASSWORD: string;
}

const MODELS: Record<string, string> = {
  'flux-klein-4b': '@cf/black-forest-labs/flux-2-klein-4b',
  'flux-klein-9b': '@cf/black-forest-labs/flux-2-klein-9b',
  'flux-dev': '@cf/black-forest-labs/flux-2-dev',
  'flux-schnell': '@cf/black-forest-labs/flux-1-schnell',
};

const MODEL_INFO = Object.keys(MODELS).map((id) => ({
  id,
  model: MODELS[id],
}));

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/download/') && request.method === 'POST') {
      const password = request.headers.get('x-download-password');

      if (password !== env.BOOK_DOWNLOAD_PASSWORD) {
        return Response.json(
          {
            success: false,
            error: 'Invalid download password.',
          },
          { status: 401 }
        );
      }

      const file = url.pathname.replace('/api/download/', '');

      return env.ASSETS.fetch(
        new Request(new URL(`/books/${file}`, request.url))
      );
    }

    if (url.pathname === '/api/test') {
      return Response.json({
        success: true,
        message: 'Gopal AI Studio backend is online.',
      });
    }

    if (url.pathname === '/api/models' && request.method === 'GET') {
      return Response.json({
        success: true,
        models: MODEL_INFO,
      });
    }

const response = await env.ASSETS.fetch(request);

if (response.status === 404) {
  return env.ASSETS.fetch(
    new Request(new URL('/index.html', request.url))
  );
}

return response;
