'use client';

import { useState } from 'react';
import { Abi, Address, parseUnits } from 'viem';
import { getWalletClient, publicClient } from '@/lib/viem';
import { MULTISIG_CONTRACT_ADDRESS, MULTISIG_ABI } from '@/lib/contract';
import { cCOP_ABI } from '@/abi/cCOPABI';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { config } from '@/config';
import { useNotify } from '@/context/NotifyContext';

export function DepositTokens() {

    const { address: userAddress } = useAccount();
    const { notify } = useNotify();
    

    const [amount, setAmount] = useState('');
    const [isDepositing, setIsDepositing] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsApproval, setNeedsApproval] = useState(false);

    const resetForm = () => {
        setAmount('');
        setError(null);
        setNeedsApproval(false);
    };

    // read contract for get address token
    const { data: tokenAddress, isLoading: tokenAddressLoading, error: tokenAddressError } = useReadContract({
        abi: MULTISIG_ABI as Abi,
        address: MULTISIG_CONTRACT_ADDRESS as Address,
        functionName: "token",
        config,
    });
    console.log("Token Address Data:", tokenAddress, "Loading:", tokenAddressLoading, "Error:", tokenAddressError);

    // read contract for get address token
    const { data: allowance, isLoading: allowanceLoading, error: allowanceError, refetch: refetchAllowance } = useReadContract({
        abi: cCOP_ABI,
        address: tokenAddress as Address,
        functionName: 'allowance',
        args: [userAddress as Address, MULTISIG_CONTRACT_ADDRESS],
        config,
    });
    console.log("Allowance Data:", allowance, "Loading:", allowanceLoading, "Error:", allowanceError);

    // For deposit on the vault
    const {
        data: depositHash,
        isPending: isDepositPending,
        writeContract: makeDeposit,
        status: depositStatus,
        error: depositError,
    } = useWriteContract();

    const { isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
        hash: depositHash,
    })
    

    const checkAllowance = async (amountInWei: bigint) => {
        return allowance as bigint  >= amountInWei;
    };

    const refetchAllowanceFunc = async () => {
        await refetchAllowance();
    }


    const handleApprove = async () => {
        setError(null);
        setIsApproving(true);

        try {
            const amountValue = parseFloat(amount);
            if (isNaN(amountValue) || amountValue <= 0) {
                throw new Error('Please enter a valid amount greater than 0');
            }

            const amountInWei = parseUnits(amount, 18);
            const walletClient = getWalletClient();

            if (!userAddress) {
                throw new Error('Please connect your wallet first');
            }

            // Get token address from contract
            const tokenAddress = await publicClient.readContract({
                address: MULTISIG_CONTRACT_ADDRESS,
                abi: MULTISIG_ABI,
                functionName: 'token',
            }) as string;

            // Approve the multisig contract to spend tokens
            const hash = await walletClient.writeContract({
                address: tokenAddress as Address,
                abi: cCOP_ABI,
                functionName: 'approve',
                args: [MULTISIG_CONTRACT_ADDRESS, amountInWei],
                account: userAddress as Address,
            });

            console.log('Approval transaction hash:', hash);
            setNeedsApproval(false);
        } catch (err) {
            console.error('Error approving tokens:', err);
            setError(err instanceof Error ? err.message : 'Failed to approve tokens');
        } finally {
            setIsApproving(false);
        }
    };

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsDepositing(true);

        try {
            // Validation
            if (!amount) { throw new Error('Please enter an amount');}

            const amountValue = parseFloat(amount);
            if (isNaN(amountValue) || amountValue <= 0) {
                throw new Error('Please enter a valid amount greater than 0');
            }

            const amountInWei = parseUnits(amount, 18);

            if (!userAddress) {
                throw new Error('Please connect your wallet first');
            }

            // Check if we have enough allowance
            await refetchAllowanceFunc();

            if (!checkAllowance(amountInWei)) {
                setNeedsApproval(true);
                setIsDepositing(false);
                return;
            }

            // Deposit tokens to the contract
            await makeDeposit({
                address: MULTISIG_CONTRACT_ADDRESS,
                abi: MULTISIG_ABI,
                functionName: 'depositTokens',
                args: [amountInWei],
                account: userAddress as Address,
            });
            //IF success
            if (isDepositSuccess) {
                resetForm();
                notify('success', 'Tokens deposited successfully!');
            }

            console.log('Deposit transaction hash:', depositHash);
        } catch (err) {
            console.error('Error depositing tokens:', err);
            setError(err instanceof Error ? err.message : 'Failed to deposit tokens');
        } finally {
            setIsDepositing(false);
        }
    };

    
    return (
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Deposit Tokens</h3>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4">
                {/* Success Message */}
                {
                    // success && (
                    //     <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    //         <div className="flex items-center text-green-800 text-sm">
                    //             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    //             </svg>
                    //             Tokens deposited successfully!
                    //         </div>
                    //     </div>
                    // )
                }

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center text-red-800 text-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {/* Approval Needed Message */}
                {needsApproval && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                            <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium">Approval Required</p>
                                <p>You need to approve the multisig contract to spend your tokens first.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Amount Input */}
                <div>
                    <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (Tokens)
                    </label>
                    <input
                        type="number"
                        id="deposit-amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0"
                        step="any"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        disabled={isDepositing || isApproving}
                    />
                </div>

                {/* Info Box */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                        <svg className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-green-800">
                            <p>Deposit tokens to make them available for multisig transactions.</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    {needsApproval && (
                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={isApproving}
                            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isApproving ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Approve Tokens
                                </>
                            )}
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isDepositing || isApproving || needsApproval}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        {isDepositing ? (
                            <>
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                Depositing...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Deposit Tokens
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
