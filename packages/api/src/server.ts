import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchRepoRouter } from './routes/fetch-repo';
import { generateVideoRouter } from './routes/generate-video';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'API is running 🚀' });
});

app.use('/api', fetchRepoRouter);
app.use('/api', generateVideoRouter);

app.use('/videos', express.static('public/videos'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔧 API server running on http://localhost:${PORT}`);
});