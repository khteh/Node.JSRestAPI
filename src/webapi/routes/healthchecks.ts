//var express = require('express');
import express from 'express'
import { Database } from "infrastructure"
import { IStudentRepository, ITeacherRepository, RepositoryTypes, ILogger, LoggerTypes, Student, Teacher } from 'core';
import { di } from "./api"
var healthchecks = express.Router();
var db = new Database(di.get<ILogger>(LoggerTypes.ILogger));
/* k8s readiness check */
healthchecks.get('/ready', function (req, res, next) {
  if (di.get<IStudentRepository>(RepositoryTypes.IStudentRepository) !== null && di.get<ITeacherRepository>(RepositoryTypes.ITeacherRepository) !== null)
    res.send('OK');
  else
    res.status(500).send('Readiness health check did not pass!');
});
/* k8s liveness check */
healthchecks.get('/live', function (req, res, next) {
  res.send('OK')
});
export { healthchecks as default };