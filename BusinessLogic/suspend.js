var express = require('express');
var emailvalidator = require('email-validator');
var router = express.Router();
var db = require('../lib/db.js');
var async = require('async');
function Suspend(req, res, next) {
    var studentID = -1;
    console.log("POST /api/suspend req: " + JSON.stringify(req.body));
	if (req.body.student !== undefined && typeof(req.body.student) === 'string' && emailvalidator.validate(req.body.student)) {
		async.series([
			function (callback) {
			    var teacher_query = `select id from students where email = '${req.body.student}'`;
			    db.query(teacher_query, function (error, result) {
			        if (error)
			            console.error(`Database error: ${error.message}`);
			        else if (result.length > 0) {
			            studentID = result[0].id;
			            //console.log(`Get student: ${studentID}`);
			            //console.log('rows: '+rows+);
			        } else
			            console.log(`Student ${req.body.student} not found!`);
			        callback(error, result);
			    });
			}, function (callback) {
			    console.log("studentID "+studentID);
			    if (studentID !== -1) {
			        var student_query = `UPDATE students SET isSuspended = 1 WHERE id='${studentID}'`;
			        //console.log("UPDATE statement: " + student_query);
			        var newTeacher = db.query(student_query, function (error, result) {
			            if (error)
			                console.error(error.message); // if error occured during connection 
			            else {
			                // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
			                if (result.affectedRows === 1)
			                    console.log('Student ' + req.body.student + ' suspended successfully. ID: '+studentID);
			                else
			                    console.error(`Failed to suspend student ${req.body.student} ID: ${studentID}`);
			            }
			            callback(error, result);
			        });
			    } else
			        callback(null, null);
			}
		], function(err, results) {
            if (err) {
                console.error("Error: " + JSON.stringify(err));
                res.status(err.status || 500);
                res.json({ 'message': err.message });
            } else {
			    // Index of results:
				// 0: result from the first serial function
                // 1: results from the second serial function
                //console.log("register result: " + JSON.stringify(results));
                res.status(204).end();
            }
		});
	} else {
	    res.status(400);
	    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('student') || req.body.student === undefined)
	        res.json({ 'message': 'Calling /api/suspend without specifying student!' });
	    else if (typeof(req.body.student) !== 'string')
	        res.json({ 'message': 'Calling /api/suspend with more than one student!' });
	    else if (!emailvalidator.validate(req.body.student))
	        res.json({ 'message': 'Calling /api/suspend with invalid student email!' });
	    else
	        res.json({ 'message': `Calling /api/suspend with unregistered student ${req.body.student}!` });
	}
};
module.exports = Suspend;