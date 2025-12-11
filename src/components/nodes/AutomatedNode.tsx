import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Cog } from 'lucide-react';
import type { AutomatedNodeData } from '../../types';

interface AutomatedNodeProps {
  data: AutomatedNodeData;
  selected: boolean;
}

function AutomatedNode({ data, selected }: AutomatedNodeProps) {
  return (
    <div
      className={`
        min-w-[220px] max-w-[300px] rounded-xl bg-white border-2 shadow-lg hover:shadow-xl
        ${selected ? 'border-node-automated ring-4 ring-node-automated/20 shadow-node-automated/20' : 'border-node-automated/40 hover:border-node-automated/60'}
        transition-all duration-200
      `}
    >
      {}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-node-automated !border-white !w-3.5 !h-3.5"
      />

      {}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-node-automated to-purple-600 rounded-t-xl">
        <div className="p-1 bg-white/20 rounded-lg">
          <Cog className="w-4 h-4 text-white animate-spin-slow" />
        </div>
        <span className="text-sm font-bold text-white uppercase tracking-wide">
          Automated
        </span>
      </div>

      {}
      <div className="px-4 py-3 space-y-2">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {data.title || 'Untitled Automation'}
        </p>
        
        {data.actionLabel && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-md">
            <Cog className="w-3.5 h-3.5 text-node-automated" />
            <span className="text-xs font-medium text-node-automated truncate">{data.actionLabel}</span>
          </div>
        )}

        {data.parameters && Object.keys(data.parameters).length > 0 && (
          <span className="inline-block px-2 py-0.5 bg-purple-100 text-node-automated text-xs font-medium rounded-md">
            {Object.keys(data.parameters).length} parameter{Object.keys(data.parameters).length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-node-automated !border-white !w-3 !h-3"
      />
    </div>
  );
}

export default memo(AutomatedNode);
