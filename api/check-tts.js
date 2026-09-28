// file: api/check-tts.js
export default async function handler(req, res) {
  try {
    const raw = process.env.GOOGLE_TTS;

    if (!raw) {
      return res.status(500).json({ error: "GOOGLE_TTS is not set" });
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({ error: "GOOGLE_TTS is not valid JSON", details: e.message });
    }

    // Chỉ trả về một số trường, không log private_key
    res.status(200).json({
      ok: true,
      project_id: parsed.project_id,
      client_email: parsed.client_email,
      hasPrivateKey: !!parsed.private_key,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
