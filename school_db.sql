CREATE USER 'guest'@'%' IDENTIFIED WITH mysql_native_password BY 'P*ssw0rd';
alter user 'guest'@'%' identified with mysql_native_password BY 'P*ssw0rd';
CREATE DATABASE school_test /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE school_test;
CREATE TABLE teachers (
  id int(11) NOT NULL AUTO_INCREMENT,
  email varchar(320) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  KEY NONCLUSTERED (email)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE students (
  id int(11) NOT NULL AUTO_INCREMENT,
  email varchar(320) NOT NULL,
  isSuspended tinyint(4) NOT NULL DEFAULT '0',
  UNIQUE KEY id_UNIQUE (id),
  KEY NONCLUSTERED (email)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE teacher_student (
  id int(11) NOT NULL AUTO_INCREMENT,
  teacherid int(11) NOT NULL,
  studentid int(11) NOT NULL,
  PRIMARY KEY (id),
  KEY teacherid_idx (teacherid),
  KEY studentid_idx (studentid),
  CONSTRAINT studentid FOREIGN KEY (studentid) REFERENCES students (id),
  CONSTRAINT teacherid FOREIGN KEY (teacherid) REFERENCES teachers (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
grant all on school_test.* to 'guest'@'%';
FLUSH PRIVILEGES;
