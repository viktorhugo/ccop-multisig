# CCOP Multi-Sig: A Feature-Rich ERC20 Multisig Wallet

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Foundry](https://img.shields.io/badge/Powered%20by-Foundry-orange)](https://getfoundry.sh/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Wagmi](https://img.shields.io/badge/wagmi-black?logo=wagmi&logoColor=white)](https://wagmi.sh/)
[![Reown](https://img.shields.io/badge/Powered%20by-Reown-blue)](https://reown.com)
[![Rindexer](https://img.shields.io/badge/Powered%20by-Reown-blue)](https://rindexer.xyz/)

Welcome to the CCOP Multi-Sig project, a comprehensive, decentralized application (dApp) for managing ERC20 tokens through a secure multisignature wallet. This project combines a robust Solidity smart contract, a high-performance indexer, and a sleek user interface.

## Screen

<p align="center">
  <img src="https://github.com/viktorhugo/ccop-multisig/blob/main/multi-sig-ui/public/dapp-screenshot.webp?raw=true" alt="Time-Lock Vault dApp Screenshot" width="900">
</p>

---

## ✨ Features

### Smart Contract (`multi-sig-foundry`)
- **Multi-Owner Control**: Requires a configurable number of owners (threshold) to approve transactions.
- **Secure Transactions**: Submit, confirm, and execute ERC20 token transfers securely.
- **Token Deposits**: Allows any user to deposit the designated ERC20 token into the multisig wallet.
- **Event-Driven**: Emits detailed events for all major actions (Deposits, Submissions, Confirmations, Executions).
- **Owner Management**: Immutable owner list defined at deployment for enhanced security.
- **Built with Foundry**: Developed and tested using the fast and reliable Foundry framework.

### User Interface (`multi-sig-ui`)
- **Real-Time Data**: Fetches and displays data from the indexer for up-to-the-minute accuracy.
- **Real-Time Balance**: View the multisig's token balance, which updates automatically on deposits.
- **Token Deposits**: A dedicated interface to approve and deposit tokens into the multisig contract.
- **Transaction Submission**: A clean form to create new withdrawal proposals.
- **Interactive Transaction List**: View all pending and executed transactions with detailed information.
- **Confirm & Execute**: Intuitive buttons to confirm and execute transactions directly from the UI.
- **Dynamic Statuses**: Cards for each transaction clearly show their status and confirmation progress.
- **Modern Tech Stack**: Built with Next.js, TypeScript, and Wagmi for a seamless user experience.
- **Themed & Responsive**: A consistent, dark-themed UI that looks great on all devices.

### Indexer (`multisig-indexer`)
- **High-Performance Indexing**: Built with **Rindexer**, a fast, no-code indexing solution.
- **Real-Time Event Tracking**: Indexes key smart contract events (`Deposit`, `SubmitTransaction`, `ConfirmTransaction`, `ExecuteTransaction`).
- **PostgreSQL Backend**: Stores indexed data in a robust PostgreSQL database for reliable querying.
- **GraphQL API**: Exposes a GraphQL endpoint (port `4001`) for flexible and efficient data retrieval by the frontend.
- **CSV Output**: Generates CSV files of indexed data for easy analysis and reporting.
- **Dockerized Environment**: Uses Docker Compose for easy setup and management of the database service.

---

## 🛠️ Tech Stack

- **Blockchain**: Solidity, Foundry
- **Frontend**: Next.js, React, TypeScript
- **Indexing**: Rindexer, GraphQL
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Web3 Integration**: Wagmi, Viem, Reown AppKit
- **Containerization**: Docker

---

## 📂 Project Structure

The project is organized into three main packages:

```
ccop-multisig/
├── multi-sig-foundry/  # Solidity smart contract (Foundry)
├── multisig-indexer/   # Rindexer service and configuration
└── multi-sig-ui/       # Next.js frontend application
```

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Node.js**: [v18.x or later](https://nodejs.org/)
- **Foundry**: Follow the [official installation guide](https://book.getfoundry.sh/getting-started/installation).
- **Docker** and **Docker Compose**: [Installation guide](https://docs.docker.com/get-docker/).
- **Git**: [Installation guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ccop-multisig.git
cd ccop-multisig
```

### 2. Set Up the Smart Contract (`multi-sig-foundry`)

Navigate to the smart contract directory, install dependencies, and start a local Anvil node.

```bash
cd multi-sig-foundry
forge install

# In a separate terminal, run:
anvil
```

Create a `.env` file and configure it with your Anvil RPC URL and a private key.

```bash
cp .env.example .env
```

```.env
RPC_URL_LOCALHOST=http://127.0.0.1:8545
PRIVATE_KEY=YOUR_ANVIL_PRIVATE_KEY
```

Deploy the contract. *Note: The script may need to be adjusted to handle mock token deployment.*

```bash
forge script script/Deploy.s.sol --rpc-url localhost --broadcast --private-key $PRIVATE_KEY
```

After deployment, copy the **deployed Multisig contract address**.

### 3. Set Up the Indexer (`multisig-indexer`)

The indexer is pre-configured to track a contract on the `Alfajores` testnet. To use it with your local deployment, you must update the configuration.

Navigate to the indexer directory:
```bash
cd ../multisig-indexer
```

Update `rindexer.yaml`:
1.  Change the `network` from `alfajores` to a local network name (e.g., `anvil`).
2.  Update the `rpc` URL to your local Anvil node (`http://127.0.0.1:8545`).
3.  Change the `address` under `contracts` to your newly deployed contract address.
4.  Set `start_block` to `0` or a recent block number.

Create a `.env` file for the PostgreSQL database credentials.
```bash
cp .env.example .env
```
Fill in the `.env` file with your desired database settings.

Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

Finally, run the indexer:
```bash
# You may need to install rindexer first: https://github.com/Rindexer/rindexer
rindexer --config rindexer.yaml
```

The indexer will start, and you can access the GraphQL API at `http://localhost:4001`.

### 4. Set Up the User Interface (`multi-sig-ui`)

Navigate to the UI directory and install dependencies.

```bash
cd ../multi-sig-ui
npm install
```

Create a `.env.local` file and add the address of your deployed contract.

```.env.local
NEXT_PUBLIC_MULTISIG_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
# If your indexer's GraphQL API is running elsewhere, configure it here
# NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4001/graphql
```

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application!

---

### Makefile Usage

The `multi-sig-foundry` directory includes a `Makefile` to simplify common tasks like building, testing, and deploying the smart contract. See the `Makefile` for a full list of commands.

---

## 🧪 Running Tests

To run the smart contract tests:

```bash
cd multi-sig-foundry
forge test
```

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.