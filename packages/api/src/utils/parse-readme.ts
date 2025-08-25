import { Remarkable } from 'remarkable';

type RawInfo = {
  name: string;
  description: string;
  readme: string;
};

export function extractProjectInfo({ name, description, readme }: RawInfo) {
  const md = new Remarkable();
  const tokens = md.parse(readme, {});

  const sections: Record<string, string> = {};
  let currentSection = 'INTRO';

  tokens.forEach((token) => {
    if (token.type === 'heading_open' && token.level === 2) {
      const contentToken = tokens[tokens.indexOf(token) + 1];
      if (contentToken.type === 'inline') {
        currentSection = contentToken.content.trim().toLowerCase();
      }
    } else if (token.type === 'paragraph' || token.type === 'list_item_open') {
      const contentToken = tokens[tokens.indexOf(token) + 1];
      if (contentToken?.type === 'inline') {
        sections[currentSection] = (sections[currentSection] || '') + ' ' + contentToken.content;
      }
    }
  });

  // Clean up
  const clean = (text: string) => text.replace(/\s+/g, ' ').trim().slice(0, 500);

  return {
    name,
    description: description || clean(sections.intro || sections.description || sections[''] || ''),
    problem: clean(sections.problem || sections['what it solves'] || ''),
    solution: clean(sections.solution || sections['how it works'] || ''),
    features: [
      ...new Set(
        (sections.features || sections.usage || '')
          .split(/[\n\-*]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 10 && s.length < 100)
          .slice(0, 5)
      ),
    ],
    techStack: extractTechStack(readme),
    stars: 0, // will come from API
    url: `https://github.com/${name}`,
    readmePreview: readme.slice(0, 200),
  };
}

function extractTechStack(readme: string): string[] {
  const techKeywords = [
    'React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind', 'Docker',
    'PostgreSQL', 'Redis', 'AWS', 'Kubernetes', 'Prisma', 'Zod', 'Clerk',
    'WebRTC', 'Socket.IO', 'Kafka', 'FFmpeg', 'Pika', 'ElevenLabs'
  ];

  return techKeywords.filter(keyword =>
    new RegExp(`\\b${keyword.replace('.', '\\.')}`, 'i').test(readme)
  );
}