import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { UserCheck } from 'lucide-react';
import type { ApprovalNodeData } from '../../types';

interface ApprovalNodeProps {
  data: ApprovalNodeData;
  selected: boolean;
}

function ApprovalNode({ data, selected }: ApprovalNodeProps) {
  return (
    <div
      className={`
        min-w-[220px] max-w-[300px] rounded-xl bg-white border-2 shadow-lg hover:shadow-xl
        ${selected ? 'border-node-approval ring-4 ring-node-approval/20 shadow-node-approval/20' : 'border-node-approval/40 hover:border-node-approval/60'}
        transition-all duration-200
      `}
    >
      {/* Input Handle (left side) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-node-approval !border-white !w-3.5 !h-3.5"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-node-approval to-orange-500 rounded-t-xl">
        <div className="p-1 bg-white/20 rounded-lg">
          <UserCheck className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white uppercase tracking-wide">
          Approval
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-2">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {data.title || 'Untitled Approval'}
        </p>
        
        {data.approverRole && (
          <div className="px-2 py-1 bg-orange-50 rounded-md">
            <p className="text-xs font-medium text-node-approval">
              Approver: {data.approverRole}
            </p>
          </div>
        )}

        {data.autoApproveThreshold != null && data.autoApproveThreshold > 0 && (
          <p className="text-xs text-gray-600 font-medium">
            Auto-approve after {data.autoApproveThreshold} days
          </p>
        )}
      </div>

      {/* Output Handle (right side) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-node-approval !border-white !w-3 !h-3"
      />
    </div>
  );
}

export default memo(ApprovalNode);
