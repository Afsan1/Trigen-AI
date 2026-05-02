
// Use standard Node.js fetch (available in Node 18+)
module.exports = async (req, res) => {
    // Enable CORS for this API route
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const HF_TOKEN = process.env.VITE_HUGGINGFACE_KEY;

    if (!HF_TOKEN) {
        return res.status(500).json({ error: 'HuggingFace token is missing in Vercel environment variables.' });
    }

    try {
        console.log("Calling HuggingFace with prompt:", prompt);
        
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
            console.error("HF API Error:", text);
            return res.status(response.status).send(`HuggingFace Error: ${text}`);
        }

        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'image/png');
        return res.send(Buffer.from(buffer));

    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: `Server Proxy Error: ${error.message}` });
    }
};
