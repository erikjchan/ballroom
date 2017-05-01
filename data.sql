--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

-- Started on 2017-05-01 13:48:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

--
-- TOC entry 2239 (class 0 OID 16963)
-- Dependencies: 185
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO admin VALUES ('admin@email.edu', 'password');


--
-- TOC entry 2241 (class 0 OID 16968)
-- Dependencies: 187
-- Data for Name: affiliation; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2265 (class 0 OID 0)
-- Dependencies: 186
-- Name: affiliation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('affiliation_id_seq', 1, false);


--
-- TOC entry 2245 (class 0 OID 16980)
-- Dependencies: 191
-- Data for Name: competition; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO competition VALUES (1, 'Name', 1, 'locationname', 10.00, 20.00, 30.00, '2017-05-10 00:00:00-04', '2017-05-10 00:00:00-04', '2017-05-05 00:00:00-04', '2017-05-07 00:00:00-04', '2017-05-08 00:00:00-04', '2017-05-09 00:00:00-04', 'admin@email.edu', 0, 'description');


--
-- TOC entry 2253 (class 0 OID 17007)
-- Dependencies: 199
-- Data for Name: level; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2260 (class 0 OID 17028)
-- Dependencies: 206
-- Data for Name: style; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2249 (class 0 OID 16995)
-- Dependencies: 195
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2251 (class 0 OID 17001)
-- Dependencies: 197
-- Data for Name: judge; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2258 (class 0 OID 17022)
-- Dependencies: 204
-- Data for Name: round; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2243 (class 0 OID 16974)
-- Dependencies: 189
-- Data for Name: callback; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2266 (class 0 OID 0)
-- Dependencies: 188
-- Name: callback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('callback_id_seq', 1, false);


--
-- TOC entry 2267 (class 0 OID 0)
-- Dependencies: 190
-- Name: competition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('competition_id_seq', 1, true);


--
-- TOC entry 2247 (class 0 OID 16989)
-- Dependencies: 193
-- Data for Name: competitor; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2268 (class 0 OID 0)
-- Dependencies: 192
-- Name: competitor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('competitor_id_seq', 1, false);


--
-- TOC entry 2269 (class 0 OID 0)
-- Dependencies: 194
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('event_id_seq', 1, false);


--
-- TOC entry 2270 (class 0 OID 0)
-- Dependencies: 196
-- Name: judge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('judge_id_seq', 1, false);


--
-- TOC entry 2271 (class 0 OID 0)
-- Dependencies: 198
-- Name: level_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('level_id_seq', 1, false);


--
-- TOC entry 2254 (class 0 OID 17011)
-- Dependencies: 200
-- Data for Name: partnership; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2256 (class 0 OID 17016)
-- Dependencies: 202
-- Data for Name: paymentrecord; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2272 (class 0 OID 0)
-- Dependencies: 201
-- Name: paymentrecord_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('paymentrecord_id_seq', 1, false);


--
-- TOC entry 2273 (class 0 OID 0)
-- Dependencies: 203
-- Name: round_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('round_id_seq', 1, false);


--
-- TOC entry 2274 (class 0 OID 0)
-- Dependencies: 205
-- Name: style_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('style_id_seq', 1, false);


-- Completed on 2017-05-01 13:48:05

--
-- PostgreSQL database dump complete
--

