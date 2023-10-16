--
-- PostgreSQL database dump
--

-- Dumped from database version 12.6 (Ubuntu 12.6-0ubuntu0.20.10.1)
-- Dumped by pg_dump version 12.6 (Ubuntu 12.6-0ubuntu0.20.10.1)

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
-- Name: cabsharing; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE cabsharing WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_IN' LC_CTYPE = 'en_IN';


ALTER DATABASE cabsharing OWNER TO postgres;

\connect cabsharing

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
-- Name: cab_booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cab_booking (
    id bigint NOT NULL,
    date date NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    capacity integer DEFAULT 4 NOT NULL,
    from_loc integer,
    to_loc integer
);


ALTER TABLE public.cab_booking OWNER TO postgres;

--
-- Name: cab_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cab_booking_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cab_booking_id_seq OWNER TO postgres;

--
-- Name: cab_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cab_booking_id_seq OWNED BY public.cab_booking.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    place character varying NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.locations_id_seq OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request (
    status integer NOT NULL,
    booking_id integer NOT NULL,
    request_id integer NOT NULL
);


ALTER TABLE public.request OWNER TO postgres;

--
-- Name: traveller; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.traveller (
    user_email character varying NOT NULL,
    id integer NOT NULL,
    comments character varying
);


ALTER TABLE public.traveller OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_email character varying NOT NULL,
    phone_number numeric(10,0) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: cab_booking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cab_booking ALTER COLUMN id SET DEFAULT nextval('public.cab_booking_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Data for Name: cab_booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cab_booking (id, date, start_time, end_time, capacity, from_loc, to_loc) FROM stdin;
2	2022-07-29	2022-07-29 13:00:43	2022-07-29 13:00:43	4	1	1
3	2022-07-29	2022-07-29 13:00:43	2022-07-29 13:00:43	4	1	1
4	2022-07-29	2022-07-29 13:00:37	2022-07-29 13:00:37	4	1	1
5	2022-07-29	2022-07-29 13:00:37	2022-07-29 13:00:37	4	1	1
6	2022-07-29	2022-07-29 00:14:42	2022-07-29 00:14:42	3	1	0
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (place, id) FROM stdin;
RGIA	1
IITH	0
Secun. Railway Stn.	2
Lingampally	Stn. 3
Kacheguda Stn. 4
Hyd. Deccan Stn. 5
\.


--
-- Data for Name: request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request (status, booking_id, request_id) FROM stdin;
\.


--
-- Data for Name: traveller; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.traveller (user_email, id, comments) FROM stdin;
cs19btech11034@iith.ac.in	2	\N
cs19btech11034@iith.ac.in	3	\N
cs19btech11034@iith.ac.in	4	\N
cs19btech11034@iith.ac.in	5	\N
cs19btech11034@iith.ac.in	6	
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_email, phone_number) FROM stdin;
cs19btech11034@iith.ac.in	8529748475
\.


--
-- Name: cab_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cab_booking_id_seq', 6, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 1, false);


--
-- Name: cab_booking cab_booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cab_booking
    ADD CONSTRAINT cab_booking_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: request request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (booking_id, request_id);


--
-- Name: traveller traveller_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traveller
    ADD CONSTRAINT traveller_pkey PRIMARY KEY (user_email, id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_email);


--
-- Name: cab_booking cab_booking_from_loc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cab_booking
    ADD CONSTRAINT cab_booking_from_loc_fkey FOREIGN KEY (from_loc) REFERENCES public.locations(id);


--
-- Name: cab_booking cab_booking_to_loc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cab_booking
    ADD CONSTRAINT cab_booking_to_loc_fkey FOREIGN KEY (to_loc) REFERENCES public.locations(id);


--
-- Name: request request_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.cab_booking(id);


--
-- Name: request request_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.cab_booking(id);


--
-- Name: traveller traveller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traveller
    ADD CONSTRAINT traveller_id_fkey FOREIGN KEY (id) REFERENCES public.cab_booking(id);


--
-- Name: traveller traveller_user_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traveller
    ADD CONSTRAINT traveller_user_email_fkey FOREIGN KEY (user_email) REFERENCES public.users(user_email);


--
-- PostgreSQL database dump complete
--

