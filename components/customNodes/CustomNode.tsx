



import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, NodeType } from '../../types';
import { ICONS } from '../../constants';

const NODE_STYLES: Record<string, { header: string, border: string }> = {
    [NodeType.DataSource]: { header: 'bg-green-600', border: 'border-green-500' },
    [NodeType.SplitData]: { header: 'bg-blue-600', border: 'border-blue-500' },
    [NodeType.FeatureEngineering]: { header: 'bg-teal-600', border: 'border-teal-500' },
    [NodeType.PythonScript]: { header: 'bg-gray-600', border: 'border-gray-500' },
    [NodeType.TrainRegression]: { header: 'bg-purple-600', border: 'border-purple-500' },
    [NodeType.TrainClassifier]: { header: 'bg-purple-600', border: 'border-purple-500' },
    [NodeType.TrainForecaster]: { header: 'bg-purple-600', border: 'border-purple-500' },
    [NodeType.HyperparameterTuning]: { header: 'bg-orange-600', border: 'border-orange-500' },
    [NodeType.Evaluate]: { header: 'bg-yellow-600', border: 'border-yellow-500' },
    [NodeType.Deploy]: { header: 'bg-red-600', border: 'border-red-500' },
    [NodeType.ExportModel]: { header: 'bg-indigo-600', border: 'border-indigo-500' },
};

const NodeInfo: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-gray-400">{label}:</span>
    <span className="font-mono text-gray-200 bg-gray-900/50 px-2 py-0.5 rounded truncate">{value}</span>
  </div>
);


const CustomNode: React.FC<NodeProps<NodeData>> = ({ id, data, type, selected }) => {
    const nodeType = type as NodeType;
    const styles = NODE_STYLES[nodeType];
    
    // The confirmation is now handled by a custom modal in the parent component.
    // This function just signals the intent to delete.
    const augmentedData = data as NodeData & { onDeleteRequest?: (nodeId: string) => void };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (augmentedData.onDeleteRequest) {
            augmentedData.onDeleteRequest(id);
        }
    };

    const renderNodeBody = () => {
        switch(nodeType) {
            case NodeType.DataSource:
                return <NodeInfo label="Source" value={(data as any).sourcePath.split('/').pop()} />;
            case NodeType.SplitData:
                return <NodeInfo label="Test Size" value={`${(data as any).testSize * 100}%`} />;
            case NodeType.FeatureEngineering:
                return <NodeInfo label="Technique" value={(data as any).technique} />;
            case NodeType.PythonScript:
                return <NodeInfo label="Type" value="Custom Script" />;
            case NodeType.TrainClassifier:
            case NodeType.TrainRegression:
            case NodeType.TrainForecaster:
                return <NodeInfo label="Algorithm" value={(data as any).algorithm} />;
            case NodeType.HyperparameterTuning:
                return <NodeInfo label="Strategy" value={(data as any).strategy} />;
            case NodeType.Evaluate:
                return <NodeInfo label="Metrics" value={(data as any).metrics.length} />;
            case NodeType.Deploy:
                return <NodeInfo label="Target" value={(data as any).targetEnv} />;
            case NodeType.ExportModel:
                return <NodeInfo label="Path" value={(data as any).filePath} />;
            default:
                return null;
        }
    }

    const renderHandles = () => {
        const handleStyle = { background: '#555', width: '10px', height: '10px' };
        const labelBaseClasses = "absolute text-gray-400 text-xs pointer-events-none";

        switch (nodeType) {
            case NodeType.DataSource:
                return <Handle type="source" position={Position.Right} id="output" style={handleStyle} />;
            case NodeType.SplitData:
                return <>
                    <Handle type="target" position={Position.Left} style={handleStyle} />
                    <Handle type="source" position={Position.Right} id="train" style={{ ...handleStyle, top: '40%' }} />
                    <div className={`${labelBaseClasses} right-[-45px] top-[40%] -translate-y-1/2`}>train</div>
                    <Handle type="source" position={Position.Right} id="test" style={{ ...handleStyle, top: '60%' }} />
                    <div className={`${labelBaseClasses} right-[-40px] top-[60%] -translate-y-1/2`}>test</div>
                </>;
            case NodeType.Evaluate:
                 return <>
                    <Handle type="target" position={Position.Left} id="model" style={{ ...handleStyle, top: '40%' }} />
                    <div className={`${labelBaseClasses} left-[-50px] top-[40%] -translate-y-1/2`}>model</div>
                    <Handle type="target" position={Position.Left} id="data" style={{ ...handleStyle, top: '60%' }} />
                    <div className={`${labelBaseClasses} left-[-40px] top-[60%] -translate-y-1/2`}>data</div>
                    <Handle type="source" position={Position.Right} style={handleStyle} />
                </>;
            case NodeType.Deploy:
                return <Handle type="target" position={Position.Left} style={handleStyle} />;
            case NodeType.ExportModel:
                return <Handle type="target" position={Position.Left} style={handleStyle} />;
            default: // For training, fe, tuning, and python script nodes
                return <>
                    <Handle type="target" position={Position.Left} style={handleStyle} />
                    <Handle type="source" position={Position.Right} style={handleStyle} />
                </>;
        }
    };
    
    const status = data.status || 'idle';
    const borderColor = selected ? styles.border :
        status === 'running' ? 'border-cyan-500 animate-pulse' :
        status === 'success' ? 'border-green-500' :
        status === 'error' ? 'border-red-500' :
        'border-gray-600/50';

    return (
        <div className={`relative group w-60 shadow-xl rounded-lg bg-gray-800 border-2 ${borderColor} transition-all duration-200 hover:shadow-cyan-500/20`}>
             <button
                onClick={handleDelete}
                className={`absolute top-2 right-2 p-1 bg-red-600/80 rounded-full text-white ${selected ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 z-10 hover:bg-red-500`}
                aria-label={`Delete node ${data.label}`}
                title="Delete node"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
            <div className={`flex items-center p-3 rounded-t-md ${styles.header} text-white`}>
                <div className="mr-3">{ICONS[nodeType]}</div>
                <div className="font-bold text-base truncate">{data.label}</div>
            </div>
            <div className="p-3 space-y-2">
                {renderNodeBody()}
            </div>
            {renderHandles()}
        </div>
    );
};

export default memo(CustomNode);