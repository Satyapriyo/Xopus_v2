#!/usr/bin/env node

// Test Supabase connection
require('dotenv').config({ path: '.env.local' });

async function testSupabase() {
  console.log('🔐 Testing Supabase Configuration...');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Environment Variables:');
  console.log('- URL:', url ? '✅' : '❌', url);
  console.log('- Anon Key:', anonKey ? '✅' : '❌', anonKey?.substring(0, 20) + '...');
  console.log('- Service Key:', serviceKey ? '✅' : '❌', serviceKey?.substring(0, 20) + '...');
  
  if (!url || !anonKey || !serviceKey) {
    console.log('❌ Missing environment variables');
    return false;
  }
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(url, anonKey);
    const supabaseAdmin = createClient(url, serviceKey);
    
    console.log('\n🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

testSupabase().then(success => {
  process.exit(success ? 0 : 1);
});
