import { multiSigABI } from "@/abi/SimpleERC20Multisig";
import { Address } from "viem";

// Contract configuration
export const MULTISIG_CONTRACT_ADDRESS = "0xcAEe2314fE1b00ec49688317BDFB6C9D662f913b" as Address;

// Import ABI from local file with fallback
// Users need to copy their compiled ABI to src/abi/SimpleERC20Multisig.json
const MULTISIG_ABI = multiSigABI;

export { MULTISIG_ABI };

// Transaction structure matching the contract
export interface Transaction {
    to: string;
    amount: bigint;
    executed: boolean;
    confirmations: bigint;
}

// Enhanced transaction data with additional UI info
export interface TransactionWithId extends Transaction {
    id: number;
    status: 'pending' | 'executed';
    formattedAmount: string;
}
