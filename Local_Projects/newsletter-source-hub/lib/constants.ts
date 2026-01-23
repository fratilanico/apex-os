import { Source } from './types';

export const DEFAULT_SOURCES: Source[] = [
  // Python
  { id: "python-insider", name: "Python Insider", feed_url: "https://blog.python.org/feeds/posts/default?alt=rss", topic: "python", weight: 1.5, active: true },
  { id: "pypi-blog", name: "PyPI Blog", feed_url: "https://blog.pypi.org/feed.xml", topic: "python", weight: 1.3, active: true },
  { id: "realpython", name: "Real Python", feed_url: "https://realpython.com/atom.xml", topic: "python", weight: 1.1, active: true },
  { id: "ms-python", name: "Microsoft Python", feed_url: "https://devblogs.microsoft.com/python/feed/", topic: "python", weight: 1.0, active: true },

  // JS/TS
  { id: "nodejs-blog", name: "Node.js Blog", feed_url: "https://nodejs.org/en/feed/blog.xml", topic: "javascript", weight: 1.3, active: true },
  { id: "v8-blog", name: "V8 Engine", feed_url: "https://v8.dev/blog.atom", topic: "javascript", weight: 1.2, active: true },
  { id: "typescript-rel", name: "TypeScript Releases", feed_url: "https://github.com/microsoft/TypeScript/releases.atom", topic: "typescript", weight: 1.4, active: true },
  { id: "react-rel", name: "React Releases", feed_url: "https://github.com/facebook/react/releases.atom", topic: "javascript", weight: 1.3, active: true },
  { id: "nextjs-rel", name: "Next.js Releases", feed_url: "https://github.com/vercel/next.js/releases.atom", topic: "javascript", weight: 1.4, active: true },

  // PHP
  { id: "php-net", name: "PHP.net", feed_url: "https://www.php.net/feed.atom", topic: "php", weight: 1.4, active: true },
  { id: "laravel-news", name: "Laravel News", feed_url: "https://laravel-news.com/feed", topic: "php", weight: 1.2, active: true },
  { id: "symfony-blog", name: "Symfony Blog", feed_url: "https://symfony.com/blog/rss.xml", topic: "php", weight: 1.1, active: true },

  // AI
  { id: "openai-news", name: "OpenAI", feed_url: "https://openai.com/news/rss.xml", topic: "ai", weight: 1.5, active: true },
  { id: "deepmind", name: "DeepMind", feed_url: "https://deepmind.google/discover/blog/feed/basic/", topic: "ai", weight: 1.4, active: true },
  { id: "nvidia-dl", name: "NVIDIA AI", feed_url: "https://blogs.nvidia.com/blog/category/deep-learning/feed/", topic: "ai", weight: 1.2, active: true },
  { id: "marktechpost", name: "MarkTechPost", feed_url: "https://www.marktechpost.com/feed/", topic: "ai", weight: 1.0, active: true },
  { id: "venturebeat", name: "VentureBeat", feed_url: "https://venturebeat.com/feed/", topic: "ai-business", weight: 0.9, active: true },
  
  // General
  { id: "theverge", name: "The Verge", feed_url: "https://www.theverge.com/rss/index.xml", topic: "tech", weight: 0.8, active: true },
  
  // High Volume / Guaranteed Flow
  { id: "hackernews", name: "Hacker News", feed_url: "https://hnrss.org/newest?points=100", topic: "tech", weight: 1.0, active: true },
  { id: "devto", name: "Dev.to", feed_url: "https://dev.to/feed", topic: "webdev", weight: 0.9, active: true },
];

export const KEYWORD_BOOSTS: Record<string, number> = {
  "release": 5, "stable": 3, "cve": 10, "security": 5,
  "openai": 2, "anthropic": 2, "gpt": 2, "llm": 2,
  "python": 1, "javascript": 1, "php": 1, "rust": 1
};
