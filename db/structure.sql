SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: activity_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.activity_type AS ENUM (
    'Workshop',
    'Show',
    'SocialEvent'
);


--
-- Name: payment_state; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_state AS ENUM (
    'pending',
    'approved',
    'cancelled',
    'failed'
);


--
-- Name: payment_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_type AS ENUM (
    'CreditCardPayment',
    'InternetBankingPayment',
    'Voucher'
);


--
-- Name: f_unaccent(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.f_unaccent(text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $_$SELECT public.unaccent('public.unaccent', $1)$_$;


--
-- Name: my_concat(text, text[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.my_concat(text, text[]) RETURNS text
    LANGUAGE sql IMMUTABLE PARALLEL SAFE
    AS $_$SELECT array_to_string($2, $1)$_$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: active_record_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.active_record_views (
    name text NOT NULL,
    class_name text NOT NULL,
    checksum text NOT NULL,
    options json DEFAULT '{}'::json NOT NULL,
    refreshed_at timestamp without time zone
);


--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activities (
    id bigint NOT NULL,
    festival_id bigint,
    type public.activity_type NOT NULL,
    name character varying,
    slug character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    description text,
    searchable tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('english'::regconfig, (COALESCE(name, ''::character varying))::text), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(description, ''::text)), 'B'::"char"))) STORED,
    picture_data jsonb,
    blurhash character varying,
    booking_link character varying,
    suitability text
);


--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: allocations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.allocations (
    id bigint NOT NULL,
    festival_id bigint NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    completed_at timestamp without time zone,
    data jsonb DEFAULT '{}'::jsonb
);


--
-- Name: allocations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.allocations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: allocations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.allocations_id_seq OWNED BY public.allocations.id;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: cast; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."cast" (
    id bigint NOT NULL,
    activity_type character varying NOT NULL,
    activity_id bigint NOT NULL,
    profile_id bigint NOT NULL,
    role character varying NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: cast_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cast_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cast_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cast_id_seq OWNED BY public."cast".id;


--
-- Name: festivals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.festivals (
    id bigint NOT NULL,
    start_date date,
    end_date date,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    earlybird_opens_at timestamp without time zone,
    earlybird_closes_at timestamp without time zone,
    general_opens_at timestamp without time zone
);


--
-- Name: festivals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.festivals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: festivals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.festivals_id_seq OWNED BY public.festivals.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id bigint NOT NULL,
    registration_id bigint NOT NULL,
    type public.payment_type NOT NULL,
    state public.payment_state DEFAULT 'pending'::public.payment_state NOT NULL,
    amount_cents integer NOT NULL,
    reference character varying,
    notes text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: placements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placements (
    id bigint NOT NULL,
    registration_id bigint NOT NULL,
    session_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: placements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.placements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: placements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.placements_id_seq OWNED BY public.placements.id;


--
-- Name: placenames; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placenames (
    id bigint NOT NULL,
    english character varying,
    traditional character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    searchable tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('english'::regconfig, public.f_unaccent((COALESCE(english, ''::character varying))::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, public.f_unaccent((COALESCE(traditional, ''::character varying))::text)), 'B'::"char"))) STORED
);


--
-- Name: placenames_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.placenames_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: placenames_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.placenames_id_seq OWNED BY public.placenames.id;


--
-- Name: preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.preferences (
    id bigint NOT NULL,
    registration_id bigint NOT NULL,
    session_id bigint NOT NULL,
    slot_id timestamp without time zone NOT NULL,
    "position" integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.preferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.preferences_id_seq OWNED BY public.preferences.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id bigint NOT NULL,
    user_id bigint,
    pronouns character varying,
    name character varying,
    city character varying,
    country character varying,
    bio text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    searchable tsvector GENERATED ALWAYS AS (setweight(to_tsvector('english'::regconfig, (COALESCE(name, ''::character varying))::text), 'A'::"char")) STORED,
    picture_data jsonb,
    phone character varying(32)
);


--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registrations (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    festival_id bigint NOT NULL,
    code_of_conduct_accepted_at timestamp without time zone,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    completed_at timestamp without time zone
);


