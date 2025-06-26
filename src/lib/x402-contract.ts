import {
  createPublicClient,
  createWalletClient,
  custom,
  parseEther,
  formatEther,
  http,
  parseEventLogs,
} from "viem";
import { baseSepolia } from "viem/chains";
import { ENV_CONFIG } from "./env-config";

// X402 Payment Handler ABI - Updated to match your contract
export const X402_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_paymentReceiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_paymentAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentForwarded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentReceived",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paymentAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paymentReceiver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newAmount",
        type: "uint256",
      },
    ],
    name: "setPaymentAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newReceiver",
        type: "address",
      },
    ],
    name: "setPaymentReceiver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

// Contract address with fallback
export const CONTRACT_ADDRESS = ENV_CONFIG.CONTRACT_ADDRESS as `0x${string}`;

// Default values for when contract is not available
const DEFAULT_PAYMENT_AMOUNT = parseEther("0.0001"); // 0.0001 ETH
const DEFAULT_RECEIVER = "0x3984632D6767FE866d602e5926015DDcFE4e11FB"; // Example receiver address

// Debug contract address loading
if (typeof window !== "undefined") {
  console.log("🔍 Contract Address Debug:", {
    envVar: process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS,
    contractAddress: CONTRACT_ADDRESS,
    configAddress: ENV_CONFIG.CONTRACT_ADDRESS,
    windowLocation: window.location.href,
  });
}

