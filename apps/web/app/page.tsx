'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/card';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [script, setScript] = useState('');
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTrailer = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setLoading(true);
    setError('');
    setScript('');
    setProjectInfo(null);

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate script');
      }

      const data = await res.json();
      setScript(data.script);
      setProjectInfo(data.projectInfo);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    alert('Script copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-300 mb-2">🎬 Gitflix</h1>
          <p className="text-lg text-gray-300">
            Turn any GitHub repo into a <strong>Netflix-style trailer</strong> in seconds.
          </p>
        </header>

        {/* Input Form */}
        <Card className="bg-gray-900 border-green-700 mb-8">
          <CardHeader>
            <CardTitle>Enter GitHub Repository URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/vercel/next.js"
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              onClick={generateTrailer}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-3"
            >
              {loading ? 'Generating...' : '🎬 Generate Trailer Script'}
            </Button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Output */}
        {script && (
          <Card className="bg-gray-900 border-green-700 mb-6">
            <CardHeader>
              <CardTitle>Cinematic Trailer Script</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-black p-4 border border-gray-700 rounded mb-4 text-green-400">
                {script}
              </pre>
              <Button onClick={copyScript} className="bg-gray-700 hover:bg-gray-600">
                📋 Copy Script
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Project Info */}
        {projectInfo && (
          <div className="text-sm text-gray-400 space-y-1">
            <p>
              <strong>Repo:</strong> {projectInfo.name}
            </p>
            <p>
              <strong>Description:</strong> {projectInfo.description}
            </p>
            <p>
              <strong>Stars:</strong> {projectInfo.stars?.toLocaleString()}
            </p>
            <p>
              <strong>Tech:</strong> {projectInfo.techStack?.join(', ') || 'Unknown'}
            </p>
            <p>
              <a
                href={projectInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                View on GitHub →
              </a>
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          Built with Next.js, Turborepo, and a lot of 💻 + 🎬
          <br />
          <em>"Star the repo. Join the movement."</em>
        </footer>
      </div>
    </div>
  );
}