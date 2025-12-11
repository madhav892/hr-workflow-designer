import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import type { AutomatedNodeData, AutomationAction } from '../../types';
import { useWorkflowStore } from '../../store';
import { fetchAutomations } from '../../services';

const automatedNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  actionId: z.string().min(1, 'Please select an action'),
  parameters: z.record(z.string(), z.string()),
});

type AutomatedNodeFormData = z.infer<typeof automatedNodeSchema>;

interface AutomatedNodeFormProps {
  nodeId: string;
  data: AutomatedNodeData;
}

export default function AutomatedNodeForm({ nodeId, data }: AutomatedNodeFormProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AutomatedNodeFormData>({
    resolver: zodResolver(automatedNodeSchema),
    defaultValues: {
      title: data.title || '',
      actionId: data.actionId || '',
      parameters: data.parameters || {},
    },
    mode: 'onChange',
  });

  
  useEffect(() => {
    const loadAutomations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAutomations();
        setAutomations(data);
      } catch (err) {
        setError('Failed to load automation actions');
        console.error('Error fetching automations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAutomations();
  }, []);

  const watchedData = watch();
  const selectedAction = automations.find((a) => a.id === watchedData.actionId);

  
  useEffect(() => {
    const updateTimeout = setTimeout(() => {
      const actionLabel = selectedAction?.label || '';
      updateNode(nodeId, {
        title: watchedData.title,
        actionId: watchedData.actionId,
        actionLabel,
        parameters: watchedData.parameters || {},
      });
    }, 300);

    return () => clearTimeout(updateTimeout);
  }, [
    watchedData.title,
    watchedData.actionId,
    JSON.stringify(watchedData.parameters),
    nodeId,
    updateNode,
    selectedAction,
  ]);

  // Reset parameters when action changes
  useEffect(() => {
    if (selectedAction) {
      const newParams: Record<string, string> = {};
      selectedAction.params.forEach((param) => {
        const existingValue = watchedData.parameters?.[param];
        newParams[param] = typeof existingValue === 'string' ? existingValue : '';
      });
      setValue('parameters', newParams);
    }
  }, [watchedData.actionId, selectedAction, setValue]);

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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-automated focus:border-node-automated text-sm"
          placeholder="Enter automation title"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Action <span className="text-red-500">*</span>
        </label>
        
        {isLoading ? (
          <div className="flex items-center gap-2 py-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading actions...</span>
          </div>
        ) : error ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 text-xs text-red-700 underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <select
              {...register('actionId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-automated focus:border-node-automated text-sm bg-white"
            >
              <option value="">Select an action...</option>
              {automations.map((action) => (
                <option key={action.id} value={action.id}>
                  {action.label}
                </option>
              ))}
            </select>
            {errors.actionId && (
              <p className="mt-1 text-xs text-red-600">{errors.actionId.message}</p>
            )}
            
            {selectedAction && (
              <p className="mt-1 text-xs text-gray-500">{selectedAction.description}</p>
            )}
          </>
        )}
      </div>

      {}
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Parameters
          </label>
          
          {selectedAction.params.map((param) => (
            <div key={param}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                {param.replace(/_/g, ' ')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(`parameters.${param}`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-node-automated focus:border-node-automated text-sm"
                placeholder={`Enter ${param.replace(/_/g, ' ')}`}
              />
            </div>
          ))}
        </div>
      )}

      {selectedAction && selectedAction.params.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          This action does not require any parameters.
        </p>
      )}
    </div>
  );
}
