
import React from 'react';
import { SIDEBAR_NODES, SIDEBAR_NODE_TYPES } from '../constants';
import { NodeType } from '../types';

const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const SidebarNode: React.FC<{ label: string; type: NodeType }> = ({ label, type }) => (
    <div
      className="p-3 border-2 border-gray-600 rounded-md bg-gray-700 hover:bg-gray-600 hover:border-cyan-500 cursor-grab transition-colors duration-200 text-center"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      {label}
    </div>
);

const Sidebar: React.FC = () => {
  const categories = Object.values(SIDEBAR_NODE_TYPES);
  return (
    <aside className="w-64 bg-gray-900 p-4 border-r border-gray-700/50 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-300">Workflow Nodes</h2>
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
             <h3 className="text-cyan-400 font-bold mb-3 border-b-2 border-cyan-400/20 pb-1">{category}</h3>
             <div className="grid grid-cols-1 gap-3">
              {SIDEBAR_NODES.filter(node => node.category === category).map((node) => (
                <SidebarNode key={node.type} label={node.label} type={node.type} />
              ))}
             </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
