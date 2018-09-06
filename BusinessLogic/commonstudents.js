var express = require('express');
var emailvalidator = require('email-validator');
var router = express.Router();
var db = require('../lib/db.js');
var async = require('async');
var url = require('url');
function CommonStudents(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log('GET /api/commonstudents query: ' + JSON.stringify(query));
    var teacher_emails = [];
    if (query.teacher !== undefined && query.teacher.length > 0) {
        if (Array.isArray(query.teacher))
            query.teacher.map(i => { if (emailvalidator.validate(i)) teacher_emails.push(i) });
        else if (emailvalidator.validate(query.teacher))
            teacher_emails.push(query.teacher);
    }
    var teacherids = '', studentids = '';
    if (teacher_emails.length > 0) {
        async.series([
			function (callback) {
			    var teachers = teacher_emails.join('\',\'');
			    var teacher_query = `select id from teachers where email in ('${teachers}')`;
			    //console.log(`teacher_query: ${teacher_query}`);
			    db.query(teacher_query, function (error, result) {
			        if (error)
			            console.error(error.message);
			        else if (result.length > 0) {
			            var ids = result.map(i => i.id);
			            teacherids = ids.join('\',\'');
			            //console.log(`Teachers: ${teacherids}`);
			            callback(error, result);
			        } else {
			            console.log(`Invalid teachers: ${teachers}`);
			            callback(null, { 'message': `Invalid teachers: ${teachers}` });
			        }
			    });
			}, function (callback) {
			    console.log(`teacherids ${teacherids}`);
			    if (teacher_emails.length == 1) {
			        var students_query = `SELECT studentid FROM teacher_student where teacherid = '${teacherids}';`;
			        //console.log(`students_query: ${students_query}`);
			        db.query(students_query, function (error, result) {
			            if (error)
			                console.error(error.message); // if error occured during connection 
			            else {
			                // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
			                if (result.length > 0) {
			                    //console.log('Common: '+result.length + ' students: ' + JSON.stringify(result));
			                    var ids = result.map(i => i.studentid);
			                    studentids = ids.join('\',\'');
			                    console.log('Common: ' + result.length + ' students: ' + studentids);
			                } else
			                    console.error("No students found!");
			            }
			            callback(error, result);
			        });
			    } else {
			        // SELECT count(*), id, teacherid,studentid FROM teacher_student where teacherid in (10,11) GROUP BY studentid HAVING COUNT(*) > 1;
			        var students_query = `SELECT count(*), studentid FROM teacher_student where teacherid in ('${teacherids}') GROUP BY studentid HAVING COUNT(*) > 1;`;
			        //console.log(`students_query: ${students_query}`);
			        db.query(students_query, function (error, result) {
			            if (error)
			                console.error(error.message); // if error occured during connection 
			            else {
			                // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
			                if (result.length > 0) {
			                    //console.log('Common: '+result.length + ' students: ' + JSON.stringify(result));
			                    var ids = result.map(i => i.studentid);
			                    studentids = ids.join('\',\'');
			                    console.log('Common: ' + result.length + ' students: ' + studentids);
			                } else
			                    console.error("No students found!");
			            }
			            callback(error, result);
			        });
			    }
			}, function (callback) {
			    if (studentids.length > 0) {
			        var students_query = `SELECT email from students where id in ('${studentids}')`;
			        db.query(students_query, function (error, result) {
			            if (error)
			                console.error(error.message); // if error occured during connection 
			            else {
			                // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
			                if (result.length > 0) {
			                    console.log(result.length + ' students: ' + JSON.stringify(result));
			                } else
			                    console.error("No students found!");
			            }
			            callback(error, result);
			        });
			    } else
			        callback(null, null);
			}
        ], function (err, results) {
            if (err) {
                console.error("Error: " + JSON.stringify(err));
                res.status(err.status || 500);
                res.json(err);
            } else if (typeof results === 'undefined' || results === null || !results.length) {
                console.error("Failed with null/empty result!");
                res.status(500);
                res.json({ 'message': 'Internal server errors' });
            } else if (typeof results[2] === 'undefined' || results[2] === null || !results[2].length) {
                console.log('ERROR: ' + JSON.stringify(results));
                console.error("Failed with null/empty result!");
                res.status(500);
                res.json(results[0]);
            } else {
                // Index of results:
                // 0: result from the first serial function
                // 1: results from the second serial function
                var students = { students: results[2].map(i => i.email) };
                console.log("GET /api/commonstudents successful. " + students.students.length + " results: " + JSON.stringify(students));
                res.json(students);
            }
        });
    } else {//if
        res.status(400);
        res.json({ 'message': 'Calling /api/commonstudents without any valid teacher specified in query string!' });
    }
};
module.exports = CommonStudents;