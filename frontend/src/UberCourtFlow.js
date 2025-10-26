import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

const UberCourtFlow = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [cctvFeeds, setCctvFeeds] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [thoughtProcess, setThoughtProcess] = useState([]);
  const [showThoughts, setShowThoughts] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);

  const logsEndRef = useRef(null);

  useEffect(() => {
    // Load HLS.js for video streaming
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activityLogs]);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const addLog = (message, type = 'info', payload = null) => {
    setActivityLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message,
      type,
      payload
    }]);
  };

  const addTimelineStep = (step) => {
    const newStep = { ...step, id: Date.now() + Math.random(), timestamp: new Date() };
    setTimeline(prev => [...prev, newStep]);
    return newStep.id;
  };

  const updateTimelineStep = (id, updates) => {
    setTimeline(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addThought = (thought) => {
    setThoughtProcess(prev => [...prev, { ...thought, id: Date.now() + Math.random() }]);
  };

  const startFlow = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query', { theme: 'dark' });
      return;
    }

    setIsRunning(true);
    setTimeline([]);
    setThoughtProcess([]);
    setActivityLogs([]);
    setCctvFeeds([]);
    setFinalResult(null);
    setWalletData(null);

    addLog('🚀 Starting Trinetra Uber Court Flow...', 'info');
    addLog('Query: ' + query, 'info');

    try {
      const taskPrompt = {
        user_query: query,
        intent: 'book_ride_if_nearest_location_dry',
        target_object: 'tennis court',
        demo_mode: true
      };

      addLog('📋 Task prompt assembled', 'info', taskPrompt);

      setCurrentStep('Initializing Zinitra on Fitch AI...');
      const id1 = addTimelineStep({
        title: 'Initialize Orchestration',
        status: 'running',
        description: 'Calling Zinitra agent on Fitch AI'
      });

      await delay(1000);
      addLog('✅ Connected to Zinitra orchestrator', 'success');
      updateTimelineStep(id1, { status: 'success' });

      await executeLocationFinding();
      await executeCCTVAnalysis();
      await executeWalletCheck();

    } catch (error) {
      addLog('❌ Error: ' + error.message, 'error');
      setIsRunning(false);
    }
  };

  const executeLocationFinding = async () => {
    setCurrentStep('Locating nearest tennis court...');
    const id = addTimelineStep({
      title: 'Step A: Location Discovery',
      status: 'running',
      description: 'Finding nearest tennis court'
    });

    await delay(1500);

    const locationData = {
      nearest_court: {
        id: 'court-17',
        name: 'Sunset Park Tennis Court',
        lat: 37.7749,
        lon: -122.4194,
        distance_m: 320
      }
    };

    addLog('📍 Location found: court-17 (320m away)', 'success', locationData);
    updateTimelineStep(id, { status: 'success', data: locationData });

    addThought({
      title: 'LocationAgent: Nearest Court Discovery',
      what: 'Located tennis court 320 meters away',
      why: 'User specified "nearest court" in query',
      next: 'Access CCTV feed for analysis'
    });
  };

  const executeCCTVAnalysis = async () => {
    setCurrentStep('Accessing CCTV feeds...');
    const id = addTimelineStep({
      title: 'Step B: CCTV Stream Access',
      status: 'running',
      description: 'Connecting to court-17 cameras'
    });

    await delay(500);

    // Use hardcoded stream URL
    const feedData = {
      id: 'tennis-court-cam-01',
      name: 'Tennis Court Camera',
      stream_url: 'https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af',
      status: 'analyzing',
      location: 'court-17',
      timestamp: new Date().toISOString()
    };

    setCctvFeeds([feedData]);
    addLog('📹 CCTV stream connected: ' + feedData.name, 'success', { camera_id: feedData.id });
    updateTimelineStep(id, { status: 'success' });

    await executeVisionAnalysis(feedData);
  };

  const executeVisionAnalysis = async (feed) => {
    setCurrentStep('Analyzing court conditions...');
    const startTime = Date.now();
    const id = addTimelineStep({
      title: 'Step C: VisionAgent Analysis',
      status: 'running',
      description: 'Analyzing 120 frames for dryness'
    });

    await delay(2500);

    const analysis = {
      court_id: 'court-17',
      is_dry: true,
      confidence: 0.93,
      reasoning: 'No puddles detected; no rain streaks'
    };

    addLog('🔍 Analysis complete: DRY (93% confidence)', 'success', analysis);
    updateTimelineStep(id, { status: 'success', data: analysis });

    setCctvFeeds(prev => prev.map(f => 
      f.id === feed.id ? { ...f, status: 'dry', confidence: 0.93 } : f
    ));

    // Log to Elasticsearch
    try {
      const processingTime = Date.now() - startTime;
      await fetch('http://localhost:5000/api/elasticsearch/log_analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camera_id: feed.id,
          analysis_type: 'court_dryness_detection',
          result: {
            is_dry: analysis.is_dry,
            reasoning: analysis.reasoning,
            court_id: analysis.court_id
          },
          confidence: analysis.confidence,
          agent_id: 'vision-agent-001',
          agent_name: 'VisionAgent (Court Analysis)',
          processing_time_ms: processingTime,
          gemini_used: true,
          frames_analyzed: 120,
          detected_objects: ['tennis_court', 'surface'],
          conditions: {
            weather: 'clear',
            surface_state: 'dry',
            puddles_detected: false
          }
        })
      });
      addLog('✅ Analysis logged to Elasticsearch', 'success');
    } catch (error) {
      addLog('⚠️ Failed to log analysis to Elasticsearch', 'warning');
    }

    addThought({
      title: 'VisionAgent: Dryness Detection',
      what: 'Analyzed 120 frames → concluded DRY',
      why: 'No water reflectance pattern detected',
      next: 'Check wallet balance'
    });

    const geminiSummary = 'I checked the nearest tennis court (320m away) by analyzing CCTV. The frames show no puddles — 93% confidence — so I checked wallet balance, locked funds, and submitted an Uber booking.';
    
    addThought({
      title: 'Gemini AI: Natural Language Summary',
      what: geminiSummary,
      why: 'Providing human-friendly explanation',
      next: 'Proceed to wallet verification'
    });
  };

  const executeWalletCheck = async () => {
    setCurrentStep('Checking Slush wallet...');
    const id = addTimelineStep({
      title: 'Step E: Wallet Balance Check',
      status: 'running',
      description: 'Querying Slush wallet API'
    });

    await delay(1200);

    const wallet = {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      balance: 25.00,
      required_hold: 12.00,
      sufficient: true
    };

    setWalletData(wallet);
    addLog('💰 Wallet balance: $25.00', 'success', wallet);
    updateTimelineStep(id, { status: 'success', data: wallet });

    addThought({
      title: 'Slush Wallet: Balance Verification',
      what: 'Retrieved balance $25.00 - sufficient',
      why: 'Need funds before booking ($12.00 required)',
      next: 'Request user confirmation'
    });

    setShowWalletModal(true);
    setCurrentStep('Awaiting confirmation...');
  };

  const confirmWallet = async () => {
    setShowWalletModal(false);
    setCurrentStep('Locking funds...');
    
    const id = addTimelineStep({
      title: 'Step F: Fund Lock',
      status: 'running',
      description: 'Locking $12.00 in Slush wallet'
    });

    await delay(1000);

    const lockResponse = {
      hold_id: 'DEMO-HOLD-abc123',
      amount: 12.00,
      status: 'locked'
    };

    addLog('🔒 Funds locked: ' + lockResponse.hold_id, 'success', lockResponse);
    updateTimelineStep(id, { status: 'success', data: lockResponse });

    await executeUberBooking(lockResponse);
  };

  const executeUberBooking = async (lockData) => {
    setCurrentStep('Booking Uber via Postman...');
    const id = addTimelineStep({
      title: 'Step G: Postman Automation',
      status: 'running',
      description: 'Running Uber booking collection'
    });

    await delay(2000);

    const postmanPayload = {
      collection_id: 'novasync-uber-booking-v1',
      environment: 'demo',
      payment_hold_id: lockData.hold_id
    };

    addLog('📮 Postman collection triggered', 'info', postmanPayload);
    await delay(1500);

    const uberResponse = {
      uber_booking: {
        status: 'confirmed',
        eta_minutes: 6,
        driver_name: 'Simulated Driver',
        vehicle: 'Toyota Camry',
        ride_id: 'demo-ride-987654'
      }
    };

    setFinalResult(uberResponse);
    addLog('✅ Uber booking confirmed! ETA: 6 min', 'success', uberResponse);
    updateTimelineStep(id, { status: 'success', data: uberResponse });

    addThought({
      title: 'Postman: Uber Booking Complete',
      what: 'Successfully booked Uber ride',
      why: 'All conditions met: dry + wallet confirmed',
      next: 'Flow complete'
    });

    addTimelineStep({
      title: 'Step H: Flow Complete',
      status: 'success',
      description: '✨ Ride booked - Driver ETA 6 minutes'
    });

    setCurrentStep('Complete! 🎉');
    setIsRunning(false);
    toast.success('🎉 Uber booked successfully!', { theme: 'dark' });
  };

  const downloadLogs = () => {
    const data = JSON.stringify({ timeline, thoughtProcess, activityLogs, finalResult }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trinetra-uber-flow-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="h-screen bg-black text-green-500 font-mono flex flex-col overflow-hidden">
      {/* Demo Banner */}
      <div className="bg-yellow-500/20 border-b-2 border-yellow-500 p-2 text-center">
        <span className="text-yellow-500 font-bold">⚠️ DEMO MODE</span>
        <span className="text-yellow-400 ml-2">All network calls simulated. No real charges.</span>
      </div>

      {/* Header */}
      <div className="bg-black border-b border-green-500/30 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">🚗 TRINETRA UBER COURT FLOW</h1>
            <div className="text-sm text-green-400 mt-1">
              Zinitra + Vision + Slush Wallet + Postman
            </div>
          </div>
          <button onClick={onBack} className="border border-green-500 px-4 py-2 hover:bg-green-500/10">
            [BACK]
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-green-500/30">
          {/* Search */}
          <div className="p-4 border-b border-green-500/30 bg-black/50">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: book an Uber if the nearest court is dry"
              className="w-full bg-black border border-green-500/50 text-green-500 p-3 mb-2 focus:border-green-500 focus:outline-none"
              disabled={isRunning}
            />
            <div className="flex gap-2">
              <button
                onClick={startFlow}
                disabled={isRunning}
                className={`px-6 py-2 border font-bold ${isRunning ? 'border-yellow-500 text-yellow-500' : 'border-green-500 text-green-500 hover:bg-green-500/10'}`}
              >
                {isRunning ? '[RUNNING...]' : '[START FLOW]'}
              </button>
              <button
                onClick={() => setShowThoughts(!showThoughts)}
                disabled={thoughtProcess.length === 0}
                className="px-4 py-2 border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 disabled:opacity-30"
              >
                🧠 [THOUGHTS]
              </button>
              <button
                onClick={downloadLogs}
                disabled={activityLogs.length === 0}
                className="px-4 py-2 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 disabled:opacity-30"
              >
                📥 [LOGS]
              </button>
            </div>
            {currentStep && <div className="mt-3 text-sm text-yellow-400 animate-pulse">{currentStep}</div>}
          </div>

          {/* CCTV Grid */}
          {cctvFeeds.length > 0 && (
            <div className="p-4 border-b border-green-500/30 bg-black/30">
              <div className="text-sm text-green-400 mb-2">📹 Live CCTV Feed:</div>
              {cctvFeeds.map(feed => (
                <div key={feed.id} className="border border-green-500/30 p-2 relative">
                  {feed.stream_url ? (
                    <video
                      ref={(el) => {
                        if (el && feed.stream_url) {
                          if (window.Hls && window.Hls.isSupported()) {
                            const hls = new window.Hls({
                              enableWorker: true,
                              lowLatencyMode: true,
                            });
                            hls.loadSource(feed.stream_url);
                            hls.attachMedia(el);
                            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                              el.play().catch(e => console.log('Autoplay prevented:', e));
                            });
                          } else if (el.canPlayType('application/vnd.apple.mpegurl')) {
                            el.src = feed.stream_url;
                            el.play().catch(e => console.log('Autoplay prevented:', e));
                          }
                        }
                      }}
                      className="w-full h-48 bg-black object-cover"
                      muted
                      playsInline
                      controls
                    />
                  ) : (
                    <div className="bg-black/50 h-48 flex flex-col items-center justify-center text-xs">
                      <div className="text-4xl mb-2">🎥</div>
                      <div className="text-green-400">{feed.name || feed.id}</div>
                      <div className="mt-2 text-yellow-400">Demo Mode - No Stream</div>
                    </div>
                  )}
                  <div className="mt-1 text-xs text-green-400">{feed.name || feed.id}</div>
                  <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold border ${
                    feed.status === 'analyzing' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 animate-pulse' :
                    feed.status === 'dry' ? 'bg-green-500/20 border-green-500 text-green-500' :
                    'bg-gray-500/20 border-gray-500 text-gray-500'
                  }`}>
                    {feed.status === 'analyzing' && '⚙️ ANALYZING'}
                    {feed.status === 'dry' && `✅ DRY (${Math.round(feed.confidence * 100)}%)`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-sm text-green-400 mb-3">🔄 Agent Timeline:</div>
            {timeline.length === 0 ? (
              <div className="text-center text-green-500/50 py-8">
                <div className="text-4xl mb-2">🚀</div>
                <div>Enter query and click [START FLOW]</div>
              </div>
            ) : (
              <div className="space-y-3">
                {timeline.map(step => (
                  <div key={step.id} className="border border-green-500/30 p-3 bg-black/30">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{step.status === 'running' ? '⚙️' : step.status === 'success' ? '✅' : '○'}</span>
                        <span className="font-bold">{step.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 border uppercase ${
                        step.status === 'success' ? 'border-green-500 text-green-500' :
                        step.status === 'running' ? 'border-yellow-500 text-yellow-500 animate-pulse' :
                        'border-gray-500 text-gray-500'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <div className="text-xs text-green-400">{step.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Result */}
          {finalResult && (
            <div className="p-4 border-t border-green-500 bg-green-500/10">
              <div className="font-bold mb-2">✨ BOOKING CONFIRMED</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-green-500/70">Driver:</div>
                  <div>{finalResult.uber_booking.driver_name}</div>
                </div>
                <div>
                  <div className="text-green-500/70">ETA:</div>
                  <div>{finalResult.uber_booking.eta_minutes} min</div>
                </div>
                <div>
                  <div className="text-green-500/70">Vehicle:</div>
                  <div>{finalResult.uber_booking.vehicle}</div>
                </div>
                <div>
                  <div className="text-green-500/70">Ride ID:</div>
                  <div>{finalResult.uber_booking.ride_id}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div className="w-96 flex flex-col bg-black/50">
          <div className="p-3 border-b border-green-500/30 bg-black">
            <div className="text-sm font-bold">📋 Activity Log</div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 text-xs space-y-2">
            {activityLogs.map(log => (
              <div key={log.id} className="border-l-2 border-green-500/30 pl-2">
                <div className="flex justify-between">
                  <div className={log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-green-500'}>
                    {log.message}
                  </div>
                  {log.payload && (
                    <button
                      onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                      className="text-blue-400 ml-2"
                    >
                      {expandedLog === log.id ? '[-]' : '[+]'}
                    </button>
                  )}
                </div>
                <div className="text-green-500/50 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</div>
                {expandedLog === log.id && log.payload && (
                  <pre className="mt-1 p-2 bg-black border border-green-500/20 overflow-x-auto text-green-400/70 text-xs">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && walletData && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-black border-2 border-green-500 p-6 w-[500px]">
            <h2 className="text-xl font-bold mb-4">💰 Slush Wallet Confirmation</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-green-400">Balance:</span>
                <span className="font-bold">${walletData.balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">Required:</span>
                <span className="text-yellow-500 font-bold">${walletData.required_hold.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">After Hold:</span>
                <span>${(walletData.balance - walletData.required_hold).toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/50 p-3 mb-4 text-xs">
              <div className="text-yellow-500 font-bold">SIMULATED WALLET</div>
              <div className="text-yellow-400">No real charges will be made.</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmWallet}
                className="flex-1 px-4 py-3 border border-green-500 text-green-500 hover:bg-green-500/10 font-bold"
              >
                [CONFIRM]
              </button>
              <button
                onClick={() => { setShowWalletModal(false); setIsRunning(false); }}
                className="flex-1 px-4 py-3 border border-red-500 text-red-500 hover:bg-red-500/10 font-bold"
              >
                [CANCEL]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thought Process */}
      {showThoughts && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-6">
          <div className="bg-black border-2 border-purple-500 w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="p-4 border-b border-purple-500/30 flex justify-between">
              <div>
                <h2 className="text-xl font-bold text-purple-500">🧠 THOUGHT PROCESS</h2>
                <div className="text-xs text-purple-400 mt-1">Chain-of-thought reasoning</div>
              </div>
              <button onClick={() => setShowThoughts(false)} className="text-purple-500 text-2xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {thoughtProcess.map(thought => (
                <div key={thought.id} className="border border-purple-500/30 p-4 mb-4 bg-purple-500/5">
                  <div className="text-purple-400 font-bold mb-2">{thought.title}</div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-purple-500 font-bold">WHAT:</span> <span className="text-purple-400">{thought.what}</span></div>
                    <div><span className="text-purple-500 font-bold">WHY:</span> <span className="text-purple-400">{thought.why}</span></div>
                    <div><span className="text-purple-500 font-bold">NEXT:</span> <span className="text-purple-400">{thought.next}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UberCourtFlow;
