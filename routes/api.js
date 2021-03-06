var express = require('express');
var router = express.Router();
var registration = require('../BusinessLogic/registration.js');
var notifications = require('../BusinessLogic/notifications.js');
var suspend = require('../BusinessLogic/suspend.js');
var commonstudents = require('../BusinessLogic/commonstudents.js');
var greetings = require('../BusinessLogic/greetings.js');
router.get('/greetings', function (req, res, next) { greetings(req, res, next); });
router.post('/register', function (req, res, next) { registration(req, res, next); });
router.post('/retrievefornotifications', function (req, res, next) { notifications(req, res, next); });
router.get('/commonstudents', function (req, res, next) { commonstudents(req, res, next); });
router.post('/suspend', function (req, res, next) { suspend(req, res, next); });
module.exports = router;