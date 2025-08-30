'use client';

import { useState } from 'react';
import { Abi, Address, parseUnits } from 'viem';
import { MULTISIG_CONTRACT_ADDRESS, MULTISIG_ABI } from '@/lib/contract';
import { cCOP_ABI } from '@/abi/cCOPABI';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { config } from '@/config';
import { useNotify } from '@/context/NotifyContext';
import { AlertTriangle, CheckCircle, ChevronsRight, Info, Loader, PlusCircle } from 'lucide-react';

export function DepositTokens() {

    const { address: userAddress } = useAccount();
    const { notify } = useNotify();
    
    const [amount, setAmount] = useState('');
    const [needsApproval, setNeedsApproval] = useState(false);
    const [logicError, setLogicError] = useState<string | null>(null);


    const resetForm = () => {
        setAmount('');
        resetApprove();
        resetDeposit();
        refetchAllowanceFunc();
        setNeedsApproval(false);
    };

    // read contract for get address token
    const { data: tokenAddress } = useReadContract({
        abi: MULTISIG_ABI as Abi,
        address: MULTISIG_CONTRACT_ADDRESS as Address,
        functionName: "token",
        config,
    });

    // read contract for get address token
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        abi: cCOP_ABI,
        address: tokenAddress as Address,
        functionName: 'allowance',
        args: [userAddress as Address, MULTISIG_CONTRACT_ADDRESS],
        config,
    });

    // For deposit on the multisig contract
    const {
        data: depositHash,
        isPending: isDepositPending,
        writeContract: makeDeposit,
        status: depositStatus,
        error: depositError,
        reset: resetDeposit,
    } = useWriteContract();

    const { isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
        hash: depositHash,
    })
    console.log("Deposit Status:", depositStatus, "Error:", depositError);

    // For approve the multisig contract to spend tokens
    const {
        data: approveHash,
        isPending: isApprovePending,
        writeContract: approveDeposit,
        status: approveStatus,
        error: approveError,
        reset: resetApprove,
    } = useWriteContract();

    const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveHash,
    })
    // console.log("Approve Status:", approveStatus, "Error:", approveError);
    
    // Check if we have enough allowance
    const checkAllowance = (amountInWei: bigint) => {
        const res = allowance as bigint  >= amountInWei;
        console.log("Check Allowance:", res, "Needed:", amountInWei, "Have:", allowance);
        return res;
    };

    // Function to refetch allowance
    const refetchAllowanceFunc = async () => {
        await refetchAllowance();
        console.log('allowance', allowance);
        
    }
    // Approve function
    const handleApprove = async () => {

        try {
            const amountValue = parseFloat(amount);
            if (isNaN(amountValue) || amountValue <= 0) {
                throw new Error('Please enter a valid amount greater than 0');
            }
            
            const amountInWei = parseUnits(amount, 18);

            if (!userAddress) throw new Error('Please connect your wallet first');

            // Approve the multisig contract to spend tokens
            await approveDeposit({
                address: tokenAddress as Address,
                abi: cCOP_ABI,
                functionName: 'approve',
                args: [MULTISIG_CONTRACT_ADDRESS, amountInWei],
                account: userAddress as Address,
            });

            // setNeedsApproval(false);
        } catch (err) {
            console.error('Error approving tokens:', err);
            setLogicError(err instanceof Error ? err.message : 'Failed to approve tokens');
            setTimeout(() => setLogicError(null), 10000); // Clear logic error after 10 seconds
        }
    };

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                console.log("Needs approval to proceed");
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
                notify('success', 'Tokens deposited successfully!', { position: 'top-right' });
            }

            console.log('Deposit transaction hash:', depositHash);
        } catch (err) {
            console.error('Error depositing tokens:', err);
            setLogicError(err instanceof Error ? err.message : 'Failed to deposit tokens');
            setTimeout(() => setLogicError(null), 10000); // Clear logic error after 10 seconds
        }
    };

    if (approveError) {
        notify('error', `Approval Error: ${approveError.message}`, { position: 'top-right' });
    }

    if (depositError) {
        notify('error', `Approval Error: ${depositError.message}`, { position: 'top-right' });
    }

    if (isApproveSuccess) {
        // set time to refetch allowance
        setTimeout(() => refetchAllowanceFunc(), 1500)
    }

    if (isDepositSuccess) {
        // Clear logic error after 1.5 seconds
        setTimeout(() => resetForm(), 1500);
    }
    
    return (
        
        <div className="bg-[#202020] shadow-md shadow-gray-600 border-[#FBB701]/30 rounded-3xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#FBB701]">Deposit Tokens</h3>
                <PlusCircle size={24} className="text-[#FBB701]" />
            </div>

            <form onSubmit={handleDeposit} className="space-y-4">
                {/* Success Message */}
                {isDepositSuccess && (
                    <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-center text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Tokens deposited successfully!
                        </div>
                    </div>
                )}
                
                {isApproveSuccess && (
                    <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-center text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approval successful! Ready to deposit.
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {logicError && (
                    <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <div className="flex items-center text-red-400 text-sm">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {logicError}
                        </div>
                    </div>
                )}

                {/* Approval Needed Message */}
                {needsApproval && approveStatus !== 'success' && (
                    <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="text-sm text-yellow-300">
                                <p className="font-medium">Approval Required</p>
                                <p>You need to approve the multisig contract to spend your tokens first.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Amount Input */}
                <div>
                    <label htmlFor="deposit-amount" className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
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
                        className="w-full px-3 py-2 bg-[#202020]/70 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#FBB701] focus:border-[#FBB701] transition-colors"
                        disabled={isDepositPending || isApprovePending}
                    />
                </div>

                {/* Info Box */}
                <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-sm text-blue-300">
                            <p>Deposit tokens to make them available for multisig transactions.</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                    {needsApproval && (
                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={approveStatus === 'pending' || approveStatus === 'success'}
                            className="cursor-pointer flex-1 px-4 py-2 bg-[#FBB701] text-black rounded-lg hover:bg-[#FBB701] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-semibold"
                        >
                            {approveStatus === 'pending' ? (
                                <>
                                    <Loader className="animate-spin w-4 h-4 mr-2" />
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <ChevronsRight className="w-4 h-4 mr-2" />
                                    Approve Tokens
                                </>
                            )}
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={approveStatus === 'pending' || depositStatus === 'pending' || !amount || parseFloat(amount) <= 0 || (needsApproval && !isApproveSuccess)}
                        className="cursor-pointer flex-1 px-4 py-2 bg-[#FBB701] text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-semibold"
                    >
                        {depositStatus === 'pending' ? (
                            <>
                                <Loader className="animate-spin w-4 h-4 mr-2" />
                                Depositing...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Deposit Tokens
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}