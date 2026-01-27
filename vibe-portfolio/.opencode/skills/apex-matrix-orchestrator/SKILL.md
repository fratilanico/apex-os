---
name: apex-matrix-orchestrator
description: Implementation guidelines for Phase 2: Neural Synchronization. Covers useMatrixStore, AI Director integration, CodeMachine-CLI logic adaptation, and visual graph synchronization.
---

# Apex Matrix Orchestrator

This skill provides the architectural blueprints and implementation steps for Phase 2 of the APEX OS.

## Core Components

### 1. Sovereign Matrix Store (`useMatrixStore.ts`)
The central state management for the Learning Matrix.

**State Definition**:
- `nodes`: `MatrixNode[]` (id, type, status, metadata)
- `edges`: `MatrixEdge[]` (id, source, target, animation)
- `activeNodeId`: `string | null`
- `terminalContext`: `string[]` (last 10 interactions)

**Actions**:
- `setNodes`, `updateNode`, `addNode`
- `setEdges`, `addEdge`
- `setActiveNode`, `syncTerminalContext`
- `processDirectorResponse(payload: DirectorPayload)`

### 2. AI Director API (`api/matrix-director.ts`)
The Gemini 3 Flash powered backend that evaluates performance and mutates the graph.

**Endpoint**: `POST /api/matrix-director`
**Input**: `{ currentGraph, terminalLog, userGoal }`
**Output**: `DirectorPayload` (newNodes, newEdges, narrativeUpdate, solvedNodeIds)

### 3. CodeMachine-CLI Adaptation
Porting the CLI orchestration logic to the browser environment.

- **Workflow Loader**: Maps Matrix nodes to CodeMachine specifications.
- **Agent Swarm UI**: Visualizes parallel agent execution in the terminal and matrix.

## Implementation Steps

### Phase 2.1: Data Layer
1. Create `stores/useMatrixStore.ts` following the definition above.
2. Initialize with base nodes from `data/curriculumData.ts`.

### Phase 2.2: The Director's Handshake
1. Implement `api/matrix-director.ts` using `@google-cloud/vertexai`.
2. Configure system prompt for high-velocity reasoning and JSON output.

### Phase 2.3: Visual Sync
1. Update `components/artifacts/PlayerOne/ApexMatrixHUD.tsx` to subscribe to `useMatrixStore`.
2. Implement "The Singularity Pulse" and "Neural Nebula" animations.

### Phase 2.4: Terminal Integration
1. Update `ApexTerminalHUD.tsx` to push logs to the Director.
2. Link terminal command results to Matrix node unlocking triggers.

## Reference Files
- [Master Plan](../../../apex-platform/APEX_MASTER.md)
- [Curriculum Data](../../../data/curriculumData.ts)
- [CodeMachine CLI Source](../../../tmp/CodeMachine-CLI/)
