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
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS callback CASCADE;
DROP TABLE IF EXISTS competitor CASCADE;
DROP TABLE IF EXISTS paymentrecord CASCADE;
DROP TABLE IF EXISTS judge CASCADE;
DROP TABLE IF EXISTS event CASCADE;
DROP TABLE IF EXISTS level CASCADE;
DROP TABLE IF EXISTS partnership CASCADE;
DROP TABLE IF EXISTS round CASCADE;
DROP TABLE IF EXISTS style CASCADE;


--
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE admin (
    email character varying(100) NOT NULL UNIQUE,
    password character varying(100) NOT NULL
);


ALTER TABLE admin OWNER TO postgres;

--
-- Name: affiliation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE affiliation (
    id SERIAL,
    name character varying(100) UNIQUE
);


ALTER TABLE affiliation OWNER TO postgres;

--
-- Name: callback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE callback (
    id SERIAL,
    "timestamp" timestamp with time zone,
    judgeid integer,
    leadcompetitornumber integer,
    roundid integer,
    competitionid integer
);


ALTER TABLE callback OWNER TO postgres;

--
-- Name: competition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE competition (
    id SERIAL,
    name character varying(100),
    leadidstartnum integer,
    locationname character varying(100),
    earlyprice numeric(6,2),
    regularprice numeric(6,2),
    lateprice numeric(6,2),
    startdate timestamp with time zone,
    enddate timestamp with time zone,
    regstartdate timestamp with time zone,
    earlyregdeadline timestamp with time zone,
    regularregdeadline timestamp with time zone,
    lateregdeadline timestamp with time zone,
    compadmin character varying(100),
    currenteventid integer,
    description character varying(1000)
);


ALTER TABLE competition OWNER TO postgres;

--
-- Name: competitor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE competitor (
    id SERIAL,
    firstname character varying(30),
    lastname character varying(30),
    email character varying(100) NOT NULL UNIQUE,
    mailingaddress character varying(100),
    affiliationid integer,
    password character varying(100),
    hasregistered boolean NOT NULL
);


ALTER TABLE competitor OWNER TO postgres;

--
-- Name: event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE event (
    id SERIAL,
    competitionid integer,
    styleid integer,
    levelid integer,
    dance character varying(30),
    ordernumber integer
);


ALTER TABLE event OWNER TO postgres;

--
-- Name: judge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE judge (
    id SERIAL,
    email character varying(100),
    token character varying(100),
    firstname character varying(30),
    lastname character varying(30),
    phonenumber character varying(30),
    competitionid integer
);


ALTER TABLE judge OWNER TO postgres;

--
-- Name: level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE level (
    id SERIAL,
    name character varying(30),
    ordernumber integer,
    competitionid integer
);


ALTER TABLE level OWNER TO postgres;

--
-- Name: partnership; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE partnership (
    leadcompetitorid integer NOT NULL,
    followcompetitorid integer NOT NULL,
    eventid integer NOT NULL,
    leadconfirmed boolean,
    followconfirmed boolean,
    competitionid integer,
    number integer,
    calledback boolean,
    "timestamp" timestamp with time zone
);


ALTER TABLE partnership OWNER TO postgres;

--
-- Name: paymentrecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE paymentrecord (
    id SERIAL,
    competitionid integer,
    "timestamp" timestamp with time zone,
    competitorid integer,
    amount numeric(6,2),
    online boolean,
    paidwithaffiliation boolean,
    UNIQUE (competitionid, competitorid)
);


ALTER TABLE paymentrecord OWNER TO postgres;

--
-- Name: round; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE round (
    id SERIAL,
    eventid integer,
    name character varying(100),
    ordernumber integer,
    size integer,
    nextround integer,
    judgeid1 integer,
    judgeid2 integer,
    judgeid3 integer,
    judgeid4 integer,
    judgeid5 integer,
    judgeid6 integer
);


