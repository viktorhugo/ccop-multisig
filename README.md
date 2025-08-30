
# CCOP Multi-Sig: A Feature-Rich ERC20 Multisig Wallet

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered by Foundry](https://img.shields.io/badge/Powered%20by-Foundry-orange)](https://getfoundry.sh/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Wagmi](https://img.shields.io/badge/wagmi-black?logo=wagmi&logoColor=white)](https://wagmi.sh/)
[![Powered by Reown](https://img.shields.io/badge/Powered%20by-Reown-blue)](https://reown.com)

Welcome to the CCOP Multi-Sig project, a comprehensive, decentralized application (dApp) for managing ERC20 tokens through a secure multisignature wallet. This project combines a robust Solidity smart contract built with Foundry with a sleek, reactive user interface built with Next.js and Wagmi.

## Screen

<p align="center">
  <img src="https://raw.githubusercontent.com/viktorhugo/ccop-multisig/refs/heads/master/multi-sig-ui/public/dapp-screenshot.webp" alt="Time-Lock Vault dApp Screenshot" width="700">
</p>

![CCOP Multi-Sig Animated Demo](https://user-images.githubusercontent.com/1234567/123456789-placeholder.gif)
*(Replace this with your actual animated GIF)*

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
- **Real-Time Balance**: View the multisig's token balance, which updates automatically on deposits.
- **Token Deposits**: A dedicated interface to approve and deposit tokens into the multisig contract.
- **Transaction Submission**: A clean form to create new withdrawal proposals.
- **Interactive Transaction List**: View all pending and executed transactions.
- **Confirm & Execute**: Intuitive buttons to confirm and execute transactions directly from the UI when conditions are met.
- **Dynamic Statuses**: Cards for each transaction clearly show their status (Pending, Executable, Executed) and confirmation progress.
- **Modern Tech Stack**: Built with Next.js, TypeScript, and Wagmi for a seamless and reactive user experience.
- **Themed & Responsive**: A consistent, dark-themed UI that looks great on all devices.

---

## 🛠️ Tech Stack

- **Blockchain**: Solidity, Foundry
- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: Wagmi, Viem, Reown AppKit
- **Dependencies**: OpenZeppelin Contracts

---

## 📂 Project Structure

The project is organized into two main packages:

```
ccop-multisig/
├── multi-sig-foundry/  # Solidity smart contract (Foundry)
└── multi-sig-ui/       # Next.js frontend application
```

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing.

### Prerequisites

- **Node.js**: [v18.x or later](https://nodejs.org/)
- **Foundry**: Follow the [official installation guide](https://book.getfoundry.sh/getting-started/installation).
- **Git**: [Installation guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ccop-multisig.git
cd ccop-multisig
```

### 2. Set Up the Smart Contract (`multi-sig-foundry`)

First, navigate to the smart contract directory and install dependencies.

```bash
cd multi-sig-foundry
forge install
```

Next, start a local Anvil node in a separate terminal window. This will act as your local blockchain.

```bash
anvil
```
Anvil will provide you with a list of accounts and their private keys. You will need these for deployment.

Now, create a `.env` file by copying the example.
```bash
cp .env.example .env
```
Open the `.env` file and add the RPC URL for your local Anvil node and a private key from one of the Anvil accounts.

```.env
RPC_URL_LOCALHOST=http://127.0.0.1:8545
PRIVATE_KEY=YOUR_ANVIL_PRIVATE_KEY
```

Before deploying, you need to deploy a mock ERC20 token. Then, deploy the `SimpleERC20Multisig` contract, passing the token's address and defining the owners and threshold.

*Note: The deployment script `Deploy.s.sol` may need to be adjusted to first deploy a mock token and then use its address for the multisig deployment.*

Run the deployment script:
```bash
# Example deployment command (adjust script as needed)
forge script script/Deploy.s.sol --rpc-url localhost --broadcast --private-key $PRIVATE_KEY
```
After a successful deployment, take note of the deployed **Multisig contract address**.

### 3. Set Up the User Interface (`multi-sig-ui`)

In a new terminal, navigate to the UI directory and install the dependencies.

```bash
cd ../multi-sig-ui
npm install
```

Create a `.env.local` file and add the address of the `SimpleERC20Multisig` contract you just deployed.

```.env.local
NEXT_PUBLIC_MULTISIG_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

Now, run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action!

---

### 4. Makefile Usage (Alternative for Foundry)

The `multi-sig-foundry` directory includes a `Makefile` to simplify common tasks. From within `multi-sig-foundry`, you can use the following commands:

| Command                 | Description                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `make build`            | Compiles the smart contracts.                                                                           |
| `make test`             | Runs the test suite using `forge test`.                                                                 |
| `make anvil`            | Starts a local Anvil node with a deterministic mnemonic.                                                |
| `make deploy-testnet-anvil` | Deploys the contract to the local Anvil node (requires `.env` setup).                                   |
| `make deploy-testnet-celo`  | Deploys the contract to the Celo Alfajores testnet (requires `.env` and wallet setup).                  |
| `make snapshot`         | Generates a gas usage snapshot for the contract methods.                                                |
| `make format`           | Formats the Solidity code using `forge fmt`.                                                            |
| `make clean`            | Cleans the project build artifacts.                                                                     |
| `make update`           | Updates the git submodules/dependencies.                                                                |

---

## 🧪 Running Tests

To run the smart contract tests, navigate to the `multi-sig-foundry` directory and use `forge`.

```bash
cd multi-sig-foundry
forge test
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


Welcome to the CCOP Multi-Sig project, a comprehensive, decentralized application (dApp) for managing ERC20 tokens through a secure multisignature wallet. This project combines a robust Solidity smart contract built with Foundry with a sleek, reactive user interface built with Next.js and Wagmi.

## 🎬 Animated Demo

*To create a GIF like the one below, you can use a tool like [ScreenToGif](https://www.screentogif.com/) or [Kap](https://getkap.co/). Simply record your screen while interacting with the dApp and replace the placeholder image.*

![CCOP Multi-Sig Animated Demo](https://user-images.githubusercontent.com/1234567/123456789-placeholder.gif)
*(Replace this with your actual animated GIF)*

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
- **Real-Time Balance**: View the multisig's token balance, which updates automatically on deposits.
- **Token Deposits**: A dedicated interface to approve and deposit tokens into the multisig contract.
- **Transaction Submission**: A clean form to create new withdrawal proposals.
- **Interactive Transaction List**: View all pending and executed transactions.
- **Confirm & Execute**: Intuitive buttons to confirm and execute transactions directly from the UI when conditions are met.
- **Dynamic Statuses**: Cards for each transaction clearly show their status (Pending, Executable, Executed) and confirmation progress.
- **Modern Tech Stack**: Built with Next.js, TypeScript, and Wagmi for a seamless and reactive user experience.
- **Themed & Responsive**: A consistent, dark-themed UI that looks great on all devices.

---

## 🛠️ Tech Stack

- **Blockchain**: Solidity, Foundry
- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: Wagmi, Viem
- **Dependencies**: OpenZeppelin Contracts

---

## 📂 Project Structure

The project is organized into two main packages:

```
ccop-multisig/
├── multi-sig-foundry/  # Solidity smart contract (Foundry)
└── multi-sig-ui/       # Next.js frontend application
```

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing.

### Prerequisites

- **Node.js**: [v18.x or later](https://nodejs.org/)
- **Foundry**: Follow the [official installation guide](https://book.getfoundry.sh/getting-started/installation).
- **Git**: [Installation guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ccop-multisig.git
cd ccop-multisig
```

### 2. Set Up the Smart Contract (`multi-sig-foundry`)

First, navigate to the smart contract directory and install dependencies.

```bash
cd multi-sig-foundry
forge install
```

Next, start a local Anvil node in a separate terminal window. This will act as your local blockchain.

```bash
anvil
```
Anvil will provide you with a list of accounts and their private keys. You will need these for deployment.

Now, create a `.env` file by copying the example.
```bash
cp .env.example .env
```
Open the `.env` file and add the RPC URL for your local Anvil node and a private key from one of the Anvil accounts.

```.env
RPC_URL_LOCALHOST=http://127.0.0.1:8545
PRIVATE_KEY=YOUR_ANVIL_PRIVATE_KEY
```

Before deploying, you need to deploy a mock ERC20 token. Then, deploy the `SimpleERC20Multisig` contract, passing the token's address and defining the owners and threshold.

*Note: The deployment script `Deploy.s.sol` may need to be adjusted to first deploy a mock token and then use its address for the multisig deployment.*

Run the deployment script:
```bash
# Example deployment command (adjust script as needed)
forge script script/Deploy.s.sol --rpc-url localhost --broadcast --private-key $PRIVATE_KEY
```
After a successful deployment, take note of the deployed **Multisig contract address**.

### 3. Set Up the User Interface (`multi-sig-ui`)

In a new terminal, navigate to the UI directory and install the dependencies.

```bash
cd ../multi-sig-ui
npm install
```

Create a `.env.local` file and add the address of the `SimpleERC20Multisig` contract you just deployed.

```.env.local
NEXT_PUBLIC_MULTISIG_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

Now, run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action!

---

### 4. Makefile Commands

The `multi-sig-foundry` directory includes a `Makefile` to simplify common tasks. From within `multi-sig-foundry`, you can use the following commands:

| Command                 | Description                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `make build`            | Compiles the smart contracts.                                                                           |
| `make test`             | Runs the test suite using `forge test`.                                                                 |
| `make anvil`            | Starts a local Anvil node with a deterministic mnemonic.                                                |
| `make deploy-testnet-anvil` | Deploys the contract to the local Anvil node (requires `.env` setup).                                   |
| `make deploy-testnet-celo`  | Deploys the contract to the Celo Alfajores testnet (requires `.env` and wallet setup).                  |
| `make snapshot`         | Generates a gas usage snapshot for the contract methods.                                                |
| `make format`           | Formats the Solidity code using `forge fmt`.                                                            |
| `make clean`            | Cleans the project build artifacts.                                                                     |
| `make update`           | Updates the git submodules/dependencies.                                                                |

---

## 🧪 Running Tests

To run the smart contract tests, navigate to the `multi-sig-foundry` directory and use `forge`.

```bash
cd multi-sig-foundry
forge test
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.