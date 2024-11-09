//var express = require('express');
import express from 'express'
var homeRoute = express.Router();

/* GET home page. */
homeRoute.get('/', function (req, res, next) {
    res.render('home', { title: 'Node.JS Express Application' });
});
export { homeRoute as default };