--
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.registrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id bigint NOT NULL,
    festival_id bigint NOT NULL,
    venue_id bigint,
    starts_at timestamp without time zone NOT NULL,
    ends_at timestamp without time zone NOT NULL,
    activity_type public.activity_type,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    activity_id bigint,
    capacity integer,
    placements_count integer DEFAULT 0 NOT NULL
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: short_urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.short_urls (
    id bigint NOT NULL,
    url character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: short_urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.short_urls_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: short_urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.short_urls_id_seq OWNED BY public.short_urls.id;


--
-- Name: show_workshops; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.show_workshops (
    id bigint NOT NULL,
    show_id bigint NOT NULL,
    workshop_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: show_workshops_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.show_workshops_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: show_workshops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.show_workshops_id_seq OWNED BY public.show_workshops.id;


--
-- Name: slot_activities; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.slot_activities AS
 SELECT sessions.starts_at,
    sessions.activity_id,
    sessions.id AS session_id
   FROM public.sessions
  WHERE (sessions.activity_id IS NOT NULL);


--
-- Name: slot_sessions; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.slot_sessions AS
 SELECT sessions.starts_at,
    sessions.id AS session_id
   FROM public.sessions
  WHERE (sessions.activity_id IS NOT NULL);


--
-- Name: slots; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.slots AS
 SELECT sessions.festival_id,
    sessions.starts_at,
    sessions.ends_at
   FROM public.sessions
  GROUP BY sessions.festival_id, sessions.starts_at, sessions.ends_at
  ORDER BY sessions.starts_at;


--
-- Name: translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.translations (
    id bigint NOT NULL,
    locale character varying,
    key character varying,
    value text,
    interpolations text,
    is_proc boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: translations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.translations_id_seq OWNED BY public.translations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    provider character varying DEFAULT 'email'::character varying NOT NULL,
    uid character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp(6) without time zone,
    allow_password_change boolean DEFAULT false,
    remember_created_at timestamp(6) without time zone,
    confirmation_token character varying,
    confirmed_at timestamp(6) without time zone,
    confirmation_sent_at timestamp(6) without time zone,
    unconfirmed_email character varying,
    name character varying,
    email character varying,
    tokens json,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    settings public.hstore DEFAULT ''::public.hstore NOT NULL,
    searchable tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('english'::regconfig, (COALESCE(name, ''::character varying))::text), 'A'::"char") || setweight(to_tsvector('english'::regconfig, public.my_concat(' '::text, regexp_split_to_array((COALESCE(email, ''::character varying))::text, '[.@]'::text))), 'B'::"char"))) STORED,
    permissions character varying[]
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: venues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.venues (
    id bigint NOT NULL,
    room character varying,
    building character varying NOT NULL,
    address character varying NOT NULL,
    latitude numeric(15,10),
    longitude numeric(15,10),
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    searchable tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('english'::regconfig, (COALESCE(room, ''::character varying))::text), 'A'::"char") || setweight(to_tsvector('english'::regconfig, (COALESCE(building, ''::character varying))::text), 'B'::"char"))) STORED,
    "position" integer DEFAULT 0 NOT NULL
);


--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.venues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: venues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.venues_id_seq OWNED BY public.venues.id;


--
-- Name: versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.versions (
    id bigint NOT NULL,
    item_type character varying NOT NULL,
    item_id bigint NOT NULL,
    event character varying NOT NULL,
    whodunnit character varying,
    object text,
    created_at timestamp(6) without time zone
);


--
-- Name: versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.versions_id_seq OWNED BY public.versions.id;


--
-- Name: waitlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waitlist (
    id bigint NOT NULL,
    session_id bigint NOT NULL,
    registration_id bigint NOT NULL,
    "position" integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    offered_at timestamp without time zone
);


--
-- Name: waitlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.waitlist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: waitlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.waitlist_id_seq OWNED BY public.waitlist.id;


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: allocations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocations ALTER COLUMN id SET DEFAULT nextval('public.allocations_id_seq'::regclass);


--
-- Name: cast id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."cast" ALTER COLUMN id SET DEFAULT nextval('public.cast_id_seq'::regclass);


