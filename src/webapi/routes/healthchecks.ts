//var express = require('express');
import express from 'express'
import { Database } from "infrastructure"
import { IStudentRepository, ITeacherRepository, RepositoryTypes, ILogger, LoggerTypes, Student, Teacher } from 'core';
import { di } from "./api"
var healthchecks = express.Router();
var db = new Database(di.get<ILogger>(LoggerTypes.ILogger));
/* k8s readiness check */
healthchecks.get('/ready', async function (req, res, next) {
  try {
    let [students, teachers]: PromiseSettledResult<number>[] = await Promise.allSettled([db.getRepository(Student).createQueryBuilder("student").getCount(), db.getRepository(Teacher).createQueryBuilder("teacher").getCount()]);
    if (students.status === "fulfilled" && teachers.status === "fulfilled" && students.value >= 0 && teachers.value >= 0)
      res.send('OK');
    else
      res.status(500).send('Database readiness health check failed!');
  } catch (e) {
    res.status(500).send(`Database readiness health check failed! ${e}`);
  }
});
/* k8s liveness check */
healthchecks.get('/live', function (req, res, next) {
  res.send('OK')
});
export { healthchecks as default };