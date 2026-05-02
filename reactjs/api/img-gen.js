
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    const HF_TOKEN = process.env.VITE_HUGGINGFACE_KEY;

    if (!HF_TOKEN) {
      return new Response(JSON.stringify({ error: 'Token Missing' }), { status: 500 });
    }

    // Using a faster, more reliable model for testing
    const model = "stabilityai/stable-diffusion-2-1";
    
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
        const err = await response.text();
        return new Response(`HF Error: ${err}`, { status: response.status });
    }

    const blob = await response.blob();
    return new Response(blob, {
        headers: { "Content-Type": "image/jpeg" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
