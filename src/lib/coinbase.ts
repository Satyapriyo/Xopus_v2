import { Coinbase, Wallet, Address } from '@coinbase/coinbase-sdk'

// Initialize Coinbase SDK
const coinbase = new Coinbase({
  apiKeyName: process.env.COINBASE_API_KEY!,
  privateKey: process.env.COINBASE_PRIVATE_KEY!,
})

export class PaymentService {
  private static instance: PaymentService
  private wallet: Wallet | null = null

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async initializeWallet(): Promise<Wallet> {
    if (!this.wallet) {
      this.wallet = await Wallet.create({ networkId: process.env.CDP_NETWORK_ID || 'base-sepolia' })
    }
    return this.wallet
  }

  async getWalletAddress(): Promise<string> {
    const wallet = await this.initializeWallet()
    const address = await wallet.getDefaultAddress()
    return address.getId()
  }

  async createPaymentRequest(amount: number, currency: string = 'USDC'): Promise<{
    address: string
    amount: number
    currency: string
    qrCode?: string
  }> {
    const address = await this.getWalletAddress()
    
    return {
      address,
      amount,
      currency,
      qrCode: `ethereum:${address}?amount=${amount}&token=${currency}`
    }
  }

  async verifyPayment(txHash: string): Promise<boolean> {
    try {
      const wallet = await this.initializeWallet()
      // This is a simplified verification - in production you'd want more robust checking
      const transactions = await wallet.listTransactions()
      
      return transactions.some(tx => tx.getTransactionHash() === txHash)
    } catch (error) {
      console.error('Payment verification failed:', error)
      return false
    }
  }

  async getBalance(): Promise<number> {
    try {
      const wallet = await this.initializeWallet()
      const balances = await wallet.listBalances()
      
      // Get USDC balance (or convert from ETH)
      const usdcBalance = balances.find(b => b.getAsset().getAssetId().includes('USDC'))
      return parseFloat(usdcBalance?.getAmount() || '0')
    } catch (error) {
      console.error('Error getting balance:', error)
      return 0
    }
  }
}

export const paymentService = PaymentService.getInstance()