import express from 'express'
import emailvalidator from 'email-validator'
var router = express.Router();
import db from '../lib/db.js'
import async from 'async'
function Notifications(req, res, next) {
    var teacherID = -1;
    var teacher = '';
    var message = { 'message': 'Calling /api/retrievefornotifications' };
    console.log("POST /api/retrievefornotifications req: " + JSON.stringify(req.body));
    if (!req.body.hasOwnProperty('teacher') || req.body.teacher === undefined)
        message.message += ' without a teacher specified!';
    else if (emailvalidator.validate(req.body.teacher) === false)
        message.message += ' with invalid teacher email address!';
    else
        teacher = req.body.teacher;
    if (req.body.notification !== undefined && teacher !== '' && req.body.notification.length > 0) {
        var notifications = req.body.notification.split(' @').splice(1);
        //console.log("notifications: " + JSON.stringify(notifications));
        var notification_emails = [];
        notifications.map(i => { if (emailvalidator.validate(i)) notification_emails.push(i) });
        //console.log("notification_emails: " + JSON.stringify(notification_emails));
        var students = notification_emails.join('\',\'');
        console.log(`students: ${students}`);
		async.series([
			function (callback) {
			    var teacher_query = `select id from teachers where email = '${teacher}'`;
			    db.query(teacher_query, function (error, result) {
			        if (error) {
			            console.error(`Database error: ${error.message}`);
			            callback(error, result);
			        } else if (result.length > 0) {
			            teacherID = result[0].id;
			            console.log(`Get teacher: ${teacherID}`);
			            callback(error, result);
			        } else {
			            console.log(`Invalid teacher ${teacher}`);
			            callback(null, { 'message': `Invalid teacher ${teacher}` });
			        }
			    });
			}, function (callback) {
			    if (teacherID !== -1) {
			        async.parallel([
                        function (callback) {
                            var student_query = `select email from students where isSuspended != 1 && email in ('${students}')`;
                            //console.log(`select statement: ${student_query}`);
                            db.query(student_query, function (error, result) {
                                if (error)
                                    console.error(error.message); // if error occured during connection 
                                else {
                                    // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
                                    if (result.length > 0)
                                        console.log(result.length + ' students: ' + JSON.stringify(result));
                                    else
                                        console.error(`No recipients for the notification from ${teacher} ID ${teacherID}`);
                                }
                                callback(error, result);
                            });
                        }, function (callback) {
                            var student_query = `select s.email from teacher_student ts join students s on ts.studentid = s.id where teacherid = ${teacherID} && s.isSuspended != 1;`;
                            //console.log(`select statement: ${student_query}`);
                            db.query(student_query, function (error, result) {
                                if (error)
                                    console.error(error.message); // if error occured during connection 
                                else {
                                    // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
                                    if (result.length > 0)
                                        console.log(result.length + ' students: ' + JSON.stringify(result));
                                    else
                                        console.error(`No recipients for the notification from ${teacher} ID ${teacherID}`);
                                }
                                callback(error, result);
                            });
                        }
			        ], function (err, results) {
			            // if any of the file processing produced an error, err would equal that error
			            if (err)
			                // One of the iterations produced an error.
			                // All processing will now stop.
			                console.error('/api/retrievefornotifications Error: ' + JSON.stringify(err));
			            callback(err, results);
			        });
			    } else
			        callback(null, null);
			}
		], function(err, results) {
		    if (err) {
		        console.error("Error: " + JSON.stringify(err));
		        res.status(err.status || 500);
		        res.json({ 'message': err.message });
		    } else if (typeof results === 'undefined' || results === null || !results.length) {
		        console.error("Failed with null/empty result!");
		        res.status(500);
		        res.json({'message': 'Internal server errors'});
		    } else if (typeof results[1] === 'undefined' || results[1] === null || !results[1].length) {
		        console.error("Failed with null/empty result!");
		        res.status(500);
		        res.json(results[0]);
		    } else {
		        // Index of results:
		        // 0: result from the first serial function
		        // 1: results from the second serial function
		        var recipients = {
		            recipients: []
		        };
		        results[1].map(function (i) {
		            i.map(j => {
		                if (recipients.recipients.indexOf(j.email) === -1)
		                    recipients.recipients.push(j.email);
		            })
		        })
		        console.log("runs successfully! with " + recipients.recipients.length + " results: " + JSON.stringify(recipients));
		        res.json(recipients);
		    }
		});
    } else {
        if (teacher === '') {
            res.status(400);
            res.json(message);
        }
    }
};
export { Notifications as default };