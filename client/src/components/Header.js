import React from 'react';

/**
 * Header Component
 * Displays app title, dark mode toggle, and wallet connection UI
 */
export function Header({ 
  account, 
  currentNetwork, 
  onConnect, 
  isConnecting,
  isDarkMode,
  onToggleDarkMode 
}) {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Web3 To‑Do</h1>
        {/* Dark Mode Toggle - Below Title */}
        <button 
          className="dark-mode-toggle" 
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="dark-mode-icon">{isDarkMode ? '☀️' : '🌙'}</span>
        </button>
      </div>
      
      {/* Wallet Connection */}
      <div className="wallet">
        {account ? (
          <div className="account-info">
            <span className="account">{account}</span>
            {currentNetwork && (
              <span className="network-badge">{currentNetwork.name}</span>
            )}
          </div>
        ) : (
          <button 
            className="connect" 
            onClick={onConnect}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  );
}

