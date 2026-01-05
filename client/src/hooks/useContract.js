import { useState, useEffect, useRef, useCallback } from 'react';
import { ethers } from 'ethers';
import { TODOLIST_ABI } from '../config';

/**
 * Custom hook for managing smart contract interactions
 * Handles contract instance creation, event listeners, and transaction state
 */
export function useContract(contractAddress, etherProvider, signer, account) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [addPending, setAddPending] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  
  const eventListenersRef = useRef([]);

  // Create contract instance
  const getContractInstance = useCallback((providerOrSigner, address = contractAddress) => {
    if (!providerOrSigner || !address) return null;
    return new ethers.Contract(address, TODOLIST_ABI, providerOrSigner);
  }, [contractAddress]);

  // Fetch todos from blockchain
  const fetchTodos = useCallback(async (p = etherProvider, s = signer, addr = contractAddress) => {
    setLoading(true);
    try {
      const readProvider = p || etherProvider;
      if (!readProvider || !addr) {
        setTodos([]);
        return;
      }

      const providerForRead = (s && s.provider) || readProvider;
      const contract = getContractInstance(providerForRead, addr);
      if (!contract) {
        setTodos([]);
        return;
      }

      const allTodos = await contract.getAllTasks();
      const formattedTodos = allTodos.map(t => ({
        id: t[0].toString(),
        title: t[1],
        description: t[2],
        completed: t[3],
        dueDate: t[4] ? Number(t[4]) : 0,
        owner: t[5] || '',
      }));
      setTodos(formattedTodos);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [etherProvider, signer, contractAddress, getContractInstance]);

  // Cleanup event listeners
  const cleanupEventListeners = useCallback(() => {
    eventListenersRef.current.forEach(({ contract, eventName, listener }) => {
      try {
        contract.off(eventName, listener);
      } catch (e) {
        console.warn('Failed to remove event listener:', e);
      }
    });
    eventListenersRef.current = [];
  }, []);

  // Setup event listeners
  const setupEventListeners = useCallback((contract) => {
    if (!contract) return;

    cleanupEventListeners();

    console.log('Setting up event listeners for real-time updates...');

    // TaskCreated event
    const onTaskCreated = (id, title, description, dueDate, owner, event) => {
      console.log('📝 TaskCreated event:', { id: id.toString(), title, description, dueDate: dueDate.toString(), owner });
      setTodos(prevTodos => [...prevTodos, {
        id: id.toString(),
        title,
        description,
        completed: false,
        dueDate: dueDate ? Number(dueDate) : 0,
        owner: owner || '',
      }]);
    };

    // TaskCompleted event
    const onTaskCompleted = (id, completed, event) => {
      console.log('✓ TaskCompleted event:', { id: id.toString(), completed });
      setTodos(prevTodos => prevTodos.map(todo =>
        todo.id === id.toString() ? { ...todo, completed } : todo
      ));
    };

    // TaskDeleted event
    const onTaskDeleted = (id, event) => {
      console.log('🗑️ TaskDeleted event:', { id: id.toString() });
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id.toString()));
    };

    contract.on('TaskCreated', onTaskCreated);
    contract.on('TaskCompleted', onTaskCompleted);
    contract.on('TaskDeleted', onTaskDeleted);

    eventListenersRef.current = [
      { contract, eventName: 'TaskCreated', listener: onTaskCreated },
      { contract, eventName: 'TaskCompleted', listener: onTaskCompleted },
      { contract, eventName: 'TaskDeleted', listener: onTaskDeleted },
    ];

    console.log('✓ Event listeners active');
  }, [cleanupEventListeners]);

  // Add todo
  const addTodo = useCallback(async (title, description, dueDate, onSuccess) => {
    setError(null);
    if (!signer || !etherProvider) {
      setError('Connect your wallet before adding a todo.');
      return;
    }
    if (!contractAddress) {
      setError('Contract address not available. Please switch to a supported network.');
      return;
    }
    if (!title || title.trim() === '') {
      setError('Please enter a title for the todo.');
      return;
    }

    try {
      setAddPending(true);
      setTxPending(true);
      const contract = getContractInstance(signer, contractAddress);
      if (!contract) throw new Error('Contract not initialized');
      
      let dueDateTimestamp = 0;
      if (dueDate) {
        const selectedDate = new Date(dueDate);
        dueDateTimestamp = Math.floor(selectedDate.getTime() / 1000);
      }
      
      const tx = await contract.createTask(title.trim(), description || '', dueDateTimestamp);
      console.log('Transaction sent:', tx.hash);
      
      if (onSuccess) {
        onSuccess(tx.hash);
      }
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);
      
      setTimeout(() => {
        fetchTodos(etherProvider, signer, contractAddress);
      }, 2000);
      
      return { success: true, txHash: tx.hash };
    } catch (err) {
      console.error('Add todo failed', err);
      setError(parseError(err));
      return { success: false, error: parseError(err) };
    } finally {
      setAddPending(false);
      setTxPending(false);
    }
  }, [signer, etherProvider, contractAddress, getContractInstance, fetchTodos]);

  // Toggle todo
  const toggleTodo = useCallback(async (id, onSuccess) => {
    setError(null);
    if (!signer || !etherProvider) {
      setError('Connect your wallet before toggling tasks.');
      return;
    }
    if (!contractAddress) {
      setError('Contract address not available. Please switch to a supported network.');
      return;
    }

    try {
      setTogglingId(id);
      setTxPending(true);
      const contract = getContractInstance(signer, contractAddress);
      if (!contract) throw new Error('Contract not initialized');
      
      const tx = await contract.toggleTaskCompletion(id);
      console.log('Toggle transaction sent:', tx.hash);
      
      if (onSuccess) {
        onSuccess(tx.hash);
      }
      
      await tx.wait();
      console.log('Toggle transaction confirmed');
      
      setTimeout(() => {
        fetchTodos(etherProvider, signer, contractAddress);
      }, 2000);
      
      return { success: true, txHash: tx.hash };
    } catch (err) {
      console.error('Toggle todo failed', err);
      setError(parseError(err));
      return { success: false, error: parseError(err) };
    } finally {
      setTogglingId(null);
      setTxPending(false);
    }
  }, [signer, etherProvider, contractAddress, getContractInstance, fetchTodos]);

  // Delete todo
  const deleteTodo = useCallback(async (id, onSuccess) => {
    setError(null);
    if (!signer || !etherProvider) {
      setError('Connect your wallet before deleting tasks.');
      return;
    }
    if (!contractAddress) {
      setError('Contract address not available. Please switch to a supported network.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this task?')) {
      return { success: false, cancelled: true };
    }

    try {
      setDeletingId(id);
      setTxPending(true);
      const contract = getContractInstance(signer, contractAddress);
      if (!contract) throw new Error('Contract not initialized');
      
      const tx = await contract.deleteTask(id);
      console.log('Delete transaction sent:', tx.hash);
      
      if (onSuccess) {
        onSuccess(tx.hash);
      }
      
      await tx.wait();
      console.log('Delete transaction confirmed');
      
      setTimeout(() => {
        fetchTodos(etherProvider, signer, contractAddress);
      }, 2000);
      
      return { success: true, txHash: tx.hash };
    } catch (err) {
      console.error('Delete todo failed', err);
      setError(parseError(err));
      return { success: false, error: parseError(err) };
    } finally {
      setDeletingId(null);
      setTxPending(false);
    }
  }, [signer, etherProvider, contractAddress, getContractInstance, fetchTodos]);

  // Parse error messages
  function parseError(error) {
    if (!error) return 'An unknown error occurred.';
    
    if (
      error.code === 'ACTION_REJECTED' || 
      error.code === 4001 ||
      error.message?.includes('user rejected') ||
      error.message?.includes('User denied') ||
      error.message?.includes('user denied')
    ) {
      return 'Transaction cancelled by user.';
    }
    
    if (
      error.code === 'INSUFFICIENT_FUNDS' ||
      error.message?.includes('insufficient funds')
    ) {
      return 'Insufficient funds to complete transaction.';
    }
    
    if (error.message?.includes('Only task owner')) {
      return error.message;
    }
    
    if (error.message && error.message.length < 100 && !error.message.includes('{')) {
      return error.message;
    }
    
    return 'Transaction failed. Please try again.';
  }

  // Fetch todos when dependencies change
  useEffect(() => {
    if (etherProvider && contractAddress) {
      fetchTodos(etherProvider, signer, contractAddress);
      
      const contract = getContractInstance(etherProvider, contractAddress);
      if (contract) {
        setupEventListeners(contract);
      }
    }

    return () => {
      cleanupEventListeners();
    };
  }, [etherProvider, signer, contractAddress, fetchTodos, getContractInstance, setupEventListeners, cleanupEventListeners]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupEventListeners();
    };
  }, [cleanupEventListeners]);

  return {
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
    fetchTodos,
  };
}

