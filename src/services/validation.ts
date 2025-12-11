import type { WorkflowNode, WorkflowEdge } from '../types';
import { NODE_TYPES } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  nodeId?: string;
  message: string;
  type: 'structural' | 'connection' | 'data';
}

export interface ValidationWarning {
  nodeId?: string;
  message: string;
}


function hasCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjacencyList = new Map<string, string[]>();
  
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true; 
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}


function getConnectedNodes(nodes: WorkflowNode[], edges: WorkflowEdge[]): Set<string> {
  const adjacencyList = new Map<string, string[]>();
  
  
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    if (!adjacencyList.has(edge.target)) {
      adjacencyList.set(edge.target, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
    adjacencyList.get(edge.target)!.push(edge.source);
  });

  const startNode = nodes.find(n => n.data?.type === NODE_TYPES.START);
  if (!startNode) return new Set();

  const visited = new Set<string>();
  const queue = [startNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);
    const neighbors = adjacencyList.get(currentId) || [];
    neighbors.forEach(neighborId => {
      if (!visited.has(neighborId)) {
        queue.push(neighborId);
      }
    });
  }

  return visited;
}


function validateNodeData(node: WorkflowNode): ValidationError[] {
  const errors: ValidationError[] = [];
  const data = node.data;

  if (!data) {
    errors.push({
      nodeId: node.id,
      message: 'Node is missing data',
      type: 'data',
    });
    return errors;
  }

  
  if (!data.title || (data.title as string).trim().length < 1) {
    errors.push({
      nodeId: node.id,
      message: `Node is missing a title`,
      type: 'data',
    });
  }

  
  switch (data.type) {
    case NODE_TYPES.TASK:
      if (!data.assignee || (data.assignee as string).trim().length < 2) {
        errors.push({
          nodeId: node.id,
          message: `Task "${data.title}" requires an assignee (min 2 characters)`,
          type: 'data',
        });
      }
      break;

    case NODE_TYPES.END:
      if (!data.endMessage || (data.endMessage as string).trim().length < 5) {
        errors.push({
          nodeId: node.id,
          message: `End node "${data.title}" requires an end message (min 5 characters)`,
          type: 'data',
        });
      }
      break;

    case NODE_TYPES.AUTOMATED:
      if (!data.actionId) {
        errors.push({
          nodeId: node.id,
          message: `Automated node "${data.title}" requires an action to be selected`,
          type: 'data',
        });
      }
      break;
  }

  return errors;
}

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  
  if (nodes.length === 0) {
    errors.push({
      message: 'Workflow is empty. Add at least a Start and End node.',
      type: 'structural',
    });
    return { isValid: false, errors, warnings };
  }

  
  const startNodes = nodes.filter(n => n.data?.type === NODE_TYPES.START);
  if (startNodes.length === 0) {
    errors.push({
      message: 'Workflow must have a Start node',
      type: 'structural',
    });
  } else if (startNodes.length > 1) {
    errors.push({
      message: 'Workflow can only have one Start node',
      type: 'structural',
    });
  }

  
  const endNodes = nodes.filter(n => n.data?.type === NODE_TYPES.END);
  if (endNodes.length === 0) {
    errors.push({
      message: 'Workflow must have at least one End node',
      type: 'structural',
    });
  }

  
  if (startNodes.length === 1) {
    const connectedNodes = getConnectedNodes(nodes, edges);
    nodes.forEach(node => {
      if (!connectedNodes.has(node.id)) {
        const title = node.data?.title || node.id;
        errors.push({
          nodeId: node.id,
          message: `Node "${title}" is not connected to the workflow`,
          type: 'connection',
        });
      }
    });
  }

  
  if (hasCycles(nodes, edges)) {
    warnings.push({
      message: 'Workflow contains a cycle. This may cause infinite loops during execution.',
    });
  }

  
  nodes.forEach(node => {
    const nodeErrors = validateNodeData(node);
    errors.push(...nodeErrors);
  });

  
  startNodes.forEach(startNode => {
    const hasIncoming = edges.some(e => e.target === startNode.id);
    if (hasIncoming) {
      errors.push({
        nodeId: startNode.id,
        message: 'Start node cannot have incoming connections',
        type: 'connection',
      });
    }
  });

  
  endNodes.forEach(endNode => {
    const hasOutgoing = edges.some(e => e.source === endNode.id);
    if (hasOutgoing) {
      errors.push({
        nodeId: endNode.id,
        message: 'End node cannot have outgoing connections',
        type: 'connection',
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