export class X402PaymentService {
  private publicClient;
  private walletClient: any = null;
  private isClient = false;
  private contractExists = false;
  constructor() {
    // Check if we're on the client side
    this.isClient = typeof window !== "undefined";

    // Create public client with reliable HTTP transport using ENV_CONFIG
    const rpcUrls = [
      ENV_CONFIG.RPC_URL,
      "https://sepolia.base.org",
      "https://base-sepolia.blockpi.network/v1/rpc/public",
    ].filter(Boolean);

    // Always use HTTP transport for reliability, not custom window.ethereum
    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrls[0], {
        batch: true,
        retryCount: 3,
        retryDelay: 1000,
        timeout: 10000, // 10 second timeout
      }),
    });

    if (this.isClient) {
      console.log("🔍 X402 Service initialized with RPC:", rpcUrls[0]);
      console.log("🔍 Contract address:", CONTRACT_ADDRESS);
    }
  }

  setWalletClient(client: any) {
    this.walletClient = client;
  }
  async checkContractExists(): Promise<boolean> {
    if (!CONTRACT_ADDRESS) {
      console.warn("❌ No contract address configured");
      console.log("Debug - CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
      console.log(
        "Debug - env var:",
        process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS
      );
      return false;
    }

    try {
      console.log("🔍 Checking contract existence at:", CONTRACT_ADDRESS);

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Contract check timeout")), 15000)
      );

      const bytecodePromise = this.publicClient.getBytecode({
        address: CONTRACT_ADDRESS,
      });

      const code = (await Promise.race([
        bytecodePromise,
        timeoutPromise,
      ])) as any;

      const exists = code !== undefined && code !== "0x" && code !== null;

      console.log("📝 Contract check result:", {
        address: CONTRACT_ADDRESS,
        bytecodeLength: code?.length || 0,
        exists: exists,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
      });

      this.contractExists = exists;
      return this.contractExists;
    } catch (error: any) {
      console.error("❌ Contract existence check failed:", {
        address: CONTRACT_ADDRESS,
        error: error.message,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
        stack: error.stack?.substring(0, 300),
      });

      // Try with a fallback RPC if primary fails
      try {
        console.log("🔄 Trying fallback RPC...");
        const fallbackClient = createPublicClient({
          chain: baseSepolia,
          transport: http("https://sepolia.base.org", {
            timeout: 10000,
          }),
        });

        const code = await fallbackClient.getBytecode({
          address: CONTRACT_ADDRESS,
        });

        const exists = code !== undefined && code !== "0x" && code !== null;
        console.log("✅ Fallback check result:", exists);

        this.contractExists = exists;
        return exists;
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        this.contractExists = false;
        return false;
      }
    }
  }
  async getPaymentAmount(): Promise<bigint> {
    try {
      console.log("🔍 Getting payment amount...");
      const exists = await this.checkContractExists();
      if (!exists) {
        console.warn("⚠️ Contract not found, using default payment amount");
        return DEFAULT_PAYMENT_AMOUNT;
      }

      console.log("📞 Calling contract paymentAmount function...");
      const amount = await this.publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: X402_ABI,
        functionName: "paymentAmount",
      });

      console.log("✅ Got payment amount from contract:", {
        amount: amount.toString(),
        formatted: formatEther(amount as bigint) + " ETH",
      });

      return amount as bigint;
    } catch (error: any) {
      console.error("❌ Error getting payment amount:", {
        error: error.message,
        contractAddress: CONTRACT_ADDRESS,
        fallbackAmount: formatEther(DEFAULT_PAYMENT_AMOUNT) + " ETH",
      });
      console.warn(
        "Using default payment amount:",
        formatEther(DEFAULT_PAYMENT_AMOUNT),
        "ETH"
      );
      return DEFAULT_PAYMENT_AMOUNT;
    }
  }

  async getPaymentReceiver(): Promise<string> {
    try {
      const exists = await this.checkContractExists();
      if (!exists) {
        console.warn("Contract not found, using default receiver");
        return DEFAULT_RECEIVER;
      }

      const receiver = await this.publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: X402_ABI,
        functionName: "paymentReceiver",
      });
      return receiver as string;
    } catch (error) {
      console.error("Error getting payment receiver:", error);
      console.warn("Using default receiver:", DEFAULT_RECEIVER);
      return DEFAULT_RECEIVER;
    }
  }

  async getOwner(): Promise<string> {
    try {
      const exists = await this.checkContractExists();
      if (!exists) {
        return "";
      }

      const owner = await this.publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: X402_ABI,
        functionName: "owner",
      });
      return owner as string;
    } catch (error) {
      console.error("Error getting contract owner:", error);
      return "";
    }
  }
  async makePayment(userAddress: `0x${string}`): Promise<string> {
    if (!this.walletClient) {
      throw new Error("Wallet client not connected");
    }

    if (!this.isClient) {
      throw new Error("Payment can only be made on client side");
    }

    try {
      console.log("🚀 Starting payment process...");
      console.log("📍 User address:", userAddress);
      console.log("📍 Contract address:", CONTRACT_ADDRESS);

      const paymentAmount = await this.getPaymentAmount();
      const receiver = await this.getPaymentReceiver();

      console.log("💰 Payment details:", {
        amount: formatEther(paymentAmount) + " ETH",
        receiver: receiver,
        contractExists: this.contractExists,
      });

      // Check if contract exists
      const contractExists = await this.checkContractExists();

      let hash: string;

      if (contractExists && CONTRACT_ADDRESS) {
        // Send to contract if it exists
        console.log("📡 Sending payment to X402 contract:", CONTRACT_ADDRESS);
        hash = await this.walletClient.sendTransaction({
          account: userAddress,
          to: CONTRACT_ADDRESS,
          value: paymentAmount,
          gas: 100000n,
        });
        console.log("✅ Transaction sent to contract. Hash:", hash);
      } else {
        // Send directly to receiver if contract doesn't exist
        console.log(
          "📡 Contract not found, sending payment directly to receiver:",
          receiver
        );
        hash = await this.walletClient.sendTransaction({
          account: userAddress,
          to: receiver as `0x${string}`,
          value: paymentAmount,
          gas: 21000n, // Standard ETH transfer gas
        });
        console.log("✅ Transaction sent directly. Hash:", hash);
      }

      return hash;
    } catch (error: any) {
      console.error("💥 Payment failed:", {
        error: error.message,
        code: error.code,
        data: error.data,
      });
      if (error.message?.includes("insufficient funds")) {
        throw new Error("Insufficient ETH balance for payment and gas fees");
      }
      if (error.message?.includes("User rejected")) {
        throw new Error("Payment cancelled by user");
      }
      throw new Error(`Payment transaction failed: ${error.message}`);
    }
  }

  async verifyPayment(
    txHash: string,
    userAddress?: string,
    retryCount = 0
  ): Promise<{
    verified: boolean;
    amount?: number;
    receiver?: string;
    status?: string;
    events?: any[];
    error?: string;
  }> {
    try {
      console.log(
        `Verifying payment with hash: ${txHash} (attempt ${retryCount + 1})`
      );

      // First check if transaction exists with better error handling
      let transaction;
      try {
        transaction = await this.publicClient.getTransaction({
          hash: txHash as any,
        });

        if (!transaction) {
          console.warn("Transaction not found on the network");

          // If we've already retried several times, give up
          if (retryCount >= 5) {
            return { verified: false, status: "not_found" };
          }

          // Wait longer before retrying for transaction propagation
          await new Promise((resolve) => setTimeout(resolve, 8000));
          return this.verifyPayment(txHash, userAddress, retryCount + 1);
        }

        // Verify sender if provided
        if (
          userAddress &&
          transaction.from.toLowerCase() !== userAddress.toLowerCase()
        ) {
          console.error("Transaction sender mismatch");
          return { verified: false, status: "sender_mismatch" };
        }
      } catch (txError: any) {
        console.warn("Error fetching transaction:", txError);

        // If it's a network error and we haven't retried too much, retry
        if (
          retryCount < 3 &&
          (txError.message?.includes("fetch") ||
            txError.message?.includes("network"))
        ) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          return this.verifyPayment(txHash, userAddress, retryCount + 1);
        }
      }

      // Get receipt with improved timeout and retry logic
      try {
        const receipt = await this.publicClient.waitForTransactionReceipt({
          hash: txHash as `0x${string}`,
          timeout: 300000, // 5 minutes (300 seconds) - increased timeout
          confirmations: 1, // Reduced to 1 confirmation for faster response
          pollingInterval: 2000, // Poll every 2 seconds
        });

        if (receipt.status !== "success") {
          console.error("Transaction failed with status:", receipt.status);
          return { verified: false, status: "failed" };
        }

        // If we didn't get transaction details earlier, fetch them now
        if (!transaction) {
          try {
            transaction = await this.publicClient.getTransaction({
              hash: txHash as `0x${string}`,
            });
          } catch (txFetchError) {
            console.warn(
              "Could not fetch transaction details after receipt:",
              txFetchError
            );
          }
        }

        // Check if contract exists
        const contractExists = await this.checkContractExists();

        if (contractExists && CONTRACT_ADDRESS) {
          // Verify the transaction was to our contract
          if (receipt.to?.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) {
            console.error("Transaction not sent to contract");
            return { verified: false, status: "wrong_recipient" };
          }

          // Try to parse contract events
          try {
            const events = parseEventLogs({
              abi: X402_ABI,
              logs: receipt.logs,
            });

            const paymentReceivedEvent = events.find(
              (event) => event?.eventName === "PaymentReceived"
            );

            const paymentForwardedEvent = events.find(
              (event) => event?.eventName === "PaymentForwarded"
            );

            return {
              verified: true,
              status: "confirmed",
              amount: paymentReceivedEvent?.args?.amount
                ? Number(
                    formatEther(paymentReceivedEvent.args.amount as bigint)
                  )
                : Number(formatEther(transaction.value)),
              receiver:
                (paymentForwardedEvent?.args?.receiver as string) || receipt.to,
              events: events,
            };
          } catch (error) {
            console.warn(
              "Could not parse contract events, using transaction value"
            );
            return {
              verified: true,
              status: "confirmed_no_events",
              amount: Number(formatEther(transaction.value)),
              receiver: receipt.to,
            };
          }
        } else {
          // Direct payment verification
          const receiver = await this.getPaymentReceiver();
          if (receipt.to?.toLowerCase() !== receiver.toLowerCase()) {
            console.error("Transaction not sent to expected receiver");
            return { verified: false, status: "wrong_recipient" };
          }

          return {
            verified: true,
            status: "confirmed_direct",
            amount: Number(formatEther(transaction.value)),
            receiver: receipt.to,
          };
        }
      } catch (receiptError: any) {
        console.error("Error getting transaction receipt:", receiptError);

        // Handle timeout errors specially
        if (
          receiptError.message?.includes("Timed out") ||
          receiptError.message?.includes("timeout")
        ) {
          console.log(
            "Receipt timeout, checking if transaction exists and is mined..."
          );

          // If we already have the transaction from earlier
          if (transaction) {
            // Check if it has a block number (meaning it's been mined)
            if (transaction.blockNumber) {
              console.log(
                "Transaction is mined but receipt timed out, verifying manually"
              );

              // Try to get the receipt one more time with a shorter timeout
              try {
                const manualReceipt =
                  await this.publicClient.getTransactionReceipt({
                    hash: txHash as `0x${string}`,
                  });

                if (manualReceipt && manualReceipt.status === "success") {
                  console.log("Successfully retrieved receipt manually");

                  // Check if it's a direct payment or contract payment
                  const contractExists = await this.checkContractExists();
                  const receiver = await this.getPaymentReceiver();

                  if (
                    !contractExists ||
                    manualReceipt.to?.toLowerCase() === receiver.toLowerCase()
                  ) {
                    // Direct payment verification
                    return {
                      verified: true,
                      status: "confirmed_manual_receipt",
                      amount: Number(formatEther(transaction.value)),
                      receiver: manualReceipt.to,
                    };
                  } else if (
                    contractExists &&
                    manualReceipt.to?.toLowerCase() ===
                      CONTRACT_ADDRESS.toLowerCase()
                  ) {
                    // Contract payment
                    return {
                      verified: true,
                      status: "confirmed_manual_receipt",
                      amount: Number(formatEther(transaction.value)),
                      receiver: CONTRACT_ADDRESS,
                    };
                  }
                }
              } catch (manualReceiptError) {
                console.warn(
                  "Manual receipt fetch also failed:",
                  manualReceiptError
                );
              }

              // Fallback: verify based on transaction data
              const contractExists = await this.checkContractExists();
              const receiver = await this.getPaymentReceiver();

              if (
                !contractExists ||
                transaction.to?.toLowerCase() === receiver.toLowerCase()
              ) {
                // Direct payment verification
                return {
                  verified: true,
                  status: "mined_no_receipt",
                  amount: Number(formatEther(transaction.value)),
                  receiver: transaction.to,
                };
              } else if (
                contractExists &&
                transaction.to?.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
              ) {
                // Contract payment
                return {
                  verified: true,
                  status: "mined_no_receipt",
                  amount: Number(formatEther(transaction.value)),
                  receiver: CONTRACT_ADDRESS,
                };
              } else {
                return { verified: false, status: "wrong_recipient" };
              }
            } else {
              console.log("Transaction found but not yet mined");

              // If we've already retried several times, consider it pending
              if (retryCount >= 3) {
                return {
                  verified: true,
                  status: "pending",
                  amount: Number(formatEther(transaction.value)),
                  receiver: transaction.to,
                };
              }

              // Wait and retry with exponential backoff
              const waitTime = Math.min(
                10000 * Math.pow(1.5, retryCount),
                30000
              );
              console.log(
                `Waiting ${waitTime / 1000} seconds before retrying...`
              );
              await new Promise((resolve) => setTimeout(resolve, waitTime));
              return this.verifyPayment(txHash, userAddress, retryCount + 1);
            }
          } else {
            // We couldn't get the transaction before, try again now
            try {
              const retryTransaction = await this.publicClient.getTransaction({
                hash: txHash as `0x${string}`,
              });

              if (retryTransaction) {
                if (retryTransaction.blockNumber) {
                  // Transaction exists and is mined
                  console.log("Transaction found and mined on retry check");

                  // Try to get receipt one more time
                  try {
                    const retryReceipt =
                      await this.publicClient.getTransactionReceipt({
                        hash: txHash as `0x${string}`,
                      });

                    if (retryReceipt && retryReceipt.status === "success") {
                      return {
                        verified: true,
                        status: "found_on_retry",
                        amount: Number(formatEther(retryTransaction.value)),
                        receiver: retryReceipt.to,
                      };
                    }
                  } catch {
                    // Receipt fetch failed, verify based on transaction
                    return {
                      verified: true,
                      status: "found_on_retry_no_receipt",
                      amount: Number(formatEther(retryTransaction.value)),
                      receiver: retryTransaction.to,
                    };
                  }
                } else {
                  // Transaction exists but not yet mined
                  console.log("Transaction found but pending on retry check");

                  // If we've tried several times already, consider it pending verified
                  if (retryCount >= 3) {
                    return {
                      verified: true,
                      status: "pending",
                      amount: Number(formatEther(retryTransaction.value)),
                    };
                  }

                  // Otherwise retry after delay
                  await new Promise((resolve) => setTimeout(resolve, 12000));
                  return this.verifyPayment(
                    txHash,
                    userAddress,
                    retryCount + 1
                  );
                }
              }
            } catch (finalError) {
              console.error(
                "Final attempt to verify transaction failed:",
                finalError
              );
            }
          }
        }

        // Handle other types of errors (network, RPC, etc.)
        if (
          receiptError.message?.includes("network") ||
          receiptError.message?.includes("fetch") ||
          receiptError.message?.includes("ECONNRESET") ||
          receiptError.message?.includes("ETIMEDOUT")
        ) {
          console.log(
            "Network error detected, will retry with different approach"
          );

          // If we've retried several times already, give up
          if (retryCount >= 4) {
            return { verified: false, status: "network_error_max_retries" };
          }

          // Wait longer for network issues
          const waitTime = Math.min(15000 * Math.pow(1.5, retryCount), 45000);
          console.log(
            `Network error, waiting ${waitTime / 1000} seconds before retrying...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          return this.verifyPayment(txHash, userAddress, retryCount + 1);
        }

        // If we've retried several times already, give up
        if (retryCount >= 4) {
          return { verified: false, status: "max_retries_exceeded" };
        }

        // Otherwise, retry with exponential backoff
        const waitTime = Math.min(8000 * Math.pow(1.5, retryCount), 30000);
        console.log(
          `Verification error, waiting ${waitTime / 1000} seconds before retrying...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.verifyPayment(txHash, userAddress, retryCount + 1);
      }
    } catch (error: any) {
      console.error("Unexpected error in payment verification:", error);

      // Log more details about the error
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack?.substring(0, 500),
      });

      // If we've retried too many times, give up
      if (retryCount >= 4) {
        return {
          verified: false,
          status: "error_max_retries",
          error: error.message,
        };
      }

      // For certain errors, don't retry
      if (
        error.message?.includes("Invalid transaction hash") ||
        error.message?.includes("sender_mismatch") ||
        error.message?.includes("wrong_recipient")
      ) {
        return {
          verified: false,
          status: "permanent_error",
          error: error.message,
        };
      }

      // Try again with exponential backoff for other errors
      const waitTime = Math.min(10000 * Math.pow(1.5, retryCount), 30000);
      console.log(
        `Unexpected error, waiting ${waitTime / 1000} seconds before retrying...`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.verifyPayment(txHash, userAddress, retryCount + 1);
    }
  }

  async listenForPayments(
    userAddress: string,
    callback: (amount: bigint, txHash: string) => void
  ) {
    if (!this.isClient) {
      console.warn("Payment listening only available on client side");
      return;
    }

    try {
      const contractExists = await this.checkContractExists();

      if (!contractExists || !CONTRACT_ADDRESS) {
        console.warn("Contract not available for payment listening");
        return;
      }

      // Listen for PaymentReceived events
      this.publicClient.watchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: X402_ABI,
        eventName: "PaymentReceived",
        args: {
          sender: userAddress as `0x${string}`,
        },
        onLogs: (logs) => {
          logs.forEach((log) => {
            if (log.args.sender?.toLowerCase() === userAddress.toLowerCase()) {
              callback(log.args.amount || 0n, log.transactionHash);
            }
          });
        },
      });
    } catch (error) {
      console.error("Error setting up payment listener:", error);
    }
  }

  formatPaymentAmount(amount: bigint): string {
    return formatEther(amount);
  }

  // Convert ETH amount to USD (for credit calculation)
  convertEthToUsd(ethAmount: number, ethPriceUsd: number = 3000): number {
    return ethAmount * ethPriceUsd;
  }

  // Helper method to get contract info for debugging
  async getContractInfo() {
    try {
      const contractExists = await this.checkContractExists();

      if (!contractExists) {
        const paymentAmount = await this.getPaymentAmount();
        const receiver = await this.getPaymentReceiver();

        return {
          contractAddress: CONTRACT_ADDRESS || "Not configured",
          contractExists: false,
          paymentAmount: this.formatPaymentAmount(paymentAmount),
          paymentAmountWei: paymentAmount.toString(),
          paymentReceiver: receiver,
          owner: "N/A (contract not deployed)",
          network: "Base Sepolia",
          mode: "Direct Payment (Contract not found)",
        };
      }

      const [paymentAmount, paymentReceiver, owner] = await Promise.all([
        this.publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: X402_ABI,
          functionName: "paymentAmount",
        }),
        this.publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: X402_ABI,
          functionName: "paymentReceiver",
        }),
        this.publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: X402_ABI,
          functionName: "owner",
        }),
      ]);

      return {
        contractAddress: CONTRACT_ADDRESS,
        contractExists: true,
        paymentAmount: this.formatPaymentAmount(paymentAmount as bigint),
        paymentAmountWei: (paymentAmount as bigint).toString(),
        paymentReceiver: paymentReceiver as string,
        owner: owner as string,
        network: "Base Sepolia",
        mode: "X402 Contract Payment",
      };
    } catch (error: any) {
      console.error("Error getting contract info:", error);

      // Return fallback info
      return {
        contractAddress: CONTRACT_ADDRESS || "Not configured",
        contractExists: false,
        paymentAmount: this.formatPaymentAmount(DEFAULT_PAYMENT_AMOUNT),
        paymentAmountWei: DEFAULT_PAYMENT_AMOUNT.toString(),
        paymentReceiver: DEFAULT_RECEIVER,
        owner: "N/A",
        network: "Base Sepolia",
        mode: "Fallback Direct Payment",
        error: error.message,
      };
    }
  }
}

// Create a function to get the service instance (only on client side)
export const getX402PaymentService = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return new X402PaymentService();
};

// Export a singleton instance for client-side use
export const x402PaymentService =
  typeof window !== "undefined" ? new X402PaymentService() : null;
