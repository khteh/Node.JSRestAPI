import express from 'express'
import {Fibonacci, Greetings} from 'core'
var router = express.Router();
var fibonacci = new Fibonacci(); 
var greetings = new Greetings();
//import registration from '../BusinessLogic/registration.js'
//import notifications from '../BusinessLogic/notifications.js'
//import suspend from '../BusinessLogic/suspend.js'
//import commonstudents from '../BusinessLogic/commonstudents.js'
//import greetings from '../BusinessLogic/greetings.js'
//import fibonacci from '../BusinessLogic/fibonacci.js'
router.get('/greetings', function (req, res, next) { greetings.greetings(req, res, next); });
router.get('/fibonacci', function (req, res, next) { fibonacci.fibonacci(req, res, next); });
//router.post('/register', function (req, res, next) { registration(req, res, next); });
//router.post('/retrievefornotifications', function (req, res, next) { notifications(req, res, next); });
//router.get('/commonstudents', function (req, res, next) { commonstudents(req, res, next); });
//router.post('/suspend', function (req, res, next) { suspend(req, res, next); });
export {router as default};