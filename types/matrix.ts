import { LucideIcon } from 'lucide-react';

export type NodeStatus = 'locked' | 'discovered' | 'active' | 'completed' | 'remedial';
export type NodeType = 'COGNITIVE_BASE' | 'AGENT_LOGIC' | 'CLI_INTERFACE' | 'LOW_LEVEL_ENGINE' | 'VALIDATION' | 'BRANCH' | 'FORK' | 'KNOWLEDGE_CELL';

export interface MatrixNodeData {
  id: string;
  label: string;
  type: NodeType;
  status: NodeStatus;
  progress: number;
  icon?: LucideIcon;
  hidden_criteria?: string;
}

export interface MatrixNode {
  id: string;
  type: 'oasis';
  position: { x: number; y: number };
  data: MatrixNodeData;
  selected?: boolean;
}

export interface MatrixEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
  style?: React.CSSProperties;
}

export interface DirectorPayload {
  newNodes: MatrixNode[];
  newEdges: MatrixEdge[];
  narrativeUpdate: {
    transmission: string;
    traceLevel: number;
    sentiment: 'neutral' | 'hostile' | 'impressed' | 'glitch';
  };
  solvedNodeIds: string[];
}
