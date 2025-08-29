import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WalletMinimal } from "lucide-react"

export const NotWalletConnected = () => {
    return (
        <Alert className="max-w-md mx-4 border-10 border-[#FBB701] rounded-4xl p-4 text-dark ">
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
