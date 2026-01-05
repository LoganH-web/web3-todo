import React from 'react';
import { useWeb3 } from './hooks/useWeb3';
import { useContract } from './hooks/useContract';
import { useTransactionHistory } from './hooks/useTransactionHistory';
import { useDarkMode } from './hooks/useDarkMode';
import { Header } from './components/Header';
import { NetworkWarning } from './components/NetworkWarning';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TransactionHistory } from './components/TransactionHistory';
import './App.css';

/**
 * Main App Component
 * Orchestrates Web3 connection, contract interactions, and UI components
 */
function App() {
  // Dark mode theme management
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Web3 wallet and provider management
  const {
    account,
    etherProvider,
    signer,
    currentNetwork,
    contractAddress,
    networkWarning,
    isConnecting,
    connectWallet,
    refreshNetwork,
  } = useWeb3();

  // Smart contract interactions
  const {
    todos,
    loading,
    txPending,
    addPending,
    togglingId,
    deletingId,
    error,
    setError,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useContract(contractAddress, etherProvider, signer, account);

  // Transaction history tracking
  const { transactionHistory, addTransaction } = useTransactionHistory(currentNetwork);

  // Handle add todo with transaction tracking
  const handleAddTodo = async (title, description, dueDate) => {
    const result = await addTodo(title, description, dueDate, (txHash) => {
      addTransaction(txHash, 'Create Task', `Created task: "${title}"`);
    });
    return result;
  };

  // Handle toggle todo with transaction tracking
  const handleToggleTodo = async (id) => {
    const task = todos.find(t => t.id === id);
    const result = await toggleTodo(id, (txHash) => {
      addTransaction(txHash, 'Toggle Task', `Toggled task #${id}: "${task?.title || 'Unknown'}"`);
    });
    return result;
  };

  // Handle delete todo with transaction tracking
  const handleDeleteTodo = async (id) => {
    const task = todos.find(t => t.id === id);
    const result = await deleteTodo(id, (txHash) => {
      addTransaction(txHash, 'Delete Task', `Deleted task #${id}: "${task?.title || 'Unknown'}"`);
    });
    return result;
  };

  return (
    <div className="app-container">
      <Header
        account={account}
        currentNetwork={currentNetwork}
        onConnect={connectWallet}
        isConnecting={isConnecting}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="main">
        <NetworkWarning
          warning={networkWarning}
          error={error}
          account={account}
          onRefresh={refreshNetwork}
        />

        <TodoForm
          onSubmit={handleAddTodo}
          account={account}
          disabled={addPending || txPending}
        />

        <TodoList
          todos={todos}
          loading={loading}
          account={account}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          togglingId={togglingId}
          deletingId={deletingId}
          disabled={addPending}
        />

        <TransactionHistory transactions={transactionHistory} />
      </main>
    </div>
  );
}

export default App;
