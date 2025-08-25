

console.log('🎯 Loading parse-readme.ts');

try {
  const Remarkable = require('remarkable');
  console.log('✅ remarkable loaded:', typeof Remarkable);
  console.log('🔍 Is Remarkable a function?', typeof Remarkable === 'function');
  if (typeof Remarkable !== 'function') {
    console.error('❌ Remarkable is not a constructor:', Remarkable);
  }
} catch (err) {
  console.error('💥 Error loading remarkable:', err);
}

const Remarkable = require('remarkable');

type Token = any;

type RawInfo = {
  name: string;
  description: string;
  readme: string;
};

export function extractProjectInfo({ name, description, readme }: RawInfo) {
  console.log('🔧 extractProjectInfo called');
  console.log('📝 README length:', readme.length);

  // ✅ SAFETY: If README is too short, skip parsing
  if (!readme || typeof readme !== 'string' || readme.length < 50) {
    console.warn('⚠️ Skipping README parse: too short or invalid');
    return {
      name,
      description: description || 'A powerful open-source project',
      problem: 'Solves common development challenges',
      solution: 'With clean, scalable architecture',
      features: ['Fast', 'Reliable', 'Well-documented'],
      techStack: ['JavaScript', 'TypeScript', 'Node.js'], // fallback
      stars: 0,
      url: `https://github.com/${name}`,
      readmePreview: readme || 'No README available',
    };
  }

  try {
    const md = new Remarkable();
    console.log('✅ Remarkable instance created');
    
    let tokens: any[] = [];
    try {
      tokens = md.parse(readme);
    } catch (parseErr) {
      console.error('❌ Markdown parse failed:', parseErr);
      throw new Error('Invalid Markdown');
    }

    console.log('✅ Parsed tokens count:', tokens.length);

    const sections: Record<string, string> = {};
    let currentSection = 'INTRO';

    // ✅ Guard against undefined tokens
    if (!Array.isArray(tokens)) {
      console.error('❌ Tokens is not an array:', tokens);
      throw new Error('Parser returned invalid tokens');
    }

    tokens.forEach((token: any, index: number) => {
      // ✅ Skip if token is undefined
      if (!token) return;

      if (token.type === 'heading_open' && token.level === 2) {
        const nextToken = tokens[index + 1];
        if (nextToken && nextToken.type === 'inline' && typeof nextToken.content === 'string') {
          const content = nextToken.content.trim();
          if (content) {
            currentSection = content.toLowerCase();
          }
        }
      } else if (token.type === 'paragraph') {
        const nextToken = tokens[index + 1];
        if (nextToken && nextToken.type === 'inline' && typeof nextToken.content === 'string') {
          const content = nextToken.content.trim();
          if (content) {
            sections[currentSection] = (sections[currentSection] || '') + ' ' + content;
          }
        }
      }
    });

    console.log('✅ Sections extracted:', Object.keys(sections));

    const clean = (text: string) => text.replace(/\s+/g, ' ').trim().slice(0, 500);

    const result = {
      name,
      description: description || clean(sections.intro || sections.description || ''),
      problem: clean(sections.problem || ''),
      solution: clean(sections.solution || ''),
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

    console.log('✅ extractProjectInfo success');
    return result;
  } catch (error: any) {
    console.error('❌ extractProjectInfo failed:', error.message || error);
    
    // ✅ Fallback even on error
    return {
      name,
      description: description || 'A powerful open-source project',
      problem: 'Improves developer experience',
      solution: 'With modern tooling and architecture',
      features: ['Open Source', 'Well Maintained', 'Community Driven'],
      techStack: ['JavaScript', 'TypeScript', 'React'],
      stars: 0,
      url: `https://github.com/${name}`,
      readmePreview: readme.slice(0, 200),
    };
  }
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