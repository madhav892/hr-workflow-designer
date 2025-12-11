import type { WorkflowNode, WorkflowEdge } from './workflow';


export interface AutomationAction {
  id: string;
  label: string;
  description: string;
  params: string[];
}


export interface SimulationRequest {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}


export type SimulationStepStatus = 'pending' | 'completed' | 'failed';


export interface SimulationStep {
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
  status: SimulationStepStatus;
  timestamp: string;
  details: string;
  duration?: number;
}


export interface SimulationResponse {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
  duration: number;
}


export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}


export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  loading: boolean;
}
