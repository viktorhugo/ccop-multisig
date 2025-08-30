'use client';

import { useState } from 'react';
import { getWalletClient } from '@/lib/viem';
import { MULTISIG_CONTRACT_ADDRESS, MULTISIG_ABI } from '@/lib/contract';
import { Check, Loader, ShieldCheck } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Address } from 'viem';

interface ConfirmTransactionProps {
    transactionId: number;
    confirmations: bigint;
    threshold: number;
    executed: boolean;
    onTransactionConfirmed?: () => void;
}

export function ConfirmTransaction({
    transactionId,
    onTransactionConfirmed,
    executed
}: ConfirmTransactionProps) {

    const { address: userAddress } = useAccount();
    const walletClient = getWalletClient();
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleConfirm = async () => {
        setError(null);
        setSuccess(false);
        setIsConfirming(true);

        try {
            
            if (!userAddress) {
                throw new Error('Please connect your wallet first');
            }

            const hash = await walletClient.writeContract({
                address: MULTISIG_CONTRACT_ADDRESS,
                abi: MULTISIG_ABI,
                functionName: 'confirmTransaction',
                args: [BigInt(transactionId)],
                account: userAddress as Address,
            });

            setSuccess(true);
            if (onTransactionConfirmed) {
                onTransactionConfirmed();
            }

            setTimeout(() => setSuccess(false), 3000);
            console.log('Transaction confirmed with hash:', hash);
        } catch (err) {
            console.error('Error confirming transaction:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to confirm transaction';
            setError(errorMessage);
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsConfirming(false);
        }
    };

    if (executed) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Action Button */}
            <button
                onClick={handleConfirm}
                disabled={isConfirming || success}
                className="w-full cursor-pointer px-4 py-2 bg-[#1E8848] border border-[#1E8848]/80 text-white rounded-lg hover:bg-[#1E8848]/40 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-semibold"
            >
                {isConfirming ? (
                    <>
                        <Loader className="animate-spin w-4 h-4 mr-2" />
                        Confirming...
                    </>
                ) : success ? (
                    <>
                        <Check className="w-4 h-4 mr-2" />
                        Confirmed!
                    </>
                ) : (
                    <>
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Confirm Transaction
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