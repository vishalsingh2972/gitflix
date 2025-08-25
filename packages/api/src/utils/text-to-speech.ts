import { Readable } from 'stream';
import { ElevenLabsClient } from 'elevenlabs';

// ✅ Pass API key explicitly
const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY || '', // provide fallback to avoid undefined
});

export async function generateVoiceover(text: string): Promise<Buffer> {
  console.log('🔊 Starting voiceover generation...');

  // ✅ Explicitly check for API key
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY is missing in .env');
    throw new Error('ELEVENLABS_API_KEY is not set');
  }

  try {
    const audioStream = await client.generate({
      voice: 'Rachel',
      model_id: 'eleven-monolingual-v1',
      text,
      stream: false, // important: false = return full audio
    });

    // Collect audio chunks
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream as unknown as Readable) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);
    console.log('✅ AI voiceover generated successfully');
    return buffer;
  } catch (error: any) {
    console.error('❌ ElevenLabs API error:', error.message || error);
    throw new Error('Failed to generate voiceover');
  }
}