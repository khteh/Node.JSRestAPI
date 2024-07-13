CREATE DATABASE school
    WITH
    OWNER = guest
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE IF NOT EXISTS public.student
(
    id integer NOT NULL DEFAULT nextval('student_id_seq'::regclass),
    created timestamp without time zone NOT NULL,
    modified timestamp without time zone NOT NULL,
    "firstName" character varying(256) COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying(256) COLLATE pg_catalog."default" NOT NULL,
    email character varying(256) COLLATE pg_catalog."default" NOT NULL,
    "isSuspended" boolean NOT NULL,
    CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY (id),
    CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.student
    OWNER to guest;

CREATE TABLE IF NOT EXISTS public.teacher
(
    id integer NOT NULL DEFAULT nextval('teacher_id_seq'::regclass),
    created timestamp without time zone NOT NULL,
    modified timestamp without time zone NOT NULL,
    "firstName" character varying(256) COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying(256) COLLATE pg_catalog."default" NOT NULL,
    email character varying(256) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_2f807294148612a9751dacf1026" PRIMARY KEY (id),
    CONSTRAINT "UQ_00634394dce7677d531749ed8e8" UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.teacher
    OWNER to guest;

CREATE TABLE IF NOT EXISTS public.student_teachers_teacher
(
    "studentId" integer NOT NULL,
    "teacherId" integer NOT NULL,
    CONSTRAINT "PK_ec87c1e05d0d8cefa233575cfe1" PRIMARY KEY ("studentId", "teacherId"),
    CONSTRAINT "FK_b0ef0f5f4afbbdcd6984f414650" FOREIGN KEY ("studentId")
        REFERENCES public.student (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK_bbce22585af3071bbe4f355a12b" FOREIGN KEY ("teacherId")
        REFERENCES public.teacher (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.student_teachers_teacher
    OWNER to guest;
-- Index: IDX_b0ef0f5f4afbbdcd6984f41465

-- DROP INDEX IF EXISTS public."IDX_b0ef0f5f4afbbdcd6984f41465";

CREATE INDEX IF NOT EXISTS "IDX_b0ef0f5f4afbbdcd6984f41465"
    ON public.student_teachers_teacher USING btree
    ("studentId" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: IDX_bbce22585af3071bbe4f355a12

-- DROP INDEX IF EXISTS public."IDX_bbce22585af3071bbe4f355a12";

CREATE INDEX IF NOT EXISTS "IDX_bbce22585af3071bbe4f355a12"
    ON public.student_teachers_teacher USING btree
    ("teacherId" ASC NULLS LAST)
    TABLESPACE pg_default;