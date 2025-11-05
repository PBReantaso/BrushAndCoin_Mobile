CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    username character varying(50) COLLATE pg_catalog."default",
    bio text COLLATE pg_catalog."default",
    profile_image_url text COLLATE pg_catalog."default",
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    location_lat numeric(10,8),
    location_lng numeric(11,8),
    location_address text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_type character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username),
    CONSTRAINT users_user_type_check CHECK (user_type::text = ANY (ARRAY['user'::character varying::text, 'admin'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
-- Index: idx_users_email

-- DROP INDEX IF EXISTS public.idx_users_email;

CREATE INDEX IF NOT EXISTS idx_users_email
    ON public.users USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_users_location

-- DROP INDEX IF EXISTS public.idx_users_location;

CREATE INDEX IF NOT EXISTS idx_users_location
    ON public.users USING btree
    (location_lat ASC NULLS LAST, location_lng ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_users_username

-- DROP INDEX IF EXISTS public.idx_users_username;

CREATE INDEX IF NOT EXISTS idx_users_username
    ON public.users USING btree
    (username COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.reviews;

CREATE TABLE IF NOT EXISTS public.reviews
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    reviewer_id uuid NOT NULL,
    reviewee_id uuid NOT NULL,
    commission_id uuid,
    rating integer NOT NULL,
    comment text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT reviews_commission_id_fkey FOREIGN KEY (commission_id)
        REFERENCES public.commissions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reviews
    OWNER to postgres;
-- Index: idx_reviews_reviewee_id

-- DROP INDEX IF EXISTS public.idx_reviews_reviewee_id;

CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id
    ON public.reviews USING btree
    (reviewee_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.payments;

CREATE TABLE IF NOT EXISTS public.payments
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    commission_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) COLLATE pg_catalog."default" DEFAULT 'PHP'::character varying,
    payment_method character varying(50) COLLATE pg_catalog."default" NOT NULL,
    payment_gateway character varying(50) COLLATE pg_catalog."default" NOT NULL,
    gateway_transaction_id character varying(255) COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    escrow_released_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT payments_commission_id_fkey FOREIGN KEY (commission_id)
        REFERENCES public.commissions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT payments_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying, 'refunded'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.payments
    OWNER to postgres;
-- Index: idx_payments_commission_id

-- DROP INDEX IF EXISTS public.idx_payments_commission_id;

CREATE INDEX IF NOT EXISTS idx_payments_commission_id
    ON public.payments USING btree
    (commission_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.messages;

CREATE TABLE IF NOT EXISTS public.messages
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    message_type character varying(20) COLLATE pg_catalog."default" DEFAULT 'text'::character varying,
    attachment_url text COLLATE pg_catalog."default",
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT messages_message_type_check CHECK (message_type::text = ANY (ARRAY['text'::character varying, 'image'::character varying, 'file'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.messages
    OWNER to postgres;
-- Index: idx_messages_conversation_id

-- DROP INDEX IF EXISTS public.idx_messages_conversation_id;

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
    ON public.messages USING btree
    (conversation_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_messages_receiver_id

-- DROP INDEX IF EXISTS public.idx_messages_receiver_id;

CREATE INDEX IF NOT EXISTS idx_messages_receiver_id
    ON public.messages USING btree
    (receiver_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_messages_sender_id

-- DROP INDEX IF EXISTS public.idx_messages_sender_id;

CREATE INDEX IF NOT EXISTS idx_messages_sender_id
    ON public.messages USING btree
    (sender_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.events;

CREATE TABLE IF NOT EXISTS public.events
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    organizer_id uuid NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    event_date timestamp with time zone NOT NULL,
    location_lat numeric(10,8),
    location_lng numeric(11,8),
    location_address text COLLATE pg_catalog."default",
    max_attendees integer,
    registration_fee numeric(10,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT events_pkey PRIMARY KEY (id),
    CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.events
    OWNER to postgres;
-- Index: idx_events_date

-- DROP INDEX IF EXISTS public.idx_events_date;

CREATE INDEX IF NOT EXISTS idx_events_date
    ON public.events USING btree
    (event_date ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_events_organizer_id

-- DROP INDEX IF EXISTS public.idx_events_organizer_id;

CREATE INDEX IF NOT EXISTS idx_events_organizer_id
    ON public.events USING btree
    (organizer_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.event_attendees;

CREATE TABLE IF NOT EXISTS public.event_attendees
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    registered_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT event_attendees_pkey PRIMARY KEY (id),
    CONSTRAINT event_attendees_event_id_user_id_key UNIQUE (event_id, user_id),
    CONSTRAINT event_attendees_event_id_fkey FOREIGN KEY (event_id)
        REFERENCES public.events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT event_attendees_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.event_attendees
    OWNER to postgres;
-- Index: idx_event_attendees_event_id

-- DROP INDEX IF EXISTS public.idx_event_attendees_event_id;

CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id
    ON public.event_attendees USING btree
    (event_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.commissions;

CREATE TABLE IF NOT EXISTS public.commissions
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL,
    artist_id uuid NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    budget numeric(10,2) NOT NULL,
    deadline date,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    reference_images text[] COLLATE pg_catalog."default",
    requirements text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT commissions_pkey PRIMARY KEY (id),
    CONSTRAINT commissions_artist_id_fkey FOREIGN KEY (artist_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT commissions_client_id_fkey FOREIGN KEY (client_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT commissions_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.commissions
    OWNER to postgres;
-- Index: idx_commissions_artist_id

-- DROP INDEX IF EXISTS public.idx_commissions_artist_id;

CREATE INDEX IF NOT EXISTS idx_commissions_artist_id
    ON public.commissions USING btree
    (artist_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_commissions_client_id

-- DROP INDEX IF EXISTS public.idx_commissions_client_id;

CREATE INDEX IF NOT EXISTS idx_commissions_client_id
    ON public.commissions USING btree
    (client_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_commissions_status

-- DROP INDEX IF EXISTS public.idx_commissions_status;

CREATE INDEX IF NOT EXISTS idx_commissions_status
    ON public.commissions USING btree
    (status COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.artworks;

CREATE TABLE IF NOT EXISTS public.artworks
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    image_urls text[] COLLATE pg_catalog."default",
    category character varying(50) COLLATE pg_catalog."default",
    tags text[] COLLATE pg_catalog."default",
    price numeric(10,2),
    is_commission boolean DEFAULT false,
    is_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT artworks_pkey PRIMARY KEY (id),
    CONSTRAINT artworks_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.artworks
    OWNER to postgres;
-- Index: idx_artworks_category

-- DROP INDEX IF EXISTS public.idx_artworks_category;

CREATE INDEX IF NOT EXISTS idx_artworks_category
    ON public.artworks USING btree
    (category COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_artworks_user_id

-- DROP INDEX IF EXISTS public.idx_artworks_user_id;

CREATE INDEX IF NOT EXISTS idx_artworks_user_id
    ON public.artworks USING btree
    (user_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.follows;

CREATE TABLE IF NOT EXISTS public.follows
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    follower_id uuid NOT NULL,
    following_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT follows_pkey PRIMARY KEY (id),
    CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT follows_unique_follow UNIQUE (follower_id, following_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.follows
    OWNER to postgres;

-- Index: idx_follows_follower_id

CREATE INDEX IF NOT EXISTS idx_follows_follower_id
    ON public.follows USING btree
    (follower_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_follows_following_id

CREATE INDEX IF NOT EXISTS idx_follows_following_id
    ON public.follows USING btree
    (following_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;