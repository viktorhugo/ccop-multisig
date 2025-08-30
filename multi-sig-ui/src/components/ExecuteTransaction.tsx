'use client';

import { useState } from 'react';
import { getWalletClient } from '@/lib/viem';
import { MULTISIG_CONTRACT_ADDRESS, MULTISIG_ABI } from '@/lib/contract';
import { Check, Loader, Zap } from 'lucide-react';

interface ExecuteTransactionProps {
    transactionId: number;
    confirmations: bigint;
    threshold: number;
    executed: boolean;
    onTransactionExecuted?: () => void;
}

export function ExecuteTransaction({
    transactionId,
    confirmations,
    threshold,
    executed,
    onTransactionExecuted
}: ExecuteTransactionProps) {
    const [isExecuting, setIsExecuting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleExecute = async () => {
        setError(null);
        setSuccess(false);
        setIsExecuting(true);

        try {
            const walletClient = getWalletClient();
            const [account] = await walletClient.getAddresses();
            if (!account) {
                throw new Error('Please connect your wallet first');
            }

            const hash = await walletClient.writeContract({
                address: MULTISIG_CONTRACT_ADDRESS,
                abi: MULTISIG_ABI,
                functionName: 'executeTransaction',
                args: [BigInt(transactionId)],
                account,
            });

            setSuccess(true);
            if (onTransactionExecuted) {
                onTransactionExecuted();
            }

            setTimeout(() => setSuccess(false), 3000);
            console.log('Transaction executed with hash:', hash);
        } catch (err) {
            console.error('Error executing transaction:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to execute transaction';
            setError(errorMessage);
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsExecuting(false);
        }
    };

    if (executed || Number(confirmations) < threshold) {
        return null;
    }

    return (
        <div className="w-full">
            <button
                onClick={handleExecute}
                disabled={isExecuting || success}
                className="w-full cursor-pointer px-4 py-2 bg-[#FBB701] text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-semibold"
            >
                {isExecuting ? (
                    <>
                        <Loader className="animate-spin w-4 h-4 mr-2" />
                        Executing...
                    </>
                ) : success ? (
                    <>
                        <Check className="w-4 h-4 mr-2" />
                        Executed!
                    </>
                ) : (
                    <>
                        <Zap className="w-4 h-4 mr-2" />
                        Execute Transaction
                    </>
                )}
            </button>

            {/* Error Message */}
            {error && (
                <div className="mt-2 text-xs text-red-400 text-center">
                    {error}
                </div>
            )}
        </div>
    );
}