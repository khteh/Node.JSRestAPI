var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var async = require('async'); 
// GET /students list
router.get('/', function (req, res, next) {
	console.log('GET /students');
	res.json('');
});
// GET /students/:id
router.get('/:id', function (req, res, next) {
	console.log('GET /students/:id');
	res.json('');
});
// POST /students
router.post('/', function (req, res, next) {
    var teacherID = -1;
	console.log("POST /students req: "+JSON.stringify(req.body));
	if (req.body.students !== undefined && req.body.teacher !== undefined && req.body.students.length > 0) {
		async.series([
			function (callback) {
			    var teacher_query = `select id from teachers where email = '${req.body.teacher}'`;
			    db.query(teacher_query, function (error, result) {
			        if (error)
			            console.error(error.message);
			        else if (result.length > 0) {
			            teacherID = result[0].id;
			            console.log("Get teacher: " + teacherID);
			            //console.log('rows: '+rows+);
			        } else
			            console.log("No teacher "+req.body.teacher);
			        callback(null, result);
			    });
			}, function (callback) {
			    console.log("teacher "+teacherID);
			    if (teacherID === -1) {
			        var teacher_query = `INSERT INTO teachers (email) VALUES ('${req.body.teacher}')`;
			        console.log("insert statement: " + teacher_query);
			        var newTeacher = db.query(teacher_query, function (error, result) {
			            if (error)
			                console.error(error.message); // if error occured during connection 
			            else {
			                // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
			                if (result.affectedRows === 1) {
			                    console.log('Teacher ' + req.body.teacher + ' inserted successfully. iD: ');
			                    teacherID = result.insertId;
			                } else
			                    console.error("Failed inserting new teacher. " + result.message);
			            }
			            callback(null, result);
			        });
			    } else
			        callback(null, null);
			}, function (callback) {
			    console.log("Processing " + req.body.students.length + " students...");
			    async.each(req.body.students, function (student, callback) {
			        var studentID = -1;
			        console.log(student);
			        async.series([function (callback) {
			            var student_query = `select id from students where email = '${student}'`;
			            db.query(student_query, function (error, result) {
			                if (error)
			                    console.error(error.message);
			                else if (result.length > 0) {
			                    studentID = result[0].id;
			                    console.log("Get student: " + studentID);
			                    //console.log('rows: '+rows+);
			                } else
			                    console.log("No student " + student);
			                callback(null, result);
			            });
			        }, function (callback) {
                        if (studentID === -1) {
			                var insert = `INSERT INTO students (email, teacherid) VALUES ('${student}', ${teacherID})`;
			                console.log("insert statement: " + insert);
			                var newStudent = db.query(insert, function (error, rows, fields) {
			                    if (error) {
			                        console.error(error.message); // if error occured during connection 
			                        //context.fail('Error executing database query to Insert the booking');
			                    } else {
			                        console.log('Student ' + student + ' inserted successfully ');
			                        //context.done(null, 'Student record inserted successfully ' + student);	    				
			                    }
			                });
			            } //if
			           } //function
			        ], function (err) {
			            // if any of the file processing produced an error, err would equal that error
			            if (err) {
			                // One of the iterations produced an error.
			                // All processing will now stop.
			                console.error('A student failed to process');
			            } else {
			                console.log('All students have been processed successfully');
			            }
			        });
			    }, function (err) {
			        // if any of the file processing produced an error, err would equal that error
			        if( err ) {
			            // One of the iterations produced an error.
			            // All processing will now stop.
			            console.error('A student failed to process');
			        } else {
			            console.log('All students have been processed successfully');
			        }
			    });
			}
		], function(err, results) {
            if (err) {
			    console.error("Error: "+JSON.stringify(err));
                callback(true, null);
			} else if (typeof results === 'undefined' || results === null || !results.length) {
			    console.error("Failed with null/empty result!");
				callback(true, null);
            } else {
			    // Index of results:
				// 0: result from the first serial function
				// 1: results from the second serial function
				console.log("runs successfully! with "+results[1].length+" results!");
				console.log("results: "+JSON.stringify(results[1]));
				callback(true, results[1]);
            }
		});
	}
	res.json('');
});
// PUT /todos/:id
router.put('/:id', function (req, res, next) {
	console.log('PUT /students/:id');
	res.json('');
});
// DELETE /todos/:id
router.delete('/:id', function (req, res, next) {
	console.log('DELETE /students/:id');
	res.json('');
});
module.exports = router;