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

--
-- Name: admin; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE admin (
    email character varying(100) NOT NULL,
    password character varying(100)
);


ALTER TABLE admin OWNER TO erikchan;

--
-- Name: affiliation; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE affiliation (
    id integer NOT NULL,
    name character varying(100)
);


ALTER TABLE affiliation OWNER TO erikchan;

--
-- Name: callback; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE callback (
    id integer NOT NULL,
    "timestamp" timestamp without time zone,
    judgeid integer,
    leadcompetitornumber integer,
    roundid integer,
    competitionid integer
);


ALTER TABLE callback OWNER TO erikchan;

--
-- Name: competition; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE competition (
    id integer NOT NULL,
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
    currenteventid integer,
    description character varying(1000)
);


ALTER TABLE competition OWNER TO erikchan;

--
-- Name: competitor; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE competitor (
    id integer NOT NULL,
    firstname character varying(30),
    lastname character varying(30),
    email character varying(100),
    mailingaddress character varying(100),
    affiliationid integer,
    password character varying(100),
    hasregistered boolean
);


ALTER TABLE competitor OWNER TO erikchan;

--
-- Name: event; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE event (
    id integer NOT NULL,
    competitionid integer,
    styleid integer,
    levelid integer,
    dance character varying(30),
    ordernumber integer
);


ALTER TABLE event OWNER TO erikchan;

--
-- Name: judge; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE judge (
    id integer NOT NULL,
    email character varying(100),
    token character varying(100),
    firstname character varying(30),
    lastname character varying(30),
    phonenumber character varying(30),
    competitionid integer
);


ALTER TABLE judge OWNER TO erikchan;

--
-- Name: level; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE level (
    id integer NOT NULL,
    name character varying(30),
    ordernumber integer,
    competitionid integer
);


ALTER TABLE level OWNER TO erikchan;

--
-- Name: partnership; Type: TABLE; Schema: public; Owner: erikchan
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
    "timestamp" timestamp without time zone
);


ALTER TABLE partnership OWNER TO erikchan;

--
-- Name: paymentrecord; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE paymentrecord (
    id integer NOT NULL,
    competitionid integer,
    "timestamp" timestamp without time zone,
    competitorid integer,
    amount numeric(6,2),
    online boolean,
    paidwithaffiliation boolean
);


ALTER TABLE paymentrecord OWNER TO erikchan;

