import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return new Response(JSON.stringify({ error: 'Yêu cầu text' }), { status: 400 });
    }

    const credentials = process.env.GOOGLE_TTS;
    if (!credentials) {
      return new Response(JSON.stringify({ error: 'GOOGLE_TTS không tồn tại' }), { status: 500 });
    }

    const client = new TextToSpeechClient({
      credentials: JSON.parse(credentials),
    });

    const ttsRequest = {
      input: { text },
      voice: { languageCode: 'vi-VN', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(ttsRequest);
    return new Response(response.audioContent, {
      headers: { 'Content-Type': 'audio/mp3' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}