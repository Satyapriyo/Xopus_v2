'use client'

import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState, useMemo } from 'react'
import { createClientWagmiConfig } from '../lib/wagmi-config-client'
import { baseSepolia } from 'wagmi/chains'
import '@rainbow-me/rainbowkit/styles.css'

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Memoize QueryClient to prevent recreation on every render
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1, // Reduce retries to prevent memory buildup
        refetchOnMount: false,
      },
      mutations: {
        retry: 1,
      },
    },
  }), [])

  // Memoize wagmi config to prevent recreation
  const wagmiConfig = useMemo(() => {
    if (typeof window !== 'undefined') {
      return createClientWagmiConfig()
    }
    return null
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !wagmiConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          initialChain={baseSepolia}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}