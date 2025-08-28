import { Router } from 'express';
import { generateVoiceover } from '../utils/text-to-speech';

export const generateAudioRouter = Router();

generateAudioRouter.post('/generate-audio', async (req, res) => {
  const { script } = req.body;

  if (!script) {
    return res.status(400).json({ error: 'Script is required' });
  }

  try {
    // Generate voiceover and get URL
    const audioUrl = await generateVoiceover(script);
    res.json({ audioUrl });
  } catch (error: any) {
    console.error('Audio generation failed:', error.message);
    res.status(500).json({
      error: 'Failed to generate audio',
      details: error.message,
    });
  }
});