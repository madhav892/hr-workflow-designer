import type { Node, Edge } from '@xyflow/react';

// Node type constants
export const NODE_TYPES = {
  START: 'start',
  TASK: 'task',
  APPROVAL: 'approval',
  AUTOMATED: 'automated',
  END: 'end',
} as const;

export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES];

// Approver roles for approval nodes
export const APPROVER_ROLES = [
  'Manager',
  'HRBP',
  'Director',
  'VP',
  'Executive',
] as const;

export type ApproverRole = typeof APPROVER_ROLES[number];

// Base node data interface with index signature for React Flow compatibility
export interface BaseNodeData {
  title: string;
  [key: string]: unknown;
}

// Start node specific data
export interface StartNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.START;
  metadata: Array<{ key: string; value: string }>;
}

// Task node specific data
export interface TaskNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.TASK;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Array<{ key: string; value: string }>;
}

// Approval node specific data
export interface ApprovalNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.APPROVAL;
  approverRole: ApproverRole;
  autoApproveThreshold: number | null;
}

// Automated step node specific data
export interface AutomatedNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.AUTOMATED;
  actionId: string;
  actionLabel: string;
  parameters: Record<string, string>;
}

// End node specific data
export interface EndNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.END;
  endMessage: string;
  showSummary: boolean;
}

// Union type for all node data
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

// React Flow node with our custom data
export type WorkflowNode = Node<WorkflowNodeData>;

// React Flow edge type
export type WorkflowEdge = Edge;

// Complete workflow type
export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

// Type guards for node data
export function isStartNodeData(data: WorkflowNodeData): data is StartNodeData {
  return data.type === NODE_TYPES.START;
}

export function isTaskNodeData(data: WorkflowNodeData): data is TaskNodeData {
  return data.type === NODE_TYPES.TASK;
}

export function isApprovalNodeData(data: WorkflowNodeData): data is ApprovalNodeData {
  return data.type === NODE_TYPES.APPROVAL;
}

export function isAutomatedNodeData(data: WorkflowNodeData): data is AutomatedNodeData {
  return data.type === NODE_TYPES.AUTOMATED;
}

export function isEndNodeData(data: WorkflowNodeData): data is EndNodeData {
  return data.type === NODE_TYPES.END;
}

// Helper to create default node data
export function createDefaultNodeData(type: NodeType): WorkflowNodeData {
  const baseData = { title: '' };

  switch (type) {
    case NODE_TYPES.START:
      return { ...baseData, type: NODE_TYPES.START, title: 'Start', metadata: [] };
    case NODE_TYPES.TASK:
      return {
        ...baseData,
        type: NODE_TYPES.TASK,
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      };
    case NODE_TYPES.APPROVAL:
      return {
        ...baseData,
        type: NODE_TYPES.APPROVAL,
        approverRole: 'Manager',
        autoApproveThreshold: null,
      };
    case NODE_TYPES.AUTOMATED:
      return {
        ...baseData,
        type: NODE_TYPES.AUTOMATED,
        actionId: '',
        actionLabel: '',
        parameters: {},
      };
    case NODE_TYPES.END:
      return { ...baseData, type: NODE_TYPES.END, title: 'End', endMessage: '', showSummary: false };
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}
