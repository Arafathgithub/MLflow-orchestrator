
import React, { useState, useEffect, useMemo } from 'react';
import { Node, Edge } from 'reactflow';
// FIX: Import specific node data types for type casting.
import {
  NodeData,
  NodeType,
  DataSourceNodeData,
  SplitDataNodeData,
  TrainClassifierNodeData,
  TrainRegressionNodeData,
  TrainForecasterNodeData,
  EvaluateNodeData,
  DeployNodeData,
  HyperparameterTuningNodeData,
  FeatureEngineeringNodeData,
  ExportModelNodeData,
  PythonScriptNodeData,
} from '../types';

interface PropertiesPanelProps {
  selectedNode: Node<NodeData> | null;
  onUpdate: (nodeId: string, data: Partial<NodeData>) => void;
  onVisualize: (node: Node<NodeData>) => void;
  nodes: Node<NodeData>[];
  edges: Edge[];
}

const generateFeatureEngineeringCode = (data: FeatureEngineeringNodeData): string => {
  const columns = data.columns.split(',').map(c => c.trim()).filter(Boolean);
  const cols_list = `['${columns.join("', '")}']`;
  
  switch (data.technique) {
    case 'Standardization':
      return `from sklearn.preprocessing import StandardScaler

# Assuming df is the input dataframe
scaler = StandardScaler()
cols_to_scale = ${cols_list}
df[cols_to_scale] = scaler.fit_transform(df[cols_to_scale])`;
    case 'OneHotEncoding':
      return `import pandas as pd

# Assuming df is the input dataframe
cols_to_encode = ${cols_list}
df = pd.get_dummies(df, columns=cols_to_encode, drop_first=True)`;
    case 'InteractionTerms':
      return `from sklearn.preprocessing import PolynomialFeatures
import pandas as pd

# Assuming df is the input dataframe
poly = PolynomialFeatures(degree=${data.degree || 2}, include_bias=False, interaction_only=True)
interaction_features = poly.fit_transform(df[${cols_list}])
interaction_df = pd.DataFrame(interaction_features, columns=poly.get_feature_names_out(${cols_list}))

# Add new features to the original dataframe
df = pd.concat([df, interaction_df], axis=1)`;
    default:
      return '# Select a technique to generate code.';
  }
}

const generateDeployCode = (data: DeployNodeData): string => {
  return `import mlflow
from mlflow.tracking import MlflowClient

# This code assumes a trained 'model' object is available from a previous step.
# It also assumes 'params' and 'metrics' dictionaries are available.
# Example data (replace with actual variables from your pipeline):
params = {"n_estimators": 100, "max_depth": 10, "random_state": 42}
metrics = {"accuracy": 0.95, "f1_score": 0.92}

# Start an MLflow run to log the model, parameters, and metrics
with mlflow.start_run() as run:
    print("MLflow Run ID:", run.info.run_id)

    # Log parameters
    print("Logging parameters:", params)
    mlflow.log_params(params)

    # Log metrics
    print("Logging metrics:", metrics)
    mlflow.log_metrics(metrics)

    # Log the model
    print("Logging model:", "${data.modelName}")
    mlflow.sklearn.log_model(model, artifact_path="${data.modelName}")

    # Register the model in the MLflow Model Registry
    model_uri = f"runs:/{run.info.run_id}/${data.modelName}"
    print(f"Registering model from {model_uri} as '${data.modelName}'")
    registered_model = mlflow.register_model(
        model_uri=model_uri,
        name="${data.modelName}"
    )

    # Transition the model version to the specified stage (Staging or Production)
    client = MlflowClient()
    print(f"Transitioning model version {registered_model.version} to '${data.targetEnv}'")
    client.transition_model_version_stage(
        name="${data.modelName}",
        version=registered_model.version,
        stage="${data.targetEnv}"
    )

print("Deployment complete.")`;
};

