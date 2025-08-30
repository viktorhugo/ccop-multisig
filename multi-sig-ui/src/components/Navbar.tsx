import { MULTISIG_CONTRACT_ADDRESS } from '@/lib/contract';
import React from 'react';

export const Navbar = () => {
return (
        <header className="bg-[#202020] shadow-xl shadow-gray-600 rounded-xl m-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark bg-[#FBB701] w-fit">Multisig Wallet</h1>
                    <p className="mt-1 text-sm text-zinc-300">
                        Monitor and manage your multisig transactions
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                    {/* Contract Address */}
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-400 font-mono">Contract Address</p>
                        <p className="text-xs font-mono text-white bg-[#1E8847] px-2 py-1 rounded break-all">
                        { MULTISIG_CONTRACT_ADDRESS }
                        </p>
                    </div>
                    {/* Wallet Connection */}
                    <div className="self-start sm:self-auto">
                        {/* <WalletConnectionButton /> */}
                        <appkit-button />
                    </div>
                </div>
            </div>
            </div>
        </header>
    )
}
