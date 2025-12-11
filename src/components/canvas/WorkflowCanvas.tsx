import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  BackgroundVariant,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from '../nodes';
import { useWorkflowStore } from '../../store';
import type { NodeType, WorkflowNode, WorkflowEdge } from '../../types';
import { NODE_TYPES } from '../../types';

interface WorkflowCanvasProps {
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
}

export default function WorkflowCanvas({ onDrop, onDragOver }: WorkflowCanvasProps) {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes,
    setEdges,
    selectNode,
    selectedNodeId,
  } = useWorkflowStore();

  
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<WorkflowEdge>([]);

  
  useEffect(() => {
    setRfNodes(storeNodes);
  }, [storeNodes, setRfNodes]);

  useEffect(() => {
    setRfEdges(storeEdges);
  }, [storeEdges, setRfEdges]);

  
  const handleNodesChange: OnNodesChange<WorkflowNode> = useCallback(
    (changes) => {
      onNodesChange(changes);
      
      setRfNodes((currentNodes) => {
        
        const hasPositionChange = changes.some(
          (change) => change.type === 'position' && !change.dragging
        );
        if (hasPositionChange) {
          setNodes(currentNodes);
        }
        return currentNodes;
      });
    },
    [onNodesChange, setNodes, setRfNodes]
  );

  const handleEdgesChange: OnEdgesChange<WorkflowEdge> = useCallback(
    (changes) => {
      onEdgesChange(changes);
      
      setRfEdges((currentEdges) => {
        setEdges(currentEdges);
        return currentEdges;
      });
    },
    [onEdgesChange, setEdges, setRfEdges]
  );

  
  const isValidConnection = useCallback(
    (connection: Connection | WorkflowEdge): boolean => {
      const sourceNode = rfNodes.find((n) => n.id === connection.source);
      const targetNode = rfNodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      
      if (sourceNode.data?.type === NODE_TYPES.END) return false;

      
      if (targetNode.data?.type === NODE_TYPES.START) return false;

      
      if (connection.source === connection.target) return false;

      
      const existingEdge = rfEdges.find(
        (e) => e.source === connection.source && e.target === connection.target
      );
      if (existingEdge) return false;

      return true;
    },
    [rfNodes, rfEdges]
  );

  
  const onConnect: OnConnect = useCallback(
    (params) => {
      if (!isValidConnection(params)) return;

      setRfEdges((eds) => {
        const newEdges = addEdge(
          {
            ...params,
            id: `edge-${params.source}-${params.target}-${Date.now()}`,
            type: 'smoothstep',
            animated: true,
          },
          eds
        );
        setEdges(newEdges as WorkflowEdge[]);
        return newEdges;
      });
    },
    [setRfEdges, setEdges, isValidConnection]
  );

  
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: WorkflowNode) => {
      
      const target = event.target as HTMLElement;
      if (target.classList.contains('react-flow__handle')) {
        return;
      }
      selectNode(node.id);
    },
    [selectNode]
  );

  
  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  
  const getMinimapNodeColor = (node: WorkflowNode): string => {
    const nodeType = node.data?.type as NodeType;
    const colors: Record<NodeType, string> = {
      [NODE_TYPES.START]: '#10b981',
      [NODE_TYPES.TASK]: '#3b82f6',
      [NODE_TYPES.APPROVAL]: '#f59e0b',
      [NODE_TYPES.AUTOMATED]: '#8b5cf6',
      [NODE_TYPES.END]: '#ef4444',
    };
    return colors[nodeType] || '#6b7280';
  };

  return (
    <div 
      className="flex-1 h-full" 
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={rfNodes.map((n) => ({
          ...n,
          selected: n.id === selectedNodeId,
        }))}
        edges={rfEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 3 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-left"
          nodeColor={getMinimapNodeColor}
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-white border border-gray-200 rounded-lg"
        />
      </ReactFlow>
    </div>
  );
}
