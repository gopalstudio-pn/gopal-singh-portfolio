export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
  BOOK_DOWNLOAD_PASSWORD: string;
}

const MODELS = {
  "flux-schnell": "@cf/black-forest-labs/flux-1-schnell",
  "flux-klein-4b": "@cf/black-forest-labs/flux-2-klein-4b",
  "sdxl-lightning": "@cf/bytedance/stable-diffusion-xl-lightning",
  "dreamshaper": "@cf/lykon/dreamshaper-8-lcm",
  "sdxl-base": "@cf/stabilityai/stable-diffusion-xl-base-1.0",
};

const STREAM_MODELS = ["sdxl-lightning", "dreamshaper", "sdxl-base"];

const SEO_SITE = "https://pnsingh.com.np";

type SeoPage = { title: string; desc: string; app?: string };

const SEO_PAGES: Record<string, SeoPage> = {
  "/tools": {
    title: "Free Online Tools",
    desc: "Free tools by Gopal Studio: a stylish name generator, name logo and signature maker, Nepali date converter and WhatsApp link and QR maker. No sign-up.",
  },
  "/tools/name-studio": {
    title: "Stylish Name Generator, Logo & Signature Maker",
    desc: "Turn your name into 60 stylish fonts, a logo or a handwritten signature. Free, instant and no sign-up. Copy or download in seconds.",
    app: "DesignApplication",
  },
  "/tools/nepali-date": {
    title: "Nepali Date Converter & Age Calculator",
    desc: "Convert Bikram Sambat to English dates and back, see today's Nepali date and calculate your exact age. Free and fast.",
    app: "UtilitiesApplication",
  },
  "/tools/qr": {
    title: "WhatsApp Link & QR Code Maker",
    desc: "Create a WhatsApp chat link and QR codes for links, Wi-Fi and contact cards. Free, private and made on your device.",
    app: "UtilitiesApplication",
  },
  "/books": {
    title: "Library",
    desc: "Gopal Singh's library of books on money, habits, startups and personal growth.",
  },
  "/ai-studio": {
    title: "AI Studio",
    desc: "Create AI images, movie posters and collector cards in your browser with Gopal Studio's AI Studio.",
  },
  "/connect": {
    title: "Connect",
    desc: "Connect with Gopal Singh on Instagram, YouTube, WhatsApp, Facebook, TikTok and email.",
  },
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

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const GOPAL_INFO =
          "You are Ask Gopal AI, the assistant on Gopal Singh's personal portfolio website. Answer in 2 to 4 short, friendly sentences. Use only these facts. Gopal Singh completed a Bachelor of Science (B.Sc.) at RRM Campus, Janakpurdham, Nepal. He is curious by nature and interested where creativity meets technology: photography, AI and digital experiences. His certifications, all from Google, are Digital Marketing and E-commerce, Data Analytics, Ads Certification and a Digital Marketing training. His site has social links for Facebook, Instagram, YouTube, WhatsApp, TikTok and Gmail. His skill areas are: Web and Digital (web development, digital marketing, content creation, online research); AI and Technology (artificial intelligence, generative AI, AI tools, prompt engineering); Creative (photography, photo editing, video editing, visual design); Communication (communication, presentation, public speaking, teamwork); Personal (creativity, problem solving, adaptability, time management). The website has a Library page with 10 books, for example The Psychology of Money and Atomic Habits, and a free AI Studio page that makes images from a prompt and an optional reference face. Contact email: gopalsingh.pn@gmail.com, or use the contact form on the homepage. If asked anything not listed here, say you do not know and suggest contacting Gopal by email. Gopal is from Golbazar, Siraha, Nepal. When asked where he lives or is from, say only that, and never share a street address, phone number or any more exact location. Never invent facts about Gopal. Reply in the same language the visitor writes in. You can answer in English, Hindi and Maithili. If the visitor writes Hindi or Maithili, reply in Devanagari script with short, simple sentences, and if you are unsure of a Maithili word, use simple Hindi instead.";
        const data: any = await request.json();
        const incoming = Array.isArray(data.messages) ? data.messages : [];
        const history = incoming
          .slice(-6)
          .map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content || "").slice(0, 500),
          }))
          .filter((m: any) => m.content);
        if (!history.length) {
          return Response.json({ success: false, error: "Ask a question first." }, { status: 400 });
        }
        const result: any = await (env.AI as any).run(
          "@cf/meta/llama-3.1-8b-instruct-fp8-fast",
          { messages: [{ role: "system", content: GOPAL_INFO }, ...history], max_tokens: 250 }
        );
        return Response.json({ success: true, reply: String(result.response || "").trim() });
      } catch (err) {
        return Response.json({ success: false, error: "The assistant is busy. Please try again." }, { status: 500 });
      }
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
          const referenceFile = form.get("reference");
          let finalPrompt = prompt;
          if (
            referenceFile &&
            typeof referenceFile !== "string" &&
            referenceFile.size > 0
          ) {
            body.append("input_image_0", referenceFile, "reference.jpg");
            finalPrompt =
              "Keep the exact same face, identity and features of the person in image 0. " +
              prompt;
          }
          body.append("prompt", finalPrompt);
          body.append("width", String(width));
          body.append("height", String(height));
          const packed = new Response(body);
          result = await (env.AI as any).run(modelId, {
            multipart: {
              body: packed.body,
              contentType: packed.headers.get("content-type"),
            },
          });
        } else if (STREAM_MODELS.includes(modelKey)) {
          const steps =
            modelKey === "sdxl-base" ? 20 : modelKey === "dreamshaper" ? 6 : 4;
          const stream = await (env.AI as any).run(modelId, {
            prompt,
            width,
            height,
            num_steps: steps,
          });
          const buffer = await new Response(stream).arrayBuffer();
          const bytes = new Uint8Array(buffer);
          let binary = "";
          const chunk = 0x8000;
          for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
          }
          result = "data:image/png;base64," + btoa(binary);
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

    // SPA fallback for React Router, with per-page SEO tags in the HTML
    if (response.status === 404) {
      const home = await env.ASSETS.fetch(new Request(new URL("/", request.url)));
      const path = url.pathname.replace(/\/+$/, "") || "/";
      const page = SEO_PAGES[path];
      if (!page || !home.ok) return home;

      const title = page.title + " | Gopal Studio";
      const canonical = SEO_SITE + path;
      const setContent = (value: string) => ({
        element(el: any) {
          el.setAttribute("content", value);
        },
      });
      let extra = '<link rel="canonical" href="' + canonical + '" /><meta property="og:url" content="' + canonical + '" />';
      if (page.app) {
        const ld = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: page.title,
          url: canonical,
          description: page.desc,
          applicationCategory: page.app,
          operatingSystem: "Any",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@type": "Person", name: "Gopal Singh", url: SEO_SITE + "/" },
        };
        extra += '<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, "\\u003c") + "</script>";
      }

      return new HTMLRewriter()
        .on("title", {
          element(el: any) {
            el.setInnerContent(title);
          },
        })
        .on('meta[name="description"]', setContent(page.desc))
        .on('meta[property="og:title"]', setContent(title))
        .on('meta[property="og:description"]', setContent(page.desc))
        .on('meta[name="twitter:title"]', setContent(title))
        .on('meta[name="twitter:description"]', setContent(page.desc))
        .on("head", {
          element(el: any) {
            el.append(extra, { html: true });
          },
        })
        .transform(home);
    }

    return response;
  },
};
