# Node.JS API Server

Simple RESTful API using HTTP/2 SPDY server for Node.JS with Clean Architecture design and implemented using Typescript language.

## Use Cases

### School Teacher-Student Administration

Teachers need a system where they can perform administrative functions for their students. Teachers and students are identified by their email addresses. Unit tests using mocha framework with chai assertion library. Test coverage report is generated with Istanbul library and SonarQube. Dependency check is done with OWASP dependency check CLI.

### Google Gemini API

- Return text message from input prompt string by calling the API
- Return text message from input prompt string and an image file by calling the API

# Installation

## Database:

- Thanks to TypeORM, tables are automatically created when the application is run.
- Schema in `school.sql`

## Google Gemini API

- Obtain an API key from https://aistudio.google.com/apikey
- Add a `.env` file with the following content:
  ```
  GEMINI_API_KEY=<api key>
  ```

## Dependencies:

```
npm install
```

# Start the application:

- Generate self-signed cert for serving HTTP/2 over HTTPS.
- Edit `config/default.json` to configure the database connection parameters
- To run in development mode with nodemon:

  ```
  $ npm run dev
  ```

- To run in production mode:

  ```
  $ npm start
  ```

- Default port number is `4433` using HTTPS scheme
- To run the application listening on different port:
  ```
  $ export PORT=4433 && npm start
  ```

# Use Cases

## Fibonacci API

- `GET https://localhost:4433/api/fibonacci?n=20`
- Response:
  ```
  {
      "message":"Fibonacci(20): 6765"
  }
  ```

## Greetings API

- `GET https://localhost:4433/api/greetings`
- Response:

  ```
  {
      "message": "Hello! It's 6/17/2020, 01:42:56 PM now."
  }
  ```

- `GET https://localhost:4433/api/greetings?name=Mickey%20Mouse`
- Response:
  ```
  {
      "message": "Hello Mickey Mouse! It's 6/17/2020, 01:43:30 PM now."
  }
  ```

## Google Gemini

### In-App

Head over to https://localhost:4433/gemini and enjoy!

### POSTMAN

#### Prompt without an image: Use a POST request with the following JSON body template:

```
{
    "prompt": "Design a card game about dog breeds"
}
```

#### Prompt with an image: Use a POST request with `form-data` which includes the following key-value pairs:

- Key: `image` `File`, Value: Path of the image.
- Key: `prompt` `Text`, Value: The prompt string.

For example, I wanted to sell my Tango shoe and ask Gemini to generate a descript of the shoe for my to sell in the second-hand market.
Image: ![Shoe to sell](./GeminiPromptWithImage.png?raw=true "Shoe to sell")

## Register one or more students to a specified teacher.

- `POST /api/register` with the following JSON data:

  ```
  {
    "teachers": [
        {
          "email": "teacher1@gmail.com",
          "firstName": "One",
          "lastName": "Teacher"
        },
        {
          "email": "teacher2@gmail.com",
          "firstName": "Two",
          "lastName": "Teacher"
        }
      ],
    "students": [
        {
          "email": "student1@gmail.com",
          "firstName": "One",
          "lastName": "Student"
        },
        {
          "email": "student2@gmail.com",
          "firstName": "Two",
          "lastName": "Student"
        }
      ]
  }
  ```

- `POST /api/addstudents` with the following JSON data:

  ```
  {
    "teacher": {
      "email": "teacher1@gmail.com"
    },
    "students":
    [
      "student1@gmail.com",
      "student2@gmail.com"
    ]
  }
  ```

- `POST /api/commonstudents` with the following JSON data:
  ```
  {
      "teachers": [
          "teacher1@gmail.com",
          "teacher2@gmail.com"
      ]
  }
  ```

## Retrieve students who are registered to ALL of the given teachers:

- `GET /api/commonstudents?teacher=teacher1%40gmail.com&teacher=teacher2%40gmail.com`
- Sample successful response:
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

- `POST /api/suspend` with the following JSON data:
  ```
  {
  "student" : "studentmary@gmail.com"
  }
  ```

## Retrieve a list of students who can receive a given notification:

- `POST /api/retrievefornotifications`:
- Sample request body (1):
  ```
  {
    "teacher": "teacherken@gmail.com",
    "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
  }
  ```
- Sample successful response to (1):
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
- Sample request body (2):
  ```
  {
  "teacher": "teacherken@gmail.com",
  "notification": "Hey everybody"
  }
  ```
- Sample successful response to (2):

  ```
  {
    "recipients":
    [
      "studentbob@gmail.com"
    ]
  }

  ```

# Logs

Logs available at `/var/log/node.js/nodejsrestapi.log`

# Run tests:

- Edit `config/test.json` to configure the database connection parameters.
- WARNING! All tables in the database configured for test will be emptied for testing purpose.
- Generates test_reports/mocha/test-results.xml

```
$ npm test
```

## Run tests with coverage report:

- Use Istanbul library with mocha to generate test coverage report.
- Generates text and html reports

```
$ npm run cover
```

- Sample output:

  ```
  ------------------------------|----------|----------|----------|----------|-------------------|
  File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
  ------------------------------|----------|----------|----------|----------|-------------------|
  All files | 87.38 | 63.32 | 97.52 | 87.06 | |
  Node.JSRestAPI | 80 | 0 | 0 | 80 | |
  app.js | 80 | 0 | 0 | 80 | 24,30,31,34,35 |
  Node.JSRestAPI/BusinessLogic | 78.53 | 64.92 | 100 | 77.78 | |
  commonstudents.js | 76.14 | 67.39 | 100 | 74.07 |... 07,108,109,110 |
  greetings.js | 100 | 100 | 100 | 100 | |
  notifications.js | 77.22 | 70.21 | 100 | 76.62 |... 93,94,96,97,98 |
  registration.js | 81.25 | 63.64 | 100 | 80.8 |... 79,187,188,189 |
  suspend.js | 69.05 | 50 | 100 | 69.05 |... 61,62,63,64,66 |
  Node.JSRestAPI/lib | 78.57 | 50 | 100 | 78.57 | |
  db.js | 78.57 | 50 | 100 | 78.57 | 17,18,23 |
  Node.JSRestAPI/routes | 95.65 | 100 | 83.33 | 94.44 | |
  api.js | 100 | 100 | 100 | 100 | |
  index.js | 80 | 100 | 0 | 80 | 6 |
  Node.JSRestAPI/tests | 98.62 | 100 | 98.9 | 98.62 | |
  greetingsapi_tests.js | 90.91 | 100 | 87.5 | 90.91 | 15,16,17,18 |
  teachersapi_tests.js | 100 | 100 | 100 | 100 | |
  ------------------------------|----------|----------|----------|----------|-------------------|
  ```

## Run dependency check

- Download OWASP dependency check CLI: https://jeremylong.github.io/DependencyCheck/dependency-check-cli/index.html
- Run the CLI: `dependency-check.bat --project "Node.JSRestAPI" -f XML -f HTML --scan .`

## Run SonarQube scan

- Install SonarQube according to https://docs.sonarqube.org/latest/setup/get-started-2-minutes/
- Start SonarQube server
- Create a new project from the dashboard localhost:9000
- Change the `serverUrl` and `token` in `analyse.js`
- `node analyse.js`
- Go to the dashboard localhost:9000 to view the scan results.
