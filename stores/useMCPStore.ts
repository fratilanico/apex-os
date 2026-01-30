import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MCPTransport = 'stdio' | 'sse' | 'websocket';

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface MCPServer {
  id: string;
  name: string;
  version: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  transport: MCPTransport;
  capabilities: {
    resources: boolean;
    prompts: boolean;
    tools: boolean;
  };
  tools: MCPTool[];
}

interface MCPState {
  // State
  registry: MCPServer[];
  mountedServers: string[]; // IDs of currently active servers
  
  // Actions
  registerServer: (server: MCPServer) => void;
  mountServer: (serverId: string) => void;
  unmountServer: (serverId: string) => void;
  updateServerStatus: (serverId: string, status: MCPServer['status']) => void;
  
  // Computed
  getMountedTools: () => MCPTool[];
  isMounted: (serverId: string) => boolean;
}

export const useMCPStore = create<MCPState>()(
  persist(
    (set, get) => ({
      // Initial standard MCP servers (from 2026 specs)
      registry: [
        {
          id: 'filesystem-mcp',
          name: 'Filesystem Node',
          version: '2.1.0',
          status: 'CONNECTED',
          transport: 'stdio',
          capabilities: { resources: true, prompts: true, tools: true },
          tools: [
            { name: 'read_file', description: 'Read content from secure microVM jail', parameters: { path: 'string' } },
            { name: 'write_file', description: 'Write optimized code to guest disk', parameters: { path: 'string', content: 'string' } },
          ]
        },
        {
          id: 'spanner-mcp',
          name: 'Google Spanner',
          version: '1.4.2',
          status: 'DISCONNECTED',
          transport: 'sse',
          capabilities: { resources: true, prompts: false, tools: true },
          tools: [
            { name: 'execute_query', description: 'Run DDL/DML on relational core', parameters: { sql: 'string' } },
            { name: 'inspect_schema', description: 'Retrieve table structures', parameters: {} },
          ]
        },
        {
          id: 'browser-mcp',
          name: 'Headless Browser',
          version: '3.0.1',
          status: 'DISCONNECTED',
          transport: 'stdio',
          capabilities: { resources: false, prompts: true, tools: true },
          tools: [
            { name: 'screenshot', description: 'Capture UI state for multimodal analysis', parameters: { url: 'string' } },
            { name: 'click_element', description: 'Simulate user interaction', parameters: { selector: 'string' } },
          ]
        },
        {
          id: 'v0-mcp',
          name: 'Vercel v0 Generator',
          version: '1.0.0',
          status: 'DISCONNECTED',
          transport: 'sse',
          capabilities: { resources: false, prompts: false, tools: true },
          tools: [
            { name: 'generate_component', description: 'Generate React components using v0.dev', parameters: { prompt: 'string' } },
            { name: 'refactor_ui', description: 'Refactor UI code with v0 context', parameters: { code: 'string', prompt: 'string' } },
          ]
        }
      ],
      mountedServers: ['filesystem-mcp'],

      registerServer: (server) => set((state) => ({
        registry: [...state.registry.filter(s => s.id !== server.id), server]
      })),

      mountServer: (serverId) => {
        const { mountedServers } = get();
        if (!mountedServers.includes(serverId)) {
          set({ mountedServers: [...mountedServers, serverId] });
        }
      },

      unmountServer: (serverId) => set((state) => ({
        mountedServers: state.mountedServers.filter(id => id !== serverId)
      })),

      updateServerStatus: (serverId, status) => set((state) => ({
        registry: state.registry.map(s => s.id === serverId ? { ...s, status } : s)
      })),

      getMountedTools: () => {
        const { registry, mountedServers } = get();
        return registry
          .filter(s => mountedServers.includes(s.id))
          .flatMap(s => s.tools);
      },

      isMounted: (serverId) => get().mountedServers.includes(serverId),
    }),
    {
      name: 'vibe-mcp-registry',
    }
  )
);
