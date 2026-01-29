import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface SessionExportRequest {
  messages: Message[];
  format: 'claude-code' | 'cursor' | 'opencode' | 'jsonl' | 'markdown';
  metadata?: {
    projectName?: string;
    activeFiles?: string[];
    frontierContext?: string[];
  };
}

// Claude Code format - CLAUDE.md style context file
function formatClaudeCode(messages: Message[], metadata: SessionExportRequest['metadata']): string {
  let output = `# APEX OS Session Export

> Exported from APEX Terminal - ${new Date().toISOString()}

## Project Context
${metadata?.projectName ? `Project: ${metadata.projectName}` : ''}
${metadata?.activeFiles?.length ? `\nActive Files:\n${metadata.activeFiles.map(f => `- ${f}`).join('\n')}` : ''}

## Conversation Transcript

`;

  for (const msg of messages) {
    const role = msg.role === 'user' ? '**User**' : '**APEX**';
    output += `### ${role}\n${msg.content}\n\n`;
  }

  if (metadata?.frontierContext?.length) {
    output += `## Frontier Intelligence Context\n\n`;
    metadata.frontierContext.forEach(ctx => {
      output += `- ${ctx}\n`;
    });
  }

  return output;
}

// Cursor Composer format - conversation as JSONL
function formatCursor(messages: Message[], metadata: SessionExportRequest['metadata']): string {
  const cursorFormat = {
    version: 1,
    type: 'apex-os-export',
    project: metadata?.projectName || 'apex-session',
    files: metadata?.activeFiles || [],
    conversation: messages.map((msg, i) => ({
      id: `msg-${i}`,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp || new Date().toISOString()
    }))
  };
  return JSON.stringify(cursorFormat, null, 2);
}

// OpenCode format - AGENTS.md style
function formatOpenCode(messages: Message[], metadata: SessionExportRequest['metadata']): string {
  let output = `# AGENTS.md - APEX OS Session

## Session Context

This session was exported from APEX OS Terminal.

### Instructions for Agent

Continue the conversation below. The user was working on:
${metadata?.projectName ? `- Project: ${metadata.projectName}` : '- General coding assistance'}
${metadata?.activeFiles?.length ? `- Files: ${metadata.activeFiles.join(', ')}` : ''}

### Conversation History

`;

  for (const msg of messages) {
    if (msg.role === 'user') {
      output += `USER: ${msg.content}\n\n`;
    } else {
      output += `ASSISTANT: ${msg.content}\n\n`;
    }
  }

  output += `---
Continue from here. Maintain context from the conversation above.
`;

  return output;
}

// JSONL format - universal
function formatJSONL(messages: Message[], metadata: SessionExportRequest['metadata']): string {
  const lines: string[] = [];

  // Metadata line
  lines.push(JSON.stringify({
    type: 'metadata',
    source: 'apex-os',
    exportedAt: new Date().toISOString(),
    ...metadata
  }));

  // Message lines
  for (const msg of messages) {
    lines.push(JSON.stringify({
      type: 'message',
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
  }

  return lines.join('\n');
}

// Markdown format - human readable
function formatMarkdown(messages: Message[], metadata: SessionExportRequest['metadata']): string {
  let output = `# APEX OS Session Transcript

**Exported:** ${new Date().toLocaleString()}
${metadata?.projectName ? `**Project:** ${metadata.projectName}` : ''}

---

`;

  for (const msg of messages) {
    const emoji = msg.role === 'user' ? '👤' : '🤖';
    const role = msg.role === 'user' ? 'You' : 'APEX Terminal';
    output += `## ${emoji} ${role}\n\n${msg.content}\n\n---\n\n`;
  }

  return output;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, format, metadata } = req.body as SessionExportRequest;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  if (!format) {
    return res.status(400).json({ error: 'format required (claude-code, cursor, opencode, jsonl, markdown)' });
  }

  let output: string;
  let filename: string;
  let contentType: string;

  switch (format) {
    case 'claude-code':
      output = formatClaudeCode(messages, metadata);
      filename = 'CLAUDE.md';
      contentType = 'text/markdown';
      break;
    case 'cursor':
      output = formatCursor(messages, metadata);
      filename = 'apex-session.cursor.json';
      contentType = 'application/json';
      break;
    case 'opencode':
      output = formatOpenCode(messages, metadata);
      filename = 'AGENTS.md';
      contentType = 'text/markdown';
      break;
    case 'jsonl':
      output = formatJSONL(messages, metadata);
      filename = 'apex-session.jsonl';
      contentType = 'application/jsonl';
      break;
    case 'markdown':
      output = formatMarkdown(messages, metadata);
      filename = 'apex-session.md';
      contentType = 'text/markdown';
      break;
    default:
      return res.status(400).json({ error: `Unknown format: ${format}` });
  }

  return res.status(200).json({
    success: true,
    format,
    filename,
    contentType,
    content: output,
    size: output.length
  });
}
