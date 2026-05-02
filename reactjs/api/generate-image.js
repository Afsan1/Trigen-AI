
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    
    // Vercel handles VITE_ prefix variables in the backend too
    const HF_TOKEN = process.env.VITE_HUGGINGFACE_KEY;

    if (!HF_TOKEN) {
        return res.status(500).json({ error: 'HuggingFace token is missing in Vercel environment variables.' });
    }

    try {
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

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).send(`HuggingFace Error: ${text}`);
        }

        const buffer = await response.arrayBuffer();
        
        // Return the image as a buffer
        res.setHeader('Content-Type', 'image/png');
        return res.send(Buffer.from(buffer));

    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: `Server Proxy Error: ${error.message}` });
    }
}
