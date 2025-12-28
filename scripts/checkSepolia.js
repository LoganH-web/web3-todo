// Usage: node scripts/checkSepolia.js <contractAddress>
// Requires SEPOLIA_URL in environment

const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  const addr = process.argv[2];
  if (!addr) {
    console.error('Provide contract address as first arg.');
    process.exit(1);
  }
  const url = process.env.SEPOLIA_URL;
  if (!url) {
    console.error('Set SEPOLIA_URL in .env to a Sepolia RPC URL (Alchemy/Infura).');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(url);
  try {
    const net = await provider.getNetwork();
    console.log('Connected network:', net);
  } catch (e) {
    console.error('Could not connect to provider:', e.message || e);
    process.exit(2);
  }

  try {
    const code = await provider.getCode(addr);
    if (!code || code === '0x') {
      console.log('No contract code found at address', addr);
    } else {
      console.log('Contract code exists at', addr, '(length:', code.length, ')');
    }
  } catch (e) {
    console.error('Error fetching code:', e.message || e);
    process.exit(3);
  }
}

main();
