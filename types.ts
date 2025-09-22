
export enum NodeType {
  DataSource = 'dataSource',
  SplitData = 'splitData',
  TrainRegression = 'trainRegression',
  TrainClassifier = 'trainClassifier',
  TrainForecaster = 'trainForecaster',
  Evaluate = 'evaluate',
  Deploy = 'deploy',
  HyperparameterTuning = 'hyperparameterTuning',
  FeatureEngineering = 'featureEngineering',
}

export interface BaseNodeData {
  label: string;
  pythonCode: string;
}

export interface DataSourceNodeData extends BaseNodeData {
  sourcePath: string;
}

export interface SplitDataNodeData extends BaseNodeData {
  testSize: number;
  randomState: number;
}

export interface TrainRegressionNodeData extends BaseNodeData {
  algorithm: 'LinearRegression' | 'Ridge' | 'Lasso';
  alpha: number;
}

export interface TrainClassifierNodeData extends BaseNodeData {
  algorithm: 'LogisticRegression' | 'RandomForestClassifier' | 'SVC';
  maxDepth: number;
  nEstimators: number;
}

export interface TrainForecasterNodeData extends BaseNodeData {
  algorithm: 'ARIMA' | 'Prophet';
  seasonalPeriod: number;
}

export interface EvaluateNodeData extends BaseNodeData {
  metrics: string[];
}

export interface DeployNodeData extends BaseNodeData {
  targetEnv: 'Staging' | 'Production';
  modelName: string;
}

export interface HyperparameterTuningNodeData extends BaseNodeData {
  strategy: 'GridSearch' | 'RandomSearch';
  paramGrid: string; // JSON string for parameter grid
}

export interface FeatureEngineeringNodeData extends BaseNodeData {
  technique: 'Standardization' | 'OneHotEncoding' | 'InteractionTerms';
  columns: string;
  degree?: number;
}

export type NodeData =
  | DataSourceNodeData
  | SplitDataNodeData
  | TrainRegressionNodeData
  | TrainClassifierNodeData
  | TrainForecasterNodeData
  | EvaluateNodeData
  | DeployNodeData
  | HyperparameterTuningNodeData
  | FeatureEngineeringNodeData;