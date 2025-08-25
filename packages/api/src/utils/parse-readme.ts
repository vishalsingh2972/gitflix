const remarkable = require('remarkable');
const Remarkable = remarkable.default || remarkable;

type Token = any;

type RawInfo = {
  name: string;
  description: string;
  readme: string;
};

export function extractProjectInfo({ name, description, readme }: RawInfo) {
  const md = new Remarkable();
  const tokens: Token[] = md.parse(readme, {});

  const sections: Record<string, string> = {};
  let currentSection = 'INTRO';

  tokens.forEach((token: Token) => {
    if (token.type === 'heading_open' && token.level === 2) {
      const nextToken = tokens[tokens.indexOf(token) + 1];
      if (nextToken && nextToken.type === 'inline' && typeof nextToken.content === 'string') {
        const content = nextToken.content.trim();
        if (content) {
          currentSection = content.toLowerCase();
        }
      }
    } else if (token.type === 'paragraph' || token.type === 'list_item_open') {
      const nextToken = tokens[tokens.indexOf(token) + 1];
      if (nextToken && nextToken.type === 'inline' && typeof nextToken.content === 'string') {
        const content = nextToken.content.trim();
        if (content) {
          sections[currentSection] = (sections[currentSection] || '') + ' ' + content;
        }
      }
    }
  });

  const clean = (text: string) => text.replace(/\s+/g, ' ').trim().slice(0, 500);

  return {
    name,
    description: description || clean(sections.intro || sections.description || sections[''] || ''),
    problem: clean(sections.problem || sections['what it solves'] || ''),
    solution: clean(sections.solution || sections['how it works'] || ''),
    features: Array.from(
      new Set(
        (sections.features || sections.usage || '')
          .split(/[\n\-*]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 10 && s.length < 100)
          .slice(0, 5)
      )
    ),
    techStack: extractTechStack(readme),
    stars: 0,
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