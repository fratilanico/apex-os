import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Brain, Workflow, Terminal, Cpu } from 'lucide-react';
import type { MatrixNode, MatrixEdge, DirectorPayload, NodeStatus } from '../types/matrix';

interface MatrixState {
  // State
  nodes: MatrixNode[];
  edges: MatrixEdge[];
  activeNodeId: string | null;
  terminalContext: string[];
  lastTransmission: string | null;
  traceLevel: number;

  // Actions
  setNodes: (nodes: MatrixNode[]) => void;
  updateNode: (id: string, updates: Partial<MatrixNode['data']>) => void;
  addNode: (node: MatrixNode) => void;
  setEdges: (edges: MatrixEdge[]) => void;
  addEdge: (edge: MatrixEdge) => void;
  setActiveNode: (id: string | null) => void;
  syncTerminalContext: (log: string) => void;
  processDirectorResponse: (payload: DirectorPayload) => void;
  resetMatrix: () => void;
}

const initialNodes: MatrixNode[] = [
  { 
    id: '0', 
    type: 'oasis', 
    position: { x: 50, y: 250 }, 
    data: { id: '00', label: 'Sovereign_Core', type: 'COGNITIVE_BASE', status: 'completed', progress: 100, icon: Brain },
    selected: true
  },
  { 
    id: '1', 
    type: 'oasis', 
    position: { x: 400, y: 100 }, 
    data: { id: '01', label: 'Orchestration_Log', type: 'AGENT_LOGIC', status: 'active', progress: 65, icon: Workflow } 
  },
  { 
    id: '2', 
    type: 'oasis', 
    position: { x: 400, y: 400 }, 
    data: { id: '02', label: 'Neural_Terminal', type: 'CLI_INTERFACE', status: 'active', progress: 40, icon: Terminal } 
  },
  { 
    id: '3', 
    type: 'oasis', 
    position: { x: 750, y: 250 }, 
    data: { id: '03', label: 'WASM_Forge', type: 'LOW_LEVEL_ENGINE', status: 'locked', progress: 0, icon: Cpu } 
  },
];

const initialEdges: MatrixEdge[] = [
  { 
    id: 'e0-1', 
    source: '0', 
    target: '1', 
    animated: true, 
    label: 'INIT_STREAM',
  },
  { 
    id: 'e0-2', 
    source: '0', 
    target: '2', 
    animated: true, 
    label: 'CLI_HANDSHAKE',
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3', 
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
  },
];

export const useMatrixStore = create<MatrixState>()(
  persist(
    (set, get) => ({
      // Initial state
      nodes: initialNodes,
      edges: initialEdges,
      activeNodeId: '0',
      terminalContext: [],
      lastTransmission: 'Neural synchronization active. Welcome to the Matrix, Operator.',
      traceLevel: 0,

      // Actions
      setNodes: (nodes) => set({ nodes }),
      
      updateNode: (id, updates) => {
        set((state) => ({
          nodes: state.nodes.map((node) => 
            node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
          )
        }));
      },

      addNode: (node) => {
        if (get().nodes.find(n => n.id === node.id)) return;
        set((state) => ({ nodes: [...state.nodes, node] }));
      },

      setEdges: (edges) => set({ edges }),

      addEdge: (edge) => {
        if (get().edges.find(e => e.id === edge.id)) return;
        set((state) => ({ edges: [...state.edges, edge] }));
      },

      setActiveNode: (id) => set({ activeNodeId: id }),

      syncTerminalContext: (log) => {
        set((state) => ({
          terminalContext: [...state.terminalContext.slice(-9), log]
        }));
      },

      processDirectorResponse: (payload) => {
        const { newNodes, newEdges, narrativeUpdate, solvedNodeIds } = payload;
        
        // Update solved nodes
        const updatedNodes = get().nodes.map(node => {
          if (solvedNodeIds.includes(node.id)) {
            return { ...node, data: { ...node.data, status: 'completed' as NodeStatus, progress: 100 } };
          }
          return node;
        });

        set({
          nodes: [...updatedNodes, ...newNodes],
          edges: [...get().edges, ...newEdges],
          lastTransmission: narrativeUpdate.transmission,
          traceLevel: narrativeUpdate.traceLevel
        });
      },

      resetMatrix: () => set({
        nodes: initialNodes,
        edges: initialEdges,
        activeNodeId: '0',
        terminalContext: [],
        lastTransmission: 'Matrix reset initiated.',
        traceLevel: 0
      }),
    }),
    {
      name: 'apex-matrix-storage',
      version: 1,
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        activeNodeId: state.activeNodeId,
        terminalContext: state.terminalContext,
        lastTransmission: state.lastTransmission,
        traceLevel: state.traceLevel,
      }),
    }
  )
);
