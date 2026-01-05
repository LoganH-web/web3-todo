import { useState } from 'react';
import { NETWORK_EXPLORERS } from '../config';

/**
 * Custom hook for managing transaction history
 * Tracks recent blockchain transactions with explorer links
 */
export function useTransactionHistory(currentNetwork) {
  const [transactionHistory, setTransactionHistory] = useState([]);

  const addTransaction = (txHash, type, description) => {
    const chainId = currentNetwork?.chainIdDecimal;
    const explorer = chainId ? NETWORK_EXPLORERS[chainId] : null;
    const explorerLink = explorer && explorer.tx ? explorer.tx(txHash) : null;
    
    const newTransaction = {
      hash: txHash,
      type,
      description,
      timestamp: new Date().toISOString(),
      explorerLink,
      explorerName: explorer?.name || 'Explorer',
    };
    
    setTransactionHistory(prev => [newTransaction, ...prev].slice(0, 10)); // Keep last 10
  };

  const clearHistory = () => {
    setTransactionHistory([]);
  };

  return {
    transactionHistory,
    addTransaction,
    clearHistory,
  };
}

