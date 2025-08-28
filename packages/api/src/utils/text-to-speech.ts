import { Readable } from 'stream';
import { ElevenLabsClient } from 'elevenlabs';
import * as fs from 'fs';
import * as path from 'path';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY || '',
});

const AUDIO_DIR = path.join(__dirname, '../../public/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

/**
 * Generates AI voiceover and saves to disk
 * @param text - Script to narrate
 * @returns URL to audio file
 */
export async function generateVoiceover(text: string): Promise<string> {
  console.log('🔊 Generating voiceover for script:', text.substring(0, 100) + '...');

  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not set');
  }

  const outputPath = path.join(AUDIO_DIR, 'generated.mp3');

  try {
    // ✅ Clean the script
    let cleanText = text
      .replace(/\[.*?\]/g, '')     // Remove [CODE GLITCH], [MUSIC SWELL]
      .replace(/\n+/g, ' ')        // Replace newlines with space
      .replace(/\s+/g, ' ')        // Collapse multiple spaces
      .trim();

    // ✅ Truncate to safe length (under 1500 chars)
    if (cleanText.length > 1500) {
      cleanText = cleanText.substring(0, 1500);
    }

    // ✅ Log final text
    console.log('🎤 Sending to ElevenLabs:', cleanText);

    // ✅ Generate voiceover with cleaned text
    const audioStream = await client.generate({
      voice: 'Rachel',
      model_id: 'eleven_monolingual_v1',
      text: cleanText,
      stream: true,
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream as unknown as Readable) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(outputPath, buffer);

    console.log('✅ Voiceover saved:', outputPath);
    return 'http://localhost:3001/audio/generated.mp3';
  } catch (error: any) {
    console.error('❌ ElevenLabs API error:', error.message || error);
    throw new Error('Failed to generate voiceover');
  }
}