export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
}

const MODEL = '@cf/black-forest-labs/flux-2-klein-4b';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/test') {
      return Response.json({
        success: true,
        message: 'Gopal AI Studio backend is online.'
      });
    }

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      try {
        const incoming = await request.formData();
        const prompt = incoming.get('prompt');

        if (typeof prompt !== 'string' || !prompt.trim()) {
          return Response.json(
            { success: false, error: 'A prompt is required.' },
            { status: 400 }
          );
        }

        if (prompt.length > 1000) {
          return Response.json(
            { success: false, error: 'Prompt is too long.' },
            { status: 400 }
          );
        }

        const form = new FormData();

        form.append('prompt', prompt.trim());
        form.append('width', '1024');
        form.append('height', '1024');

        const reference = incoming.get('reference');

        if (reference instanceof File) {
          if (!reference.type.startsWith('image/')) {
            return Response.json(
              { success: false, error: 'Reference must be an image.' },
              { status: 400 }
            );
          }

          form.append('input_image_0', reference);
        }

        const formResponse = new Response(form);

        const result = await env.AI.run(MODEL, {
          multipart: {
            body: formResponse.body!,
            contentType: formResponse.headers.get('content-type')!
          }
        });

        return Response.json({
          success: true,
          image: result
        });
      } catch (error) {
        console.error('AI generation error:', error);

        return Response.json(
          {
            success: false,
            error: 'Image generation failed. Please try again.'
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
