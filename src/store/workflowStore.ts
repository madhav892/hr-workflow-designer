import { create } from 'zustand';
import type { WorkflowNode, WorkflowEdge, WorkflowNodeData, NodeType } from '../types';
import { createDefaultNodeData } from '../types';
import type { SimulationResponse } from '../types';

interface WorkflowState {
  // Workflow data
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  
  // Selection state
  selectedNodeId: string | null;
  
  // Simulation state
  simulationResult: SimulationResponse | null;
  isSimulating: boolean;
  
  // Actions
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

// Generate unique IDs
const generateId = (type: string) => `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,

  // Set nodes (used by React Flow)
  setNodes: (nodes) => set({ nodes }),

  // Set edges (used by React Flow)
  setEdges: (edges) => set({ edges }),

  // Add a new node to the canvas
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

  // Update node data
  updateNode: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } as WorkflowNodeData }
          : node
      ),
    }));
  },

  // Delete a node and its connected edges
  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  // Select a node for editing
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  // Add an edge between nodes
  addEdge: (edge) => {
    const state = get();
    // Prevent duplicate edges
    const edgeExists = state.edges.some(
      (e) => e.source === edge.source && e.target === edge.target
    );
    if (edgeExists) return;

    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },

  // Delete an edge
  deleteEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },

  // Set simulation result
  setSimulationResult: (result) => set({ simulationResult: result }),

  // Set simulation loading state
  setIsSimulating: (isSimulating) => set({ isSimulating }),

  // Clear entire workflow
  clearWorkflow: () => set({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    simulationResult: null,
  }),
}));

// Selector hooks for specific state slices
export const useSelectedNode = () => {
  const { nodes, selectedNodeId } = useWorkflowStore();
  return nodes.find((node) => node.id === selectedNodeId) || null;
};

export const useNodeById = (nodeId: string) => {
  const { nodes } = useWorkflowStore();
  return nodes.find((node) => node.id === nodeId) || null;
};
