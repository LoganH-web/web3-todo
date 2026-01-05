/**
 * Utility functions for formatting blockchain data
 */

/**
 * Format Ethereum address to abbreviated form (0x1234...5678)
 * @param {string} address - Full Ethereum address
 * @returns {string} Abbreviated address
 */
export function formatAddress(address) {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Format Unix timestamp to readable date with status
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {object|null} Date info with text, status, and badge
 */
export function formatDueDate(timestamp) {
  if (!timestamp || timestamp === 0) return null;
  
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffDays = Math.ceil((dueDay - today) / (1000 * 60 * 60 * 24));
  
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
  
  if (diffDays < 0) {
    return { text: dateStr, status: 'overdue', badge: `${Math.abs(diffDays)}d overdue` };
  } else if (diffDays === 0) {
    return { text: dateStr, status: 'today', badge: 'Due today' };
  } else if (diffDays === 1) {
    return { text: dateStr, status: 'tomorrow', badge: 'Due tomorrow' };
  } else if (diffDays <= 7) {
    return { text: dateStr, status: 'soon', badge: `Due in ${diffDays}d` };
  } else {
    return { text: dateStr, status: 'future', badge: `Due in ${diffDays}d` };
  }
}

/**
 * Check if task is owned by current user
 * @param {string} taskOwner - Task owner address
 * @param {string} currentAccount - Current user's address
 * @returns {boolean} True if task belongs to current user
 */
export function isMyTask(taskOwner, currentAccount) {
  if (!currentAccount || !taskOwner) return false;
  return taskOwner.toLowerCase() === currentAccount.toLowerCase();
}

/**
 * Format timestamp to time string
 * @param {string} isoTimestamp - ISO timestamp string
 * @returns {string} Formatted time string
 */
export function formatTime(isoTimestamp) {
  return new Date(isoTimestamp).toLocaleTimeString();
}

