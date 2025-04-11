--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: authentication; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authentication (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token character varying(32) NOT NULL,
    "validUntil" date,
    "statusId" integer DEFAULT 0 NOT NULL
);


--
-- Name: group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."group" (
    id integer NOT NULL,
    name character varying(64),
    description character varying(256)
);


--
-- Name: group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.group_id_seq OWNED BY public."group".id;


--
-- Name: lookup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lookup (
    id integer NOT NULL,
    text character varying(64),
    obs character varying(128)
);


--
-- Name: lookup_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lookup_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lookup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lookup_id_seq OWNED BY public.lookup.id;


--
-- Name: post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post (
    id integer NOT NULL,
    "authorId" integer NOT NULL,
    "groupId" integer,
    "timestamp" timestamp without time zone DEFAULT now(),
    text character varying(256)
);


--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: tempo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tempo (
    id integer NOT NULL,
    name character varying(128),
    "startTimestamp" timestamp with time zone,
    "endTimestamp" timestamp with time zone,
    "fullDay" boolean,
    place character varying(128),
    description character varying(256)
);


--
-- Name: tempo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tempo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tempo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tempo_id_seq OWNED BY public.tempo.id;


--
-- Name: tempo_tempo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tempo_tempo (
    "childId" integer NOT NULL,
    "parentId" integer NOT NULL
);


--
-- Name: tokenAuth_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."tokenAuth_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tokenAuth_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."tokenAuth_id_seq" OWNED BY public.authentication.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    login character varying(16) NOT NULL,
    username character varying(16) NOT NULL,
    password character varying(16) NOT NULL,
    name character varying(64),
    birthday date,
    email character varying(32)
);


--
-- Name: user_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_group (
    "userId" integer NOT NULL,
    "groupId" integer NOT NULL,
    "statusId" integer
);


--
-- Name: user_tempo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_tempo (
    "userId" integer NOT NULL,
    "tempoId" integer NOT NULL,
    "statusId" integer
);


--
-- Name: user_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_user (
    "userId1" integer NOT NULL,
    "userId2" integer NOT NULL,
    "statusId" integer
);


--
-- Name: user_user_symmetrical; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_user_symmetrical AS
 SELECT user_user."userId1",
    user_user."userId2",
    user_user."statusId"
   FROM public.user_user
UNION ALL
 SELECT user_user."userId2" AS "userId1",
    user_user."userId1" AS "userId2",
        CASE
            WHEN (user_user."statusId" = 10) THEN 11
            WHEN (user_user."statusId" = 11) THEN 10
            ELSE user_user."statusId"
        END AS "statusId"
   FROM public.user_user;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public."user".id;


--
-- Name: authentication id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication ALTER COLUMN id SET DEFAULT nextval('public."tokenAuth_id_seq"'::regclass);


--
-- Name: group id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."group" ALTER COLUMN id SET DEFAULT nextval('public.group_id_seq'::regclass);


--
-- Name: lookup id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lookup ALTER COLUMN id SET DEFAULT nextval('public.lookup_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Name: tempo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tempo ALTER COLUMN id SET DEFAULT nextval('public.tempo_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: user_user UserUser_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_user
    ADD CONSTRAINT "UserUser_pkey" PRIMARY KEY ("userId1", "userId2");


--
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (id);


--
-- Name: lookup lookup_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lookup
    ADD CONSTRAINT lookup_pkey PRIMARY KEY (id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: tempo tempo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tempo
    ADD CONSTRAINT tempo_pkey PRIMARY KEY (id);


--
-- Name: tempo_tempo tempo_tempo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tempo_tempo
    ADD CONSTRAINT tempo_tempo_pkey PRIMARY KEY ("childId", "parentId");


--
-- Name: authentication tokenAuth_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication
    ADD CONSTRAINT "tokenAuth_pkey" PRIMARY KEY (id);


--
-- Name: user_group user_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_pkey PRIMARY KEY ("userId", "groupId");


--
-- Name: user_tempo user_tempo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tempo
    ADD CONSTRAINT user_tempo_pkey PRIMARY KEY ("userId", "tempoId");


--
-- Name: user_user user_user_order_check; Type: CHECK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE public.user_user
    ADD CONSTRAINT user_user_order_check CHECK (("userId1" < "userId2")) NOT VALID;


--
-- Name: user users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: fki_user_tempo_lookupStatus_FK; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "fki_user_tempo_lookupStatus_FK" ON public.user_tempo USING btree ("statusId");


--
-- Name: post post_user_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "post_user_FK" FOREIGN KEY ("authorId") REFERENCES public."user"(id) NOT VALID;


--
-- Name: tempo_tempo tempo_tempo_tempoChild; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tempo_tempo
    ADD CONSTRAINT "tempo_tempo_tempoChild" FOREIGN KEY ("childId") REFERENCES public.tempo(id);


--
-- Name: tempo_tempo tempo_tempo_tempoParent; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tempo_tempo
    ADD CONSTRAINT "tempo_tempo_tempoParent" FOREIGN KEY ("parentId") REFERENCES public.tempo(id);


--
-- Name: authentication tokenAuth_user_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication
    ADD CONSTRAINT "tokenAuth_user_FK" FOREIGN KEY ("userId") REFERENCES public."user"(id) NOT VALID;


--
-- Name: user_user userUser_user1_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_user
    ADD CONSTRAINT "userUser_user1_FK" FOREIGN KEY ("userId1") REFERENCES public."user"(id) NOT VALID;


--
-- Name: user_user userUser_user2_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_user
    ADD CONSTRAINT "userUser_user2_FK" FOREIGN KEY ("userId2") REFERENCES public."user"(id) NOT VALID;


--
-- Name: user_group user_group_group_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT "user_group_group_FK" FOREIGN KEY ("groupId") REFERENCES public."group"(id) NOT VALID;


--
-- Name: user_group user_group_lookupStatus_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT "user_group_lookupStatus_FK" FOREIGN KEY ("statusId") REFERENCES public.lookup(id) NOT VALID;


--
-- Name: user_group user_group_user_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT "user_group_user_FK" FOREIGN KEY ("userId") REFERENCES public."user"(id) NOT VALID;


--
-- Name: user_tempo user_tempo_lookupStatus_FK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tempo
    ADD CONSTRAINT "user_tempo_lookupStatus_FK" FOREIGN KEY ("statusId") REFERENCES public.lookup(id) NOT VALID;


--
-- Name: user_tempo user_tempo_tempo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tempo
    ADD CONSTRAINT user_tempo_tempo FOREIGN KEY ("tempoId") REFERENCES public.tempo(id) NOT VALID;


--
-- Name: user_tempo user_tempo_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tempo
    ADD CONSTRAINT user_tempo_user FOREIGN KEY ("userId") REFERENCES public."user"(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

