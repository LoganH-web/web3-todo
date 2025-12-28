# Web3 To-Do List

A decentralized to-do list application built on Ethereum blockchain, combining Solidity smart contracts with a modern React frontend. This project demonstrates blockchain integration for persistent, immutable task management.

![Web3 To-Do](https://img.shields.io/badge/Web3-Blockchain-blue)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.0-363636)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![Hardhat](https://img.shields.io/badge/Hardhat-2.22.6-yellow)

## 🚀 Features

- **Decentralized Storage**: All tasks are stored on the Ethereum blockchain
- **MetaMask Integration**: Connect your wallet to interact with the dApp
- **Full CRUD Operations**: Create, read, update, and delete tasks on-chain
- **Real-time Updates**: Automatic UI refresh after blockchain transactions
- **Network Switching**: Seamlessly switch between Hardhat local and Sepolia testnet
- **Transaction Status**: Visual feedback during pending transactions
- **Event Emissions**: Smart contract events for all operations
- **Comprehensive Testing**: 40+ unit tests ensuring contract reliability

## 🛠️ Tech Stack

### Smart Contract
- **Solidity**: ^0.8.0
- **Hardhat**: 2.22.6
- **Ethers.js**: ^6.16.0
- **Testing**: Hardhat + Chai

### Frontend
- **React**: 18.x
- **Ethers.js**: ^6.16.0
- **MetaMask**: Wallet provider
- **CSS**: Custom styling

## 📋 Smart Contract Details

### Deployed Addresses

#### Sepolia Testnet
```
Contract Address: 0x5c25BA0202e8581f551e23d5aD13E745E557C644
Network: Sepolia (Chain ID: 11155111)
Explorer: https://sepolia.etherscan.io/address/0x5c25BA0202e8581f551e23d5aD13E745E557C644
```

#### Local Hardhat (Development)
```
Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Network: Hardhat Local (Chain ID: 31337)
```

### Contract Functions

- `createTask(string _title, string _description)`: Create a new task
- `toggleTaskCompletion(uint _id)`: Toggle task completion status
- `deleteTask(uint _id)`: Delete a task by ID
- `getTask(uint _id)`: Retrieve a single task
- `getAllTasks()`: Retrieve all tasks

### Events
- `TaskCreated(uint id, string title, string description)`
- `TaskCompleted(uint id, bool completed)`
- `TaskDeleted(uint id)`

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   React App     │ ◄─────► │   MetaMask       │
│   (Frontend)    │         │   (Web3 Provider)│
└────────┬────────┘         └──────────────────┘
         │
         │ ethers.js
         │
         ▼
┌─────────────────────────────────────────┐
│     Ethereum Blockchain (Sepolia)       │
│  ┌───────────────────────────────────┐  │
│  │   TodoList Smart Contract         │  │
│  │   - Tasks Storage (struct array)  │  │
│  │   - CRUD Operations               │  │
│  │   - Event Emissions               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MetaMask browser extension
- Sepolia testnet ETH (for testnet deployment)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd web3-todo
```

### 2. Install Dependencies

```bash
# Install root dependencies (Hardhat)
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
# OR use Alchemy
# SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

PRIVATE_KEY=your_metamask_private_key_here
```

⚠️ **Never commit your `.env` file to version control!**

### 4. Compile Smart Contracts

```bash
npx hardhat compile
```

### 5. Run Tests

```bash
npx hardhat test
```

Expected output: All 40+ tests should pass ✓

### 6. Deploy Smart Contract

#### Deploy to Local Hardhat Network

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.js --network localhost
```

#### Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Copy the deployed contract address and update `client/src/config.js`:

```javascript
export const TODOLIST_CONTRACT_ADDRESS = 'YOUR_DEPLOYED_ADDRESS_HERE';
```

### 7. Start Frontend

```bash
cd client
npm start
```

The app will open at `http://localhost:3000`

## 🎯 How to Use

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection request
- Ensure you're on the correct network (Sepolia or Hardhat Local)

### 2. Create a Task
- Enter a task title (required)
- Add an optional description
- Click "Add Todo"
- Approve the transaction in MetaMask
- Wait for blockchain confirmation

### 3. Toggle Task Completion
- Click "Mark Done" on any pending task
- Approve the transaction
- Task status updates after confirmation

### 4. View All Tasks
- All tasks are automatically fetched from the blockchain
- Completed tasks show a ✓ status
- Each task displays its unique ID

## 📂 Project Structure

```
web3-todo/
├── contracts/
│   ├── TodoList.sol           # Main smart contract
│   └── Hello.sol              # Initial example contract
├── scripts/
│   ├── deploy.js              # Deployment script
│   └── checkSepolia.js        # Network verification
├── test/
│   └── TodoList.test.js       # Comprehensive test suite
├── client/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Styling
│   │   ├── config.js          # Contract config & ABI
│   │   └── index.js           # React entry point
│   ├── public/
│   └── package.json
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Root dependencies
├── .env                       # Environment variables (gitignored)
├── README.md                  # This file
└── SPEC.md                    # Project specification
```

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
npx hardhat test
```

### Test Coverage
- ✅ Contract deployment
- ✅ Task creation (CRUD operations)
- ✅ Task completion toggling
- ✅ Task deletion
- ✅ Event emissions
- ✅ Edge cases (empty inputs, invalid IDs)
- ✅ Multiple user interactions
- ✅ Integration workflows

### Test Results
- **40+ test cases**
- **100% function coverage**
- **Edge case handling**
- **Gas optimization validation**

## 🌐 Network Configuration

### Switch to Sepolia in MetaMask
1. Open MetaMask
2. Click network dropdown at the top
3. Select "Sepolia" (enable test networks in Settings if not visible)
4. Ensure you have Sepolia ETH for gas fees

### Get Sepolia Test ETH
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)

## 🔧 Troubleshooting

### Issue: "Network changed" error
**Solution**: Refresh the page after switching networks in MetaMask. The app now auto-detects network changes.

### Issue: Transaction fails
**Solution**: 
- Ensure you have enough ETH for gas fees
- Verify you're on the correct network
- Check that the contract address in `config.js` matches your deployment

### Issue: "Contract not initialized"
**Solution**: 
- Confirm the contract is deployed to the network you're using
- Verify the contract address in `client/src/config.js`
- Check that you've connected your wallet

### Issue: Tasks not loading
**Solution**:
- Ensure MetaMask is connected
- Verify you're on the correct network
- Check browser console for errors
- Refresh the page

## 📈 Future Improvements

- [ ] Add task editing functionality
- [ ] Implement task categories/tags
- [ ] Add due dates and priorities
- [ ] Multi-user task sharing
- [ ] IPFS integration for large descriptions
- [ ] Mobile responsive design
- [ ] Dark mode toggle
- [ ] Gas optimization for batch operations
- [ ] Layer 2 deployment (Polygon, Arbitrum)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built as a learning project to demonstrate:
- Blockchain smart contract development
- Web3 frontend integration
- Decentralized application architecture
- Full-stack blockchain development

## 🔗 Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Documentation](https://docs.metamask.io/)

---

**Built with ❤️ using Solidity, React, and Ethers.js**
