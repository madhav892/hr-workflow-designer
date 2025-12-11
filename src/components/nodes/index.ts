export { default as StartNode } from './StartNode';
export { default as TaskNode } from './TaskNode';
export { default as ApprovalNode } from './ApprovalNode';
export { default as AutomatedNode } from './AutomatedNode';
export { default as EndNode } from './EndNode';

import StartNode from './StartNode';
import TaskNode from './TaskNode';
import ApprovalNode from './ApprovalNode';
import AutomatedNode from './AutomatedNode';
import EndNode from './EndNode';


export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};
