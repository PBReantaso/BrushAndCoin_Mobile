-- Migration: 002_add_conversations_and_fix_messages.sql
-- Adds conversations, participants and normalizes messages column name
BEGIN;

-- 1) Create conversations table if missing
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT conversations_pkey PRIMARY KEY (id)
);

-- 2) Create conversation_participants for tracking participants/last_read
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  last_read_at timestamptz,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT conversation_participants_pkey PRIMARY KEY (id),
  CONSTRAINT conversation_participants_conv_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations (id) ON DELETE CASCADE,
  CONSTRAINT conversation_participants_user_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE,
  CONSTRAINT conversation_participants_unique UNIQUE (conversation_id, user_id)
);

-- 3) Rename messages.message -> messages.text when appropriate (non-destructive check)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'message'
  ) THEN
    -- if 'text' already exists, skip rename
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'text'
    ) THEN
      ALTER TABLE public.messages RENAME COLUMN message TO text;
    ELSE
      RAISE NOTICE 'messages.text already exists; leaving both columns as-is.';
    END IF;
  ELSE
    RAISE NOTICE 'messages.message column not found; nothing to rename.';
  END IF;
END$$;

-- 4) Ensure messages.conversation_id references conversations(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'messages' AND kcu.column_name = 'conversation_id'
  ) THEN
    -- add FK constraint
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations (id) ON DELETE CASCADE;
  ELSE
    RAISE NOTICE 'Foreign key on messages.conversation_id already exists.';
  END IF;
END$$;

-- 5) Create helpful indexes
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations (created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants (conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants (user_id);

COMMIT;
