export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
}

const MODEL = '@cf/black-forest-labs/flux-2-klein-4b';

const RATIOS: Record<string, [number, number]> = {
  '1:1': [1024, 1024],
  '4:3': [1152, 864],
  '3:4': [864, 1152],
  '16:9': [1344, 768],
  '9:16': [768, 1344],
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/test') {
      return Response.json({
        success: true,
        message: 'Gopal AI Studio backend is online.',
      });
    }

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      try {
        const incoming = await request.formData();

        const prompt = incoming.get('prompt');
        const ratioValue = incoming.get('ratio');

        if (typeof prompt !== 'string' || !prompt.trim()) {
          return Response.json(
            {
              success: false,
              error: 'A prompt is required.',
            },
            { status: 400 }
          );
        }

        if (prompt.length > 1000) {
          return Response.json(
            {
              success: false,
              error: 'Prompt is too long.',
            },
            { status: 400 }
          );
        }

        const ratio =
          typeof ratioValue === 'string' && RATIOS[ratioValue]
            ? ratioValue
            : '1:1';

        const [width, height] = RATIOS[ratio];

        const form = new FormData();

        form.append('prompt', prompt.trim());
        form.append('width', String(width));
        form.append('height', String(height));

        const reference = incoming.get('reference');

        if (reference instanceof File) {
          if (!reference.type.startsWith('image/')) {
            return Response.json(
              {
                success: false,
                error: 'Reference must be an image.',
              },
              { status: 400 }
            );
          }

          form.append('input_image_0', reference);
        }

        const formResponse = new Response(form);

        const result = await env.AI.run(MODEL, {
          multipart: {
            body: formResponse.body!,
            contentType: formResponse.headers.get('content-type')!,
          },
        });

        return Response.json({
          success: true,
          ratio,
          width,
          height,
          image: result,
        });
      } catch (error) {
        console.error('AI generation error:', error);

        return Response.json(
          {
            success: false,
            error: 'Image generation failed. Please try again.',
          },
          { status: 500 }
        );
      }
    }

    if (request.method === 'GET') {
      const assetResponse = await env.ASSETS.fetch(request);

      if (assetResponse.status === 404) {
        return env.ASSETS.fetch(
          new Request(new URL('/', request.url), request)
        );
      }

      return assetResponse;
    }

    return env.ASSETS.fetch(request);
  },
};
