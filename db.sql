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
    "timestamp" timestamp without time zone default (now() at time zone 'utc'),
    judgeid integer,
    number integer,
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
    hasregistered boolean NOT NULL DEFAULT true
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
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE role (
    id integer,
    name character varying(30) UNIQUE NOT NULL
);

ALTER TABLE role OWNER TO postgres;

--
-- Name: official; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE official (
    id SERIAL,
    token character varying(100),
    firstname character varying(30) NOT NULL,
    lastname character varying(30) NOT NULL,
    roleid integer NOT NULL,
    competitionid integer NOT NULL
);


ALTER TABLE official OWNER TO postgres;

--
-- Name: level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE level (
    id SERIAL,
    name character varying(30),
    ordernumber integer,
    competitionid integer,
	UNIQUE (name, competitionid)
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
    calledback boolean DEFAULT true,
    "timestamp" timestamp with time zone
);


ALTER TABLE partnership OWNER TO postgres;

--
-- Name: paymentrecord; Type: TABLE; Schema: public; Owner: postgres
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
    callbackscalculated boolean NOT NULL DEFAULT false
);


ALTER TABLE round OWNER TO postgres;

--
-- Name: style; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE style (
    id SERIAL,
    name character varying(30),
    ordernumber integer,
    competitionid integer,
	UNIQUE (name, competitionid)
);


ALTER TABLE style OWNER TO postgres;


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
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: official official_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY official
    ADD CONSTRAINT official_pkey PRIMARY KEY (id);


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
    ADD CONSTRAINT callback_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: callback callback_judgeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_judgeid_fkey FOREIGN KEY (judgeid) REFERENCES official(id) ON DELETE CASCADE;


--
-- Name: callback callback_roundid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY callback
    ADD CONSTRAINT callback_roundid_fkey FOREIGN KEY (roundid) REFERENCES round(id) ON DELETE CASCADE;


--
-- Name: competitor competitor_affiliationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT competitor_affiliationid_fkey FOREIGN KEY (affiliationid) REFERENCES affiliation(id) ON DELETE CASCADE;


--
-- Name: event event_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: event event_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_levelid_fkey FOREIGN KEY (levelid) REFERENCES level(id) ON DELETE CASCADE;


--
-- Name: event event_styleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_styleid_fkey FOREIGN KEY (styleid) REFERENCES style(id) ON DELETE CASCADE;


--
-- Name: official official_roleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY official
    ADD CONSTRAINT official_roleid_fkey FOREIGN KEY (roleid) REFERENCES role(id) ON DELETE CASCADE;


--
-- Name: official official_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY official
    ADD CONSTRAINT official_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: level level_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY level
    ADD CONSTRAINT level_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: partnership partnership_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: partnership partnership_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_eventid_fkey FOREIGN KEY (eventid) REFERENCES event(id) ON DELETE CASCADE;


--
-- Name: partnership partnership_followcompetitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_followcompetitorid_fkey FOREIGN KEY (followcompetitorid) REFERENCES competitor(id) ON DELETE CASCADE;


--
-- Name: partnership partnership_leadcompetitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY partnership
    ADD CONSTRAINT partnership_leadcompetitorid_fkey FOREIGN KEY (leadcompetitorid) REFERENCES competitor(id) ON DELETE CASCADE;


--
-- Name: paymentrecord paymentrecord_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- Name: paymentrecord paymentrecord_competitorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY paymentrecord
    ADD CONSTRAINT paymentrecord_competitorid_fkey FOREIGN KEY (competitorid) REFERENCES competitor(id) ON DELETE CASCADE;


--
-- Name: round round_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY round
    ADD CONSTRAINT round_eventid_fkey FOREIGN KEY (eventid) REFERENCES event(id) ON DELETE CASCADE;


