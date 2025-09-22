# MLflow Orchestrator

A low-code/no-code drag-and-drop application to create, visualize, and edit machine learning workflows for regression, classification, and time series forecasting, following the MLflow orchestration standard.

This tool provides an intuitive, visual interface to build complex ML pipelines, from data ingestion to model deployment, while automatically generating the underlying Python code.

## ✨ Features

- **Visual Workflow Builder**: Intuitive drag-and-drop interface to build complex ML pipelines.
- **Comprehensive Node Library**: Includes nodes for data sourcing, transformation, modeling, evaluation, and deployment.
- **Feature Engineering**: Apply techniques like Standardization, One-Hot Encoding, and Interaction Terms.
- **Hyperparameter Tuning**: Optimize models using Grid Search or Random Search.
- **Live Code Generation**: Instantly view the corresponding Python/MLflow code for each node.
- **Interactive Properties Panel**: Select any node to configure its parameters and behavior.
- **Metric Visualization**: Visualize evaluation metrics like Accuracy, F1-Score, and ROC AUC using interactive charts.
- **Undo/Redo**: Easily correct mistakes and iterate on your workflow design.
- **Export/Import**: Save and load your pipelines in a clean JSON format.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) (v16 or later) and a package manager like [npm](https://www.npmjs.com/) installed on your system.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-repo/mlflow-orchestrator.git
    cd mlflow-orchestrator
    ```

2.  **Install dependencies:**
    This project uses a modern setup with import maps, so a traditional `npm install` for all dependencies may not be necessary if you are running it in a compatible environment. However, for local development with a dev server, you would typically install dependencies.
    ```sh
    npm install
    ```

### Running the Application

Once the dependencies are installed, you can start the development server.

```sh
npm run dev
```

This will start the application and open it in your default web browser, typically at `http://localhost:5173`.

## 🔧 How to Use

1.  **Add Nodes**: Drag nodes from the sidebar on the left onto the canvas.
2.  **Connect Nodes**: Click and drag from the handle (circle) on one node to the handle on another to create a connection.
3.  **Configure Nodes**: Click on a node to select it. The properties panel on the right will show its configuration options.
4.  **View Code**: In the properties panel, switch to the "Code" tab to see the generated Python code for the selected node.
5.  **Visualize**: For the "Evaluate Model" node, click "Visualize Metrics" to see charts of the model's performance.
6.  **Delete a Node**: Hover over or select a node and click the trash can icon that appears in the top-right corner.
7.  **Export**: Click the "Export Workflow" button in the header to download the entire pipeline as a JSON file.
