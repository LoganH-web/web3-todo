import React from 'react';
import { formatAddress, formatTime } from '../utils/formatters';

/**
 * TransactionHistory Component
 * Displays recent blockchain transactions with explorer links
 */
export function TransactionHistory({ transactions }) {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <section className="transaction-history">
      <h2>📜 Recent Transactions</h2>
      <div className="transaction-list">
        {transactions.map((tx, index) => (
          <div key={index} className="transaction-item">
            <div className="transaction-info">
              <span className="transaction-type">{tx.type}</span>
              <span className="transaction-desc">{tx.description}</span>
              <span className="transaction-time">
                {formatTime(tx.timestamp)}
              </span>
            </div>
            <div className="transaction-link">
              <code className="transaction-hash">{formatAddress(tx.hash)}</code>
              {tx.explorerLink && (
                <a 
                  href={tx.explorerLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="explorer-link"
                >
                  View on {tx.explorerName} ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

