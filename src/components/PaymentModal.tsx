'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle, CreditCard, Loader2, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react'
import { useAccount, useWalletClient } from 'wagmi'
import { getX402PaymentService } from '../lib/x402-contract'
import toast from 'react-hot-toast'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (amount: number) => void
}

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [paymentStep, setPaymentStep] = useState<'confirm' | 'processing' | 'success'>('confirm')
  const [paymentAmount, setPaymentAmount] = useState<string>('0')
  const [paymentAmountWei, setPaymentAmountWei] = useState<string>('0')
  const [txHash, setTxHash] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [contractInfo, setContractInfo] = useState<any>(null)
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    if (isOpen) {
      loadContractInfo()
      setPaymentStep('confirm')
      setTxHash('')
    }
  }, [isOpen])

  // Set wallet client when it becomes available
  useEffect(() => {
    if (walletClient) {
      const paymentService = getX402PaymentService()
      if (paymentService) {
        paymentService.setWalletClient(walletClient)
      }
    }
  }, [walletClient])

  const loadContractInfo = async () => {
    try {
      const paymentService = getX402PaymentService()
      if (paymentService) {
        const [amount, info] = await Promise.all([
          paymentService.getPaymentAmount(),
          paymentService.getContractInfo()
        ])

        const formattedAmount = paymentService.formatPaymentAmount(amount)
        setPaymentAmount(formattedAmount)
        setPaymentAmountWei(amount.toString())
        setContractInfo(info)
      }
    } catch (error) {
      console.error('Error loading contract info:', error)
      setPaymentAmount('0.0001') // Default fallback for testnet
    }
  }

  const handlePayment = async () => {
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!walletClient) {
      toast.error('Wallet client not available. Please reconnect your wallet.')
      return
    }

    const paymentService = getX402PaymentService()
    if (!paymentService) {
      toast.error('Payment service not available')
      return
    }

    // Ensure wallet client is set
    paymentService.setWalletClient(walletClient)

    setIsLoading(true)
    setPaymentStep('processing')

    try {
      const hash = await paymentService.makePayment(address)
      setTxHash(hash)

      toast.success('Payment transaction sent! Waiting for confirmation...')

      // Verify payment with enhanced verification
      const verification = await paymentService.verifyPayment(hash, address)

      if (verification.verified) {
        setPaymentStep('success')

        // Convert ETH amount to USD using the service method
        const amountInUSD = verification.amount
          ? paymentService.convertEthToUsd(verification.amount, 3000) // $3000 ETH price for testnet
          : parseFloat(paymentAmount) * 3000 // Fallback calculation

        onPaymentSuccess(amountInUSD)
        toast.success(`Payment successful! Added $${amountInUSD.toFixed(2)} in credits`)

        setTimeout(() => {
          onClose()
          setPaymentStep('confirm')
        }, 3000)
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (error: any) {
      console.error('Payment error:', error)

      // More specific error messages
      let errorMessage = 'Payment failed'
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Payment cancelled by user'
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH balance for payment and gas fees'
      } else if (error.message?.includes('Wallet client not connected')) {
        errorMessage = 'Wallet not properly connected. Please reconnect your wallet.'
      } else if (error.message?.includes('Timed out')) {
        errorMessage = 'Transaction confirmation timed out. Check your wallet for the transaction status.'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
      setPaymentStep('confirm')
    } finally {
      setIsLoading(false)
    }
  }

  const getExplorerUrl = (hash: string) => {
    return `https://sepolia.basescan.org/tx/${hash}`
  }

  if (!isOpen) return null;

  return (
    <div className="  backdrop-blur-sm z-50 absolute top-[5vh]  flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">X402 Payment</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {paymentStep === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-crypto-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-crypto-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Payment</h3>
                <p className="text-sm text-gray-600">
                  {contractInfo?.contractExists
                    ? 'Pay via X402 protocol on Base Sepolia'
                    : 'Direct payment on Base Sepolia (Contract not found)'
                  }
                </p>
              </div>

              {/* Connection Status */}
              <div className={`p-3 rounded-lg border ${walletClient
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
                }`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${walletClient ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  <span className={`text-sm font-medium ${walletClient ? 'text-green-700' : 'text-red-700'
                    }`}>
                    Wallet {walletClient ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                {!walletClient && (
                  <p className="text-xs text-red-600 mt-1">
                    Please reconnect your wallet to continue
                  </p>
                )}
              </div>

              {/* Contract Status Warning */}
              {contractInfo && !contractInfo.contractExists && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-700">
                      <p className="font-medium mb-1">Contract Not Found</p>
                      <p className="text-xs">
                        The X402 contract at {contractInfo.contractAddress} was not found.
                        Payment will be sent directly to the receiver address.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Payment Amount:</span>
                  <span className="font-bold text-lg">{paymentAmount} ETH</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Wei Amount:</span>
                  <span className="font-mono text-xs text-gray-500">{paymentAmountWei}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-medium text-crypto-600">Base Sepolia</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-medium text-crypto-600">
                    {contractInfo?.contractExists ? 'X402 Contract' : 'Direct Payment'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Est. Credits:</span>
                  <span className="font-medium text-green-600">
                    ${(parseFloat(paymentAmount) * 3000).toFixed(2)}
                  </span>
                </div>
              </div>

              {contractInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-2">Payment Details:</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Target:</span>
                        <code className="font-mono">
                          {contractInfo.contractExists
                            ? `${contractInfo.contractAddress?.slice(0, 10)}...`
                            : `${contractInfo.paymentReceiver?.slice(0, 10)}...`
                          }
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span>Receiver:</span>
                        <code className="font-mono">{contractInfo.paymentReceiver?.slice(0, 10)}...</code>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <code className="font-mono">{contractInfo.paymentAmount} ETH</code>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={contractInfo.contractExists ? 'text-green-600' : 'text-amber-600'}>
                          {contractInfo.mode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-700">
                    <p className="font-medium mb-1">Payment Information:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Payment will be processed on Base Sepolia testnet</li>
                      <li>• Credits added automatically after confirmation</li>
                      <li>• Use testnet ETH only (no real value)</li>
                      <li>• Transaction may take 30-60 seconds to confirm</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading || !address || !walletClient}
                className="w-full bg-gradient-to-r from-crypto-500 to-crypto-600 hover:from-crypto-600 hover:to-crypto-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : !walletClient ? (
                  'Wallet Not Connected'
                ) : (
                  `Pay ${paymentAmount} ETH`
                )}
              </button>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your payment is being processed on Base Sepolia...
                </p>
                {txHash && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">Transaction Hash:</p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="text-xs font-mono break-all text-gray-700">{txHash.slice(0, 20)}...</code>
                      <a
                        href={getExplorerUrl(txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-crypto-600 hover:text-crypto-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your payment has been confirmed. Credits have been added to your account.
                </p>
                {txHash && (
                  <a
                    href={getExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-crypto-600 hover:text-crypto-700 text-sm"
                  >
                    <span>View on BaseScan</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}