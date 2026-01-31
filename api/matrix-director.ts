import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAI } from '../lib/ai/globalAIService';
import { MATRIX_SYSTEM_PROMPT } from '../lib/ai/prompts/matrix';
import type { MatrixNode, MatrixEdge } from '../types/matrix';

interface GraphContext {
  currentNode: MatrixNode | null;
  adjacentNodes: MatrixNode[];
  allNodes: MatrixNode[];
  allEdges: MatrixEdge[];
  completedCount: number;
  activeCount: number;
  lockedCount: number;
  totalProgress: number;
}

function buildGraphContext(
  nodes: MatrixNode[],
  edges: MatrixEdge[],
  activeNodeId: string | null
): GraphContext {
  const currentNode = nodes.find(n => n.id === activeNodeId) || null;
  
  // Find adjacent nodes (connected by edges)
  const adjacentIds = new Set<string>();
  edges.forEach(edge => {
    if (edge.source === activeNodeId) adjacentIds.add(edge.target);
    if (edge.target === activeNodeId) adjacentIds.add(edge.source);
  });
  const adjacentNodes = nodes.filter(n => adjacentIds.has(n.id));

  // Calculate statistics
  const completedCount = nodes.filter(n => n.data.status === 'completed').length;
  const activeCount = nodes.filter(n => n.data.status === 'active').length;
  const lockedCount = nodes.filter(n => n.data.status === 'locked').length;
  const totalProgress = nodes.reduce((sum, n) => sum + (n.data.progress || 0), 0) / nodes.length;

  return {
    currentNode,
    adjacentNodes,
    allNodes: nodes,
    allEdges: edges,
    completedCount,
    activeCount,
    lockedCount,
    totalProgress: Math.round(totalProgress),
  };
}

function formatGraphContextForPrompt(context: GraphContext): string {
  const lines: string[] = [
    '=== MATRIX GRAPH STATE ===',
    '',
    `📍 CURRENT POSITION:`,
    context.currentNode
      ? `  Node: ${context.currentNode.data.label} (${context.currentNode.data.id})`
      : '  No active node selected',
    '',
    `📊 PROGRESS OVERVIEW:`,
    `  Total Nodes: ${context.allNodes.length}`,
    `  Completed: ${context.completedCount}`,
    `  Active: ${context.activeCount}`,
    `  Locked: ${context.lockedCount}`,
    `  Overall Progress: ${context.totalProgress}%`,
    '',
  ];

  if (context.adjacentNodes.length > 0) {
    lines.push(`🔗 ADJACENT NODES (Available Next Steps):`);
    context.adjacentNodes.forEach(node => {
      const statusEmoji = {
        locked: '🔒',
        discovered: '🔍',
        active: '▶️',
        completed: '✅',
        remedial: '🔧',
      }[node.data.status];
      lines.push(`  ${statusEmoji} ${node.data.label} (${node.data.type}) - ${node.data.progress}%`);
    });
    lines.push('');
  }

  lines.push(`🎯 AVAILABLE QUESTS/CHALLENGES:`);
  const availableNodes = context.allNodes.filter(
    n => n.data.status === 'active' || n.data.status === 'discovered'
  );
  if (availableNodes.length > 0) {
    availableNodes.forEach(node => {
      lines.push(`  • ${node.data.label} [${node.data.type}]`);
      if (node.data.hidden_criteria) {
        lines.push(`    Criteria: ${node.data.hidden_criteria}`);
      }
    });
  } else {
    lines.push('  No active quests available.');
  }
  lines.push('');

  lines.push(`🗺️ GRAPH TOPOLOGY:`);
  lines.push(`  Edges: ${context.allEdges.length} connections`);
  context.allEdges.slice(0, 5).forEach(edge => {
    const source = context.allNodes.find(n => n.id === edge.source)?.data.label || edge.source;
    const target = context.allNodes.find(n => n.id === edge.target)?.data.label || edge.target;
    lines.push(`  ${source} → ${target}${edge.animated ? ' (active)' : ''}`);
  });
  if (context.allEdges.length > 5) {
    lines.push(`  ... and ${context.allEdges.length - 5} more connections`);
  }
  lines.push('');
  lines.push('===========================');

  return lines.join('\n');
}