--
-- Name: style style_competitionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY style
    ADD CONSTRAINT style_competitionid_fkey FOREIGN KEY (competitionid) REFERENCES competition(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


SELECT pg_catalog.setval('callback_id_seq', 1, false);

SELECT pg_catalog.setval('round_id_seq', 1, false);

INSERT INTO competition VALUES (1, 'Cornell DanceSport Classic', 1, 'Ithaca, New York', 10.00, 20.00, 30.00, '2017-05-09 00:00:00', '2017-05-10 00:00:00', '2017-05-05 00:00:00', '2017-05-07 00:00:00', '2017-05-08 00:00:00', '2017-05-09 00:00:00', 'admin@admin.com', 1, 'description');
INSERT INTO competition VALUES (2, 'None', 1, 'Ithaca, New York', 10.00, 20.00, 30.00, '2017-05-09 00:00:00', '2017-05-10 00:00:00', '2017-05-05 00:00:00', '2017-05-07 00:00:00', '2017-05-08 00:00:00', '2017-05-09 00:00:00', 'none@none.edu', 1, 'description');

SELECT pg_catalog.setval('competition_id_seq', 2, true);

INSERT INTO affiliation VALUES (1,'Cornell Dance Team');
INSERT INTO affiliation VALUES (2,'Harvard Dance Team');
INSERT INTO affiliation VALUES (3,'MIT Dance Team');
INSERT INTO affiliation VALUES (4,'Princeton Dance Team');

SELECT pg_catalog.setval('affiliation_id_seq', 4, true);

INSERT INTO level VALUES (1,'Bronze', 1, 1);
INSERT INTO level VALUES (2,'Silver', 2, 1);
INSERT INTO level VALUES (3,'Gold', 3, 1);

SELECT pg_catalog.setval('level_id_seq', 3, true);

INSERT INTO competitor VALUES (1,'Luke', 'Skywalker', 'luke@skywalker.com', 'Tatooine', 1, true);
INSERT INTO competitor VALUES (2,'Leia', 'Organa', 'leia@organa.com', 'Alderaan', 1, true);
INSERT INTO competitor VALUES (3,'Rey', 'who knows', 'rey@rey.com', 'Jakku', 1, false);
INSERT INTO competitor VALUES (4,'fname4', 'lname4', 'email4@email.com', 'mailingaddress4', 2, false);
INSERT INTO competitor VALUES (5,'fname5', 'lname5', 'email5@email.com', 'mailingaddress5', 2, false);
INSERT INTO competitor VALUES (6,'fname6', 'lname7', 'email6@email.com', 'mailingaddress6', 3, false);
INSERT INTO competitor VALUES (7,'fname7', 'lname7', 'email7@email.com', 'mailingaddress7', 4, false);
INSERT INTO competitor VALUES (8,'fname8', 'lname8', 'email8@email.com', 'mailingaddress8', 4, false);
INSERT INTO competitor VALUES (9,'fname9', 'lname9', 'email9@email.com', 'mailingaddress9', 4, false);
INSERT INTO competitor VALUES (10,'fname10', 'lname10', 'email10@email.com', 'mailingaddress10', 4, false);
INSERT INTO competitor VALUES (11,'fname11', 'lname11', 'email11@email.com', 'mailingaddress11', 4, false);
INSERT INTO competitor VALUES (12,'fname12', 'lname12', 'email12@email.com', 'mailingaddress12', 4, false);
INSERT INTO competitor VALUES (13,'fname13', 'lname13', 'email13@email.com', 'mailingaddress13', 4, false);
INSERT INTO competitor VALUES (14,'fname14', 'lname14', 'email14@email.com', 'mailingaddress14', 4, false);
INSERT INTO competitor VALUES (15,'fname15', 'lname15', 'email15@email.com', 'mailingaddress15', 4, false);
INSERT INTO competitor VALUES (16,'fname16', 'lname16', 'email16@email.com', 'mailingaddress16', 4, false);
INSERT INTO competitor VALUES (17,'fname17', 'lname17', 'email17@email.com', 'mailingaddress17', 4, false);
INSERT INTO competitor VALUES (18,'fname18', 'lname18', 'email18@email.com', 'mailingaddress18', 4, false);
INSERT INTO competitor VALUES (19,'fname19', 'lname19', 'email19@email.com', 'mailingaddress19', 4, false);
INSERT INTO competitor VALUES (20,'fname20', 'lname20', 'email20@email.com', 'mailingaddress20', 4, false);
INSERT INTO competitor VALUES (21,'fname21', 'lname21', 'email21@email.com', 'mailingaddress21', 4, false);
INSERT INTO competitor VALUES (22,'fname22', 'lname22', 'email22@email.com', 'mailingaddress22', 4, false);
INSERT INTO competitor VALUES (23,'fname23', 'lname23', 'email23@email.com', 'mailingaddress23', 4, false);
INSERT INTO competitor VALUES (24,'fname24', 'lname24', 'email24@email.com', 'mailingaddress24', 4, false);
INSERT INTO competitor VALUES (25,'fname25', 'lname25', 'email25@email.com', 'mailingaddress25', 4, false);
INSERT INTO competitor VALUES (26,'fname26', 'lname26', 'email26@email.com', 'mailingaddress26', 4, false);
INSERT INTO competitor VALUES (27,'fname27', 'lname27', 'email27@email.com', 'mailingaddress27', 4, false);
INSERT INTO competitor VALUES (28,'fname28', 'lname28', 'email28@email.com', 'mailingaddress28', 4, false);
INSERT INTO competitor VALUES (29,'fname29', 'lname29', 'email29@email.com', 'mailingaddress29', 4, false);
INSERT INTO competitor VALUES (30,'fname30', 'lname30', 'email30@email.com', 'mailingaddress30', 4, false);
INSERT INTO competitor VALUES (31,'fname31', 'lname31', 'email31@email.com', 'mailingaddress31', 4, false);
INSERT INTO competitor VALUES (32,'fname32', 'lname32', 'email32@email.com', 'mailingaddress32', 4, false);
INSERT INTO competitor VALUES (33,'fname33', 'lname33', 'email33@email.com', 'mailingaddress33', 4, false);
INSERT INTO competitor VALUES (34,'fname34', 'lname34', 'email34@email.com', 'mailingaddress34', 4, false);
INSERT INTO competitor VALUES (35,'fname35', 'lname35', 'email35@email.com', 'mailingaddress35', 4, false);
INSERT INTO competitor VALUES (36,'fname36', 'lname36', 'email36@email.com', 'mailingaddress36', 4, false);
INSERT INTO competitor VALUES (37,'fname37', 'lname37', 'email37@email.com', 'mailingaddress37', 4, false);
INSERT INTO competitor VALUES (38,'fname38', 'lname38', 'email38@email.com', 'mailingaddress38', 4, false);
INSERT INTO competitor VALUES (39,'fname39', 'lname39', 'email39@email.com', 'mailingaddress39', 4, false);
INSERT INTO competitor VALUES (40,'fname40', 'lname40', 'email40@email.com', 'mailingaddress40', 4, false);
INSERT INTO competitor VALUES (41,'fname41', 'lname41', 'email41@email.com', 'mailingaddress41', 4, false);
INSERT INTO competitor VALUES (42,'fname42', 'lname42', 'email42@email.com', 'mailingaddress42', 4, false);
INSERT INTO competitor VALUES (43,'fname43', 'lname43', 'email43@email.com', 'mailingaddress43', 4, false);
INSERT INTO competitor VALUES (44,'fname44', 'lname44', 'email44@email.com', 'mailingaddress44', 4, false);
INSERT INTO competitor VALUES (45,'fname45', 'lname45', 'email45@email.com', 'mailingaddress45', 4, false);
INSERT INTO competitor VALUES (46,'fname46', 'lname46', 'email46@email.com', 'mailingaddress46', 4, false);
INSERT INTO competitor VALUES (47,'fname47', 'lname47', 'email47@email.com', 'mailingaddress47', 4, false);
INSERT INTO competitor VALUES (48,'fname48', 'lname48', 'email48@email.com', 'mailingaddress48', 4, false);
INSERT INTO competitor VALUES (49,'fname49', 'lname49', 'email49@email.com', 'mailingaddress49', 4, false);
INSERT INTO competitor VALUES (50,'fname50', 'lname50', 'email50@email.com', 'mailingaddress50', 4, false);

SELECT pg_catalog.setval('competitor_id_seq', 50, true);

INSERT INTO role VALUES (1, 'Adjudicator');
INSERT INTO role VALUES (2, 'Master of Ceremonies');
INSERT INTO role VALUES (3, 'Scrutineer');
INSERT INTO role VALUES (4, 'Music Director');

INSERT INTO official VALUES (1, 'officialtoken', 'Len', 'Goodman', 1, 1);
INSERT INTO official VALUES (2, 'officialtoken', 'Bruno', 'Tonioli', 1, 1);
INSERT INTO official VALUES (3, 'officialtoken', 'Carrie Ann', 'Inaba', 1, 1);
INSERT INTO official VALUES (4, 'officialtoken', 'Julianne', 'Hough', 1, 1);
INSERT INTO official VALUES (5, 'officialtoken', 'Tom', 'Bergeron', 1, 1);
INSERT INTO official VALUES (6, 'officialtoken', 'Erin', 'Andrews', 1, 1);

SELECT pg_catalog.setval('official_id_seq', 6, true);

INSERT INTO style VALUES (1, 'Latin', 1, 1);
INSERT INTO style VALUES (2, 'Smooth', 2, 1);
INSERT INTO style VALUES (3, 'Rough', 3, 1);

SELECT pg_catalog.setval('style_id_seq', 3, true);

INSERT INTO event VALUES (1, 1, 1, 1, 'Waltz', 1);
INSERT INTO event VALUES (2, 1, 2, 1, 'Waltz', 2);
INSERT INTO event VALUES (3, 1, 1, 2, 'Tango', 3);
INSERT INTO event VALUES (4, 1, 2, 2, 'Tango', 4);
INSERT INTO event VALUES (5, 1, 1, 3, 'Cha Cha', 5);
INSERT INTO event VALUES (6, 1, 2, 3, 'Cha Cha', 6);
INSERT INTO event VALUES (7, 1, 1, 1, 'Tango', 7);
INSERT INTO event VALUES (8, 1, 2, 1, 'Tango', 8);
INSERT INTO event VALUES (9, 1, 1, 2, 'Cha Cha', 9);
INSERT INTO event VALUES (10, 1, 2, 2, 'Cha Cha', 10);
INSERT INTO event VALUES (11, 1, 1, 3, 'Waltz', 11);
INSERT INTO event VALUES (12, 1, 2, 3, 'Waltz', 12);
INSERT INTO event VALUES (13, 1, 1, 1, 'Cha Cha', 7);
INSERT INTO event VALUES (14, 1, 2, 1, 'Cha Cha', 8);
INSERT INTO event VALUES (15, 1, 1, 2, 'Waltz', 9);
INSERT INTO event VALUES (16, 1, 2, 2, 'Waltz', 10);
INSERT INTO event VALUES (17, 1, 1, 3, 'Tango', 11);
INSERT INTO event VALUES (18, 1, 2, 3, 'Tango', 12);

SELECT pg_catalog.setval('event_id_seq', 18, true);

INSERT INTO partnership VALUES (1, 2, 1, true, true, 1, 1, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (3, 4, 1, true, true, 1, 3, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (5, 6, 1, true, true, 1, 5, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (7, 8, 1, true, true, 1, 7, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (9, 10, 1, true, true, 1, 9, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (11, 12, 1, true, true, 1, 11, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (13, 14, 1, true, true, 1, 13, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (15, 16, 1, true, true, 1, 15, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (17, 18, 1, true, true, 1, 17, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (19, 20, 1, true, true, 1, 19, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (21, 22, 1, true, true, 1, 21, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (23, 24, 1, true, true, 1, 23, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (25, 26, 1, true, true, 1, 25, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (27, 28, 1, true, true, 1, 27, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (29, 30, 1, true, true, 1, 29, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (31, 32, 1, true, true, 1, 31, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (33, 34, 1, true, true, 1, 33, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (35, 36, 1, true, true, 1, 35, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (37, 38, 1, true, true, 1, 37, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (39, 40, 1, true, true, 1, 39, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (41, 42, 1, true, true, 1, 41, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (43, 44, 1, true, true, 1, 43, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (45, 46, 1, true, true, 1, 45, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (47, 48, 1, true, true, 1, 47, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (49, 50, 1, true, true, 1, 49, true, '2017-05-10 00:00:00');

INSERT INTO partnership VALUES (2, 3, 2, true, true, 1, 2, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (4, 5, 2, true, true, 1, 4, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (6, 7, 2, true, true, 1, 6, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (8, 9, 2, true, true, 1, 8, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (10, 11, 2, true, true, 1, 10, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (12, 13, 2, true, true, 1, 12, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (14, 15, 2, true, true, 1, 14, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (16, 17, 2, true, true, 1, 16, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (18, 19, 2, true, true, 1, 18, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (20, 21, 2, true, true, 1, 20, true, '2017-05-10 00:00:00');

INSERT INTO partnership VALUES (2, 3, 3, true, true, 1, 2, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (4, 5, 3, true, true, 1, 4, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (6, 7, 3, true, true, 1, 6, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (8, 9, 3, true, true, 1, 8, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (10, 11, 3, true, true, 1, 10, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (12, 13, 3, true, true, 1, 12, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (14, 15, 3, true, true, 1, 14, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (16, 17, 3, true, true, 1, 16, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (18, 19, 3, true, true, 1, 18, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (20, 21, 3, true, true, 1, 20, true, '2017-05-10 00:00:00');

INSERT INTO partnership VALUES (2, 3, 4, true, true, 1, 2, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (4, 5, 4, true, true, 1, 4, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (6, 7, 4, true, true, 1, 6, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (8, 9, 4, true, true, 1, 8, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (10, 11, 4, true, true, 1, 10, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (12, 13, 4, true, true, 1, 12, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (14, 15, 4, true, true, 1, 14, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (16, 17, 4, true, true, 1, 16, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (18, 19, 4, true, true, 1, 18, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (20, 21, 4, true, true, 1, 20, true, '2017-05-10 00:00:00');

INSERT INTO partnership VALUES (2, 3, 5, true, true, 1, 2, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (4, 5, 5, true, true, 1, 4, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (6, 7, 5, true, true, 1, 6, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (8, 9, 5, true, true, 1, 8, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (10, 11, 5, true, true, 1, 10, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (12, 13, 5, true, true, 1, 12, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (14, 15, 5, true, true, 1, 14, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (16, 17, 5, true, true, 1, 16, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (18, 19, 5, true, true, 1, 18, true, '2017-05-10 00:00:00');
INSERT INTO partnership VALUES (20, 21, 5, true, true, 1, 20, true, '2017-05-10 00:00:00');

SELECT pg_catalog.setval('paymentrecord_id_seq', 1, true);

INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 1, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 2, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 3, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 4, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 5, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 6, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 7, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 8, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 9, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 10, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 11, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 12, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 13, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 14, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 15, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 16, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 17, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 18, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 19, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 20, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 21, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 22, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 23, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 24, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 25, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 26, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 27, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 28, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 29, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 30, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 31, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 32, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 33, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 34, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 35, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 36, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 37, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 38, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 39, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 40, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 41, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 42, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 43, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 44, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 45, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 46, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 47, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 48, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 49, 21.87, true, true);
INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, online, paidwithaffiliation) VALUES (1, '2017-05-10 00:00:00', 50, 21.87, true, true);
