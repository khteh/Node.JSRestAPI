# Node.JS API Server
Teachers need a system where they can perform administrative functions for their students. Teachers and students are identified by their email addresses. Unit tests using mocha framework with chai assertion library.

# Installation
## Database:
```bash
CREATE DATABASE `school` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
```
```bash
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(320) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `Non-Clustered` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
```bash
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(320) NOT NULL,
  `teacherid` int(11) DEFAULT NULL,
  `isSuspended` tinyint(4) NOT NULL DEFAULT '0',
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `Non-Clustered` (`email`),
  KEY `teacherid_idx` (`teacherid`),
  CONSTRAINT `teacherid` FOREIGN KEY (`teacherid`) REFERENCES `teachers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
## Dependencies:
```bash
npm install
```

## Start the program:
```bash
set PORT=8888 & npm start
```

## Run tests:
```bash
npm test
```
