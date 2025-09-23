
import { NodeType, NodeData } from './types';
// FIX: Import Edge type from reactflow to explicitly type INITIAL_EDGES. This resolves type inference issues that caused errors in App.tsx.
import { Node, Edge } from 'reactflow';

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
    data: { label: 'Data Source', sourcePath: '/path/to/data.csv', pythonCode: 'import pandas as pd\ndf = pd.read_csv("path/to/your/data.csv")\n# This dataframe will be available to the next step' },
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
