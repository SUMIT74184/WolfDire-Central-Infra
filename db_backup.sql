--
-- PostgreSQL database cluster dump
--

\restrict KnYf1rS8EensR3p1pVAH4Bo7VNEDDMDAMjjP4sPSLvMWcVGWPEOdRyrVXAKVc8q

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:dpVFRJNw0Nlj5OVckWDCKg==$3hj4JE7rMB0/1hOLyV5617/TgNV+v2fOblWAsUGJE6w=:oDdXIP91z6/q8rdsN5nP4RODagJtKHhN8wIlwn0sCew=';

--
-- User Configurations
--








\unrestrict KnYf1rS8EensR3p1pVAH4Bo7VNEDDMDAMjjP4sPSLvMWcVGWPEOdRyrVXAKVc8q

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict Kv61MiEBqIFTkhOjF4HFX6oesegd4UadT3KRm2VP4azBaB9lqMppX9UFQKYYt8M

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- PostgreSQL database dump complete
--

\unrestrict Kv61MiEBqIFTkhOjF4HFX6oesegd4UadT3KRm2VP4azBaB9lqMppX9UFQKYYt8M

--
-- Database "analytics_db" dump
--

--
-- PostgreSQL database dump
--

\restrict JL3Xz5w5ue16TDjbSdQPFakjlZGd6yeH9hRPqsg5lW2AvSJpY9xX7FcBxJxazBE

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: analytics_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE analytics_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE analytics_db OWNER TO postgres;

\unrestrict JL3Xz5w5ue16TDjbSdQPFakjlZGd6yeH9hRPqsg5lW2AvSJpY9xX7FcBxJxazBE
\connect analytics_db
\restrict JL3Xz5w5ue16TDjbSdQPFakjlZGd6yeH9hRPqsg5lW2AvSJpY9xX7FcBxJxazBE

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: community_analytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_analytics (
    id bigint NOT NULL,
    active_users integer,
    comments_created integer,
    community_id character varying(255) NOT NULL,
    date timestamp(6) without time zone NOT NULL,
    engagement_rate double precision,
    growth_rate double precision,
    new_members integer,
    posts_created integer,
    total_engagements integer
);


ALTER TABLE public.community_analytics OWNER TO postgres;

--
-- Name: community_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.community_analytics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_analytics_id_seq OWNER TO postgres;

--
-- Name: community_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.community_analytics_id_seq OWNED BY public.community_analytics.id;


--
-- Name: content_analytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_analytics (
    id bigint NOT NULL,
    comment_count integer,
    content_id bigint NOT NULL,
    content_type character varying(255) NOT NULL,
    controversy_score double precision,
    date timestamp(6) without time zone NOT NULL,
    downvotes integer,
    report_count integer,
    share_count integer,
    upvotes integer,
    view_count integer,
    virality_score double precision
);


ALTER TABLE public.content_analytics OWNER TO postgres;

--
-- Name: content_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.content_analytics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_analytics_id_seq OWNER TO postgres;

--
-- Name: content_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.content_analytics_id_seq OWNED BY public.content_analytics.id;


--
-- Name: event_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_log (
    id bigint NOT NULL,
    action character varying(255),
    event_id character varying(255) NOT NULL,
    event_type character varying(255) NOT NULL,
    metadata jsonb,
    target_id bigint,
    target_type character varying(255),
    "timestamp" timestamp(6) without time zone NOT NULL,
    user_id bigint
);


ALTER TABLE public.event_log OWNER TO postgres;

--
-- Name: event_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_log_id_seq OWNER TO postgres;

--
-- Name: event_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_log_id_seq OWNED BY public.event_log.id;


--
-- Name: trending_topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trending_topics (
    id bigint NOT NULL,
    last_updated timestamp(6) without time zone NOT NULL,
    mention_count integer,
    "timestamp" timestamp(6) without time zone NOT NULL,
    topic character varying(255) NOT NULL,
    trend_score double precision,
    velocity double precision
);


ALTER TABLE public.trending_topics OWNER TO postgres;

--
-- Name: trending_topics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trending_topics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trending_topics_id_seq OWNER TO postgres;

--
-- Name: trending_topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trending_topics_id_seq OWNED BY public.trending_topics.id;


