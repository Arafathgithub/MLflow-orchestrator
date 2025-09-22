import React, { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { NodeData, NodeType } from '../../types';

const ICONS: Record<string, React.ReactNode> = {
  [NodeType.DataSource]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4" /></svg>,
  [NodeType.SplitData]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  [NodeType.TrainRegression]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  [NodeType.TrainClassifier]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  [NodeType.TrainForecaster]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  [NodeType.Evaluate]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  [NodeType.Deploy]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  [NodeType.HyperparameterTuning]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  [NodeType.FeatureEngineering]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6M8 8h8M16 16h6" /></svg>,
};

const NODE_STYLES: Record<string, { header: string, border: string }> = {
    [NodeType.DataSource]: { header: 'bg-green-600', border: 'border-green-500' },
    [NodeType.SplitData]: { header: 'bg-blue-600', border: 'border-blue-500' },
    [NodeType.FeatureEngineering]: { header: 'bg-teal-600', border: 'border-teal-500' },
    [NodeType.TrainRegression]: { header: 'bg-purple-600', border: 'border-purple-500' },
    [NodeType.TrainClassifier]: { header: 'bg-purple-600', border: 'border-purple-500' },
    [NodeType.TrainForecaster]: { header: 'bg-purple-600', border: 'border-purple-500' },
    [NodeType.HyperparameterTuning]: { header: 'bg-orange-600', border: 'border-orange-500' },
    [NodeType.Evaluate]: { header: 'bg-yellow-600', border: 'border-yellow-500' },
    [NodeType.Deploy]: { header: 'bg-red-600', border: 'border-red-500' },
};

const NodeInfo: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-gray-400">{label}:</span>
    <span className="font-mono text-gray-200 bg-gray-900/50 px-2 py-0.5 rounded truncate">{value}</span>
  </div>
);


const CustomNode: React.FC<NodeProps<NodeData>> = ({ id, data, type, selected }) => {
    const { deleteElements } = useReactFlow();
    const nodeType = type as NodeType;
    const styles = NODE_STYLES[nodeType];
    
    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the "${data.label}" node?`)) {
            deleteElements({ nodes: [{ id }] });
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
            default: // For training, fe, and tuning nodes
                return <>
                    <Handle type="target" position={Position.Left} style={handleStyle} />
                    <Handle type="source" position={Position.Right} style={handleStyle} />
                </>;
        }
    };
    
    return (
        <div className={`relative group w-60 shadow-xl rounded-lg bg-gray-800 border-2 ${selected ? styles.border : 'border-gray-600/50'} transition-all duration-200 hover:shadow-cyan-500/20`}>
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