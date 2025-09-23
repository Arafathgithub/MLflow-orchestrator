import React from 'react';
import { NodeType, NodeData } from './types';
// FIX: Import Edge type from reactflow to explicitly type INITIAL_EDGES. This resolves type inference issues that caused errors in App.tsx.
import { Node, Edge } from 'reactflow';

export const ICONS: Record<string, React.ReactNode> = {
  [NodeType.DataSource]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4" /></svg>,
  [NodeType.SplitData]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  [NodeType.TrainRegression]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  [NodeType.TrainClassifier]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  [NodeType.TrainForecaster]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  [NodeType.Evaluate]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  [NodeType.Deploy]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  [NodeType.HyperparameterTuning]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  [NodeType.FeatureEngineering]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6M8 8h8M16 16h6" /></svg>,
  [NodeType.ExportModel]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  [NodeType.PythonScript]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
};

export const SIDEBAR_NODE_TYPES = {
  INPUT: 'Input',
  TRANSFORM: 'Transform',
  MODELING: 'Modeling',
  EVALUATION: 'Evaluation & Deployment',
};

export const SIDEBAR_NODES: { category: string; label: string; type: NodeType; data: NodeData }[] = [
  {
    category: SIDEBAR_NODE_TYPES.INPUT,
    label: 'Data Source',
    type: NodeType.DataSource,
    data: { label: 'Data Source', sourcePath: '/path/to/data.csv', pythonCode: `import pandas as pd

# Option 1: Load from a local file path
df = pd.read_csv("path/to/your/data.csv")

# Option 2: Load from a URL (e.g., a raw CSV on GitHub)
# url = "https://example.com/data.csv"
# df = pd.read_csv(url)

# For APIs or files requiring special handling, you might use requests
# import requests
# import io
# response = requests.get(url)
# response.raise_for_status() # Ensure the request was successful
# df = pd.read_csv(io.StringIO(response.text))

# This dataframe will be available to the next step` },
  },
  {
    category: SIDEBAR_NODE_TYPES.TRANSFORM,
    label: 'Split Data',
    type: NodeType.SplitData,
    data: { label: 'Split Data', testSize: 0.2, randomState: 42, pythonCode: 'from sklearn.model_selection import train_test_split\n\n# Assuming df is the input dataframe\ntrain_df, test_df = train_test_split(df, test_size=0.2, random_state=42)' },
  },
  {
    category: SIDEBAR_NODE_TYPES.TRANSFORM,
    label: 'Feature Engineering',
    type: NodeType.FeatureEngineering,
    data: {
      label: 'Feature Engineering',
      technique: 'Standardization',
      columns: 'age, income',
      degree: 2,
      pythonCode: `from sklearn.preprocessing import StandardScaler

# Assuming df is the input dataframe
scaler = StandardScaler()
cols_to_scale = ['age', 'income']
df[cols_to_scale] = scaler.fit_transform(df[cols_to_scale])`
    },
  },
  {
    category: SIDEBAR_NODE_TYPES.TRANSFORM,
    label: 'Python Script',
    type: NodeType.PythonScript,
    data: {
      label: 'Python Script',
      pythonCode: `# Write your custom Python code here.
# The input dataframe from the previous node is available as \`df\`.
# The output must be a pandas DataFrame assigned to a \`result_df\` variable.

# Example: Add a new column based on existing data
def custom_logic(row):
    # Add your complex logic here
    return row['column1'] * 2 + row['column2']

df['new_feature'] = df.apply(custom_logic, axis=1)

result_df = df

print("Custom Python script executed successfully.")`
    },
  },
  {
    category: SIDEBAR_NODE_TYPES.MODELING,
    label: 'Train Regression',
    type: NodeType.TrainRegression,
    data: { label: 'Train Regression', algorithm: 'LinearRegression', alpha: 1.0, pythonCode: 'from sklearn.linear_model import LinearRegression\n\n# Assuming train_df is the input dataframe\nmodel = LinearRegression()\nX_train = train_df.drop("target", axis=1)\ny_train = train_df["target"]\nmodel.fit(X_train, y_train)' },
  },
  {
    category: SIDEBAR_NODE_TYPES.MODELING,
    label: 'Train Classifier',
    type: NodeType.TrainClassifier,
    data: { label: 'Train Classifier', algorithm: 'RandomForestClassifier', maxDepth: 10, nEstimators: 100, pythonCode: 'from sklearn.ensemble import RandomForestClassifier\n\n# Assuming train_df is the input dataframe\nmodel = RandomForestClassifier(n_estimators=100, max_depth=10)\nX_train = train_df.drop("target", axis=1)\ny_train = train_df["target"]\nmodel.fit(X_train, y_train)' },
  },
  {
    category: SIDEBAR_NODE_TYPES.MODELING,
    label: 'Train Forecaster',
    type: NodeType.TrainForecaster,
    data: { label: 'Train Forecaster', algorithm: 'ARIMA', seasonalPeriod: 12, pythonCode: 'from statsmodels.tsa.arima.model import ARIMA\n\n# Assuming train_df is the input timeseries dataframe\nmodel = ARIMA(train_df, order=(5,1,0))\nmodel_fit = model.fit()' },
  },
  {
    category: SIDEBAR_NODE_TYPES.MODELING,
    label: 'Hyperparameter Tuning',
    type: NodeType.HyperparameterTuning,
    data: { 
        label: 'Tune Model', 
        strategy: 'GridSearch', 
        paramGrid: '{\n  "n_estimators": [100, 200],\n  "max_depth": [10, 20, null]\n}',
        pythonCode: 'from sklearn.model_selection import GridSearchCV\nimport json\n\n# Assuming model from previous step and X_train, y_train are available\nparam_grid = json.loads("""\n{\n  "n_estimators": [100, 200],\n  "max_depth": [10, 20, null]\n}\n""")\n\ngrid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=3, n_jobs=-1, verbose=2)\ngrid_search.fit(X_train, y_train)\n\n# The best model is available as grid_search.best_estimator_\nmodel = grid_search.best_estimator_'
    },
  },
  {
    category: SIDEBAR_NODE_TYPES.EVALUATION,
    label: 'Evaluate Model',
    type: NodeType.Evaluate,
    data: { label: 'Evaluate Model', metrics: ['MAE', 'MSE'], pythonCode: 'from sklearn.metrics import accuracy_score\n\n# Assuming model is trained and test_df is available\nX_test = test_df.drop("target", axis=1)\ny_test = test_df["target"]\npredictions = model.predict(X_test)\naccuracy = accuracy_score(y_test, predictions)\nprint(f"Accuracy: {accuracy}")' },
  },
  {
    category: SIDEBAR_NODE_TYPES.EVALUATION,
    label: 'Deploy Model',
    type: NodeType.Deploy,
    data: { 
      label: 'Deploy Model', 
      targetEnv: 'Staging', 
      modelName: 'my-model', 
      pythonCode: `import mlflow
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
    print("Logging model:", "my-model")
    mlflow.sklearn.log_model(model, artifact_path="my-model")

    # Register the model in the MLflow Model Registry
    model_uri = f"runs:/{run.info.run_id}/my-model"
    print(f"Registering model from {model_uri} as 'my-model'")
    registered_model = mlflow.register_model(
        model_uri=model_uri,
        name="my-model"
    )

    # Transition the model version to the specified stage (Staging or Production)
    client = MlflowClient()
    print(f"Transitioning model version {registered_model.version} to 'Staging'")
    client.transition_model_version_stage(
        name="my-model",
        version=registered_model.version,
        stage="Staging"
    )

print("Deployment complete.")`
    },
  },
  {
    category: SIDEBAR_NODE_TYPES.EVALUATION,
    label: 'Export Model',
    type: NodeType.ExportModel,
    data: { 
      label: 'Export Model', 
      filePath: 'models/model.pkl', 
      pythonCode: `import joblib
import os

# Assuming 'model' is the trained model object from a previous step.
# Define the directory and ensure it exists.
output_dir = os.path.dirname('models/model.pkl')
if output_dir:
    os.makedirs(output_dir, exist_ok=True)

# Save the model using joblib
joblib.dump(model, 'models/model.pkl')

print(f"Model successfully saved to: {'models/model.pkl'}")`
    },
  },
];