--
-- Name: user_analytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_analytics (
    id bigint NOT NULL,
    comments_created integer,
    date timestamp(6) without time zone NOT NULL,
    downvotes_given integer,
    downvotes_received integer,
    engagement_score double precision,
    posts_created integer,
    sessions_count integer,
    total_session_duration bigint,
    trust_score double precision,
    unique_communities_visited integer,
    upvotes_given integer,
    upvotes_received integer,
    user_id bigint NOT NULL
);


ALTER TABLE public.user_analytics OWNER TO postgres;

--
-- Name: user_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_analytics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_analytics_id_seq OWNER TO postgres;

--
-- Name: user_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_analytics_id_seq OWNED BY public.user_analytics.id;


--
-- Name: community_analytics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_analytics ALTER COLUMN id SET DEFAULT nextval('public.community_analytics_id_seq'::regclass);


--
-- Name: content_analytics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_analytics ALTER COLUMN id SET DEFAULT nextval('public.content_analytics_id_seq'::regclass);


--
-- Name: event_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_log ALTER COLUMN id SET DEFAULT nextval('public.event_log_id_seq'::regclass);


--
-- Name: trending_topics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trending_topics ALTER COLUMN id SET DEFAULT nextval('public.trending_topics_id_seq'::regclass);


--
-- Name: user_analytics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_analytics ALTER COLUMN id SET DEFAULT nextval('public.user_analytics_id_seq'::regclass);


--
-- Data for Name: community_analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.community_analytics (id, active_users, comments_created, community_id, date, engagement_rate, growth_rate, new_members, posts_created, total_engagements) FROM stdin;
\.


--
-- Data for Name: content_analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.content_analytics (id, comment_count, content_id, content_type, controversy_score, date, downvotes, report_count, share_count, upvotes, view_count, virality_score) FROM stdin;
\.


--
-- Data for Name: event_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_log (id, action, event_id, event_type, metadata, target_id, target_type, "timestamp", user_id) FROM stdin;
\.


--
-- Data for Name: trending_topics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trending_topics (id, last_updated, mention_count, "timestamp", topic, trend_score, velocity) FROM stdin;
\.


--
-- Data for Name: user_analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_analytics (id, comments_created, date, downvotes_given, downvotes_received, engagement_score, posts_created, sessions_count, total_session_duration, trust_score, unique_communities_visited, upvotes_given, upvotes_received, user_id) FROM stdin;
\.


--
-- Name: community_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.community_analytics_id_seq', 1, false);


--
-- Name: content_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.content_analytics_id_seq', 1, false);


--
-- Name: event_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_log_id_seq', 1, false);


--
-- Name: trending_topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trending_topics_id_seq', 1, false);


--
-- Name: user_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_analytics_id_seq', 1, false);


--
-- Name: community_analytics community_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_analytics
    ADD CONSTRAINT community_analytics_pkey PRIMARY KEY (id);


--
-- Name: content_analytics content_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_analytics
    ADD CONSTRAINT content_analytics_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: trending_topics trending_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trending_topics
    ADD CONSTRAINT trending_topics_pkey PRIMARY KEY (id);


--
-- Name: event_log uk_sjoer2novly8reiok6rbbifhd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_log
    ADD CONSTRAINT uk_sjoer2novly8reiok6rbbifhd UNIQUE (event_id);


--
-- Name: user_analytics user_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_analytics
    ADD CONSTRAINT user_analytics_pkey PRIMARY KEY (id);


--
-- Name: idx_community_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_community_date ON public.community_analytics USING btree (community_id, date);


--
-- Name: idx_content; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content ON public.content_analytics USING btree (content_id, content_type);


--
-- Name: idx_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_date ON public.content_analytics USING btree (date);


--
-- Name: idx_event_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_type ON public.event_log USING btree (event_type);


--
-- Name: idx_score_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_score_timestamp ON public.trending_topics USING btree (trend_score, "timestamp");


--
-- Name: idx_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_timestamp ON public.event_log USING btree ("timestamp");


--
-- Name: idx_user_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_date ON public.user_analytics USING btree (user_id, date);


--
-- Name: idx_user_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_timestamp ON public.event_log USING btree (user_id, "timestamp");


