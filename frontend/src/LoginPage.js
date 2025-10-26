import React, { useState } from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { motion } from 'framer-motion';

const LoginPage = ({ onLoginSuccess }) => {
  const currentAccount = useCurrentAccount();
  const [isConnecting, setIsConnecting] = useState(false);

  React.useEffect(() => {
    if (currentAccount) {
      console.log('='.repeat(60));
      console.log('🎉 WALLET CONNECTED SUCCESSFULLY!');
      console.log('='.repeat(60));
      console.log('Wallet Address:', currentAccount.address);
      console.log('Network: Sui Testnet');
      console.log('='.repeat(60));
      
      // Notify parent component
      setTimeout(() => {
        onLoginSuccess(currentAccount);
      }, 1000);
    }
  }, [currentAccount, onLoginSuccess]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'scroll 20s linear infinite'
        }}></div>
        
        {/* Glowing particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Login Card */}
        <div className="bg-black border-2 border-green-500 rounded-lg p-8 shadow-2xl shadow-green-500/20">
          {/* Logo/Title */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-green-500 mb-2 glitch-text" style={{
              textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00'
            }}>
              TRINETRA NETWORK
            </h1>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-mono">SECURITY CAMERA NETWORK</p>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="bg-green-900/20 border border-green-500/30 rounded p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 text-xs font-mono">SYSTEM STATUS</span>
                <span className="text-green-500 text-xs animate-pulse">● ONLINE</span>
              </div>
              <div className="text-green-500/70 text-xs font-mono space-y-1">
                <div>{'>'} Network: Sui Testnet</div>
                <div>{'>'} Status: Awaiting Authentication</div>
                <div>{'>'} Access Level: Guest</div>
              </div>
            </div>
          </motion.div>

          {/* Connection Status */}
          {!currentAccount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-6"
            >
              <p className="text-green-400 text-sm mb-4 font-mono">
                Connect your Sui wallet to access the network
              </p>
            </motion.div>
          )}

          {currentAccount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-900/30 border border-green-500 rounded p-4 mb-4"
            >
              <div className="text-green-400 text-xs mb-2 font-mono">AUTHENTICATED</div>
              <div className="text-green-500 text-xs font-mono break-all">
                {currentAccount.address}
              </div>
              <div className="mt-3 text-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs">Initializing terminal...</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Connect Button */}
          <div className="flex justify-center">
            <div className="sui-connect-button-wrapper">
              <ConnectButton 
                connectText="AUTHENTICATE WALLET"
                className="w-full"
              />
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-green-500/50 text-xs font-mono">
              SECURED BY SUI × ETHEREUM × RIPPLE × STORY PROTOCOL
            </p>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-center text-green-500/50 text-xs font-mono"
        >
          <p>Need testnet SUI? Visit the faucet at discord.gg/sui</p>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        
        .glitch-text {
          animation: glitch 3s infinite;
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

        .sui-connect-button-wrapper button {
          background: transparent !important;
          border: 2px solid #00ff00 !important;
          color: #00ff00 !important;
          padding: 12px 24px !important;
          font-family: 'Courier New', monospace !important;
          font-size: 14px !important;
          font-weight: bold !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .sui-connect-button-wrapper button:hover {
          background: rgba(0, 255, 0, 0.1) !important;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.5) !important;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;

