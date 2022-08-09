//var express = require('express');
import express from 'express'
import {Database} from 'infrastructure'
var router = express.Router();

/* k8s readiness check */
router.get('/ready', function(req, res, next) {
  var db_query = `select count(*) from students`;
  //console.log(`teacher_query: ${teacher_query}`);
  Database.Query(db_query, function (error:Error, result:any) {
      if (error) {
          res.status(500).send('Readiness health check did not pass!');
      } else {
 	  res.send('OK')
      }
  });
});
/* k8s liveness check */
router.get('/live', function(req, res, next) {
  res.send('OK')
});
export { router as default };
