import { create } from 'zustand';
import type { WorkflowNode, WorkflowEdge, WorkflowNodeData, NodeType } from '../types';
import { createDefaultNodeData } from '../types';
import type { SimulationResponse } from '../types';

interface WorkflowState {
  
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  
  
  selectedNodeId: string | null;
  
  
  simulationResult: SimulationResponse | null;
  isSimulating: boolean;
  
  
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => string;
  updateNode: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  addEdge: (edge: WorkflowEdge) => void;
  deleteEdge: (edgeId: string) => void;
  setSimulationResult: (result: SimulationResponse | null) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  clearWorkflow: () => void;
}


const generateId = (type: string) => `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,

  
  setNodes: (nodes) => set({ nodes }),

  
  setEdges: (edges) => set({ edges }),

  
  addNode: (type, position) => {
    const id = generateId(type);
    const data = createDefaultNodeData(type);
    
    const newNode: WorkflowNode = {
      id,
      type,
      position,
      data,
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));

    return id;
  },

  
  updateNode: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } as WorkflowNodeData }
          : node
      ),
    }));
  },

  
  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  
  addEdge: (edge) => {
    const state = get();
    
    const edgeExists = state.edges.some(
      (e) => e.source === edge.source && e.target === edge.target
    );
    if (edgeExists) return;

    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },

  
  deleteEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },

  
  setSimulationResult: (result) => set({ simulationResult: result }),

  
  setIsSimulating: (isSimulating) => set({ isSimulating }),

  
  clearWorkflow: () => set({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    simulationResult: null,
  }),
}));


export const useSelectedNode = () => {
  const { nodes, selectedNodeId } = useWorkflowStore();
  return nodes.find((node) => node.id === selectedNodeId) || null;
};

export const useNodeById = (nodeId: string) => {
  const { nodes } = useWorkflowStore();
  return nodes.find((node) => node.id === nodeId) || null;
};
