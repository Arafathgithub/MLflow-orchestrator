



import React from 'react';

interface HeaderProps {
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onLaunchMlflow: () => void;
  onToggleSidebar: () => void;
  onToggleProperties: () => void;
  isSidebarVisible: boolean;
  isPropertiesPanelVisible: boolean;
  onRunWorkflow: () => void;
  isExecuting: boolean;
  onToggleChat: () => void;
  isChatPanelVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
    onExport, onUndo, onRedo, canUndo, canRedo, onLaunchMlflow,
    onToggleSidebar, onToggleProperties, isSidebarVisible, isPropertiesPanelVisible,
    onRunWorkflow, isExecuting, onToggleChat, isChatPanelVisible
 }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 p-3 flex justify-between items-center z-20">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-md transition-colors ${isSidebarVisible ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
          title={isSidebarVisible ? "Hide Nodes Panel" : "Show Nodes Panel"}
          aria-label={isSidebarVisible ? "Hide Nodes Panel" : "Show Nodes Panel"}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        </button>
        <div className="w-px h-6 bg-gray-700"></div>
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0122 12c0 3-1 7-6.343 6.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
        <h1 className="text-xl font-bold text-white">MLflow Orchestrator</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
            onClick={onToggleChat}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${isChatPanelVisible ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            title={isChatPanelVisible ? "Hide Chat" : "Show Chat"}
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.839 8.839 0 01-4.083-.98L2 17l1.083-3.083A7.002 7.002 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.75 9.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" />
            </svg>
            <span>AI Chat</span>
        </button>
        <div className="w-px h-6 bg-gray-700"></div>

        <div className="flex rounded-md shadow-sm" role="group">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo last action"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-l-lg border border-gray-600 hover:bg-gray-600 focus:z-10 focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo last action"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-r-lg border-t border-b border-r border-gray-600 hover:bg-gray-600 focus:z-10 focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Redo
          </button>
        </div>
        <div className="flex items-center space-x-2">
            <button
                onClick={onLaunchMlflow}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-colors duration-200"
                title="Open MLflow UI in a new tab"
            >
                <span>MLflow UI</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </button>
            <button
            onClick={onExport}
            className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors duration-200"
            >
            Export Workflow
            </button>
             <button
                onClick={onRunWorkflow}
                disabled={isExecuting}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                title="Run the entire workflow"
            >
                {isExecuting ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                )}
                <span>{isExecuting ? 'Running...' : 'Run Workflow'}</span>
            </button>
        </div>
        <div className="w-px h-6 bg-gray-700"></div>
        <button
            onClick={onToggleProperties}
            className={`p-2 rounded-md transition-colors ${isPropertiesPanelVisible ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            title={isPropertiesPanelVisible ? "Hide Properties Panel" : "Show Properties Panel"}
            aria-label={isPropertiesPanelVisible ? "Hide Properties Panel" : "Show Properties Panel"}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.982.502 2.213-.082 3.145a1.532 1.532 0 01-1.296 1.296c-1.56.38-1.56 2.6 0 2.98.533.134 1.05.51 1.296 1.296.584.932.622 2.163.082 3.145-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.286.948c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.372.836 2.942-.734-2.106-2.106a1.532 1.532 0 01.082-3.145 1.532 1.532 0 011.296-1.296c1.56-.38 1.56-2.6 0-2.98a1.532 1.532 0 01-1.296-1.296 1.532 1.532 0 01-.082-3.145c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.286-.948zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;