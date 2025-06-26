#!/usr/bin/env node

// Quick contract verification script
const { createPublicClient, http } = require('viem');
const { baseSepolia } = require('viem/chains');

const CONTRACT_ADDRESS = '0x225d97fe3049E2B834bfC69edA125Df52a7F0255';
const RPC_URLS = [
  'https://base-sepolia-rpc.publicnode.com',
  'https://sepolia.base.org',
  'https://base-sepolia.blockpi.network/v1/rpc/public'
];

async function testContract() {
  console.log('🚀 Testing contract:', CONTRACT_ADDRESS);
  
  for (const rpcUrl of RPC_URLS) {
    console.log(`\n🔗 Testing RPC: ${rpcUrl}`);
    
    try {
      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(rpcUrl, {
          timeout: 10000,
          retryCount: 2,
        })
      });

      const startTime = Date.now();
      const code = await client.getBytecode({
        address: CONTRACT_ADDRESS,
      });
      const responseTime = Date.now() - startTime;

      const exists = code !== undefined && code !== '0x';
      
      console.log(`✅ Response time: ${responseTime}ms`);
      console.log(`📝 Contract exists: ${exists}`);
      console.log(`📄 Bytecode length: ${code?.length || 0}`);
      
      if (exists) {
        console.log('🎉 Contract verified successfully!');
        return true;
      }
      
    } catch (error) {
      console.log(`❌ Error with ${rpcUrl}:`, error.message);
    }
  }
  
  return false;
}

testContract().then(success => {
  if (success) {
    console.log('\n✅ Contract verification PASSED');
    process.exit(0);
  } else {
    console.log('\n❌ Contract verification FAILED');
    process.exit(1);
  }
});
