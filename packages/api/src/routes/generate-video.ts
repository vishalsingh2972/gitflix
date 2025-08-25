import { Router } from 'express';
import { generateCinematicScript } from '../utils/generate-script';
import { fetchRepoData } from './fetch-repo';

export const generateVideoRouter = Router();

generateVideoRouter.post('/generate-video', async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: 'repoUrl is required' });
  }

  try {
    // Reuse existing logic
    const { repoData, readmeText } = await fetchRepoData(repoUrl);

    const projectInfo = {
      name: repoData.name,
      description: repoData.description,
      readme: readmeText,
      stars: repoData.stargazers_count,
      url: repoData.html_url,
    };

    const script = await generateCinematicScript(projectInfo);

    // ✅ For now: return script + mock video URL
    res.json({
      script,
      videoUrl: `/videos/mock-trailer.mp4`, // we'll generate real one later
      status: 'Video generation queued (mock mode)',
    });
  } catch (error: any) {
    console.error('Video generation error:', error);
    res.status(500).json({
      error: 'Failed to generate video',
      details: error.message,
    });
  }
});