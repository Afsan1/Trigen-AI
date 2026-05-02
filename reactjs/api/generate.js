
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
      return new Response(JSON.stringify({ error: 'Missing HF Token' }), { status: 500 });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    // Return the response directly with a custom header to verify it's the Edge Function
    const finalResponse = new Response(response.body, response);
    finalResponse.headers.set('X-Edge-Proxy', 'true');
    return finalResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
