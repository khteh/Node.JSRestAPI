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
import { IRegisterStudentUseCase, IRegisterTeacherUseCase, IAddStudentsToTeacherUseCase, ICommonStudentsUseCase, ISuspendStudentUseCase, IStudentNotificationsUseCase, IGenerateTextUseCase, Student, UseCaseTypes } from "webapi.core"
import { IStudentRepository, ITeacherRepository, RepositoryTypes, LoggerTypes } from "webapi.core";
import { RegisterStudentUseCase, SuspendStudentUseCase, RegisterTeacherUseCase, AddStudentsToTeacherUseCase, CommonStudentsUseCase, GenerateTextUseCase, StudentNotificationsUseCase } from "webapi.core";
import { StudentRepository, TeacherRepository, LoggerImpl, DatabaseTypes, Database } from "infrastructure"
import { ILogger } from "webapi.core";
import { loadEnvFile } from 'node:process';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' })
loadEnvFile();
var api = express.Router();
const di = new Container();
di.bind<IGenerateTextUseCase>(UseCaseTypes.IGenerateTextUseCase).to(GenerateTextUseCase);
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
var gemini = new GeminiController(di.get<ILogger>(LoggerTypes.ILogger), di.get<IGenerateTextUseCase>(UseCaseTypes.IGenerateTextUseCase));
var registration = new RegistrationController(di.get<ILogger>(LoggerTypes.ILogger), di.get<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase), di.get<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase));
var addStudentsToTeacher = new AddStudentsToTeacherController(di.get<ILogger>(LoggerTypes.ILogger), di.get<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase));
var commonStudents = new CommonStudentsController(di.get<ILogger>(LoggerTypes.ILogger), di.get<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase));
var suspendStudent = new SuspendStudentController(di.get<ISuspendStudentUseCase>(UseCaseTypes.ISuspendStudentUseCase));
var studentNotifications = new StudentNotificationsController(di.get<IStudentNotificationsUseCase>(UseCaseTypes.IStudentNotificationsUseCase));
api.get('/greetings', function (req, res, next) { greetings.Greetings(req, res, next); });
api.get('/fibonacci', function (req, res, next) { fibonacci.Fibonacci(req, res, next); });
api.get('/gemini', function (req, res, next) { res.render('gemini', { title: 'Google Gemini' }); });
api.post('/gemini', upload.single('image'), function (req, res, next) { gemini.GenerateText(req, res, next); });
api.post('/register', function (req, res, next) { registration.Register(req, res, next); });
api.post('/addstudents', function (req, res, next) { addStudentsToTeacher.AddStudentsToTeacher(req, res, next); });
api.post('/commonstudents', function (req, res, next) { commonStudents.CommonStudents(req, res, next); });
api.post('/suspendstudent', function (req, res, next) { suspendStudent.SuspendStudent(req, res, next); })
api.post('/notifystudents', function (req, res, next) { studentNotifications.NotifyStudents(req, res, next); })
export { api, di };