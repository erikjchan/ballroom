--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;


---
--- Clear up tables
---
DROP TABLE IF EXISTS affiliation CASCADE;
DROP TABLE IF EXISTS competition CASCADE;
DROP TABLE IF EXISTS callback CASCADE;
DROP TABLE IF EXISTS competitor CASCADE;
DROP TABLE IF EXISTS paymentrecord CASCADE;
DROP TABLE IF EXISTS official CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS event CASCADE;
DROP TABLE IF EXISTS level CASCADE;
DROP TABLE IF EXISTS partnership CASCADE;
DROP TABLE IF EXISTS round CASCADE;
DROP TABLE IF EXISTS style CASCADE;


--
-- Name: affiliation; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE affiliation (
    id SERIAL,
    name character varying(100) UNIQUE
);


ALTER TABLE affiliation OWNER TO ballroom;

--
-- Name: callback; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE callback (
    id SERIAL,
    "timestamp" timestamp without time zone default (now() at time zone 'utc'),
    judgeid integer,
    number integer,
    roundid integer,
    competitionid integer
);


ALTER TABLE callback OWNER TO ballroom;

--
-- Name: competition; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE competition (
    id SERIAL,
    name character varying(100),
    leadidstartnum integer,
    locationname character varying(100),
    earlyprice numeric(6,2),
    regularprice numeric(6,2),
    lateprice numeric(6,2),
    startdate timestamp without time zone,
    enddate timestamp without time zone,
    regstartdate timestamp without time zone,
    earlyregdeadline timestamp without time zone,
    regularregdeadline timestamp without time zone,
    lateregdeadline timestamp without time zone,
    compadmin character varying(100),
    currentroundid integer,
    description character varying(1000)
);


ALTER TABLE competition OWNER TO ballroom;

--
-- Name: competitor; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE competitor (
    id SERIAL,
    firstname character varying(30),
    lastname character varying(30),
    email character varying(100) NOT NULL UNIQUE,
    mailingaddress character varying(100),
    affiliationid integer,
    hasregistered boolean NOT NULL DEFAULT true
);


ALTER TABLE competitor OWNER TO ballroom;

--
-- Name: event; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE event (
    id SERIAL,
    competitionid integer,
    styleid integer,
    levelid integer,
    dance character varying(30),
    ordernumber integer
);


ALTER TABLE event OWNER TO ballroom;

--
-- Name: role; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE role (
    id integer,
    name character varying(30) UNIQUE NOT NULL
);

ALTER TABLE role OWNER TO ballroom;

--
-- Name: official; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE official (
    id SERIAL,
    token character varying(100),
    firstname character varying(30) NOT NULL,
    lastname character varying(30) NOT NULL,
    roleid integer NOT NULL,
    competitionid integer NOT NULL
);


ALTER TABLE official OWNER TO ballroom;

--
-- Name: level; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE level (
    id SERIAL,
    name character varying(30),
    ordernumber integer,
    competitionid integer,
	UNIQUE (name, competitionid)
);


ALTER TABLE level OWNER TO ballroom;

--
-- Name: partnership; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE partnership (
    leadcompetitorid integer NOT NULL,
    followcompetitorid integer NOT NULL,
    eventid integer NOT NULL,
    leadconfirmed boolean,
    followconfirmed boolean,
    competitionid integer,
    number integer,
    calledback boolean DEFAULT true,
    "timestamp" timestamp with time zone
);


ALTER TABLE partnership OWNER TO ballroom;

--
-- Name: paymentrecord; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE paymentrecord (
    id SERIAL,
    competitionid integer,
    "timestamp" timestamp without time zone,
    competitorid integer,
    amount numeric(6,2),
    online boolean,
    paidwithaffiliation boolean,
    UNIQUE (competitionid, competitorid)
);


ALTER TABLE paymentrecord OWNER TO ballroom;

--
-- Name: round; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE round (
    id SERIAL,
    eventid integer,
    name character varying(100),
    ordernumber integer,
    size integer,
    callbackscalculated boolean NOT NULL DEFAULT false
);


ALTER TABLE round OWNER TO ballroom;

--
-- Name: style; Type: TABLE; Schema: public; Owner: ballroom
--

CREATE TABLE style (
    id SERIAL,
    name character varying(30),
    ordernumber integer,
    competitionid integer,
	UNIQUE (name, competitionid)
);


