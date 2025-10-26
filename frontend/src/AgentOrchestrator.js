import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import ThoughtProcessPanel from './ThoughtProcessPanel';

const AgentOrchestrator = ({ onBack }) => {
  const [command, setCommand] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [executionContext, setExecutionContext] = useState(null);
  const [marketplaceStats, setMarketplaceStats] = useState(null);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [showAgentList, setShowAgentList] = useState(false);
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);
  const [socket, setSocket] = useState(null);

  // Example commands
  const exampleCommands = [
    "Book an Uber if the tennis court is dry",
    "Check my wallet balance and the weather",
    "Analyze the CCTV feed and book a ride if it's safe",
    "Check if the tennis court is dry and verify I have funds"
  ];

  useEffect(() => {
    fetchMarketplaceStats();
    fetchAvailableAgents();

    // Initialize WebSocket connection
    const newSocket = io('http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Connected to Trinetra Agent');
    });

    newSocket.on('agent_update', (data) => {
      console.log('Agent update:', data);
      if (data.type === 'completion') {
        toast.success('Agent execution completed!', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const fetchMarketplaceStats = async () => {
    try {
      const response = await fetch('/api/agent/marketplace_stats');
      const data = await response.json();
      if (data.success) {
        setMarketplaceStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
    }
  };

  const fetchAvailableAgents = async () => {
    try {
      const response = await fetch('/api/agent/list_agents');
      const data = await response.json();
      if (data.success) {
        setAvailableAgents(data.agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const processCommand = async () => {
    if (!command.trim()) {
      toast.error('Please enter a command', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setProcessing(true);
    setResult(null);
    setExecutionContext(null);

    try {
      const response = await fetch('/api/agent/process_command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: command })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
        setExecutionContext(data.execution_summary);
        
        toast.success('Command executed successfully!', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        toast.error(data.error || 'Execution failed', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        setResult(data.error);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      toast.error('Failed to process command', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setProcessing(false);
    }
  };

  const setExampleCommand = (cmd) => {
    setCommand(cmd);
  };

  return (
    <div className="h-screen bg-black text-green-500 font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-green-500/30 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-wider">
              🤖 TRINETRA AGENT ORCHESTRATOR
            </h1>
            <div className="text-sm text-green-400 mt-1">
              AI-Powered Multi-Agent System | Fitch Marketplace Integration
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-green-500 hover:text-green-400 border border-green-500 px-4 py-2 transition-all hover:bg-green-500/10"
          >
            [BACK TO TERMINAL]
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Command Input Section */}
          <div className="border border-green-500/30 p-6 bg-black/50">
            <div className="text-green-400 font-bold mb-4">▣ AGENT COMMAND CENTER</div>
            
            <div className="mb-4">
              <label className="text-sm text-green-400 mb-2 block">Enter High-Level Command:</label>
              <textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="e.g., Book an Uber if the tennis court is dry"
                className="w-full bg-black border border-green-500/50 text-green-500 p-3 font-mono text-sm focus:border-green-500 focus:outline-none resize-none"
                rows="3"
                disabled={processing}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={processCommand}
                disabled={processing}
                className={`px-6 py-3 border ${
                  processing 
                    ? 'border-yellow-500 text-yellow-500' 
                    : 'border-green-500 text-green-500 hover:bg-green-500/10'
                } font-bold transition-all disabled:opacity-50`}
              >
                {processing ? '[PROCESSING...]' : '[EXECUTE COMMAND]'}
              </button>

              <button
                onClick={() => setShowAgentList(!showAgentList)}
                className="px-4 py-3 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-all"
              >
                [VIEW AGENTS]
              </button>

              <button
                onClick={() => setShowThoughtProcess(!showThoughtProcess)}
                disabled={!executionContext}
                className="px-4 py-3 border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                🧠 [FETCH AI THOUGHTS]
              </button>
            </div>

            {/* Example Commands */}
            <div className="mt-4 pt-4 border-t border-green-500/20">
              <div className="text-xs text-green-400 mb-2">Example Commands:</div>
              <div className="flex flex-wrap gap-2">
                {exampleCommands.map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => setExampleCommand(cmd)}
                    className="text-xs px-3 py-1 border border-green-500/30 text-green-500/70 hover:text-green-500 hover:border-green-500/50 transition-all"
                    disabled={processing}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Processing Status */}
          {processing && (
            <div className="border border-yellow-500/50 p-6 bg-yellow-500/5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="text-yellow-500 text-2xl">⚙️</div>
                <div>
                  <div className="text-yellow-500 font-bold">PROCESSING YOUR COMMAND...</div>
                  <div className="text-xs text-yellow-400 mt-1">
                    Discovering agents → Executing tasks → Synthesizing results
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Execution Context */}
          {executionContext && (
            <div className="border border-green-500/30 p-6 bg-black/50">
              <div className="text-green-400 font-bold mb-4">▣ EXECUTION SUMMARY</div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {executionContext.status === 'completed' ? '✅' : '⚙️'}
                  </div>
                  <div className="text-xs text-green-400 mt-1">Status</div>
                  <div className="text-xs text-green-500 uppercase">{executionContext.status}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {executionContext.current_step}
                  </div>
                  <div className="text-xs text-green-400 mt-1">Steps</div>
                  <div className="text-xs text-green-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {executionContext.tasks?.length || 0}
                  </div>
                  <div className="text-xs text-green-400 mt-1">Tasks</div>
                  <div className="text-xs text-green-500">Executed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {executionContext.elapsed_time?.toFixed(1)}s
                  </div>
                  <div className="text-xs text-green-400 mt-1">Time</div>
                  <div className="text-xs text-green-500">Elapsed</div>
                </div>
              </div>

              {/* Task Breakdown */}
              {executionContext.tasks && executionContext.tasks.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-green-400 mb-2">Task Execution Flow:</div>
                  {executionContext.tasks.map((task, index) => (
                    <div 
                      key={task.task_id}
                      className="border border-green-500/20 p-3 bg-black/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`text-lg ${
                            task.status === 'completed' ? 'text-green-500' :
                            task.status === 'running' ? 'text-yellow-500' :
                            task.status === 'failed' ? 'text-red-500' :
                            task.status === 'skipped' ? 'text-gray-500' :
                            'text-green-400'
                          }`}>
                            {task.status === 'completed' ? '✅' :
                             task.status === 'running' ? '⚙️' :
                             task.status === 'failed' ? '❌' :
                             task.status === 'skipped' ? '⊘' :
                             '⏸️'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-green-500">
                              {task.task_id}: {task.task_type}
                            </div>
                            <div className="text-xs text-green-400">
                              {task.description}
                            </div>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 border uppercase ${
                          task.status === 'completed' ? 'border-green-500 text-green-500' :
                          task.status === 'running' ? 'border-yellow-500 text-yellow-500' :
                          task.status === 'failed' ? 'border-red-500 text-red-500' :
                          'border-gray-500 text-gray-500'
                        }`}>
                          {task.status}
                        </div>
                      </div>
                      
                      {task.result && task.result.result && (
                        <div className="mt-2 pl-8 text-xs text-green-400/70 border-l-2 border-green-500/30 ml-2">
                          {JSON.stringify(task.result.result, null, 2).substring(0, 200)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="border border-green-500 p-6 bg-green-500/5">
              <div className="text-green-400 font-bold mb-4">▣ FINAL RESULT</div>
              <div className="text-green-500 whitespace-pre-wrap font-mono">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </div>
            </div>
          )}

          {/* Marketplace Stats */}
          {marketplaceStats && (
            <div className="border border-green-500/30 p-6 bg-black/50">
              <div className="text-green-400 font-bold mb-4">▣ FITCH MARKETPLACE STATS</div>
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {marketplaceStats.total_agents}
                  </div>
                  <div className="text-xs text-green-400 mt-1">Total Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {marketplaceStats.categories?.cctv_analysis || 0}
                  </div>
                  <div className="text-xs text-green-400 mt-1">Vision</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {marketplaceStats.categories?.wallet_balance || 0}
                  </div>
                  <div className="text-xs text-green-400 mt-1">Wallet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {marketplaceStats.categories?.ride_booking || 0}
                  </div>
                  <div className="text-xs text-green-400 mt-1">Ride</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {marketplaceStats.average_rating?.toFixed(1)}★
                  </div>
                  <div className="text-xs text-green-400 mt-1">Avg Rating</div>
                </div>
              </div>
            </div>
          )}

          {/* Agent List Modal */}
          {showAgentList && (
            <div className="border border-green-500/30 p-6 bg-black/50">
              <div className="flex justify-between items-center mb-4">
                <div className="text-green-400 font-bold">▣ AVAILABLE AGENTS ({availableAgents.length})</div>
                <button
                  onClick={() => setShowAgentList(false)}
                  className="text-green-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {availableAgents.map((agent) => (
                  <div 
                    key={agent.agent_id}
                    className="border border-green-500/20 p-4 bg-black/30 hover:border-green-500/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-bold text-green-500">{agent.name}</div>
                      <div className="text-xs text-yellow-500">⭐ {agent.rating}</div>
                    </div>
                    <div className="text-xs text-green-400 mb-2">{agent.description}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {agent.capabilities?.map((cap, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 border border-green-500/30 text-green-500/70"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-green-400/50 mt-2">
                      ${agent.price} per execution
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="bg-black border-t border-green-500/30 p-2 text-xs flex justify-between items-center">
        <div>
          <span className="text-green-400">ORCHESTRATOR:</span> Active | 
          <span className="text-green-400 ml-2">MARKETPLACE:</span> Fitch AI | 
          <span className="text-purple-400 ml-2">GEMINI:</span> Fallback Enabled
        </div>
        <div>
          <span className="animate-pulse">● CONNECTED</span>
        </div>
      </div>

      {/* Thought Process Panel */}
      {showThoughtProcess && executionContext && (
        <ThoughtProcessPanel
          contextId={executionContext.context_id || 'current'}
          thoughtProcess={executionContext.thought_process || []}
          onClose={() => setShowThoughtProcess(false)}
        />
      )}
    </div>
  );
};

export default AgentOrchestrator;
