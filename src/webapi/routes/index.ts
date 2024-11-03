//var express = require('express');
import express from 'express'
var indexRoute = express.Router();

/* GET home page. */
indexRoute.get('/', function (req, res, next) {
  res.render('home', { title: 'Node.JS Express Application' });
});
export { indexRoute as default };