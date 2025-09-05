import { Address } from "viem";

export interface TransactionsData {
    allTransactions: AllTransactions;
}

export interface AllTransactions {
    allSubmitTransactions:  All;
    allConfirmTransactions: All;
    allDeposits:            All;
    allExecuteTransactions: All;
}

export interface All {
    nodes: IndexerTransaction[];
}

export interface IndexerTransaction {
    nodeId:          string;
    rindexerId:      number;
    contractAddress: string;
    owner:          string;
    txId:           string;
    txHash:          string;
    blockNumber:     string;
    blockHash:       string;
    network:         string;
    txIndex:         string;
    logIndex:        string;
    sender:         string;
    amount:         string;
    to:             string;
}