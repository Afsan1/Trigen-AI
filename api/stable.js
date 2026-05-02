
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const HF_TOKEN = process.env.VITE_HUGGINGFACE_KEY;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
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
      return res.status(response.status).send(err);
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    return res.send(Buffer.from(buffer));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
