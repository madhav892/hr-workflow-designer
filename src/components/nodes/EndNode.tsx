import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Flag } from 'lucide-react';
import type { EndNodeData } from '../../types';

interface EndNodeProps {
  data: EndNodeData;
  selected: boolean;
}

function EndNode({ data, selected }: EndNodeProps) {
  return (
    <div
      className={`
        min-w-[220px] rounded-xl bg-white border-2 shadow-lg hover:shadow-xl
        ${selected ? 'border-node-end ring-4 ring-node-end/20 shadow-node-end/20' : 'border-node-end/40 hover:border-node-end/60'}
        transition-all duration-200
      `}
    >
      {/* Input Handle (left side only) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-node-end !border-white !w-3.5 !h-3.5"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-node-end to-red-500 rounded-t-xl">
        <div className="p-1 bg-white/20 rounded-lg">
          <Flag className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white uppercase tracking-wide">
          End
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {data.title || 'Workflow End'}
        </p>
        
        {data.endMessage && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {data.endMessage}
          </p>
        )}

        {data.showSummary && (
          <span className="inline-block mt-2 px-2.5 py-1 bg-red-50 text-node-end text-xs font-medium rounded-lg">
            Show Summary
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(EndNode);
