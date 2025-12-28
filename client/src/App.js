import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { TODOLIST_CONTRACT_ADDRESS, TODOLIST_ABI } from './config';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [etherProvider, setEtherProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [txPending, setTxPending] = useState(false);
  const [addPending, setAddPending] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState(null);

  // Helper: create reusable contract instance. Accepts either a provider or a signer.
  function getContractInstance(providerOrSigner) {
    if (!providerOrSigner) return null;
    return new ethers.Contract(TODOLIST_CONTRACT_ADDRESS, TODOLIST_ABI, providerOrSigner);
  }

  // Fetch todos from blockchain
  async function fetchTodos(p = etherProvider, s = signer) {
    setLoading(true);
    try {
      // prefer a read-only provider for fetching to avoid signer-side quirks
      const readProvider = p || etherProvider;
      if (!readProvider) {
        setTodos([]);
        return;
      }

      // If we have a signer, prefer using the signer's provider for consistency
      const providerForRead = (s && s.provider) || readProvider;
      const contract = getContractInstance(providerForRead);
      if (!contract) {
        setTodos([]);
        return;
      }

      const allTodos = await contract.getAllTasks();
      const formattedTodos = allTodos.map(t => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        completed: t.completed,
      }));
      setTodos(formattedTodos);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }

  // Add a new todo (write transaction)
  async function addTodo() {
    setError(null);
    if (!signer || !etherProvider) {
      setError('Connect your wallet before adding a todo.');
      return;
    }
    if (!title || title.trim() === '') {
      setError('Please enter a title for the todo.');
      return;
    }

    try {
      console.debug('addTodo: account, chain, signer', { account, signer });
      if (signer && signer.provider && signer.provider.getNetwork) {
        try {
          const net = await signer.provider.getNetwork();
          console.debug('addTodo: signer provider network', net);
        } catch (e) {
          console.debug('addTodo: could not get signer provider network', e);
        }
      }
      setAddPending(true);
      setTxPending(true);
      const contract = getContractInstance(signer);
      if (!contract) throw new Error('Contract not initialized');
      const tx = await contract.createTask(title.trim(), description || '');
      // Wait for transaction confirmation
      await tx.wait();
      // Clear form
      setTitle('');
      setDescription('');
      // Refresh UI
      await fetchTodos(etherProvider, signer);
    } catch (err) {
      console.error('Add todo failed', err);
      setError(err?.message || 'Transaction failed.');
    } finally {
      setAddPending(false);
      setTxPending(false);
    }
  }

  // Toggle completion status (write transaction)
  async function toggleTodo(id) {
    setError(null);
    if (!signer || !etherProvider) {
      setError('Connect your wallet before toggling tasks.');
      return;
    }

    try {
      setTogglingId(id);
      setTxPending(true);
      const contract = getContractInstance(signer);
      if (!contract) throw new Error('Contract not initialized');
      const tx = await contract.toggleTaskCompletion(id);
      await tx.wait();
      await fetchTodos(etherProvider, signer);
    } catch (err) {
      console.error('Toggle todo failed', err);
      setError(err?.message || 'Transaction failed.');
    } finally {
      setTogglingId(null);
      setTxPending(false);
    }
  }

  // helper: choose any available provider (first usable)
  async function findProvider() {
    if (window.ethereum && window.ethereum.providers && window.ethereum.providers.length) {
      // prefer any provider in the injected providers list
      return window.ethereum.providers[0];
    }

    const detected = await detectEthereumProvider().catch(() => null);
    if (detected) return detected;

    if (window.ethereum) return window.ethereum;
    return null;
  }

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

      // Initialize ethers provider and signer
      if (p) {
        const ethP = new ethers.BrowserProvider(p);
        setEtherProvider(ethP);
        try {
          const ethS = await ethP.getSigner();
          setSigner(ethS);
          // Fetch todos after signer is ready
          await fetchTodos(ethP, ethS);
        } catch (err) {
          console.warn('Could not get signer:', err);
        }
      }

      if (p && p.on) {
        accountsHandler = (accounts) => {
          setAccount(accounts[0] || null);
        };
        p.on('accountsChanged', accountsHandler);

        // Listen for network changes and reinitialize provider/signer
        chainChangedHandler = async (chainId) => {
          console.log('Network changed to:', chainId);
          if (!mounted) return;
          
          // Reinitialize ethers provider and signer
          const ethP = new ethers.BrowserProvider(p);
          setEtherProvider(ethP);
          try {
            const ethS = await ethP.getSigner();
            setSigner(ethS);
            // Fetch todos from the new network
            await fetchTodos(ethP, ethS);
          } catch (err) {
            console.warn('Could not get signer after network change:', err);
            setTodos([]);
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
      } catch (e) {}
    };
  }, []);

  async function connectWallet() {
    // Re-detect provider at click time (handles extension enable/disable)
    const p = await findProvider();
    if (!p) {
      alert('No wallet provider detected. Install a wallet extension and reload the page.');
      return;
    }

    try {
      const accounts = await p.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setProvider(p);

      // log chainId if available
      try {
        const chainId = await p.request({ method: 'eth_chainId' });
        console.debug('connectWallet: chainId', chainId);
      } catch (e) {
        console.debug('connectWallet: could not read chainId', e);
      }

      // Initialize ethers provider and signer
      const ethP = new ethers.BrowserProvider(p);
      setEtherProvider(ethP);
      try {
        const ethS = await ethP.getSigner();
        setSigner(ethS);
        // Fetch todos after signer is ready
        await fetchTodos(ethP, ethS);
      } catch (err) {
        console.warn('Could not get signer:', err);
      }
    } catch (err) {
      console.error('Wallet connection failed', err);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Web3 To‑Do</h1>
        <div className="wallet">
          {account ? (
            <span className="account">{account}</span>
          ) : (
            <button className="connect" onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      </header>

      <main className="main">
        {error && <div className="error">{error}</div>}
        <section className="todo-form">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!account || addPending || !!togglingId}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!account || addPending || !!togglingId}
          />
          <button
            onClick={addTodo}
            disabled={!account || addPending || txPending || !title.trim()}
          >
            {addPending ? 'Adding...' : 'Add Todo'}
          </button>
        </section>

        <section className="todo-list">
          <h2>Your Todos</h2>
          {loading ? (
            <div className="loading"><div className="spinner" /> Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="empty">{account ? 'No todos yet — create one to get started.' : 'No todos yet — connect wallet to interact.'}</div>
          ) : (
            <ul className="todos">
              {todos.map(todo => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-header">
                    <strong>{todo.title}</strong>
                    <span className="todo-id">#{todo.id}</span>
                  </div>
                  <p className="todo-description">{todo.description}</p>
                  <div className="todo-status">
                    <span className={`status ${todo.completed ? 'completed' : 'pending'}`}>
                      {todo.completed ? '✓ Completed' : 'Pending'}
                    </span>
                    <button
                      className="toggle"
                      onClick={() => toggleTodo(todo.id)}
                      disabled={addPending || !!togglingId}
                    >
                      {togglingId === todo.id ? 'Processing...' : todo.completed ? 'Mark Pending' : 'Mark Done'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
