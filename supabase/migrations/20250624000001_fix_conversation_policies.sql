/*
  # Fix RLS policies for conversations and messages tables
  
  Since we're using wallet-based authentication instead of Supabase auth,
  we need to disable RLS for these tables or create policies that work 
  with service role access.
*/

-- For now, disable RLS since we're using service role auth on the backend
-- and handling authorization in our application logic
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON conversations;
DROP POLICY IF EXISTS "Service role can manage conversations" ON conversations;

DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON messages;
DROP POLICY IF EXISTS "Service role can manage messages" ON messages;
