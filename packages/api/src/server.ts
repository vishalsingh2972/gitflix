import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fetchRepoRouter } from './routes/fetch-repo';
import { generateVideoRouter } from './routes/generate-video';
import { generateAudioRouter } from './routes/generate-audio';

// Debug: Log key presence
console.log('🔑 ELEVENLABS_API_KEY loaded:', !!process.env.ELEVENLABS_API_KEY ? 'YES' : 'NO');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', fetchRepoRouter);
app.use('/api', generateVideoRouter);
app.use('/api', generateAudioRouter);
app.use('/videos', express.static('public/videos'));
app.use('/audio', express.static('public/audio'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔧 API server running on http://localhost:${PORT}`);
});