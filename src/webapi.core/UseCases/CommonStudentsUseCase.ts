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
        this._logger.Log(LogLevels.debug, 'POST /api/commonstudents query: ' + JSON.stringify(request, null, 2));
        let students: Student[] = [];
        let studentsDTO: StudentDTO[] = [];
        let response: CommonStudentsResponse;
        if (request.Teachers !== undefined && request.Teachers.length > 0) {
            for (let i of request.Teachers) {
                if (emailvalidator.validate(i)) {
                    let teacher: Teacher | null = await this._teacherRepository.GetByEmail(i);
                    if (teacher && teacher.students.length) {
                        const merge = (a: Array<Student>, b: Array<Student>, predicate = (a: Student, b: Student) => a.id === b.id) => {
                            const c = [...a]; // copy to avoid side effects
                            // add all items from B to copy C if they're not already present
                            b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
                            return c;
                        }
                        students = merge(students, teacher.students);
                    } else if (teacher === null) {
                        this._logger.Log(LogLevels.error, `teacher ${i} does not have any student registered!`);
                        errors.push(new Error("", `Invalid teacher! ${i}!`));
                    } else if (!teacher.students.length) {
                        this._logger.Log(LogLevels.warn, `teacher ${i} does not have any student registered!`);
                        errors.push(new Error("", `teacher ${i} does not have any student registered!`));
                    }
                } else {
                    this._logger.Log(LogLevels.error, `Invalid teacher's email! ${i}!`);
                    errors.push(new Error("", `Invalid teacher's email! ${i}!`));
                }
            };
        } else {
            response = new CommonStudentsResponse("", false, studentsDTO, `Invalid request!`, errors);
            outputPort.Handle(response);
            return false;
        }
        students.map(i => studentsDTO.push(new StudentDTO(i.id, i.firstName, i.lastName, i.email, i.isSuspended)));
        this._logger.Log(LogLevels.debug, `${studentsDTO.length} common students found!`);
        response = new CommonStudentsResponse("", !errors.length, studentsDTO, `${studentsDTO.length} common students found!`, errors);
        outputPort.Handle(response);
        return response.Success;
    }
}