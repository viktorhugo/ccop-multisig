import { TransactionContract, TransactionWithId } from "./contract";
import { formatUnits } from "viem";
import { request, gql } from "graphql-request";
import { AllTransactions, TransactionsData } from "@/app/interfaces/indexer";

const SUBGRAPH_URL ='http://localhost:4001/graphql';

const query = gql`
    query {
        allSubmitTransactions {
            nodes {
            nodeId
            rindexerId
            contractAddress
            owner
            txId
            to
            amount
            txHash
            blockNumber
            blockHash
            network
            txIndex
            logIndex
            }
        }
        allConfirmTransactions {
            nodes {
            nodeId
            rindexerId
            contractAddress
            owner
            txId
            txHash
            blockNumber
            blockHash
            network
            txIndex
            logIndex
            }
        }
        allDeposits {
            nodes {
            nodeId
            rindexerId
            contractAddress
            sender
            amount
            txHash
            blockNumber
            blockHash
            network
            txIndex
            logIndex
            }
        }
        allExecuteTransactions {
            nodes {
            nodeId
            rindexerId
            contractAddress
            owner
            txId
            txHash
            blockNumber
            blockHash
            network
            txIndex
            logIndex
            }
        }
    }

`;

export async function fetchAllTransactions(): Promise<AllTransactions> {
    try {
        const headers: HeadersInit = {};
        // if (API_KEY) { headers["Authorization"] = `Bearer ${API_KEY}`; }
        const response = await request<AllTransactions>(`${SUBGRAPH_URL}`, query)
    
        return response;
    } catch (error) {
        console.log(error);
        throw new Error('Network response was not ok');
    }
}
