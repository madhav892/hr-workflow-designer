import type { AutomationAction, SimulationRequest, SimulationResponse, SimulationStep } from '../types';
import { NODE_TYPES } from '../types';

// Mock automation actions data
const MOCK_AUTOMATIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    description: 'Send an email notification',
    params: ['to', 'subject', 'body'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    description: 'Generate PDF or Word document',
    params: ['template', 'recipient', 'format'],
  },
  {
    id: 'create_ticket',
    label: 'Create Support Ticket',
    description: 'Create ticket in support system',
    params: ['system', 'priority', 'description'],
  },
  {
    id: 'update_database',
    label: 'Update Database Record',
    description: 'Update employee database',
    params: ['table', 'field', 'value'],
  },
  {
    id: 'send_slack_message',
    label: 'Send Slack Message',
    description: 'Post message to Slack channel',
    params: ['channel', 'message'],
  },
];

// Simulate network delay
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// GET /api/automations
export async function fetchAutomations(): Promise<AutomationAction[]> {
  // Simulate 200-500ms network delay
  await delay(200 + Math.random() * 300);
  return MOCK_AUTOMATIONS;
}

// Helper to get connected nodes in execution order using BFS
function getExecutionOrder(request: SimulationRequest): string[] {
  const { nodes, edges } = request;
  const adjacencyList = new Map<string, string[]>();
  
  // Build adjacency list
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  });

  // Find start node
  const startNode = nodes.find(n => n.data?.type === NODE_TYPES.START);
  if (!startNode) return [];

  // BFS traversal
  const visited = new Set<string>();
  const order: string[] = [];
  const queue = [startNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);
    order.push(currentId);

    const neighbors = adjacencyList.get(currentId) || [];
    neighbors.forEach(neighborId => {
      if (!visited.has(neighborId)) {
        queue.push(neighborId);
      }
    });
  }

  return order;
}

// Validate workflow structure
function validateWorkflow(request: SimulationRequest): string[] {
  const errors: string[] = [];
  const { nodes } = request;

  // Check for start node
  const startNodes = nodes.filter(n => n.data?.type === NODE_TYPES.START);
  if (startNodes.length === 0) {
    errors.push('Workflow must have a Start node');
  } else if (startNodes.length > 1) {
    errors.push('Workflow can only have one Start node');
  }

  // Check for end node
  const endNodes = nodes.filter(n => n.data?.type === NODE_TYPES.END);
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one End node');
  }

  // Check for disconnected nodes
  if (nodes.length > 0 && startNodes.length > 0) {
    const executionOrder = getExecutionOrder(request);
    const disconnectedNodes = nodes.filter(n => !executionOrder.includes(n.id));
    
    disconnectedNodes.forEach(node => {
      const title = node.data?.title || node.id;
      errors.push(`Node "${title}" is not connected to the workflow`);
    });
  }

  // Validate individual nodes
  nodes.forEach(node => {
    const data = node.data;
    if (!data) return;

    if (!data.title || (data.title as string).trim() === '') {
      errors.push(`Node "${node.id}" is missing a title`);
    }

    // Type-specific validations
    if (data.type === NODE_TYPES.TASK) {
      if (!data.assignee || (data.assignee as string).trim() === '') {
        errors.push(`Task node "${data.title}" is missing an assignee`);
      }
    }

    if (data.type === NODE_TYPES.END) {
      if (!data.endMessage || (data.endMessage as string).trim() === '') {
        errors.push(`End node "${data.title}" is missing an end message`);
      }
    }

    if (data.type === NODE_TYPES.AUTOMATED) {
      if (!data.actionId) {
        errors.push(`Automated node "${data.title}" is missing an action`);
      }
    }
  });

  return errors;
}

// Generate simulation steps
function generateSimulationSteps(request: SimulationRequest): SimulationStep[] {
  const executionOrder = getExecutionOrder(request);
  const nodeMap = new Map(request.nodes.map(n => [n.id, n]));
  const steps: SimulationStep[] = [];
  let currentTime = new Date();

  executionOrder.forEach((nodeId, index) => {
    const node = nodeMap.get(nodeId);
    if (!node || !node.data) return;

    const stepDuration = 1000 + Math.random() * 2000; // 1-3 seconds per step
    currentTime = new Date(currentTime.getTime() + stepDuration);

    let details = '';
    const data = node.data;

    switch (data.type) {
      case NODE_TYPES.START:
        details = 'Workflow started successfully';
        break;
      case NODE_TYPES.TASK:
        details = `Task assigned to ${data.assignee || 'unassigned'}`;
        break;
      case NODE_TYPES.APPROVAL:
        details = `Pending approval from ${data.approverRole || 'approver'}`;
        break;
      case NODE_TYPES.AUTOMATED:
        details = `Executing automated action: ${data.actionLabel || data.actionId}`;
        break;
      case NODE_TYPES.END:
        details = data.endMessage as string || 'Workflow completed';
        break;
    }

    steps.push({
      nodeId,
      nodeType: data.type as string,
      nodeTitle: data.title as string || `Node ${index + 1}`,
      status: 'completed',
      timestamp: currentTime.toISOString(),
      details,
      duration: Math.round(stepDuration),
    });
  });

  return steps;
}

// POST /api/simulate
export async function simulateWorkflow(request: SimulationRequest): Promise<SimulationResponse> {
  // Simulate 500-1500ms network delay for simulation
  await delay(500 + Math.random() * 1000);

  const errors = validateWorkflow(request);

  if (errors.length > 0) {
    return {
      success: false,
      steps: [],
      errors,
      duration: 0,
    };
  }

  const steps = generateSimulationSteps(request);
  const totalDuration = steps.reduce((sum, step) => sum + (step.duration || 0), 0);

  return {
    success: true,
    steps,
    errors: [],
    duration: totalDuration,
  };
}
