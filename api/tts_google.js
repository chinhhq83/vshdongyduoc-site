require('dotenv').config(); // Chỉ cần khi chạy local
const textToSpeech = require('@google-cloud/text-to-speech');

let credentials;
try {
  credentials = JSON.parse(process.env.GOOGLE_TTS);
} catch (err) {
  console.error('Invalid GOOGLE_TTS environment variable:', err.message);
  // Trên Vercel, không cần fallback vì GOOGLE_TTS được set trong dashboard
}

const client = new textToSpeech.TextToSpeechClient({
  credentials
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    console.log('TTS request:', { text, languageCode: 'vi-VN' });
    const request = {
      input: { text },
      voice: { languageCode: "vi-VN", ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3" }
    };

    const [response] = await client.synthesizeSpeech(request);
    console.log('TTS success, audio length:', response.audioContent.length);
    const audioContent = response.audioContent.toString("base64");

    res.status(200).json({ audioContent });
  } catch (err) {
    console.error('TTS error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};