'use client';

import { Navbar } from '@/components/Navbar';
import { NotWalletConnected } from '@/components/NotWalletConnected';
import { ProcessComponent } from '@/components/ProcessComponent';
import { useAccount } from 'wagmi';

export default function Home() {

  const { isConnected } = useAccount();
  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
      {
        isConnected ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <ProcessComponent />
          </div>
        ): (
          <NotWalletConnected />
        )
      }
      </main>
      

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Multisig Wallet Interface - Built with Next.js, Wagmi, Viem and ReownAppKit 
          </p>
        </div>
      </footer>
    </div>
  );
}
