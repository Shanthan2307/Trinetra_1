import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
// import MapState from './MapState';
import './home.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CyberMap from './CyberMap';
import CCTVGrid from './CCTVGrid';
import BlockchainPanel from './BlockchainPanel';
import AgentOrchestrator from './AgentOrchestrator';
import UberCourtFlow from './UberCourtFlow';
import { ToastContainer, toast } from 'react-toastify';
import LoginPage from './LoginPage';

import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

import { PinataSDK } from 'pinata-web3'

const TerminalInput = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <div className="text-green-500 text-sm mb-1">{label}:</div>
    <div className="flex items-center">
      <span className="mr-2">{'>'}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent border-none focus:outline-none text-green-500 w-full caret-green-500"
      />
    </div>
  </div>
);


const bootSequence = [
  'INITIALIZING CYBER MAINFRAME...',
  'ACCESSING CORE MEMORY...',
  '                                                                                                                                                                  ',
  '                                                                                                            ░░░░░░░░▒▒▒▒░░░░░░                                            ',
  '                                                                                                          ░░▒▒▒▒▒▒▓▓▓▓▓▓▓▓▒▒░░░░                                          ',
  '                                                                                                      ░░▒▒▒▒▒▒░░░░▓▓▓▓▓▓██████▒▒░░░░                                      ',
  '                                                                                                    ░░▒▒▒▒▒▒░░▒▒▓▓██████▓▓▓▓████▓▓▒▒                                      ',
  '                                                                                                  ░░▒▒▒▒░░▒▒▓▓██▓▓▒▒░░      ▒▒▓▓██▓▓▒▒░░                                  ',
  '  ████████╗██████╗ ██╗███╗   ██╗███████╗████████╗██████╗  █████╗                                ░░░░░░▒▒▓▓▓▓▓▓▒▒░░▒▒████▒▒    ▓▓▓▓██▒▒░░                                ',
  '  ╚══██╔══╝██╔══██╗██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗                              ░░░░▒▒▓▓▒▒▒▒▓▓▒▒▒▒████████▒▒  ▒▒▓▓▓▓██▒▒                                ',
  '     ██║   ██████╔╝██║██╔██╗ ██║█████╗     ██║   ██████╔╝███████║                              ░░▒▒██▒▒░░▒▒▒▒░░▓▓██    ████░░░░▒▒░░▓▓██▒▒░░                            ',
  '     ██║   ██╔══██╗██║██║╚██╗██║██╔══╝     ██║   ██╔══██╗██╔══██║                              ░░▒▒░░░░  ▒▒▒▒░░▓▓████▒▒████░░▒▒▒▒  ▒▒████▒▒░░                          ',
  '     ██║   ██║  ██║██║██║ ╚████║███████╗   ██║   ██║  ██║██║  ██║                              ░░▒▒▓▓▒▒░░▒▒▓▓▒▒▒▒████████▒▒░░▓▓░░  ▒▒▓▓▒▒░░                            ',
  '     ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝                                ░░▒▒▓▓▒▒▒▒▓▓▒▒░░▒▒▓▓▓▓▒▒░░▒▒▒▒░░▒▒▒▒░░                                ',
  '                                                                                                    ░░▒▒▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▒▓▓░░                                  ',
  '                                                                                                      ░░▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░                                    ',
  '                                                                                                        ░░░░░░▒▒▒▒▓▓▓▓▓▓▓▓▒▒▒▒░░░░                                      ',
  '                                                                                                              ░░░░░░░░░░░░░░░░                                          ',
  '              ░█▀▀░█▀▀░█▀▀░█░█░█▀▄░▀█▀░▀█▀░█░█░░░█▀▀░█▀█░█▄█░█▀▀░█▀▄░█▀█░░░█▀█░█▀▀░▀█▀░█░█░█▀█░█▀▄░█░█                                                                      ',
  '              ░▀▀█░█▀▀░█░░░█░█░█▀▄░░█░░░█░░░█░░░░█░░░█▀█░█░█░█▀▀░█▀▄░█▀█░░░█░█░█▀▀░░█░░█▄█░█░█░█▀▄░█▀▄                                                                      ',
  '              ░▀▀▀░▀▀▀░▀▀▀░▀▀▀░▀░▀░▀▀▀░░▀░░░▀░░░░▀▀▀░▀░▀░▀░▀░▀▀▀░▀░▀░▀░▀░░░▀░▀░▀▀▀░░▀░░▀░▀░▀▀▀░▀░▀░▀░▀                                                                      ',
  '                                                                                                                                                                            ',
  '                                       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄                                                                                            ',
  '                                       █░░░░░░░░░░░░ SURVEILLANCE ░░░░░░░░░░░█                                                                                            ',
  '                                       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀                                                                                            ',
  '                                                                                                                                                                            ',
  '                                                                                                                                                                            ',

  'BIOS VERSION 0xDEADBEEF',
  'MEMORY TEST: 64K OK',
  'INITIALIZING HARDWARE RAID ARRAY...',
  'MOUNTING /dev/cyberpunk',
  'LOADING TOR PROTOCOL...',
  'ACTIVATING NEURAL NETWORK...',
  'ESTABLISHING QUANTUM ENCRYPTION...',
  'WARNING: SYSTEM INTRUSION DETECTED',
  'DEPLOYING COUNTERMEASURES...',
  'AUTHENTICATING... BIOMETRICS CONFIRMED'
];