interface DirectorRequest {
  query?: string;
  currentGraph?: {
    nodes: MatrixNode[];
    edges: MatrixEdge[];
    activeNodeId: string | null;
  };
  terminalLog?: string;
  userGoal?: string;
}

interface DirectorResponse {
  success: boolean;
  response: string;
  provider: 'perplexity' | 'groq' | 'gemini' | 'cohere' | 'none';
  model: string;
  latency: number;
  graphContext?: {
    currentNode: string | null;
    adjacentNodes: string[];
    progress: number;
  };
  suggestions?: {
    nextNodes: string[];
    actions: string[];
  };
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    } as DirectorResponse);
  }

  const { query, currentGraph, terminalLog, userGoal }: DirectorRequest = req.body;

  if (!query && !terminalLog) {
    return res.status(400).json({
      success: false,
      error: 'Either query or terminalLog must be provided',
    } as DirectorResponse);
  }

  try {
    // Build graph context
    let graphContext: GraphContext | null = null;
    let contextString = '';
    
    if (currentGraph?.nodes && currentGraph.nodes.length > 0) {
      graphContext = buildGraphContext(
        currentGraph.nodes,
        currentGraph.edges || [],
        currentGraph.activeNodeId
      );
      contextString = formatGraphContextForPrompt(graphContext);
    }

    // Construct the user message based on input type
    let userMessage = '';
    
    if (query) {
      // NLP query mode
      userMessage = `USER QUERY: ${query}\n\n${contextString}`;
      
      if (terminalLog) {
        userMessage += `\n\nRECENT TERMINAL ACTIVITY:\n${terminalLog}`;
      }
      
      if (userGoal) {
        userMessage += `\n\nUSER OBJECTIVE: ${userGoal}`;
      }
      
      userMessage += `\n\nPlease provide a helpful response that:`;
      userMessage += `\n1. Answers the user's question based on the current graph state`;
      userMessage += `\n2. References specific nodes and their relationships when relevant`;
      userMessage += `\n3. Suggests next steps or actions if appropriate`;
      userMessage += `\n4. Maintains the cyberpunk/sovereign tone of the Matrix`;
    } else {
      // Terminal telemetry mode (original behavior)
      userMessage = `${contextString}\n\nTERMINAL_TELEMETRY: ${terminalLog}\n\nUSER_GOAL: ${userGoal || 'None specified'}\n\nAnalyze telemetry and provide graph mutation recommendations.`;
    }

    // Call the global AI service
    const aiResponse = await queryAI({
      message: userMessage,
      systemPrompt: MATRIX_SYSTEM_PROMPT,
      preferredProvider: 'auto',
    });

    // Parse suggestions from the response if it's an NLP query
    let suggestions: { nextNodes: string[]; actions: string[] } | undefined;
    if (query && graphContext) {
      suggestions = {
        nextNodes: graphContext.adjacentNodes
          .filter(n => n.data.status !== 'locked')
          .map(n => n.data.label),
        actions: ['Explore adjacent nodes', 'Review completed challenges', 'Check available quests'],
      };
    }

    // Build the response
    const response: DirectorResponse = {
      success: true,
      response: aiResponse.content,
      provider: aiResponse.provider,
      model: aiResponse.model,
      latency: aiResponse.latency,
      ...(graphContext && {
        graphContext: {
          currentNode: graphContext.currentNode?.data.label || null,
          adjacentNodes: graphContext.adjacentNodes.map(n => n.data.label),
          progress: graphContext.totalProgress,
        },
      }),
      ...(suggestions && { suggestions }),
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Matrix Director API Error:', error);
    return res.status(500).json({
      success: false,
      response: '',
      error: error.message || 'Director offline. Neural link severed.',
      provider: 'none',
      model: 'none',
      latency: 0,
    } as DirectorResponse);
  }
}
