import {
  siAngular,
  siApachecassandra,
  siAstro,
  siAuth0,
  siBootstrap,
  siCloudflare,
  siClerk,
  siCssmodules,
  siCypress,
  siDjango,
  siDrizzle,
  siExpress,
  siFastapi,
  siFirebase,
  siGooglecloud,
  siGraphql,
  siJest,
  siLaravel,
  siMongodb,
  siMysql,
  siNetlify,
  siNestjs,
  siOpenid,
  siPostgresql,
  siPrisma,
  siPytest,
  siReact,
  siRedis,
  siRubyonrails,
  siSass,
  siSequelize,
  siSpringboot,
  siSqlite,
  siSvelte,
  siSupabase,
  siTailwindcss,
  siVitest,
  siVuedotjs,
  siVercel,
} from 'simple-icons';

export type BrandIcon = {
  title: string;
  hex: string;
  path: string;
};

type TechnologyBase = {
  id: string;
  name: string;
};

export type Technology =
  | (TechnologyBase & { icon: BrandIcon; mark?: never })
  | (TechnologyBase & { icon?: never; mark: CustomMark });

export type CustomMark =
  | 'typeorm'
  | 'eloquent'
  | 'sqlalchemy'
  | 'aws'
  | 'azure'
  | 'memcached'
  | 'rest'
  | 'grpc'
  | 'sessions'
  | 'jwt'
  | 'playwright'
  | 'phpunit';

export type Category = {
  id: string;
  name: string;
  prompt: string;
  technologies: readonly Technology[];
};

export const categories = [
  {
    id: 'frontend',
    name: 'Frontend framework',
    prompt: 'What will users see and interact with?',
    technologies: [
      { id: 'react', name: 'React', icon: siReact },
      { id: 'vue', name: 'Vue.js', icon: siVuedotjs },
      { id: 'angular', name: 'Angular', icon: siAngular },
      { id: 'svelte', name: 'Svelte', icon: siSvelte },
      { id: 'astro', name: 'Astro', icon: siAstro },
    ],
  },
  {
    id: 'backend',
    name: 'Backend framework',
    prompt: 'What will power your application behind the scenes?',
    technologies: [
      { id: 'laravel', name: 'Laravel', icon: siLaravel },
      { id: 'django', name: 'Django', icon: siDjango },
      { id: 'fastapi', name: 'FastAPI', icon: siFastapi },
      { id: 'ruby-on-rails', name: 'Rails', icon: siRubyonrails },
      { id: 'express', name: 'Express', icon: siExpress },
      { id: 'nestjs', name: 'NestJS', icon: siNestjs },
      { id: 'spring-boot', name: 'Spring Boot', icon: siSpringboot },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    prompt: 'Where will your application’s data live?',
    technologies: [
      { id: 'postgresql', name: 'PostgreSQL', icon: siPostgresql },
      { id: 'mysql', name: 'MySQL', icon: siMysql },
      { id: 'sqlite', name: 'SQLite', icon: siSqlite },
      { id: 'mongodb', name: 'MongoDB', icon: siMongodb },
      { id: 'apache-cassandra', name: 'Cassandra', icon: siApachecassandra },
      { id: 'supabase', name: 'Supabase', icon: siSupabase },
    ],
  },
  {
    id: 'data-toolkit',
    name: 'ORM / database toolkit',
    prompt: 'How will your code work with stored data?',
    technologies: [
      { id: 'prisma', name: 'Prisma', icon: siPrisma },
      { id: 'drizzle', name: 'Drizzle', icon: siDrizzle },
      { id: 'typeorm', name: 'TypeORM', mark: 'typeorm' },
      { id: 'sequelize', name: 'Sequelize', icon: siSequelize },
      { id: 'eloquent', name: 'Eloquent', mark: 'eloquent' },
      { id: 'sqlalchemy', name: 'SQLAlchemy', mark: 'sqlalchemy' },
    ],
  },
  {
    id: 'styling',
    name: 'Styling',
    prompt: 'How will you shape the look and feel?',
    technologies: [
      { id: 'tailwind', name: 'Tailwind CSS', icon: siTailwindcss },
      { id: 'bootstrap', name: 'Bootstrap', icon: siBootstrap },
      { id: 'sass', name: 'Sass', icon: siSass },
      { id: 'css-modules', name: 'CSS Modules', icon: siCssmodules },
    ],
  },
  {
    id: 'hosting',
    name: 'Hosting / deployment',
    prompt: 'Where will your application run?',
    technologies: [
      { id: 'vercel', name: 'Vercel', icon: siVercel },
      { id: 'netlify', name: 'Netlify', icon: siNetlify },
      { id: 'aws', name: 'AWS', mark: 'aws' },
      { id: 'google-cloud', name: 'Google Cloud', icon: siGooglecloud },
      { id: 'azure', name: 'Azure', mark: 'azure' },
      { id: 'cloudflare', name: 'Cloudflare', icon: siCloudflare },
    ],
  },
  {
    id: 'caching',
    name: 'Caching',
    prompt: 'Will you keep frequently used data close at hand?',
    technologies: [
      { id: 'redis', name: 'Redis', icon: siRedis },
    ],
  },
  {
    id: 'api',
    name: 'API style',
    prompt: 'How will parts of your system talk to each other?',
    technologies: [
      { id: 'rest', name: 'REST', mark: 'rest' },
      { id: 'graphql', name: 'GraphQL', icon: siGraphql },
      { id: 'grpc', name: 'gRPC', mark: 'grpc' },
    ],
  },
  {
    id: 'authentication',
    name: 'Authentication',
    prompt: 'How will people securely sign in?',
    technologies: [
      { id: 'sessions', name: 'Session-based authentication', mark: 'sessions' },
      { id: 'jwt', name: 'JWT', mark: 'jwt' },
      { id: 'oidc', name: 'OAuth 2.0 / OpenID Connect', icon: siOpenid },
      { id: 'auth0', name: 'Auth0', icon: siAuth0 },
      { id: 'clerk', name: 'Clerk', icon: siClerk },
      { id: 'firebase-auth', name: 'Firebase Authentication', icon: siFirebase },
    ],
  },
  {
    id: 'testing',
    name: 'Testing',
    prompt: 'How will you know everything is working?',
    technologies: [
      { id: 'vitest', name: 'Vitest', icon: siVitest },
      { id: 'jest', name: 'Jest', icon: siJest },
      { id: 'playwright', name: 'Playwright', mark: 'playwright' },
      { id: 'cypress', name: 'Cypress', icon: siCypress },
      { id: 'phpunit', name: 'PHPUnit', mark: 'phpunit' },
      { id: 'pytest', name: 'pytest', icon: siPytest },
    ],
  },
] as const satisfies readonly Category[];

export type CategoryId = (typeof categories)[number]['id'];
export type TechnologyId = (typeof categories)[number]['technologies'][number]['id'];
export type Selections = {
  [Category in (typeof categories)[number] as Category['id']]?: Category['technologies'][number]['id'];
};
