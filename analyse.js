const scanner = require("sonarqube-scanner");
scanner(
  {
    serverUrl: "http://localhost:9000",
	token: "8ebefd6b851b8ae7d248a6db2be2393bad1f8d7c",
    options: {
		"sonar.projectKey": "Node.JSRestAPI",
		"sonar.projectVersion": "1.0.0",
		"sonar.sourceEncoding": "UTF-8",
		"sonar.log.level": "TRACE",
		"sonar.verbose": "true",
		"sonar.scm.disabled": "true",
		"sonar.sources": "BusinessLogic, routes, bin, app.js",
		"sonar.tests": "tests",
		"sonar.dependencyCheck.jsonReportPath": "dependency-check-report.json",
		"sonar.dependencyCheck.htmlReportPath": "dependency-check-report.html",
		"sonar.javascript.jstest.reportsPath": "test_reports",
		"sonar.javascript.lcov.reportPaths": "coverage/lcov.info",
		"sonar.testExecutionReportPaths": "test_reports/sonarqube/test_results.xml",
		"sonar.dependencyCheck.severity.blocker": "9.0",
		"sonar.dependencyCheck.severity.critical": "7.0",
		"sonar.dependencyCheck.severity.major": "4.0",
		"sonar.dependencyCheck.severity.minor": "0.0",
		"sonar.dependencyCheck.summarize": "true"
    }
  },
  () => process.exit()
);