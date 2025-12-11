# 3-Week Roadmap for Web3-Based To-Do List (Frontend + Blockchain Integration)

## Project Overview
A Web3-based todo application built with Solidity smart contracts and Hardhat framework. This project leverages blockchain technology to create a persistent, decentralized todo list.

## Project Goals

### Phase 1: Smart Contract Foundation (Current)
- [x] Set up Hardhat development environment
- [xx] Create a basic smart contract scaffold
- [ ] Implement todo item struct with properties (id, title, description, completed)
- [ ] Implement smart contract functions for todo management
  - [ ] Add todo item
  - [ ] Mark todo as complete
  - [ ] Delete todo item
  - [ ] Retrieve all todos
  - [ ] Retrieve single todo
- [ ] Add event emissions for todo operations

#### Day 1 Goal
- You need:
  - Sepolia RPC(Alchemy or Infura)
  - Sepolia test ETH
  - Your Metamask private key 
  
  Task:
  - [x] Install dotenv
  - [] Create .env: 
     (SEPOLIA_URL=YOUR_INFURA_OR_ALCHEMY_URL
        PRIVATE_KEY=YOUR_PRIVATE_KEY)
  - [] Deploy to Sepolia 


### Phase 2: Testing & Validation
- [ ] Write comprehensive unit tests for all smart contract functions
- [ ] Test contract deployment
- [ ] Verify event emissions
- [ ] Test edge cases and error handling

### Phase 3: Frontend Integration (Future)
- [ ] Create a frontend interface (React/Vue/Next.js)
- [ ] Connect frontend to deployed smart contract
- [ ] Implement user authentication (Web3 wallet connection)
- [ ] Display todos from blockchain
- [ ] Allow users to interact with todos

### Phase 4: Deployment & Optimization
- [ ] Deploy to testnet (Sepolia/Goerli)
- [ ] Gas optimization
- [ ] Security audit
- [ ] Deploy to mainnet (if applicable)

## Current Progress

### Completed
- ✅ Hardhat project initialization
- ✅ Basic project structure set up
- ✅ Dependencies installed:
  - `hardhat`: 2.22.6
  - `ethers`: ^6.16.0
  - `@nomicfoundation/hardhat-ethers`: 3.1.2
  - `@nomicfoundation/hardhat-chai-matchers`: 2.0.8

### Current Implementation

#### Smart Contract (`contracts/Hello.sol`)
- Basic Hello contract with a message state variable
- `setMessage()` function to update the message
- Ready to be extended into a full todo contract

#### Deployment Script (`scripts/deploy.js`)
- Basic deployment function using ethers.js
- Outputs contract address upon successful deployment

### Next Steps
1. Extend `Hello.sol` contract to include todo functionality
2. Define Todo struct with necessary properties
3. Implement CRUD operations for todos
4. Add event emissions
5. Create comprehensive test suite
6. Update deployment script to handle new contract features

## Technical Stack
- **Language**: Solidity ^0.8.0
- **Framework**: Hardhat 2.22.6
- **Runtime**: Node.js
- **Blockchain Library**: ethers.js ^6.16.0
- **Testing**: Hardhat + Chai (via @nomicfoundation/hardhat-chai-matchers)

## File Structure
```
web3-todo/
├── contracts/
│   └── Hello.sol          # Smart contract
├── scripts/
│   └── deploy.js          # Deployment script
├── test/                  # Test files (to be populated)
├── artifacts/             # Compiled contracts
├── cache/                 # Build cache
├── hardhat.config.js      # Hardhat configuration
├── package.json           # Project dependencies
├── README.md              # Project documentation
└── SPEC.md               # This file - Project specification
```

## Progress Log

### Session 1 (December 11, 2025)
- Created project specification document
- Documented project structure and goals
- Identified next development phases

## TodoList deployed to:
- TodoList deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

  Contract deployment: <UnrecognizedContract>
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0x10b7a0d480f4f8eef8e44029f1f54b764192665313be75cc065642422ac25e92
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            694126 of 30000000
  Block #1:            0xe878c1490840c16d7bcae537e4f6a1cc001af279b24d50f5f520040030f01698

