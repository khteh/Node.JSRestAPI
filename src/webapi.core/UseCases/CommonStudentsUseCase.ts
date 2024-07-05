import emailvalidator from 'email-validator'
import { ICommonStudentsUseCase } from "../Interfaces/UseCases/ICommonStudentsUseCase.js"
import { IStudentRepository } from "../Interfaces/IStudentRepository.js"
import { ITeacherRepository } from "../Interfaces/ITeacherRepository.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { CommonStudentsResponse } from "../DTO/UseCaseResponse/CommonStudentsResponse.js"
import { CommonStudentsRequest } from "../DTO/UseCaseRequests/CommonStudentsRequest.js"
import { Teacher } from "../Domain/Entities/Teacher.js";
import { Student } from '../Domain/Entities/Student.js';
import { StudentDTO } from "../DTO/StudentDTO.js";
import { Error } from "../DTO/Error.js"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "../Interfaces/ILogger.js";
import { LoggerTypes, RepositoryTypes } from "../types.js";
import e from "express";
@injectable()
export class CommonStudentsUseCase implements ICommonStudentsUseCase {
    private readonly _teacherRepository: ITeacherRepository;
    private readonly _studentRepository: IStudentRepository;
    private _logger: ILogger;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(RepositoryTypes.IStudentRepository) studentRepo: IStudentRepository, @inject(RepositoryTypes.ITeacherRepository) teacherRepo: ITeacherRepository) {
        this._logger = logger;
        this._teacherRepository = teacherRepo;
        this._studentRepository = studentRepo;
    }
    // Retrieve students who are registered to ALL of the given teachers:
    public async Handle (request: CommonStudentsRequest, outputPort: IOutputPort<CommonStudentsResponse>): Promise<Boolean> {
        let errors: Error[] = [];
        this._logger.Log(LogLevels.debug, 'GET /api/commonstudents query: ' + JSON.stringify(request));
        let students: Student[] = [];
        let studentsDTO: StudentDTO[] = [];
        let response: CommonStudentsResponse;
        if (request.Teachers !== undefined && request.Teachers.length > 0) {
            let counter: number = 0;
            for (let i of request.Teachers) {
                if (emailvalidator.validate(i)) {
                    let teacher: Teacher | null = await this._teacherRepository.GetByEmail(i);
                    if (teacher) {
                        students = !counter++ ? teacher.students : students.filter(student => teacher!.students.includes(student)).filter(function (e, i, c) { // extra step to remove duplicates
                            return c.indexOf(e) === i;
                        });
                    } else
                        errors.push(new Error("", `Invalid teacher! ${i}!`));
                } else
                    errors.push(new Error("", `Invalid teacher's email! ${i}!`));
            };
        } else {
            response = new CommonStudentsResponse("", false, studentsDTO, `Invalid request!`, errors);
            outputPort.Handle(response);
            return false;
        }
        students.map(i => studentsDTO.push(new StudentDTO(i.id, i.firstName, i.lastName, i.email, i.isSuspended)));
        response = new CommonStudentsResponse("", !errors.length, studentsDTO, `${studentsDTO.length} common students found!`, errors);
        outputPort.Handle(response);
        return response.Success;
    }
}