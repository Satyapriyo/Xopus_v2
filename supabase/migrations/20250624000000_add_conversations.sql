/*
  # Add conversations and messages tables for chat functionality

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text, auto-generated from first message)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `type` (text, enum: user, assistant, system)
      - `content` (text)
      - `cost` (numeric, nullable for system messages)
      - `metadata` (jsonb, for additional data like timestamps, etc.)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on new tables
    - Add policies for users to access their own conversations and messages

  3. Indexes
    - Add indexes for performance
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New Conversation',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  cost numeric DEFAULT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for conversations table
CREATE POLICY "Users can read own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own conversations"
  ON conversations
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role can manage conversations"
  ON conversations
  FOR ALL
  TO service_role
  USING (true);

-- Policies for messages table
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Service role can manage messages"
  ON messages
  FOR ALL
  TO service_role
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);

-- Trigger for conversations updated_at
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-update conversation updated_at when messages are added
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET updated_at = now() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update conversation timestamp when messages are added
CREATE TRIGGER update_conversation_on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Function to auto-generate conversation title from first message
CREATE OR REPLACE FUNCTION generate_conversation_title()
RETURNS TRIGGER AS $$
BEGIN
  -- Update title only if it's the default and this is a user message
  IF NEW.type = 'user' AND NOT EXISTS (
    SELECT 1 FROM messages 
    WHERE conversation_id = NEW.conversation_id 
    AND type = 'user' 
    AND id != NEW.id
  ) THEN
    UPDATE conversations 
    SET title = CASE 
      WHEN length(NEW.content) > 50 
      THEN substring(NEW.content from 1 for 47) || '...'
      ELSE NEW.content
    END
    WHERE id = NEW.conversation_id 
    AND title = 'New Conversation';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to generate conversation title
CREATE TRIGGER generate_conversation_title_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION generate_conversation_title();
