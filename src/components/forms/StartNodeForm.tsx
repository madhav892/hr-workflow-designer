import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import type { StartNodeData } from '../../types';
import { useWorkflowStore } from '../../store';

const startNodeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  metadata: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      value: z.string().min(1, 'Value is required'),
    })
  ),
});

type StartNodeFormData = z.infer<typeof startNodeSchema>;

interface StartNodeFormProps {
  nodeId: string;
  data: StartNodeData;
}

export default function StartNodeForm({ nodeId, data }: StartNodeFormProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<StartNodeFormData>({
    resolver: zodResolver(startNodeSchema),
    defaultValues: {
      title: data.title || 'Start',
      metadata: data.metadata || [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'metadata',
  });

  // Watch for changes and update node data
  const watchedData = watch();
  useEffect(() => {
    const updateTimeout = setTimeout(() => {
      updateNode(nodeId, {
        title: watchedData.title,
        metadata: watchedData.metadata,
      });
    }, 300);

    return () => clearTimeout(updateTimeout);
  }, [watchedData.title, JSON.stringify(watchedData.metadata), nodeId, updateNode]);

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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-start focus:border-node-start text-sm"
          placeholder="Enter title"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Metadata section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Metadata
          </label>
          <button
            type="button"
            onClick={() => append({ key: '', value: '' })}
            className="flex items-center gap-1 text-xs text-node-start hover:text-node-start/80"
          >
            <Plus className="w-3 h-3" />
            Add Field
          </button>
        </div>

        <div className="space-y-2">
          {fields.length === 0 && (
            <p className="text-xs text-gray-500 italic">No metadata fields added</p>
          )}
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 form-field-enter">
              <input
                type="text"
                {...register(`metadata.${index}.key`)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                placeholder="Key"
              />
              <input
                type="text"
                {...register(`metadata.${index}.value`)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1.5 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {errors.metadata && (
          <p className="mt-1 text-xs text-red-600">
            Please ensure all metadata fields have values
          </p>
        )}
      </div>
    </div>
  );
}