--
-- PostgreSQL database dump complete
--

\unrestrict JL3Xz5w5ue16TDjbSdQPFakjlZGd6yeH9hRPqsg5lW2AvSJpY9xX7FcBxJxazBE

--
-- Database "auth_db" dump
--

--
-- PostgreSQL database dump
--

\restrict Xzf6o2bdX12RT4ITi9MJbGO8VvPelbuimTsg7DVbjb8rYtitvtuVLwqvpKixsvX

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: auth_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE auth_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE auth_db OWNER TO postgres;

\unrestrict Xzf6o2bdX12RT4ITi9MJbGO8VvPelbuimTsg7DVbjb8rYtitvtuVLwqvpKixsvX
\connect auth_db
\restrict Xzf6o2bdX12RT4ITi9MJbGO8VvPelbuimTsg7DVbjb8rYtitvtuVLwqvpKixsvX

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id character varying(255) NOT NULL,
    role character varying(255),
    CONSTRAINT user_roles_role_check CHECK (((role)::text = ANY ((ARRAY['SUPER_ADMIN'::character varying, 'TENANT_ADMIN'::character varying, 'ADMIN'::character varying, 'MANAGER'::character varying, 'STAFF'::character varying, 'VIEWER'::character varying])::text[])))
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    account_non_locked boolean NOT NULL,
    bio character varying(500),
    created_at timestamp(6) without time zone,
    email character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255),
    location character varying(255),
    oauth2id character varying(255),
    password character varying(255) NOT NULL,
    post_count integer NOT NULL,
    profile_picture_url character varying(255),
    provider character varying(255) NOT NULL,
    tenant_id character varying(255),
    updated_at timestamp(6) without time zone,
    website character varying(255),
    CONSTRAINT users_provider_check CHECK (((provider)::text = ANY ((ARRAY['LOCAL'::character varying, 'GOOGLE'::character varying, 'FACEBOOK'::character varying, 'APPLE'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role) FROM stdin;
37966aa3-d84b-4811-b3aa-d44225b1cd83	STAFF
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, account_non_locked, bio, created_at, email, enabled, first_name, last_name, location, oauth2id, password, post_count, profile_picture_url, provider, tenant_id, updated_at, website) FROM stdin;
37966aa3-d84b-4811-b3aa-d44225b1cd83	t	\N	2026-06-02 09:22:12.231219	JonnyTest@gmail.com	t	jonny	Test	\N	\N	$2a$10$J2t7USONIwkBWvqGAQb8jODRq/TXKwwppAmmsHnqg01Ns3CWrAojy	0	\N	LOCAL	default	2026-06-02 09:22:12.231278	\N
\.


--
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users uk_9wpdkvc82wrwp3jbn8shog88t; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_9wpdkvc82wrwp3jbn8shog88t UNIQUE (oauth2id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_roles fkhfh9dx7w3ubf1co1vdev94g3f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fkhfh9dx7w3ubf1co1vdev94g3f FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Xzf6o2bdX12RT4ITi9MJbGO8VvPelbuimTsg7DVbjb8rYtitvtuVLwqvpKixsvX

--
-- Database "feed_db" dump
--

--
-- PostgreSQL database dump
--

\restrict ze4AIhyrAsa4J1tcLrulGqFGcd20YQzgeRU9vilNX7nHBqNFQRdH2lLQCBRhxmj

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: feed_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE feed_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE feed_db OWNER TO postgres;

\unrestrict ze4AIhyrAsa4J1tcLrulGqFGcd20YQzgeRU9vilNX7nHBqNFQRdH2lLQCBRhxmj
\connect feed_db
\restrict ze4AIhyrAsa4J1tcLrulGqFGcd20YQzgeRU9vilNX7nHBqNFQRdH2lLQCBRhxmj

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: user_interactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_interactions (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    duration_seconds integer NOT NULL,
    interaction_type character varying(255) NOT NULL,
    post_id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    CONSTRAINT user_interactions_interaction_type_check CHECK (((interaction_type)::text = ANY ((ARRAY['VIEW'::character varying, 'CLICK'::character varying, 'UPVOTE'::character varying, 'DOWNVOTE'::character varying, 'COMMENT'::character varying, 'SHARE'::character varying, 'SAVE'::character varying, 'HIDE'::character varying, 'REPORT'::character varying])::text[])))
);


ALTER TABLE public.user_interactions OWNER TO postgres;

--
-- Name: user_interactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_interactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_interactions_id_seq OWNER TO postgres;

--
-- Name: user_interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_interactions_id_seq OWNED BY public.user_interactions.id;


--
-- Name: user_interactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interactions ALTER COLUMN id SET DEFAULT nextval('public.user_interactions_id_seq'::regclass);


--
-- Data for Name: user_interactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_interactions (id, created_at, duration_seconds, interaction_type, post_id, user_id) FROM stdin;
\.


--
-- Name: user_interactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_interactions_id_seq', 1, false);


--
-- Name: user_interactions user_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interactions
    ADD CONSTRAINT user_interactions_pkey PRIMARY KEY (id);


--
-- Name: idx_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_created ON public.user_interactions USING btree (created_at);


--
-- Name: idx_user_post; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_post ON public.user_interactions USING btree (user_id, post_id);


--
-- Name: idx_user_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_type ON public.user_interactions USING btree (user_id, interaction_type);


--
-- PostgreSQL database dump complete
--

\unrestrict ze4AIhyrAsa4J1tcLrulGqFGcd20YQzgeRU9vilNX7nHBqNFQRdH2lLQCBRhxmj

--
-- Database "moderation_db" dump
--

--
-- PostgreSQL database dump
--

\restrict jU7DSDqv73YQsScGPpwG6dfWf4AUIqwZGvTuLLaq69NZDg7cNlKDcfl6ggxMtyH

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: moderation_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE moderation_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE moderation_db OWNER TO postgres;

\unrestrict jU7DSDqv73YQsScGPpwG6dfWf4AUIqwZGvTuLLaq69NZDg7cNlKDcfl6ggxMtyH
\connect moderation_db
\restrict jU7DSDqv73YQsScGPpwG6dfWf4AUIqwZGvTuLLaq69NZDg7cNlKDcfl6ggxMtyH

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
-- PostgreSQL database dump complete
--

\unrestrict jU7DSDqv73YQsScGPpwG6dfWf4AUIqwZGvTuLLaq69NZDg7cNlKDcfl6ggxMtyH

--
-- Database "notification_db" dump
--

--
-- PostgreSQL database dump
--

\restrict 9YTd5NJvUXRpGDfQBZkAdQVLFJqS0QChzzgcYyJTN0yu7AZf4IEiQJLjhgEgcDc

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: notification_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE notification_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE notification_db OWNER TO postgres;

\unrestrict 9YTd5NJvUXRpGDfQBZkAdQVLFJqS0QChzzgcYyJTN0yu7AZf4IEiQJLjhgEgcDc
\connect notification_db
\restrict 9YTd5NJvUXRpGDfQBZkAdQVLFJqS0QChzzgcYyJTN0yu7AZf4IEiQJLjhgEgcDc

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: notification_aggregation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_aggregation (
    id bigint NOT NULL,
    actor_ids jsonb,
    aggregation_key character varying(255) NOT NULL,
    count integer NOT NULL,
    first_event_at timestamp(6) without time zone NOT NULL,
    last_event_at timestamp(6) without time zone NOT NULL,
    sent_at timestamp(6) without time zone,
    user_id character varying(255) NOT NULL
);


ALTER TABLE public.notification_aggregation OWNER TO postgres;

--
-- Name: notification_aggregation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_aggregation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_aggregation_id_seq OWNER TO postgres;

--
-- Name: notification_aggregation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_aggregation_id_seq OWNED BY public.notification_aggregation.id;


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_preferences (
    id bigint NOT NULL,
    comment_notifications boolean,
    digest_enabled boolean,
    digest_frequency character varying(255),
    email_enabled boolean,
    follower_notifications boolean,
    mention_notifications boolean,
    moderation_notifications boolean,
    push_enabled boolean,
    reply_notifications boolean,
    updated_at timestamp(6) without time zone,
    upvote_notifications boolean,
    user_id character varying(255) NOT NULL,
    websocket_enabled boolean,
    CONSTRAINT notification_preferences_digest_frequency_check CHECK (((digest_frequency)::text = ANY ((ARRAY['DAILY'::character varying, 'WEEKLY'::character varying, 'NEVER'::character varying])::text[])))
);


ALTER TABLE public.notification_preferences OWNER TO postgres;

--
-- Name: notification_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_preferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_preferences_id_seq OWNER TO postgres;

--
-- Name: notification_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_preferences_id_seq OWNED BY public.notification_preferences.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    action_url character varying(255),
    actor_avatar character varying(255),
    actor_id character varying(255),
    actor_username character varying(255),
    aggregation_key character varying(255),
    created_at timestamp(6) without time zone NOT NULL,
    is_read boolean NOT NULL,
    is_sent boolean NOT NULL,
    message text,
    metadata jsonb,
    priority integer NOT NULL,
    read_at timestamp(6) without time zone,
    sent_at timestamp(6) without time zone,
    target_id character varying(255),
    target_type character varying(255),
    title character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    CONSTRAINT notifications_target_type_check CHECK (((target_type)::text = ANY ((ARRAY['POST'::character varying, 'COMMENT'::character varying, 'USER'::character varying, 'COMMUNITY'::character varying])::text[]))),
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['COMMENT_ON_POST'::character varying, 'REPLY_TO_COMMENT'::character varying, 'UPVOTE'::character varying, 'MENTION'::character varying, 'POST_FLAGGED'::character varying, 'POST_APPROVED'::character varying, 'POST_REMOVED'::character varying, 'NEW_FOLLOWER'::character varying, 'AWARD_RECEIVED'::character varying, 'TRENDING_POST'::character varying, 'DIGEST'::character varying])::text[])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: notification_aggregation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_aggregation ALTER COLUMN id SET DEFAULT nextval('public.notification_aggregation_id_seq'::regclass);


--
-- Name: notification_preferences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences ALTER COLUMN id SET DEFAULT nextval('public.notification_preferences_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Data for Name: notification_aggregation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_aggregation (id, actor_ids, aggregation_key, count, first_event_at, last_event_at, sent_at, user_id) FROM stdin;
\.


--
-- Data for Name: notification_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_preferences (id, comment_notifications, digest_enabled, digest_frequency, email_enabled, follower_notifications, mention_notifications, moderation_notifications, push_enabled, reply_notifications, updated_at, upvote_notifications, user_id, websocket_enabled) FROM stdin;
1	t	t	DAILY	t	t	t	t	t	t	\N	t	37966aa3-d84b-4811-b3aa-d44225b1cd83	t
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, action_url, actor_avatar, actor_id, actor_username, aggregation_key, created_at, is_read, is_sent, message, metadata, priority, read_at, sent_at, target_id, target_type, title, type, user_id) FROM stdin;
\.


--
-- Name: notification_aggregation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_aggregation_id_seq', 1, false);


--
-- Name: notification_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_preferences_id_seq', 1, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: notification_aggregation notification_aggregation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_aggregation
    ADD CONSTRAINT notification_aggregation_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences uk_n2jopkbm16qv3xelbvoyjkd0g; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT uk_n2jopkbm16qv3xelbvoyjkd0g UNIQUE (user_id);


--
-- Name: idx_agg_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agg_key ON public.notification_aggregation USING btree (aggregation_key, user_id);


--
-- Name: idx_aggregation_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_aggregation_key ON public.notifications USING btree (aggregation_key);


--
-- Name: idx_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_created ON public.notifications USING btree (user_id, created_at);


--
-- Name: idx_user_pref; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_pref ON public.notification_preferences USING btree (user_id);


--
-- Name: idx_user_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_read ON public.notifications USING btree (user_id, is_read);


--
-- PostgreSQL database dump complete
--

\unrestrict 9YTd5NJvUXRpGDfQBZkAdQVLFJqS0QChzzgcYyJTN0yu7AZf4IEiQJLjhgEgcDc

--
-- Database "post_db" dump
--

--
-- PostgreSQL database dump
--

\restrict FYPwghYfkYhFzraymah1GebTdV7aKSyHMTucqpBQBA52FBMG9rANZF0poEhv2uZ

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: post_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE post_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE post_db OWNER TO postgres;

\unrestrict FYPwghYfkYhFzraymah1GebTdV7aKSyHMTucqpBQBA52FBMG9rANZF0poEhv2uZ
\connect post_db
\restrict FYPwghYfkYhFzraymah1GebTdV7aKSyHMTucqpBQBA52FBMG9rANZF0poEhv2uZ

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comment_mentions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment_mentions (
    comment_id character varying(255) NOT NULL,
    mentioned_user character varying(255)
);


ALTER TABLE public.comment_mentions OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id character varying(255) NOT NULL,
    content text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    depth integer NOT NULL,
    downvotes bigint NOT NULL,
    edited_at timestamp(6) without time zone,
    is_deleted boolean NOT NULL,
    is_edited boolean NOT NULL,
    is_removed boolean NOT NULL,
    is_spam boolean NOT NULL,
    parent_comment_id character varying(255),
    post_id character varying(255) NOT NULL,
    reply_count bigint NOT NULL,
    score bigint NOT NULL,
    spam_score double precision,
    updated_at timestamp(6) without time zone,
    upvotes bigint NOT NULL,
    user_id character varying(255) NOT NULL,
    username character varying(255) NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post (
    id character varying(255) NOT NULL,
    ai_summary character varying(255),
    comment_count bigint NOT NULL,
    community_id character varying(255) NOT NULL,
    community_name character varying(255) NOT NULL,
    content text,
    created_at timestamp(6) without time zone NOT NULL,
    down_votes bigint NOT NULL,
    edited_at timestamp(6) without time zone,
    is_archived boolean NOT NULL,
    is_locked boolean NOT NULL,
    is_nsfw boolean NOT NULL,
    is_removed boolean NOT NULL,
    is_repost boolean NOT NULL,
    is_spam boolean NOT NULL,
    is_spoiler boolean NOT NULL,
    media_type character varying(255),
    media_url character varying(255),
    original_post_id character varying(255),
    score bigint NOT NULL,
    sentiment_score double precision,
    share_count bigint NOT NULL,
    spam_score double precision,
    thumbnail_url character varying(255),
    title character varying(300) NOT NULL,
    type character varying(255) NOT NULL,
    up_votes bigint NOT NULL,
    updated_at timestamp(6) without time zone,
    user_id character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    view_count bigint NOT NULL,
    CONSTRAINT post_type_check CHECK (((type)::text = ANY ((ARRAY['TEXT'::character varying, 'IMAGE'::character varying, 'VIDEO'::character varying, 'LINK'::character varying, 'POLL'::character varying])::text[])))
);


ALTER TABLE public.post OWNER TO postgres;

--
-- Name: post_hashtags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_hashtags (
    post_id character varying(255) NOT NULL,
    hashtag character varying(255)
);


ALTER TABLE public.post_hashtags OWNER TO postgres;

--
-- Name: post_mentions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_mentions (
    post_id character varying(255) NOT NULL,
    mentioned_user character varying(255)
);


ALTER TABLE public.post_mentions OWNER TO postgres;

--
-- Name: saved_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saved_posts (
    id bigint NOT NULL,
    saved_at timestamp(6) without time zone,
    user_id character varying(255) NOT NULL,
    post_id character varying(255) NOT NULL
);


ALTER TABLE public.saved_posts OWNER TO postgres;

--
-- Name: saved_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.saved_posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.saved_posts_id_seq OWNER TO postgres;

--
-- Name: saved_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.saved_posts_id_seq OWNED BY public.saved_posts.id;


--
-- Name: vote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vote (
    id character varying(255) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    target_id character varying(255) NOT NULL,
    target_type character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    vote_type character varying(255) NOT NULL,
    CONSTRAINT vote_target_type_check CHECK (((target_type)::text = ANY ((ARRAY['POST'::character varying, 'COMMENT'::character varying])::text[]))),
    CONSTRAINT vote_vote_type_check CHECK (((vote_type)::text = ANY ((ARRAY['UPVOTE'::character varying, 'DOWNVOTE'::character varying])::text[])))
);


ALTER TABLE public.vote OWNER TO postgres;

--
-- Name: saved_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_posts ALTER COLUMN id SET DEFAULT nextval('public.saved_posts_id_seq'::regclass);


--
-- Data for Name: comment_mentions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment_mentions (comment_id, mentioned_user) FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content, created_at, depth, downvotes, edited_at, is_deleted, is_edited, is_removed, is_spam, parent_comment_id, post_id, reply_count, score, spam_score, updated_at, upvotes, user_id, username) FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post (id, ai_summary, comment_count, community_id, community_name, content, created_at, down_votes, edited_at, is_archived, is_locked, is_nsfw, is_removed, is_repost, is_spam, is_spoiler, media_type, media_url, original_post_id, score, sentiment_score, share_count, spam_score, thumbnail_url, title, type, up_votes, updated_at, user_id, username, view_count) FROM stdin;
\.


--
-- Data for Name: post_hashtags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_hashtags (post_id, hashtag) FROM stdin;
\.


--
-- Data for Name: post_mentions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_mentions (post_id, mentioned_user) FROM stdin;
\.


--
-- Data for Name: saved_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saved_posts (id, saved_at, user_id, post_id) FROM stdin;
\.


--
-- Data for Name: vote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vote (id, created_at, target_id, target_type, user_id, vote_type) FROM stdin;
\.


--
-- Name: saved_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.saved_posts_id_seq', 1, false);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: saved_posts saved_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_posts
    ADD CONSTRAINT saved_posts_pkey PRIMARY KEY (id);


--
-- Name: saved_posts ukrp4caf9aruyad4113wv29bowp; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_posts
    ADD CONSTRAINT ukrp4caf9aruyad4113wv29bowp UNIQUE (user_id, post_id);


--
-- Name: vote vote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote
    ADD CONSTRAINT vote_pkey PRIMARY KEY (id);


--
-- Name: idx_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_created_at ON public.comments USING btree (created_at);


--
-- Name: idx_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parent_id ON public.comments USING btree (parent_comment_id);


--
-- Name: idx_post_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_post_id ON public.comments USING btree (post_id);


--
-- Name: idx_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_id ON public.comments USING btree (user_id);


--
-- Name: post_mentions fk2yxfegrt7pphiq550ip0eo7dn; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_mentions
    ADD CONSTRAINT fk2yxfegrt7pphiq550ip0eo7dn FOREIGN KEY (post_id) REFERENCES public.post(id);


--
-- Name: saved_posts fk3vmtotd5n9uw86fcmipv3gxvj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_posts
    ADD CONSTRAINT fk3vmtotd5n9uw86fcmipv3gxvj FOREIGN KEY (post_id) REFERENCES public.post(id);


--
-- Name: comment_mentions fk8gk4oq6ekw42dprikm64qc2u2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_mentions
    ADD CONSTRAINT fk8gk4oq6ekw42dprikm64qc2u2 FOREIGN KEY (comment_id) REFERENCES public.comments(id);


--
-- Name: post_hashtags fkhkuj72xlmwdt447ax2qoq8o0r; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_hashtags
    ADD CONSTRAINT fkhkuj72xlmwdt447ax2qoq8o0r FOREIGN KEY (post_id) REFERENCES public.post(id);


--
-- PostgreSQL database dump complete
--

\unrestrict FYPwghYfkYhFzraymah1GebTdV7aKSyHMTucqpBQBA52FBMG9rANZF0poEhv2uZ

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict UfmBUabwKjYrSV07wDFVaLtLCnUiWG794EyThRNX6LBbFYtJE0FcolX05SRpwBk

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- PostgreSQL database dump complete
--

\unrestrict UfmBUabwKjYrSV07wDFVaLtLCnUiWG794EyThRNX6LBbFYtJE0FcolX05SRpwBk

--
-- Database "social_connection_db" dump
--

--
-- PostgreSQL database dump
--

\restrict GJZyoXjW0ZVjvzyNJviVurvIlsBIMcYam1v8cuTEFyciYJbiAFBVfGlhqUu6G9N

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: social_connection_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE social_connection_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE social_connection_db OWNER TO postgres;

\unrestrict GJZyoXjW0ZVjvzyNJviVurvIlsBIMcYam1v8cuTEFyciYJbiAFBVfGlhqUu6G9N
\connect social_connection_db
\restrict GJZyoXjW0ZVjvzyNJviVurvIlsBIMcYam1v8cuTEFyciYJbiAFBVfGlhqUu6G9N

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blocked_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocked_users (
    id character varying(255) NOT NULL,
    blocked_at timestamp(6) without time zone NOT NULL,
    blocked_id character varying(255) NOT NULL,
    blocker_id character varying(255) NOT NULL,
    reason character varying(255)
);


ALTER TABLE public.blocked_users OWNER TO postgres;

--
-- Name: communities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.communities (
    id character varying(255) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    description text,
    image_url text,
    is_archived boolean NOT NULL,
    member_count bigint NOT NULL,
    name character varying(100) NOT NULL,
    owner_id character varying(255) NOT NULL,
    share_count bigint NOT NULL,
    slug character varying(100) NOT NULL,
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.communities OWNER TO postgres;

--
-- Name: community_followers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_followers (
    id character varying(255) NOT NULL,
    community_id character varying(255) NOT NULL,
    followed_at timestamp(6) without time zone NOT NULL,
    notifications_enabled boolean,
    user_id character varying(255) NOT NULL
);


ALTER TABLE public.community_followers OWNER TO postgres;

--
-- Name: connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.connections (
    id character varying(255) NOT NULL,
    accepted_at timestamp(6) without time zone,
    created_at timestamp(6) without time zone NOT NULL,
    follower_id character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    CONSTRAINT connections_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'ACCEPTED'::character varying, 'REJECTED'::character varying, 'BLOCKED'::character varying])::text[]))),
    CONSTRAINT connections_type_check CHECK (((type)::text = ANY ((ARRAY['FOLLOW'::character varying, 'CONNECTION'::character varying])::text[])))
);


