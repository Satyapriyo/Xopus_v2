'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Plus, Wallet, AlertTriangle, Info } from 'lucide-react'
import { useAccount, useBalance } from 'wagmi'
import { getX402PaymentService } from '../lib/x402-contract'
import PaymentModal from './PaymentModal'
import { formatEther } from 'viem'

interface CreditBalanceProps {
  credits: number
  onCreditsUpdate: (newCredits: number) => void
  compact?: boolean // New prop for navbar vs full view
}

export default function CreditBalance({ credits, onCreditsUpdate, compact = false }: CreditBalanceProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<string>('0.0001')
  const [contractInfo, setContractInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()

  // Get ETH balance from wallet
  const { data: balance } = useBalance({
    address: address,
  })

  const queryPrice = 0.10 // $0.10 per query
  const queriesRemaining = Math.floor(credits / queryPrice)
  const ethBalance = balance ? parseFloat(formatEther(balance.value)) : 0

  useEffect(() => {
    loadPaymentAmount()

    // Set up payment listener
    if (address) {
      const paymentService = getX402PaymentService()
      if (paymentService) {
        paymentService.listenForPayments(address, (amount, txHash) => {
          // Convert ETH amount to USD using the service method
          const usdAmount = paymentService.convertEthToUsd(amount as any, 3000)
          onCreditsUpdate(credits + usdAmount)
        })
      }
    }
  }, [address, credits, onCreditsUpdate])

  const loadPaymentAmount = async () => {
    setIsLoading(true)
    try {
      const paymentService = getX402PaymentService()
      if (paymentService) {
        const [amount, info] = await Promise.all([
          paymentService.getPaymentAmount(),
          paymentService.getContractInfo()
        ])
        const formattedAmount = paymentService.formatPaymentAmount(amount)
        setPaymentAmount(formattedAmount)
        setContractInfo(info)
      }
    } catch (error) {
      console.error('Error loading payment amount:', error)
      // Set default values for testnet
      setPaymentAmount('0.0001')
    } finally {
      setIsLoading(false)
    }
  }

  const hasInsufficientCredits = credits < queryPrice
  const hasInsufficientEth = ethBalance < parseFloat(paymentAmount)
  const estimatedCredits = parseFloat(paymentAmount) * 3000 // $3000 ETH price for testnet

  // Compact version for navbar
  if (compact) {
    return (
      <>
        <div className="flex items-center space-x-3 text-black">
          {/* Credits Display */}
          <div className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-300/30">
            <CreditCard className="w-4 h-4 text-black" />
            <div className="text-black">
              <span className="text-sm font-medium">${credits.toFixed(2)}</span>
              <span className="text-xs text-black ml-1">credits</span>
            </div>
          </div>

          {/* Add Credits Button */}
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center space-x-1 bg-blue-500/30 hover:bg-blue-500/50 text-black hover:text-gray-700 px-3 py-2 rounded-lg transition-all duration-200 text-sm border border-blue-300/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={(amount) => {
            onCreditsUpdate(credits + amount)
            setShowPaymentModal(false)
          }}
        />
      </>
    )
  }

  // Full version for chat interface

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-lg max-w-md mx-auto">
        {/* Main Balance Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Available Credits</p>
              <p className="text-xl font-bold text-blue-900">${credits.toFixed(2)}</p>
              <p className="text-xs text-blue-500">{queriesRemaining} queries remaining</p>
            </div>
          </div>

          {/* Add Credits Button - Always Visible */}
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add Credits</span>
              </>
            )}
          </button>
        </div>

        {/* Wallet Balance Display */}
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">Wallet Balance:</span>
            </div>
            <span className="text-sm font-bold text-blue-800">{ethBalance.toFixed(6)} ETH</span>
          </div>
        </div>

        {/* Status Messages */}
        {hasInsufficientEth ? (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Insufficient ETH!</p>
                <p>You need at least {paymentAmount} ETH to make a payment.</p>
                <p className="text-xs mt-1">Get testnet ETH from a Base Sepolia faucet.</p>
              </div>
            </div>
          </div>
        ) : hasInsufficientCredits ? (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-700">
                <p className="font-medium">Insufficient credits!</p>
                <p>Pay {paymentAmount} ETH via X402 to add ${estimatedCredits.toFixed(2)} in credits.</p>
                <p className="text-xs mt-1">Click "Add Credits" above to make payment.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-700">
                <p className="font-medium">Ready to chat!</p>
                <p>You have sufficient credits for {queriesRemaining} queries.</p>
              </div>
            </div>
          </div>
        )}

        {/* Contract Info */}
        {contractInfo && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs text-gray-700">
              <p className="font-medium mb-1">X402 Payment Details:</p>
              <div className="space-y-1">
                <div>Payment: {contractInfo.paymentAmount} ETH → ${estimatedCredits.toFixed(2)} credits</div>
                <div>Network: {contractInfo.network}</div>
                <div>Contract: {contractInfo.contractAddress?.slice(0, 10)}...{contractInfo.contractAddress?.slice(-8)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={(amount) => {
          onCreditsUpdate(credits + amount)
          setShowPaymentModal(false)
        }}
      />
    </>
  )
}