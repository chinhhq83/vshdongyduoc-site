const textToSpeech = require("@google-cloud/text-to-speech");

module.exports = async (req, res) => {
  try {
    const text = (req.query.text || "Xin chào").toString();

    if (!process.env.GOOGLE_TTS) {
      return res.status(500).json({ error: "Missing GOOGLE_TTS environment variable" });
    }

    const credentials = JSON.parse(process.env.GOOGLE_TTS);
    const client = new textToSpeech.TextToSpeechClient({ credentials });

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: "vi-VN", ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3" },
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(response.audioContent, "base64"));
  } catch (err) {
    console.error("TTS Error:", err);
    res.status(500).json({ error: err.message });
  }
};
