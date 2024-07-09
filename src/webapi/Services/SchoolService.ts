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
import { Response, Error as grpcError } from "../grpc/client/response_pb.js";
import { CommonStudentsRequest as grpcCommonStudentsRequest, CommonStudentsResponse, RegisterRequest, AddStudentsToTeacherRequest as grpcAddStudentsToTeacherRequest } from "../grpc/client/school_pb.js";
import { Student as grpcStudent } from "../grpc/client/student_pb.js";
import { Teacher as grpcTeacher } from "../grpc/client/teacher_pb.js";
import { SchoolService } from "../grpc/client/school_grpc_pb.js";
import { ILogger, LogLevels, LoggerTypes, Student, Teacher, RegisterStudentRequest, RegisterTeacherRequest, AddStudentsToTeacherRequest, CommonStudentsRequest, UseCaseTypes, IRegisterStudentUseCase, IRegisterTeacherUseCase, IAddStudentsToTeacherUseCase, ICommonStudentsUseCase, UseCaseResponseMessage, Error } from "webapi.core"
import { PresenterBase } from "../Presenters/PresenterBase.js"
import { di } from "../routes/api.js"
import { RegisterStudentModel } from "../Models/Request/RegisterStudentModel.js"
import { RegisterTeacherModel } from "../Models/Request/RegisterTeacherModel.js"
import { RegisterUserPresenter } from "../Presenters/RegisterUserPresenter.js"
import { CommonStudentsPresenter } from "../Presenters/CommonStudentsPresenter.js";
var studentUseCase: IRegisterStudentUseCase = di.get<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase);
var teacherUseCase: IRegisterTeacherUseCase = di.get<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase);
var addStudentsToTeacherUseCase: IAddStudentsToTeacherUseCase = di.get<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase);
var commonStudentsUseCase: ICommonStudentsUseCase = di.get<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase);
var presenter: RegisterUserPresenter = new RegisterUserPresenter();
var logger = di.get<ILogger>(LoggerTypes.ILogger);
/**
 * register request handler. Gets a request with a point, and responds with a
 * feature object indicating whether there is a feature at that point.
 * @param {EventEmitter} call Call object for the handler to process
 * @param {function(Error, feature)} callback Response callback
 */
async function register (call: ServerUnaryCall<RegisterRequest, Response>, callback: sendUnaryData<Response>) {
    const request = call.request;
    try {
        let message: string = "";
        let errors: Array<Error> = [];
        let grpcStudents = request.getStudentsList();
        let grpcTeachers = request.getTeachersList();
        logger.Log(LogLevels.debug, 'grpc register query: ' + JSON.stringify(request));
        if (grpcStudents.length) {
            let students: Student[] = [];
            grpcStudents.map((i: grpcStudent) => {
                if (emailvalidator.validate(i.getEmail())) {
                    students.push(new Student(i.getFirstname(), i.getLastname(), i.getEmail()))
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
                if (emailvalidator.validate(i.getEmail())) {
                    teachers.push(new Teacher(i.getFirstname(), i.getLastname(), i.getEmail()))
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
        response.setSuccess(true);
        let grpcErrors: Array<grpcError> = new Array<grpcError>();
        errors.map((i: Error) => {
            let error: grpcError = new grpcError();
            error.setDescription(i.Description);
            grpcErrors.push(error);
        });
        response.setErrorsList(grpcErrors);
        callback(null, response);
    } catch (e: any) {
        console.log(e);
        callback(e, null);
    }
}
async function addStudentsToTeacher (call: ServerUnaryCall<grpcAddStudentsToTeacherRequest, Response>, callback: sendUnaryData<Response>) {
    const request = call.request;
    try {
        let message: string = "";
        let errors: Array<Error> = [];
        let response: Response = new Response();
        let grpcStudents = request.getStudentsList();
        let grpcTeacher = request.getTeacher();
        logger.Log(LogLevels.debug, 'grpc addstudentstoteacher query: ' + JSON.stringify(request));
        let teacher: Teacher | null = null;
        let students: Student[] = [];
        if (emailvalidator.validate(grpcTeacher.email) === false)
            message = 'Invalid teacher email address!';
        else
            teacher = new Teacher("", "", grpcTeacher.email);
        if (!grpcStudents.length)
            message += ' without a list of students specified!';
        if (message) {
            response.setSuccess(false);
            let error: grpcError = new grpcError();
            let errors: Array<grpcError> = new Array<grpcError>();
            error.setDescription(message);
            errors.push(error);
            response.setErrorsList(errors);
            callback(null, response);
            return;
        }
        logger.Log(LogLevels.debug, `teacher: ${JSON.stringify(teacher)}, students: ${JSON.stringify(grpcStudents)}`);
        if (teacher !== null && grpcStudents.length) {
            let students: Student[] = [];
            grpcStudents.map((email: string) => {
                if (emailvalidator.validate(email)) {
                    students.push(new Student("", "", email))
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
            response.setSuccess(true);
            let grpcErrors: Array<grpcError> = new Array<grpcError>();
            errors.map((i: Error) => {
                let error: grpcError = new grpcError();
                error.setDescription(i.Description);
                grpcErrors.push(error);
            });
            response.setErrorsList(grpcErrors);
            callback(null, response);
        }
    } catch (e: any) {
        console.log(e);
        callback(e, null);
    }
}
async function commonStudents (call: ServerUnaryCall<grpcCommonStudentsRequest, CommonStudentsResponse>, callback: sendUnaryData<CommonStudentsResponse>) {
    const request = call.request;
    try {
        let message: string = "";
        let errors: Array<Error> = [];
        let response: CommonStudentsResponse = new CommonStudentsResponse();
        let presenter: CommonStudentsPresenter = new CommonStudentsPresenter();
        let grpcTeachers = request.getTeachersList();
        if (!grpcTeachers.length) {
            let r: Response = new Response();
            r.setSuccess(false);
            let error: grpcError = new grpcError();
            let errors: Array<grpcError> = new Array<grpcError>();
            error.setDescription(message);
            errors.push(error);
            r.setErrorsList(errors);
            response.setResponse(r);
            callback(null, response);
            return;
        } else {
            let request: CommonStudentsRequest = new CommonStudentsRequest(grpcTeachers);
            await commonStudentsUseCase.Handle(request, presenter);
            let r: Response = new Response();
            r.setSuccess(true);
            let grpcErrors: Array<grpcError> = new Array<grpcError>();
            errors.map((i: Error) => {
                let error: grpcError = new grpcError();
                error.setDescription(i.Description);
                grpcErrors.push(error);
            });
            r.setErrorsList(grpcErrors);
            response.setResponse(r);
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
        commonStudents
    });
    return server;
}