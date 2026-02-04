-- Create likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.likes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    artwork_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT likes_pkey PRIMARY KEY (id),
    CONSTRAINT likes_artwork_id_fkey FOREIGN KEY (artwork_id)
        REFERENCES public.artworks (id) ON DELETE CASCADE,
    CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) ON DELETE CASCADE,
    CONSTRAINT likes_unique_like UNIQUE (user_id, artwork_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_likes_artwork_id ON public.likes (artwork_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes (user_id);
