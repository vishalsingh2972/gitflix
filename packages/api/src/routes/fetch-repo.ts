import { Router } from 'express';
import axios from 'axios';
import { extractProjectInfo } from '../utils/parse-readme';

export const fetchRepoRouter = Router();

fetchRepoRouter.post('/fetch-repo', async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: 'repoUrl is required' });
  }

  try {
    const trimmed = repoUrl.replace(/\/$/, '');
    const match = trimmed.match(/github\.com\/([^\/]+)\/([^\/]+)/);

    if (!match) {
      return res.status(400).json({ error: 'Invalid GitHub URL' });
    }

    const [, owner, repo] = match;

    // Fetch repo metadata
    const {  data: repoData } = await axios.get(
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
      const {  data: readmeData } = await axios.get(
        `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
      );
      readmeText = readmeData;
    } catch {
      try {
        const {  data: readmeData } = await axios.get(
          `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
        );
        readmeText = readmeData;
      } catch {
        readmeText = '_README not found._';
      }
    }

    // Extract structured info
    const projectInfo = extractProjectInfo({
      name: repoData.name,
      description: repoData.description,
      readme: readmeText,
    });

    res.json(projectInfo);
  } catch (error: any) {
    console.error('Fetch error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch repo',
      details: error.message,
    });
  }
});