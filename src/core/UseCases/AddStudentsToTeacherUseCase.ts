import { IAddStudentsToTeacherUseCase } from "Interfaces/UseCases/IAddStudentsToTeacherUseCase"
import { IStudentRepository } from "Interfaces/IStudentRepository"
import { ITeacherRepository } from "Interfaces/ITeacherRepository"
import { IOutputPort } from "Interfaces/IOutputPort";
import { UseCaseResponseMessage } from "DTO/UseCaseResponse/UseCaseResponseMessage"
import { AddStudentsToTeacherRequest } from "DTO/UseCaseRequests/AddStudentsToTeacherRequest"
import { Teacher } from "Domain/Entities/Teacher";
import { Error } from "DTO/Error"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "Interfaces/ILogger";
import e from "express";
@injectable()
export class AddStudentsToTeacherUseCase implements IAddStudentsToTeacherUseCase {
    private readonly _teacherRepository: ITeacherRepository;
    private readonly _studentRepository: IStudentRepository;
    private _logger: ILogger;
    public constructor(logger: ILogger, repo: ITeacherRepository, studentRepo: IStudentRepository) {
        this._logger = logger;
        this._teacherRepository = repo;
        this._studentRepository = studentRepo;
    }
    public async Handle (request: AddStudentsToTeacherRequest, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
        let count: number = 0;
        let errors: Error[] = [];
        let response: UseCaseResponseMessage;
        let teacher: Teacher | null = await this._teacherRepository.GetByEmail(request.Teacher.email);
        if (teacher !== null)
            try {
                request.Students.forEach(async i => {
                    if (await this._studentRepository.GetByEmail(i.email) !== null && teacher!.student.find(s => s.email == i.email) == null) {
                        this._logger.Log(LogLevels.debug, `Adding student: ${i.email} to teacher ${request.Teacher.email}`);
                        if (await this._teacherRepository.AddStudent(request.Teacher, i) && await this._studentRepository.AddTeacher(i, request.Teacher))
                            count++;
                    } else
                        errors.push(new Error("", `Failed to add student ${i.email} to teacher ${request.Teacher.email}`));
                });
                response = new UseCaseResponseMessage("", count == request.Students.length && !errors.length, `${count} students added successfully to teacher ${request.Teacher.email}!`, errors);
                outputPort.Handle(response);
                return response.Success;
            } catch (e) {
                if (typeof e === "string") {
                    errors.push(new Error("", e));
                    response = new UseCaseResponseMessage("", false, e, errors);
                } else {
                    errors.push(new Error("", JSON.stringify(e)));
                    response = new UseCaseResponseMessage("", false, "Exception!", errors);
                }
                outputPort.Handle(response);
                return false;
            }
        else {
            errors.push(new Error("", `Invalid Teacher ${request.Teacher.email}!`));
            response = new UseCaseResponseMessage("", false, `Invalid Teacher ${request.Teacher.email}!`, errors);
            return false;
        }
    }
}