// Alternative boot sequence - Blockchain powered
// const bootSequence = [
//   'INITIALIZING TRINETRA MAINFRAME...',
//   'LOADING BLOCKCHAIN PROTOCOLS...',
//   '                                                                                                                                       ',
//   '   ██████╗  ██████╗ ██╗    ██╗███████╗██████╗ ███████╗██████╗     ██████╗ ██╗   ██╗                                                    ',
//   '   ██╔══██╗██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔════╝██╔══██╗    ██╔══██╗╚██╗ ██╔╝                                                    ',
//   '   ██████╔╝██║   ██║██║ █╗ ██║█████╗  ██████╔╝█████╗  ██║  ██║    ██████╔╝ ╚████╔╝                                                     ',
//   '   ██╔═══╝ ██║   ██║██║███╗██║██╔══╝  ██╔══██╗██╔══╝  ██║  ██║    ██╔══██╗  ╚██╔╝                                                      ',
//   '   ██║     ╚██████╔╝╚███╔███╔╝███████╗██║  ██║███████╗██████╔╝    ██████╔╝   ██║                                                       ',
//   '   ╚═╝      ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝     ╚═════╝    ╚═╝                                                       ',
//   '                                                                                                                                       ',
//   '        ███████╗██╗   ██╗██╗    ██████╗ ██╗      ██████╗  ██████╗██╗  ██╗ ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗                       ',
//   '        ██╔════╝██║   ██║██║    ██╔══██╗██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██║  ██║██╔══██╗██║████╗  ██║                       ',
//   '        ███████╗██║   ██║██║    ██████╔╝██║     ██║   ██║██║     █████╔╝ ██║     ███████║███████║██║██╔██╗ ██║                       ',
//   '        ╚════██║██║   ██║██║    ██╔══██╗██║     ██║   ██║██║     ██╔═██╗ ██║     ██╔══██║██╔══██║██║██║╚██╗██║                       ',
//   '        ███████║╚██████╔╝██║    ██████╔╝███████╗╚██████╔╝╚██████╗██║  ██╗╚██████╗██║  ██║██║  ██║██║██║ ╚████║                       ',
//   '        ╚══════╝ ╚═════╝ ╚═╝    ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝                       ',
//   '                                                                                                                                       ',
//   '   ███████╗████████╗██╗  ██╗███████╗██████╗ ███████╗██╗   ██╗███╗   ███╗    ██╗  ██╗██████╗ ██████╗ ██████╗ ██╗     ███████╗        ',
//   '   ██╔════╝╚══██╔══╝██║  ██║██╔════╝██╔══██╗██╔════╝██║   ██║████╗ ████║    ╚██╗██╔╝██╔══██╗██╔══██╗██╔══██╗██║     ██╔════╝        ',
//   '   █████╗     ██║   ███████║█████╗  ██████╔╝█████╗  ██║   ██║██╔████╔██║     ╚███╔╝ ██████╔╝██████╔╝██████╔╝██║     █████╗          ',
//   '   ██╔══╝     ██║   ██╔══██║██╔══╝  ██╔══██╗██╔══╝  ██║   ██║██║╚██╔╝██║     ██╔██╗ ██╔══██╗██╔═══╝ ██╔═══╝ ██║     ██╔══╝          ',
//   '   ███████╗   ██║   ██║  ██║███████╗██║  ██║███████╗╚██████╔╝██║ ╚═╝ ██║    ██╔╝ ██╗██║  ██║██║     ██║     ███████╗███████╗        ',
//   '   ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚══════╝        ',
//   '                                                                                                                                       ',
//   '                                ██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗     ██████╗ ██╗   ██╗                                ',
//   '                                ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗    ██╔══██╗╚██╗ ██╔╝                                ',
//   '                                ██████╔╝███████║██║     █████╔╝ █████╗  ██║  ██║    ██████╔╝ ╚████╔╝                                 ',
//   '                                ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██║  ██║    ██╔══██╗  ╚██╔╝                                  ',
//   '                                ██████╔╝██║  ██║╚██████╗██║  ██╗███████╗██████╔╝    ██████╔╝   ██║                                   ',
//   '                                ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝     ╚═════╝    ╚═╝                                   ',
//   '                                                                                                                                       ',
//   '                                      ██████╗ ██╗██████╗ ██████╗ ██╗     ███████╗                                                     ',
//   '                                      ██╔══██╗██║██╔══██╗██╔══██╗██║     ██╔════╝                                                     ',
//   '                                      ██████╔╝██║██████╔╝██████╔╝██║     █████╗                                                       ',
//   '                                      ██╔══██╗██║██╔═══╝ ██╔═══╝ ██║     ██╔══╝                                                       ',
//   '                                      ██║  ██║██║██║     ██║     ███████╗███████╗                                                     ',
//   '                                      ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝     ╚══════╝╚══════╝                                                     ',
//   '                                                                                                                                       ',
//   'BLOCKCHAIN INFRASTRUCTURE INITIALIZED',
//   'SUI NETWORK: ✓ CONNECTED',
//   'ETHEREUM MAINNET: ✓ CONNECTED',
//   'RIPPLE LEDGER: ✓ BACKING PROTOCOL ACTIVE',
//   'CROSS-CHAIN BRIDGE: OPERATIONAL',
//   'SMART CONTRACTS: DEPLOYED',
//   'DECENTRALIZED STORAGE: ONLINE',
//   'CONSENSUS MECHANISM: VALIDATED',
//   'SECURITY LAYER: QUANTUM-RESISTANT ENCRYPTION ACTIVE',
//   'ALL SYSTEMS OPERATIONAL - TRINETRA READY'
// ];