--
-- Name: festivals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.festivals ALTER COLUMN id SET DEFAULT nextval('public.festivals_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: placements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placements ALTER COLUMN id SET DEFAULT nextval('public.placements_id_seq'::regclass);


--
-- Name: placenames id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placenames ALTER COLUMN id SET DEFAULT nextval('public.placenames_id_seq'::regclass);


--
-- Name: preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preferences ALTER COLUMN id SET DEFAULT nextval('public.preferences_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: short_urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.short_urls ALTER COLUMN id SET DEFAULT nextval('public.short_urls_id_seq'::regclass);


--
-- Name: show_workshops id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.show_workshops ALTER COLUMN id SET DEFAULT nextval('public.show_workshops_id_seq'::regclass);


--
-- Name: translations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations ALTER COLUMN id SET DEFAULT nextval('public.translations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: venues id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venues ALTER COLUMN id SET DEFAULT nextval('public.venues_id_seq'::regclass);


--
-- Name: versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.versions ALTER COLUMN id SET DEFAULT nextval('public.versions_id_seq'::regclass);


--
-- Name: waitlist id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist ALTER COLUMN id SET DEFAULT nextval('public.waitlist_id_seq'::regclass);


--
-- Name: active_record_views active_record_views_class_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_record_views
    ADD CONSTRAINT active_record_views_class_name_key UNIQUE (class_name);


--
-- Name: active_record_views active_record_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_record_views
    ADD CONSTRAINT active_record_views_pkey PRIMARY KEY (name);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: allocations allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: cast cast_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."cast"
    ADD CONSTRAINT cast_pkey PRIMARY KEY (id);


--
-- Name: festivals festivals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.festivals
    ADD CONSTRAINT festivals_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: placements placements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placements
    ADD CONSTRAINT placements_pkey PRIMARY KEY (id);


--
-- Name: placenames placenames_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placenames
    ADD CONSTRAINT placenames_pkey PRIMARY KEY (id);


--
-- Name: preferences preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preferences
    ADD CONSTRAINT preferences_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: short_urls short_urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.short_urls
    ADD CONSTRAINT short_urls_pkey PRIMARY KEY (id);


--
-- Name: show_workshops show_workshops_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.show_workshops
    ADD CONSTRAINT show_workshops_pkey PRIMARY KEY (id);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- Name: versions versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.versions
    ADD CONSTRAINT versions_pkey PRIMARY KEY (id);


--
-- Name: waitlist waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_pkey PRIMARY KEY (id);


--
-- Name: index_activities_on_festival_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activities_on_festival_id ON public.activities USING btree (festival_id);


--
-- Name: index_activities_on_festival_id_and_type_and_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_activities_on_festival_id_and_type_and_slug ON public.activities USING btree (festival_id, type, slug);


--
-- Name: index_activities_on_searchable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activities_on_searchable ON public.activities USING gin (searchable);


--
-- Name: index_allocations_on_festival_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_allocations_on_festival_id ON public.allocations USING btree (festival_id);


--
-- Name: index_cast_on_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cast_on_profile_id ON public."cast" USING btree (profile_id);


--
-- Name: index_cast_uniquely; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_cast_uniquely ON public."cast" USING btree (activity_type, activity_id, profile_id, role);


--
-- Name: index_payments_on_registration_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_payments_on_registration_id ON public.payments USING btree (registration_id);


--
-- Name: index_payments_on_registration_id_and_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_payments_on_registration_id_and_type ON public.payments USING btree (registration_id, type);


--
-- Name: index_placements_on_registration_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_placements_on_registration_id ON public.placements USING btree (registration_id);


--
-- Name: index_placements_on_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_placements_on_session_id ON public.placements USING btree (session_id);


--
-- Name: index_placements_on_session_id_and_registration_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_placements_on_session_id_and_registration_id ON public.placements USING btree (session_id, registration_id);


--
-- Name: index_placenames_on_english; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_placenames_on_english ON public.placenames USING btree (english);


--
-- Name: index_placenames_on_traditional; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_placenames_on_traditional ON public.placenames USING btree (traditional);


--
-- Name: index_preferences_on_registration_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_preferences_on_registration_id ON public.preferences USING btree (registration_id);


--
-- Name: index_preferences_on_registration_id_and_slot_id_and_position; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_preferences_on_registration_id_and_slot_id_and_position ON public.preferences USING btree (registration_id, slot_id, "position");


--
-- Name: index_preferences_on_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_preferences_on_session_id ON public.preferences USING btree (session_id);


--
-- Name: index_preferences_on_slot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_preferences_on_slot_id ON public.preferences USING btree (slot_id);


--
-- Name: index_profiles_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_profiles_on_user_id ON public.profiles USING btree (user_id);


--
-- Name: index_registrations_on_completed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_registrations_on_completed_at ON public.registrations USING btree (completed_at);


--
-- Name: index_registrations_on_festival_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_registrations_on_festival_id ON public.registrations USING btree (festival_id);


--
-- Name: index_registrations_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_registrations_on_user_id ON public.registrations USING btree (user_id);


--
-- Name: index_registrations_on_user_id_and_festival_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_registrations_on_user_id_and_festival_id ON public.registrations USING btree (user_id, festival_id);


--
-- Name: index_sessions_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sessions_on_activity_id ON public.sessions USING btree (activity_id);


--
-- Name: index_sessions_on_festival_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sessions_on_festival_id ON public.sessions USING btree (festival_id);


--
-- Name: index_sessions_on_venue_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sessions_on_venue_id ON public.sessions USING btree (venue_id);


--
-- Name: index_short_urls_on_url; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_short_urls_on_url ON public.short_urls USING btree (url);


--
-- Name: index_show_workshops_on_show_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_show_workshops_on_show_id ON public.show_workshops USING btree (show_id);


--
-- Name: index_show_workshops_on_show_id_and_workshop_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_show_workshops_on_show_id_and_workshop_id ON public.show_workshops USING btree (show_id, workshop_id);


--
-- Name: index_show_workshops_on_workshop_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_show_workshops_on_workshop_id ON public.show_workshops USING btree (workshop_id);


--
-- Name: index_slots_on_everything; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_slots_on_everything ON public.sessions USING btree (festival_id, venue_id, starts_at, ends_at);


--
-- Name: index_translations_on_key_and_locale; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_translations_on_key_and_locale ON public.translations USING btree (key, locale);


--
-- Name: index_users_on_confirmation_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_confirmation_token ON public.users USING btree (confirmation_token);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);


--
-- Name: index_users_on_permissions; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_permissions ON public.users USING gin (permissions);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON public.users USING btree (reset_password_token);


--
-- Name: index_users_on_searchable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_searchable ON public.users USING gin (searchable);


--
-- Name: index_users_on_uid_and_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_uid_and_provider ON public.users USING btree (uid, provider);


--
-- Name: index_venues_on_latitude_and_longitude; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_venues_on_latitude_and_longitude ON public.venues USING btree (latitude, longitude);


--
-- Name: index_versions_on_item_type_and_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_versions_on_item_type_and_item_id ON public.versions USING btree (item_type, item_id);


--
-- Name: index_waitlist_on_offered_at_and_registration_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_waitlist_on_offered_at_and_registration_id ON public.waitlist USING btree (offered_at, registration_id);


--
-- Name: index_waitlist_on_registration_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_waitlist_on_registration_id ON public.waitlist USING btree (registration_id);


--
-- Name: index_waitlist_on_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_waitlist_on_session_id ON public.waitlist USING btree (session_id);


--
-- Name: index_waitlist_on_session_id_and_registration_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_waitlist_on_session_id_and_registration_id ON public.waitlist USING btree (session_id, registration_id);


--
-- Name: cast fk_rails_0cfc4c6b7a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."cast"
    ADD CONSTRAINT fk_rails_0cfc4c6b7a FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;


--
-- Name: waitlist fk_rails_11b65ce122; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT fk_rails_11b65ce122 FOREIGN KEY (registration_id) REFERENCES public.registrations(id) ON DELETE RESTRICT;


--
-- Name: registrations fk_rails_2e0658f554; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT fk_rails_2e0658f554 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: show_workshops fk_rails_34bf9d8260; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.show_workshops
    ADD CONSTRAINT fk_rails_34bf9d8260 FOREIGN KEY (workshop_id) REFERENCES public.activities(id) ON DELETE CASCADE;


--
-- Name: preferences fk_rails_3f86686605; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preferences
    ADD CONSTRAINT fk_rails_3f86686605 FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;


--
-- Name: waitlist fk_rails_411eff5ca7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT fk_rails_411eff5ca7 FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE RESTRICT;


--
-- Name: registrations fk_rails_4604f69f81; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT fk_rails_4604f69f81 FOREIGN KEY (festival_id) REFERENCES public.festivals(id);


--
-- Name: allocations fk_rails_595dd1d487; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT fk_rails_595dd1d487 FOREIGN KEY (festival_id) REFERENCES public.festivals(id) ON DELETE CASCADE;


--
-- Name: sessions fk_rails_634f411c00; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_rails_634f411c00 FOREIGN KEY (activity_id) REFERENCES public.activities(id) ON DELETE SET NULL;


--
-- Name: sessions fk_rails_7ac879864b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_rails_7ac879864b FOREIGN KEY (festival_id) REFERENCES public.festivals(id) ON DELETE CASCADE;


--
-- Name: show_workshops fk_rails_8a74cfc29e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.show_workshops
    ADD CONSTRAINT fk_rails_8a74cfc29e FOREIGN KEY (show_id) REFERENCES public.activities(id);


--
-- Name: placements fk_rails_9b0301b07e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placements
    ADD CONSTRAINT fk_rails_9b0301b07e FOREIGN KEY (registration_id) REFERENCES public.registrations(id);


--
-- Name: placements fk_rails_a3075eb6ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placements
    ADD CONSTRAINT fk_rails_a3075eb6ce FOREIGN KEY (session_id) REFERENCES public.sessions(id);


--
-- Name: payments fk_rails_bb9133230f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_rails_bb9133230f FOREIGN KEY (registration_id) REFERENCES public.registrations(id);


--
-- Name: profiles fk_rails_e424190865; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT fk_rails_e424190865 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: preferences fk_rails_e71b272656; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preferences
    ADD CONSTRAINT fk_rails_e71b272656 FOREIGN KEY (registration_id) REFERENCES public.registrations(id);


--
-- Name: sessions fk_rails_f482cd28c7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_rails_f482cd28c7 FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20230403213514'),
('20230404000215'),
('20230404025705'),
('20230407020130'),
('20230407185946'),
('20230407200707'),
('20230407200831'),
('20230409225123'),
('20230410203022'),
('20230410205819'),
('20230422022541'),
('20230422033310'),
('20230427052656'),
('20230429064646'),
('20230429104442'),
('20230429110004'),
('20230429111227'),
('20230429195143'),
('20230504010958'),
('20230504035331'),
('20230505181302'),
('20230505234432'),
('20230507021310'),
('20230507031607'),
('20230507224337'),
('20230514033249'),
('20230516013458'),
('20230520020008'),
('20230527193722'),
('20230528202819'),
('20230604231515'),
('20230611001108'),
('20230611001452'),
('20230611010539'),
('20230616221312'),
('20230618075348'),
('20230703004444'),
('20230721115845'),
('20230724041043'),
('20230728005202'),
('20230728012819'),
('20230806193436'),
('20230808011925'),
('20230813214033'),
('20230816054627'),
('20230823032344'),
('20230825232026'),
('20230826101957'),
('20230828234352'),
('20230831213654'),
('20230901020857');


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: active_record_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.active_record_views (name, class_name, checksum, options, refreshed_at) FROM stdin;
slot_activities	SlotActivity	717b988a5900ecc4d9842325e50563404a15d71b	{"dependencies":[]}	\N
slot_sessions	SlotSession	6ab18ab7d8faec08af36bec11b736b3e84e21cca	{"dependencies":[]}	\N
slots	Slot	d66acce70040a0dab5163f0966147d4fa78977c3	{"dependencies":[]}	\N
\.


--
-- PostgreSQL database dump complete
--

