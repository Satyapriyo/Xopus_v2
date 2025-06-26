#!/usr/bin/env node

// Comprehensive diagnostic script
require('dotenv').config({ path: '.env.local' });

async function runDiagnostics() {
  console.log('🚀 Running comprehensive diagnostics...\n');
  
  // 1. Check environment variables
  console.log('1️⃣ Environment Variables:');
  const vars = {
    'NEXT_PUBLIC_X402_CONTRACT_ADDRESS': process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS,
    'NEXT_PUBLIC_CHAIN_ID': process.env.NEXT_PUBLIC_CHAIN_ID,
    'NEXT_PUBLIC_RPC_URL': process.env.NEXT_PUBLIC_RPC_URL,
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
  };
  
  for (const [key, value] of Object.entries(vars)) {
    console.log(`- ${key}: ${value ? '✅' : '❌'}`);
  }
  
  // 2. Test contract
  console.log('\n2️⃣ Testing Contract Connection:');
  try {
    const { createPublicClient, http } = require('viem');
    const { baseSepolia } = require('viem/chains');
    
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://base-sepolia-rpc.publicnode.com')
    });
    
    const code = await client.getBytecode({
      address: process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS,
    });
    
    const exists = code !== undefined && code !== '0x';
    console.log(`Contract exists: ${exists ? '✅' : '❌'}`);
    console.log(`Bytecode length: ${code?.length || 0}`);
    
  } catch (error) {
    console.log(`❌ Contract test failed: ${error.message}`);
  }
  
  // 3. Test Supabase
  console.log('\n3️⃣ Testing Supabase Connection:');
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log(`❌ Supabase failed: ${error.message}`);
    } else {
      console.log('✅ Supabase connection successful');
    }
    
  } catch (error) {
    console.log(`❌ Supabase test failed: ${error.message}`);
  }
  
  // 4. Test OpenAI
  console.log('\n4️⃣ Testing OpenAI Connection:');
  if (process.env.OPENAI_API_KEY) {
    console.log('✅ OpenAI API key present');
  } else {
    console.log('❌ OpenAI API key missing');
  }
  
  console.log('\n🎉 Diagnostics complete!');
}

runDiagnostics();