function App() {

  // Sui Wallet Integration
  const currentAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  const terminalEndRef = useRef(null);
  const [state, setState] = useState('home');
  const [query, setQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [newCamCoords, setNewCamCoords] = useState("");
  const [newCamUrl, setNewCamUrl] = useState("");
  const [newCamDesc, setNewCamDesc] = useState("");
  const [webpageUrl, setWebpageUrl] = useState("");
  const [extractedStreams, setExtractedStreams] = useState([]);
  const [selectedStreamUrl, setSelectedStreamUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query_found_cam, set_query_found_cam] = useState();
  const [query_found_res, set_query_found_res] = useState();
  const [allCams, setAllCams] = useState([]);
  const [currentBootStep, setCurrentBootStep] = useState(0);
  const [showUpdatesPopup, SetshowUpdatesPopup] = useState(false);
  const [newCamEmail, setNewCamEmail] = useState("");
  const [newCamID, setNewCamID] = useState("");
  const [selectedCam, setSelectedCam] = useState(null);

  // ALL useEffect HOOKS MUST BE BEFORE CONDITIONAL RETURN
  // Monitor currentAccount and sync with isLoggedIn state
  useEffect(() => {
    // If wallet disconnects externally, update our state
    if (!currentAccount && isLoggedIn) {
      setIsLoggedIn(false);
      setWalletAddress('');
      setState('home');
    }
  }, [currentAccount, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoggedIn, showPopup]);

  useEffect(() => {
    if (isLoggedIn && state === 'home') {
      const timer = setInterval(() => {
        setCurrentBootStep(prev => Math.min(prev + 1, bootSequence.length));
      }, 5);
      return () => clearInterval(timer);
    }
  }, [isLoggedIn, state]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchData = async () => {
      console.log('trying to fetch cam data')
      try {
        const response = await fetch('/api/get_all_cameras', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log("ALL CAMERAS DATA:", data);
        setAllCams(data);
      } catch (error) {
        console.error("Error fetching camera data:", error);
      }
    }
    fetchData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && state === 'loading') {
      const timer = setTimeout(() => {
        console.log("Delayed action executed");
        setState('map');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, state]);

  // Handle login success
  const handleLoginSuccess = (account) => {
    if (isDisconnecting) {
      console.log('⏸️ Ignoring auto-login during disconnect process');
      return;
    }
    setWalletAddress(account.address);
    setIsLoggedIn(true);
    console.log('✅ Proceeding to terminal interface...');
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    console.log('🔌 Disconnecting from wallet...');
    setIsDisconnecting(true);
    disconnectWallet();
    // Clear local state immediately
    setIsLoggedIn(false);
    setWalletAddress('');
    setState('home');
    console.log('✅ Disconnected from wallet');
    
    // Reset disconnecting flag after a delay
    setTimeout(() => {
      setIsDisconnecting(false);
    }, 1000);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // console.log("PINATA KEY ", process.env.REACT_APP_PINATA_JWT)
  const pinata = new PinataSDK({
    pinataJwt: process.env.REACT_APP_PINATA_JWT,
  })

  // Setup Story Protocol client
  // Note: Story Protocol requires Ethereum wallet (wagmi). Currently disabled for Sui-only setup.
  // To re-enable: wrap app in WagmiProvider and add Ethereum wallet connection
  /*
  async function setupStoryClient() {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    return StoryClient.newClient({
      account: wallet.account,
      transport: custom(wallet.transport),
      chainId: "iliad", // Story Protocol testnet
    });
  }

  const computeHash = (content) => {
    // const hash = createHash('sha256').update(JSON.stringify(content)).digest('hex');
    // return '0x' + hash;
    return
  };
  async function registerIpWithRoyalties(cam_description, cam_image_url) {
    try {
      const client = await setupStoryClient();

      // PIL Terms configuration for royalties
      const commercialRemixTerms = {
        transferable: true,
        royaltyPolicy: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E', // RoyaltyPolicyLAP address from https://docs.story.foundation/docs/deployed-smart-contracts
        defaultMintingFee: 0n,
        expiration: 0n,
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: zeroAddress,
        commercialRevShare: 50, // can claim 50% of derivative revenue
        commercialRevCeiling: 0n,
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: 0n,
        currency: '0x1514000000000000000000000000000000000000', // $WIP address from https://docs.story.foundation/docs/deployed-smart-contracts
        uri: '',
      }
      const licensingConfig = {
        isSet: false,
        mintingFee: 0n,
        licensingHook: zeroAddress,
        hookData: zeroHash,
        commercialRevShare: 0,
        disabled: false,
        expectMinimumGroupRewardShare: 0,
        expectGroupRewardPool: zeroAddress,
      };


      const nftMetadata = {
        name: "CAMERA_IP_ID:",
        description: cam_description,
        image: cam_image_url,
      }
      const IpMetadata = {
        title: "CAMERA_IP_ID:",
        description: cam_description,
        image: cam_image_url,
      }

      const Ipfs_NFT = await pinata.upload.json(nftMetadata)
      // const HASH_nft = '0x' + Ipfs_NFT.IpfsHash



      const Ipfs_IP = await pinata.upload.json(IpMetadata)
      // const HASH_IP = '0x' + Ipfs_IP.IpfsHash
      console.log("IP METADATA HASH", Ipfs_NFT)
      console.log("IP METADATA OVERALL", Ipfs_IP)


      const HASH_nft = computeHash(nftMetadata);
      const HASH_IP = computeHash(IpMetadata);
      // const final_ipMetaData_temp =
      // {
      //   ipMetadataURI: 'test-uri',
      //   ipMetadataHash: HASH_IP,
      //   nftMetadataHash: HASH_nft,
      //   nftMetadataURI: 'test-nft-uri',
      // }
      const final_ipMetaData_temp = {
        ipMetadataURI: `https://ipfs.io/ipfs/${Ipfs_IP.IpfsHash}`,  // Use actual IPFS URL
        ipMetadataHash: "0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc",
        nftMetadataHash: "0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc",
        nftMetadataURI: `https://ipfs.io/ipfs/${Ipfs_NFT.IpfsHash}`,  // Use actual IPFS URL
      };


      console.log("IP METADATA FINAL", final_ipMetaData_temp)

      toast.info('Awaiting IP NFT mint', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc',
        licenseTermsData: [{ terms: commercialRemixTerms, licensingConfig }], // IP already has non-commercial social remixing terms. You can add more here.
        // set to true to mint ip with same nft metadata
        allowDuplicates: true,
        // https://docs.story.foundation/docs/ip-asset#adding-nft--ip-metadata-to-ip-asset

        ipMetadata: final_ipMetaData_temp,

        txOptions: { waitForTransaction: true },
      })

      console.log("res ", response)
      var lisenceTermsId = response.licenseTermsIds[0]

      console.log(`Transaction hash: ${response.txHash}, 
                   Token ID: ${response.tokenId}, 
                   IPA ID: ${response.ipId}`);


      const lisenceTokensMint = await client.license.mintLicenseTokens({
        licenseTermsId: lisenceTermsId,
        licensorIpId: response.ipId,
        amount: 1,
        maxMintingFee: 0n, // disabled
        maxRevenueShare: 100, // default
        txOptions: { waitForTransaction: true }
      });


      console.log(`Transaction hash of minting lisence tokens: ${lisenceTokensMint.txHash}, 
                   Token ID: ${lisenceTokensMint.tokenId}, 
                   IPA ID: ${lisenceTokensMint.ipId}`);

      toast.success('Minted IP with ID:' + lisenceTokensMint.ipId, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });


      return {
        "txHash": response.txHash,
        "tokenId": response.tokenId,
        "ipId": response.ipId,
        "CID": Ipfs_NFT.IpfsHash
      }

    } catch (error) {
      console.error("Error registering IP with royalties:", error);
    }
  }
  */
  ///MAP STUFF
  /// Modified MAP STUFF
  ///END MAP STUFF


  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };


  const handleSubmit = async (event) => {

    if (query === '') {
      return;
    }

    console.log('Query:', query);

    const response = await fetch('/api/query_determine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: query })
    });

    const data = await response.json();

    const location = data.location;
    const face_search = data.face_search;

    if (location == -1) {
      console.log("Location not found");
      //now we need to search by description
      var cam = await searchByDescription(query, face_search);
      console.log("FOUND QUERY FOUND CAM PRE: ", cam)
      set_query_found_cam(cam);
      setSelectedCam(cam);
    }
    else {
      var cam = await searchByLocation(location, face_search, query);
      console.log("FOUND QUERY FOUND CAM PRE: ", cam)
      set_query_found_cam(cam);
      setSelectedCam(cam);
      console.log("cam location found at: ID ", cam);
    }

    setState('loading')
    console.log("COMPLETLY DONE DATA BELOW " + query_found_cam + "  " + query_found_res)

    console.log(data);

  };

  const searchByDescription = async (query, face_search) => {
    console.log('Query:', query);

    const response = await fetch('/api/search_cameras_description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query })
    });

    const data = await response.json();
    console.log("WE NEED FACE SEARCH?" + face_search + "FULL DATA:", data)
    if (face_search) {
      var res = await face_search_frontend(data);
      set_query_found_res(res);
      console.log("We found a res ", res)
    }
    else {

      set_query_found_res("")
      // FOR NOW NO FACE SEARCH IS DISABLE

      // var res = answer_query_no_face_search(data, query);
      // set_query_found_res(res);
    }

    setState('loading')
    console.log("COMPLETLY DONE DATA BELOW " + query_found_cam + "  " + query_found_res)


    return data;
  }

  const searchByLocation = async (location, face_search, query) => {
    console.log('Location:', location);

    const response = await fetch('/api/search_cameras_location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: String(location) })
    });

    const data = await response.json();
    console.log("WE NEED FACE SEARCH?" + face_search + "FULL DATA:", data)
    if (face_search) {
      var res = await face_search_frontend(data);
      set_query_found_res(res);
      console.log("We found a res ", res)
    }
    else {
      set_query_found_res("")

      // FOR NOW NO FACE SEARCH IS DISABLED

      // var res = answer_query_no_face_search(data, query);
      // set_query_found_res(res);
    }

    return data
  }

  const face_search_frontend = async (cam) => {
    //replace with logic that queries agent and then gets camera image and then gets face

    console.log("STARTING FACE SEARCH FRONTEND");
    console.log("cam url", cam['image_url']);

    const response = await fetch('/api/answer_query_face', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "cam_url": cam['image_url'] })
    });

    var data = await response.json();

    console.log("RESPONSE DATA:", data);

    return data.response;

    return {
      "name": "John Doe",
      "age": "25",
      "facebook": "https://www.facebook.com",
      "linkedin": "https://www.linkedin.com",
    }

  }
  const createBlockchainVerification = async (cameraUid, aiResult, requestType = 'ai_query') => {
    try {
      console.log("Creating blockchain verification:", cameraUid, aiResult);
      
      const response = await fetch('/api/sui/create_verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camera_uid: cameraUid,
          request_type: requestType,
          ai_result: aiResult,
          image_data: '' // Can add base64 image if needed
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log("✅ Blockchain verification created:", data);
        toast.success(`Verification recorded on Sui! TX: ${data.tx_hash?.substring(0, 10)}...`, {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
        return data;
      } else {
        console.error("Blockchain verification failed:", data);
        return null;
      }
    } catch (error) {
      console.error("Blockchain verification error:", error);
      return null;
    }
  };

  const answer_query_no_face_search = async (cam, prompt) => {
    console.log("STARTING ANSWER QUERY NO FACE SEARCH");
    console.log("CAM DATA:", cam);
    console.log("PROMPT:", prompt);

    if (!cam || !prompt) {
      console.error("ERROR: cam or prompt is undefined");
      return { error: "Invalid input data" };
    }

    try {
      const response = await fetch('/api/answer_query_no_face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cam: cam, prompt: prompt })
      });

      const data = await response.json();

      console.log("RESPONSE DATA:", data);
      
      // Create blockchain verification for AI analysis
      if (data.response) {
        await createBlockchainVerification(
          cam.uid || 'unknown',
          `Query: "${prompt}" | Result: "${data.response.substring(0, 200)}..."`,
          'ai_query_analysis'
        );
      }
      
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return { error: "Request failed" };
    }
  };

  const verify_camera_avs = async (image_url) => {

    //fetch http://localhost:4003/task/execute

    const response = await fetch('http://localhost:4003/task/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "image_url": image_url })
    });

    const data = await response.json();

    console.log(data)

    return data

  }


  const analyzeCCTVUrl = async () => {
    if (!webpageUrl) {
      toast.error('Please enter a webpage URL', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch("/api/analyze_cctv_url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webpageUrl }),
      });

      const data = await response.json();

      // Handle validation errors for .m3u8 streams
      if (!response.ok) {
        if (data.error) {
          toast.error(data.error, {
            position: "top-right",
            autoClose: 5000,
            theme: "dark",
          });
        } else {
          toast.error('Failed to validate stream', {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
          });
        }
        return;
      }

      if (data.success && data.stream_urls && data.stream_urls.length > 0) {
        setExtractedStreams(data.stream_urls);
        setSelectedStreamUrl(data.stream_urls[0]); // Auto-select first stream
        setNewCamUrl(data.stream_urls[0]); // Set as camera URL
        
        // Show detailed success message
        let successMsg = `Found ${data.stream_urls.length} stream(s)!`;
        if (data.stream_type) {
          successMsg += ` (${data.stream_type})`;
        }
        if (data.validated) {
          successMsg += ' ✓ Validated';
        }
        
        toast.success(successMsg, {
          position: "top-right",
          autoClose: 4000,
          theme: "dark",
        });

        // Show additional info message if available
        if (data.message) {
          console.log(`Stream info: ${data.message}`);
        }
      } else {
        toast.error(data.error || 'No streams found on this webpage', {
          position: "top-right",
          autoClose: 4000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error analyzing CCTV URL:", error);
      toast.error(`Failed to analyze URL: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addNewCamera = async () => {
    if (!selectedStreamUrl) {
      toast.error('Please analyze a URL and select a stream first', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    const newCamUid = Math.floor(Math.random() * 1000000);

    console.log("Adding new camera:", newCamUid, newCamCoords, selectedStreamUrl, newCamDesc);

    await fetch("/api/add_camera", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: String(newCamUid),
        location: newCamCoords,
        image_url: selectedStreamUrl, // Store the stream URL
        description: newCamDesc,
        txHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        ipId: "0x0000000000000000000000000000000000000000",
        tokenId: 0,
        CID: "placeholder_cid"
      }),
    });

    toast.success('Camera stream added successfully!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    
    // Reset form
    setShowPopup(false);
    setWebpageUrl("");
    setExtractedStreams([]);
    setSelectedStreamUrl("");
    setNewCamCoords("");
    setNewCamDesc("");
    
    // Refresh camera list
    const response = await fetch('/api/get_all_cameras');
    const data = await response.json();
    setAllCams(data);
  };

  const addNewEmailUpdate = async () => {
    console.log("Adding new email update:", newCamID, newCamEmail);

    await fetch("/api/add_email_update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        camID: newCamID,
        email: newCamEmail,
      }),
    });

    SetshowUpdatesPopup(false);
  }

  // return (
  //   <div>

  //     <DynamicWidget />
  //     <TestComponent />

  //   </div>
  // )
  if (state === 'home' || state === 'loading') {
    return (
      <div className="h-screen bg-black overflow-hidden font-mono">
        <div className="crt-screen fixed inset-0 pointer-events-none"></div>

        {/* Wallet Display Header */}
        <div className='bg-black border-b border-green-500/30 p-3 flex justify-between items-center'>
          <div className="text-green-500 text-xs font-mono flex items-center">
            <span className="mr-2">●</span>
            <span>CONNECTED: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            <span className="ml-4 text-green-400">| SUI TESTNET</span>
          </div>
          <button
            onClick={handleDisconnect}
            className="text-red-500 hover:text-red-400 text-xs border border-red-500 px-3 py-1 rounded"
          >
            [DISCONNECT]
          </button>
        </div>

        <div className="relative h-full text-green-500 p-8 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
          {bootSequence.slice(0, currentBootStep).map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`text-xs ${idx >= 2 && idx <= 30 ? 'text-green-500 whitespace-pre' : 'text-green-500'}`}
            >
              {typeof line === 'string' ? line : line}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: bootSequence.length * 0.235 }}
          >


            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8"
            >


              <div className="flex items-center text-3xl">
                <span className="mr-2">{'>'}</span>
                {!query && <span className="animate-blink">▌</span>}
                <input
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-transparent border-none focus:outline-none text-green-500 caret-green-500 placeholder-gray-500"
                  placeholder="ENTER SEARCH PARAMETERS..."
                />
              </div>
            </motion.div>
          </motion.div>

          <div className='absolute top-4 right-4'>
            <button
              onClick={() => setShowPopup(true)}
              className=" text-green-500 hover:text-green-400 underline underline-offset-4 decoration-dashed"
            >
              [INIT-CAMERA-PROTOCOL]
            </button>
            <button
              onClick={() => setState("cctv")}
              className=" text-green-500 hover:text-green-400 underline underline-offset-4 decoration-dashed"
            >
              [OPEN-CCTV]
            </button>
            <button
              onClick={() => setState("blockchain")}
              className=" text-green-500 hover:text-green-400 underline underline-offset-4 decoration-dashed"
            >
              [BLOCKCHAIN-VERIFY]
            </button>
            <button
              onClick={() => setState("agent")}
              className=" text-green-500 hover:text-green-400 underline underline-offset-4 decoration-dashed"
            >
              [AI-ORCHESTRATOR] 🤖
            </button>
            <button
              onClick={() => setState("uber_flow")}
              className=" text-green-500 hover:text-green-400 underline underline-offset-4 decoration-dashed"
            >
              [UBER-COURT-FLOW] 🚗
            </button>
            <button
              onClick={() => SetshowUpdatesPopup(true)}
              className=" text-green-500 hover:text-green-400 underline underline-offset-4 decoration-dashed"
            >
              [GET-UPDATES]
            </button>
          </div>




          {showPopup && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
              <div className="bg-black p-8 border-2 border-green-500 w-[600px] shadow-glow max-h-[80vh] overflow-y-auto">
                <div className="text-lg mb-4">[INIT CAMERA PROTOCOL]</div>
                
                {/* Step 1: Analyze Webpage URL */}
                <div className="mb-6 pb-4 border-b border-green-500/30">
                  <div className="text-sm text-green-400 mb-2">STEP 1: EXTRACT STREAM URL</div>
                  <TerminalInput
                    label="WEBPAGE URL"
                    value={webpageUrl}
                    onChange={(e) => setWebpageUrl(e.target.value)}
                    placeholder="https://example.com/cctv-feed"
                  />
                  <button
                    onClick={analyzeCCTVUrl}
                    disabled={isAnalyzing}
                    className="text-green-500 hover:text-green-400 border border-green-500 px-4 py-2 mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? '[ANALYZING...]' : '[ANALYZE URL]'}
                  </button>
                </div>

                {/* Step 2: Select Stream */}
                {extractedStreams.length > 0 && (
                  <div className="mb-6 pb-4 border-b border-green-500/30">
                    <div className="text-sm text-green-400 mb-2">STEP 2: SELECT STREAM</div>
                    <div className="text-xs text-green-500 mb-2">Found {extractedStreams.length} stream(s):</div>
                    {extractedStreams.map((streamUrl, index) => (
                      <div key={index} className="mb-2">
                        <label className="flex items-center space-x-2 cursor-pointer hover:text-green-400">
                          <input
                            type="radio"
                            name="stream"
                            value={streamUrl}
                            checked={selectedStreamUrl === streamUrl}
                            onChange={() => {
                              setSelectedStreamUrl(streamUrl);
                              setNewCamUrl(streamUrl);
                            }}
                            className="form-radio text-green-500"
                          />
                          <span className="text-xs break-all">{streamUrl}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 3: Camera Details */}
                {selectedStreamUrl && (
                  <div className="mb-6">
                    <div className="text-sm text-green-400 mb-2">STEP 3: CAMERA DETAILS</div>
                    <TerminalInput
                      label="COORDINATES"
                      value={newCamCoords}
                      onChange={(e) => setNewCamCoords(e.target.value)}
                      placeholder="FORMAT: XX.XXXX,YY.YYYY"
                    />
                    <TerminalInput
                      label="DESCRIPTION"
                      value={newCamDesc}
                      onChange={(e) => setNewCamDesc(e.target.value)}
                      placeholder="Camera location or description"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      setWebpageUrl("");
                      setExtractedStreams([]);
                      setSelectedStreamUrl("");
                      setNewCamCoords("");
                      setNewCamDesc("");
                    }}
                    className="text-red-500 hover:text-red-400 border border-red-500 px-4 py-2"
                  >
                    [ABORT]
                  </button>
                  {selectedStreamUrl && (
                    <button
                      onClick={addNewCamera}
                      className="text-green-500 hover:text-green-400 border border-green-500 px-4 py-2"
                    >
                      [COMMIT]
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {showUpdatesPopup && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
              <div className="bg-black p-8 border-2 border-green-500 w-[500px] shadow-glow">
                <div className="text-lg mb-4">[GET UPDATES]</div>
                <TerminalInput
                  label="CAM-ID"
                  value={newCamID}
                  onChange={(e) => setNewCamID(e.target.value)}
                />
                <TerminalInput
                  label="EMAIL TO RECIEVE UPDATES"
                  value={newCamEmail}
                  onChange={(e) => setNewCamEmail(e.target.value)}
                />
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => SetshowUpdatesPopup(false)}
                    className="text-red-500 hover:text-red-400 border border-red-500 px-4 py-2"
                  >
                    [ABORT]
                  </button>
                  <button
                    onClick={addNewEmailUpdate}
                    className="text-green-500 hover:text-green-400 border border-green-500 px-4 py-2"
                  >
                    [COMMIT]
                  </button>
                </div>
              </div>
            </div>
          )}

          {state === 'loading' && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
              <div className="bg-black p-8 border-2 border-green-500 w-[500px] shadow-glow">
                <div className="text-lg mb-4">[INITIALIZING CAMERA PROTOCOL]</div>

                {/* Loading status lines */}
                <div className="space-y-4 text-green-500">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <span>Finding relevant cameras....</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <span>Querying camera vectors....</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <span>Augmenting query response...</span>
                  </div>
                </div>

                <div className="mt-6 text-xs text-green-500/80">
                  System Status: Initializing neural network overlay...
                </div>
              </div>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

      </div>
    );
  }

  if (state === 'cctv') {
    return (
      <CCTVGrid onBack={() => setState('home')} />
    );
  }

  if (state === 'blockchain') {
    return (
      <BlockchainPanel onBack={() => setState('home')} />
    );
  }

  if (state === 'agent') {
    return (
      <AgentOrchestrator onBack={() => setState('home')} />
    );
  }

  if (state === 'uber_flow') {
    return (
      <UberCourtFlow onBack={() => setState('home')} />
    );
  }

  if (state === 'map') {
    return (
      <div className="h-screen bg-black overflow-hidden font-mono">
        {/* Wallet Display Header */}
        <div className='bg-black border-b border-green-500/30 p-3 flex justify-between items-center z-50'>
          <div className="text-green-500 text-xs font-mono flex items-center">
            <span className="mr-2">●</span>
            <span>CONNECTED: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            <span className="ml-4 text-green-400">| SUI TESTNET</span>
          </div>
          <button
            onClick={handleDisconnect}
            className="text-red-500 hover:text-red-400 text-xs border border-red-500 px-3 py-1 rounded"
          >
            [DISCONNECT]
          </button>
        </div>

        <CyberMap
          allCams={allCams}
          query_found_res={query_found_res}
          query_found_cam={query_found_cam || null}
        />
      </div>
    )
  }
}

export default App;