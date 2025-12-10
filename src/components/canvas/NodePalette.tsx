import { Play, CheckSquare, UserCheck, Cog, Flag } from 'lucide-react';
import type { NodeType } from '../../types';
import { NODE_TYPES } from '../../types';

interface NodePaletteItem {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const NODE_PALETTE_ITEMS: NodePaletteItem[] = [
  {
    type: NODE_TYPES.START,
    label: 'Start',
    description: 'Entry point of workflow',
    icon: <Play className="w-5 h-5" />,
    color: 'bg-node-start',
  },
  {
    type: NODE_TYPES.TASK,
    label: 'Task',
    description: 'Human task to complete',
    icon: <CheckSquare className="w-5 h-5" />,
    color: 'bg-node-task',
  },
  {
    type: NODE_TYPES.APPROVAL,
    label: 'Approval',
    description: 'Requires manager approval',
    icon: <UserCheck className="w-5 h-5" />,
    color: 'bg-node-approval',
  },
  {
    type: NODE_TYPES.AUTOMATED,
    label: 'Automated',
    description: 'Automated system action',
    icon: <Cog className="w-5 h-5" />,
    color: 'bg-node-automated',
  },
  {
    type: NODE_TYPES.END,
    label: 'End',
    description: 'Workflow completion',
    icon: <Flag className="w-5 h-5" />,
    color: 'bg-node-end',
  },
];

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

export default function NodePalette({ onDragStart }: NodePaletteProps) {
  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      <div className="p-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
        <h2 className="text-lg font-bold text-gray-900">Node Palette</h2>
        <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Drag nodes to the canvas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {NODE_PALETTE_ITEMS.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => {
              onDragStart(e, item.type);
            }}
            className="node-palette-item bg-white rounded-xl border-2 border-gray-200 p-4 cursor-grab active:cursor-grabbing hover:border-gray-300 group"
          >
            <div className="flex items-start gap-3">
              <div className={`${item.color} p-3 rounded-xl text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.label}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-indigo-50 to-white">
        <div className="flex items-start gap-2 text-xs text-indigo-700">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">Connect nodes by dragging from output handles (right) to input handles (left)</span>
        </div>
      </div>
    </div>
  );
}
