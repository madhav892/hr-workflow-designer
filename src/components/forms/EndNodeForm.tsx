import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { EndNodeData } from '../../types';
import { useWorkflowStore } from '../../store';

const endNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  endMessage: z.string().min(5, 'End message must be at least 5 characters'),
  showSummary: z.boolean(),
});

type EndNodeFormData = z.infer<typeof endNodeSchema>;

interface EndNodeFormProps {
  nodeId: string;
  data: EndNodeData;
}

export default function EndNodeForm({ nodeId, data }: EndNodeFormProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<EndNodeFormData>({
    resolver: zodResolver(endNodeSchema),
    defaultValues: {
      title: data.title || 'End',
      endMessage: data.endMessage || '',
      showSummary: data.showSummary || false,
    },
    mode: 'onChange',
  });

  // Watch for changes and update node data
  const watchedData = watch();
  useEffect(() => {
    const updateTimeout = setTimeout(() => {
      updateNode(nodeId, {
        title: watchedData.title,
        endMessage: watchedData.endMessage,
        showSummary: watchedData.showSummary,
      });
    }, 300);

    return () => clearTimeout(updateTimeout);
  }, [watchedData.title, watchedData.endMessage, watchedData.showSummary, nodeId, updateNode]);

  return (
    <div className="space-y-4">
      {/* Title field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-end focus:border-node-end text-sm"
          placeholder="Enter title"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* End Message field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Message <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('endMessage')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-end focus:border-node-end text-sm"
          placeholder="Enter completion message"
        />
        {errors.endMessage && (
          <p className="mt-1 text-xs text-red-600">{errors.endMessage.message}</p>
        )}
      </div>

      {/* Show Summary checkbox */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('showSummary')}
            className="w-4 h-4 text-node-end border-gray-300 rounded focus:ring-node-end"
          />
          <span className="text-sm font-medium text-gray-700">Show Summary</span>
        </label>
        <p className="mt-1 text-xs text-gray-500 ml-6">
          When enabled, a summary of completed steps will be displayed at workflow completion.
        </p>
      </div>
    </div>
  );
}
