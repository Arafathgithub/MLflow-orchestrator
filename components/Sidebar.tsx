

import React, { useState, useMemo } from 'react';
import { SIDEBAR_NODES, SIDEBAR_NODE_TYPES, ICONS } from '../constants';
import { NodeType } from '../types';

const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

interface SidebarNodeProps {
  label: string;
  type: NodeType;
  onDoubleClick: (nodeType: NodeType) => void;
}

const SidebarNode: React.FC<SidebarNodeProps> = ({ label, type, onDoubleClick }) => (
    <div
      className="p-3 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700/50 hover:border-cyan-500 cursor-grab transition-all duration-300 text-gray-300 hover:text-white transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-900/50 flex items-center space-x-3"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
      onDoubleClick={() => onDoubleClick(type)}
    >
      <div className="text-cyan-400 w-6 h-6 flex-shrink-0">{ICONS[type]}</div>
      <span>{label}</span>
    </div>
);

interface SidebarProps {
  onNodeDoubleClick: (nodeType: NodeType) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ onNodeDoubleClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const categories = Object.values(SIDEBAR_NODE_TYPES);
  
  const filteredNodes = useMemo(() => {
    if (!searchTerm) {
      return SIDEBAR_NODES;
    }
    return SIDEBAR_NODES.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <aside className="w-64 bg-gray-900/95 backdrop-blur-sm p-4 border-r border-gray-700/50 overflow-y-auto flex flex-col">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white tracking-wider">Workflow Nodes</h2>
        <div className="w-16 h-0.5 bg-cyan-400/50 mx-auto mt-2 rounded-full"></div>
      </div>
       <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <div className="space-y-6 flex-grow overflow-y-auto pr-1">
        {categories.map(category => {
          const nodesForCategory = filteredNodes.filter(node => node.category === category);
          if (nodesForCategory.length === 0) {
            return null;
          }
          return (
            <div key={category}>
              <h3 className="text-cyan-400 font-bold mb-3 border-b-2 border-cyan-400/20 pb-1">{category}</h3>
              <div className="grid grid-cols-1 gap-3">
                {nodesForCategory.map((node) => (
                  <SidebarNode key={node.type} label={node.label} type={node.type} onDoubleClick={onNodeDoubleClick} />
                ))}
              </div>
            </div>
          );
        })}
         {filteredNodes.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p>No nodes found matching "{searchTerm}".</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;