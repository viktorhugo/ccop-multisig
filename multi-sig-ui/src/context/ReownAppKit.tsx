'use client'

import { wagmiAdapter, projectId } from "../config/index";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { mainnet, sepolia, celoAlfajores} from '@reown/appkit/networks';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
    throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
    name: 'Celo Multisig dApp',
    description: 'A simple Multisig dApp for Celo',
    url: '', // origin must match your domain & subdomain
    icons: []
}

// Create the modal
createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [mainnet, sepolia, celoAlfajores],
    defaultNetwork: mainnet,
    metadata: metadata,
    themeMode: 'dark',
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
        allWallets: true, 
        email: true,
        socials: ['google', 'github', 'discord'],
        emailShowWallets: true
    },
    themeVariables: {
        '--w3m-accent': '#000000',
    }
});

//*  === This is the context provider that wraps the app and initializes the AppKit ===

function ContextReownAppKitProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

export default ContextReownAppKitProvider;