import React from 'react';

/**
 * NetworkWarning Component
 * Displays network-related warnings and errors
 */
export function NetworkWarning({ warning, error, account, onRefresh }) {
  if (!warning && !error) {
    return null;
  }

  return (
    <>
      {warning && (
        <div className="network-warning">
          <span>{warning}</span>
          {account && (
            <button className="refresh-network-btn" onClick={onRefresh}>
              🔄 Refresh Network
            </button>
          )}
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </>
  );
}

