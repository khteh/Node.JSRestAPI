# Node.JS API Server
Teachers need a system where they can perform administrative functions for their students. Teachers and students are identified by their email addresses. Unit tests using mocha framework with chai assertion library. Test coverage report is generated with Istanbul library.

# Installation
## Database:
```
CREATE DATABASE `school` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
```
```
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(320) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `Non-Clustered` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
```
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(320) NOT NULL,
  `isSuspended` tinyint(4) NOT NULL DEFAULT '0',
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `Non-Clustered` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
```
CREATE TABLE `teacher_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacherid` int(11) NOT NULL,
  `studentid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teacherid_idx` (`teacherid`),
  KEY `studentid_idx` (`studentid`),
  CONSTRAINT `studentid` FOREIGN KEY (`studentid`) REFERENCES `students` (`id`),
  CONSTRAINT `teacherid` FOREIGN KEY (`teacherid`) REFERENCES `teachers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
## Dependencies:
```
npm install
```

# Start the application:
* Edit `config/default.json` to configure the database connection parameters
```
set PORT=8888 & npm start
```
# Use Cases
## Greetings API
* `GET localhost:8888/api/greetings`
* Response:
```
{
    "message": "Hello! It's 6/17/2020, 01:42:56 PM now."
}
```
* `GET localhost:8888/api/greetings?name=Mickey%20Mouse`
* Response:
```
{
    "message": "Hello Mickey Mouse! It's 6/17/2020, 01:43:30 PM now."
}
```
## Register one or more students to a specified teacher.
* `POST /api/register`
```
{
  "teacher": "teacherken@gmail.com"
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```
## Retrieve students who are registered to ALL of the given teachers:
* `GET /api/commonstudents?teacher=teacher1%40gmail.com&teacher=teacher2%40gmail.com`
* Sample successful response:
```
{
  "students" :
    [
      "commonstudent1@gmail.com", 
      "commonstudent2@gmail.com"
    ]
}
```
## Suspend a specified student:
* `POST /api/suspend`
```
{
  "student" : "studentmary@gmail.com"
}
```
## Retrieve a list of students who can receive a given notification:
* `POST /api/retrievefornotifications`
* Sample request body (1):
```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```
* Sample successful response to (1):
```
{
  "recipients":
    [
      "studentbob@gmail.com",
      "studentagnes@gmail.com", 
      "studentmiche@gmail.com"
    ]   
}
```
* Sample request body (2):
```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hey everybody"
}
```
* Sample successful response to (2):
```
{
  "recipients":
    [
      "studentbob@gmail.com"
    ]   
}
```
# Run tests:
* Edit `config/test.json` to configure the database connection parameters.
* WARNING! All tables in the database configured for test will be emptied for testing purpose.
* Generates test_reports/mocha/test-results.xml
```
npm test
```
## Run tests with coverage report:
* Use Istanbul library with mocha to generate test coverage report.
* Generates text and html reports
```
npm run cover
```
