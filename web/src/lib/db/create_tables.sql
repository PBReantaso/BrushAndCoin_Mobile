-- Create tables in correct dependency order

-- 1. Users (no dependencies)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    username character varying(50),
    bio text,
    profile_image_url text,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    location_lat numeric(10,8),
    location_lng numeric(11,8),
    location_address text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_type character varying(20) NOT NULL DEFAULT 'user',
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
);

-- 2. Commissions (depends on users)
CREATE TABLE IF NOT EXISTS public.commissions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL,
    artist_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    budget numeric(10,2) NOT NULL,
    deadline date,
    status character varying(20) DEFAULT 'pending',
    reference_images text[],
    requirements text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT commissions_pkey PRIMARY KEY (id),
    CONSTRAINT commissions_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.users (id) ON DELETE CASCADE,
    CONSTRAINT commissions_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users (id) ON DELETE CASCADE
);

-- 3. Artworks (depends on users)
CREATE TABLE IF NOT EXISTS public.artworks (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_urls text[],
    category character varying(50),
    tags text[],
    price numeric(10,2),
    is_commission boolean DEFAULT false,
    is_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT artworks_pkey PRIMARY KEY (id),
    CONSTRAINT artworks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);

-- 4. Comments (depends on artworks and users)
CREATE TABLE IF NOT EXISTS public.comments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    artwork_id uuid NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comments_pkey PRIMARY KEY (id),
    CONSTRAINT comments_artwork_id_fkey FOREIGN KEY (artwork_id) REFERENCES public.artworks (id) ON DELETE CASCADE,
    CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);

-- 5. Reviews (depends on commissions and users)
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    reviewer_id uuid NOT NULL,
    reviewee_id uuid NOT NULL,
    commission_id uuid,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT reviews_commission_id_fkey FOREIGN KEY (commission_id) REFERENCES public.commissions (id) ON DELETE SET NULL,
    CONSTRAINT reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES public.users (id) ON DELETE CASCADE,
    CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users (id) ON DELETE CASCADE,
    CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)
);

-- 6. Payments (depends on commissions)
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    commission_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'PHP',
    payment_method character varying(50) NOT NULL,
    payment_gateway character varying(50) NOT NULL,
    gateway_transaction_id character varying(255),
    status character varying(20) DEFAULT 'pending',
    escrow_released_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT payments_commission_id_fkey FOREIGN KEY (commission_id) REFERENCES public.commissions (id) ON DELETE CASCADE
);

-- 7. Messages (depends on users)
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    message text NOT NULL,
    message_type character varying(20) DEFAULT 'text',
    attachment_url text,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users (id) ON DELETE CASCADE,
    CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users (id) ON DELETE CASCADE
);

-- 8. Events (depends on users)
CREATE TABLE IF NOT EXISTS public.events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    organizer_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    event_date timestamp with time zone NOT NULL,
    location_lat numeric(10,8),
    location_lng numeric(11,8),
    location_address text,
    max_attendees integer,
    registration_fee numeric(10,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT events_pkey PRIMARY KEY (id),
    CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users (id) ON DELETE CASCADE
);

-- 9. Event Attendees (depends on events and users)
CREATE TABLE IF NOT EXISTS public.event_attendees (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    registered_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT event_attendees_pkey PRIMARY KEY (id),
    CONSTRAINT event_attendees_event_id_user_id_key UNIQUE (event_id, user_id),
    CONSTRAINT event_attendees_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events (id) ON DELETE CASCADE,
    CONSTRAINT event_attendees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);

-- 10. Follows (depends on users)
CREATE TABLE IF NOT EXISTS public.follows (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    follower_id uuid NOT NULL,
    following_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT follows_pkey PRIMARY KEY (id),
    CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users (id) ON DELETE CASCADE,
    CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.users (id) ON DELETE CASCADE,
    CONSTRAINT follows_unique_follow UNIQUE (follower_id, following_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);
CREATE INDEX IF NOT EXISTS idx_commissions_artist_id ON public.commissions (artist_id);
CREATE INDEX IF NOT EXISTS idx_commissions_client_id ON public.commissions (client_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions (status);
CREATE INDEX IF NOT EXISTS idx_artworks_user_id ON public.artworks (user_id);
CREATE INDEX IF NOT EXISTS idx_comments_artwork_id ON public.comments (artwork_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews (reviewee_id);
CREATE INDEX IF NOT EXISTS idx_payments_commission_id ON public.payments (commission_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON public.events (organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees (event_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows (following_id);

