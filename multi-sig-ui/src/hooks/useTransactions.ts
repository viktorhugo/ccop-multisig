import { useState, useEffect, useCallback } from 'react';
import { Abi, Address, formatUnits } from 'viem';
import { publicClient } from '@/lib/viem';
import { MULTISIG_CONTRACT_ADDRESS, MULTISIG_ABI, FullIndexerTransaction } from '@/lib/contract';
import { useReadContract } from 'wagmi';
import { config } from '@/config';
import { fetchAllTransactions } from '@/lib/fetchAllTransactions';


export function useTransactions() {
    const [transactions, setTransactions] = useState<FullIndexerTransaction[]>([]);
    const [threshold, setThreshold] = useState<number>(2);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { refetch: refetchThreshold } = useReadContract({
        abi: MULTISIG_ABI as Abi,
        address: MULTISIG_CONTRACT_ADDRESS as Address,
        functionName: "threshold",
        config,
    });

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: newThreshold } = await refetchThreshold();
            // set threshold
            if (newThreshold) setThreshold(Number(newThreshold));

            const allTransactions = await fetchAllTransactions();
            const fetchedTransactions: FullIndexerTransaction[] = [];
            const submitTransactions = allTransactions.allSubmitTransactions.nodes;
            // get all transactions from smart contract
            for await (const submitTx of submitTransactions) {
                const transaction = await publicClient.readContract({
                    address: MULTISIG_CONTRACT_ADDRESS,
                    abi: MULTISIG_ABI,
                    functionName: 'transactions',
                    args: [submitTx.txId],
                }) as [string, bigint, boolean, bigint];

                const [to, amount, executed, confirmations] = transaction;
                
                const newFullTransaction: FullIndexerTransaction = {
                    id: Number(submitTx.txId),
                    ...submitTx,
                    to,
                    amount,
                    executed,
                    confirmations,
                    status: executed ? 'executed' : 'pending',
                    formattedAmount: formatUnits(amount, 18), // Assuming 18 decimals for ERC20 token
                };
                fetchedTransactions.push(newFullTransaction);
            }

            setTransactions(fetchedTransactions.reverse());
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    }, [refetchThreshold]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        threshold,
        loading,
        error,
        refetch: fetchTransactions,
    };
}
