'use client';

import { Navbar } from '@/components/Navbar';
import { ProcessComponent } from '@/components/ProcessComponent';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WalletMinimal } from "lucide-react"
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
          <Alert className="max-w-md mx-4">
            <WalletMinimal className="h-4 w-4" />
            <AlertTitle>No Wallet Connected</AlertTitle>
            <AlertDescription>
              <span>
                Please connect your wallet to interact with the multisig.
              </span>
              <div className='flex justify-center mt-2 w-full'>
                <appkit-button />
              </div>
            </AlertDescription>
          </Alert>
        )
      }
      </main>
      

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Multisig Wallet Interface - Built with Next.js, Wagmi, Viem and ThirdWeb 
          </p>
        </div>
      </footer>
    </div>
  );
}
