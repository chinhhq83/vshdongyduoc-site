const textToSpeech = require('@google-cloud/text-to-speech');

export default async function handler(req, res) {
  try {
    // Lấy biến
    const credentials = process.env.GOOGLE_TTS;
    if (!credentials) {
      return res.status(500).json({ error: 'GOOGLE_TTS không tồn tại' });
    }

    // Khởi tạo client
    const client = new textToSpeech.TextToSpeechClient({
      credentials: JSON.parse(credentials),  // Nếu là JSON
      // Hoặc: apiKey: credentials, nếu là API key
    });

    // Request test
    const request = {
      input: { text: 'Xin chào, đây là bài kiểm tra Google TTS' },
      voice: { languageCode: 'vi-VN', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    res.setHeader('Content-Type', 'audio/mp3');
    res.send(response.audioContent);  // Trả về audio
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}