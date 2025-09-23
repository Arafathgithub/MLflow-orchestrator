

import React, { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import { NodeData, NodeType, EvaluateNodeData } from './types';
import { INITIAL_NODES, INITIAL_EDGES, SIDEBAR_NODES } from './constants';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import CustomNode from './components/customNodes/CustomNode';
import VisualizationModal from './components/VisualizationModal';
import ConfirmationModal from './components/ConfirmationModal';

let id = INITIAL_NODES.length + 1;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  [NodeType.DataSource]: CustomNode,
  [NodeType.SplitData]: CustomNode,
  [NodeType.TrainRegression]: CustomNode,
  [NodeType.TrainClassifier]: CustomNode,
  [NodeType.TrainForecaster]: CustomNode,
  [NodeType.Evaluate]: CustomNode,
  [NodeType.Deploy]: CustomNode,
  [NodeType.HyperparameterTuning]: CustomNode,
  [NodeType.FeatureEngineering]: CustomNode,
};

const App: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [visualizationNode, setVisualizationNode] = useState<Node<NodeData> | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<Node<NodeData> | null>(null);

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isPropertiesPanelVisible, setIsPropertiesPanelVisible] = useState(true);

  const [history, setHistory] = useState([{ nodes: INITIAL_NODES, edges: INITIAL_EDGES }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { nodes, edges } = history[currentIndex];

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, history.length]);
  
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const onNodesChange = useCallback((changes: NodeChange[]) => {
      setHistory(h => {
        const currentFlow = h[currentIndex];
        const newNodes = applyNodeChanges(changes, currentFlow.nodes);

        const isDragEnd = changes.some(c => c.type === 'position' && c.dragging === false);
        const isRemove = changes.some(c => c.type === 'remove');

        if (isDragEnd || isRemove) {
            const newHistory = h.slice(0, currentIndex + 1);
            newHistory.push({ nodes: newNodes, edges: currentFlow.edges });
            setCurrentIndex(newHistory.length - 1);
            return newHistory;
        } else {
            const newHistory = [...h];
            newHistory[currentIndex] = { ...currentFlow, nodes: newNodes };
            return newHistory;
        }
    });
  }, [currentIndex]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
      setHistory(h => {
        const currentFlow = h[currentIndex];
        const newEdges = applyEdgeChanges(changes, currentFlow.edges);

        const isRemove = changes.some(c => c.type === 'remove');
        if (isRemove) {
            const newHistory = h.slice(0, currentIndex + 1);
            newHistory.push({ nodes: currentFlow.nodes, edges: newEdges });
            setCurrentIndex(newHistory.length - 1);
            return newHistory;
        } else {
            const newHistory = [...h];
            newHistory[currentIndex] = { ...currentFlow, edges: newEdges };
            return newHistory;
        }
    });
  }, [currentIndex]);


  const onConnect = useCallback(
    (params: Edge | Connection) => {
        setHistory(h => {
            const currentFlow = h[currentIndex];
            const newEdges = addEdge({ ...params, animated: true, type: 'smoothstep' }, currentFlow.edges);
            const newHistory = h.slice(0, currentIndex + 1);
            newHistory.push({ nodes: currentFlow.nodes, edges: newEdges });
            setCurrentIndex(newHistory.length - 1);
            return newHistory;
        });
    },
    [currentIndex]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      
      if (typeof type === 'undefined' || !type) {
        return;
      }
      
      const nodeTemplate = SIDEBAR_NODES.find(n => n.type === type);
      if (!nodeTemplate) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node<NodeData> = {
        id: getId(),
        type,
        position,
        data: JSON.parse(JSON.stringify(nodeTemplate.data)), // Deep copy
      };
      
      setHistory(h => {
          const currentFlow = h[currentIndex];
          const newNodes = currentFlow.nodes.concat(newNode);
          const newHistory = h.slice(0, currentIndex + 1);
          newHistory.push({ nodes: newNodes, edges: currentFlow.edges });
          setCurrentIndex(newHistory.length - 1);
          return newHistory;
      });

    },
    [reactFlowInstance, currentIndex]
  );
  
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<NodeData>) => {
    setSelectedNode(node);
  }, []);

  const updateNodeConfig = useCallback((nodeId: string, data: Partial<NodeData>) => {
      setHistory(h => {
          const currentFlow = h[currentIndex];
          const newNodes = currentFlow.nodes.map((node) => {
            if (node.id === nodeId) {
              const newData = { ...node.data, ...data } as NodeData;
              return { ...node, data: newData };
            }
            return node;
          });
          const newHistory = h.slice(0, currentIndex + 1);
          newHistory.push({ nodes: newNodes, edges: currentFlow.edges });
          setCurrentIndex(newHistory.length - 1);
          
          setSelectedNode(prev => prev && prev.id === nodeId ? {...prev, data: {...prev.data, ...data} as NodeData} : prev);
          
          return newHistory;
      });
    }, [currentIndex]);
  
  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const onExport = useCallback(() => {
    const flow = {
      nodes: nodes.map(({ id, type, position, data }) => {
        // The `onDeleteRequest` function is a view-layer concern and should not be serialized.
        const { onDeleteRequest, ...serializableData } = data as any;
        return { id, type, position, data: serializableData };
      }),
      edges: edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({ id, source, target, sourceHandle, targetHandle })),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flow, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "ml_workflow.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [nodes, edges]);

  const handleVisualize = useCallback((node: Node<NodeData>) => {
    if (node.type === NodeType.Evaluate) {
      setVisualizationNode(node);
    }
  }, []);

  const handleCloseVisualization = useCallback(() => {
    setVisualizationNode(null);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setHistory(h => {
        const currentFlow = h[currentIndex];
        const newNodes = currentFlow.nodes.filter(n => n.id !== nodeId);
        const newEdges = currentFlow.edges.filter(e => e.source !== nodeId && e.target !== nodeId);

        if (newNodes.length === currentFlow.nodes.length) {
            return h; // No change
        }
        
        const newHistory = h.slice(0, currentIndex + 1);
        newHistory.push({ nodes: newNodes, edges: newEdges });
        setCurrentIndex(newHistory.length - 1);
        return newHistory;
    });
    setSelectedNode(prev => (prev?.id === nodeId ? null : prev));
  }, [currentIndex]);

  const handleDeleteRequest = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setNodeToDelete(node);
    }
  }, [nodes]);

  const handleConfirmDelete = useCallback(() => {
    if (nodeToDelete) {
      deleteNode(nodeToDelete.id);
      setNodeToDelete(null);
    }
  }, [nodeToDelete, deleteNode]);

  const handleCancelDelete = useCallback(() => {
    setNodeToDelete(null);
  }, []);

  const handleLaunchMlflow = useCallback(() => {
    const mlflowUiUrl = 'http://localhost:5000';
    window.open(mlflowUiUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const toggleSidebar = useCallback(() => setIsSidebarVisible(v => !v), []);
  const togglePropertiesPanel = useCallback(() => setIsPropertiesPanelVisible(v => !v), []);

  const nodesForFlow = useMemo(() => {
    return nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            onDeleteRequest: handleDeleteRequest
        }
    }));
  }, [nodes, handleDeleteRequest]);

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header 
        onExport={onExport} 
        onUndo={undo} 
        onRedo={redo} 
        canUndo={canUndo} 
        canRedo={canRedo} 
        onLaunchMlflow={handleLaunchMlflow}
        onToggleSidebar={toggleSidebar}
        onToggleProperties={togglePropertiesPanel}
        isSidebarVisible={isSidebarVisible}
        isPropertiesPanelVisible={isPropertiesPanelVisible}
      />
      <div className="flex flex-grow overflow-hidden">
        <ReactFlowProvider>
          {isSidebarVisible && <Sidebar />}
          <div className="flex-grow h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodesForFlow}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              fitView
              className="bg-gray-800"
            >
               <div className="absolute left-4 top-4 z-10 p-2 bg-gray-900/50 rounded-lg backdrop-blur-sm">
                  <h2 className="text-lg font-bold text-cyan-400">ML Pipeline</h2>
                </div>
            </ReactFlow>
          </div>
          {isPropertiesPanelVisible && (
            <PropertiesPanel 
                selectedNode={selectedNode} 
                onUpdate={updateNodeConfig} 
                onVisualize={handleVisualize} 
                nodes={nodes}
                edges={edges}
            />
          )}
        </ReactFlowProvider>
      </div>
       {visualizationNode && (
        <VisualizationModal 
          node={visualizationNode as Node<EvaluateNodeData>} 
          onClose={handleCloseVisualization} 
        />
      )}
      <ConfirmationModal
        isOpen={!!nodeToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Node Deletion"
      >
        <p>Are you sure you want to delete the node <strong className="text-cyan-400">"{nodeToDelete?.data.label}"</strong>?</p>
        <p className="mt-2 text-sm text-gray-400">This will also remove all connected edges. You can undo this action.</p>
      </ConfirmationModal>
    </div>
  );
};

export default App;