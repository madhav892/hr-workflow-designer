import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';
import type { StartNodeData } from '../../types';

interface StartNodeProps {
  data: StartNodeData;
  selected: boolean;
}

function StartNode({ data, selected }: StartNodeProps) {
  return (
    <div
      className={`
        min-w-[220px] rounded-xl bg-white border-2 shadow-lg hover:shadow-xl
        ${selected ? 'border-node-start ring-4 ring-node-start/20 shadow-node-start/20' : 'border-node-start/40 hover:border-node-start/60'}
        transition-all duration-200
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-node-start to-emerald-500 rounded-t-xl">
        <div className="p-1 bg-white/20 rounded-lg">
          <Play className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white uppercase tracking-wide">
          Start
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {data.title || 'Workflow Start'}
        </p>
        {data.metadata && data.metadata.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 bg-node-start/10 text-node-start text-xs font-medium rounded-md">
              {data.metadata.length} metadata field{data.metadata.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Output Handle (right side only) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-node-start !border-white !w-3 !h-3"
      />
    </div>
  );
}

export default memo(StartNode);
