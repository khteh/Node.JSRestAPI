import config from 'config'
import express from 'express'
import { Container } from "inversify";
import { FibonacciController } from '../Controllers/FibonacciController.js';
import { GreetingsController } from '../Controllers/GreetingsController.js';
import { RegistrationController } from '../Controllers/RegistrationController.js';
import { AddStudentsToTeacherController } from '../Controllers/AddStudentsToTeacherController.js';
import { CommonStudentsController } from '../Controllers/CommonStudentsController.js';
import { IRegisterStudentUseCase, IRegisterTeacherUseCase, IAddStudentsToTeacherUseCase, ICommonStudentsUseCase, Student, UseCaseTypes } from "core"
import { IStudentRepository, ITeacherRepository, RepositoryTypes, LoggerTypes } from 'core';
import { RegisterStudentUseCase, RegisterTeacherUseCase, AddStudentsToTeacherUseCase, CommonStudentsUseCase } from 'core';
import { StudentRepository, TeacherRepository, LoggerImpl, DatabaseTypes, Database } from "infrastructure"
import { ILogger } from 'core';
var api = express.Router();
const di = new Container();
di.bind<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase).to(RegisterStudentUseCase);
di.bind<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase).to(RegisterTeacherUseCase);
di.bind<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase).to(AddStudentsToTeacherUseCase);
di.bind<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase).to(CommonStudentsUseCase);
di.bind<IStudentRepository>(RepositoryTypes.IStudentRepository).to(StudentRepository);
di.bind<ITeacherRepository>(RepositoryTypes.ITeacherRepository).to(TeacherRepository);
di.bind<ILogger>(LoggerTypes.ILogger).to(LoggerImpl);
di.bind(DatabaseTypes.DatabaseService).to(Database);
var fibonacci = new FibonacciController();
var greetings = new GreetingsController();
var registration = new RegistrationController(di.get<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase), di.get<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase));
var addStudentsToTeacher = new AddStudentsToTeacherController(di.get<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase));
var commonStudents = new CommonStudentsController(di.get<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase));
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
//router.post('/retrievefornotifications', function (req, res, next) { notifications(req, res, next); });
//router.get('/commonstudents', function (req, res, next) { commonstudents(req, res, next); });
//router.post('/suspend', function (req, res, next) { suspend(req, res, next); });
export { api, di };