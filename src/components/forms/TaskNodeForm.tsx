import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import type { TaskNodeData } from '../../types';
import { useWorkflowStore } from '../../store';

const taskNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().refine(
    (val) => !val || val.length >= 10,
    'Description must be at least 10 characters if provided'
  ),
  assignee: z.string().min(2, 'Assignee must be at least 2 characters'),
  dueDate: z.string().optional(),
  customFields: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      value: z.string().min(1, 'Value is required'),
    })
  ),
});

type TaskNodeFormData = z.infer<typeof taskNodeSchema>;

interface TaskNodeFormProps {
  nodeId: string;
  data: TaskNodeData;
}

export default function TaskNodeForm({ nodeId, data }: TaskNodeFormProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<TaskNodeFormData>({
    resolver: zodResolver(taskNodeSchema),
    defaultValues: {
      title: data.title || '',
      description: data.description || '',
      assignee: data.assignee || '',
      dueDate: data.dueDate || '',
      customFields: data.customFields || [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'customFields',
  });

  
  const watchedData = watch();
  useEffect(() => {
    const updateTimeout = setTimeout(() => {
      updateNode(nodeId, {
        title: watchedData.title,
        description: watchedData.description || '',
        assignee: watchedData.assignee,
        dueDate: watchedData.dueDate || '',
        customFields: watchedData.customFields,
      });
    }, 300);

    return () => clearTimeout(updateTimeout);
  }, [
    watchedData.title,
    watchedData.description,
    watchedData.assignee,
    watchedData.dueDate,
    JSON.stringify(watchedData.customFields),
    nodeId,
    updateNode,
  ]);

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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-task focus:border-node-task text-sm"
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-task focus:border-node-task text-sm"
          placeholder="Enter task description"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assignee <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('assignee')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-task focus:border-node-task text-sm"
          placeholder="Enter assignee name or role"
        />
        {errors.assignee && (
          <p className="mt-1 text-xs text-red-600">{errors.assignee.message}</p>
        )}
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-task focus:border-node-task text-sm"
        />
        {errors.dueDate && (
          <p className="mt-1 text-xs text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      {}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Custom Fields
          </label>
          <button
            type="button"
            onClick={() => append({ key: '', value: '' })}
            className="flex items-center gap-1 text-xs text-node-task hover:text-node-task/80"
          >
            <Plus className="w-3 h-3" />
            Add Field
          </button>
        </div>

        <div className="space-y-2">
          {fields.length === 0 && (
            <p className="text-xs text-gray-500 italic">No custom fields added</p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 form-field-enter">
              <input
                type="text"
                {...register(`customFields.${index}.key`)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                placeholder="Key"
              />
              <input
                type="text"
                {...register(`customFields.${index}.value`)}
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
      </div>
    </div>
  );
}
