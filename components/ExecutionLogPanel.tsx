import React, { useEffect, useRef } from 'react';

interface LogEntry {
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'error';
}

interface ExecutionLogPanelProps {
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

const LOG_LEVEL_STYLES = {
  info: 'text-gray-400',
  success: 'text-green-400',
  error: 'text-red-400',
};

const ExecutionLogPanel: React.FC<ExecutionLogPanelProps> = ({ logs, isOpen, onClose }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the bottom when new logs are added
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700/50 z-30 flex flex-col shadow-2xl animate-slide-up">
      <header className="flex justify-between items-center p-2 border-b border-gray-700/50 flex-shrink-0">
        <h3 className="text-md font-bold text-white ml-2">Execution Log</h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-700" aria-label="Close log panel">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </header>
      <main ref={logContainerRef} className="p-4 flex-grow overflow-y-auto font-mono text-sm">
        {logs.map((log, index) => (
          <div key={index} className="flex items-start">
            <span className="text-gray-500 mr-4">{log.timestamp}</span>
            <p className={`${LOG_LEVEL_STYLES[log.level]} flex-1`}>
              {log.message}
            </p>
          </div>
        ))}
      </main>
       <style>{`
        @keyframes slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
            animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExecutionLogPanel;
