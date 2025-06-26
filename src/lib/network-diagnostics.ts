import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

// Test RPC endpoints to find the most reliable one
export async function testRpcEndpoints() {
  const endpoints = [
    "https://base-sepolia-rpc.publicnode.com",
    "https://sepolia.base.org",
    "https://base-sepolia.blockpi.network/v1/rpc/public",
    "https://base-sepolia.gateway.tenderly.co",
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing RPC endpoint: ${endpoint}`);
      const startTime = performance.now();

      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(endpoint, {
          retryCount: 1,
          retryDelay: 1000,
        }),
      });

      // Test basic connectivity
      const blockNumber = await client.getBlockNumber();
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      console.log(
        `✅ ${endpoint} - Block: ${blockNumber}, Response time: ${responseTime.toFixed(2)}ms`
      );

      results.push({
        endpoint,
        working: true,
        blockNumber: blockNumber.toString(),
        responseTime: responseTime.toFixed(2),
        error: null,
      });
    } catch (error: any) {
      console.error(`❌ ${endpoint} - Error:`, error.message);
      results.push({
        endpoint,
        working: false,
        blockNumber: null,
        responseTime: null,
        error: error.message,
      });
    }
  }

  // Sort by response time (fastest first) and filter working endpoints
  const workingEndpoints = results
    .filter((r) => r.working)
    .sort((a, b) => parseFloat(a.responseTime!) - parseFloat(b.responseTime!));

  console.log("\n📊 RPC Endpoint Test Results:");
  console.table(results);

  if (workingEndpoints.length > 0) {
    console.log(
      `\n🎯 Recommended endpoint: ${workingEndpoints[0].endpoint} (${workingEndpoints[0].responseTime}ms)`
    );
    return workingEndpoints[0].endpoint;
  } else {
    console.log("\n⚠️ No working RPC endpoints found!");
    return null;
  }
}

// Test contract connectivity
export async function testContractConnection(contractAddress: string) {
  const bestEndpoint = await testRpcEndpoints();

  if (!bestEndpoint) {
    throw new Error("No working RPC endpoints available");
  }

  try {
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(bestEndpoint),
    });

    console.log(`\n🔍 Testing contract at: ${contractAddress}`);

    // Check if contract exists
    const code = await client.getBytecode({
      address: contractAddress as `0x${string}`,
    });

    if (code && code !== "0x") {
      console.log("✅ Contract exists and has bytecode");

      // Test a simple read operation if possible
      try {
        const balance = await client.getBalance({
          address: contractAddress as `0x${string}`,
        });
        console.log(`📊 Contract balance: ${balance} wei`);
      } catch (error) {
        console.warn("Could not get contract balance:", error);
      }

      return true;
    } else {
      console.log("❌ Contract does not exist or has no bytecode");
      return false;
    }
  } catch (error: any) {
    console.error("Contract test failed:", error.message);
    return false;
  }
}

// Comprehensive network test
export async function runNetworkDiagnostics() {
  console.log("🚀 Starting network diagnostics...\n");

  // Test RPC endpoints
  const bestRpc = await testRpcEndpoints();

  // Test contract if we have a working RPC
  if (bestRpc && process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS) {
    await testContractConnection(process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS);
  }

  console.log("\n✅ Network diagnostics complete!");
  return bestRpc;
}
