# multisig-ccop

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Install and Configure Tools](#install-and-configure-tools)
3. [Project Initialization](#project-initialization)
4. [Smart Contract Development](#smart-contract-development)
5. [Testing Contract](#testing-contract)
6. [Contract Deployment](#contract-deployment)

## Prerequisites

- Foundry CLI (forge, cast, anvil, chisel)
- Node.js & npm
- Celo CLI (`celocli`)
- Celo Alfajores testnet account (with test CELO)
- Access to <https://alfajores-forno.celo-testnet.org>

---

## 2. Install and Configure Tools

### 2.1 Install Foundry

#### Context

Install and configure Foundry CLI tools for contract development.

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
foundryup -i nightly
```

Install open zeppelin

```
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-foundry-upgrades
forge install OpenZeppelin/openzeppelin-contracts-upgradeable
```

### 2.2 Install Celo CLI

#### Context

Install Celo command-line interface for interacting with the network.

```bash
npm install -g @celo/celocli
```

Create your `.env` file for public config:

```bash
# .env
CELO_ACCOUNT_ADDRESS=$YOUR_ADDRESS
CELO_NODE_URL=https://alfajores-forno.celo-testnet.org
RPC_URL=$CELO_NODE_URL
```

> **⚠️ Warning:** Never commit `.env`. Add `.env` to your `.gitignore`.

---

## 3. Smart Contract Development

### 3.1 Building a Simple ERC20 MultiSig Wallet

#### Context

Create a beginner-friendly multisig wallet that requires multiple owners to approve ERC20 token transfers. This tutorial will guide you through building the contract step by step.

### 3.2 Running Your Tests

Execute your tests using Foundry's powerful testing commands to verify your contract works correctly.

```bash
# Navigate to your project directory
cd multisig-foundry

# Run all tests
forge test

# Run with verbose output to see console.log statements
forge test -vv

# Run specific test function
forge test --match-test testHappyPathWorkflow

# Run with detailed gas reporting
forge test --gas-report

# Run with maximum verbosity (shows all calls and events)
forge test -vvvv
```

> **Pro Tip:** Use `-vv` to see your `console.log` outputs during testing.

### 3.3 Understanding Test Results

#### Context

Learn to interpret test output and debug any issues that arise during testing.

**Successful Test Output:**

```
Running 1 test for test/SimpleERC20MultisigTest.t.sol:SimpleERC20MultisigTest
[PASS] testHappyPathWorkflow() (gas: 234567)

Test result: ok. 1 passed; 0 failed; finished in 2.34ms
```

**Key Metrics:**

- **PASS/FAIL status**: Whether each test succeeded
- **Gas usage**: How much gas the test consumed
- **Execution time**: How long tests took to run
- **Console logs**: Your debugging output (with `-vv`)

> **⚠️ Debugging:** If tests fail, use `-vvvv` to see exactly where the failure occurred.

---

## 4. Contract Deployment

### 4.1 Deployment Overview

#### Context

Deploy your SimpleERC20Multisig contract to the Celo Alfajores testnet using Foundry. This section covers both simple deployment for quick testing and advanced deployment with configurable parameters.

### 4.2 Prepare for Deployment

#### Step 1: Import Your Wallet

First, make sure you have imported your wallet using the keystore method:

```bash
# Import your private key into Foundry's keystore (done during initial setup)
cast wallet import my-wallet-time-lock --private-key $YOUR_PRIVATE_KEY
```

> **💡 Note:** This step should already be completed from the initial setup section.

#### Step 2: Set Up Environment Variables

Create a `.env` file in your `multi-sig` directory with the following configuration:

```bash
# .env file for deployment
CELO_NODE_URL=https://alfajores-forno.celo-testnet.org
```

> **⚠️ Security Warning:** Never commit your private key. Add `.env` to your `.gitignore` file.
> **📝 Note:** Multisig parameters (owners, threshold, token) are now configured directly in the deploy script.

#### Step 3: Fund Your Deployment Account

Ensure your deployment account has sufficient CELO for gas fees:

```bash
# Check your balance
cast balance $YOUR_ADDRESS --rpc-url $CELO_NODE_URL

# Get test CELO from the faucet if needed
# Visit: https://faucet.celo.org/alfajores
```

### 5 Simple Deployment

#### Context

Quick deployment with predefined parameters for testing purposes.

#### Step 1: Review and Update Deploy Script

Edit `script/Deploy.s.sol` to set your actual owner addresses. The deploy script now uses hardcoded values for owners, threshold, and token address:

- **Owners**: Edit the owner addresses in the `getOwners()` function
- **Threshold**: Modify the threshold value in the `getThreshold()` function  
- **Token**: Update the token address in the `getTokenAddress()` function (defaults to cUSD on Alfajores)

> **💡 Tip:** This approach ensures consistent deployments and eliminates environment variable dependencies.

#### Step 2: Deploy the Contract

```bash
# Navigate to the multi-sig directory
cd multi-sig

# Deploy using the deploy script
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $CELO_NODE_URL \
  --broadcast \
  --account my-wallet-time-lock
```

### 5.1 Customizing Deployment Configuration

#### Context

Customize the deployment parameters by editing the deploy script directly for production use.

#### Step 1: Edit Deploy Script Configuration

Modify the configuration values in `script/Deploy.s.sol`:

```solidity
// In getOwners() function - replace with your actual addresses
owners[0] = 0xYourActualAddress1;
owners[1] = 0xYourActualAddress2; 
owners[2] = 0xYourActualAddress3;

// In getThreshold() function - set your required confirmations
return 2; // or your desired threshold

// In getTokenAddress() function - set your token contract
return 0x765DE816845861e75A25fCA122bb6898B8B1282a; // or your token address
```


### 5.2 Common Token Addresses on Alfajores

List of common ERC20 tokens available for testing on Celo Alfajores testnet.

| Token | Symbol | Contract Address |
|-------|--------|------------------|
| Celo Dollar | cUSD | `0x765DE816845861e75A25fCA122bb6898B8B1282a` |
| Celo Euro | cEUR | `0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F` |
| Celo Brazilian Real | cREAL | `0xE4D517785D091D3c54818832dB6094bcc2744545` |

> **💡 Tip:** Use cUSD for testing as it's the most widely supported test token on Alfajores.