ALTER TABLE public.connections OWNER TO postgres;

--
-- Data for Name: blocked_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blocked_users (id, blocked_at, blocked_id, blocker_id, reason) FROM stdin;
\.


--
-- Data for Name: communities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communities (id, created_at, description, image_url, is_archived, member_count, name, owner_id, share_count, slug, updated_at) FROM stdin;
\.


--
-- Data for Name: community_followers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.community_followers (id, community_id, followed_at, notifications_enabled, user_id) FROM stdin;
\.


--
-- Data for Name: connections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.connections (id, accepted_at, created_at, follower_id, status, type, user_id) FROM stdin;
\.


--
-- Name: blocked_users blocked_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocked_users
    ADD CONSTRAINT blocked_users_pkey PRIMARY KEY (id);


--
-- Name: communities communities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_pkey PRIMARY KEY (id);


--
-- Name: community_followers community_followers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_followers
    ADD CONSTRAINT community_followers_pkey PRIMARY KEY (id);


--
-- Name: connections connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);


--
-- Name: community_followers uk50n8vcpo9idqcf04bt5cukn89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_followers
    ADD CONSTRAINT uk50n8vcpo9idqcf04bt5cukn89 UNIQUE (community_id, user_id);


--
-- Name: connections uk6o6jjmea58kynyuha3l4knnh5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT uk6o6jjmea58kynyuha3l4knnh5 UNIQUE (user_id, follower_id);


--
-- Name: communities uk_3vr2q12p5v4unsi7025edy28c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT uk_3vr2q12p5v4unsi7025edy28c UNIQUE (name);


--
-- Name: communities uk_bdfqv8sy8b7ntd1l08qg938h6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT uk_bdfqv8sy8b7ntd1l08qg938h6 UNIQUE (slug);


--
-- Name: blocked_users uko0xr6kt5tudpdlcdfycl528yy; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocked_users
    ADD CONSTRAINT uko0xr6kt5tudpdlcdfycl528yy UNIQUE (blocker_id, blocked_id);


--
-- Name: idx_community_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_community_user ON public.community_followers USING btree (community_id, user_id);


--
-- Name: idx_follower; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_follower ON public.connections USING btree (follower_id);


--
-- Name: idx_user_follower; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_follower ON public.connections USING btree (user_id, follower_id);


--
-- PostgreSQL database dump complete
--

\unrestrict GJZyoXjW0ZVjvzyNJviVurvIlsBIMcYam1v8cuTEFyciYJbiAFBVfGlhqUu6G9N

--
-- PostgreSQL database cluster dump complete
--

