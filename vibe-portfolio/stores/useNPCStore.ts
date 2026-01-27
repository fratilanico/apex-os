import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  NPC, 
  NPCId, 
  NPCRelationship, 
  ActiveDialogue,
  DialogueNode 
} from '../types/npc';

interface NPCStoreState {
  // State
  unlockedNPCs: NPCId[];
  relationships: Record<NPCId, NPCRelationship>;
  activeDialogue: ActiveDialogue | null;
  npcData: Record<NPCId, NPC>;
  
  // Actions
  unlockNPC: (npcId: NPCId) => void;
  startDialogue: (npcId: NPCId, nodeId?: string) => void;
  advanceDialogue: (nextNodeId: string | null) => void;
  endDialogue: () => void;
  updateRelationship: (npcId: NPCId, change: number) => void;
  completeSideQuest: (npcId: NPCId, questId: string) => void;
  
  // Queries
  isNPCUnlocked: (npcId: NPCId) => boolean;
  getRelationshipLevel: (npcId: NPCId) => number;
  getAvailableDialogueNodes: (npcId: NPCId) => DialogueNode[];
  canStartDialogue: (npcId: NPCId) => boolean;
  
  // Data management
  registerNPC: (npc: NPC) => void;
  loadNPCData: (npcs: NPC[]) => void;
}

export const useNPCStore = create<NPCStoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      unlockedNPCs: [],
      relationships: {} as Record<NPCId, NPCRelationship>,
      activeDialogue: null,
      npcData: {} as Record<NPCId, NPC>,
      
      // Actions
      unlockNPC: (npcId: NPCId) => {
        const { unlockedNPCs, relationships } = get();
        
        if (unlockedNPCs.includes(npcId)) return;
        
        set({
          unlockedNPCs: [...unlockedNPCs, npcId],
          relationships: {
            ...relationships,
            [npcId]: {
              npcId,
              level: 0,
              lastInteraction: new Date().toISOString(),
              completedSideQuests: [],
              dialogueHistory: [],
            },
          },
        });
      },
      
      startDialogue: (npcId: NPCId, nodeId?: string) => {
        const { npcData, isNPCUnlocked } = get();
        
        if (!isNPCUnlocked(npcId)) {
          console.warn(`Cannot start dialogue with locked NPC: ${npcId}`);
          return;
        }
        
        const npc = npcData[npcId];
        if (!npc) {
          console.warn(`NPC data not found: ${npcId}`);
          return;
        }
        
        // Find the appropriate dialogue node
        const startNode = nodeId 
          ? npc.dialogueTree.find(n => n.id === nodeId)
          : npc.dialogueTree.find(n => n.trigger.type === 'first_meet');
        
        if (!startNode) {
          console.warn(`No dialogue node found for ${npcId}`);
          return;
        }
        
        set({
          activeDialogue: {
            npcId,
            currentNodeId: startNode.id,
            history: [],
          },
        });
      },
      
      advanceDialogue: (nextNodeId: string | null) => {
        const { activeDialogue } = get();
        
        if (!activeDialogue || !nextNodeId) {
          get().endDialogue();
          return;
        }
        
        set({
          activeDialogue: {
            ...activeDialogue,
            currentNodeId: nextNodeId,
          },
        });
      },
      
      endDialogue: () => {
        const { activeDialogue, relationships } = get();
        
        if (activeDialogue) {
          // Update last interaction time
          const npcId = activeDialogue.npcId;
          set({
            activeDialogue: null,
            relationships: {
              ...relationships,
              [npcId]: {
                ...relationships[npcId],
                lastInteraction: new Date().toISOString(),
              },
            },
          });
        }
      },
      
      updateRelationship: (npcId: NPCId, change: number) => {
        const { relationships, npcData } = get();
        
        const currentRelationship = relationships[npcId];
        if (!currentRelationship) return;
        
        const npc = npcData[npcId];
        const maxLevel = npc?.maxRelationship ?? 100;
        
        const newLevel = Math.max(
          0,
          Math.min(maxLevel, currentRelationship.level + change)
        );
        
        set({
          relationships: {
            ...relationships,
            [npcId]: {
              ...currentRelationship,
              level: newLevel,
              lastInteraction: new Date().toISOString(),
            },
          },
        });
      },
      
      completeSideQuest: (npcId: NPCId, questId: string) => {
        const { relationships } = get();
        
        const currentRelationship = relationships[npcId];
        if (!currentRelationship) return;
        
        if (currentRelationship.completedSideQuests.includes(questId)) return;
        
        set({
          relationships: {
            ...relationships,
            [npcId]: {
              ...currentRelationship,
              completedSideQuests: [
                ...currentRelationship.completedSideQuests,
                questId,
              ],
            },
          },
        });
      },
      
      // Queries
      isNPCUnlocked: (npcId: NPCId) => {
        return get().unlockedNPCs.includes(npcId);
      },
      
      getRelationshipLevel: (npcId: NPCId) => {
        const relationship = get().relationships[npcId];
        return relationship?.level ?? 0;
      },
      
      getAvailableDialogueNodes: (npcId: NPCId) => {
        const { npcData, relationships } = get();
        const npc = npcData[npcId];
        if (!npc) return [];
        
        const relationship = relationships[npcId];
        const relationshipLevel = relationship?.level ?? 0;
        
        // Filter dialogue nodes based on triggers and conditions
        return npc.dialogueTree.filter(node => {
          const trigger = node.trigger;
          
          // Check relationship threshold
          if (trigger.minRelationship && relationshipLevel < trigger.minRelationship) {
            return false;
          }
          if (trigger.maxRelationship && relationshipLevel > trigger.maxRelationship) {
            return false;
          }
          
          // TODO: Check other conditions (quests, story flags, etc.)
          
          return true;
        });
      },
      
      canStartDialogue: (npcId: NPCId) => {
        const { isNPCUnlocked, activeDialogue } = get();
        return isNPCUnlocked(npcId) && activeDialogue === null;
      },
      
      // Data Management
      registerNPC: (npc: NPC) => {
        set((state) => ({
          npcData: {
            ...state.npcData,
            [npc.id]: npc,
          },
        }));
      },
      
      loadNPCData: (npcs: NPC[]) => {
        const npcDataMap = npcs.reduce((acc, npc) => {
          acc[npc.id] = npc;
          return acc;
        }, {} as Record<NPCId, NPC>);
        
        set({ npcData: npcDataMap });
      },
    }),
    {
      name: 'apex-npc-storage',
      version: 1,
      partialize: (state) => ({
        unlockedNPCs: state.unlockedNPCs,
        relationships: state.relationships,
        // Don't persist npcData - loaded from content files
        // Don't persist activeDialogue - session only
      }),
    }
  )
);
