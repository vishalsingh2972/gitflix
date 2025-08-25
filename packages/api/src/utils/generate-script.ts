import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCinematicScript(projectInfo: any): Promise<string> {
  const prompt = `
You are a cinematic narrator for a Netflix-style tech documentary.
Create a 45-second dramatic script (max 120 words) for this GitHub project.

Project: ${projectInfo.name}
Description: ${projectInfo.description}
Features: ${projectInfo.features.join(', ')}
Tech: ${projectInfo.techStack.join(', ')}

Tone: Epic, mysterious, inspiring. Use short punchy lines.
Include:
- A powerful opening ("A new era begins...")
- Hype for features
- "This isn't just code. It's a revolution."
- End with: "Star the repo. Join the movement."

Add [MUSIC SWELL], [CODE GLITCH], [SCREEN FLASH] as cues.

Script:
`;

  const  response = await openai.completions.create({
    model: 'gpt-4o',
    prompt,
    max_tokens: 180,
    temperature: 0.9,
    stop: null,
  });

  return response.choices[0].text.trim();
}