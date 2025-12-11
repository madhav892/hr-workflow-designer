import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckSquare, User } from 'lucide-react';
import type { TaskNodeData } from '../../types';

interface TaskNodeProps {
  data: TaskNodeData;
  selected: boolean;
}

function TaskNode({ data, selected }: TaskNodeProps) {
  return (
    <div
      className={`
        min-w-[220px] max-w-[300px] rounded-xl bg-white border-2 shadow-lg hover:shadow-xl
        ${selected ? 'border-node-task ring-4 ring-node-task/20 shadow-node-task/20' : 'border-node-task/40 hover:border-node-task/60'}
        transition-all duration-200
      `}
    >
      {}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-node-task !border-white !w-3.5 !h-3.5"
      />

      {}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-node-task to-blue-500 rounded-t-xl">
        <div className="p-1 bg-white/20 rounded-lg">
          <CheckSquare className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white uppercase tracking-wide">
          Task
        </span>
      </div>

      {}
      <div className="px-4 py-3 space-y-2">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {data.title || 'Untitled Task'}
        </p>
        
        {data.assignee && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-md">
            <User className="w-3.5 h-3.5 text-node-task" />
            <span className="text-xs font-medium text-node-task truncate">{data.assignee}</span>
          </div>
        )}

        {data.dueDate && (
          <p className="text-xs text-gray-600 font-medium">
            Due: {data.dueDate}
          </p>
        )}

        {data.description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}
      </div>

      {}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-node-task !border-white !w-3 !h-3"
      />
    </div>
  );
}

export default memo(TaskNode);