--
-- Name: round; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE round (
    id integer NOT NULL,
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


ALTER TABLE round OWNER TO erikchan;

--
-- Name: style; Type: TABLE; Schema: public; Owner: erikchan
--

CREATE TABLE style (
    id integer NOT NULL,
    name character varying(30),
    ordernumber integer,
    competitionid integer
);


ALTER TABLE style OWNER TO erikchan;

--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY admin (email, password) FROM stdin;
\.


--
-- Data for Name: affiliation; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY affiliation (id, name) FROM stdin;
\.


--
-- Data for Name: callback; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY callback (id, "timestamp", judgeid, leadcompetitornumber, roundid, competitionid) FROM stdin;
\.


--
-- Data for Name: competition; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY competition (id, name, leadidstartnum, locationname, earlyprice, regularprice, lateprice, startdate, enddate, regstartdate, earlyregdeadline, regularregdeadline, lateregdeadline, compadmin, currenteventid, description) FROM stdin;
\.


--
-- Data for Name: competitor; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY competitor (id, firstname, lastname, email, mailingaddress, affiliationid, password, hasregistered) FROM stdin;
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY event (id, competitionid, styleid, levelid, dance, ordernumber) FROM stdin;
\.


--
-- Data for Name: judge; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY judge (id, email, token, firstname, lastname, phonenumber, competitionid) FROM stdin;
\.


--
-- Data for Name: level; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY level (id, name, ordernumber, competitionid) FROM stdin;
\.


--
-- Data for Name: partnership; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY partnership (leadcompetitorid, followcompetitorid, eventid, leadconfirmed, followconfirmed, competitionid, number, calledback, "timestamp") FROM stdin;
\.


--
-- Data for Name: paymentrecord; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY paymentrecord (id, competitionid, "timestamp", competitorid, amount, online, paidwithaffiliation) FROM stdin;
\.


--
-- Data for Name: round; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY round (id, eventid, name, ordernumber, size, nextround, judgeid1, judgeid2, judgeid3, judgeid4, judgeid5, judgeid6) FROM stdin;
\.


--
-- Data for Name: style; Type: TABLE DATA; Schema: public; Owner: erikchan
--

COPY style (id, name, ordernumber, competitionid) FROM stdin;
\.


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (email);


--
-- Name: affiliation affiliation_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY affiliation
    ADD CONSTRAINT affiliation_pkey PRIMARY KEY (id);


--
-- Name: callback callback_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_pkey PRIMARY KEY (id);


--
-- Name: competition competition_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY competition
    ADD CONSTRAINT competition_pkey PRIMARY KEY (id);


--
-- Name: competitor competitor_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT competitor_pkey PRIMARY KEY (id);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: judge judge_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY judge
    ADD CONSTRAINT judge_pkey PRIMARY KEY (id);


--
-- Name: level level_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY level
    ADD CONSTRAINT level_pkey PRIMARY KEY (id);


--
-- Name: partnership partnership_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_pkey PRIMARY KEY (leadcompetitorid, followcompetitorid, eventid);


--
-- Name: paymentrecord paymentrecord_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_pkey PRIMARY KEY (id);


--
-- Name: round round_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_pkey PRIMARY KEY (id);


--
-- Name: style style_pkey; Type: CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY style
    ADD CONSTRAINT style_pkey PRIMARY KEY (id);


--
-- Name: callback callback_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: callback callback_judgeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_judgeid_fkey FOREIGN KEY (judgeid) REFERENCES judge(id);


--
-- Name: callback callback_roundid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_roundid_fkey FOREIGN KEY (roundid) REFERENCES round(id);


--
-- Name: competition competition_compadmin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY competition
    ADD CONSTRAINT competition_compadmin_fkey FOREIGN KEY (compadmin) REFERENCES admin(email);


--
-- Name: competitor competitor_affiliationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT competitor_affiliationid_fkey FOREIGN KEY (affiliationid) REFERENCES affiliation(id);


--
-- Name: event event_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: event event_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_levelid_fkey FOREIGN KEY (levelid) REFERENCES level(id);


--
-- Name: event event_styleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_styleid_fkey FOREIGN KEY (styleid) REFERENCES style(id);


--
-- Name: judge judge_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY judge
    ADD CONSTRAINT judge_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: level level_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY level
    ADD CONSTRAINT level_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: partnership partnership_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: partnership partnership_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_eventid_fkey FOREIGN KEY (eventid) REFERENCES event(id);


--
-- Name: partnership partnership_followcompetitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_followcompetitorid_fkey FOREIGN KEY (followcompetitorid) REFERENCES competitor(id);


--
-- Name: partnership partnership_leadcompetitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_leadcompetitorid_fkey FOREIGN KEY (leadcompetitorid) REFERENCES competitor(id);


--
-- Name: paymentrecord paymentrecord_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- Name: paymentrecord paymentrecord_competitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_competitorid_fkey FOREIGN KEY (competitorid) REFERENCES competitor(id);


--
-- Name: round round_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_eventid_fkey FOREIGN KEY (eventid) REFERENCES event(id);


--
-- Name: round round_judgeid1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid1_fkey FOREIGN KEY (judgeid1) REFERENCES judge(id);


--
-- Name: round round_judgeid2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid2_fkey FOREIGN KEY (judgeid2) REFERENCES judge(id);


--
-- Name: round round_judgeid3_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid3_fkey FOREIGN KEY (judgeid3) REFERENCES judge(id);


--
-- Name: round round_judgeid4_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid4_fkey FOREIGN KEY (judgeid4) REFERENCES judge(id);


--
-- Name: round round_judgeid5_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid5_fkey FOREIGN KEY (judgeid5) REFERENCES judge(id);


--
-- Name: round round_judgeid6_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_judgeid6_fkey FOREIGN KEY (judgeid6) REFERENCES judge(id);


--
-- Name: style style_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: erikchan
--

ALTER TABLE ONLY style
    ADD CONSTRAINT style_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id);


--
-- PostgreSQL database dump complete
--

