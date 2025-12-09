/*import 'reflect-metadata'
import config from 'config'
import express from 'express'
import { Container } from "inversify";
import { FibonacciController } from '../Controllers/FibonacciController.js';
import { GreetingsController } from '../Controllers/GreetingsController.js';
import { GeminiController } from '../Controllers/GeminiController.js';
import { RegistrationController } from '../Controllers/RegistrationController.js';
import { AddStudentsToTeacherController } from '../Controllers/AddStudentsToTeacherController.js';
import { CommonStudentsController } from '../Controllers/CommonStudentsController.js';
import { SuspendStudentController } from '../Controllers/SuspendStudentController.js';
import { StudentNotificationsController } from '../Controllers/StudentNotificationsController.js';
import { IRegisterStudentUseCase, IRegisterTeacherUseCase, IAddStudentsToTeacherUseCase, ICommonStudentsUseCase, ISuspendStudentUseCase, IStudentNotificationsUseCase, IGenerateContentUseCase, Student, UseCaseTypes } from "webapi.core"
import { IStudentRepository, ITeacherRepository, RepositoryTypes, LoggerTypes } from "webapi.core";
import { RegisterStudentUseCase, SuspendStudentUseCase, RegisterTeacherUseCase, AddStudentsToTeacherUseCase, CommonStudentsUseCase, GenerateContentUseCase, StudentNotificationsUseCase } from "webapi.core";
import { StudentRepository, TeacherRepository, LoggerImpl, DatabaseTypes, Database } from "infrastructure"
import { ILogger } from "webapi.core";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' })
var api = express.Router();
const di = new Container();*/
/*
console.log('### LoggerTypes.ILogger ###');
console.log(LoggerTypes.ILogger);
console.log(`LoggerImpl: ${LoggerImpl}, Database: ${Database}, StudentRepository: ${StudentRepository}, TeacherRepository: ${TeacherRepository}`); //, GenerateContentUseCase: ${GenerateContentUseCase}`);
*/
/*
di.bind<ILogger>(LoggerTypes.ILogger).to(LoggerImpl);
di.bind<IGenerateContentUseCase>(UseCaseTypes.IGenerateContentUseCase).to(GenerateContentUseCase);
di.bind<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase).to(RegisterStudentUseCase);
di.bind<ISuspendStudentUseCase>(UseCaseTypes.ISuspendStudentUseCase).to(SuspendStudentUseCase);
di.bind<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase).to(RegisterTeacherUseCase);
di.bind<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase).to(AddStudentsToTeacherUseCase);
di.bind<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase).to(CommonStudentsUseCase);
di.bind<IStudentNotificationsUseCase>(UseCaseTypes.IStudentNotificationsUseCase).to(StudentNotificationsUseCase);
di.bind<IStudentRepository>(RepositoryTypes.IStudentRepository).to(StudentRepository);
di.bind<ITeacherRepository>(RepositoryTypes.ITeacherRepository).to(TeacherRepository);
di.bind(DatabaseTypes.DatabaseService).to(Database);
var fibonacci = new FibonacciController(di.get<ILogger>(LoggerTypes.ILogger));
var greetings = new GreetingsController(di.get<ILogger>(LoggerTypes.ILogger));
var gemini = new GeminiController(di.get<ILogger>(LoggerTypes.ILogger), di.get<IGenerateContentUseCase>(UseCaseTypes.IGenerateContentUseCase));
var registration = new RegistrationController(di.get<ILogger>(LoggerTypes.ILogger), di.get<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase), di.get<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase));
var addStudentsToTeacher = new AddStudentsToTeacherController(di.get<ILogger>(LoggerTypes.ILogger), di.get<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase));
var commonStudents = new CommonStudentsController(di.get<ILogger>(LoggerTypes.ILogger), di.get<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase));
var suspendStudent = new SuspendStudentController(di.get<ISuspendStudentUseCase>(UseCaseTypes.ISuspendStudentUseCase));
var studentNotifications = new StudentNotificationsController(di.get<IStudentNotificationsUseCase>(UseCaseTypes.IStudentNotificationsUseCase));
api.get('/greetings', function (req, res, next) { greetings.Greetings(req, res, next); });
api.get('/fibonacci', function (req, res, next) { fibonacci.Fibonacci(req, res, next); });
api.post('/gemini', upload.single('image'), function (req, res, next) { gemini.GenerateText(req, res, next); });
api.post('/register', function (req, res, next) { registration.Register(req, res, next); });
api.post('/addstudents', function (req, res, next) { addStudentsToTeacher.AddStudentsToTeacher(req, res, next); });
api.post('/commonstudents', function (req, res, next) { commonStudents.CommonStudents(req, res, next); });
api.post('/suspendstudent', function (req, res, next) { suspendStudent.SuspendStudent(req, res, next); })
api.post('/notifystudents', function (req, res, next) { studentNotifications.NotifyStudents(req, res, next); })
export { api, di };*/