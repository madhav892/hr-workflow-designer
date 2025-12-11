import { useState } from 'react';
import { 
  Play, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useWorkflowStore } from '../../store';
import { validateWorkflow, simulateWorkflow } from '../../services';
import type { SimulationStep } from '../../types';

const STATUS_ICONS = {
  completed: CheckCircle2,
  failed: XCircle,
  pending: Clock,
};

const STATUS_COLORS = {
  completed: 'text-green-500',
  failed: 'text-red-500',
  pending: 'text-yellow-500',
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString();
}

interface SimulationStepItemProps {
  step: SimulationStep;
  isExpanded: boolean;
  onToggle: () => void;
}

function SimulationStepItem({ step, isExpanded, onToggle }: SimulationStepItemProps) {
  const StatusIcon = STATUS_ICONS[step.status];
  const statusColor = STATUS_COLORS[step.status];

  return (
    <div className="simulation-step border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="p-0.5 bg-white rounded-lg shadow-sm">
            <StatusIcon className={`w-3.5 h-3.5 ${statusColor}`} />
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-gray-900 block">{step.nodeTitle}</span>
            <span className="text-[10px] text-gray-500 capitalize">({step.nodeType})</span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Status:</span>
              <span className={`font-semibold capitalize ${statusColor}`}>{step.status}</span>
            </div>
            <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Time:</span>
              <span className="text-gray-900 font-mono text-[10px]">{formatTimestamp(step.timestamp)}</span>
            </div>
            {step.duration && (
              <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Duration:</span>
                <span className="text-gray-900 font-mono text-[10px]">{formatDuration(step.duration)}</span>
              </div>
            )}
            <div className="pt-1.5 border-t-2 border-gray-100">
              <span className="text-gray-600 text-[10px] font-semibold uppercase tracking-wide">Details:</span>
              <p className="text-gray-800 mt-1.5 leading-relaxed text-xs">{step.details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SimulationPanel() {
  const { nodes, edges, simulationResult, isSimulating, setSimulationResult, setIsSimulating } = useWorkflowStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const handleSimulate = async () => {
    // Clear previous results
    setSimulationResult(null);
    setValidationErrors([]);

    // Client-side validation first
    const validation = validateWorkflow(nodes, edges);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors.map(e => e.message));
      return;
    }

    // Run simulation
    setIsSimulating(true);
    try {
      const result = await simulateWorkflow({ nodes, edges });
      setSimulationResult(result);
      
      // Expand all steps by default
      if (result.steps.length > 0) {
        setExpandedSteps(new Set(result.steps.map((_, i) => i)));
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      setValidationErrors(['Simulation failed. Please try again.']);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClear = () => {
    setSimulationResult(null);
    setValidationErrors([]);
    setExpandedSteps(new Set());
  };

  const toggleStep = (index: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const isWorkflowEmpty = nodes.length === 0;

  return (
    <div className="bg-white flex flex-col max-h-[50vh]">
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-indigo-100 rounded-lg">
            <Play className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Test Workflow</h3>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 space-y-2 bg-gray-50">
        <button
          onClick={handleSimulate}
          disabled={isWorkflowEmpty || isSimulating}
          className="btn-primary w-full text-sm py-2 shadow-lg disabled:shadow-none"
        >
          {isSimulating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Run Simulation
            </span>
          )}
        </button>

        {(simulationResult || validationErrors.length > 0) && (
          <button
            onClick={handleClear}
            className="btn-secondary w-full text-sm py-2"
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Clear Results
            </span>
          </button>
        )}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="px-3 pb-3 bg-gray-50 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-red-100 rounded-lg">
                <XCircle className="w-3.5 h-3.5 text-red-600" />
              </div>
              <span className="text-xs font-bold text-red-800">Validation Failed</span>
            </div>
            <ul className="space-y-1.5">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-xs text-red-700 flex items-start gap-2 bg-white/50 p-2 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Simulation Results */}
      {simulationResult && (
        <div className="px-3 pb-3 bg-gray-50 overflow-y-auto custom-scrollbar max-h-96">
          {/* Summary */}
          <div
            className={`mb-3 p-3 rounded-xl border-2 shadow-md ${
              simulationResult.success
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1 rounded-lg ${
                simulationResult.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {simulationResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <span
                className={`font-bold text-sm ${
                  simulationResult.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {simulationResult.success ? 'Success' : 'Failed'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/60 p-2 rounded-lg">
                <span className="text-gray-600 font-medium block mb-0.5">Steps:</span>
                <span className="font-bold text-gray-900 text-base">
                  {simulationResult.steps.length}
                </span>
              </div>
              <div className="bg-white/60 p-2 rounded-lg">
                <span className="text-gray-600 font-medium block mb-0.5">Duration:</span>
                <span className="font-bold text-gray-900 text-base font-mono">
                  {formatDuration(simulationResult.duration)}
                </span>
              </div>
            </div>

            {simulationResult.errors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-red-200">
                {simulationResult.errors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-red-600">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Execution Steps */}
          {simulationResult.steps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <h4 className="text-xs font-bold text-gray-900">Execution Log</h4>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {simulationResult.steps.map((step, index) => (
                  <SimulationStepItem
                    key={index}
                    step={step}
                    isExpanded={expandedSteps.has(index)}
                    onToggle={() => toggleStep(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {isWorkflowEmpty && (
        <div className="px-3 pb-3 bg-gray-50">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />
              </div>
              <span className="text-xs font-semibold text-yellow-800">
                Add nodes to your workflow to run a simulation
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
