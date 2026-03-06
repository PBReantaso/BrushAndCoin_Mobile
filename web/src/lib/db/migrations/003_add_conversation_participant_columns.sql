-- Migration: 003_add_conversation_participant_columns.sql
-- Adds participant1_id, participant2_id, last_message_id, last_message_at for 1:1 messaging
BEGIN;

-- Add participant columns to conversations (for 1:1 chats)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'participant1_id'
  ) THEN
    ALTER TABLE public.conversations ADD COLUMN participant1_id uuid REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'participant2_id'
  ) THEN
    ALTER TABLE public.conversations ADD COLUMN participant2_id uuid REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'last_message_id'
  ) THEN
    ALTER TABLE public.conversations ADD COLUMN last_message_id uuid;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'last_message_at'
  ) THEN
    ALTER TABLE public.conversations ADD COLUMN last_message_at timestamptz;
  END IF;
END$$;

-- Index for looking up conversations by participants
CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON public.conversations (participant1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON public.conversations (participant2_id);

COMMIT;
