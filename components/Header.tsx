
import React from 'react';

interface HeaderProps {
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Header: React.FC<HeaderProps> = ({ onExport, onUndo, onRedo, canUndo, canRedo }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 p-3 flex justify-between items-center z-20">
      <div className="flex items-center space-x-3">
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0122 12c0 3-1 7-6.343 6.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
        <h1 className="text-xl font-bold text-white">MLflow Orchestrator</h1>
      </div>
      <div className="flex items-center space-x-2">
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
        <button
          onClick={onExport}
          className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          Export Workflow
        </button>
      </div>
    </header>
  );
};

export default Header;
