--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

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
-- Name: student; Type: TABLE; Schema: public; Owner: guest
--

CREATE TABLE public.student (
    id integer NOT NULL,
    created timestamp without time zone NOT NULL,
    modified timestamp without time zone NOT NULL,
    "firstName" character varying(256) NOT NULL,
    "lastName" character varying(256) NOT NULL,
    email character varying(256) NOT NULL,
    "isSuspended" boolean NOT NULL
);


ALTER TABLE public.student OWNER TO guest;

--
-- Name: student_id_seq; Type: SEQUENCE; Schema: public; Owner: guest
--

CREATE SEQUENCE public.student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_id_seq OWNER TO guest;

--
-- Name: student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: guest
--

ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;


--
-- Name: student_teachers_teacher; Type: TABLE; Schema: public; Owner: guest
--

CREATE TABLE public.student_teachers_teacher (
    "studentId" integer NOT NULL,
    "teacherId" integer NOT NULL
);


ALTER TABLE public.student_teachers_teacher OWNER TO guest;

--
-- Name: teacher; Type: TABLE; Schema: public; Owner: guest
--

CREATE TABLE public.teacher (
    id integer NOT NULL,
    created timestamp without time zone NOT NULL,
    modified timestamp without time zone NOT NULL,
    "firstName" character varying(256) NOT NULL,
    "lastName" character varying(256) NOT NULL,
    email character varying(256) NOT NULL
);


ALTER TABLE public.teacher OWNER TO guest;

--
-- Name: teacher_id_seq; Type: SEQUENCE; Schema: public; Owner: guest
--

CREATE SEQUENCE public.teacher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teacher_id_seq OWNER TO guest;

--
-- Name: teacher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: guest
--

ALTER SEQUENCE public.teacher_id_seq OWNED BY public.teacher.id;


--
-- Name: student id; Type: DEFAULT; Schema: public; Owner: guest
--

ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);


--
-- Name: teacher id; Type: DEFAULT; Schema: public; Owner: guest
--

ALTER TABLE ONLY public.teacher ALTER COLUMN id SET DEFAULT nextval('public.teacher_id_seq'::regclass);


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: guest
--

COPY public.student (id, created, modified, "firstName", "lastName", email, "isSuspended") FROM stdin;
\.


--
-- Data for Name: student_teachers_teacher; Type: TABLE DATA; Schema: public; Owner: guest
--

COPY public.student_teachers_teacher ("studentId", "teacherId") FROM stdin;
\.


--
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: guest
--

COPY public.teacher (id, created, modified, "firstName", "lastName", email) FROM stdin;
\.


--
-- Name: student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: guest
--

SELECT pg_catalog.setval('public.student_id_seq', 1, false);


--
-- Name: teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: guest
--

SELECT pg_catalog.setval('public.teacher_id_seq', 1, false);


--
-- Name: teacher PK_2f807294148612a9751dacf1026; Type: CONSTRAINT; Schema: public; Owner: guest
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT "PK_2f807294148612a9751dacf1026" PRIMARY KEY (id);


--
-- Name: student PK_3d8016e1cb58429474a3c041904; Type: CONSTRAINT; Schema: public; Owner: guest
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY (id);


--
-- Name: student_teachers_teacher PK_ec87c1e05d0d8cefa233575cfe1; Type: CONSTRAINT; Schema: public; Owner: guest
--

ALTER TABLE ONLY public.student_teachers_teacher
    ADD CONSTRAINT "PK_ec87c1e05d0d8cefa233575cfe1" PRIMARY KEY ("studentId", "teacherId");


--
-- Name: teacher UQ_00634394dce7677d531749ed8e8; Type: CONSTRAINT; Schema: public; Owner: guest
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT "UQ_00634394dce7677d531749ed8e8" UNIQUE (email);


--
-- Name: student UQ_a56c051c91dbe1068ad683f536e; Type: CONSTRAINT; Schema: public; Owner: guest
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE (email);


--
-- Name: IDX_b0ef0f5f4afbbdcd6984f41465; Type: INDEX; Schema: public; Owner: guest
--

CREATE INDEX "IDX_b0ef0f5f4afbbdcd6984f41465" ON public.student_teachers_teacher USING btree ("studentId");


--
-- Name: IDX_bbce22585af3071bbe4f355a12; Type: INDEX; Schema: public; Owner: guest
--

CREATE INDEX "IDX_bbce22585af3071bbe4f355a12" ON public.student_teachers_teacher USING btree ("teacherId");


--
-- Name: student_teachers_teacher FK_b0ef0f5f4afbbdcd6984f414650; Type: FK CONSTRAINT; Schema: public; Owner: guest
--

ALTER TABLE ONLY public.student_teachers_teacher
    ADD CONSTRAINT "FK_b0ef0f5f4afbbdcd6984f414650" FOREIGN KEY ("studentId") REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_teachers_teacher FK_bbce22585af3071bbe4f355a12b; Type: FK CONSTRAINT; Schema: public; Owner: guest
--

ALTER TABLE ONLY public.student_teachers_teacher
    ADD CONSTRAINT "FK_bbce22585af3071bbe4f355a12b" FOREIGN KEY ("teacherId") REFERENCES public.teacher(id);


--
-- PostgreSQL database dump complete
--

