import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const BlockchainPanel = ({ onBack }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [selectedVerification, setSelectedVerification] = useState(null);

  useEffect(() => {
    fetchBlockchainStats();
    const interval = setInterval(fetchBlockchainStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBlockchainStats = async () => {
    try {
      const response = await fetch('/api/sui/blockchain_stats');
      const data = await response.json();
      setStats(data);
      if (data.recent_verifications) {
        setVerificationHistory(data.recent_verifications.reverse());
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blockchain stats:', error);
      setLoading(false);
    }
  };

  const viewVerificationDetails = (verification) => {
    setSelectedVerification(verification);
  };

  const verifyRequest = async (requestId) => {
    try {
      const response = await fetch('/api/sui/verify_request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Verification confirmed on Sui blockchain!', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        fetchBlockchainStats(); // Refresh data
      } else {
        toast.error(data.error || 'Verification failed', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error('Error verifying request:', error);
      toast.error('Failed to verify request', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-green-500 text-xl animate-pulse">LOADING BLOCKCHAIN DATA...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-green-500 font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-green-500/30 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-wider">
              ▣ SUI BLOCKCHAIN VERIFICATION SYSTEM
            </h1>
            <div className="text-sm text-green-400 mt-1">
              Network: {stats?.network || 'Sui Testnet'} | Status: <span className="animate-pulse">● ACTIVE</span>
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
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-green-500/30 p-4 bg-black/50">
            <div className="text-green-400 text-sm">TOTAL CAMERAS</div>
            <div className="text-3xl font-bold mt-2">{stats?.total_cameras || 0}</div>
            <div className="text-xs text-green-500/70 mt-1">Registered on-chain</div>
          </div>
          
          <div className="border border-green-500/30 p-4 bg-black/50">
            <div className="text-green-400 text-sm">VERIFICATIONS</div>
            <div className="text-3xl font-bold mt-2">{stats?.total_verifications || 0}</div>
            <div className="text-xs text-green-500/70 mt-1">AI analysis verified</div>
          </div>
          
          <div className="border border-green-500/30 p-4 bg-black/50">
            <div className="text-green-400 text-sm">WALRUS BLOBS</div>
            <div className="text-3xl font-bold mt-2">{stats?.walrus_blobs || 0}</div>
            <div className="text-xs text-green-500/70 mt-1">Data stored</div>
          </div>
        </div>

        {/* Contract Info */}
        <div className="border border-green-500/30 p-4 bg-black/50">
          <div className="text-green-400 font-bold mb-3">▣ SMART CONTRACT ADDRESSES</div>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center justify-between">
              <span className="text-green-500/70">Package ID:</span>
              <span className="text-green-400">{stats?.package_id || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-500/70">Registry ID:</span>
              <span className="text-green-400">{stats?.registry_id || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Verification History */}
        <div className="border border-green-500/30 p-4 bg-black/50">
          <div className="text-green-400 font-bold mb-3">▣ RECENT VERIFICATIONS</div>
          
          {verificationHistory.length === 0 ? (
            <div className="text-green-500/50 text-center py-8">
              No verifications yet. Create your first AI verification request!
            </div>
          ) : (
            <div className="space-y-2">
              {verificationHistory.map((verification, index) => (
                <div 
                  key={verification.request_id || index}
                  className="border border-green-500/20 p-3 hover:border-green-500/50 transition-all cursor-pointer bg-black/30"
                  onClick={() => viewVerificationDetails(verification)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">
                      {verification.request_id}
                    </span>
                    <span className={`text-xs px-2 py-1 border ${
                      verification.verified 
                        ? 'border-green-500 text-green-500' 
                        : 'border-yellow-500 text-yellow-500'
                    }`}>
                      {verification.verified ? '✓ VERIFIED' : '⧗ PENDING'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-green-500/70">Camera: </span>
                      <span className="text-green-400">{verification.camera_uid}</span>
                    </div>
                    <div>
                      <span className="text-green-500/70">Type: </span>
                      <span className="text-green-400">{verification.request_type}</span>
                    </div>
                  </div>
                  <div className="text-xs mt-2">
                    <span className="text-green-500/70">TX: </span>
                    <a 
                      href={verification.sui_explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {verification.tx_hash?.substring(0, 20)}...
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verification Details Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-green-500 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-green-500/30 flex justify-between items-center">
              <h2 className="text-xl font-bold">▣ VERIFICATION DETAILS</h2>
              <button
                onClick={() => setSelectedVerification(null)}
                className="text-green-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <div className="text-green-400 text-sm mb-1">REQUEST ID</div>
                <div className="font-mono text-xs">{selectedVerification.request_id}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-green-400 text-sm mb-1">CAMERA UID</div>
                  <div className="font-mono text-xs">{selectedVerification.camera_uid}</div>
                </div>
                <div>
                  <div className="text-green-400 text-sm mb-1">REQUEST TYPE</div>
                  <div className="font-mono text-xs">{selectedVerification.request_type}</div>
                </div>
              </div>
              
              <div>
                <div className="text-green-400 text-sm mb-1">AI ANALYSIS RESULT</div>
                <div className="border border-green-500/30 p-3 font-mono text-xs bg-black/50">
                  {selectedVerification.ai_result || 'No result provided'}
                </div>
              </div>
              
              <div>
                <div className="text-green-400 text-sm mb-1">WALRUS BLOB ID</div>
                <div className="font-mono text-xs">{selectedVerification.walrus_blob_id}</div>
              </div>
              
              <div>
                <div className="text-green-400 text-sm mb-1">VERIFICATION HASH</div>
                <div className="font-mono text-xs break-all">{selectedVerification.verification_hash}</div>
              </div>
              
              <div>
                <div className="text-green-400 text-sm mb-1">TRANSACTION</div>
                <a 
                  href={selectedVerification.sui_explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline text-xs"
                >
                  View on Sui Explorer →
                </a>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-green-500/30">
                <div className={`px-3 py-1 border ${
                  selectedVerification.verified 
                    ? 'border-green-500 text-green-500' 
                    : 'border-yellow-500 text-yellow-500'
                }`}>
                  {selectedVerification.verified ? '✓ VERIFIED' : '⧗ PENDING VERIFICATION'}
                </div>
                
                {!selectedVerification.verified && (
                  <button
                    onClick={() => {
                      verifyRequest(selectedVerification.request_id);
                      setSelectedVerification(null);
                    }}
                    className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500/10 transition-all"
                  >
                    [VERIFY NOW]
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-black border-t border-green-500/30 p-2 text-xs flex justify-between items-center">
        <div>
          <span className="text-green-400">BLOCKCHAIN:</span> Sui Testnet | 
          <span className="text-green-400 ml-2">STORAGE:</span> Walrus
        </div>
        <div>
          <span className="animate-pulse">● CONNECTED</span>
        </div>
      </div>
    </div>
  );
};

export default BlockchainPanel;
