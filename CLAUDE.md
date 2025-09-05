# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is CCOP Multi-Sig, a comprehensive dApp that combines a Solidity smart contract multisignature wallet with a Next.js frontend. The project manages ERC20 tokens through secure multi-owner approval mechanisms.

## Project Structure

```
ccop-multisig/
├── multi-sig-foundry/    # Solidity smart contract (Foundry framework)
│   ├── src/              # Contract source code
│   ├── test/             # Contract tests
│   ├── script/           # Deployment scripts
│   ├── Makefile          # Build automation
│   └── foundry.toml      # Foundry configuration
└── multi-sig-ui/         # Next.js frontend application
    ├── src/
    │   ├── app/          # Next.js app router pages
    │   ├── components/   # React components
    │   ├── hooks/        # Custom React hooks
    │   ├── lib/          # Utility libraries
    │   ├── config/       # Configuration files
    │   ├── context/      # React contexts
    │   └── abi/          # Smart contract ABIs
    └── package.json
```

## Development Commands

### Smart Contract (multi-sig-foundry/)

Use the Makefile for smart contract operations:

```bash
cd multi-sig-foundry
make build          # Compile contracts
make test           # Run tests
make anvil          # Start local blockchain
make deploy-testnet-anvil   # Deploy to local Anvil
make deploy-testnet-celo    # Deploy to Celo testnet
make snapshot       # Generate gas usage snapshot
make format         # Format Solidity code
make clean          # Clean build artifacts
make update         # Update dependencies
```

Direct Foundry commands:
- `forge build` - Compile contracts
- `forge test` - Run contract tests
- `forge script script/Deploy.s.sol --rpc-url localhost --broadcast` - Deploy script

### Frontend (multi-sig-ui/)

```bash
cd multi-sig-ui
npm install         # Install dependencies
npm run dev         # Start development server (with Turbopack)
npm run build       # Build for production (with Turbopack)
npm start           # Start production server
npm run lint        # Run ESLint
```

## Core Architecture

### Smart Contract (`SimpleERC20Multisig.sol`)
- **Multi-owner control**: Configurable threshold for transaction approvals
- **ERC20 token management**: Handles deposits and withdrawals of a specific ERC20 token
- **Transaction lifecycle**: Submit → Confirm → Execute workflow
- **Events**: Comprehensive event emission for frontend integration
- **Owner management**: Immutable owner list set at deployment

### Frontend Architecture
- **Next.js 15** with App Router and Turbopack
- **Wagmi + Viem**: Web3 integration for Ethereum interactions
- **Reown AppKit**: Wallet connection and management
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Styling with custom dark theme

### Key Components
- `useTransactions.ts`: Hook for transaction management and contract interactions
- `useWallet.ts`: Wallet connection and account management
- `contract.ts`: Contract configuration and type definitions
- Transaction components: Submit, Confirm, Execute workflows
- Balance and deposit management components

### State Management
- **React Context**: Used for wallet and app state
- **Wagmi hooks**: For blockchain state management
- **TanStack Query**: For caching and data fetching

## Environment Setup

### Smart Contract Environment
Create `multi-sig-foundry/.env`:
```bash
RPC_URL_LOCALHOST=http://127.0.0.1:8545
PRIVATE_KEY=your_private_key
RPC_URL_CELO=https://alfajores-forno.celo-testnet.org
```

### Frontend Environment
Create `multi-sig-ui/.env.local`:
```bash
NEXT_PUBLIC_MULTISIG_CONTRACT_ADDRESS=deployed_contract_address
```

## Development Workflow

1. **Smart Contract Development**: Work in `multi-sig-foundry/`, use Makefile commands
2. **Frontend Development**: Work in `multi-sig-ui/`, connect to deployed contract
3. **Local Testing**: Use `make anvil` for local blockchain, deploy contract, then run frontend
4. **ABI Management**: Contract ABI is stored in `multi-sig-ui/src/abi/`

## Key Files to Understand

- `multi-sig-foundry/src/SimpleERC20Multisig.sol`: Core smart contract
- `multi-sig-foundry/test/SimpleERC20MultisigTest.t.sol`: Contract tests
- `multi-sig-ui/src/lib/contract.ts`: Contract integration
- `multi-sig-ui/src/hooks/useTransactions.ts`: Transaction management logic
- `multi-sig-ui/src/components/`: UI components for multisig operations

## Technology Stack

- **Blockchain**: Solidity ^0.8.26, Foundry framework
- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Web3**: Wagmi 2.16+, Viem 2.36+, Reown AppKit
- **Styling**: Tailwind CSS 4, Lucide icons
- **Development**: Turbopack, ESLint 9

## Testing

- Smart contract tests use Foundry's testing framework
- Run `make test` in `multi-sig-foundry/` for contract tests
- Frontend uses Next.js built-in ESLint configuration