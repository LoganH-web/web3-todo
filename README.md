# Web3 To-Do List

A decentralized to-do list application built on Ethereum blockchain, combining Solidity smart contracts with a modern React frontend. This project demonstrates blockchain integration for persistent, immutable task management.

![Web3 To-Do](https://img.shields.io/badge/Web3-Blockchain-blue)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.0-363636)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![Hardhat](https://img.shields.io/badge/Hardhat-2.22.6-yellow)

## 🚀 Features

### Core Functionality
- **Decentralized Storage**: All tasks are stored on the Ethereum blockchain
- **MetaMask Integration**: Connect your wallet to interact with the dApp
- **Full CRUD Operations**: Create, read, update, and delete tasks on-chain
- **Real-time Updates**: Automatic UI refresh after blockchain transactions via event listeners
- **Network Switching**: Seamlessly switch between Hardhat local and Sepolia testnet
- **Due Dates**: Set optional due dates with visual status indicators (overdue, today, tomorrow, upcoming)
- **Event Emissions**: Smart contract events for all operations
- **Comprehensive Testing**: 40+ unit tests ensuring contract reliability with 100% function coverage


## 🛠️ Tech Stack

### Smart Contract
- **Solidity**: ^0.8.0 with ownership logic and access control
- **Hardhat**: 2.22.6 for development and testing
- **Ethers.js**: ^6.16.0 for blockchain interaction
- **Testing**: Hardhat + Chai with 40+ test cases
- **Gas Optimization**: Swap-and-pop deletion pattern

### Frontend
- **React**: 18.x with modern hooks architecture
- **Ethers.js**: ^6.16.0 for Web3 integration
- **MetaMask**: Wallet provider with event listeners
- **CSS**: Custom styling with CSS variables for theming
- **localStorage**: Theme and preference persistence

### Architecture
- **Custom Hooks**: useWeb3, useContract, useTransactionHistory, useDarkMode
- **Components**: Modular, reusable UI components
- **Utils**: Formatter functions for addresses, dates, times
- **State Management**: React hooks with proper cleanup
- **Event-Driven**: Real-time UI updates via smart contract events

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

- `createTask(string _title, string _description, uint _dueDate)`: Create a new task with optional due date
- `toggleTaskCompletion(uint _id)`: Toggle task completion status (owner only)
- `deleteTask(uint _id)`: Delete a task by ID (owner only)
- `getTask(uint _id)`: Retrieve a single task with all details
- `getAllTasks()`: Retrieve all tasks from all users
- `getUserTasks(address _user)`: Get all tasks owned by a specific address
- `getMyTasks()`: Get all tasks owned by the caller (msg.sender)

### Events
- `TaskCreated(uint id, string title, string description, uint dueDate, address owner)`
- `TaskCompleted(uint id, bool completed)`
- `TaskDeleted(uint id)`

### Security Features
- **Input Validation**: Title required, max 200 chars; description max 1000 chars
- **Ownership Control**: Only task owners can modify or delete their tasks
- **Access Restrictions**: Clear revert messages for unauthorized actions
- **Gas Optimization**: Swap-and-pop deletion pattern to minimize gas costs

## 🏗️ Architecture

### Component-Based Frontend Architecture
```
┌──────────────────────────────────────────────────────┐
│                    App.js (80 lines)                  │
│  ┌────────────────────────────────────────────────┐  │
│  │  Custom Hooks (Business Logic)                 │  │
│  │  • useWeb3() - Wallet & Provider Management    │  │
│  │  • useContract() - Smart Contract Interactions │  │
│  │  • useTransactionHistory() - Activity Tracking │  │
│  │  • useDarkMode() - Theme Management            │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  UI Components (Presentational)                │  │
│  │  • Header - Title, wallet, dark mode toggle    │  │
│  │  • TodoForm - Create new tasks                 │  │
│  │  • TodoList - Display & filter tasks           │  │
│  │  • TodoItem - Individual task with actions     │  │
│  │  • TransactionHistory - Activity log           │  │
│  │  • NetworkWarning - Error/warning messages     │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                          │
                          │ Ethers.js
                          ▼
        ┌──────────────────────────────────┐
        │         MetaMask Wallet           │
        └──────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│        Ethereum Blockchain (Sepolia/Local)          │
│  ┌───────────────────────────────────────────────┐  │
│  │      TodoList Smart Contract (with Ownership) │  │
│  │  • Task Storage (id, title, desc, owner...)  │  │
│  │  • CRUD Operations with Access Control       │  │
│  │  • Event Emissions (TaskCreated, etc.)       │  │
│  │  • getUserTasks() / getMyTasks()             │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Etherscan Explorer    │
              │  (Transaction History) │
              └────────────────────────┘
```

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MetaMask browser extension
- Sepolia testnet ETH (for testnet deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/LoganH-web/web3-todo.git
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

Copy the deployed contract address and update `client/src/networks.js`:

**For Local Hardhat:**
```javascript
LOCALHOST: {
  chainId: '0x7a69',
  chainIdDecimal: 31337,
  name: 'Localhost',
  contractAddress: 'YOUR_LOCAL_CONTRACT_ADDRESS_HERE', // ← Update this
  // ...
}
```

**For Sepolia Testnet:**
```javascript
SEPOLIA: {
  chainId: '0xaa36a7',
  chainIdDecimal: 11155111,
  name: 'Sepolia Testnet',
  contractAddress: 'YOUR_SEPOLIA_CONTRACT_ADDRESS_HERE', // ← Update this
  // ...
}
```

**Important:** The contract must be redeployed if you're upgrading from a version before Phase 5, as the Task struct now includes the `owner` field.

### 7. Start Frontend

```bash
cd client
npm start
```

The app will open at `http://localhost:3000`

## 🎯 How to Use

### 1. Connect Wallet
- Click "Connect Wallet" button in the header
- Approve MetaMask connection request
- Ensure you're on the correct network (Sepolia or Hardhat Local)
- Your wallet address and network will be displayed

### 2. Toggle Dark Mode
- Click the 🌙 moon icon (light mode) or ☀️ sun icon (dark mode) below the title
- Theme preference is automatically saved
- Works with system preference if not manually set

### 3. Create a Task
- Enter a task title (required, max 200 characters)
- Add an optional description (max 1000 characters)
- Optionally set a due date for the task
- Click "Add Todo"
- Approve the transaction in MetaMask
- Wait for blockchain confirmation
- Task appears in your list with "👤 You" as owner

### 4. Filter Your Tasks
- Use the "Show only my tasks" checkbox to filter
- See all tasks from all users (unchecked)
- See only tasks you created (checked)
- Owner addresses are shown on each task

### 5. Toggle Task Completion
- Click "Mark Done" on any pending task (you own)
- Click "Mark Pending" on completed tasks
- Approve the transaction in MetaMask
- Task status updates after confirmation
- ✓ Completed or Pending status is displayed

### 6. Delete a Task
- Click "Delete" button on any task you own
- Confirm the deletion in the popup
- Approve the transaction in MetaMask
- Task is removed from the blockchain

### 7. View Transaction History
- Scroll down to see "Recent Transactions" section
- View last 10 transactions with details
- Click "View on Etherscan" to see transaction on block explorer
- Transaction type, description, and timestamp are shown

### 8. Manage Due Dates
- Tasks show due date status badges:
  - 🔴 Red = Overdue
  - 🟡 Yellow = Due today
  - 🔵 Blue = Due tomorrow
  - 🟣 Purple = Due within 7 days
  - ⚪ Gray = Due later

### Notes
- Only task owners can modify or delete their tasks
- All transactions require MetaMask approval
- Transaction history shows real-time updates
- Network warnings appear if you're on unsupported network

## 📂 Project Structure

```
web3-todo/
├── contracts/
│   └── TodoList.sol              # Smart contract with ownership logic
├── scripts/
│   ├── deploy.js                 # Deployment script
│   └── checkSepolia.js           # Network verification
├── test/
│   └── TodoList.test.js          # 40+ comprehensive tests
├── client/
│   ├── src/
│   │   ├── components/           # 🆕 Modular UI components
│   │   │   ├── Header.js         #   - App header with wallet & theme toggle
│   │   │   ├── TodoForm.js       #   - Form for creating todos
│   │   │   ├── TodoList.js       #   - List container with filtering
│   │   │   ├── TodoItem.js       #   - Individual todo item
│   │   │   ├── TransactionHistory.js  #   - Activity log
│   │   │   ├── NetworkWarning.js #   - Error/warning display
│   │   │   └── index.js          #   - Component exports
│   │   ├── hooks/                # 🆕 Custom React hooks
│   │   │   ├── useWeb3.js        #   - Wallet & provider logic
│   │   │   ├── useContract.js    #   - Contract interactions
│   │   │   ├── useTransactionHistory.js  #   - Transaction tracking
│   │   │   ├── useDarkMode.js    #   - Theme management
│   │   │   └── index.js          #   - Hook exports
│   │   ├── utils/                # 🆕 Utility functions
│   │   │   └── formatters.js     #   - Address, date, time formatters
│   │   ├── App.js                # Main component (80 lines!)
│   │   ├── App.css               # Styles with dark mode support
│   │   ├── config.js             # Contract ABI & explorer URLs
│   │   ├── networks.js           # Network configurations
│   │   └── index.js              # React entry point
│   ├── public/
│   ├── build/                    # Production build
│   └── package.json
├── hardhat.config.js             # Hardhat configuration
├── package.json                  # Root dependencies
├── .env                          # Environment variables (gitignored)
├── README.md                     # This file
├── SPEC.md                       # Project specification & roadmap
├── DEPLOYMENT.md                 # Deployment guide
├── GAS_OPTIMIZATION.md           # Gas optimization notes
├── PHASE5_IMPLEMENTATION_SUMMARY.md  # Phase 5 features
├── REFACTORING_SUMMARY.md        # Code refactoring details
├── DARK_MODE_IMPLEMENTATION.md   # Dark mode guide
└── PROJECT_COMPLETE.md           # Final project summary
```

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
npx hardhat test
```

### Test Coverage
- ✅ Contract deployment and initialization
- ✅ Task creation with validation (CRUD operations)
- ✅ Task completion toggling
- ✅ Task deletion with ownership check
- ✅ Event emissions (TaskCreated, TaskCompleted, TaskDeleted)
- ✅ Ownership validation (only owner can modify/delete)
- ✅ getUserTasks() and getMyTasks() functions
- ✅ Multi-user scenarios and access control
- ✅ Edge cases (empty inputs, invalid IDs, long strings)
- ✅ Integration workflows

### Test Results
- **40+ test cases** covering all functionality
- **100% function coverage** of smart contract
- **Ownership validation** tests for security
- **Multi-user scenarios** with separate task ownership
- **Edge case handling** for robustness
- **Gas optimization validation** for cost efficiency

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
**Solution**: The app automatically detects network changes. If issues persist, click the "🔄 Refresh Network" button in the warning banner.

### Issue: Transaction fails
**Solution**: 
- Ensure you have enough ETH for gas fees
- Verify you're on the correct network (Sepolia or Localhost)
- Check that the contract address in `networks.js` matches your deployment
- Look for specific error messages in MetaMask

### Issue: "Only task owner can modify/delete this task"
**Solution**: 
- This is expected behavior! You can only modify tasks you created
- The owner address is shown on each task
- Check if you're using the correct MetaMask account
- Switch to the account that created the task

### Issue: "Contract not initialized"
**Solution**: 
- Confirm the contract is deployed to the network you're using
- Verify the contract address in `client/src/networks.js`
- Check that you've connected your wallet
- **Important**: If you redeployed the contract, update the address in networks.js

### Issue: Tasks not loading or showing random owner addresses
**Solution**:
- You may be using an old contract deployment (before Phase 5)
- **Must redeploy** the contract to get ownership features
- Follow deployment steps in section 6 above
- Update the contract address in `client/src/networks.js`

### Issue: "Show only my tasks" shows empty list
**Solution**:
- Ensure tasks were created with the new contract (with ownership)
- Tasks from old contract deployments won't have owner field
- Create a new task to test - it should appear when filtered

### Issue: Dark mode not persisting
**Solution**:
- Check if localStorage is enabled in your browser
- Not available in private/incognito mode
- Clear browser cache and try again
- Check browser console for localStorage errors

### Issue: Transaction history not showing
**Solution**:
- Transaction history only shows transactions made in current session
- History is stored in memory, not localStorage (by design)
- Refresh page clears history
- Transactions still visible on Etherscan via links

### Issue: Etherscan links not working
**Solution**:
- Ensure you're on a supported network (Sepolia)
- Local Hardhat network has no block explorer
- Check that transaction was confirmed on blockchain
- Wait a few seconds for Etherscan to index the transaction

## 📈 Future Enhancements

### Potential Features (Optional)
- [ ] Task editing functionality (update title/description)
- [ ] Task categories and tags for organization
- [ ] Priority levels (high, medium, low)
- [ ] Task sharing and delegation between users
- [ ] Subtasks and task dependencies
- [ ] IPFS integration for storing large attachments
- [ ] Batch operations (toggle/delete multiple tasks)
- [ ] Task search and advanced filtering
- [ ] Statistics dashboard (completion rate, etc.)
- [ ] Email/notification system
- [ ] Layer 2 deployment for lower gas fees (Polygon, Arbitrum, Optimism)
- [ ] Mobile app (React Native)
- [ ] Task templates and recurring tasks
- [ ] Team/organization workspaces
- [ ] Task comments and collaboration

### Already Implemented ✅
- ✅ Due dates with visual status indicators
- ✅ Multi-user support with task ownership
- ✅ Dark mode with theme persistence
- ✅ Transaction history and Etherscan integration
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Gas-optimized smart contract
- ✅ Task filtering by owner
- ✅ Real-time event-based updates
- ✅ Professional modular code architecture

## ✨ Phase 5: Advanced Implementation Highlights

### 1. Task Ownership System
```solidity
// Smart contract now tracks task ownership
struct Task {
    uint id;
    string title;
    string description;
    bool completed;
    uint dueDate;
    address owner;  // ← New: Tracks task creator
}

// Only owners can modify their tasks
function toggleTaskCompletion(uint _id) public {
    require(tasks[i].owner == msg.sender, "Only task owner can modify");
    // ...
}
```

**Benefits:**
- Multi-user support with isolated task management
- Access control prevents unauthorized modifications
- Clear ownership display on each task
- Filter to show only your tasks

### 2. Transaction History & Transparency
Real-time activity log with Etherscan integration:
- Every transaction is tracked and displayed
- Direct links to view on block explorer
- Transaction type, description, timestamp shown
- Network-aware (correct explorer for each network)
- Keeps last 10 transactions visible

### 3. Modular Code Architecture
**Before:** 790-line monolithic App.js  
**After:** 80-line orchestrator with:
- 4 custom hooks (useWeb3, useContract, useTransactionHistory, useDarkMode)
- 6 reusable components (Header, TodoForm, TodoList, TodoItem, TransactionHistory, NetworkWarning)
- Utility functions for formatting
- 90% code reduction in main file

**Benefits:**
- Easy to test each piece independently
- Simple to add new features
- Clear separation of concerns
- Maintainable and scalable

### 4. Dark Mode Implementation
Complete theming system with:
- CSS variables for all colors
- localStorage persistence
- System preference detection
- Smooth transitions (0.3s)
- Toggle button in header
- All components styled for both themes

### 5. Professional Polish
- Loading states and spinners
- Error handling with user-friendly messages
- Transaction status feedback
- Network warnings and guidance
- Hover effects and animations
- Responsive design (mobile/tablet/desktop)
- Accessibility considerations

### Documentation
Comprehensive guides available:
- `PHASE5_IMPLEMENTATION_SUMMARY.md` - Feature details
- `REFACTORING_SUMMARY.md` - Architecture breakdown
- `DARK_MODE_IMPLEMENTATION.md` - Theme system guide
- `PROJECT_COMPLETE.md` - Full project summary

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About This Project

Built as a comprehensive full-stack blockchain application to demonstrate:

### Technical Skills
- **Smart Contract Development**: Solidity with ownership logic and access control
- **Web3 Integration**: Ethers.js, MetaMask wallet connection, transaction handling
- **React Best Practices**: Custom hooks, component composition, state management
- **Code Architecture**: Modular design, separation of concerns, clean code principles
- **Testing**: 40+ test cases with 100% function coverage
- **UI/UX Design**: Dark mode, responsive design, user feedback, accessibility

### Professional Practices
- **Documentation**: Comprehensive guides and inline comments
- **Code Quality**: Refactored from 790 to 80 lines in main component
- **Security**: Input validation, access control, error handling
- **Gas Optimization**: Efficient contract operations
- **User Experience**: Real-time updates, transaction history, visual feedback

### Project Highlights
- ✅ **Complete Feature Set**: CRUD operations, ownership, history, theming
- ✅ **Production Ready**: Deployed to Sepolia testnet, fully tested
- ✅ **Well Documented**: 10+ markdown files covering all aspects
- ✅ **Modern Stack**: Latest versions of React, Ethers.js, Hardhat
- ✅ **Portfolio Quality**: Professional presentation and organization

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Lines of Code** | ~2,500+ |
| **Smart Contract Functions** | 7 |
| **React Components** | 6 |
| **Custom Hooks** | 4 |
| **Test Cases** | 40+ |
| **Test Coverage** | 100% |
| **Networks Supported** | 2 (Local + Sepolia) |
| **Documentation Files** | 10+ |
| **Code Reduction** | 90% (790→80 lines) |

---

## 🔗 Resources & Links

### Documentation
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [React Documentation](https://react.dev/)

### Project Documentation
- [Complete Feature List](SPEC.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Refactoring Details](REFACTORING_SUMMARY.md)
- [Phase 5 Features](PHASE5_IMPLEMENTATION_SUMMARY.md)
- [Dark Mode Guide](DARK_MODE_IMPLEMENTATION.md)
- [Project Summary](PROJECT_COMPLETE.md)

### Deployed Contract
- **Sepolia Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0x5c25BA0202e8581f551e23d5aD13E745E557C644)

---

## 🎉 Project Status

**Status:** ✅ **Complete & Production-Ready**  
**Completion Date:** January 4, 2026  
**Development Time:** ~3 weeks  
**Phase:** 5/5 Complete

### All Phases Completed:
- ✅ Phase 1: Smart Contract Foundation
- ✅ Phase 2: Testing & Validation
- ✅ Phase 3: Frontend Integration
- ✅ Phase 4: Testing, Deployment & Finalization
- ✅ Phase 5: Advanced Features & Professional Polish

---

**Built with ❤️ using Solidity, React, Ethers.js, and Hardhat**

*A professional-grade decentralized application demonstrating full-stack blockchain development capabilities.*
