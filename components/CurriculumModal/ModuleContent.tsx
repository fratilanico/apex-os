import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as LucideIcons from 'lucide-react';
import type { Module, Tool } from '../../types/curriculum';
import { ToolBadge } from './ToolBadge';

interface ModuleContentProps {
  module: Module;
  tools: Tool[];
  activeSectionId?: string;
}

// Terminal-style code block with traffic lights (CYAN accent)
const CodeBlock = ({ children, language }: { children: string; language?: string }) => (
  <div className="my-6 rounded-lg border border-cyan-500/30 bg-black/40 backdrop-blur-sm overflow-hidden">
    <div className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center gap-2">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
      </div>
      <span className="text-xs font-mono text-cyan-400/80">
        {language || 'code'}
      </span>
    </div>
    <pre className="p-4 overflow-x-auto">
      <code className="text-cyan-300 font-mono text-sm leading-relaxed">{children}</code>
    </pre>
  </div>
);

// Table wrapper with border (BLUE accent)
const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6 rounded-lg border border-blue-500/30 bg-blue-950/20 backdrop-blur-sm overflow-hidden">
    <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20">
      <span className="text-xs font-mono text-blue-400">data table</span>
    </div>
    <div className="overflow-x-auto p-4">
      {children}
    </div>
  </div>
);

// Callout/blockquote box (VIOLET accent)
const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6 p-4 rounded-lg border border-violet-500/30 bg-violet-950/20 backdrop-blur-sm">
    <div className="text-white/80 leading-relaxed">{children}</div>
  </div>
);

/**
 * Right content pane displaying module details
 * Renders markdown content with tool badges and key takeaways
 */
export const ModuleContent: React.FC<ModuleContentProps> = ({
  module,
  tools,
  activeSectionId,
}) => {
  // Get the icon component
  const IconComponent = (LucideIcons as any)[module.icon] || LucideIcons.Box;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      {/* Module Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-sm font-mono text-white/40">
            MODULE {module.number}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {module.title}
        </h1>
        
        <p className="text-lg text-white/60 italic mb-4">
          "{module.subtitle}"
        </p>
        
        <div className="flex items-center gap-4 text-sm text-white/40 font-mono">
          <span>⏱️ {module.duration}</span>
        </div>
      </div>

      {/* Objective */}
      <div className="mb-8 p-4 rounded-lg bg-white/[0.02] border border-white/10">
        <h2 className="text-sm font-mono text-cyan-400 mb-2 uppercase tracking-wide">
          Objective
        </h2>
        <p className="text-white/80 leading-relaxed">
          {module.objective}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8 mb-8">
        {module.sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className={`
              scroll-mt-6 transition-all duration-200
              ${activeSectionId === section.id ? 'ring-1 ring-cyan-500/30 rounded-lg p-4 bg-white/[0.01]' : ''}
            `}
          >
            {/* Section Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-cyan-400 font-mono text-sm">
                  {section.id}
                </span>
                <span>{section.title}</span>
              </h2>
              
              {/* Tool badges for this section */}
              {section.tools.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {section.tools.map((toolId) => (
                    <ToolBadge
                      key={toolId}
                      toolId={toolId}
                      tools={tools}
                      size="sm"
                    />
                  ))}
                </div>
              )}
              
              {section.duration && (
                <span className="text-xs text-white/40 font-mono">
                  ⏱️ {section.duration}
                </span>
              )}
            </div>

            {/* Section Content (Markdown) */}
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Headings with better spacing
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-white mb-4 mt-8 first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-white mb-3 mt-8">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-white/90 mb-2 mt-6">{children}</h3>
                  ),
                  
                  // Paragraphs
                  p: ({ children }) => (
                    <p className="text-white/70 leading-relaxed mb-4">{children}</p>
                  ),
                  
                  // Custom cyan bullets for unordered lists
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-6 ml-1">
                      {children}
                    </ul>
                  ),
                  li: ({ children, ...props }) => {
                    // Check if this is part of an ordered list
                    const isOrdered = (props as any).ordered;
                    
                    if (isOrdered) {
                      return (
                        <li className="text-white/70 leading-relaxed ml-6">
                          {children}
                        </li>
                      );
                    }
                    
                    return (
                      <li className="flex items-start gap-3 text-white/70 leading-relaxed">
                        <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                        <span className="flex-1">{children}</span>
                      </li>
                    );
                  },
                  
                  // Ordered lists
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-white/70 space-y-2 mb-6 ml-4">
                      {children}
                    </ol>
                  ),
                  
                  // Code blocks with terminal styling
                  code: ({ inline, children, className, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : undefined;
                    
                    if (inline) {
                      return (
                        <code
                          className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    
                    return (
                      <CodeBlock language={language}>
                        {String(children).replace(/\n$/, '')}
                      </CodeBlock>
                    );
                  },
                  
                  // Tables with blue box wrapper
                  table: ({ children }) => (
                    <TableWrapper>
                      <table className="w-full border-collapse">
                        {children}
                      </table>
                    </TableWrapper>
                  ),
                  thead: ({ children }) => (
                    <thead className="border-b border-blue-500/30">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 text-left text-sm font-semibold text-blue-300">
                      {children}
                    </th>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-blue-500/20">
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      {children}
                    </tr>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3 text-sm text-white/70">
                      {children}
                    </td>
                  ),
                  
                  // Blockquotes as violet callouts
                  blockquote: ({ children }) => (
                    <Callout>{children}</Callout>
                  ),
                  
                  // Strong/bold text
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">{children}</strong>
                  ),
                  
                  // Links
                  a: ({ children, href }) => (
                    <a 
                      href={href}
                      className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {section.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* Key Takeaways */}
      <div className="mt-12 p-6 rounded-lg bg-gradient-to-br from-cyan-500/5 to-violet-500/5 border border-cyan-500/20">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <LucideIcons.CheckCircle className="w-5 h-5 text-cyan-400" />
          Key Takeaways
        </h2>
        <ul className="space-y-2">
          {module.keyTakeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start gap-3 text-white/80">
              <span className="text-cyan-400 mt-1">✓</span>
              <span className="leading-relaxed">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