export const INITIAL_NODES: Node<NodeData>[] = [
  {
    id: '1',
    type: NodeType.DataSource,
    position: { x: 100, y: 150 },
    data: { label: 'Customer Churn Data', sourcePath: 's3://data/churn.csv', pythonCode: 'import pandas as pd\ndf = pd.read_csv("s3://data/churn.csv")' },
  },
  {
    id: '2',
    type: NodeType.SplitData,
    position: { x: 400, y: 150 },
    data: { label: 'Split Train/Test', testSize: 0.25, randomState: 42, pythonCode: 'from sklearn.model_selection import train_test_split\ntrain_df, test_df = train_test_split(df, test_size=0.25, random_state=42)' },
  },
  {
    id: '3',
    type: NodeType.TrainClassifier,
    position: { x: 700, y: 50 },
    data: { label: 'Train RF Classifier', algorithm: 'RandomForestClassifier', nEstimators: 150, maxDepth: 8, pythonCode: 'from sklearn.ensemble import RandomForestClassifier\nmodel = RandomForestClassifier(n_estimators=150, max_depth=8)\nmodel.fit(X_train, y_train)' },
  },
  {
    id: '4',
    type: NodeType.Evaluate,
    position: { x: 1000, y: 150 },
    data: { label: 'Evaluate Classifier', metrics: ['Accuracy', 'F1-Score', 'ROC AUC'], pythonCode: 'from sklearn.metrics import accuracy_score, f1_score\n\npredictions = model.predict(X_test)\naccuracy = accuracy_score(y_test, predictions)\nf1 = f1_score(y_test, predictions)\n\nprint({"accuracy": accuracy, "f1_score": f1})' },
  },
];

