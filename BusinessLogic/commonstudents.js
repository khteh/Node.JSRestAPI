var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var async = require('async');
var url = require('url');
function CommonStudents(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log('GET /api/commonstudents query: ' + JSON.stringify(query));
    var teacherids = '';
    if (query.teacher !== undefined && query.teacher !== undefined && query.teacher.length > 0) {
        async.series([
			function (callback) {
			    var teachers = query.teacher.join('\',\'');
			    console.log(`teachers: ${teachers}`);
			    var teacher_query = `select id from teachers where email in ('${teachers}')`;
			    console.log(`teacher_query: ${teacher_query}`);
			    db.query(teacher_query, function (error, result) {
			        if (error)
			            console.error(error.message);
			        else if (result.length > 0) {
			            console.log("teacher_query result: " + JSON.stringify(result));
			            var ids = result.map(i => i.id);
			            teacherids = ids.join('\',\'');
			            console.log(`Teachers: ${teacherids}`);
			        } else
			            console.log(`No teacher ${teachers}`);
			        callback(error, result);
			    });
			},
            function (callback) {
                console.log(`teacherids ${teacherids}`);
			    if (teacherids.length > 0) {
			        var students_query = `select email from students where teacherid in ('${teacherids}')`;
			        console.log(`students_query: ${students_query}`);
			        var newTeacher = db.query(students_query, function (error, result) {
			            if (error)
			                console.error(error.message); // if error occured during connection 
			            else {
			                // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
			                if (result.length > 0)
			                    console.log(result.length + ' students: ' + JSON.stringify(result));
			                else
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
            } else if (typeof results === 'undefined' || results === null || !results.length) {
                console.error("Failed with null/empty result!");
                res.status(err.status || 500);
            } else {
                // Index of results:
                // 0: result from the first serial function
                // 1: results from the second serial function
                var students = { students: results[1].map(i => i.email) };
                console.log("GET /api/commonstudents successful. " + students.length + " results: " + JSON.stringify(students));
                res.json(students);
            }
        }
        );
    }//if
};
module.exports = CommonStudents;