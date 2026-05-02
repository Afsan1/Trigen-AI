
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

    // Using the user's preferred model
    const model = "black-forest-labs/FLUX.1-schnell";
    
    console.log(`Calling HF model: ${model}`);
    
    const hfResponse = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          "x-use-cache": "false"
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!hfResponse.ok) {
        const errText = await hfResponse.text();
        return new Response(`HuggingFace API Error (${hfResponse.status}): ${errText}`, { 
            status: hfResponse.status,
            headers: { "Content-Type": "text/plain" }
        });
    }

    const blob = await hfResponse.blob();
    return new Response(blob, {
        headers: { 
            "Content-Type": "image/jpeg",
            "X-Proxy-Success": "true"
        }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
