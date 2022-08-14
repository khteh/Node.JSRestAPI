//var express = require('express');
import express from 'express'
import { Database } from 'infrastructure'
import { Logger } from "infrastructure"
var healthchecks = express.Router();

/* k8s readiness check */
healthchecks.get('/ready', function (req, res, next) {
  var db_query = `select count(*) from students`;
  //Logger.debug(`teacher_query: ${teacher_query}`);
  Database.Query(db_query, function (error: Error, result: any) {
    if (error) {
      res.status(500).send('Readiness health check did not pass!');
    } else {
      res.send('OK')
    }
  });
});
/* k8s liveness check */
healthchecks.get('/live', function (req, res, next) {
  res.send('OK')
});
export { healthchecks as default };
