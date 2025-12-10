import type { WorkflowNode, WorkflowEdge } from './workflow';

// Automation action from API
export interface AutomationAction {
  id: string;
  label: string;
  description: string;
  params: string[];
}

// Simulation request body
export interface SimulationRequest {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// Simulation step status
export type SimulationStepStatus = 'pending' | 'completed' | 'failed';

// Individual simulation step
export interface SimulationStep {
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
  status: SimulationStepStatus;
  timestamp: string;
  details: string;
  duration?: number;
}

// Simulation response
export interface SimulationResponse {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
  duration: number;
}

// API error response
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  loading: boolean;
}
