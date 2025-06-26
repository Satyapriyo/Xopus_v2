'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWalletClient } from 'wagmi'
import { useEffect, useRef } from 'react'
import { getX402PaymentService } from '../lib/x402-contract'

interface WalletConnectProps {
  onConnect: (address: string) => void
  isConnected: boolean
  address?: string
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const connectedOnce = useRef(false)

  useEffect(() => {
    if (isConnected && address && !connectedOnce.current) {
      connectedOnce.current = true
      onConnect(address)
      if (walletClient) {
        const paymentService = getX402PaymentService()
        if (paymentService) {
          paymentService.setWalletClient(walletClient)
        }
      }
    }
  }, [isConnected, address, onConnect, walletClient])

  return <ConnectButton />
}