const generateExportModelCode = (data: ExportModelNodeData): string => {
  const filePath = data.filePath || 'models/model.pkl';
  return `import joblib
import os

# Assuming 'model' is the trained model object from a previous step.
# Define the directory and ensure it exists.
output_dir = os.path.dirname('${filePath}')
if output_dir:
    os.makedirs(output_dir, exist_ok=True)

# Save the model using joblib
joblib.dump(model, '${filePath}')

print(f"Model successfully saved to: {'${filePath}'}")`;
};

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedNode, onUpdate, onVisualize, nodes, edges }) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'code'>('properties');
  const [activePanelTab, setActivePanelTab] = useState<'inspector' | 'json'>('inspector');
  
  // State for data preview feature
  const [previewData, setPreviewData] = useState<{ headers: string[], rows: string[][] } | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const flowJson = useMemo(() => {
    const flow = {
      nodes: nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
      edges: edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({ id, source, target, sourceHandle, targetHandle })),
    };
    return JSON.stringify(flow, null, 2);
  }, [nodes, edges]);

  useEffect(() => {
    // Reset preview state when node changes
    setPreviewData(null);
    setIsLoadingPreview(false);
    setPreviewError(null);

    if (selectedNode) {
      setActiveTab('properties');
    } else {
      setActivePanelTab('inspector');
    }
  }, [selectedNode?.id]);

  const handlePreviewData = async (sourcePath: string) => {
    setIsLoadingPreview(true);
    setPreviewError(null);
    setPreviewData(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // Simulate a fetch based on path. Only "churn.csv" will "succeed".
        if (!sourcePath.toLowerCase().includes('churn.csv')) {
            throw new Error(`File not found at path: ${sourcePath}`);
        }

        const mockCsvData = `"customerID","gender","SeniorCitizen","Partner","tenure","MonthlyCharges","Churn"
"7590-VHVEG","Female",0,"Yes",1,29.85,"No"
"5575-GNVDE","Male",0,"No",34,56.95,"No"
"3668-QPYBK","Male",0,"No",2,53.85,"Yes"
"7795-CFOCW","Male",0,"No",45,42.3,"No"
"9237-HQITU","Female",0,"No",2,70.7,"Yes"`;

        const lines = mockCsvData.trim().split('\n');
        // Simple CSV parsing, not robust but fine for this mock
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.replace(/"/g, '')));
        
        if (rows.length === 0) {
           throw new Error('CSV file is empty or invalid.');
        }

        setPreviewData({ headers, rows });
    } catch (error) {
        if (error instanceof Error) {
            setPreviewError(error.message);
        } else {
            setPreviewError("An unknown error occurred.");
        }
    } finally {
        setIsLoadingPreview(false);
    }
  };

  if (!selectedNode) {
    return (
      <aside className="w-80 bg-gray-900 p-6 border-l border-gray-700/50 flex flex-col">
        <h3 className="text-xl font-bold mb-4 text-cyan-400">Pipeline Overview</h3>
        <div className="flex border-b border-gray-700 mb-4">
            <button
                onClick={() => setActivePanelTab('inspector')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activePanelTab === 'inspector' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
                Inspector
            </button>
            <button
                onClick={() => setActivePanelTab('json')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activePanelTab === 'json' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
                JSON
            </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
            {activePanelTab === 'inspector' ? (
                <div className="text-center text-gray-400 mt-8">
                    <p>Select a node to view and edit its properties.</p>
                </div>
            ) : (
                <div className="h-full">
                    <textarea
                        readOnly
                        value={flowJson}
                        className="block w-full h-full bg-gray-800 border-gray-600 rounded-md shadow-sm font-mono text-xs p-2 resize-none"
                    />
                </div>
            )}
        </div>
      </aside>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    if (e.target.type === 'number') {
        parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) parsedValue = 0;
    }
    
    if (selectedNode?.type === NodeType.FeatureEngineering) {
      const newPartialData = { [name]: parsedValue };
      const currentData = selectedNode.data as FeatureEngineeringNodeData;
      const updatedData = { ...currentData, ...newPartialData };
      const pythonCode = generateFeatureEngineeringCode(updatedData);
      onUpdate(selectedNode.id, { ...newPartialData, pythonCode });
    } else if (selectedNode?.type === NodeType.Deploy) {
      const newPartialData = { [name]: parsedValue };
      const currentData = selectedNode.data as DeployNodeData;
      const updatedData = { ...currentData, ...newPartialData };
      const pythonCode = generateDeployCode(updatedData);
      onUpdate(selectedNode.id, { ...newPartialData, pythonCode });
    } else if (selectedNode?.type === NodeType.ExportModel) {
      const newPartialData = { [name]: parsedValue };
      const currentData = selectedNode.data as ExportModelNodeData;
      const updatedData = { ...currentData, ...newPartialData };
      const pythonCode = generateExportModelCode(updatedData);
      onUpdate(selectedNode.id, { ...newPartialData, pythonCode });
    } else {
      onUpdate(selectedNode.id, { [name]: parsedValue } as any);
    }
  };
  
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            value.push(options[i].value);
        }
    }
    onUpdate(selectedNode.id, { metrics: value });
  };
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(selectedNode.id, { pythonCode: e.target.value });
  };


  const renderNodeProperties = () => {
    // FIX: Use type assertions within each case to allow access to type-specific properties.
    // The `data` variable was removed from here to avoid type errors.
    switch (selectedNode.type as NodeType) {
      case NodeType.DataSource: {
        const data = selectedNode.data as DataSourceNodeData;
        return (
          <>
            <label className="block text-sm font-medium text-gray-300">Source Path</label>
            <input type="text" name="sourcePath" value={data.sourcePath} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" />
            <div className="mt-4">
                <button
                    onClick={() => handlePreviewData(data.sourcePath)}
                    disabled={isLoadingPreview}
                    className="w-full flex justify-center items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    {isLoadingPreview ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Loading Preview...
                        </>
                    ) : 'Preview Data'}
                </button>
            </div>

            {previewError && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-md text-red-300 text-sm">
                    <strong>Error:</strong> {previewError}
                </div>
            )}

            {previewData && (
                 <div className="mt-4">
                     <h4 className="text-md font-semibold text-gray-200 mb-2">Data Preview</h4>
                     <div className="overflow-x-auto border border-gray-700 rounded-lg max-h-60">
                         <table className="min-w-full text-sm text-left text-gray-300">
                             <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                                 <tr>
                                     {previewData.headers.map(header => (
                                         <th key={header} scope="col" className="px-4 py-2 font-medium">
                                             {header}
                                         </th>

                                     ))}
                                 </tr>
                             </thead>
                             <tbody className="bg-gray-800">
                                 {previewData.rows.map((row, rowIndex) => (
                                     <tr key={rowIndex} className="border-b border-gray-700 hover:bg-gray-700/50">
                                         {row.map((cell, cellIndex) => (
                                             <td key={cellIndex} className="px-4 py-2 whitespace-nowrap">
                                                 {cell}
                                             </td>
                                         ))}
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 </div>
            )}
          </>
        );
      }
      case NodeType.SplitData: {
        const data = selectedNode.data as SplitDataNodeData;
        return (
          <>
            <label className="block text-sm font-medium text-gray-300">Test Size (0.0 - 1.0)</label>
            <input type="number" name="testSize" value={data.testSize} onChange={handleInputChange} step="0.05" min="0" max="1" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" />
            <label className="block text-sm font-medium text-gray-300 mt-4">Random State</label>
            <input type="number" name="randomState" value={data.randomState} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </>
        );
      }
      case NodeType.FeatureEngineering: {
        const data = selectedNode.data as FeatureEngineeringNodeData;
        return (
          <>
            <label className="block text-sm font-medium text-gray-300">Technique</label>
            <select name="technique" value={data.technique} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500">
              <option value="Standardization">Standardization (Scaling)</option>
              <option value="OneHotEncoding">One-Hot Encoding</option>
              <option value="InteractionTerms">Interaction Terms</option>
            </select>
            
            <label className="block text-sm font-medium text-gray-300 mt-4">Target Columns</label>
            <p className="text-xs text-gray-400 mb-1">Enter comma-separated column names.</p>
            <input 
              type="text" 
              name="columns" 
              value={data.columns} 
              onChange={handleInputChange} 
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" 
              placeholder="e.g., age, income, category"
            />

            {data.technique === 'InteractionTerms' && (
              <>
                <label className="block text-sm font-medium text-gray-300 mt-4">Degree</label>
                <input 
                  type="number" 
                  name="degree" 
                  value={data.degree ?? 2} 
                  onChange={handleInputChange} 
                  min="2"
                  className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
              </>
            )}
          </>
        );
      }
      case NodeType.PythonScript: {
        return (
            <p className="text-gray-400 text-sm p-2 bg-gray-800/50 rounded-md border border-gray-700">
                This node executes custom Python code. Edit the script in the 'Code' tab.
                <br/><br/>
                The input dataframe is available as the variable <code className="bg-gray-700 text-cyan-400 px-1 rounded">df</code>. The output must be a pandas DataFrame assigned to a <code className="bg-gray-700 text-cyan-400 px-1 rounded">result_df</code> variable.
            </p>
        );
      }
      case NodeType.TrainRegression: {
        const data = selectedNode.data as TrainRegressionNodeData;
        return (
          <>
            <label className="block text-sm font-medium text-gray-300">Algorithm</label>
            <select name="algorithm" value={data.algorithm} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500">
              <option>LinearRegression</option>
              <option>Ridge</option>
              <option>Lasso</option>
            </select>
            <label className="block text-sm font-medium text-gray-300 mt-4">Alpha</label>
            <input type="number" name="alpha" value={data.alpha} onChange={handleInputChange} step="0.1" min="0" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </>
        );
      }
      case NodeType.TrainClassifier: {
        const data = selectedNode.data as TrainClassifierNodeData;
        return (
          <>
             <label className="block text-sm font-medium text-gray-300">Algorithm</label>
            <select name="algorithm" value={data.algorithm} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500">
              <option>LogisticRegression</option>
              <option>RandomForestClassifier</option>
              <option>SVC</option>
            </select>
            <label className="block text-sm font-medium text-gray-300 mt-4">Max Depth</label>
            <input type="number" name="maxDepth" value={data.maxDepth} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" />
            <label className="block text-sm font-medium text-gray-300 mt-4">N Estimators</label>
            <input type="number" name="nEstimators" value={data.nEstimators} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </>
        );
      }
      case NodeType.TrainForecaster: {
        const data = selectedNode.data as TrainForecasterNodeData;
        return (
          <>
            <label className="block text-sm font-medium text-gray-300">Algorithm</label>
            <select name="algorithm" value={data.algorithm} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500">
              <option>ARIMA</option>
              <option>Prophet</option>
            </select>
            <label className="block text-sm font-medium text-gray-300 mt-4">Seasonal Period</label>
            <input type="number" name="seasonalPeriod" value={data.seasonalPeriod} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </>
        );
      }
      case NodeType.Evaluate: {
        const data = selectedNode.data as EvaluateNodeData;
        return (
            <>
                <label className="block text-sm font-medium text-gray-300">Evaluation Metrics</label>
                <select name="metrics" multiple value={data.metrics} onChange={handleMultiSelectChange} className="mt-1 block w-full h-40 bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500">
                    <option>Accuracy</option>
                    <option>Precision</option>
                    <option>Recall</option>
                    <option>F1-Score</option>
                    <option>ROC AUC</option>
                    <option>MAE</option>
                    <option>MSE</option>
                    <option>R2 Score</option>
                </select>
                 <button
                    onClick={() => onVisualize(selectedNode)}
                    className="mt-4 w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors duration-200"
                    >
                    Visualize Metrics
                </button>
            </>
        );
      }
      case NodeType.Deploy: {
        const data = selectedNode.data as DeployNodeData;
        return (
          <>
            <label className="block text-sm font-medium text-gray-300">Target Environment</label>
            <select name="targetEnv" value={data.targetEnv} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500">
              <option>Staging</option>
              <option>Production</option>
            </select>
            <label className="block text-sm font-medium text-gray-300 mt-4">Model Name</label>
            <input type="text" name="modelName" value={data.modelName} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </>
        );
      }
      case NodeType.HyperparameterTuning: {
        const data = selectedNode.data as HyperparameterTuningNodeData;
        return (
          <>
            <label className="block text-sm font-medium text-gray-300">Tuning Strategy</label>
            <select name="strategy" value={data.strategy} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500">
              <option>GridSearch</option>
              <option>RandomSearch</option>
            </select>
            <label className="block text-sm font-medium text-gray-300 mt-4">Parameter Grid</label>
             <p className="text-xs text-gray-400 mb-1">Enter a JSON object of parameters to search.</p>
            <textarea
                name="paramGrid"
                value={data.paramGrid}
                onChange={handleInputChange}
                rows={8}
                className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm p-2"
                placeholder='{\n  "n_estimators": [100, 200],\n  "max_depth": [10, 20, null]\n}'
            />
          </>
        );
      }
      case NodeType.ExportModel: {
        const data = selectedNode.data as ExportModelNodeData;
        return (
          <>
            <label className="block text-sm font-medium text-gray-300">File Path</label>
            <p className="text-xs text-gray-400 mb-1">Path to save the model artifact (e.g., .pkl).</p>
            <input 
              type="text" 
              name="filePath" 
              value={data.filePath} 
              onChange={handleInputChange} 
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" 
              placeholder="e.g., models/my_model.pkl"
            />
          </>
        );
      }
      default:
        return <p className="text-gray-400">No configurable properties for this node type.</p>;
    }
  };

  return (
    <aside className="w-80 bg-gray-900 p-6 border-l border-gray-700/50 flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-cyan-400 truncate">Properties: {selectedNode.data.label}</h3>
        <div className="flex border-b border-gray-700 mb-4">
            <button
                onClick={() => setActiveTab('properties')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'properties' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
                Config
            </button>
            <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'code' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
                Code
            </button>
        </div>

      <div className="flex-grow overflow-y-auto pr-2">
        {activeTab === 'properties' ? (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Node Label</label>
                    <input
                        type="text"
                        name="label"
                        value={selectedNode.data.label}
                        onChange={handleInputChange}
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
                <hr className="border-gray-700" />
                {renderNodeProperties()}
            </div>
        ) : (
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Python Code</label>
                <textarea
                    name="pythonCode"
                    value={selectedNode.data.pythonCode || ''}
                    onChange={handleCodeChange}
                    className="block w-full h-96 bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm p-2"
                    placeholder="Enter Python code for this step..."
                />
            </div>
        )}
      </div>
    </aside>
  );
};

export default PropertiesPanel;