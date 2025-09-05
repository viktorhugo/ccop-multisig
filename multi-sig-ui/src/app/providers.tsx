"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function     QueryProviders({ children }: { children: ReactNode }) {
    // Creamos un QueryClient por sesión (no global singleton)
    const [client] = useState(() => new QueryClient());

    return (
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        );
}
