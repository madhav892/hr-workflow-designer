import { Play, CheckSquare, UserCheck, Cog, Flag, Trash2, X, Settings } from 'lucide-react';
import { useSelectedNode, useWorkflowStore } from '../../store';
import { NODE_TYPES } from '../../types';
import type { 
  StartNodeData, 
  TaskNodeData, 
  ApprovalNodeData, 
  AutomatedNodeData, 
  EndNodeData 
} from '../../types';
import StartNodeForm from './StartNodeForm';
import TaskNodeForm from './TaskNodeForm';
import ApprovalNodeForm from './ApprovalNodeForm';
import AutomatedNodeForm from './AutomatedNodeForm';
import EndNodeForm from './EndNodeForm';

const NODE_CONFIG = {
  [NODE_TYPES.START]: {
    label: 'Start Node',
    icon: Play,
    color: 'bg-node-start',
    borderColor: 'border-node-start',
  },
  [NODE_TYPES.TASK]: {
    label: 'Task Node',
    icon: CheckSquare,
    color: 'bg-node-task',
    borderColor: 'border-node-task',
  },
  [NODE_TYPES.APPROVAL]: {
    label: 'Approval Node',
    icon: UserCheck,
    color: 'bg-node-approval',
    borderColor: 'border-node-approval',
  },
  [NODE_TYPES.AUTOMATED]: {
    label: 'Automated Node',
    icon: Cog,
    color: 'bg-node-automated',
    borderColor: 'border-node-automated',
  },
  [NODE_TYPES.END]: {
    label: 'End Node',
    icon: Flag,
    color: 'bg-node-end',
    borderColor: 'border-node-end',
  },
};

export default function NodeFormPanel() {
  const selectedNode = useSelectedNode();
  const { deleteNode, selectNode } = useWorkflowStore();

  const handleDelete = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
    }
  };

  const handleClose = () => {
    selectNode(null);
  };

  if (!selectedNode || !selectedNode.data) {
    return (
      <div className="w-full bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-base font-bold text-gray-900">Node Properties</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[300px]">
          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-3">
            <Settings className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">
            No Node Selected
          </p>
          <p className="text-gray-500 text-xs">
            Click on a node to configure its properties
          </p>
        </div>
      </div>
    );
  }

  const nodeType = selectedNode.data.type;
  const config = NODE_CONFIG[nodeType];
  const Icon = config.icon;

  const renderForm = () => {
    switch (nodeType) {
      case NODE_TYPES.START:
        return (
          <StartNodeForm
            nodeId={selectedNode.id}
            data={selectedNode.data as StartNodeData}
          />
        );
      case NODE_TYPES.TASK:
        return (
          <TaskNodeForm
            nodeId={selectedNode.id}
            data={selectedNode.data as TaskNodeData}
          />
        );
      case NODE_TYPES.APPROVAL:
        return (
          <ApprovalNodeForm
            nodeId={selectedNode.id}
            data={selectedNode.data as ApprovalNodeData}
          />
        );
      case NODE_TYPES.AUTOMATED:
        return (
          <AutomatedNodeForm
            nodeId={selectedNode.id}
            data={selectedNode.data as AutomatedNodeData}
          />
        );
      case NODE_TYPES.END:
        return (
          <EndNodeForm
            nodeId={selectedNode.id}
            data={selectedNode.data as EndNodeData}
          />
        );
      default:
        return <p className="text-gray-500">Unknown node type</p>;
    }
  };

  return (
    <div className="w-full bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`${config.color} p-1.5 rounded-xl text-white shadow-md`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">{config.label}</h2>
              <p className="text-[10px] text-gray-500">Configure properties</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {renderForm()}
      </div>

      {/* Footer with Delete button */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleDelete}
          className="btn-danger w-full justify-center text-sm py-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Node
        </button>
      </div>
    </div>
  );
}
