//var express = require('express');
import express from 'express'
var indexRoute = express.Router();

/* GET home page. */
indexRoute.get('/', function (req, res, next) {
  res.render('index', { title: 'Student administrative app' });
});
export { indexRoute as default };