ALTER TABLE round OWNER TO postgres;

--
-- Name: style; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE style (
    id SERIAL,
    name character varying(30),
    ordernumber integer,
    competitionid integer
);


ALTER TABLE style OWNER TO postgres;


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (email);


--
-- Name: affiliation affiliation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY affiliation
    ADD CONSTRAINT affiliation_pkey PRIMARY KEY (id);


--
-- Name: callback callback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_pkey PRIMARY KEY (id);


--
-- Name: competition competition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY competition
    ADD CONSTRAINT competition_pkey PRIMARY KEY (id);


--
-- Name: competitor competitor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT competitor_pkey PRIMARY KEY (id);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: judge judge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY judge
    ADD CONSTRAINT judge_pkey PRIMARY KEY (id);


--
-- Name: level level_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY level
    ADD CONSTRAINT level_pkey PRIMARY KEY (id);


--
-- Name: partnership partnership_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_pkey PRIMARY KEY (leadcompetitorid, followcompetitorid, eventid);


--
-- Name: paymentrecord paymentrecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_pkey PRIMARY KEY (id);


--
-- Name: round round_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_pkey PRIMARY KEY (id);


--
-- Name: style style_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY style
    ADD CONSTRAINT style_pkey PRIMARY KEY (id);


--
-- Name: callback callback_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: callback callback_judgeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_judgeid_fkey FOREIGN KEY (judgeid) REFERENCES judge(id);


--
-- Name: callback callback_roundid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_roundid_fkey FOREIGN KEY (roundid) REFERENCES round(id);


--
-- Name: competition competition_compadmin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY competition
    ADD CONSTRAINT competition_compadmin_fkey FOREIGN KEY (compadmin) REFERENCES admin(email);


--
-- Name: competitor competitor_affiliationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT competitor_affiliationid_fkey FOREIGN KEY (affiliationid) REFERENCES affiliation(id);


--
-- Name: event event_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: event event_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_levelid_fkey FOREIGN KEY (levelid) REFERENCES level(id);


--
-- Name: event event_styleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_styleid_fkey FOREIGN KEY (styleid) REFERENCES style(id);


--
-- Name: judge judge_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY judge
    ADD CONSTRAINT judge_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: level level_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY level
    ADD CONSTRAINT level_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: partnership partnership_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: partnership partnership_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_eventid_fkey FOREIGN KEY (eventid) REFERENCES event(id);


--
-- Name: partnership partnership_followcompetitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_followcompetitorid_fkey FOREIGN KEY (followcompetitorid) REFERENCES competitor(id);


--
-- Name: partnership partnership_leadcompetitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_leadcompetitorid_fkey FOREIGN KEY (leadcompetitorid) REFERENCES competitor(id);


--
-- Name: paymentrecord paymentrecord_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: paymentrecord paymentrecord_competitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_competitorid_fkey FOREIGN KEY (competitorid) REFERENCES competitor(id);


--
-- Name: round round_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_eventid_fkey FOREIGN KEY (eventid) REFERENCES event(id);


--
-- Name: round round_judgeid1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid1_fkey FOREIGN KEY (judgeid1) REFERENCES judge(id);


--
-- Name: round round_judgeid2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid2_fkey FOREIGN KEY (judgeid2) REFERENCES judge(id);


--
-- Name: round round_judgeid3_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid3_fkey FOREIGN KEY (judgeid3) REFERENCES judge(id);


--
-- Name: round round_judgeid4_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid4_fkey FOREIGN KEY (judgeid4) REFERENCES judge(id);


--
-- Name: round round_judgeid5_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid5_fkey FOREIGN KEY (judgeid5) REFERENCES judge(id);


--
-- Name: round round_judgeid6_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid6_fkey FOREIGN KEY (judgeid6) REFERENCES judge(id);


--
-- Name: style style_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY style
    ADD CONSTRAINT style_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- PostgreSQL database dump complete
--

