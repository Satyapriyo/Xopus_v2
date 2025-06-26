const { createPublicClient, http } = require('viem');
const { baseSepolia } = require('viem/chains');

// Contract details
const CONTRACT_ADDRESS = '0x225d97fe3049E2B834bfC69edA125Df52a7F0255';
const RPC_URL = 'https://base-sepolia-rpc.publicnode.com';

// Minimal ABI to test common functions
const MINIMAL_ABI = [
  {
    "inputs": [],
    "name": "paymentAmount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paymentReceiver", 
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function main() {
  console.log('🔍 Investigating contract:', CONTRACT_ADDRESS);
  console.log('🌐 Using RPC:', RPC_URL);
  
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL)
  });

  try {
    // 1. Check if contract exists
    console.log('\n1️⃣ Checking contract existence...');
    const bytecode = await client.getBytecode({
      address: CONTRACT_ADDRESS
    });
    
    if (!bytecode || bytecode === '0x') {
      console.log('❌ Contract not found or has no bytecode');
      return;
    }
    
    console.log('✅ Contract found with bytecode length:', bytecode.length);
    
    // 2. Get contract balance
    console.log('\n2️⃣ Checking contract balance...');
    const balance = await client.getBalance({
      address: CONTRACT_ADDRESS
    });
    console.log('💰 Contract balance:', balance.toString(), 'wei');
    
    // 3. Test function calls
    console.log('\n3️⃣ Testing contract function calls...');
    
    // Test paymentAmount
    try {
      console.log('📞 Calling paymentAmount()...');
      const paymentAmount = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: MINIMAL_ABI,
        functionName: 'paymentAmount'
      });
      console.log('✅ paymentAmount:', paymentAmount.toString(), 'wei');
    } catch (error) {
      console.log('❌ paymentAmount failed:', error.message);
    }
    
    // Test paymentReceiver
    try {
      console.log('📞 Calling paymentReceiver()...');
      const paymentReceiver = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: MINIMAL_ABI,
        functionName: 'paymentReceiver'
      });
      console.log('✅ paymentReceiver:', paymentReceiver);
    } catch (error) {
      console.log('❌ paymentReceiver failed:', error.message);
    }
    
    // Test owner
    try {
      console.log('📞 Calling owner()...');
      const owner = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: MINIMAL_ABI,
        functionName: 'owner'
      });
      console.log('✅ owner:', owner);
    } catch (error) {
      console.log('❌ owner failed:', error.message);
    }
    
    // 4. Get recent events (if any)
    console.log('\n4️⃣ Checking recent events...');
    try {
      const latestBlock = await client.getBlockNumber();
      const fromBlock = latestBlock - 1000n; // Last 1000 blocks
      
      const logs = await client.getLogs({
        address: CONTRACT_ADDRESS,
        fromBlock: fromBlock,
        toBlock: 'latest'
      });
      
      console.log('📊 Found', logs.length, 'events in last 1000 blocks');
      if (logs.length > 0) {
        console.log('📝 Latest event topics:', logs[logs.length - 1].topics);
      }
    } catch (error) {
      console.log('❌ Event check failed:', error.message);
    }
    
    console.log('\n🎉 Contract investigation complete!');
    
  } catch (error) {
    console.error('💥 Investigation failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

main().catch(console.error);
