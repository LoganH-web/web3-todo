// Network configuration for multi-network support

export const NETWORKS = {
  LOCALHOST: {
    chainId: '0x7a69', // 31337 in hex
    chainIdDecimal: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
    contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Update with your local deployment
    blockExplorer: null,
  },
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainIdDecimal: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    contractAddress: '0x423C92F031706E8500858C1C42e6C47FF50F06e6',  //0xF74fce4b6c1eBb922435d427e21Fb85A6042ee64 - old contract address before ownership logic
    blockExplorer: 'https://sepolia.etherscan.io',
  },
};

// Get network configuration by chainId
export function getNetworkByChainId(chainId) {
  const chainIdHex = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
  
  for (const [key, network] of Object.entries(NETWORKS)) {
    if (network.chainId === chainIdHex || network.chainIdDecimal === parseInt(chainId, 16)) {
      return network;
    }
  }
  
  return null;
}

// Get contract address for current network
export function getContractAddress(chainId) {
  const network = getNetworkByChainId(chainId);
  return network ? network.contractAddress : null;
}

// Check if network is supported
export function isSupportedNetwork(chainId) {
  return getNetworkByChainId(chainId) !== null;
}

// Get all supported network names
export function getSupportedNetworks() {
  return Object.values(NETWORKS).map(n => n.name);
}

// Default to Sepolia for production
export const DEFAULT_NETWORK = NETWORKS.SEPOLIA;

