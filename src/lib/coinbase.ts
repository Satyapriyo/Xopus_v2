import { Coinbase, Wallet, Address } from "@coinbase/coinbase-sdk";

// Initialize Coinbase SDK
const coinbase = new Coinbase({
  apiKeyName: process.env.COINBASE_API_KEY!,
  privateKey: process.env.COINBASE_PRIVATE_KEY!,
});

export class PaymentService {
  private static instance: PaymentService;
  private wallet: Wallet | null = null;

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async initializeWallet(): Promise<Wallet> {
    if (!this.wallet) {
      this.wallet = await Wallet.create({
        networkId: process.env.CDP_NETWORK_ID || "base-sepolia",
      });
    }
    return this.wallet;
  }

  async getWalletAddress(): Promise<string> {
    const wallet = await this.initializeWallet();
    const address = await wallet.getDefaultAddress();
    return address.getId();
  }

  async createPaymentRequest(
    amount: number,
    currency: string = "USDC"
  ): Promise<{
    address: string;
    amount: number;
    currency: string;
    qrCode?: string;
  }> {
    const address = await this.getWalletAddress();

    return {
      address,
      amount,
      currency,
      qrCode: `ethereum:${address}?amount=${amount}&token=${currency}`,
    };
  }

  async verifyPayment(txHash: string): Promise<boolean> {
    try {
      // For now, return true as a placeholder
      // In production, you would implement proper transaction verification
      console.log(`Verifying payment with hash: ${txHash}`);
      return true;
    } catch (error) {
      console.error("Payment verification failed:", error);
      return false;
    }
  }

  async getBalance(): Promise<number> {
    try {
      // For now, return a placeholder balance
      // In production, you would implement proper balance retrieval
      console.log("Getting wallet balance...");
      return 100.0; // Placeholder balance
    } catch (error) {
      console.error("Error getting balance:", error);
      return 0;
    }
  }
}

export const paymentService = PaymentService.getInstance();
