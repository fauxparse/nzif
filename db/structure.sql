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
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


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
    'SocialEvent',
    'Conference'
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
    'Voucher',
    'Refund'
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


--
-- Name: accounts; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.accounts AS
SELECT
    NULL::bigint AS id,
    NULL::bigint AS registration_id,
    NULL::integer AS placements_count,
    NULL::integer AS total_cents,
    NULL::bigint AS paid_cents,
    NULL::bigint AS outstanding_cents;


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
    suitability text,
    tagline character varying DEFAULT ''::character varying NOT NULL,
    quotes character varying DEFAULT ''::character varying NOT NULL
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
-- Name: ownerships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ownerships (
    id bigint NOT NULL,
    profile_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


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
    phone character varying(32),
    hidden boolean DEFAULT false NOT NULL
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
-- Name: activity_owners; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.activity_owners AS
 SELECT owners.user_id,
    'User'::text AS user_type,
    casting.activity_id,
    casting.activity_type,
    casting.role,
    casting.session_id
   FROM (( SELECT profiles.user_id,
            profiles.id AS profile_id
           FROM public.profiles
        UNION ALL
         SELECT ownerships.user_id,
            ownerships.profile_id
           FROM public.ownerships) owners
     JOIN ( SELECT "cast".profile_id,
            sessions.activity_id,
            (sessions.activity_type)::text AS activity_type,
            "cast".role,
            sessions.id AS session_id
           FROM (public."cast"
             JOIN public.sessions ON (((("cast".activity_type)::text = 'Activity'::text) AND (sessions.activity_id = "cast".activity_id))))
        UNION ALL
         SELECT "cast".profile_id,
            sessions.activity_id,
            (sessions.activity_type)::text AS activity_type,
            "cast".role,
            sessions.id AS session_id
           FROM (public."cast"
             JOIN public.sessions ON (((("cast".activity_type)::text = 'Session'::text) AND ("cast".activity_id = sessions.id))))) casting ON ((casting.profile_id = owners.profile_id)))
  WHERE (owners.user_id IS NOT NULL);


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
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cities (
    id bigint NOT NULL,
    name character varying,
    traditional_names character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    country character varying(2),
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: donations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.donations (
    id bigint NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    message character varying,
    amount_cents integer DEFAULT 0 NOT NULL,
    anonymous boolean DEFAULT false NOT NULL,
    newsletter boolean DEFAULT false NOT NULL,
    state public.payment_state DEFAULT 'pending'::public.payment_state NOT NULL,
    reference character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: donations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.donations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: donations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.donations_id_seq OWNED BY public.donations.id;


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback (
    id bigint NOT NULL,
    registration_id bigint NOT NULL,
    session_id bigint NOT NULL,
    rating integer,
    positive text,
    constructive text,
    testimonial text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedback_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


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
-- Name: hidden_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hidden_sessions (
    id bigint NOT NULL,
    session_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: hidden_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hidden_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hidden_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hidden_sessions_id_seq OWNED BY public.hidden_sessions.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    messageable_type character varying NOT NULL,
    messageable_id bigint NOT NULL,
    sender_id bigint NOT NULL,
    subject character varying,
    content text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: ownerships_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ownerships_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ownerships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ownerships_id_seq OWNED BY public.ownerships.id;


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
-- Name: profile_activities; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.profile_activities AS
 SELECT activities.id AS activity_id,
    NULL::bigint AS session_id,
    "cast".profile_id,
    "cast".role
   FROM (public.activities
     JOIN public."cast" ON (((activities.id = "cast".activity_id) AND (("cast".activity_type)::text = 'Activity'::text))))
UNION
 SELECT activities.id AS activity_id,
    sessions.id AS session_id,
    "cast".profile_id,
    "cast".role
   FROM ((public.activities
     JOIN public.sessions ON ((activities.id = sessions.activity_id)))
     JOIN public."cast" ON (((sessions.id = "cast".activity_id) AND (("cast".activity_type)::text = 'Session'::text))));


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
    completed_at timestamp without time zone,
    stripe_customer_id character varying,
    placements_count integer,
    photo_permission boolean DEFAULT false NOT NULL,
    show_explainer boolean DEFAULT true NOT NULL,
    donate_discount boolean DEFAULT false NOT NULL
);


--
-- Name: registration_totals; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.registration_totals AS
 WITH pricing AS (
         SELECT base.count,
            discounted.discountable,
            (base.count * 7000) AS total,
            ((((discounted.discountable * (discounted.discountable - 1)) / 2) * 500) + (GREATEST(0, (base.count - discounted.discountable)) * 2000)) AS discount
           FROM ( SELECT generate_series(0, 11) AS count) base,
            LATERAL ( SELECT discounted_1.discountable
                   FROM ( SELECT generate_series(0, 11) AS count,
                            LEAST(base.count, 5) AS discountable) discounted_1
                  WHERE (discounted_1.count = base.count)) discounted
        )
 SELECT registrations.festival_id,
    registrations.id,
    pricing.total AS subtotal,
    pricing.discount,
    registrations.donate_discount,
        CASE registrations.donate_discount
            WHEN true THEN pricing.total
            ELSE (pricing.total - pricing.discount)
        END AS total
   FROM (public.registrations
     JOIN pricing ON ((registrations.placements_count = pricing.count)))
  WHERE (registrations.completed_at IS NOT NULL);


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
-- Name: session_slots; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.session_slots AS
 WITH multi_slot_sessions AS (
         SELECT sessions.id AS session_id,
            sessions.festival_id,
                CASE
                    WHEN ((sessions.activity_type = 'Workshop'::public.activity_type) AND ((sessions.ends_at - sessions.starts_at) > '03:00:00'::interval hour)) THEN ARRAY[sessions.starts_at, (sessions.ends_at - '03:00:00'::interval hour)]
                    ELSE ARRAY[sessions.starts_at]
                END AS starts_at,
                CASE
                    WHEN ((sessions.activity_type = 'Workshop'::public.activity_type) AND ((sessions.ends_at - sessions.starts_at) > '03:00:00'::interval hour)) THEN ARRAY[(sessions.starts_at + '03:00:00'::interval hour), sessions.ends_at]
                    ELSE ARRAY[sessions.ends_at]
                END AS ends_at
           FROM public.sessions
        )
 SELECT multi_slot_sessions.session_id,
    multi_slot_sessions.festival_id,
    unnest(multi_slot_sessions.starts_at) AS starts_at,
    unnest(multi_slot_sessions.ends_at) AS ends_at
   FROM multi_slot_sessions
  WITH NO DATA;


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
 SELECT DISTINCT session_slots.festival_id,
    session_slots.starts_at,
    session_slots.ends_at
   FROM public.session_slots;


--
-- Name: snapshot_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.snapshot_items (
    id bigint NOT NULL,
    snapshot_id bigint NOT NULL,
    item_type character varying NOT NULL,
    item_id bigint NOT NULL,
    object json NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    child_group_name character varying
);


--
-- Name: snapshot_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.snapshot_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: snapshot_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.snapshot_items_id_seq OWNED BY public.snapshot_items.id;


--
-- Name: snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.snapshots (
    id bigint NOT NULL,
    item_type character varying NOT NULL,
    item_id bigint NOT NULL,
    identifier character varying,
    user_type character varying,
    user_id bigint,
    metadata jsonb,
    created_at timestamp(6) without time zone NOT NULL
);


--
-- Name: snapshots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.snapshots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: snapshots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.snapshots_id_seq OWNED BY public.snapshots.id;


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
    permissions jsonb DEFAULT '[]'::jsonb
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
-- Name: workshop_preferences; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.workshop_preferences AS
 WITH preferences AS (
         SELECT preferences_1.session_id,
            preferences_1."position",
            count(preferences_1.id) AS count
           FROM (public.preferences preferences_1
             JOIN public.sessions sessions_1 ON ((preferences_1.session_id = sessions_1.id)))
          WHERE (sessions_1.festival_id = 2)
          GROUP BY preferences_1.session_id, preferences_1."position"
        )
 SELECT sessions.id,
    activities.name,
    array_agg(ARRAY[(preferences."position")::bigint, preferences.count]) AS counts
   FROM ((preferences
     JOIN public.sessions ON ((preferences.session_id = sessions.id)))
     JOIN public.activities ON ((sessions.activity_id = activities.id)))
  GROUP BY activities.name, sessions.id;


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
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: donations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donations ALTER COLUMN id SET DEFAULT nextval('public.donations_id_seq'::regclass);


--
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: festivals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.festivals ALTER COLUMN id SET DEFAULT nextval('public.festivals_id_seq'::regclass);


--
-- Name: hidden_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hidden_sessions ALTER COLUMN id SET DEFAULT nextval('public.hidden_sessions_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: ownerships id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ownerships ALTER COLUMN id SET DEFAULT nextval('public.ownerships_id_seq'::regclass);


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
-- Name: snapshot_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.snapshot_items ALTER COLUMN id SET DEFAULT nextval('public.snapshot_items_id_seq'::regclass);


--
-- Name: snapshots id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.snapshots ALTER COLUMN id SET DEFAULT nextval('public.snapshots_id_seq'::regclass);


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
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: donations donations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: festivals festivals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.festivals
    ADD CONSTRAINT festivals_pkey PRIMARY KEY (id);


--
-- Name: hidden_sessions hidden_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hidden_sessions
    ADD CONSTRAINT hidden_sessions_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: ownerships ownerships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ownerships
    ADD CONSTRAINT ownerships_pkey PRIMARY KEY (id);


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
-- Name: snapshot_items snapshot_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.snapshot_items
    ADD CONSTRAINT snapshot_items_pkey PRIMARY KEY (id);


--
-- Name: snapshots snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.snapshots
    ADD CONSTRAINT snapshots_pkey PRIMARY KEY (id);


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
-- Name: index_feedback_on_registration_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_feedback_on_registration_id ON public.feedback USING btree (registration_id);


--
-- Name: index_feedback_on_registration_id_and_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_feedback_on_registration_id_and_session_id ON public.feedback USING btree (registration_id, session_id);


--
-- Name: index_feedback_on_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_feedback_on_session_id ON public.feedback USING btree (session_id);


--
-- Name: index_hidden_sessions_on_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_hidden_sessions_on_session_id ON public.hidden_sessions USING btree (session_id);


--
-- Name: index_hidden_sessions_on_session_id_and_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_hidden_sessions_on_session_id_and_user_id ON public.hidden_sessions USING btree (session_id, user_id);


--
-- Name: index_hidden_sessions_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_hidden_sessions_on_user_id ON public.hidden_sessions USING btree (user_id);


--
-- Name: index_messages_on_messageable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_messages_on_messageable ON public.messages USING btree (messageable_type, messageable_id);


--
-- Name: index_messages_on_sender_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_messages_on_sender_id ON public.messages USING btree (sender_id);


--
-- Name: index_ownerships_on_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ownerships_on_profile_id ON public.ownerships USING btree (profile_id);


--
-- Name: index_ownerships_on_profile_id_and_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_ownerships_on_profile_id_and_user_id ON public.ownerships USING btree (profile_id, user_id);


--
-- Name: index_ownerships_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ownerships_on_user_id ON public.ownerships USING btree (user_id);


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
-- Name: index_preferences_on_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_preferences_on_session_id ON public.preferences USING btree (session_id);


--
-- Name: index_profiles_on_hidden_and_searchable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_profiles_on_hidden_and_searchable ON public.profiles USING btree (hidden, searchable);


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
-- Name: index_snapshot_items_on_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_snapshot_items_on_item ON public.snapshot_items USING btree (item_type, item_id);


--
-- Name: index_snapshot_items_on_snapshot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_snapshot_items_on_snapshot_id ON public.snapshot_items USING btree (snapshot_id);


--
-- Name: index_snapshots_on_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_snapshots_on_identifier ON public.snapshots USING btree (identifier);


--
-- Name: index_snapshots_on_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_snapshots_on_item ON public.snapshots USING btree (item_type, item_id);


--
-- Name: index_snapshots_on_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_snapshots_on_user ON public.snapshots USING btree (user_type, user_id);


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
-- Name: accounts _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.accounts AS
 SELECT inner_query.id,
    inner_query.registration_id,
    inner_query.placements_count,
    inner_query.total_cents,
    inner_query.paid_cents,
    (inner_query.total_cents - inner_query.paid_cents) AS outstanding_cents
   FROM ( SELECT registrations.id,
            registrations.id AS registration_id,
            registrations.placements_count,
            ((7000 * registrations.placements_count) - (((registrations.placements_count * (registrations.placements_count - 1)) / 2) * 500)) AS total_cents,
            COALESCE(sum(payments.amount_cents), (0)::bigint) AS paid_cents
           FROM (public.registrations
             LEFT JOIN public.payments ON (((payments.registration_id = registrations.id) AND (payments.state = 'approved'::public.payment_state))))
          WHERE (registrations.completed_at IS NOT NULL)
          GROUP BY registrations.id) inner_query;


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
-- Name: feedback fk_rails_301803d736; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT fk_rails_301803d736 FOREIGN KEY (registration_id) REFERENCES public.registrations(id);


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
-- Name: feedback fk_rails_4df94b4825; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT fk_rails_4df94b4825 FOREIGN KEY (session_id) REFERENCES public.sessions(id);


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
-- Name: ownerships fk_rails_68282d75fa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ownerships
    ADD CONSTRAINT fk_rails_68282d75fa FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions fk_rails_7ac879864b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_rails_7ac879864b FOREIGN KEY (festival_id) REFERENCES public.festivals(id) ON DELETE CASCADE;


--
-- Name: ownerships fk_rails_82c6631333; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ownerships
    ADD CONSTRAINT fk_rails_82c6631333 FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


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
-- Name: hidden_sessions fk_rails_9d7a005f99; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hidden_sessions
    ADD CONSTRAINT fk_rails_9d7a005f99 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: hidden_sessions fk_rails_a1debd137d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hidden_sessions
    ADD CONSTRAINT fk_rails_a1debd137d FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;


--
-- Name: placements fk_rails_a3075eb6ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placements
    ADD CONSTRAINT fk_rails_a3075eb6ce FOREIGN KEY (session_id) REFERENCES public.sessions(id);


--
-- Name: messages fk_rails_b8f26a382d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_rails_b8f26a382d FOREIGN KEY (sender_id) REFERENCES public.users(id);


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
('20250626220704'),
('20250626220219'),
('20241005022723'),
('20240902040156'),
('20240902035845'),
('20240902031323'),
('20240901001119'),
('20240816225633'),
('20240804062833'),
('20240804062832'),
('20240804062831'),
('20240726035602'),
('20240725035813'),
('20240725001136'),
('20240723050841'),
('20240616030719'),
('20240608234005'),
('20231009211805'),
('20231006212429'),
('20231003055221'),
('20230927061247'),
('20230917052932'),
('20230916002539'),
('20230905234421'),
('20230905055639'),
('20230904001348'),
('20230901020857'),
('20230831213654'),
('20230828234352'),
('20230826101957'),
('20230825232026'),
('20230823032344'),
('20230816054627'),
('20230813214033'),
('20230808011925'),
('20230806193436'),
('20230728012819'),
('20230728005202'),
('20230724041043'),
('20230721115845'),
('20230703004444'),
('20230618075348'),
('20230616221312'),
('20230611010539'),
('20230611001452'),
('20230611001108'),
('20230604231515'),
('20230528202819'),
('20230527193722'),
('20230520020008'),
('20230516013458'),
('20230514033249'),
('20230507224337'),
('20230507031607'),
('20230507021310'),
('20230505234432'),
('20230505181302'),
('20230504035331'),
('20230504010958'),
('20230429195143'),
('20230429111227'),
('20230429110004'),
('20230429104442'),
('20230429064646'),
('20230427052656'),
('20230422033310'),
('20230422022541'),
('20230410205819'),
('20230410203022'),
('20230409225123'),
('20230407200831'),
('20230407200707'),
('20230407185946'),
('20230407020130'),
('20230404025705'),
('20230404000215'),
('20230403213514');

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
accounts	Account	527717ab674bda9a8d0d439f086869ff2cf1098a	{"dependencies":[]}	\N
activity_owners	ActivityOwner	f2723da6818beb2445e1d563125953c531272374	{"dependencies":[]}	\N
profile_activities	ProfileActivity	620b36acc01bdec1cee0a4ad0563589583e7477a	{"dependencies":[]}	\N
registration_totals	RegistrationTotal	d0b0e308f3d49300e5a808de6b7f8fdb2edf60ae	{"dependencies":[]}	\N
session_slots	SessionSlot	ff3c3045df6f7160a21a2db1c77dc7a7943f1a85	{"materialized":true,"dependencies":[]}	\N
slot_activities	SlotActivity	717b988a5900ecc4d9842325e50563404a15d71b	{"dependencies":[]}	\N
slot_sessions	SlotSession	6ab18ab7d8faec08af36bec11b736b3e84e21cca	{"dependencies":[]}	\N
slots	Slot	1c4ea33d8111de6a131f801f66ede63abb6667e7	{"dependencies":["SessionSlot"]}	\N
workshop_preferences	WorkshopPreference	48a849004965844f43917f92313d87f9e450c65b	{"dependencies":[]}	\N
\.


--
-- PostgreSQL database dump complete
--

