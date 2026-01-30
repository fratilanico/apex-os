/**
 * GitHub repository parser.
 * Ingests README + key source files from a public repo.
 */

import { ParsedSource } from './url';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

interface GitHubFile {
  path: string;
  type: string;
  size: number;
}

interface GitHubRepoResponse {
  name: string;
  full_name: string;
  description: string;
  default_branch: string;
}

const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.md', '.yaml', '.yml', '.json', '.toml'];
const MAX_FILE_SIZE = 50000; // 50KB max per file
const MAX_FILES = 20;        // Max files to ingest

/**
 * Extract owner/repo from GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/|$)/);
  if (!match || !match[1] || !match[2]) throw new Error('Invalid GitHub URL. Expected: github.com/owner/repo');
  return { owner: match[1], repo: match[2] };
}

async function githubFetch(path: string): Promise<Response> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  return fetch(`https://api.github.com${path}`, { headers });
}

export async function parseGitHub(url: string): Promise<ParsedSource> {
  const { owner, repo } = parseGitHubUrl(url);

  // Fetch repo info
  const repoResponse = await githubFetch(`/repos/${owner}/${repo}`);
  if (!repoResponse.ok) {
    throw new Error(`GitHub repo not found or inaccessible: ${owner}/${repo}`);
  }
  const repoInfo: GitHubRepoResponse = await repoResponse.json();

  // Fetch file tree
  const treeResponse = await githubFetch(`/repos/${owner}/${repo}/git/trees/${repoInfo.default_branch}?recursive=1`);
  if (!treeResponse.ok) {
    throw new Error('Failed to fetch repository file tree');
  }
  const treeData = await treeResponse.json();

  // Filter to relevant source files
  const sourceFiles: GitHubFile[] = treeData.tree
    .filter((f: GitHubFile) =>
      f.type === 'blob' &&
      CODE_EXTENSIONS.some(ext => f.path.endsWith(ext)) &&
      f.size <= MAX_FILE_SIZE &&
      !f.path.includes('node_modules') &&
      !f.path.includes('.git/')
    )
    .slice(0, MAX_FILES);

  // Always prioritize README
  const readmePath = treeData.tree.find((f: GitHubFile) =>
    f.path.toLowerCase() === 'readme.md' && f.type === 'blob'
  );
  if (readmePath && !sourceFiles.find(f => f.path === readmePath.path)) {
    sourceFiles.unshift(readmePath);
  }

  // Fetch file contents
  const contents: string[] = [];
  for (const file of sourceFiles) {
    try {
      const fileResponse = await githubFetch(`/repos/${owner}/${repo}/contents/${file.path}`);
      if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        const decoded = atob(fileData.content);
        contents.push(`// FILE: ${file.path}\n${decoded}`);
      }
    } catch {
      // Skip files that fail to fetch
      continue;
    }
  }

  const content = contents.join('\n\n---\n\n');

  if (content.length < 100) {
    throw new Error('Could not extract sufficient content from repository');
  }

  return {
    title: `${repoInfo.full_name}`,
    content,
    url: `https://github.com/${owner}/${repo}`,
    metadata: {
      owner,
      repo,
      description: repoInfo.description,
      files_ingested: sourceFiles.length,
      source_type: 'github',
    },
  };
}