// FIX: Explicitly type INITIAL_EDGES as Edge[] to prevent overly specific type inference which causes type conflicts in App.tsx.
export const INITIAL_EDGES: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', sourceHandle: 'train', animated: true },
  { id: 'e2-4', source: '2', target: '4', sourceHandle: 'test', targetHandle: 'data', style: { strokeDasharray: '5 5' } },
  { id: 'e3-4', source: '3', target: '4', targetHandle: 'model', animated: true },
];

export const CHAT_SYSTEM_INSTRUCTION = `You are an AI assistant integrated into a visual ML workflow builder. Your purpose is to help users create, modify, and run their ML pipelines through conversation.

Available node types are: ${Object.values(NodeType).join(', ')}.

When the user asks to perform an action, you MUST respond with a valid JSON object that contains two properties: "actions" and "response".
- "actions" is an array of command objects to be executed by the application.
- "response" is a conversational, natural language string to show to the user, explaining what you've done.

The following actions are supported:

1.  **add_node**: Adds a new node to the canvas.
    - \`node_type\`: (string) The type of the node. Must be one of the available node types.
    - \`label\`: (string) A descriptive label for the new node.

2.  **connect_nodes**: Connects two nodes.
    - \`source_label\`: (string) The label of the source node.
    - \`target_label\`: (string) The label of the target node.
    - \`source_handle\`: (string, optional) The handle on the source node (e.g., 'train', 'test').
    - \`target_handle\`: (string, optional) The handle on the target node (e.g., 'model', 'data').

3.  **update_node_config**: Modifies the properties of a node.
    - \`node_label\`: (string) The label of the node to update.
    - \`config\`: (string) A JSON string representing an object with the properties to change (e.g., '{"testSize": 0.3}').

4.  **delete_node**: Removes a node from the canvas.
    - \`node_label\`: (string) The label of the node to delete.

5.  **run_workflow**: Executes the entire workflow.

If the user's request is ambiguous, ask for clarification. If you cannot fulfill a request, explain why in the "response" field and provide an empty "actions" array. Be concise and helpful.

Example user request: "Add a data source from my S3 bucket and then split it."

Example AI response:
\`\`\`json
{
  "actions": [
    {
      "action": "add_node",
      "node_type": "dataSource",
      "label": "S3 Data Source"
    },
    {
      "action": "add_node",
      "node_type": "splitData",
      "label": "Split Data"
    },
    {
      "action": "connect_nodes",
      "source_label": "S3 Data Source",
      "target_label": "Split Data"
    }
  ],
  "response": "I've added a Data Source node and a Split Data node, and connected them for you."
}
\`\`\`
`;