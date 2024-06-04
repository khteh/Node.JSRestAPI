import config from 'config'
import express from 'express'
import { Container } from "inversify";
import { FibonacciController } from '../Controllers/FibonacciController.js';
import { GreetingsController } from '../Controllers/GreetingsController.js';
import { RegistrationController } from '../Controllers/RegistrationController.js';
import { AddStudentsToTeacherController } from '../Controllers/AddStudentsToTeacherController.js';
import { CommonStudentsController } from '../Controllers/CommonStudentsController.js';
import { SuspendStudentController } from '../Controllers/SuspendStudentController.js';
import { StudentNotificationsController } from '../Controllers/StudentNotificationsController.js';
import { IRegisterStudentUseCase, IRegisterTeacherUseCase, IAddStudentsToTeacherUseCase, ICommonStudentsUseCase, ISuspendStudentUseCase, IStudentNotificationsUseCase, Student, UseCaseTypes } from "webapi.core"
import { IStudentRepository, ITeacherRepository, RepositoryTypes, LoggerTypes } from "webapi.core";
import { RegisterStudentUseCase, SuspendStudentUseCase, RegisterTeacherUseCase, AddStudentsToTeacherUseCase, CommonStudentsUseCase, StudentNotificationsUseCase } from "webapi.core";
import { StudentRepository, TeacherRepository, LoggerImpl, DatabaseTypes, Database } from "infrastructure"
import { ILogger } from "webapi.core";
var api = express.Router();
const di = new Container();
di.bind<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase).to(RegisterStudentUseCase);
di.bind<ISuspendStudentUseCase>(UseCaseTypes.ISuspendStudentUseCase).to(SuspendStudentUseCase);
di.bind<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase).to(RegisterTeacherUseCase);
di.bind<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase).to(AddStudentsToTeacherUseCase);
di.bind<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase).to(CommonStudentsUseCase);
di.bind<IStudentNotificationsUseCase>(UseCaseTypes.IStudentNotificationsUseCase).to(StudentNotificationsUseCase);
di.bind<IStudentRepository>(RepositoryTypes.IStudentRepository).to(StudentRepository);
di.bind<ITeacherRepository>(RepositoryTypes.ITeacherRepository).to(TeacherRepository);
di.bind<ILogger>(LoggerTypes.ILogger).to(LoggerImpl);
di.bind(DatabaseTypes.DatabaseService).to(Database);
var fibonacci = new FibonacciController(di.get<ILogger>(LoggerTypes.ILogger));
var greetings = new GreetingsController(di.get<ILogger>(LoggerTypes.ILogger));
var registration = new RegistrationController(di.get<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase), di.get<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase));
var addStudentsToTeacher = new AddStudentsToTeacherController(di.get<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase));
var commonStudents = new CommonStudentsController(di.get<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase));
var suspendStudent = new SuspendStudentController(di.get<ISuspendStudentUseCase>(UseCaseTypes.ISuspendStudentUseCase));
var studentNotifications = new StudentNotificationsController(di.get<IStudentNotificationsUseCase>(UseCaseTypes.IStudentNotificationsUseCase));
//import registration from '../BusinessLogic/registration.js'
//import notifications from '../BusinessLogic/notifications.js'
//import suspend from '../BusinessLogic/suspend.js'
//import commonstudents from '../BusinessLogic/commonstudents.js'
//import greetings from '../BusinessLogic/greetings.js'
//import fibonacci from '../BusinessLogic/fibonacci.js'
api.get('/greetings', function (req, res, next) { greetings.Greetings(req, res, next); });
api.get('/fibonacci', function (req, res, next) { fibonacci.Fibonacci(req, res, next); });
api.post('/register/student', function (req, res, next) { registration.RegisterStudent(req, res, next); });
api.post('/register/teacher', function (req, res, next) { registration.RegisterTeacher(req, res, next); });
api.post('/addstudents', function (req, res, next) { addStudentsToTeacher.AddStudentsToTeacher(req, res, next); });
api.post('/commonstudents', function (req, res, next) { commonStudents.CommonStudents(req, res, next); });
api.post('/suspendstudent', function (req, res, next) { suspendStudent.SuspendStudent(req, res, next); })
api.post('/notifystudents', function (req, res, next) { studentNotifications.NotifyStudents(req, res, next); })
//router.post('/retrievefornotifications', function (req, res, next) { notifications(req, res, next); });
//router.get('/commonstudents', function (req, res, next) { commonstudents(req, res, next); });
//router.post('/suspend', function (req, res, next) { suspend(req, res, next); });
export { api, di };