// import { OpenAI } from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function generateCinematicScript(projectInfo: any): Promise<string> {
//   const prompt = `
// You are a cinematic narrator for a Netflix-style tech documentary.
// Create a 45-second dramatic script (max 120 words) for this GitHub project.

// Project: ${projectInfo.name}
// Description: ${projectInfo.description}
// Features: ${projectInfo.features?.join(', ') || 'Innovative features'}
// Tech: ${projectInfo.techStack?.join(', ') || 'Modern stack'}

// Tone: Epic, mysterious, inspiring. Use short punchy lines.
// Include:
// - A powerful opening ("A new era begins...")
// - Hype for features
// - "This isn't just code. It's a revolution."
// - End with: "Star the repo. Join the movement."

// Add [MUSIC SWELL], [CODE GLITCH], [SCREEN FLASH] as cues.

// Script:
// `;

//   try {
//     const response = await openai.completions.create({
//       model: 'gpt-4o',
//       prompt,
//       max_tokens: 180,
//       temperature: 0.9,
//       stop: null,
//     });

//     if (!response.choices || response.choices.length === 0) {
//       throw new Error('No choices returned from OpenAI');
//     }

//     const script = response.choices[0]?.text?.trim();
//     if (!script) {
//       throw new Error('Empty script generated');
//     }

//     return script;
//   } catch (error: any) {
//     console.error('OpenAI API error:', error.message || error);
//     throw new Error('Failed to generate script');
//   }
// }


// Mock function — bypass OpenAI entirely
export async function generateCinematicScript(projectInfo: any): Promise<string> {
  return `
A new era begins...
${projectInfo.name} isn't just another tool. It's a revolution.
Built with ${projectInfo.techStack?.slice(0, 3).join(', ') || 'cutting-edge tech'},
it solves ${projectInfo.problem || 'real-world problems'} in record time.
This isn't code. It's magic.
[CODE GLITCH] [MUSIC SWELL]
Star the repo. Join the movement.
  `.trim();
}