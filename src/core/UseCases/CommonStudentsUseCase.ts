import emailvalidator from 'email-validator'
import { ICommonStudentsUseCase } from "../Interfaces/UseCases/ICommonStudentsUseCase"
import { IStudentRepository } from "../Interfaces/IStudentRepository"
import { ITeacherRepository } from "../Interfaces/ITeacherRepository"
import { IOutputPort } from "../Interfaces/IOutputPort";
import { CommonStudentsResponse } from "../DTO/UseCaseResponse/CommonStudentsResponse"
import { CommonStudentsRequest } from "../DTO/UseCaseRequests/CommonStudentsRequest"
import { Teacher } from "../Domain/Entities/Teacher";
import { Student } from '../Domain/Entities/Student';
import { StudentDTO } from "../DTO/StudentDTO";
import { Error } from "../DTO/Error"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "../Interfaces/ILogger";
import { LoggerTypes, RepositoryTypes } from '../types';
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
            request.Teachers.forEach(async i => {
                if (emailvalidator.validate(i)) {
                    let teacher: Teacher | null = await this._teacherRepository.GetByEmail(i);
                    if (teacher) {
                        students = !counter++ ? teacher.students : students.filter(student => teacher!.students.includes(student));
                    } else
                        errors.push(new Error("", `Invalid teacher! ${i}!`));
                } else
                    errors.push(new Error("", `Invalid teacher's email! ${i}!`));
            });
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