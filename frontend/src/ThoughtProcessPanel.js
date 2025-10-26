import React, { useState, useEffect } from 'react';

const ThoughtProcessPanel = ({ contextId, thoughtProcess, onClose }) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = React.useRef(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thoughtProcess, autoScroll]);

  const getThoughtIcon = (type) => {
    switch (type) {
      case 'reasoning': return '🤔';
      case 'decision': return '⚡';
      case 'agent_call': return '🤖';
      case 'fallback': return '🧠';
      case 'result': return '✨';
      default: return '💭';
    }
  };

  const getThoughtColor = (type) => {
    switch (type) {
      case 'reasoning': return 'text-blue-400';
      case 'decision': return 'text-yellow-400';
      case 'agent_call': return 'text-green-400';
      case 'fallback': return 'text-purple-400';
      case 'result': return 'text-cyan-400';
      default: return 'text-green-500';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-6">
      <div className="bg-black border-2 border-green-500 w-full max-w-5xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-green-500/30 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-green-500">
              🧠 AI THOUGHT PROCESS VISUALIZATION
            </h2>
            <div className="text-xs text-green-400 mt-1">
              Context ID: {contextId} | Real-time AI reasoning and decision making
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-green-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="form-checkbox bg-black border-green-500"
              />
              Auto-scroll
            </label>
            <button
              onClick={onClose}
              className="text-green-500 hover:text-red-500 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Thought Process Timeline */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 font-mono"
        >
          {thoughtProcess && thoughtProcess.length > 0 ? (
            <div className="space-y-4">
              {thoughtProcess.map((thought, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 border-l-2 border-green-500/30 pl-4 py-2 hover:border-green-500/70 transition-all"
                >
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0">
                    {getThoughtIcon(thought.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold uppercase ${getThoughtColor(thought.type)}`}>
                        {thought.type}
                      </span>
                      <span className="text-xs text-green-500/50">
                        {formatTimestamp(thought.timestamp)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-green-400">
                      {thought.content}
                    </div>

                    {/* Metadata */}
                    {thought.metadata && Object.keys(thought.metadata).length > 0 && (
                      <div className="mt-2 p-2 bg-green-500/5 border border-green-500/20 text-xs">
                        <div className="text-green-500/70 mb-1">Additional Info:</div>
                        {Object.entries(thought.metadata).map(([key, value]) => (
                          <div key={key} className="text-green-400/80">
                            <span className="text-green-500">{key}:</span> {typeof value === 'string' ? value : JSON.stringify(value).substring(0, 100)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-green-500/50">
                <div className="text-4xl mb-4">🧠</div>
                <div>No thought process data yet</div>
                <div className="text-xs mt-2">Execute a command to see AI reasoning</div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-green-500/30 bg-black/50">
          <div className="text-xs text-green-400 mb-2">Legend:</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span>🤔</span>
              <span className="text-blue-400">Reasoning</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span className="text-yellow-400">Decision</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🤖</span>
              <span className="text-green-400">Agent Call</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🧠</span>
              <span className="text-purple-400">Gemini Fallback</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✨</span>
              <span className="text-cyan-400">Result</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-green-500/30 bg-black flex justify-between items-center text-xs">
          <div className="text-green-400">
            Total Thoughts: {thoughtProcess ? thoughtProcess.length : 0}
          </div>
          <div className="text-green-500">
            <span className="animate-pulse">● LIVE</span> Tracking AI decisions in real-time
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThoughtProcessPanel;
