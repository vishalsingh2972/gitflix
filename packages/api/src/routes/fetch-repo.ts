import { Router } from 'express';
import axios from 'axios';
import { extractProjectInfo } from '../utils/parse-readme';
import { generateCinematicScript } from '../utils/generate-script';

export const fetchRepoRouter = Router();

// Utility: Fetch repo data (reusable)
async function fetchRepoData(repoUrl: string) {
  // Clean and parse URL
  const trimmed = repoUrl.trim().replace(/\/+$/, '');
  const match = trimmed.match(/github\.com\/([^\/]+)\/([^\/]+)$/i);

  if (!match) {
    throw new Error('Invalid GitHub URL. Expected format: https://github.com/owner/repo');
  }

  const [, owner, repo] = match;

  // Fetch repo metadata
  let repoData;
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
        'User-Agent': 'Gitflix-Trailer-Generator',
      },
    });
    repoData = response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Repository not found');
    } else if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Check GITHUB_TOKEN.');
    } else {
      throw new Error(`Failed to fetch repo data: ${error.message}`);
    }
  }

  // Fetch README
  let readmeText = '_README not found._';
  try {
    const { data } = await axios.get(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
      { responseType: 'text' }
    );
    readmeText = data;
  } catch (mainErr) {
    try {
      const { data } = await axios.get(
        `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`,
        { responseType: 'text' }
      );
      readmeText = data;
    } catch (masterErr) {
      console.warn(`[fetchRepoData] No README found in 'main' or 'master' for ${owner}/${repo}`);
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