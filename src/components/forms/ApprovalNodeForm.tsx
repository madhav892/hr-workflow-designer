import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ApprovalNodeData, ApproverRole } from '../../types';
import { APPROVER_ROLES } from '../../types';
import { useWorkflowStore } from '../../store';

const approvalNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  approverRole: z.enum(APPROVER_ROLES),
  autoApproveThreshold: z.number().min(0, 'Threshold must be 0 or greater').nullable(),
});

type ApprovalNodeFormData = z.infer<typeof approvalNodeSchema>;

interface ApprovalNodeFormProps {
  nodeId: string;
  data: ApprovalNodeData;
}

export default function ApprovalNodeForm({ nodeId, data }: ApprovalNodeFormProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ApprovalNodeFormData>({
    resolver: zodResolver(approvalNodeSchema),
    defaultValues: {
      title: data.title || '',
      approverRole: data.approverRole || 'Manager',
      autoApproveThreshold: data.autoApproveThreshold ?? null,
    },
    mode: 'onChange',
  });

  
  const watchedData = watch();
  useEffect(() => {
    const updateTimeout = setTimeout(() => {
      updateNode(nodeId, {
        title: watchedData.title,
        approverRole: watchedData.approverRole as ApproverRole,
        autoApproveThreshold: watchedData.autoApproveThreshold,
      });
    }, 300);

    return () => clearTimeout(updateTimeout);
  }, [watchedData.title, watchedData.approverRole, watchedData.autoApproveThreshold, nodeId, updateNode]);

  return (
    <div className="space-y-4">
      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-approval focus:border-node-approval text-sm"
          placeholder="Enter approval title"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Approver Role <span className="text-red-500">*</span>
        </label>
        <select
          {...register('approverRole')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-approval focus:border-node-approval text-sm bg-white"
        >
          {APPROVER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.approverRole && (
          <p className="mt-1 text-xs text-red-600">{errors.approverRole.message}</p>
        )}
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Auto-Approve Threshold (days)
        </label>
        <input
          type="number"
          {...register('autoApproveThreshold', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-approval focus:border-node-approval text-sm"
          placeholder="Enter number of days"
          min={0}
        />
        <p className="mt-1 text-xs text-gray-500">
          Automatically approve after this many days if no action taken. Leave empty to disable.
        </p>
        {errors.autoApproveThreshold && (
          <p className="mt-1 text-xs text-red-600">{errors.autoApproveThreshold.message}</p>
        )}
      </div>
    </div>
  );
}
