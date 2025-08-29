'use client';

import { useState, useEffect } from 'react';
import { Abi, Address, formatUnits } from 'viem';

import { MULTISIG_CONTRACT_ADDRESS, MULTISIG_ABI } from '@/lib/contract';
import { watchContractEvent } from '@wagmi/core'
import { configWss } from '@/config/index-wss';
import { useReadContract } from 'wagmi';
import { config } from '@/config';
import { useNotify } from '@/context/NotifyContext';
import { BadgeCheck, RefreshCw } from 'lucide-react';
import { Skeleton } from './ui/skeleton';



export function MultisigBalance() {

    const [balance, setBalance] = useState<string | null>(null);
    const [tokenAddress, setTokenAddress] = useState<string | null>(null);
    const { notify } = useNotify();

    // read contract for get the contract balance
    const { data: tokenBalanceData, isLoading: tokenBalanceLoading, error: tokenBalanceError, refetch: refetchTokenBalance } = useReadContract({
        abi: MULTISIG_ABI as Abi,
        address: MULTISIG_CONTRACT_ADDRESS as Address,
        functionName: "tokenBalance",
        config,
    });

    console.log("Token Balance Data:", tokenBalanceData, "Loading:", tokenBalanceLoading, "Error:", tokenBalanceError);
    
    // read contract for get address token
    const { data: tokenData, isLoading: tokenLoading, error: tokenError } = useReadContract({
        abi: MULTISIG_ABI as Abi,
        address: MULTISIG_CONTRACT_ADDRESS as Address,
        functionName: "token",
        config,
    });

    useEffect(() => {
        if (tokenBalanceData) {
            const formattedBalance = formatUnits(tokenBalanceData as bigint, 18);
            setBalance(formattedBalance);
        }
        if (tokenData) {
            setTokenAddress(tokenData as string);
        }

        // Watch for Deposit events to update balance in real-time
        const unwatch = watchContractEvent(configWss, 
                {
                address: MULTISIG_CONTRACT_ADDRESS as Address,
                abi: MULTISIG_ABI as Abi,
                eventName: 'Deposit',
                batch: true,
                onLogs: (logs) => {
                    console.log('New logs Deposit!', logs);
                    setTimeout(() => {
                        console.log('Refetching token balance...');
                        notify('success', 'Deposit detected, balance updated.');
                        refetchTokenBalance();
                    }, 1000)
                },
            }
        );

        return () => unwatch();
    }, [refetchTokenBalance, tokenBalanceData, tokenData]);

    const refetchTokenBalanceFunc = async () => {
        console.log("refetchTokenBalanceFunc called");
        try {
            await refetchTokenBalance();
            notify('success', 'Balance refreshed!');
        } catch (error) {
            console.error("Error refetching balance:", error);
            notify('error', 'Failed to refresh balance.');
        }
    }

    if (tokenError) {
        notify('error', 'Error fetching token address.');
    }

    if (tokenBalanceError) {
        notify('error', 'Error fetching token balance.');
    }

    return (
        <div className="bg-[#202020] border border-[#FBB701]/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#FBB701]">Multisig Balance</h3>
                <BadgeCheck size={24} className="text-green-500" />
            </div>
            {
                tokenBalanceLoading ? (
                    <div className="mb-5">
                        <Skeleton className="h-[70px] w-[250px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full mt-2" />
                        </div>
                    </div>
                ) : (
                    // Balance Display
                    <div className="mb-5">
                        <div className="text-4xl font-extrabold text-white tracking-tight">
                            {parseFloat(balance || '0').toLocaleString()}
                            <span className="font-medium text-2xl text-gray-300 ml-4">cCop</span>
                        </div>

                        {/* Visual balance indicator (progress-like) */}
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className={`
                                h-2 rounded-full transition-all duration-500 ${
                                balance && parseFloat(balance) > 0 ? 'bg-[#1E8847]' : 'bg-gray-500'
                            }`}
                            style={{
                                width: `${Math.min(
                                    100,
                                    parseFloat(balance || '0') / 100
                                )}%`, // simulado
                            }}
                        ></div>
                        </div>
                    </div>
                )
            }

            {
                tokenLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px] mt-2" />
                        <Skeleton className="h-8 w-full mt-2" />
                    </div>
                ) : (
                    // Token Address token
                    <div className="mb-5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Token Address
                        </label>
                        <div className="mt-1 text-sm font-mono text-gray-100 bg-[#202020]/70 px-3 py-2 rounded-lg border border-gray-600 break-all">
                        {tokenAddress}
                        </div>
                    </div>
                )
            }

            {/* Balance Status Indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div
                className={`flex items-center text-sm font-medium ${
                    balance && parseFloat(balance) > 0 ? 'text-green-600' : 'text-gray-400'
                }`}
                >
                <div
                    className={`w-2.5 h-2.5 rounded-full mr-2 animate-pulse ${
                        balance && parseFloat(balance) > 0 ? 'bg-green-400' : 'bg-gray-500'
                    }`}
                ></div>
                    {balance && parseFloat(balance) > 0 ? 'Funds Available' : 'No Funds'}
                </div>

                <div className='cursor-pointer' onClick={refetchTokenBalanceFunc}>
                    <RefreshCw size={24} className="text-[#FBB701]" />
                </div>
            </div>
        </div>
    );
}
