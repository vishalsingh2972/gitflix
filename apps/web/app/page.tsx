'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [script, setScript] = useState('');
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoStatus, setVideoStatus] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate script from GitHub repo
  const generateTrailer = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setLoading(true);
    setError('');
    setScript('');
    setProjectInfo(null);
    setVideoUrl('');
    setVideoStatus('');

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

  // Generate video trailer (mock for now)
  const generateVideo = async () => {
    setVideoStatus('Generating video...');
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate video');
      }

      const data = await res.json();
      setVideoUrl(data.videoUrl);
      setVideoStatus('');
    } catch (err: any) {
      setVideoStatus('Failed to generate video');
    }
  };

  // Copy script to clipboard
  const copyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h1 className="text-6xl font-bold text-green-300 mb-4 tracking-wide">
            🎬 <span className="text-white">Git</span>flix
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Turn any GitHub repo into a{' '}
            <span className="text-green-400 font-semibold">
              Netflix-style trailer
            </span>{' '}
            in seconds.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Input and Controls */}
          <div className="space-y-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-900 border-green-700 shadow-2xl rounded-2xl hover:shadow-green-700/40 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-green-300 text-xl flex items-center gap-2">
                    🔗 GitHub Repository URL
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="relative">
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/vishalsingh2972/Simple-DEX"
                      className="w-full p-4 rounded-lg bg-gray-800 border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <Button
                    onClick={generateTrailer}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 
                      hover:from-green-700 hover:to-green-600 
                      text-black font-bold py-4 text-lg rounded-xl
                      transition-all duration-300 transform 
                      hover:scale-105 hover:-translate-y-1
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                        Generating...
                      </span>
                    ) : (
                      '🎬 Generate Trailer Script'
                    )}
                  </Button>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg"
                    >
                      <p className="text-sm">{error}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Info */}
            <AnimatePresence>
              {projectInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-gray-900 border-green-700 shadow-2xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-green-300 text-xl flex items-center gap-2">
                        📊 Repository Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-400 font-medium">Repo:</span>
                          <span className="text-white font-semibold">
                            {projectInfo.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-start py-2 border-b border-gray-700">
                          <span className="text-gray-400 font-medium">Description:</span>
                          <span className="text-white text-right max-w-xs">
                            {projectInfo.description}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-400 font-medium">Stars:</span>
                          <span className="text-yellow-400 font-semibold">
                            ⭐ {projectInfo.stars?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-start py-2 border-b border-gray-700">
                          <span className="text-gray-400 font-medium">Tech Stack:</span>
                          <span className="text-blue-300 text-right max-w-xs">
                            {projectInfo.techStack?.join(', ') || 'Unknown'}
                          </span>
                        </div>
                        <div className="pt-3">
                          <a
                            href={projectInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 hover:underline transition-colors duration-200"
                          >
                            View on GitHub →
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Generation Controls */}
            {script && !videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Button
                  onClick={generateVideo}
                  disabled={!!videoStatus}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                    hover:from-blue-700 hover:to-purple-700 
                    text-white font-bold py-4 text-lg rounded-xl
                    transition-all duration-300 transform 
                    hover:scale-105 hover:-translate-y-1 disabled:opacity-50"
                >
                  {videoStatus ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      {videoStatus}
                    </span>
                  ) : (
                    '🎥 Generate Video Trailer'
                  )}
                </Button>
              </motion.div>
            )}

            {/* Success Message */}
            {videoUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-lg">
                  <p className="font-semibold">🎬 Your Trailer is Ready!</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Script and Video */}
          <div className="space-y-8">
            {/* Script Output */}
            <AnimatePresence>
              {script && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-gray-900 border-green-700 shadow-2xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-green-300 text-xl flex items-center gap-2">
                        🎭 Cinematic Trailer Script
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="whitespace-pre-wrap text-sm bg-black p-4 border-2 border-gray-700 rounded-lg mb-4 text-green-400 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-gray-800">
                          {script}
                        </pre>
                        <div className="relative">
                          <Button
                            onClick={copyScript}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            📋 Copy Script
                          </Button>

                          <AnimatePresence>
                            {copied && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="absolute top-0 right-0 bg-green-600 text-black px-3 py-1 rounded-md text-xs shadow-lg"
                              >
                                ✅ Copied!
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Output */}
            <AnimatePresence>
              {videoUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-gray-900 border-green-700 shadow-2xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-green-300 text-xl flex items-center gap-2">
                        🎬 Generated Trailer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-5">
                        <div className="relative overflow-hidden rounded-lg group">
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-64 object-cover rounded-lg border-2 border-green-700 bg-black transition-all duration-300 group-hover:border-green-500 animate-fade-in"
                            style={{ maxHeight: '256px' }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                        <div className="text-center animate-bounce-in animate-delay-300">
                          <a
                            href={videoUrl}
                            download={`${projectInfo?.name || 'trailer'}-trailer.mp4`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 animate-pulse-subtle"
                          >
                            💾 Download Trailer
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-20 pt-8 border-t border-gray-800">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <p className="text-gray-400 text-sm">
              Built with <span className="text-green-400">Next.js</span>,{' '}
              <span className="text-blue-400">Turborepo</span>, and a lot of 💻 + 🎬
            </p>
            <p className="text-green-300 font-semibold italic">
              "Star the repo. Join the movement."
            </p>
          </motion.div>
        </footer>

        {/* Custom Scrollbar */}
        <style jsx global>{`
          .scrollbar-thin {
            scrollbar-width: thin;
          }
          .scrollbar-thumb-green-700::-webkit-scrollbar-thumb {
            background-color: #15803d;
            border-radius: 6px;
          }
          .scrollbar-track-gray-800::-webkit-scrollbar-track {
            background-color: #1f2937;
          }
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #1f2937;
          }
          ::-webkit-scrollbar-thumb {
            background: #15803d;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #166534;
          }
        `}</style>
      </div>
    </div>
  );
}