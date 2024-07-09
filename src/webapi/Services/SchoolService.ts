/*
There are two ways to work with proto buffers and code generation in gRPC; dynamic or static. 
In static, we will generate types and code from our proto buffers but in dynamic we will not generate any typings from proto buffers and will use the code instead. 
dynamic can be a pretty good option if we were using JavaScript but since we need the typings to make our work easier while using TypeScript we will use the static way.
*/
import fs from "fs";
//import parseArgs from 'minimist';
import path from 'path';
import grpc from '@grpc/grpc-js';
import {
    ServerUnaryCall,
    sendUnaryData,
    Server,
    ServerCredentials,
} from "@grpc/grpc-js";
import emailvalidator from 'email-validator'
import { Response, Error as grpcError } from "../grpc/client/response.js";
//import { RegisterRequest, AddStudentsToTeacherRequest } from "../grpc/client/school.js";
import { school } from "../grpc/client/school.js";
import { student as grpcStudent } from "../grpc/client/student.js";
import { teacher as grpcTeacher } from "../grpc/client/teacher.js";
import { SchoolService } from "../grpc/client/school_grpc_pb.js";
import { ILogger, LogLevels, LoggerTypes, Student, Teacher, RegisterStudentRequest, RegisterTeacherRequest, AddStudentsToTeacherRequest, UseCaseTypes, IRegisterStudentUseCase, IRegisterTeacherUseCase, IAddStudentsToTeacherUseCase, UseCaseResponseMessage, Error } from "webapi.core"
import { PresenterBase } from "../Presenters/PresenterBase.js"
import { di } from "../routes/api.js"
import { RegisterStudentModel } from "../Models/Request/RegisterStudentModel.js"
import { RegisterTeacherModel } from "../Models/Request/RegisterTeacherModel.js"
import { RegisterUserPresenter } from "../Presenters/RegisterUserPresenter.js"
var studentUseCase: IRegisterStudentUseCase = di.get<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase);
var teacherUseCase: IRegisterTeacherUseCase = di.get<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase);
var addStudentsToTeacherUseCase: IAddStudentsToTeacherUseCase = di.get<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase);
var presenter: RegisterUserPresenter = new RegisterUserPresenter();
var logger = di.get<ILogger>(LoggerTypes.ILogger);
/**
 * register request handler. Gets a request with a point, and responds with a
 * feature object indicating whether there is a feature at that point.
 * @param {EventEmitter} call Call object for the handler to process
 * @param {function(Error, feature)} callback Response callback
 */
async function register (call: ServerUnaryCall<school.RegisterRequest, Response>, callback: sendUnaryData<Response>) {
    const request = call.request;
    try {
        let message: string = "";
        let errors: Array<Error> = [];
        let grpcStudents = request.students;
        let grpcTeachers = request.teachers;
        logger.Log(LogLevels.debug, 'grpc register query: ' + JSON.stringify(request));
        if (grpcStudents.length) {
            let students: Student[] = [];
            grpcStudents.map((i: grpcStudent) => {
                if (emailvalidator.validate(i.email)) {
                    students.push(new Student(i.firstName, i.lastName, i.email))
                }
            });
            if (students.length) {
                let request = new RegisterStudentRequest(students);
                await studentUseCase.Handle(request, presenter);
                message = presenter.Message;
                errors = presenter.Errors;
            }
        }
        if (grpcTeachers.length) {
            let teachers: Teacher[] = [];
            grpcTeachers.map((i: grpcTeacher) => {
                if (emailvalidator.validate(i.email)) {
                    teachers.push(new Teacher(i.firstName, i.lastName, i.email))
                }
            });
            if (teachers.length) {
                let request = new RegisterTeacherRequest(teachers);
                await teacherUseCase.Handle(request, presenter);
                message += `, ${presenter.Message}`;
                presenter.Errors.forEach(function (item) {
                    errors.push(item);
                });
            }
        }
        let response: Response = new Response();
        response.success = true;
        errors.map((i: Error) => {
            let error: grpcError = new grpcError();
            error.description = i.Description;
            response.errors.push(error);
        });
        callback(null, response);
    } catch (e: any) {
        console.log(e);
        callback(e, null);
    }
}
async function addStudentsToTeacher (call: ServerUnaryCall<school.AddStudentsToTeacherRequest, Response>, callback: sendUnaryData<Response>) {
    const request = call.request;
    try {
        let message: string = "";
        let errors: Array<Error> = [];
        let response: Response = new Response();
        let grpcStudents = request.students;
        let grpcTeacher = request.teacher;
        logger.Log(LogLevels.debug, 'grpc addstudentstoteacher query: ' + JSON.stringify(request));
        let teacher: Teacher | null = null;
        //let studentsModel: RegisterStudentModel[] = [];
        let students: Student[] = [];
        if (emailvalidator.validate(grpcTeacher.email) === false)
            message = 'Invalid teacher email address!';
        else
            teacher = new Teacher("", "", grpcTeacher.email);
        if (!grpcStudents.length)
            message += ' without a list of students specified!';
        if (message) {
            response.success = true;
            let error: grpcError = new grpcError();
            error.description = message;
            response.errors.push(error);
            callback(null, response);
            return;
        }
        //else
        //    studentsModel = req.body.students;//JSON.parse(req.body.students);
        logger.Log(LogLevels.debug, `teacher: ${JSON.stringify(teacher)}, students: ${JSON.stringify(grpcStudents)}`);
        if (teacher !== null && grpcStudents.length) {
            let students: Student[] = [];
            grpcStudents.map((i: grpcStudent) => {
                if (emailvalidator.validate(i.email)) {
                    students.push(new Student(i.firstName, i.lastName, i.email))
                }
            });
            if (students.length) {
                logger.Log(LogLevels.debug, `teacher: ${JSON.stringify(teacher)}, students: ${JSON.stringify(students)}`);
                if (students.length) {
                    let presenter: PresenterBase<UseCaseResponseMessage> = new PresenterBase();
                    logger.Log(LogLevels.debug, `Adding ${students.length} students to teacher ${teacher.email}...`);
                    let request = new AddStudentsToTeacherRequest(teacher, students);
                    await addStudentsToTeacherUseCase.Handle(request, presenter);
                    message = presenter.Message;
                    errors = presenter.Errors;
                }
            }
            response.success = true;
            errors.map((i: Error) => {
                let error: grpcError = new grpcError();
                error.description = i.Description;
                response.errors.push(error);
            });
            callback(null, response);
        }
    } catch (e: any) {
        console.log(e);
        callback(e, null);
    }
}
/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
export function getServer () {
    var server = new grpc.Server();
    server.addService(SchoolService, {
        register,
        addStudentsToTeacher,
    });
    return server;
}