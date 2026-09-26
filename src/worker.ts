export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
}

const MODELS: Record<string, string> = {
  'flux-klein-4b': '@cf/black-forest-labs/flux-2-klein-4b',
  'flux-klein-9b': '@cf/black-forest-labs/flux-2-klein-9b',
  'flux-dev': '@cf/black-forest-labs/flux-2-dev',
  'flux-schnell': '@cf/black-forest-labs/flux-1-schnell',

  'nano-banana': 'google/nano-banana',
  'nano-banana-2': 'google/nano-banana-2',
  'nano-banana-pro': 'google/nano-banana-pro',
};

const MODEL_INFO = [
  {
    id: 'flux-klein-4b',
    name: 'FLUX.2 Klein 4B',
    provider: 'Cloudflare',
  },
  {
    id: 'flux-klein-9b',
    name: 'FLUX.2 Klein 9B',
    provider: 'Cloudflare',
  },
  {
    id: 'flux-dev',
    name: 'FLUX.2 Dev',
    provider: 'Cloudflare',
  },
  {
    id: 'flux-schnell',
    name: 'FLUX.1 Schnell',
    provider: 'Cloudflare',
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    provider: 'Google',
  },
  {
    id: 'nano-banana-2',
    name: 'Nano Banana 2',
    provider: 'Google',
  },
  {
    id: 'nano-banana-pro',
    name: 'Nano Banana Pro',
    provider: 'Google',
  },
];

const RATIOS: Record<string, [number, number]> = {
  '1:1': [1024, 1024],
  '4:3': [1152, 864],
  '3:4': [864, 1152],
  '16:9': [1344, 768],
  '9:16': [768, 1344],
};

const NANO_RATIOS = new Set([
  '1:1',
  '3:2',
  '2:3',
  '3:4',
  '4:3',
  '4:5',
  '5:4',
  '9:16',
  '16:9',
  '21:9',
]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

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

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      try {
        const incoming = await request.formData();

        const prompt = incoming.get('prompt');
        const ratioValue = incoming.get('ratio');
        const modelValue = incoming.get('model');

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

        const model =
          typeof modelValue === 'string' && MODELS[modelValue]
            ? modelValue
            : 'flux-klein-4b';

        const modelId = MODELS[model];

        const ratio =
          typeof ratioValue === 'string' && ratioValue
            ? ratioValue
            : '1:1';

        const reference = incoming.get('reference');

        const isNano = model.startsWith('nano-banana');

        if (isNano) {
          const nanoRatio = NANO_RATIOS.has(ratio)
            ? ratio
            : '1:1';

          const input: Record<string, unknown> = {
            prompt: prompt.trim(),
            aspect_ratio: nanoRatio,
            output_format: 'jpg',
          };

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

            const bytes = await reference.arrayBuffer();
            const uint8 = new Uint8Array(bytes);

            let binary = '';

            for (let i = 0; i < uint8.length; i++) {
              binary += String.fromCharCode(uint8[i]);
            }

            const base64 = btoa(binary);

            input.image_input = [
              `data:${reference.type};base64,${base64}`,
            ];
          }

          const result = await env.AI.run(modelId, input);

          return Response.json({
            success: true,
            model,
            ratio: nanoRatio,
            image: result,
          });
        }

        const safeRatio = RATIOS[ratio]
          ? ratio
          : '1:1';

        const [width, height] = RATIOS[safeRatio];

        const form = new FormData();

        form.append('prompt', prompt.trim());
        form.append('width', String(width));
        form.append('height', String(height));

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

        const result = await env.AI.run(modelId, {
          multipart: {
            body: formResponse.body!,
            contentType: formResponse.headers.get('content-type')!,
          },
        });

        return Response.json({
          success: true,
          model,
          ratio: safeRatio,
          width,
          height,
          image: result,
        });
      } catch (error) {
        console.error('AI generation error:', error);

return Response.json(
  {
    success: false,
    error: error instanceof Error ? error.message : String(error),
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
