export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const response = await fetch("https://api.fpt.ai/hmi/tts/v5", {
      method: "POST",
      headers: {
        "api-key": process.env.FPT_API_KEY,
        "voice": "banmai",
        "speed": "0"
      },
      body: text,
    });

    const result = await response.json();
    return res.status(200).json(result); // { async: "https://..." }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
