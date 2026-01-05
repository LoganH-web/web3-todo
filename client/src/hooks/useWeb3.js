import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { getNetworkByChainId, getSupportedNetworks } from '../networks';

/**
 * Custom hook for managing Web3 wallet connection and provider
 * Handles wallet connection, account changes, and network switching
 */
export function useWeb3() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [etherProvider, setEtherProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [networkWarning, setNetworkWarning] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Helper: Find available Ethereum provider
  async function findProvider() {
    if (window.ethereum && window.ethereum.providers && window.ethereum.providers.length) {
      return window.ethereum.providers[0];
    }

    const detected = await detectEthereumProvider().catch(() => null);
    if (detected) return detected;

    if (window.ethereum) return window.ethereum;
    return null;
  }

  // Detect and validate network
  async function detectAndValidateNetwork(ethP) {
    try {
      const network = await ethP.getNetwork();
      const chainId = network.chainId;
      console.log('Detected network chainId:', chainId);
      
      const networkConfig = getNetworkByChainId(Number(chainId));
      console.log('Network config found:', networkConfig);
      
      setCurrentNetwork(networkConfig);
      
      if (!networkConfig) {
        const supportedNets = getSupportedNetworks().join(', ');
        setNetworkWarning(`⚠️ Unsupported network detected. Please switch to: ${supportedNets}`);
        setContractAddress(null);
        return null;
      }
      
      setNetworkWarning(null);
      setContractAddress(networkConfig.contractAddress);
      console.log(`✅ Connected to ${networkConfig.name} (Chain ID: ${chainId})`);
      console.log(`Contract Address: ${networkConfig.contractAddress}`);
      
      return networkConfig;
    } catch (err) {
      console.error('Network detection failed:', err);
      const supportedNets = getSupportedNetworks().join(', ');
      setNetworkWarning(`⚠️ Unable to detect network. Please ensure wallet is connected and try refreshing. Supported: ${supportedNets}`);
      setCurrentNetwork(null);
      setContractAddress(null);
      return null;
    }
  }

  // Connect wallet
  async function connectWallet() {
    const p = await findProvider();
    if (!p) {
      alert('No wallet provider detected. Install MetaMask and reload the page.');
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await p.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setProvider(p);

      const ethP = new ethers.BrowserProvider(p);
      setEtherProvider(ethP);
      
      const networkConfig = await detectAndValidateNetwork(ethP);
      
      if (networkConfig) {
        try {
          const ethS = await ethP.getSigner();
          setSigner(ethS);
        } catch (err) {
          console.warn('Could not get signer:', err);
        }
      }
    } catch (err) {
      console.error('Wallet connection failed', err);
    } finally {
      setIsConnecting(false);
    }
  }

  // Refresh network connection
  async function refreshNetwork() {
    console.log('Manually refreshing network...');
    
    const p = provider || await findProvider();
    if (!p) {
      setNetworkWarning('No wallet provider detected.');
      return;
    }

    try {
      const currentChainId = await p.request({ method: 'eth_chainId' });
      console.log('Current chainId:', currentChainId);
      
      const ethP = new ethers.BrowserProvider(p);
      setEtherProvider(ethP);
      
      const networkConfig = await detectAndValidateNetwork(ethP);
      
      if (networkConfig) {
        try {
          const ethS = await ethP.getSigner();
          setSigner(ethS);
          console.log('✅ Network refreshed successfully');
        } catch (err) {
          console.warn('Could not get signer:', err);
          setNetworkWarning('Failed to get signer. Please ensure your wallet is unlocked.');
        }
      } else {
        setNetworkWarning('Unsupported network. Please switch to Localhost or Sepolia.');
      }
    } catch (err) {
      console.error('Network refresh failed:', err);
      setNetworkWarning('Failed to refresh network. Please try again.');
    }
  }

  // Initialize on mount
  useEffect(() => {
    let mounted = true;
    let p = null;
    let accountsHandler = null;
    let chainChangedHandler = null;

    (async () => {
      p = await findProvider();
      if (!mounted) return;
      setProvider(p);

      if (p && p.selectedAddress) setAccount(p.selectedAddress);

      if (p) {
        const ethP = new ethers.BrowserProvider(p);
        setEtherProvider(ethP);
        
        const networkConfig = await detectAndValidateNetwork(ethP);
        
        if (networkConfig) {
          try {
            const ethS = await ethP.getSigner();
            setSigner(ethS);
          } catch (err) {
            console.warn('Could not get signer:', err);
          }
        }
      }

      if (p && p.on) {
        // Listen for account changes
        accountsHandler = async (accounts) => {
          console.log('Accounts changed:', accounts);
          setAccount(accounts[0] || null);
          
          if (accounts.length > 0 && mounted) {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (!mounted) return;
            
            try {
              const ethP = new ethers.BrowserProvider(p);
              setEtherProvider(ethP);
              
              const networkConfig = await detectAndValidateNetwork(ethP);
              
              if (networkConfig) {
                try {
                  const ethS = await ethP.getSigner();
                  setSigner(ethS);
                } catch (err) {
                  console.warn('Could not get signer after account change:', err);
                }
              }
            } catch (err) {
              console.warn('Error handling account change:', err);
            }
          } else if (accounts.length === 0) {
            setSigner(null);
            setContractAddress(null);
            setCurrentNetwork(null);
          }
        };
        p.on('accountsChanged', accountsHandler);

        // Listen for network changes
        chainChangedHandler = async (chainId) => {
          console.log('Network changed to:', chainId);
          if (!mounted) return;
          
          const ethP = new ethers.BrowserProvider(p);
          setEtherProvider(ethP);
          
          const networkConfig = await detectAndValidateNetwork(ethP);
          
          if (networkConfig) {
            try {
              const ethS = await ethP.getSigner();
              setSigner(ethS);
            } catch (err) {
              console.warn('Could not get signer after network change:', err);
            }
          }
        };
        p.on('chainChanged', chainChangedHandler);
      }
    })();

    return () => {
      mounted = false;
      try {
        if (p && p.removeListener) {
          if (accountsHandler) p.removeListener('accountsChanged', accountsHandler);
          if (chainChangedHandler) p.removeListener('chainChanged', chainChangedHandler);
        }
      } catch (e) {
        console.warn('Error cleaning up listeners:', e);
      }
    };
  }, []);

  return {
    account,
    provider,
    etherProvider,
    signer,
    currentNetwork,
    contractAddress,
    networkWarning,
    isConnecting,
    connectWallet,
    refreshNetwork,
  };
}