ALTER TABLE style OWNER TO ballroom;


--
-- Name: affiliation affiliation_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY affiliation
    ADD CONSTRAINT affiliation_pkey PRIMARY KEY (id);


--
-- Name: callback callback_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_pkey PRIMARY KEY (id);


--
-- Name: competition competition_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY competition
    ADD CONSTRAINT competition_pkey PRIMARY KEY (id);


--
-- Name: competitor competitor_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT competitor_pkey PRIMARY KEY (id);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: official official_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY official
    ADD CONSTRAINT official_pkey PRIMARY KEY (id);


--
-- Name: level level_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY level
    ADD CONSTRAINT level_pkey PRIMARY KEY (id);


--
-- Name: partnership partnership_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_pkey PRIMARY KEY (leadcompetitorid, followcompetitorid, eventid);


--
-- Name: paymentrecord paymentrecord_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_pkey PRIMARY KEY (id);


--
-- Name: round round_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_pkey PRIMARY KEY (id);


--
-- Name: style style_pkey; Type: CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY style
    ADD CONSTRAINT style_pkey PRIMARY KEY (id);


--
-- Name: callback callback_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: callback callback_judgeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_judgeid_fkey FOREIGN KEY (judgeid) REFERENCES official(id) ON DELETE CASCADE;


--
-- Name: callback callback_roundid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_roundid_fkey FOREIGN KEY (roundid) REFERENCES round(id) ON DELETE CASCADE;


--
-- Name: competitor competitor_affiliationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT competitor_affiliationid_fkey FOREIGN KEY (affiliationid) REFERENCES affiliation(id) ON DELETE CASCADE;


--
-- Name: event event_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: event event_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_levelid_fkey FOREIGN KEY (levelid) REFERENCES level(id) ON DELETE CASCADE;


--
-- Name: event event_styleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_styleid_fkey FOREIGN KEY (styleid) REFERENCES style(id) ON DELETE CASCADE;


--
-- Name: official official_roleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY official
    ADD CONSTRAINT official_roleid_fkey FOREIGN KEY (roleid) REFERENCES role(id) ON DELETE CASCADE;


--
-- Name: official official_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY official
    ADD CONSTRAINT official_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: level level_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY level
    ADD CONSTRAINT level_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: partnership partnership_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: partnership partnership_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_eventid_fkey FOREIGN KEY (eventid) REFERENCES event(id) ON DELETE CASCADE;


--
-- Name: partnership partnership_followcompetitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_followcompetitorid_fkey FOREIGN KEY (followcompetitorid) REFERENCES competitor(id) ON DELETE CASCADE;


--
-- Name: partnership partnership_leadcompetitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_leadcompetitorid_fkey FOREIGN KEY (leadcompetitorid) REFERENCES competitor(id) ON DELETE CASCADE;


--
-- Name: paymentrecord paymentrecord_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: paymentrecord paymentrecord_competitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_competitorid_fkey FOREIGN KEY (competitorid) REFERENCES competitor(id) ON DELETE CASCADE;


--
-- Name: round round_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_eventid_fkey FOREIGN KEY (eventid) REFERENCES event(id) ON DELETE CASCADE;


--
-- Name: style style_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ballroom
--

ALTER TABLE ONLY style
    ADD CONSTRAINT style_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


SELECT pg_catalog.setval('callback_id_seq', 1, false);

SELECT pg_catalog.setval('round_id_seq', 1, false);

SELECT pg_catalog.setval('competition_id_seq', 1, false);

SELECT pg_catalog.setval('affiliation_id_seq', 1, false);

SELECT pg_catalog.setval('level_id_seq', 1, false);

SELECT pg_catalog.setval('competitor_id_seq', 1, false);

SELECT pg_catalog.setval('official_id_seq', 1, false);

SELECT pg_catalog.setval('style_id_seq', 1, false);

SELECT pg_catalog.setval('event_id_seq', 1, false);

SELECT pg_catalog.setval('paymentrecord_id_seq', 1, false);

INSERT INTO role VALUES (1, 'Adjudicator');
INSERT INTO role VALUES (2, 'Master of Ceremonies');
INSERT INTO role VALUES (3, 'Scrutineer');
INSERT INTO role VALUES (4, 'Music Director');