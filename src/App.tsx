import { useCallback, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Workflow, GitBranch } from 'lucide-react';

import { WorkflowCanvas, NodePalette } from './components/canvas';
import { NodeFormPanel } from './components/forms';
import { SimulationPanel } from './components/simulation';
import { useWorkflowStore } from './store';
import type { NodeType } from './types';

function WorkflowDesigner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { addNode, nodes } = useWorkflowStore();

  // Handle drag start from palette
  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeType: NodeType) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  // Handle drop on canvas
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const nodeType = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (!nodeType || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      
      // Calculate position relative to the canvas
      const position = {
        x: event.clientX - reactFlowBounds.left - 110,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      // Add the node
      addNode(nodeType, position);
    },
    [addNode]
  );

  // Handle drag over
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-2.5 rounded-xl shadow-md">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                HR Workflow Designer
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">Create and test your HR workflows visually</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <GitBranch className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">{nodes.length} nodes</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <NodePalette onDragStart={handleDragStart} />

        {/* Canvas Area */}
        <div ref={reactFlowWrapper} className="flex-1 h-full">
          <WorkflowCanvas onDrop={handleDrop} onDragOver={handleDragOver} />
        </div>

        {/* Right Sidebar - Properties & Simulation */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <NodeFormPanel />
          </div>
          <div className="border-t-2 border-gray-200">
            <SimulationPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowDesigner />
    </ReactFlowProvider>
  );
}

export default App;
