var express = require('express');
var emailvalidator = require('email-validator');
var router = express.Router();
var db = require('../lib/db.js');
var async = require('async');
function Registration(req, res, next) {
    var teacherID = -1;
    var message = {'message': 'Calling /api/register'};
    console.log("POST /api/register req: " + JSON.stringify(req.body));
    var teacher = '';
    var students = [];
    if (!req.body.hasOwnProperty('teacher') || req.body.teacher === undefined)
        message.message += ' without a teacher specified!';
    else if (emailvalidator.validate(req.body.teacher) === false)
        message.message += ' with invalid teacher email address!';
    else
        teacher = req.body.teacher;
    if (req.body.students !== undefined && req.body.students.length > 0) {
        if (!Array.isArray(req.body.students)) {
            if (teacher === '')
                message.message += ' and';
            message.message += ' without a list of students specified!';
        } else {
            req.body.students.map(i => { if (emailvalidator.validate(i)) students.push(i) });
            if (students.length == 0) {
                if (teacher === '')
                    message.message += ' and';
                message.message += ' without any student with valid email address specified!';
            }
        }
    } else {
        if (teacher === '')
            message.message += ' and';
        message.message += ' without a valid list of students specified!';
    }
    var getStudent = function (student, callback) {
        var studentID = -1;
        var student_query = `select id from students where email = '${student}'`;
        db.query(student_query, function (error, result) {
            if (error)
                console.error(error.message);
            else if (result.length > 0) {
                studentID = result[0].id;
                console.log(`Existing student: ${studentID}`);
            } else
                console.log(`New student: ${student}`);
            console.log("calling back...");
            callback(error, studentID);
        });
    }
    if (teacher !== '' && students.length > 0) {
		async.series([
			function (callback) {
			    var teacher_query = `select id from teachers where email = '${teacher}'`;
			    db.query(teacher_query, function (error, result) {
			        if (error)
			            console.error(`Database error: ${error.message}`);
			        else if (result.length > 0) {
			            teacherID = result[0].id;
			            console.log(`Get teacher: ${teacherID}`);
			            //console.log('rows: '+rows+);
			        } else
			            console.log(`No teacher ${teacher}`);
			        callback(error, result);
			    });
			}, function (callback) {
			    console.log(`teacher ${teacherID}`);
			    if (teacherID === -1) {
			        console.log(`Add new teacher ${teacher}`);
			        var teacher_query = `INSERT INTO teachers (email) VALUES ('${teacher}')`;
			        var newTeacher = db.query(teacher_query, function (error, result) {
			            if (error)
			                console.error(error.message); // if error occured during connection 
			            else {
			                // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
			                if (result.affectedRows === 1) {
			                    teacherID = result.insertId;
			                    console.log(`Teacher ${teacher} inserted successfully. ID: ${teacherID}`);
			                } else
			                    console.error(`Failed inserting new teacher. ${result.message}`);
			            }
			            callback(error, result);
			        });
			    } else
			        callback(null, null);
			}, function (callback) {
			    console.log(`Processing ${students.length} students...`);
			    async.each(students, function (student, callback) {
			        var studentID = -1, relationshipID = -1;
			        console.log(`Processing student: ${student}`);
			        async.series([
                        function (callback) {
			                getStudent(student, function (err, result) {
			                    if (err)
			                        console.error("getStudent() failed! err: " + JSON.stringify(err));
			                    else
			                        studentID = result;
			                    callback(null, result);
			                });
			            }, function (callback) {
			                if (studentID === -1) { // New Student
			                    console.log(`Process new student ${student}`);
			                    var insert = `INSERT INTO students (email) VALUES ('${student}')`;
			                    db.query(insert, function (error, results) {
			                        if (error) {
			                            console.error(error.message); // if error occured during connection 
			                            //context.fail('Error executing database query to Insert the booking');
			                        } else {
			                            console.log('Student ' + student + ' inserted successfully ');
			                            //context.done(null, 'Student record inserted successfully ' + student);	    				
			                        }
			                        callback(error, results);
			                    });
			                } else { // Existing student
			                    console.log(`Process existing student ${studentID}`);
			                    callback(null, null);
			                }
			            }, function (callback) { // Process many-to-many relationships
			                async.series([
                                function (callback) { // Get Student ID
                                    getStudent(student, function (err, result) {
                                        if (err)
                                            console.error("getStudent() failed! err: " + JSON.stringify(err));
                                        else
                                            studentID = result;
                                        callback(null, result);
                                    });
                                }, function (callback) { // Get existing relationship, if any
                                    var relationship_query = `select id from teacher_student where teacherid = '${teacherID}' && studentid = '${studentID}'`;
                                    db.query(relationship_query, function (error, result) {
                                        if (error)
                                            console.error(error.message);
                                        else if (result.length > 0) {
                                            relationshipID = result[0].id;
                                            //console.log(`Get relationship: ${relationshipID}`);
                                        } else
                                            console.log("No relationship!");
                                        callback(error, result);
                                    });
                                }, function (callback) {
                                    if (relationshipID === -1) {
                                        console.log(`Add new relationship between teacher ${teacherID} and student ${studentID}`);
                                        var insert = `INSERT INTO teacher_student (teacherid, studentid) VALUES ('${teacherID}', '${studentID}')`;
                                        db.query(insert, function (error, results) {
                                            if (error) {
                                                console.error(error.message); // if error occured during connection 
                                                //context.fail('Error executing database query to Insert the booking');
                                            } else {
                                                console.log('New relationship inserted successfully ');
                                                //context.done(null, 'Student record inserted successfully ' + student);	    				
                                            }
                                            callback(error, results);
                                        });
                                    } else
                                        callback(null, null);
                                }
			                ], function (err, result) {
			                    // if any of the file processing produced an error, err would equal that error
			                    if (err)
			                        // One of the iterations produced an error.
			                        // All processing will now stop.
			                        console.error('A student failed to process. Error: ' + JSON.stringify(err));
			                    callback(err, result);
			                });
			            }
			        ], function (err, result) {
			            // if any of the file processing produced an error, err would equal that error
			            if (err)
			                // One of the iterations produced an error.
			                // All processing will now stop.
			                console.error('A student failed to process. Error: '+JSON.stringify(err));
			            callback(err, result);
			        });
			    }, function (err, result) {
			        // if any of the file processing produced an error, err would equal that error
			        if (err)
			            // One of the iterations produced an error.
			            // All processing will now stop.
			            console.error('A student failed to process');
			        else
			            console.log('All students have been processed successfully');
			        callback(err, result);
			    });
			}
		], function(err, results) {
            if (err) {
                console.error("/api/registration Error: " + JSON.stringify(err));
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
    } else { // if (teacher !=='' && students.length > 0) {
        res.status(400);
        res.json(message);
    }
};
module.exports = Registration;