import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const CONTRACT_ADDRESS = "0x225d97fe3049E2B834bfC69edA125Df52a7F0255";

async function verifyContractDeployment() {
  console.log("🔍 Verifying contract deployment...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Network: Base Sepolia");
  
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http("https://base-sepolia-rpc.publicnode.com"),
  });

  try {
    // Check if contract exists
    const bytecode = await client.getBytecode({
      address: CONTRACT_ADDRESS as `0x${string}`,
    });

    console.log("Bytecode length:", bytecode?.length || 0);
    
    if (!bytecode || bytecode === "0x") {
      console.log("❌ Contract not found - no bytecode at address");
      return false;
    }

    console.log("✅ Contract found with bytecode");

    // Try to read basic contract functions
    const X402_ABI = [
      {
        inputs: [],
        name: "paymentAmount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "paymentReceiver",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const;

    try {
      const paymentAmount = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: X402_ABI,
        functionName: "paymentAmount",
      });
      console.log("✅ Payment amount:", paymentAmount.toString());
    } catch (error) {
      console.log("⚠️ Could not read paymentAmount:", error);
    }

    try {
      const paymentReceiver = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: X402_ABI,
        functionName: "paymentReceiver",
      });
      console.log("✅ Payment receiver:", paymentReceiver);
    } catch (error) {
      console.log("⚠️ Could not read paymentReceiver:", error);
    }

    try {
      const owner = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: X402_ABI,
        functionName: "owner",
      });
      console.log("✅ Owner:", owner);
    } catch (error) {
      console.log("⚠️ Could not read owner:", error);
    }

    return true;

  } catch (error) {
    console.error("❌ Error verifying contract:", error);
    return false;
  }
}

// Run verification
verifyContractDeployment()
  .then((result) => {
    console.log("Contract verification result:", result);
  })
  .catch((error) => {
    console.error("Verification failed:", error);
  });
