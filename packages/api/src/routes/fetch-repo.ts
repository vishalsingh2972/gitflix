import { Router } from 'express';
import axios from 'axios';
import { extractProjectInfo } from '../utils/parse-readme';
import { generateCinematicScript } from '../utils/generate-script';

export const fetchRepoRouter = Router();

// Utility: Fetch repo data (reusable)
async function fetchRepoData(repoUrl: string) {
  const trimmed = repoUrl.replace(/\/$/, '');
  const match = trimmed.match(/github\.com\/([^\/]+)\/([^\/]+)/);

  if (!match) {
    throw new Error('Invalid GitHub URL');
  }

  const [, owner, repo] = match;

  // Fetch repo metadata
  const { data: repoData } = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  // Fetch README
  let readmeText = '';
  try {
    const { data: readmeData } = await axios.get(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
    );
    readmeText = readmeData;
  } catch {
    try {
      const { data: readmeData } = await axios.get(
        `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
      );
      readmeText = readmeData;
    } catch {
      readmeText = '_README not found._';
    }
  }

  return {
    repoData,
    readmeText,
    owner,
    repo,
  };
}

// Route: POST /api/fetch-repo
fetchRepoRouter.post('/fetch-repo', async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: 'repoUrl is required' });
  }

  try {
    const { repoData, readmeText } = await fetchRepoData(repoUrl);

    const projectInfo = extractProjectInfo({
      name: repoData.name,
      description: repoData.description,
      readme: readmeText,
    });

    projectInfo.stars = repoData.stargazers_count;
    projectInfo.url = repoData.html_url;

    res.json(projectInfo);
  } catch (error: any) {
    console.error('Fetch error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch repo',
      details: error.message,
    });
  }
});

// Route: POST /api/generate-script
fetchRepoRouter.post('/generate-script', async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: 'repoUrl is required' });
  }

  try {
    const { repoData, readmeText } = await fetchRepoData(repoUrl);

    const projectInfo = extractProjectInfo({
      name: repoData.name,
      description: repoData.description,
      readme: readmeText,
    });

    projectInfo.stars = repoData.stargazers_count;
    projectInfo.url = repoData.html_url;

    const script = await generateCinematicScript(projectInfo);

    res.json({
      script,
      projectInfo,
    });
  } catch (error: any) {
    console.error('Script generation error:', error.message);
    res.status(500).json({
      error: 'Failed to generate script',
      details: error.message,
    });
  }
});