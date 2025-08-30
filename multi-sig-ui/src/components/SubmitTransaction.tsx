'use client';

import { useState } from 'react';
import { parseUnits, isAddress, Address } from 'viem';
import { MULTISIG_CONTRACT_ADDRESS, MULTISIG_ABI } from '@/lib/contract';
import { AlertTriangle, BanknoteArrowUp, CheckCircle, Info, Loader, Send } from 'lucide-react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';


export function SubmitTransaction() {
    const { address: userAddress } = useAccount();
    const [formData, setFormData] = useState({
        recipient: '',
        amount: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const resetForm = () => {
        setFormData({ recipient: '', amount: '' });
        resetSubmitTransaction();
    };

    // For submitTransaction on the multisig contract
    const {
        data: submitTransactionHash,
        writeContract: submitTransaction,
        status: submitTransactionStatus,
        error: submitTransactionError,
        reset: resetSubmitTransaction,
    } = useWriteContract();

    const { isSuccess: isSubmitTransactionSuccess } = useWaitForTransactionReceipt({
        hash: submitTransactionHash,
    })
    console.log("Submit Transaction:", submitTransactionStatus, "Error:", submitTransactionError);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);

        try {
            // Validation
            if (!formData.recipient || !formData.amount) {
                throw new Error('Please fill in all fields');
            }

            if (!isAddress(formData.recipient)) {
                throw new Error('Please enter a valid Ethereum address');
            }

            const amount = parseFloat(formData.amount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount greater than 0');
            }

            // Convert amount to wei (assuming 18 decimals)
            const amountInWei = parseUnits(formData.amount, 18);

            // Submit transaction to the contract
            await submitTransaction({
                address: MULTISIG_CONTRACT_ADDRESS,
                abi: MULTISIG_ABI,
                functionName: 'submitTransaction',
                args: [formData.recipient as Address, amountInWei],
                account: userAddress,
            });

        } catch (err) {
            console.error('Error submitting transaction:', err);
            setError(err instanceof Error ? err.message : 'Failed to submit transaction');
            setTimeout(() => setError(null), 5000); // Auto-clear error
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitTransactionSuccess) {
        resetForm();
        // Auto-clear success message after 3 seconds
        setTimeout(() => {
            setSuccess(false);
        }, 3000);
        //TODO refresh transaction list
    }

    return (
        <div className="bg-[#256e41] border-10 border-[#FBB701] shadow-md shadow-gray-600 rounded-4xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zinc-100">Submit New Transaction</h3>
                <BanknoteArrowUp size={26} className="text-[#FBB701]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Success Message */}
                {
                    isSubmitTransactionSuccess && (
                        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                            <div className="flex items-center text-green-400 text-sm">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Transaction submitted successfully!
                            </div>
                        </div>
                    )
                }

                {/* Error Message */}
                {
                    error && (
                        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                            <div className="flex items-center text-red-400 text-sm">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        </div>
                    )
                }

                <div className="flex items-center justify-center gap-4">
                    {/* Recipient Address */}
                    <div className='w-[67%]'>
                        <label htmlFor="recipient" className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">
                            Recipient Address
                        </label>
                        <input
                            type="text"
                            id="recipient"
                            value={formData.recipient}
                            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                            placeholder="0x..."
                            className="w-full px-3 py-2 bg-[#202020]/70 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-[#FBB701] focus:border-[#FBB701] transition-colors font-mono text-sm"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Amount */}
                    <div className='w-[33%]'>
                        <label htmlFor="amount" className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">
                            Amount (Tokens)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.0"
                            step="any"
                            min="0"
                            className="w-full px-3 py-2 bg-[#202020]/70 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-[#FBB701] focus:border-[#FBB701] transition-colors"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Info Box */}
                <div className="p-3 bg-zinc-900/20 border border-zinc-500/60 rounded-lg">
                    <div className="flex items-start">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-sm text-zinc-300">
                            <p>Other owners will need to confirm this transaction before it can be executed.</p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={submitTransactionStatus === 'pending' || isSubmitting}
                        className="cursor-pointer px-6 py-2 bg-[#FBB701] text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-semibold"
                    >
                        {
                            isSubmitting || submitTransactionStatus === 'pending' ? (
                                <>
                                    <Loader className="animate-spin w-4 h-4 mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Transaction
                                </>
                            )
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}