import React, { useMemo } from 'react';
import { Node } from 'reactflow';
import { EvaluateNodeData } from '../types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface VisualizationModalProps {
    node: Node<EvaluateNodeData>;
    onClose: () => void;
}

// Helper to generate a mock score between a min and max
const generateScore = (min = 0.7, max = 0.98) => parseFloat((Math.random() * (max - min) + min).toFixed(3));
const generateError = (min = 5, max = 50) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

// Helper to generate data points for an ROC curve
const generateRocData = () => {
    let points = [{ fpr: 0, tpr: 0 }];
    let lastFpr = 0;
    let lastTpr = 0;
    while(lastFpr < 0.95) {
        lastFpr += Math.random() * 0.2;
        lastTpr += Math.random() * (1 - lastTpr) * 0.5 + (lastFpr - points[points.length-1].fpr);
        points.push({ 
            fpr: parseFloat(Math.min(1.0, lastFpr).toFixed(2)), 
            tpr: parseFloat(Math.min(1.0, lastTpr).toFixed(2)) 
        });
    }
    points.push({ fpr: 1, tpr: 1 });
    return points;
}

const METRIC_CONFIG: Record<string, { type: 'score' | 'error' | 'roc', dataGen: () => any }> = {
    'Accuracy': { type: 'score', dataGen: () => [{ name: 'Accuracy', value: generateScore() }] },
    'Precision': { type: 'score', dataGen: () => [{ name: 'Precision', value: generateScore() }] },
    'Recall': { type: 'score', dataGen: () => [{ name: 'Recall', value: generateScore() }] },
    'F1-Score': { type: 'score', dataGen: () => [{ name: 'F1-Score', value: generateScore() }] },
    'R2 Score': { type: 'score', dataGen: () => [{ name: 'R2 Score', value: generateScore(0.6, 0.9) }] },
    'ROC AUC': { type: 'roc', dataGen: generateRocData },
    'MAE': { type: 'error', dataGen: () => [{ name: 'MAE', value: generateError(5, 20) }] },
    'MSE': { type: 'error', dataGen: () => [{ name: 'MSE', value: generateError(20, 100) }] },
}

const ChartCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        <h4 className="text-md font-bold text-cyan-400 mb-4 text-center">{title}</h4>
        <div className="w-full h-52">
            {children}
        </div>
    </div>
);

const VisualizationModal: React.FC<VisualizationModalProps> = ({ node, onClose }) => {
    const chartData = useMemo(() => {
        const data: Record<string, any> = {};
        node.data.metrics.forEach(metric => {
            if (METRIC_CONFIG[metric]) {
                data[metric] = METRIC_CONFIG[metric].dataGen();
            }
        });
        return data;
    }, [node.data.metrics, node.id]);

    const renderChart = (metric: string) => {
        const config = METRIC_CONFIG[metric];
        const data = chartData[metric];
        if (!config || !data) return null;

        switch(config.type) {
            case 'score':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis type="number" domain={[0, 1]} stroke="#A0AEC0" />
                            <YAxis type="category" dataKey="name" hide />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                            <Bar dataKey="value" fill="#2DD4BF" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'error':
                 return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                            <Bar dataKey="value" fill="#F56565" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'roc':
                return (
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="fpr" type="number" stroke="#A0AEC0">
                                <Label value="False Positive Rate" offset={-15} position="insideBottom" fill="#A0AEC0" />
                            </XAxis>
                            <YAxis stroke="#A0AEC0">
                                 <Label value="True Positive Rate" angle={-90} position="insideLeft" fill="#A0AEC0" style={{textAnchor: 'middle'}} />
                            </YAxis>
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                            <Legend wrapperStyle={{ color: '#A0AEC0' }} />
                            <Line type="monotone" dataKey="tpr" stroke="#2DD4BF" strokeWidth={2} dot={false} name="ROC Curve" />
                            <Line type="linear" dataKey="fpr" stroke="#718096" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Random" />
                        </LineChart>
                    </ResponsiveContainer>
                );
            default: return null;
        }
    }
    
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                style={{ animationFillMode: 'forwards' }}
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white truncate">
                        Evaluation Metrics for: <span className="text-cyan-400">{node.data.label}</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close visualization modal">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="p-6 flex-grow overflow-y-auto">
                    {node.data.metrics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {node.data.metrics.map(metric => (
                                <ChartCard key={metric} title={metric}>
                                    {renderChart(metric)}
                                </ChartCard>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>No metrics selected for visualization.</p>
                        </div>
                    )}
                </main>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default VisualizationModal;
